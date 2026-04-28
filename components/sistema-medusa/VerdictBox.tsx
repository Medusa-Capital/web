import type { Analysis } from "@/lib/sistema-medusa/schemas";
import {
  CONFIDENCE_LEVEL_LABELS,
  CONFIDENCE_LEVEL_DOT,
} from "@/lib/sistema-medusa/enums/confidence-level";
import { VerdictBadge } from "./VerdictBadge";

interface VerdictBoxProps {
  verdict: Analysis["verdict"];
  verdictSummary: string;
  verdictSection: Analysis["verdict_section"];
}

export function VerdictBox({
  verdict,
  verdictSummary,
  verdictSection,
}: VerdictBoxProps) {
  const confidenceLabel = CONFIDENCE_LEVEL_LABELS[verdictSection.confidence_level];
  const confidenceDot = CONFIDENCE_LEVEL_DOT[verdictSection.confidence_level];

  return (
    <section
      aria-labelledby="verdict-heading"
      className="mt-10 overflow-hidden rounded-lg border border-white/[0.06] bg-[#111118]"
    >
      {/* Accent bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-[#B9B8EB] via-[#6366f1] to-[#4338ca]" />

      <div className="p-7">
        {/* Label */}
        <p
          id="verdict-heading"
          className="text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-500"
        >
          Veredicto Sistema Medusa
        </p>

        {/* Verdict + confidence */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <VerdictBadge verdict={verdict} size="lg" />
          <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[12px] font-medium text-zinc-300">
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${confidenceDot}`}
            />
            Confianza {confidenceLabel}
          </span>
        </div>

        {/* Summary */}
        <p className="mt-5 text-[14px] leading-relaxed text-[#CCCCE0]">
          {verdictSummary}
        </p>

        {/* Next step */}
        <div className="mt-5 rounded-md border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
            Próximo paso
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-300">
            {verdictSection.next_step}
          </p>
        </div>
      </div>
    </section>
  );
}
