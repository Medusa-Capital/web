// GET /api/auth/whop/login
//
// 1. Generate PKCE code_verifier + nonce
// 2. Seal {codeVerifier, nonce, returnTo} into the OAuth `state` param
// 3. Redirect to Whop's /oauth/authorize
//
// Why state-encoded (not cookie-stored) flow data:
//   Chrome/Chromium silently drops our __Host- prefixed flow cookie on the
//   return trip from Whop (even with SameSite=None; Secure). Embedding the
//   flow data inside the signed `state` param removes the cross-site cookie
//   dependency entirely — Whop round-trips `state` back to us verbatim.
//
// CSRF note: the sealed state is unguessable (HMAC-authenticated with
// SESSION_SECRET), so it still serves its CSRF role. A login-CSRF attacker
// would need to trick a user into submitting an attacker-crafted callback URL;
// that's a known limitation of cookieless OAuth. Accepted for a members-only
// site with <200 users. Revisit if the threat model changes.

import { NextRequest, NextResponse } from "next/server";
import { sealData } from "iron-session";
import {
  generateCodeVerifier,
  generateNonce,
  buildAuthorizeUrl,
} from "@/lib/auth/whop";
import { sanitizeReturnTo } from "@/lib/auth/return-to";

const OAUTH_STATE_TTL = 600; // 10 minutes

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`${name} environment variable is not set`);
  return val;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const appOrigin = requireEnv("NEXT_PUBLIC_APP_URL");
  const callbackUrl = `${appOrigin}/api/auth/whop/callback`;

  const rawReturnTo = req.nextUrl.searchParams.get("returnTo");
  const returnTo = sanitizeReturnTo(rawReturnTo, appOrigin);

  const codeVerifier = generateCodeVerifier();
  const nonce = generateNonce();

  const state = await sealData(
    { codeVerifier, nonce, returnTo },
    {
      password: requireEnv("SESSION_SECRET"),
      ttl: OAUTH_STATE_TTL,
    }
  );

  const authorizeUrl = await buildAuthorizeUrl({
    codeVerifier,
    state,
    nonce,
    redirectUri: callbackUrl,
  });

  return NextResponse.redirect(authorizeUrl);
}
