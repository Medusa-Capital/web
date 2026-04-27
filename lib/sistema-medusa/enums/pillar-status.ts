import { z } from "zod";
import { PILLAR_STATUS_VALUES, type PillarStatus } from "../enum-values";

export const pillarStatusEnum = z.enum(PILLAR_STATUS_VALUES);

export const PILLAR_STATUS_LABELS = {
  VERDE: "Verde",
  AMARILLO: "Amarillo",
  ROJO: "Rojo",
  NO_VERIFICABLE: "No verificable",
} as const satisfies Record<PillarStatus, string>;

export const PILLAR_STATUS_TONE = {
  VERDE: "positive",
  AMARILLO: "warning",
  ROJO: "negative",
  NO_VERIFICABLE: "muted",
} as const satisfies Record<PillarStatus, string>;

export const PILLAR_STATUS_DOT = {
  VERDE: "bg-emerald-400",
  AMARILLO: "bg-amber-400",
  ROJO: "bg-red-400",
  NO_VERIFICABLE: "bg-zinc-400",
} as const satisfies Record<PillarStatus, string>;
