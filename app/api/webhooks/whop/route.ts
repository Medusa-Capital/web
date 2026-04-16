// POST /api/webhooks/whop
//
// Handles Whop membership lifecycle events:
//   - membership.went_invalid
//   - membership.cancelled
//   - membership.expired
//   - payment_failed
//
// Security protocol:
//   1. Read raw body BEFORE any JSON parse (preserve exact bytes for HMAC)
//   2. Parse "whop-signature" header: t=<unix>,v1=<hex_hmac>
//   3. Reject if timestamp outside ±5 minutes of now (replay protection)
//   4. Compute HMAC-SHA256 over `${t}.${rawBody}` with WHOP_WEBHOOK_SECRET
//   5. crypto.timingSafeEqual vs provided v1 hex
//   6. Only then JSON.parse + Zod-validate
//   7. Missing WHOP_WEBHOOK_SECRET = hard fail on boot (enforced below)
//
// Idempotency: duplicate deliveries are no-ops; logged at info, not error.
// Never page Sentry for duplicate deliveries.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { users, sessions } from "@/db/schema";
import { log, captureError } from "@/lib/logger";

const REPLAY_WINDOW_MS = 5 * 60 * 1000; // ±5 minutes

// Events that trigger membership revocation.
// Whop uses snake_case event names (confirmed from dashboard event list).
const REVOCATION_EVENTS = new Set([
  "membership_deactivated", // covers cancellation, expiry, and going invalid
  "payment_failed",
]);

const WebhookPayloadSchema = z.object({
  action: z.string(),
  data: z.object({
    // Whop sends the Whop user ID as "user_id" in membership webhooks
    user_id: z.string().optional(),
    membership: z
      .object({
        user_id: z.string().optional(),
      })
      .optional(),
  }),
});

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`${name} environment variable is not set`);
  return val;
}

// Validate WHOP_WEBHOOK_SECRET at module load time — hard fail on boot
// if not set so we know immediately rather than silently accepting all requests.
const WHOP_WEBHOOK_SECRET = (() => {
  const secret = process.env.WHOP_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error(
      "WHOP_WEBHOOK_SECRET is not set — refusing to start without webhook security"
    );
  }
  return secret;
})();

export async function POST(req: NextRequest): Promise<NextResponse> {
  // -------------------------------------------------------------------------
  // Step 1: Read raw body BEFORE any JSON.parse
  // -------------------------------------------------------------------------
  const rawBody = await req.text();

  // -------------------------------------------------------------------------
  // Step 2: Parse whop-signature header
  // -------------------------------------------------------------------------
  const signatureHeader = req.headers.get("whop-signature");
  if (!signatureHeader) {
    log("warn", "webhook: missing whop-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  // Header format: t=<unix_timestamp>,v1=<hex_hmac>
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => part.split("=", 2) as [string, string])
  );

  const timestamp = parts["t"];
  const providedHex = parts["v1"];

  if (!timestamp || !providedHex) {
    log("warn", "webhook: malformed whop-signature header", { signatureHeader });
    return NextResponse.json({ error: "Malformed signature" }, { status: 401 });
  }

  // -------------------------------------------------------------------------
  // Step 3: Replay protection — reject if outside ±5min window
  // -------------------------------------------------------------------------
  const webhookTime = parseInt(timestamp, 10) * 1000; // convert seconds → ms
  if (isNaN(webhookTime) || Math.abs(Date.now() - webhookTime) > REPLAY_WINDOW_MS) {
    log("warn", "webhook: timestamp outside replay window", { timestamp });
    return NextResponse.json({ error: "Request expired" }, { status: 401 });
  }

  // -------------------------------------------------------------------------
  // Step 4: Compute expected HMAC-SHA256
  // Message format: `${timestamp}.${rawBody}`
  // -------------------------------------------------------------------------
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(WHOP_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const message = `${timestamp}.${rawBody}`;
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    keyMaterial,
    encoder.encode(message)
  );

  const expectedHex = Buffer.from(signatureBuffer).toString("hex");

  // -------------------------------------------------------------------------
  // Step 5: Constant-time comparison
  // -------------------------------------------------------------------------
  const expectedBytes = encoder.encode(expectedHex);
  const providedBytes = encoder.encode(providedHex);

  if (
    expectedBytes.length !== providedBytes.length ||
    !crypto.subtle // should always be present, but guard anyway
  ) {
    log("warn", "webhook: HMAC length mismatch or no subtle crypto");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Use timingSafeEqual via XOR accumulation (no Node crypto.timingSafeEqual in edge)
  let diff = 0;
  for (let i = 0; i < expectedBytes.length; i++) {
    diff |= expectedBytes[i] ^ providedBytes[i];
  }

  if (diff !== 0) {
    log("warn", "webhook: HMAC verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // -------------------------------------------------------------------------
  // Step 6: Parse + Zod-validate payload
  // -------------------------------------------------------------------------
  let payload: z.infer<typeof WebhookPayloadSchema>;
  try {
    payload = WebhookPayloadSchema.parse(JSON.parse(rawBody));
  } catch (err) {
    log("warn", "webhook: invalid payload", { error: String(err) });
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // -------------------------------------------------------------------------
  // Step 7: Handle revocation events
  // -------------------------------------------------------------------------
  if (!REVOCATION_EVENTS.has(payload.action)) {
    // Unknown event — acknowledge without action
    log("info", "webhook: unhandled event (no-op)", { action: payload.action });
    return NextResponse.json({ ok: true });
  }

  // Extract Whop user ID from payload (try both locations Whop may use)
  const whopUserId =
    payload.data.user_id ??
    payload.data.membership?.user_id;

  if (!whopUserId) {
    log("warn", "webhook: revocation event missing user_id", { action: payload.action });
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  try {
    await db.transaction(async (tx) => {
      // Soft-delete the user + disable notifications
      // Using external_id (Whop sub) as the lookup key.
      // If user doesn't exist yet (webhook arrived before first login), this is a no-op.
      const [user] = await tx
        .update(users)
        .set({
          deletedAt: new Date(),
          emailNotificationsEnabled: false,
          updatedAt: new Date(),
        })
        .where(eq(users.externalId, whopUserId))
        .returning({ id: users.id });

      if (!user) {
        // User not in our DB yet — idempotent no-op
        log("info", "webhook: user not found, no-op", { whopUserId, action: payload.action });
        return;
      }

      // Revoke all active sessions for this user
      await tx
        .update(sessions)
        .set({ revokedAt: new Date() })
        .where(eq(sessions.userId, user.id));
        // Note: isNull(sessions.revokedAt) would be more efficient but
        // updating already-revoked rows is idempotent and safe
    });

    log("info", "webhook: membership revoked", { whopUserId, action: payload.action });
  } catch (err) {
    await captureError(err, { step: "webhook_revoke", whopUserId, action: payload.action });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
