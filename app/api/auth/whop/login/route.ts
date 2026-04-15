// GET /api/auth/whop/login
//
// 1. Generate PKCE code_verifier, state, nonce
// 2. Seal them into a short-lived httpOnly cookie
// 3. Redirect to Whop's /oauth/authorize

import { NextRequest, NextResponse } from "next/server";
import { sealData } from "iron-session";
import {
  generateCodeVerifier,
  generateState,
  generateNonce,
  buildAuthorizeUrl,
} from "@/lib/auth/whop";
import { sanitizeReturnTo } from "@/lib/auth/return-to";

const OAUTH_FLOW_COOKIE = "__Host-medusa-oauth-flow";
const OAUTH_FLOW_TTL = 600; // 10 minutes

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`${name} environment variable is not set`);
  return val;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const appOrigin = requireEnv("NEXT_PUBLIC_APP_URL");
  const callbackUrl = `${appOrigin}/api/auth/whop/callback`;

  // Capture a safe returnTo before generating PKCE material
  const rawReturnTo = req.nextUrl.searchParams.get("returnTo");
  const returnTo = sanitizeReturnTo(rawReturnTo, appOrigin);

  const codeVerifier = generateCodeVerifier();
  const state = generateState();
  const nonce = generateNonce();

  const sealed = await sealData(
    { codeVerifier, state, nonce, returnTo },
    {
      password: requireEnv("SESSION_SECRET"),
      ttl: OAUTH_FLOW_TTL,
    }
  );

  const authorizeUrl = await buildAuthorizeUrl({
    codeVerifier,
    state,
    nonce,
    redirectUri: callbackUrl,
  });

  const response = NextResponse.redirect(authorizeUrl);

  response.cookies.set(OAUTH_FLOW_COOKIE, sealed, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: OAUTH_FLOW_TTL,
  });

  return response;
}
