import type { Analysis } from "./schemas";

export type Visibility = "public" | "member" | `tier:${string}`;
export type AnalysisPublicView = Partial<Analysis>;

export const FIELD_VISIBILITY = {
  ticker: "public",
  project_name: "public",
  contract_address: "member",
  chain: "public",
  category: "public",
  tags: "public",
  analysis_date: "public",
  methodology_version: "public",
  analyst: "public",
  verdict: "public",
  verdict_summary: "public",
  executive_summary: "public",
  base_data: "member",
  discard_filters: "member",
  fundamental_pillars: "member",
  ita_definitiva: "member",
  comparative_analysis: "member",
  risks_and_watchpoints: "member",
  verdict_section: "member",
  sources: "member",

  "base_data.price_usd": "member",
  "base_data.market_cap_usd": "member",
  "base_data.fdv_usd": "member",
  "base_data.mc_fdv_ratio": "member",
  "base_data.circulating_supply": "member",
  "base_data.total_supply": "member",
  "base_data.max_supply": "member",
  "base_data.revenue_annualized_usd": "member",
  "base_data.mc_revenue_ratio": "member",
  "base_data.tvl_usd": "member",
  "base_data.data_source_primary": "member",
  "base_data.data_date": "member",

  "discard_filters.filters[]": "member",
  "discard_filters.filters[].id": "member",
  "discard_filters.filters[].name": "member",
  "discard_filters.filters[].status": "member",
  "discard_filters.filters[].justification": "member",
  "discard_filters.filters[].key_metric": "member",
  "discard_filters.filters[].metric_source": "member",
  "discard_filters.step_1_result": "member",
  "discard_filters.step_1_summary": "member",

  "fundamental_pillars.pillars[]": "member",
  "fundamental_pillars.pillars[].id": "member",
  "fundamental_pillars.pillars[].name": "member",
  "fundamental_pillars.pillars[].status": "member",
  "fundamental_pillars.pillars[].analysis": "member",
  "fundamental_pillars.pillars[].key_metrics[]": "member",
  "fundamental_pillars.pillars[].key_metrics[].metric": "member",
  "fundamental_pillars.pillars[].key_metrics[].value": "member",
  "fundamental_pillars.pillars[].key_metrics[].source_url": "member",
  "fundamental_pillars.step_2_result": "member",
  "fundamental_pillars.step_2_summary": "member",

  "ita_definitiva.question": "member",
  "ita_definitiva.answer": "member",
  "ita_definitiva.rationale": "member",

  "comparative_analysis.peer_tokens[]": "member",
  "comparative_analysis.peer_tokens[].ticker": "member",
  "comparative_analysis.peer_tokens[].mc": "member",
  "comparative_analysis.peer_tokens[].revenue": "member",
  "comparative_analysis.peer_tokens[].ps_ratio": "member",
  "comparative_analysis.peer_tokens[].value_capture_pct": "member",
  "comparative_analysis.peer_tokens[].notes": "member",
  "comparative_analysis.peer_tokens[].url": "member",
  "comparative_analysis.summary": "member",

  "risks_and_watchpoints.structural_risks[]": "member",
  "risks_and_watchpoints.operational_risks[]": "member",
  "risks_and_watchpoints.things_to_monitor[]": "member",

  "verdict_section.final_verdict": "member",
  "verdict_section.confidence_level": "member",
  "verdict_section.next_step": "member",

  "sources.primary[]": "member",
  "sources.primary[].name": "member",
  "sources.primary[].url": "member",
  "sources.primary[].type": "member",
  "sources.secondary[]": "member",
  "sources.secondary[].name": "member",
  "sources.secondary[].url": "member",
} as const satisfies Record<string, Visibility>;

export function getVisibility(path: string): Visibility {
  return FIELD_VISIBILITY[path] ?? "member";
}

export function pickPublic(payload: Analysis): AnalysisPublicView {
  return pickPublicValue(payload, "") as AnalysisPublicView;
}

function pickPublicValue(value: unknown, path: string): unknown {
  if (path && getVisibility(path) === "public") {
    return value;
  }

  if (Array.isArray(value)) {
    const items = value
      .map((item) => pickPublicValue(item, `${path}[]`))
      .filter((item) => item !== undefined);

    return items.length > 0 ? items : undefined;
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value)
      .map(([key, child]) => {
        const childPath = path ? `${path}.${key}` : key;
        const picked = pickPublicValue(child, childPath);
        return picked === undefined ? undefined : [key, picked];
      })
      .filter((entry): entry is [string, unknown] => entry !== undefined);

    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }

  return undefined;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
