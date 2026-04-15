// GET /api/auth/me
// Returns the current session data as JSON, or 401 if not authenticated.
// Useful for client components that need to read session state.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/auth/session";

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Return only safe fields — never expose sessionId or internal UUIDs to client
  return NextResponse.json({
    email: session.email,
    displayName: session.displayName,
    role: session.role,
    tiers: session.tiers,
  });
}
