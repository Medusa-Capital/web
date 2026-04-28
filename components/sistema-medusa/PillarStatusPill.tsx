import {
  PILLAR_STATUS_LABELS,
} from "@/lib/sistema-medusa/enums/pillar-status";
import type { PillarStatus } from "@/lib/sistema-medusa/enum-values";

const PILLAR_STYLE: Record<
  PillarStatus,
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
  NO_VERIFICABLE: {
    bg: "bg-zinc-800/60",
    text: "text-zinc-400",
    border: "border-zinc-700/40",
    dot: "bg-zinc-500",
  },
};

interface PillarStatusPillProps {
  status: PillarStatus;
}

export function PillarStatusPill({ status }: PillarStatusPillProps) {
  const label = PILLAR_STATUS_LABELS[status];
  const style = PILLAR_STYLE[status] ?? {
    bg: "bg-white/[0.03]",
    text: "text-zinc-300",
    border: "border-white/[0.06]",
    dot: "bg-zinc-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${style.bg} ${style.text} ${style.border}`}
      aria-label={`Estado del pilar: ${label}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
      {label}
    </span>
  );
}
