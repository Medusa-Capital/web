// Middleware — runs on edge runtime.
//
// Responsibility: cheap cookie-presence gate on /ideas/:path*
//
// No iron-session call here (edge runtime friction). Real auth guard is
// requireMember() in app/ideas/layout.tsx. If an attacker forges a cookie,
// middleware passes but the server component redirects before any data renders.
//
// Rate limiting (deferred):
//   When traffic warrants it, add Upstash Ratelimit here:
//   - /api/auth/*  → 20 req/min per IP, fail-closed (return 503 if Upstash unreachable)
//   - Server actions (createPost, addComment) → 30 req/min per user
//   Packages already in the Upstash ecosystem: @upstash/ratelimit, @upstash/redis
//   Env vars needed: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
//   Vercel Pro alternative: built-in rate limiting at the edge (no extra dep)

import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "__Host-medusa-session";

export const config = {
  matcher: ["/ideas/:path*"],
};

export function middleware(req: NextRequest): NextResponse {
  const hasSession = req.cookies.has(SESSION_COOKIE);
  if (!hasSession) {
    const loginUrl = new URL("/entrar", req.url);
    loginUrl.searchParams.set("returnTo", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
