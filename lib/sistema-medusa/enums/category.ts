import { z } from "zod";
import { CATEGORY_VALUES, type Category } from "../enum-values";

export const categoryEnum = z.enum(CATEGORY_VALUES);

export const CATEGORY_LABELS = {
  DEX: "DEX",
  AI_DEPIN: "AI / DePIN",
  L1: "L1",
  L2: "L2",
  RESTAKING: "Restaking",
  RWA: "RWA",
  PERPS: "Perps",
  LENDING: "Lending",
  INFRASTRUCTURE: "Infraestructura",
} as const satisfies Record<Category, string>;

export const CATEGORY_TONE = {
  DEX: "purple",
  AI_DEPIN: "cyan",
  L1: "indigo",
  L2: "sky",
  RESTAKING: "violet",
  RWA: "emerald",
  PERPS: "amber",
  LENDING: "rose",
  INFRASTRUCTURE: "slate",
} as const satisfies Record<Category, string>;

export const CATEGORY_DOT = {
  DEX: "bg-purple-400",
  AI_DEPIN: "bg-cyan-400",
  L1: "bg-indigo-400",
  L2: "bg-sky-400",
  RESTAKING: "bg-violet-400",
  RWA: "bg-emerald-400",
  PERPS: "bg-amber-400",
  LENDING: "bg-rose-400",
  INFRASTRUCTURE: "bg-slate-400",
} as const satisfies Record<Category, string>;
