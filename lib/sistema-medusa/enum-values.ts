export const VERDICT_VALUES = [
  "AVANZA_A_AT",
  "EN_REVISION",
  "DESCARTE",
  "AT_BLOQUEA",
  "EN_CARTERA",
] as const;
export type Verdict = (typeof VERDICT_VALUES)[number];

// URL-safe value; the member-facing label is "AI / DePIN".
export const CATEGORY_VALUES = [
  "DEX",
  "AI_DEPIN",
  "L1",
  "L2",
  "RESTAKING",
  "RWA",
  "PERPS",
  "LENDING",
  "INFRASTRUCTURE",
] as const;
export type Category = (typeof CATEGORY_VALUES)[number];

export const CHAIN_VALUES = [
  "Ethereum",
  "Base",
  "Solana",
  "Arbitrum",
  "Optimism",
  "Bitcoin",
  "Hyperliquid_L1",
  "Other",
] as const;
export type Chain = (typeof CHAIN_VALUES)[number];

export const FILTER_STATUS_VALUES = ["VERDE", "AMARILLO", "ROJO"] as const;
export type FilterStatus = (typeof FILTER_STATUS_VALUES)[number];

export const PILLAR_STATUS_VALUES = [
  "VERDE",
  "AMARILLO",
  "ROJO",
  "NO_VERIFICABLE",
] as const;
export type PillarStatus = (typeof PILLAR_STATUS_VALUES)[number];

export const ITA_ANSWER_VALUES = [
  "SI_CLARO",
  "SI_CON_RESERVAS",
  "NO",
] as const;
export type ItaAnswer = (typeof ITA_ANSWER_VALUES)[number];

export const CONFIDENCE_LEVEL_VALUES = ["ALTA", "MEDIA", "BAJA"] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVEL_VALUES)[number];
