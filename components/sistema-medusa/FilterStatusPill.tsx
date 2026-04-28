import {
  FILTER_STATUS_LABELS,
} from "@/lib/sistema-medusa/enums/filter-status";
import type { FilterStatus } from "@/lib/sistema-medusa/enum-values";

const FILTER_STYLE: Record<
  FilterStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  VERDE: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  AMARILLO: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
  },
  ROJO: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
    dot: "bg-red-400",
  },
};

interface FilterStatusPillProps {
  status: FilterStatus;
}

export function FilterStatusPill({ status }: FilterStatusPillProps) {
  const label = FILTER_STATUS_LABELS[status];
  const style = FILTER_STYLE[status] ?? {
    bg: "bg-white/[0.03]",
    text: "text-zinc-300",
    border: "border-white/[0.06]",
    dot: "bg-zinc-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${style.bg} ${style.text} ${style.border}`}
      aria-label={`Estado del filtro: ${label}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
      {label}
    </span>
  );
}
