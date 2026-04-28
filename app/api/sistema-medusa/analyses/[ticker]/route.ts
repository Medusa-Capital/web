// GET /api/sistema-medusa/analyses/[ticker]?fields=public|member

import { NextResponse } from "next/server";
import { requireMemberCore } from "@/lib/auth/require";
import { getMemberView, getPublicView } from "@/lib/sistema-medusa/queries";
import { parseFieldsMode } from "../../_lib/fields";

const TICKER_REGEX = /^[A-Z0-9]{1,20}$/;

export async function GET(
  req: Request,
  ctx: { params: Promise<{ ticker: string }> }
): Promise<NextResponse> {
  const auth = await requireMemberCore();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ticker: raw } = await ctx.params;
  const ticker = raw.toUpperCase();
  if (!TICKER_REGEX.test(ticker)) {
    return NextResponse.json({ error: "Invalid ticker" }, { status: 400 });
  }

  const fields = parseFieldsMode(req);
  const data =
    fields === "public" ? await getPublicView(ticker) : await getMemberView(ticker);

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}
