import { describe, expect, test } from "bun:test";

import { analysisSchema, type Analysis } from "@/lib/sistema-medusa/schemas";
import {
  FIELD_VISIBILITY,
  getVisibility,
  pickPublic,
} from "@/lib/sistema-medusa/visibility";

const makeAnalysis = (): Analysis =>
  analysisSchema.parse({
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
          metric_source:
            "https://coinmarketcap.com/cmc-ai/aerodrome-finance/latest-updates/",
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

describe("FIELD_VISIBILITY", () => {
  test("covers every top-level analysis key", () => {
    const analysis = makeAnalysis();
    expect(Object.keys(analysis).sort()).toEqual(
      Object.keys(FIELD_VISIBILITY)
        .filter((path) => !path.includes("."))
        .sort()
    );
  });

  test("defaults unmatched paths to member visibility", () => {
    expect(getVisibility("sources.primary[].url")).toBe("member");
    expect(getVisibility("unknown.future_field")).toBe("member");
  });

  test("projects only public top-level fields in v1", () => {
    expect(pickPublic(makeAnalysis())).toEqual({
      ticker: "AERO",
      project_name: "Aerodrome Finance",
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
    });
  });
});
