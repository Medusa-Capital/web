import { z } from "zod";
import { ITA_ANSWER_VALUES, type ItaAnswer } from "../enum-values";

export const itaAnswerEnum = z.enum(ITA_ANSWER_VALUES);

export const ITA_ANSWER_LABELS = {
  SI_CLARO: "Sí, claro",
  SI_CON_RESERVAS: "Sí, con reservas",
  NO: "No",
} as const satisfies Record<ItaAnswer, string>;

export const ITA_ANSWER_TONE = {
  SI_CLARO: "positive",
  SI_CON_RESERVAS: "warning",
  NO: "negative",
} as const satisfies Record<ItaAnswer, string>;

export const ITA_ANSWER_DOT = {
  SI_CLARO: "bg-emerald-400",
  SI_CON_RESERVAS: "bg-amber-400",
  NO: "bg-red-400",
} as const satisfies Record<ItaAnswer, string>;
