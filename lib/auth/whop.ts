// Whop OAuth 2.1 + PKCE client.
//
// Pre-flight verified values (2026-04-15):
//   OIDC discovery: https://api.whop.com/.well-known/openid-configuration
//   Issuer:         "https://api.whop.com" (no trailing slash)
//   JWKS URI:       https://api.whop.com/.well-known/jwks.json
//   Revoke:         POST https://api.whop.com/oauth/revoke
//                   body: client_id + client_secret (form-encoded)
//
// Nonce: listed in claims_supported — verified at first live smoke test.
// Fail-closed policy: if nonce claim is absent, we treat it as a hard failure.

import { createRemoteJWKSet, jwtVerify } from "jose";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const WHOP_ISSUER = "https://api.whop.com";
const WHOP_AUTHORIZE_URL = "https://api.whop.com/oauth/authorize";
const WHOP_TOKEN_URL = "https://api.whop.com/oauth/token";
const WHOP_USERINFO_URL = "https://api.whop.com/oauth/userinfo";
const WHOP_REVOKE_URL = "https://api.whop.com/oauth/revoke";
const WHOP_JWKS_URL = "https://api.whop.com/.well-known/jwks.json";

// Cached JWKS — jose reuses this across requests; the Set rotates keys lazily.
const jwks = createRemoteJWKSet(new URL(WHOP_JWKS_URL));

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`${name} environment variable is not set`);
  return val;
}

// ---------------------------------------------------------------------------
// PKCE helpers
// ---------------------------------------------------------------------------

/** Returns a random code_verifier (43-128 chars, URL-safe). */
export function generateCodeVerifier(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(48));
  return Buffer.from(bytes)
    .toString("base64url")
    .slice(0, 96); // 96 chars — well within 43-128 range
}

/** Derives S256 code_challenge from a code_verifier. */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoded = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Buffer.from(digest).toString("base64url");
}

/** Returns a cryptographically random opaque state string. */
export function generateState(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString(
    "base64url"
  );
}

/** Returns a cryptographically random nonce. */
export function generateNonce(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString(
    "base64url"
  );
}

// ---------------------------------------------------------------------------
// Authorize URL
// ---------------------------------------------------------------------------

export async function buildAuthorizeUrl(params: {
  codeVerifier: string;
  state: string;
  nonce: string;
  redirectUri: string;
}): Promise<string> {
  const challenge = await generateCodeChallenge(params.codeVerifier);

  const url = new URL(WHOP_AUTHORIZE_URL);
  url.searchParams.set("client_id", requireEnv("WHOP_CLIENT_ID"));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("scope", "openid profile email");
  url.searchParams.set("state", params.state);
  url.searchParams.set("nonce", params.nonce);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");

  return url.toString();
}

// ---------------------------------------------------------------------------
// Token exchange
// ---------------------------------------------------------------------------

const TokenResponseSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  expires_in: z.number().int().positive(),
  id_token: z.string().min(1),
  token_type: z.string().default("Bearer"),
});

export type TokenResponse = z.infer<typeof TokenResponseSchema>;

export async function exchangeCode(params: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: requireEnv("WHOP_CLIENT_ID"),
    client_secret: requireEnv("WHOP_CLIENT_SECRET"),
    code: params.code,
    code_verifier: params.codeVerifier,
    redirect_uri: params.redirectUri,
  });

  const res = await fetch(WHOP_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "(no body)");
    throw new Error(`Whop token exchange failed: ${res.status} — ${text}`);
  }

  const json = await res.json();
  return TokenResponseSchema.parse(json);
}

// ---------------------------------------------------------------------------
// id_token verification
// ---------------------------------------------------------------------------

const IdTokenPayloadSchema = z.object({
  sub: z.string().min(1),
  iss: z.string(),
  aud: z.union([z.string(), z.array(z.string())]),
  exp: z.number(),
  nonce: z.string().min(1), // fail-closed: must be present
});

export type IdTokenPayload = z.infer<typeof IdTokenPayloadSchema>;

/**
 * Verifies the id_token signature, issuer, audience, expiry, and nonce.
 * Throws on any verification failure — caller must treat all throws as hard
 * errors (do not issue session, do not proceed to userinfo).
 */
export async function verifyIdToken(params: {
  idToken: string;
  expectedNonce: string;
}): Promise<IdTokenPayload> {
  const { payload } = await jwtVerify(params.idToken, jwks, {
    issuer: WHOP_ISSUER,
    audience: requireEnv("WHOP_CLIENT_ID"),
  });

  // Zod validates nonce presence + type (fails closed if absent)
  const parsed = IdTokenPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(
      `id_token payload invalid: ${parsed.error.message}`
    );
  }

  if (parsed.data.nonce !== params.expectedNonce) {
    throw new Error("id_token nonce mismatch");
  }

  return parsed.data;
}

// ---------------------------------------------------------------------------
// Userinfo
// ---------------------------------------------------------------------------

const UserinfoSchema = z.object({
  sub: z.string().min(1),
  email: z.string().email().optional(),
  name: z.string().optional(),
  picture: z.string().url().optional().nullable(),
});

export type WhopUserinfo = z.infer<typeof UserinfoSchema>;

export async function fetchUserinfo(accessToken: string): Promise<WhopUserinfo> {
  const res = await fetch(WHOP_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "(no body)");
    throw new Error(`Whop userinfo failed: ${res.status} — ${text}`);
  }

  const json = await res.json();
  return UserinfoSchema.parse(json);
}

// ---------------------------------------------------------------------------
// Logout / token revocation
// ---------------------------------------------------------------------------

/**
 * Revokes a Whop refresh token (best-effort).
 * Per Whop docs: POST /oauth/revoke with client_id + client_secret in body.
 * On 4xx: log and swallow — revoking on logout is best-effort.
 * On network error: also swallow — session is destroyed server-side regardless.
 */
export async function revokeToken(refreshToken: string): Promise<void> {
  const body = new URLSearchParams({
    client_id: requireEnv("WHOP_CLIENT_ID"),
    client_secret: requireEnv("WHOP_CLIENT_SECRET"),
    token: refreshToken,
    token_type_hint: "refresh_token",
  });

  try {
    await fetch(WHOP_REVOKE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    // Intentionally ignore non-2xx — our session is destroyed regardless
  } catch {
    // Network error — swallow, session destroyed server-side
  }
}
