// Status display shared across cards + detail view. Spanish labels.
// Featurebase-inspired status colors — subtle colored pills.

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

// Badge styling: Featurebase-style subtle pills
export const STATUS_TONE: Record<PostStatus, string> = {
  open: "border-[#a78bfa]/25 bg-[#a78bfa]/10 text-[#c4b5fd]",
  planned: "border-[#818cf8]/25 bg-[#818cf8]/10 text-[#a5b4fc]",
  in_progress: "border-[#38bdf8]/25 bg-[#38bdf8]/10 text-[#7dd3fc]",
  shipped: "border-[#34d399]/25 bg-[#34d399]/10 text-[#6ee7b7]",
  declined: "border-[#71717a]/25 bg-[#71717a]/10 text-[#a1a1aa]",
};

// Dot color for inline status indicators
export const STATUS_DOT: Record<PostStatus, string> = {
  open: "bg-[#a78bfa]",
  planned: "bg-[#818cf8]",
  in_progress: "bg-[#38bdf8]",
  shipped: "bg-[#34d399]",
  declined: "bg-[#71717a]",
};
