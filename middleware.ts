// Middleware — runs on edge runtime.
//
// Responsibilities:
// 1. Cheap cookie-presence gate on /ideas/:path* and /sistema-medusa/:path*.
// 2. x-pathname header injection so server components can build returnTo for
//    layout-level requireMember() lazy-recheck failures.
//
// No iron-session call here (edge runtime friction). Real auth guard is
// requireMember() in the route layout. If an attacker forges the cookie,
// middleware passes but the layout redirects before any data renders.
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
const VERSION_QUERY = /^\d{1,4}$/;

export const config = {
  matcher: ["/ideas/:path*", "/sistema-medusa/:path*"],
};

export function middleware(req: NextRequest): NextResponse {
  const skipAuth = process.env.SKIP_AUTH === "true";
  const hasSession = req.cookies.has(SESSION_COOKIE);
  if (!skipAuth && !hasSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("returnTo", buildReturnTo(req));
    return NextResponse.redirect(loginUrl);
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", buildReturnTo(req));
  return NextResponse.next({ request: { headers: requestHeaders } });
}

function buildReturnTo(req: NextRequest): string {
  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith("/sistema-medusa/")) {
    const v = req.nextUrl.searchParams.get("v");
    if (v && VERSION_QUERY.test(v)) {
      return `${pathname}?v=${v}`;
    }
  }
  return pathname;
}
