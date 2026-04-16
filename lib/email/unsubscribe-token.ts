// HMAC-signed unsubscribe tokens.
//
// Token shape: <userId>.<base64url(hmac(userId))>
// Verifier reconstructs the HMAC and compares constant-time.
// The token is bound to userId so a forged or shared link can't unsubscribe
// someone else. SESSION_SECRET is reused (HKDF-derived for separation).

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`${name} environment variable is not set`);
  return val;
}

const HKDF_INFO = new TextEncoder().encode("medusa.unsubscribe.v1");

async function getKey(): Promise<CryptoKey> {
  const secret = requireEnv("SESSION_SECRET");
  const ikm = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    "HKDF",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(), info: HKDF_INFO },
    ikm,
    256
  );
  return crypto.subtle.importKey(
    "raw",
    bits,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function base64UrlEncode(buf: ArrayBuffer): string {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

export async function signUnsubscribeToken(userId: string): Promise<string> {
  const key = await getKey();
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(userId)
  );
  return `${userId}.${base64UrlEncode(sig)}`;
}

export async function verifyUnsubscribeToken(
  token: string
): Promise<string | null> {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;

  const userId = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);
  if (!userId || !sigB64) return null;

  const key = await getKey();
  let sig: ArrayBuffer;
  try {
    const buf = base64UrlDecode(sigB64);
    sig = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  } catch {
    return null;
  }

  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    sig,
    new TextEncoder().encode(userId)
  );
  return valid ? userId : null;
}

export async function buildUnsubscribeUrl(userId: string): Promise<string> {
  const origin = requireEnv("NEXT_PUBLIC_APP_URL");
  const token = await signUnsubscribeToken(userId);
  return `${origin}/api/unsubscribe?token=${encodeURIComponent(token)}`;
}
