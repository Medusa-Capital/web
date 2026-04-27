import { describe, expect, test } from "bun:test";

import {
  analysisSchema,
  FILTERS_MAX,
  STRING_MAX,
  SUMMARY_MAX,
  VERDICT_SUMMARY_MAX,
} from "@/lib/sistema-medusa/schemas";

const validAnalysis = () => ({
  ticker: "AERO",
  project_name: "Aerodrome Finance",
  contract_address: "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
  chain: "Base",
  category: "DEX",
  tags: ["ve(3,3)", "infrastructure"],
  analysis_date: "2026-04-25",
  methodology_version: "V4.1",
  analyst: "Medusa Capital",
  verdict: "AVANZA_A_AT",
  verdict_summary: "Captura de valor directa y sin red flags estructurales.",
  executive_summary:
    "Aerodrome presenta uno de los perfiles fundamentales más limpios del segmento DEX.",
  base_data: {
    price_usd: 0.41,
    market_cap_usd: 375000000,
    fdv_usd: 602000000,
    mc_fdv_ratio: 0.62,
    circulating_supply: 926300000,
    total_supply: 1880000000,
    max_supply: null,
    revenue_annualized_usd: 205510000,
    mc_revenue_ratio: 1.83,
    tvl_usd: 508730000,
    data_source_primary: "https://defillama.com/protocol/aerodrome",
    data_date: "2026-04-25",
  },
  discard_filters: {
    filters: [
      {
        id: "inflationary",
        name: "Token altamente inflacionario",
        status: "VERDE",
        justification:
          "Inflación nominal compensada por locks netos y buybacks programáticos.",
        key_metric: "Inflación neta efectiva: 8% anual.",
        metric_source: "https://coinmarketcap.com/cmc-ai/aerodrome-finance/latest-updates/",
      },
    ],
    step_1_result: "PASA",
    step_1_summary: "Aerodrome supera los filtros de descarte.",
  },
  fundamental_pillars: {
    pillars: [
      {
        id: "pmf",
        name: "Product-Market Fit",
        status: "VERDE",
        analysis:
          "Aerodrome es el DEX dominante en Base por volumen y TVL.",
        key_metrics: [
          {
            metric: "Cuota volumen Base",
            value: "56.89%",
            source_url: "https://defillama.com/protocol/aerodrome",
          },
        ],
      },
    ],
    step_2_result: "PASA",
    step_2_summary: "Los pilares fundamentales superan el umbral.",
  },
  ita_definitiva: {
    question: "¿Si este proyecto gana dinero, YO voy a ganar dinero con mi token?",
    answer: "SI_CLARO",
    rationale:
      "El revenue fluye a veAERO holders y se refuerza con buybacks programáticos.",
  },
  comparative_analysis: {
    peer_tokens: [
      {
        ticker: "AERO",
        mc: 375000000,
        revenue: 205500000,
        ps_ratio: 1.8,
        value_capture_pct: 100,
        notes: "100% directo más buyback adicional.",
        url: "https://defillama.com/protocol/aerodrome",
      },
    ],
    summary:
      "AERO cotiza a múltiplos bajos frente a comparables con mayor captura de valor.",
  },
  risks_and_watchpoints: {
    structural_risks: ["Revenue procíclico al volumen on-chain de Base."],
    operational_risks: ["DNS hijack recurrente desde 2023."],
    things_to_monitor: ["Revenue vs emisiones mensual."],
  },
  verdict_section: {
    final_verdict: "AVANZA_A_AT",
    confidence_level: "ALTA",
    next_step:
      "Aplicar análisis técnico como filtro binario antes de construir posición.",
  },
  sources: {
    primary: [
      {
        name: "DefiLlama - Aerodrome",
        url: "https://defillama.com/protocol/aerodrome",
        type: "aggregator",
      },
    ],
    secondary: [
      {
        name: "Bankless - Aerodrome",
        url: "https://www.bankless.com/aerodromes-killer-year",
      },
    ],
  },
});

describe("analysisSchema", () => {
  test("accepts a canonical transformed analysis payload", () => {
    const parsed = analysisSchema.parse(validAnalysis());
    expect(parsed.ticker).toBe("AERO");
  });

  test("rejects unsafe URL schemes", () => {
    const payload = validAnalysis();
    payload.base_data.data_source_primary = "javascript:alert(1)";
    expect(() => analysisSchema.parse(payload)).toThrow("https only");
  });

  test("rejects script-like prose", () => {
    const payload = validAnalysis();
    payload.executive_summary = "<script>alert(1)</script>";
    expect(() => analysisSchema.parse(payload)).toThrow("no script-like content");
  });

  test("rejects mismatched top-level and section verdicts", () => {
    const payload = validAnalysis();
    payload.verdict_section.final_verdict = "DESCARTE";
    expect(() => analysisSchema.parse(payload)).toThrow(
      "verdict must match verdict_section.final_verdict"
    );
  });

  test("rejects unknown filter and pillar semantic IDs", () => {
    const badFilter = validAnalysis();
    badFilter.discard_filters.filters[0].id = "filter_01_inflationary";
    expect(() => analysisSchema.parse(badFilter)).toThrow();

    const badPillar = validAnalysis();
    badPillar.fundamental_pillars.pillars[0].id = "pillar_01_pmf";
    expect(() => analysisSchema.parse(badPillar)).toThrow();
  });

  test("enforces public prose and array bounds", () => {
    const tooLongSummary = validAnalysis();
    tooLongSummary.executive_summary = "a".repeat(SUMMARY_MAX + 1);
    expect(() => analysisSchema.parse(tooLongSummary)).toThrow();

    const tooLongVerdict = validAnalysis();
    tooLongVerdict.verdict_summary = "a".repeat(VERDICT_SUMMARY_MAX + 1);
    expect(() => analysisSchema.parse(tooLongVerdict)).toThrow();

    const tooLongFilter = validAnalysis();
    tooLongFilter.discard_filters.filters[0].justification =
      "a".repeat(STRING_MAX + 1);
    expect(() => analysisSchema.parse(tooLongFilter)).toThrow();

    const tooManyFilters = validAnalysis();
    tooManyFilters.discard_filters.filters = Array.from(
      { length: FILTERS_MAX + 1 },
      () => structuredClone(validAnalysis().discard_filters.filters[0])
    );
    expect(() => analysisSchema.parse(tooManyFilters)).toThrow();
  });
});
