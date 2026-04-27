import { z } from "zod";
import {
  CONFIDENCE_LEVEL_VALUES,
  type ConfidenceLevel,
} from "../enum-values";

export const confidenceLevelEnum = z.enum(CONFIDENCE_LEVEL_VALUES);

export const CONFIDENCE_LEVEL_LABELS = {
  ALTA: "Alta",
  MEDIA: "Media",
  BAJA: "Baja",
} as const satisfies Record<ConfidenceLevel, string>;

export const CONFIDENCE_LEVEL_TONE = {
  ALTA: "positive",
  MEDIA: "warning",
  BAJA: "negative",
} as const satisfies Record<ConfidenceLevel, string>;

export const CONFIDENCE_LEVEL_DOT = {
  ALTA: "bg-emerald-400",
  MEDIA: "bg-amber-400",
  BAJA: "bg-red-400",
} as const satisfies Record<ConfidenceLevel, string>;
