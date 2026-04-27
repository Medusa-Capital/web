import { createHash } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";
import { eq } from "drizzle-orm";
import { analysisSchema, type Analysis } from "@/lib/sistema-medusa/schemas";

type RawMetric = {
  metric: string;
  value: string;
  source_url: string;
};

type RawFilter = {
  name: string;
  status: "VERDE" | "AMARILLO" | "ROJO";
  justification: string;
  key_metric: string;
  metric_source: string;
};

type RawPillar = {
  name: string;
  status: "VERDE" | "AMARILLO" | "ROJO" | "NO_VERIFICABLE";
  analysis: string;
  key_metrics: RawMetric[];
};

type RawAeroInput = {
  metadata: {
    ticker: string;
    project_name: string;
    contract_address: string | null;
    chain: Analysis["chain"];
    category: Analysis["category"];
    tags: string[];
    analysis_date: string;
    system_version: string;
    analyst: string;
    verdict: Analysis["verdict"];
    verdict_summary: string;
  };
  base_data: Analysis["base_data"];
  discard_filters: {
    filter_01_inflationary: RawFilter;
    filter_02_equity_token_duality: RawFilter;
    filter_03_low_float_high_fdv: RawFilter;
    filter_04_egotistical_founder: RawFilter;
    filter_05_excessive_tge_hype: RawFilter;
    filter_06_not_understandable: RawFilter;
    step_1_result: Analysis["discard_filters"]["step_1_result"];
    step_1_summary: string;
  };
  fundamental_pillars: {
    pillar_01_pmf: RawPillar;
    pillar_02_real_revenue: RawPillar;
    pillar_03_value_capture: RawPillar;
    pillar_04_aligned_incentives: RawPillar;
    step_2_result: Analysis["fundamental_pillars"]["step_2_result"];
    step_2_summary: string;
  };
  ita_definitiva: Analysis["ita_definitiva"];
  comparative_analysis: Analysis["comparative_analysis"];
  risks_and_watchpoints: Analysis["risks_and_watchpoints"];
  verdict_section: {
    final_verdict: Analysis["verdict"];
    confidence_level: Analysis["verdict_section"]["confidence_level"];
    executive_summary: string;
    next_step: string;
  };
  sources: Analysis["sources"];
};

const AERO_INPUT_PATH = join(
  process.cwd(),
  "sistema-medusa/medusa-web-example-aero.json"
);

const FILTER_KEYS = [
  ["filter_01_inflationary", "inflationary"],
  ["filter_02_equity_token_duality", "equity_token_duality"],
  ["filter_03_low_float_high_fdv", "low_float_high_fdv"],
  ["filter_04_egotistical_founder", "egotistical_founder"],
  ["filter_05_excessive_tge_hype", "excessive_tge_hype"],
  ["filter_06_not_understandable", "not_understandable"],
] as const;

const PILLAR_KEYS = [
  ["pillar_01_pmf", "pmf"],
  ["pillar_02_real_revenue", "real_revenue"],
  ["pillar_03_value_capture", "value_capture"],
  ["pillar_04_aligned_incentives", "aligned_incentives"],
] as const;

export function transformAeroInput(input: RawAeroInput): Analysis {
  const payload = {
    ticker: input.metadata.ticker,
    project_name: input.metadata.project_name,
    contract_address: input.metadata.contract_address,
    chain: input.metadata.chain,
    category: input.metadata.category,
    tags: input.metadata.tags,
    analysis_date: input.metadata.analysis_date,
    methodology_version: input.metadata.system_version,
    analyst: input.metadata.analyst,
    verdict: input.metadata.verdict,
    verdict_summary: input.metadata.verdict_summary,
    executive_summary: input.verdict_section.executive_summary,
    base_data: input.base_data,
    discard_filters: {
      filters: FILTER_KEYS.map(([rawKey, id]) => ({
        id,
        ...input.discard_filters[rawKey],
      })),
      step_1_result: input.discard_filters.step_1_result,
      step_1_summary: input.discard_filters.step_1_summary,
    },
    fundamental_pillars: {
      pillars: PILLAR_KEYS.map(([rawKey, id]) => ({
        id,
        ...input.fundamental_pillars[rawKey],
      })),
      step_2_result: input.fundamental_pillars.step_2_result,
      step_2_summary: input.fundamental_pillars.step_2_summary,
    },
    ita_definitiva: input.ita_definitiva,
    comparative_analysis: input.comparative_analysis,
    risks_and_watchpoints: input.risks_and_watchpoints,
    verdict_section: {
      final_verdict: input.verdict_section.final_verdict,
      confidence_level: input.verdict_section.confidence_level,
      next_step: input.verdict_section.next_step,
    },
    sources: input.sources,
  };

  return analysisSchema.parse(payload);
}

export async function seedAero(): Promise<"created" | "skipped"> {
  const { db } = await import("@/db");
  const { analyses, analysisVersions, publishEvents } = await import("@/db/schema");

  const raw = JSON.parse(readFileSync(AERO_INPUT_PATH, "utf8")) as RawAeroInput;
  const payload = transformAeroInput(raw);
  const payloadHash = createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");

  return db.transaction(async (tx) => {
    const existing = await tx
      .select({ id: analyses.id })
      .from(analyses)
      .where(eq(analyses.ticker, payload.ticker))
      .limit(1);

    if (existing.length > 0) return "skipped";

    const [analysis] = await tx
      .insert(analyses)
      .values({
        ticker: payload.ticker,
        projectName: payload.project_name,
        chain: payload.chain,
        category: payload.category,
        contractAddress: payload.contract_address ?? null,
      })
      .returning({ id: analyses.id });

    const [version] = await tx
      .insert(analysisVersions)
      .values({
        analysisId: analysis.id,
        versionNumber: 1,
        payloadSchemaVersion: 1,
        methodologyVersion: payload.methodology_version,
        payload: payload as unknown as Record<string, unknown>,
        payloadHash,
        verdict: payload.verdict,
        dataDate: payload.base_data.data_date,
        analysisDate: payload.analysis_date,
        revisionNote: "Seed inicial AERO",
      })
      .returning({ id: analysisVersions.id });

    await tx.insert(publishEvents).values({
      analysisId: analysis.id,
      analysisVersionId: version.id,
      versionNumber: 1,
      eventType: "published",
      verdict: payload.verdict,
    });

    return "created";
  });
}

if (import.meta.main) {
  const result = await seedAero();
  console.log(result === "created" ? "AERO seeded" : "AERO already seeded");
}
