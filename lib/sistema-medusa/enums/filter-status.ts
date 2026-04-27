import { z } from "zod";
import { FILTER_STATUS_VALUES, type FilterStatus } from "../enum-values";

export const filterStatusEnum = z.enum(FILTER_STATUS_VALUES);

export const FILTER_STATUS_LABELS = {
  VERDE: "Verde",
  AMARILLO: "Amarillo",
  ROJO: "Rojo",
} as const satisfies Record<FilterStatus, string>;

export const FILTER_STATUS_TONE = {
  VERDE: "positive",
  AMARILLO: "warning",
  ROJO: "negative",
} as const satisfies Record<FilterStatus, string>;

export const FILTER_STATUS_DOT = {
  VERDE: "bg-emerald-400",
  AMARILLO: "bg-amber-400",
  ROJO: "bg-red-400",
} as const satisfies Record<FilterStatus, string>;
