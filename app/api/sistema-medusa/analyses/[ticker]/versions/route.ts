// GET /api/sistema-medusa/analyses/[ticker]/versions

import { NextResponse } from "next/server";
import { requireMemberCore } from "@/lib/auth/require";
import {
  getAnalysisIdByTicker,
  listVersions,
} from "@/lib/sistema-medusa/queries";

const TICKER_REGEX = /^[A-Z0-9]{1,20}$/;

export async function GET(
  _req: Request,
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

  const analysisId = await getAnalysisIdByTicker(ticker);
  if (!analysisId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const versions = await listVersions(analysisId);
  return NextResponse.json({ data: versions });
}
