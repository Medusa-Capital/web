// GET /api/sistema-medusa/analyses?verdict=&category=&chain=&q=&sort=&offset=&fields=
//
// Internal read API. Member-cookie-gated only — MCP API-key auth is v2.

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireMemberCore } from "@/lib/auth/require";
import { listAnalyses } from "@/lib/sistema-medusa/queries";
import {
  CATEGORY_VALUES,
  CHAIN_VALUES,
  VERDICT_VALUES,
} from "@/lib/sistema-medusa/enum-values";
import { parseFieldsMode } from "../_lib/fields";

const querySchema = z.object({
  verdict: z.enum(VERDICT_VALUES).optional(),
  category: z.enum(CATEGORY_VALUES).optional(),
  chain: z.enum(CHAIN_VALUES).optional(),
  q: z.string().trim().min(1).max(200).optional(),
  sort: z.enum(["newest", "verdict", "ticker"]).default("newest"),
  offset: z.coerce.number().int().nonnegative().default(0),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export async function GET(req: Request): Promise<NextResponse> {
  const auth = await requireMemberCore();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const parsed = querySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { verdict, category, chain, q, sort, offset, limit } = parsed.data;
  const items = await listAnalyses({
    filters: { verdict, category, chain, q },
    sort,
    offset,
    limit,
  });

  parseFieldsMode(req);

  return NextResponse.json({ data: items });
}
