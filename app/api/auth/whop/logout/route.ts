// POST /api/auth/whop/logout
//
// 1. Read session (get sessionId + refresh token for revocation)
// 2. Mark session revoked in DB
// 3. Best-effort revoke refresh token at Whop (ignore 4xx/network errors)
// 4. Destroy iron-session cookie
// 5. Redirect to /login

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sessions, userTokens } from "@/db/schema";
import { sessionOptions, type SessionData } from "@/lib/auth/session";
import { revokeToken } from "@/lib/auth/whop";
import { decrypt } from "@/lib/auth/tokens";
import { captureError } from "@/lib/logger";

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`${name} environment variable is not set`);
  return val;
}

export async function POST(_req: NextRequest): Promise<NextResponse> {
  const appOrigin = requireEnv("NEXT_PUBLIC_APP_URL");

  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (session.sessionId) {
    // Revoke session in DB
    try {
      await db
        .update(sessions)
        .set({ revokedAt: new Date() })
        .where(eq(sessions.id, session.sessionId));
    } catch (err) {
      await captureError(err, { step: "logout_db_revoke" });
      // Continue — destroy cookie regardless
    }

    // Best-effort: fetch + revoke the refresh token from Whop
    // We ignore any errors here; the local session is destroyed either way.
    try {
      const [tokenRow] = await db
        .select({ refreshToken: userTokens.refreshToken })
        .from(userTokens)
        .where(eq(userTokens.sessionId, session.sessionId))
        .limit(1);

      if (tokenRow) {
        const refreshToken = await decrypt(tokenRow.refreshToken);
        await revokeToken(refreshToken);
      }
    } catch {
      // Swallow — best-effort; local session is primary
    }
  }

  // Destroy the iron-session cookie
  session.destroy();
  await session.save();

  // 303 converts the POST → GET on the follow-up request (otherwise the
  // browser re-POSTs to /login, which is a page and returns 405).
  return NextResponse.redirect(new URL("/login", appOrigin), 303);
}
