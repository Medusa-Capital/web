// Status display shared across cards + detail view. Spanish labels.

export type PostStatus =
  | "open"
  | "planned"
  | "in_progress"
  | "shipped"
  | "declined";

export const STATUS_LABELS: Record<PostStatus, string> = {
  open: "Abierta",
  planned: "Planeada",
  in_progress: "En curso",
  shipped: "Lanzada",
  declined: "Descartada",
};

export const STATUS_TONE: Record<PostStatus, string> = {
  open: "border-[#B9B8EB]/30 bg-[#B9B8EB]/5 text-[#B9B8EB]",
  planned: "border-[#6366f1]/40 bg-[#6366f1]/10 text-[#B9B8EB]",
  in_progress: "border-amber-500/40 bg-amber-500/10 text-amber-200",
  shipped: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  declined: "border-red-500/40 bg-red-500/10 text-red-200",
};
