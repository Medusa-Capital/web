import type { Analysis } from "@/lib/sistema-medusa/schemas";
import {
  CONFIDENCE_LEVEL_DOT,
  CONFIDENCE_LEVEL_LABELS,
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
  const confidenceLabel =
    CONFIDENCE_LEVEL_LABELS[verdictSection.confidence_level];
  const confidenceDot =
    CONFIDENCE_LEVEL_DOT[verdictSection.confidence_level];
  return (
    <section
      aria-labelledby="verdict-heading"
      className="mt-10 rounded-lg border-l-2 border-l-[#6366f1] border-white/[0.06] bg-[#111118] p-6"
    >
      <h2
        id="verdict-heading"
        className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500"
      >
        Veredicto Sistema Medusa
      </h2>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <VerdictBadge verdict={verdict} size="md" />
        <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${confidenceDot}`}
          />
          Confianza {confidenceLabel}
        </span>
      </div>
      <p className="mt-4 text-[14px] leading-relaxed text-zinc-200">
        {verdictSummary}
      </p>
      <p className="mt-4 text-[13px] leading-relaxed text-zinc-400">
        <span className="font-medium text-zinc-300">Próximo paso:</span>{" "}
        {verdictSection.next_step}
      </p>
    </section>
  );
}
