// Middleware — runs on edge runtime.
//
// Two responsibilities:
//   1. Cheap cookie-presence gate on /ideas/:path* — no iron-session call
//      (edge runtime friction). Real guard is requireMember() in the layout.
//      If an attacker forges a cookie, middleware passes but the server
//      component redirects before any data is rendered.
//
//   2. Fail-closed rate limiting on /api/auth/* — 20 req/min per IP via Upstash.
//      Returns 503 if Upstash is unreachable (fail closed).

import { NextRequest, NextResponse } from "next/server";
import { checkAuthRateLimit } from "@/lib/rate-limit";

const SESSION_COOKIE = "__Host-medusa-session";

export const config = {
  matcher: [
    "/ideas/:path*",
    "/api/auth/:path*",
  ],
};

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  // -------------------------------------------------------------------------
  // Rate limit: /api/auth/* — fail closed
  // -------------------------------------------------------------------------
  if (pathname.startsWith("/api/auth/")) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "anonymous";

    const result = await checkAuthRateLimit(ip);

    if (!result.allowed) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": String(result.retryAfter ?? 60),
          "Content-Type": "text/plain",
        },
      });
    }
  }

  // -------------------------------------------------------------------------
  // Cookie presence gate: /ideas/:path*
  // -------------------------------------------------------------------------
  if (pathname.startsWith("/ideas")) {
    const hasSession = req.cookies.has(SESSION_COOKIE);
    if (!hasSession) {
      const loginUrl = new URL("/entrar", req.url);
      loginUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
