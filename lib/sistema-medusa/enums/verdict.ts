import { z } from "zod";
import { VERDICT_VALUES, type Verdict } from "../enum-values";

export const verdictEnum = z.enum(VERDICT_VALUES);

export const VERDICT_LABELS = {
  AVANZA_A_AT: "Avanza a análisis técnico",
  EN_REVISION: "En revisión",
  DESCARTE: "Descartado",
  AT_BLOQUEA: "Bloqueado por análisis técnico",
  EN_CARTERA: "En cartera",
} as const satisfies Record<Verdict, string>;

export const VERDICT_TONE = {
  AVANZA_A_AT: "positive",
  EN_REVISION: "warning",
  DESCARTE: "negative",
  AT_BLOQUEA: "negative",
  EN_CARTERA: "positive",
} as const satisfies Record<Verdict, string>;

export const VERDICT_DOT = {
  AVANZA_A_AT: "bg-emerald-400",
  EN_REVISION: "bg-amber-400",
  DESCARTE: "bg-red-400",
  AT_BLOQUEA: "bg-red-400",
  EN_CARTERA: "bg-sky-400",
} as const satisfies Record<Verdict, string>;
