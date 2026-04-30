// One-off batch transformer for the 2026-04 token wave (HYPE/META/MORPHO/SYRUP).
//
// Reads legacy seed-format JSONs from ~/Code/medusa-capital/Proyectos_Sistema_Medusa,
// applies Javier's 2026-04-30 base_data dump, normalizes categories/chains/sources,
// and writes canonical JSONs to content/sistema-medusa/inbox/<ticker>/<ticker>.json
// ready for `bun run sm:validate` + `bun run sm:ingest`.
//
// Run from repo root: `bun scripts/sistema-medusa/prep-batch-2026-04.ts`

import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";

import { analysisSchema, type Analysis } from "@/lib/sistema-medusa/schemas";
import type { Category, Chain } from "@/lib/sistema-medusa/enum-values";

const SOURCE_DIR = "/Users/urbistondo/Code/medusa-capital/Proyectos_Sistema_Medusa";
const INBOX_DIR = resolve("content/sistema-medusa/inbox");

interface BaseDataOverride {
  analysis_date: string;
  price_usd: number;
  market_cap_usd: number;
  fdv_usd: number;
  mc_fdv_ratio: number;
  circulating_supply: number;
  total_supply: number;
}

interface BatchEntry {
  ticker: string;
  source_file: string;
  category: Category;
  primary_chain: Chain;
  multichain_tags: string[];
  base_data: BaseDataOverride;
}

const BATCH: BatchEntry[] = [
  {
    ticker: "HYPE",
    source_file: "hype-medusa.json",
    category: "PERPS",
    primary_chain: "Hyperliquid_L1",
    multichain_tags: [],
    base_data: {
      analysis_date: "2026-02-18",
      price_usd: 31.0,
      market_cap_usd: 8_000_000_000,
      fdv_usd: 30_300_000_000,
      mc_fdv_ratio: 0.27,
      circulating_supply: 258_000_000,
      total_supply: 957_000_000,
    },
  },
  {
    ticker: "META",
    source_file: "meta-medusa.json",
    category: "INFRASTRUCTURE",
    primary_chain: "Solana",
    multichain_tags: [],
    base_data: {
      analysis_date: "2026-03-31",
      price_usd: 3.79,
      market_cap_usd: 86_000_000,
      fdv_usd: 86_000_000,
      mc_fdv_ratio: 1.0,
      circulating_supply: 22_680_000,
      total_supply: 22_680_000,
    },
  },
  {
    ticker: "MORPHO",
    source_file: "morpho-medusa.json",
    category: "LENDING",
    primary_chain: "Ethereum",
    multichain_tags: ["multichain:Base"],
    base_data: {
      analysis_date: "2026-03-17",
      price_usd: 1.5,
      market_cap_usd: 700_000_000,
      fdv_usd: 1_500_000_000,
      mc_fdv_ratio: 0.45,
      circulating_supply: 447_253_133,
      total_supply: 1_000_000_000,
    },
  },
  {
    ticker: "SYRUP",
    source_file: "syrup-medusa.json",
    category: "LENDING",
    primary_chain: "Ethereum",
    multichain_tags: ["multichain:Base", "multichain:Solana"],
    base_data: {
      analysis_date: "2026-02-11",
      price_usd: 0.34,
      market_cap_usd: 410_000_000,
      fdv_usd: 510_000_000,
      mc_fdv_ratio: 0.8,
      circulating_supply: 1_211_087_992,
      total_supply: 1_216_127_147,
    },
  },
];

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

const SOURCE_TYPES = ["onchain", "aggregator", "official_docs", "research"] as const;
type SourceType = (typeof SOURCE_TYPES)[number];

function isHttps(url: unknown): url is string {
  return typeof url === "string" && /^https:\/\//i.test(url);
}

function normalizeMethodology(raw: string): string {
  // Trim only — V4 and V4.1 are both registered now. Other values will fail
  // schema validation and surface explicitly.
  return raw.trim();
}

function normalizeSources(raw: { primary?: unknown[]; secondary?: unknown[] }): {
  primary: { name: string; url: string; type: SourceType }[];
  secondary: { name: string; url: string }[];
} {
  const primary = (raw.primary ?? [])
    .filter((entry): entry is { name: string; url: string; type: string } => {
      if (!entry || typeof entry !== "object") return false;
      const e = entry as Record<string, unknown>;
      return typeof e.name === "string" && isHttps(e.url) && typeof e.type === "string";
    })
    .map((entry) => {
      const type = SOURCE_TYPES.includes(entry.type as SourceType)
        ? (entry.type as SourceType)
        : "research";
      return { name: entry.name, url: entry.url, type };
    });

  const secondary = (raw.secondary ?? [])
    .filter((entry): entry is { name: string; url: string } => {
      if (!entry || typeof entry !== "object") return false;
      const e = entry as Record<string, unknown>;
      return typeof e.name === "string" && isHttps(e.url);
    })
    .map((entry) => ({ name: entry.name, url: entry.url }));

  return { primary, secondary };
}

function normalizeKeyMetricSourceUrl(
  metric: { metric: string; value: string; source_url: string },
  fallbackUrl: string
): { metric: string; value: string; source_url: string } {
  return {
    metric: metric.metric,
    value: metric.value,
    source_url: isHttps(metric.source_url) ? metric.source_url : fallbackUrl,
  };
}

function normalizeFilterMetricSource(
  source: string,
  fallbackUrl: string
): string {
  return isHttps(source) ? source : fallbackUrl;
}

function transformLegacy(raw: any, entry: BatchEntry): Analysis {
  const fallbackPrimaryUrl = isHttps(raw.base_data?.data_source_primary)
    ? raw.base_data.data_source_primary
    : "https://defillama.com";

  const filters = FILTER_KEYS.map(([rawKey, id]) => {
    const f = raw.discard_filters[rawKey];
    return {
      id,
      name: f.name,
      status: f.status,
      justification: f.justification,
      key_metric: f.key_metric,
      metric_source: normalizeFilterMetricSource(f.metric_source, fallbackPrimaryUrl),
    };
  });

  const pillars = PILLAR_KEYS.map(([rawKey, id]) => {
    const p = raw.fundamental_pillars[rawKey];
    return {
      id,
      name: p.name,
      status: p.status,
      analysis: p.analysis,
      key_metrics: (p.key_metrics ?? []).map((m: { metric: string; value: string; source_url: string }) =>
        normalizeKeyMetricSourceUrl(m, fallbackPrimaryUrl)
      ),
    };
  });

  const peer_tokens = (raw.comparative_analysis?.peer_tokens ?? []).map(
    (peer: Record<string, unknown>) => {
      const out: Record<string, unknown> = {
        ticker: peer.ticker,
        mc: peer.mc ?? null,
        revenue: peer.revenue ?? null,
        ps_ratio: peer.ps_ratio ?? null,
        value_capture_pct: peer.value_capture_pct ?? null,
        notes: peer.notes ?? "",
      };
      if (isHttps(peer.url)) out.url = peer.url;
      return out;
    }
  );

  const baseTags = Array.isArray(raw.metadata?.tags) ? raw.metadata.tags : [];
  const tags = [...baseTags, ...entry.multichain_tags];

  const sources = normalizeSources(raw.sources ?? {});

  const fallbackPrimarySource: BaseDataOverride extends never ? never : { name: string; url: string; type: SourceType } = {
    name: "DefiLlama",
    url: fallbackPrimaryUrl,
    type: "aggregator",
  };
  if (sources.primary.length === 0) {
    sources.primary.push(fallbackPrimarySource);
  }

  const payload = {
    ticker: entry.ticker,
    project_name: raw.metadata.project_name,
    contract_address: raw.metadata.contract_address ?? null,
    chain: entry.primary_chain,
    category: entry.category,
    tags,
    analysis_date: entry.base_data.analysis_date,
    methodology_version: normalizeMethodology(raw.metadata.system_version),
    analyst: raw.metadata.analyst,
    verdict: raw.metadata.verdict,
    verdict_summary: raw.metadata.verdict_summary,
    executive_summary: raw.verdict_section.executive_summary,
    base_data: {
      price_usd: entry.base_data.price_usd,
      market_cap_usd: entry.base_data.market_cap_usd,
      fdv_usd: entry.base_data.fdv_usd,
      mc_fdv_ratio: entry.base_data.mc_fdv_ratio,
      circulating_supply: entry.base_data.circulating_supply,
      total_supply: entry.base_data.total_supply,
      max_supply: raw.base_data.max_supply ?? null,
      revenue_annualized_usd: raw.base_data.revenue_annualized_usd ?? null,
      mc_revenue_ratio: raw.base_data.mc_revenue_ratio ?? null,
      tvl_usd: raw.base_data.tvl_usd ?? null,
      data_source_primary: fallbackPrimaryUrl,
      data_date: entry.base_data.analysis_date,
    },
    discard_filters: {
      filters,
      step_1_result: raw.discard_filters.step_1_result,
      step_1_summary: raw.discard_filters.step_1_summary,
    },
    fundamental_pillars: {
      pillars,
      step_2_result: raw.fundamental_pillars.step_2_result,
      step_2_summary: raw.fundamental_pillars.step_2_summary,
    },
    ita_definitiva: raw.ita_definitiva,
    comparative_analysis: {
      peer_tokens,
      summary: raw.comparative_analysis.summary,
    },
    risks_and_watchpoints: raw.risks_and_watchpoints,
    verdict_section: {
      final_verdict: raw.verdict_section.final_verdict,
      confidence_level: raw.verdict_section.confidence_level,
      next_step: raw.verdict_section.next_step,
    },
    sources,
  };

  return analysisSchema.parse(payload);
}

async function main() {
  for (const entry of BATCH) {
    const sourcePath = join(SOURCE_DIR, entry.source_file);
    const raw = JSON.parse(readFileSync(sourcePath, "utf8"));
    let canonical: Analysis;
    try {
      canonical = transformLegacy(raw, entry);
    } catch (error) {
      console.error(`[${entry.ticker}] FAILED:`);
      console.error(error);
      process.exitCode = 1;
      continue;
    }

    const outDir = join(INBOX_DIR, entry.ticker.toLowerCase());
    mkdirSync(outDir, { recursive: true });
    const outPath = join(outDir, `${entry.ticker.toLowerCase()}.json`);
    writeFileSync(outPath, JSON.stringify(canonical, null, 2) + "\n");
    console.log(`[${entry.ticker}] wrote ${outPath}`);
  }
}

if (import.meta.main) {
  await main();
}
