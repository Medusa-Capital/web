import { VERDICT_LABELS } from "@/lib/sistema-medusa/enums/verdict";
import type { Verdict } from "@/lib/sistema-medusa/enum-values";

const VERDICT_STYLE: Record<
  Verdict,
  { bg: string; text: string; border: string; dot: string }
> = {
  AVANZA_A_AT: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/25",
    dot: "bg-emerald-400",
  },
  EN_REVISION: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/25",
    dot: "bg-amber-400",
  },
  DESCARTE: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/25",
    dot: "bg-red-400",
  },
  AT_BLOQUEA: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/25",
    dot: "bg-orange-400",
  },
  EN_CARTERA: {
    bg: "bg-[#6366f1]/15",
    text: "text-[#B9B8EB]",
    border: "border-[#6366f1]/30",
    dot: "bg-[#6366f1]",
  },
};

interface VerdictBadgeProps {
  verdict: Verdict;
  size?: "sm" | "md" | "lg";
}

export function VerdictBadge({ verdict, size = "sm" }: VerdictBadgeProps) {
  const label = VERDICT_LABELS[verdict];
  const style = VERDICT_STYLE[verdict];

  const sizeClasses = {
    sm: "px-2.5 py-1 text-[11px]",
    md: "px-3 py-1.5 text-[12px]",
    lg: "px-4 py-2 text-[14px]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-semibold ${style.bg} ${style.text} ${style.border} ${sizeClasses[size]}`}
      aria-label={`Veredicto: ${label}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`}
      />
      {label}
    </span>
  );
}
