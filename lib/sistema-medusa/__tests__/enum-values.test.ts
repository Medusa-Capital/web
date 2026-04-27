import { describe, expect, test } from "bun:test";

import {
  CATEGORY_VALUES,
  CHAIN_VALUES,
  CONFIDENCE_LEVEL_VALUES,
  FILTER_STATUS_VALUES,
  ITA_ANSWER_VALUES,
  PILLAR_STATUS_VALUES,
  VERDICT_VALUES,
} from "@/lib/sistema-medusa/enum-values";

describe("Sistema Medusa enum values", () => {
  test("exports the canonical verdict values", () => {
    expect(VERDICT_VALUES).toEqual([
      "AVANZA_A_AT",
      "EN_REVISION",
      "DESCARTE",
      "AT_BLOQUEA",
      "EN_CARTERA",
    ]);
  });

  test("exports URL-safe analysis categories", () => {
    expect(CATEGORY_VALUES).toEqual([
      "DEX",
      "AI_DEPIN",
      "L1",
      "L2",
      "RESTAKING",
      "RWA",
      "PERPS",
    ]);
  });

  test("exports supported chains", () => {
    expect(CHAIN_VALUES).toEqual([
      "Ethereum",
      "Base",
      "Solana",
      "Arbitrum",
      "Optimism",
      "Bitcoin",
      "Other",
    ]);
  });

  test("exports methodology status enums", () => {
    expect(FILTER_STATUS_VALUES).toEqual(["VERDE", "AMARILLO", "ROJO"]);
    expect(PILLAR_STATUS_VALUES).toEqual([
      "VERDE",
      "AMARILLO",
      "ROJO",
      "NO_VERIFICABLE",
    ]);
    expect(ITA_ANSWER_VALUES).toEqual(["SI_CLARO", "SI_CON_RESERVAS", "NO"]);
    expect(CONFIDENCE_LEVEL_VALUES).toEqual(["ALTA", "MEDIA", "BAJA"]);
  });
});
