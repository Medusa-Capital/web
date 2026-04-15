// GET /api/auth/whop/callback
//
// Full branch coverage:
//   ?error=...          → clear cookie, redirect /entrar?error=canceled
//   token exchange fail → log Sentry, clear cookie, redirect /entrar?error=retry
//   id_token bad/nonce  → fail closed (same as exchange fail)
//   email missing       → redirect /entrar?error=no-email
//   non-member          → redirect /no-miembro
//   happy path          → DB upsert, iron-session, redirect returnTo

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { unsealData, getIronSession } from "iron-session";
import { z } from "zod";
import { db } from "@/db";
import { users, sessions, userTokens } from "@/db/schema";
import { sessionOptions, type SessionData } from "@/lib/auth/session";
import {
  exchangeCode,
  verifyIdToken,
  fetchUserinfo,
} from "@/lib/auth/whop";
import { verifyMembership } from "@/lib/auth/membership";
import { deriveTiers } from "@/lib/auth/tiers";
import { encrypt } from "@/lib/auth/tokens";
import { sanitizeReturnTo } from "@/lib/auth/return-to";
import { captureError } from "@/lib/logger";

const OAUTH_FLOW_COOKIE = "__Host-medusa-oauth-flow";

// Sealed flow data shape
const FlowDataSchema = z.object({
  codeVerifier: z.string().min(1),
  state: z.string().min(1),
  nonce: z.string().min(1),
  returnTo: z.string(),
});

// Query param shapes
const CodeCallbackSchema = z.object({
  code: z.string().min(1),
  state: z.string().min(1),
});

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`${name} environment variable is not set`);
  return val;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const appOrigin = requireEnv("NEXT_PUBLIC_APP_URL");
  const sessionSecret = requireEnv("SESSION_SECRET");

  // -------------------------------------------------------------------------
  // Step 1: Unseal the PKCE flow cookie — must happen before any redirect
  // -------------------------------------------------------------------------
  const sealedFlow = req.cookies.get(OAUTH_FLOW_COOKIE)?.value;

  const clearFlowCookie = (res: NextResponse): NextResponse => {
    res.cookies.delete(OAUTH_FLOW_COOKIE);
    return res;
  };

  if (!sealedFlow) {
    return clearFlowCookie(
      NextResponse.redirect(new URL("/entrar?error=retry", appOrigin))
    );
  }

  let flowData: z.infer<typeof FlowDataSchema>;
  try {
    const raw = await unsealData(sealedFlow, { password: sessionSecret });
    flowData = FlowDataSchema.parse(raw);
  } catch {
    return clearFlowCookie(
      NextResponse.redirect(new URL("/entrar?error=retry", appOrigin))
    );
  }

  // -------------------------------------------------------------------------
  // Step 2: Detect error callback (user canceled consent)
  // -------------------------------------------------------------------------
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());

  if (params.error) {
    // User canceled OAuth or provider returned an error — always redirect to
    // canceled page regardless of state match (don't leak info via timing).
    return clearFlowCookie(
      NextResponse.redirect(new URL("/entrar?error=canceled", appOrigin))
    );
  }

  // -------------------------------------------------------------------------
  // Step 3: Validate code + state (constant-time state comparison)
  // -------------------------------------------------------------------------
  const codeParsed = CodeCallbackSchema.safeParse(params);
  if (!codeParsed.success) {
    return clearFlowCookie(
      NextResponse.redirect(new URL("/entrar?error=retry", appOrigin))
    );
  }

  const { code, state } = codeParsed.data;

  if (!timingSafeEqual(state, flowData.state)) {
    return clearFlowCookie(
      NextResponse.redirect(new URL("/entrar?error=retry", appOrigin))
    );
  }

  // -------------------------------------------------------------------------
  // Step 4: Exchange code for tokens
  // -------------------------------------------------------------------------
  let tokenResponse;
  try {
    tokenResponse = await exchangeCode({
      code,
      codeVerifier: flowData.codeVerifier,
      redirectUri: `${appOrigin}/api/auth/whop/callback`,
    });
  } catch (err) {
    await captureError(err, { step: "token_exchange" });
    return clearFlowCookie(
      NextResponse.redirect(new URL("/entrar?error=retry", appOrigin))
    );
  }

  // -------------------------------------------------------------------------
  // Step 5: Verify id_token (signature, issuer, audience, expiry, nonce)
  // -------------------------------------------------------------------------
  let idTokenPayload;
  try {
    idTokenPayload = await verifyIdToken({
      idToken: tokenResponse.id_token,
      expectedNonce: flowData.nonce,
    });
  } catch (err) {
    await captureError(err, { step: "id_token_verify" });
    return clearFlowCookie(
      NextResponse.redirect(new URL("/entrar?error=retry", appOrigin))
    );
  }

  // -------------------------------------------------------------------------
  // Step 6: Fetch userinfo (email, name, avatar)
  // -------------------------------------------------------------------------
  let userinfo;
  try {
    userinfo = await fetchUserinfo(tokenResponse.access_token);
  } catch (err) {
    await captureError(err, { step: "userinfo_fetch" });
    return clearFlowCookie(
      NextResponse.redirect(new URL("/entrar?error=retry", appOrigin))
    );
  }

  if (!userinfo.email) {
    return clearFlowCookie(
      NextResponse.redirect(new URL("/entrar?error=no-email", appOrigin))
    );
  }

  // -------------------------------------------------------------------------
  // Step 7: Verify Whop membership
  // -------------------------------------------------------------------------
  let membership;
  try {
    membership = await verifyMembership(idTokenPayload.sub);
  } catch (err) {
    await captureError(err, { step: "membership_verify" });
    return clearFlowCookie(
      NextResponse.redirect(new URL("/entrar?error=retry", appOrigin))
    );
  }

  if (!membership.isActive) {
    return clearFlowCookie(
      NextResponse.redirect(new URL("/no-miembro", appOrigin))
    );
  }

  // -------------------------------------------------------------------------
  // Step 8: Upsert user + insert session + insert tokens (transaction)
  // -------------------------------------------------------------------------
  const tiers = deriveTiers(membership.productIds);
  const displayName = toTitleCase(userinfo.name ?? null);
  const whopSub = idTokenPayload.sub;

  const [encryptedAccess, encryptedRefresh] = await Promise.all([
    encrypt(tokenResponse.access_token),
    encrypt(tokenResponse.refresh_token),
  ]);
  const accessTokenExpiresAt = new Date(
    Date.now() + tokenResponse.expires_in * 1000
  );

  let dbResult: { userId: string; sessionId: string; role: "member" | "internal" };
  try {
    dbResult = await db.transaction(async (tx) => {
      // Upsert user — reactivates soft-deleted users (sets deleted_at=null)
      const [upsertedUser] = await tx
        .insert(users)
        .values({
          externalId: whopSub,
          provider: "whop",
          email: userinfo.email!,
          displayName,
          avatarUrl: userinfo.picture ?? null,
          tiers,
          deletedAt: null,
        })
        .onConflictDoUpdate({
          target: [users.externalId, users.provider],
          set: {
            email: userinfo.email!,
            displayName,
            avatarUrl: userinfo.picture ?? null,
            tiers,
            deletedAt: null,
            updatedAt: new Date(),
          },
        })
        .returning({ id: users.id, role: users.role });

      if (!upsertedUser) throw new Error("User upsert returned no row");

      // Always create a fresh session — never reuse old ones
      const [newSession] = await tx
        .insert(sessions)
        .values({ userId: upsertedUser.id })
        .returning({ id: sessions.id });

      if (!newSession) throw new Error("Session insert returned no row");

      // Store encrypted tokens (reserved for future Whop-as-user API calls)
      await tx.insert(userTokens).values({
        sessionId: newSession.id,
        accessToken: encryptedAccess,
        refreshToken: encryptedRefresh,
        accessTokenExpiresAt,
      });

      return {
        userId: upsertedUser.id,
        sessionId: newSession.id,
        role: upsertedUser.role,
      };
    });
  } catch (err) {
    await captureError(err, { step: "db_upsert" });
    return clearFlowCookie(
      NextResponse.redirect(new URL("/entrar?error=retry", appOrigin))
    );
  }

  // -------------------------------------------------------------------------
  // Step 9: Write iron-session cookie
  // iron-session v8 with App Router: use cookies() from next/headers.
  // next/headers cookie writes are committed to the current response context.
  // -------------------------------------------------------------------------
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    session.userId = dbResult.userId;
    session.sessionId = dbResult.sessionId;
    session.externalId = whopSub;
    session.provider = "whop";
    session.email = userinfo.email!;
    session.displayName = displayName;
    session.role = dbResult.role;
    session.tiers = tiers;
    session.membershipCheckedAt = Date.now();

    await session.save();
  } catch (err) {
    await captureError(err, { step: "session_write" });
    return clearFlowCookie(
      NextResponse.redirect(new URL("/entrar?error=retry", appOrigin))
    );
  }

  // -------------------------------------------------------------------------
  // Step 10: Redirect to returnTo (safe, allowlisted)
  // -------------------------------------------------------------------------
  const returnTo = sanitizeReturnTo(flowData.returnTo, appOrigin);
  const response = NextResponse.redirect(new URL(returnTo, appOrigin));
  response.cookies.delete(OAUTH_FLOW_COOKIE);
  return response;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Constant-time string comparison to prevent timing attacks on state checks.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) {
    // Still iterate to avoid length-based timing leak, then return false
    if (a && b) {
      const len = Math.max(a.length, b.length);
      let acc = 0;
      for (let i = 0; i < len; i++) {
        acc |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
      }
    }
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/** Title-case a display name: "juan carlos" → "Juan Carlos" */
function toTitleCase(name: string | null): string | null {
  if (!name) return null;
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}
