import type { Analysis } from "./schemas";

export const PUBLIC_ANALYSIS_KEYS = [
  "ticker",
  "project_name",
  "chain",
  "category",
  "tags",
  "analysis_date",
  "methodology_version",
  "analyst",
  "verdict",
  "verdict_summary",
  "executive_summary",
] as const satisfies readonly (keyof Analysis)[];

export type AnalysisPublicKey = (typeof PUBLIC_ANALYSIS_KEYS)[number];
export type AnalysisMemberView = Analysis;
export type AnalysisPublicView = Pick<Analysis, AnalysisPublicKey>;

export type AnalysisView =
  | { mode: "member"; data: AnalysisMemberView }
  | { mode: "public"; data: AnalysisPublicView };
