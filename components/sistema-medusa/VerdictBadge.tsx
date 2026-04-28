import {
  VERDICT_DOT,
  VERDICT_LABELS,
} from "@/lib/sistema-medusa/enums/verdict";
import type { Verdict } from "@/lib/sistema-medusa/enum-values";

interface VerdictBadgeProps {
  verdict: Verdict;
  size?: "sm" | "md";
}

export function VerdictBadge({ verdict, size = "sm" }: VerdictBadgeProps) {
  const label = VERDICT_LABELS[verdict];
  const dot = VERDICT_DOT[verdict];
  const padding = size === "md" ? "px-3 py-1.5 text-[12px]" : "px-2.5 py-1 text-[11px]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.03] font-medium text-zinc-200 ${padding}`}
      aria-label={`Veredicto: ${label}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${dot}`}
      />
      {label}
    </span>
  );
}
