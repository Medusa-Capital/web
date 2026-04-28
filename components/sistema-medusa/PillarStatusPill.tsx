import {
  PILLAR_STATUS_DOT,
  PILLAR_STATUS_LABELS,
} from "@/lib/sistema-medusa/enums/pillar-status";
import type { PillarStatus } from "@/lib/sistema-medusa/enum-values";

interface PillarStatusPillProps {
  status: PillarStatus;
}

export function PillarStatusPill({ status }: PillarStatusPillProps) {
  const label = PILLAR_STATUS_LABELS[status];
  const dot = PILLAR_STATUS_DOT[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-300"
      aria-label={`Estado del pilar: ${label}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
