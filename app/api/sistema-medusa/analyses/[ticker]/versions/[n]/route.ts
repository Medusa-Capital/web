// GET /api/sistema-medusa/analyses/[ticker]/versions/[n]?fields=public|member

import { NextResponse } from "next/server";
import { requireMemberCore } from "@/lib/auth/require";
import {
  getMemberVersionView,
  getPublicVersionView,
} from "@/lib/sistema-medusa/queries";
import { parseFieldsMode } from "../../../../_lib/fields";

const TICKER_REGEX = /^[A-Z0-9]{1,20}$/;
const VERSION_REGEX = /^\d{1,4}$/;

export async function GET(
  req: Request,
  ctx: { params: Promise<{ ticker: string; n: string }> }
): Promise<NextResponse> {
  const auth = await requireMemberCore();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ticker: rawTicker, n } = await ctx.params;
  const ticker = rawTicker.toUpperCase();
  if (!TICKER_REGEX.test(ticker)) {
    return NextResponse.json({ error: "Invalid ticker" }, { status: 400 });
  }
  if (!VERSION_REGEX.test(n)) {
    return NextResponse.json({ error: "Invalid version" }, { status: 400 });
  }

  const versionNumber = Number.parseInt(n, 10);
  const fields = parseFieldsMode(req);
  const data =
    fields === "public"
      ? await getPublicVersionView(ticker, versionNumber)
      : await getMemberVersionView(ticker, versionNumber);

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}
