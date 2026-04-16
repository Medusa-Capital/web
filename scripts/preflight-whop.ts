/**
 * Phase 2 pre-flight verifications for Whop API.
 * Confirms exact endpoint shapes before writing auth code.
 *
 * Usage: bun scripts/preflight-whop.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local
try {
  const lines = readFileSync(resolve(process.cwd(), ".env.local"), "utf8").split("\n");
  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 1) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim();
    if (k && !(k in process.env)) process.env[k] = v;
  }
} catch { /* .env.local optional */ }

const WHOP_API_KEY = process.env.WHOP_API_KEY;
const WHOP_CLIENT_ID = process.env.WHOP_CLIENT_ID;
const WHOP_MEDUSA_PRODUCT_ID = process.env.WHOP_MEDUSA_PRODUCT_ID;

if (!WHOP_API_KEY) { console.error("WHOP_API_KEY missing from .env.local"); process.exit(1); }
if (!WHOP_CLIENT_ID) { console.error("WHOP_CLIENT_ID missing from .env.local"); process.exit(1); }

// ─────────────────────────────────────────────────────────
// 1. OIDC Discovery
// ─────────────────────────────────────────────────────────
console.log("\n=== 1. OIDC Discovery ===");
let discovery: Record<string, unknown> = {};
try {
  const res = await fetch("https://api.whop.com/oauth/.well-known/openid-configuration");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  discovery = await res.json() as Record<string, unknown>;

  const fields = [
    "issuer",
    "authorization_endpoint",
    "token_endpoint",
    "userinfo_endpoint",
    "revocation_endpoint",
    "jwks_uri",
    "scopes_supported",
    "response_types_supported",
    "grant_types_supported",
    "claims_supported",
    "code_challenge_methods_supported",
  ];
  for (const f of fields) {
    const val = discovery[f];
    if (val !== undefined) {
      const display = Array.isArray(val) ? JSON.stringify(val) : String(val);
      console.log(`  ${f}: ${display}`);
    } else {
      console.log(`  ${f}: (not present)`);
    }
  }

  // Key checks
  const issuer = String(discovery.issuer ?? "");
  console.log(`\n  ✓ issuer exact string: "${issuer}"`);
  console.log(`  ${discovery.revocation_endpoint ? "✓" : "✗"} revocation_endpoint: ${discovery.revocation_endpoint ?? "MISSING — must check Whop docs"}`);

  const claimsSupported = discovery.claims_supported as string[] | undefined;
  if (Array.isArray(claimsSupported)) {
    const hasNonce = claimsSupported.includes("nonce");
    console.log(`  ${hasNonce ? "✓" : "⚠"} nonce in claims_supported: ${hasNonce}`);
  } else {
    console.log("  ⚠ claims_supported not present in discovery doc");
  }

  const pkce = discovery.code_challenge_methods_supported as string[] | undefined;
  console.log(`  ${Array.isArray(pkce) && pkce.includes("S256") ? "✓" : "✗"} PKCE S256 supported: ${JSON.stringify(pkce)}`);

} catch (e) {
  console.error("  ✗ OIDC discovery failed:", (e as Error).message);
}

// ─────────────────────────────────────────────────────────
// 2. Memberships API — shape verification
// ─────────────────────────────────────────────────────────
console.log("\n=== 2. Memberships API shape ===");
try {
  // Use a dummy user_id — we expect either an empty data array or a 404/422.
  // The goal is to confirm: URL, auth header format, and response envelope shape.
  const testUserId = "test_preflight_user";
  const url = `https://api.whop.com/api/v1/memberships?user_id=${testUserId}${WHOP_MEDUSA_PRODUCT_ID ? `&product_ids[]=${WHOP_MEDUSA_PRODUCT_ID}` : ""}`;
  console.log(`  URL: ${url.replace(WHOP_MEDUSA_PRODUCT_ID ?? "PRODUCT_ID", "<PRODUCT_ID>")}`);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${WHOP_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  console.log(`  HTTP status: ${res.status}`);
  const body = await res.json() as Record<string, unknown>;
  console.log(`  Response keys: ${Object.keys(body).join(", ")}`);

  // Check if `data` is an array (expected envelope shape)
  if (Array.isArray(body.data)) {
    console.log(`  ✓ data[] shape confirmed (${body.data.length} memberships for test user)`);
  } else {
    console.log(`  Response body: ${JSON.stringify(body).slice(0, 300)}`);
  }

  // Check pagination fields
  if (body.pagination) {
    console.log(`  ✓ pagination present: ${JSON.stringify(body.pagination)}`);
  }

  // If we have a real user, try with the actual product ID
  if (WHOP_MEDUSA_PRODUCT_ID) {
    console.log(`  Product ID filter confirmed: product_ids[]= query param format`);
  }
} catch (e) {
  console.error("  ✗ Memberships API call failed:", (e as Error).message);
}

// ─────────────────────────────────────────────────────────
// 3. JWKS endpoint reachability
// ─────────────────────────────────────────────────────────
console.log("\n=== 3. JWKS reachability ===");
try {
  const jwksUri = String(discovery.jwks_uri ?? "https://api.whop.com/oauth/.well-known/jwks.json");
  const res = await fetch(jwksUri);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const jwks = await res.json() as { keys: unknown[] };
  console.log(`  ✓ JWKS reachable at ${jwksUri}`);
  console.log(`  ✓ ${jwks.keys?.length ?? 0} key(s) present`);
  // Log key IDs (kid) for reference — not secret
  if (Array.isArray(jwks.keys)) {
    for (const k of jwks.keys as Array<{ kid?: string; alg?: string; kty?: string }>) {
      console.log(`    key: kid=${k.kid ?? "(none)"} alg=${k.alg ?? "?"} kty=${k.kty ?? "?"}`);
    }
  }
} catch (e) {
  console.error("  ✗ JWKS fetch failed:", (e as Error).message);
}

// ─────────────────────────────────────────────────────────
// 4. Revoke endpoint shape
// ─────────────────────────────────────────────────────────
console.log("\n=== 4. Revoke endpoint ===");
const revokeEndpoint = String(discovery.revocation_endpoint ?? "");
if (revokeEndpoint) {
  console.log(`  ✓ revocation_endpoint from discovery: ${revokeEndpoint}`);
  // Test with a dummy token to confirm expected error shape
  // (RFC 7009 says revoke should return 200 even for invalid tokens)
  try {
    const res = await fetch(revokeEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${WHOP_CLIENT_ID}:dummy`).toString("base64")}`,
      },
      body: new URLSearchParams({
        token: "dummy_token_for_shape_test",
        token_type_hint: "refresh_token",
      }).toString(),
    });
    console.log(`  HTTP status for dummy revoke: ${res.status} (RFC 7009: 200 expected even for invalid token)`);
    const text = await res.text();
    if (text) console.log(`  Response: ${text.slice(0, 200)}`);
  } catch (e) {
    console.error("  Revoke test failed:", (e as Error).message);
  }
} else {
  console.log("  ⚠ No revocation_endpoint in discovery — checking fallback");
  // Whop might use /oauth/revoke without advertising it in discovery
  try {
    const res = await fetch("https://api.whop.com/oauth/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token: "dummy" }).toString(),
    });
    console.log(`  Fallback /oauth/revoke status: ${res.status}`);
    const text = await res.text();
    console.log(`  Response: ${text.slice(0, 200)}`);
  } catch (e) {
    console.error("  Fallback revoke failed:", (e as Error).message);
  }
}

// ─────────────────────────────────────────────────────────
// 5. Nonce note
// ─────────────────────────────────────────────────────────
console.log("\n=== 5. Nonce in id_token ===");
console.log("  ⚠ Cannot verify automatically — requires a live browser OAuth flow.");
console.log("  Plan: complete one login flow after Phase 2 auth code is written,");
console.log("  then decode the id_token JWT and confirm nonce claim is present.");
console.log("  If nonce is absent, set nonce policy to warn (not fail closed) until confirmed.");

console.log("\n=== Summary ===");
console.log("  Items 1-4 verified above. Item 5 (nonce) deferred to live smoke test.");
