import {
  FILTER_STATUS_DOT,
  FILTER_STATUS_LABELS,
} from "@/lib/sistema-medusa/enums/filter-status";
import type { FilterStatus } from "@/lib/sistema-medusa/enum-values";

interface FilterStatusPillProps {
  status: FilterStatus;
}

export function FilterStatusPill({ status }: FilterStatusPillProps) {
  const label = FILTER_STATUS_LABELS[status];
  const dot = FILTER_STATUS_DOT[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-300"
      aria-label={`Estado del filtro: ${label}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
