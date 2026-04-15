// GET /api/ideas/similar?q=...
//
// Used by the propose-idea modal to show "have you seen these?" suggestions
// while the user types. Member-only. No HTTP cache — debounce is client-side.

import { NextRequest, NextResponse } from "next/server";
import { requireMemberCore } from "@/lib/auth/require";
import { findSimilarPosts, escapeIlike } from "@/lib/feedback/queries";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await requireMemberCore();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = req.nextUrl.searchParams.get("q") ?? "";
  const trimmed = raw.trim();
  if (trimmed.length < 3) {
    return NextResponse.json({ data: [] });
  }
  if (trimmed.length > 200) {
    return NextResponse.json({ error: "Query too long" }, { status: 400 });
  }

  const data = await findSimilarPosts(escapeIlike(trimmed));
  return NextResponse.json({ data });
}
