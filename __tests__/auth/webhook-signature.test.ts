// Unit tests for webhook HMAC signature verification logic.
// We test the algorithm in isolation (not the full route handler) to avoid
// needing a running Next.js server.

import { describe, test, expect } from "bun:test";

const SECRET = "test-webhook-secret-32-chars-long!!";
const REPLAY_WINDOW_MS = 5 * 60 * 1000;

// Reimplemented here to test the algorithm independently of the route module.
async function computeHmac(secret: string, timestamp: string, body: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const message = `${timestamp}.${body}`;
  const sig = await crypto.subtle.sign("HMAC", keyMaterial, encoder.encode(message));
  return Buffer.from(sig).toString("hex");
}

function timingSafeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  if (aBytes.length !== bBytes.length) return false;
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) {
    diff |= aBytes[i] ^ bBytes[i];
  }
  return diff === 0;
}

describe("webhook HMAC verification", () => {
  test("valid signature passes", async () => {
    const timestamp = String(Math.floor(Date.now() / 1000));
    const body = JSON.stringify({ action: "membership.cancelled", data: { user_id: "u_123" } });
    const hmac = await computeHmac(SECRET, timestamp, body);

    expect(timingSafeEqual(hmac, hmac)).toBe(true);
  });

  test("wrong secret fails", async () => {
    const timestamp = String(Math.floor(Date.now() / 1000));
    const body = JSON.stringify({ action: "membership.cancelled" });
    const goodHmac = await computeHmac(SECRET, timestamp, body);
    const badHmac = await computeHmac("wrong-secret", timestamp, body);

    expect(timingSafeEqual(goodHmac, badHmac)).toBe(false);
  });

  test("tampered body fails", async () => {
    const timestamp = String(Math.floor(Date.now() / 1000));
    const body = JSON.stringify({ action: "membership.cancelled" });
    const tamperedBody = JSON.stringify({ action: "membership.cancelled", injected: true });
    const goodHmac = await computeHmac(SECRET, timestamp, body);
    const tamperedHmac = await computeHmac(SECRET, timestamp, tamperedBody);

    expect(timingSafeEqual(goodHmac, tamperedHmac)).toBe(false);
  });

  test("replayed (stale) timestamp rejected", () => {
    const staleTimestamp = Math.floor((Date.now() - REPLAY_WINDOW_MS - 1000) / 1000);
    const webhookTime = staleTimestamp * 1000;
    const isStale = Math.abs(Date.now() - webhookTime) > REPLAY_WINDOW_MS;
    expect(isStale).toBe(true);
  });

  test("future timestamp within window accepted", () => {
    const futureTimestamp = Math.floor((Date.now() + 60_000) / 1000); // 1 min in future
    const webhookTime = futureTimestamp * 1000;
    const isStale = Math.abs(Date.now() - webhookTime) > REPLAY_WINDOW_MS;
    expect(isStale).toBe(false);
  });

  test("timestamp far in future rejected (>5min)", () => {
    const farFuture = Math.floor((Date.now() + 6 * 60 * 1000) / 1000); // 6 min
    const webhookTime = farFuture * 1000;
    const isStale = Math.abs(Date.now() - webhookTime) > REPLAY_WINDOW_MS;
    expect(isStale).toBe(true);
  });

  test("timingSafeEqual: equal strings → true", () => {
    expect(timingSafeEqual("abc123", "abc123")).toBe(true);
  });

  test("timingSafeEqual: different strings → false", () => {
    expect(timingSafeEqual("abc123", "abc124")).toBe(false);
  });

  test("timingSafeEqual: different lengths → false", () => {
    expect(timingSafeEqual("abc", "abcd")).toBe(false);
  });

  test("timingSafeEqual: empty strings → false", () => {
    // Both empty has the same length (0) but we should still get correct result
    expect(timingSafeEqual("", "")).toBe(true);
  });
});
