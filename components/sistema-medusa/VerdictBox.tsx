import type { Analysis } from "@/lib/sistema-medusa/schemas";
import {
  CONFIDENCE_LEVEL_LABELS,
  CONFIDENCE_LEVEL_DOT,
} from "@/lib/sistema-medusa/enums/confidence-level";
import { VERDICT_LABELS } from "@/lib/sistema-medusa/enums/verdict";
import type { Verdict } from "@/lib/sistema-medusa/enum-values";

interface VerdictBoxProps {
  verdict: Analysis["verdict"];
  verdictSummary: string;
  verdictSection: Analysis["verdict_section"];
}

const VERDICT_TINT: Record<Verdict, { text: string; glow: string; bar: string }> = {
  AVANZA_A_AT: {
    text: "text-emerald-400",
    glow: "from-emerald-500/30 via-emerald-500/8 to-transparent",
    bar: "from-emerald-400 via-emerald-500 to-emerald-700",
  },
  EN_REVISION: {
    text: "text-amber-400",
    glow: "from-amber-500/30 via-amber-500/8 to-transparent",
    bar: "from-amber-400 via-amber-500 to-amber-700",
  },
  DESCARTE: {
    text: "text-red-400",
    glow: "from-red-500/30 via-red-500/8 to-transparent",
    bar: "from-red-400 via-red-500 to-red-700",
  },
  AT_BLOQUEA: {
    text: "text-orange-400",
    glow: "from-orange-500/30 via-orange-500/8 to-transparent",
    bar: "from-orange-400 via-orange-500 to-orange-700",
  },
  EN_CARTERA: {
    text: "text-[#B9B8EB]",
    glow: "from-[#6366f1]/30 via-[#6366f1]/8 to-transparent",
    bar: "from-[#B9B8EB] via-[#6366f1] to-[#4338ca]",
  },
};

export function VerdictBox({
  verdict,
  verdictSummary,
  verdictSection,
}: VerdictBoxProps) {
  const confidenceLabel = CONFIDENCE_LEVEL_LABELS[verdictSection.confidence_level];
  const confidenceDot = CONFIDENCE_LEVEL_DOT[verdictSection.confidence_level];
  const tint = VERDICT_TINT[verdict] ?? VERDICT_TINT.EN_REVISION;
  const verdictLabel = VERDICT_LABELS[verdict];

  return (
    <section
      aria-labelledby="verdict-heading"
      className="relative mt-12 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c14]"
    >
      {/* Top accent bar */}
      <div className={`h-[3px] w-full bg-gradient-to-r ${tint.bar}`} />

      {/* Ambient verdict glow */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${tint.glow} opacity-50`}
      />

      <div className="relative p-8 sm:p-10">
        {/* Section eyebrow */}
        <p
          id="verdict-heading"
          className="text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500"
        >
          Veredicto Sistema Medusa
        </p>

        {/* Large editorial verdict statement */}
        <h2
          className={`mt-3 font-[family-name:var(--font-heading)] text-[40px] font-bold leading-[1.05] tracking-tight sm:text-[52px] lg:text-[60px] ${tint.text}`}
        >
          {verdictLabel}
        </h2>

        {/* Confidence indicator */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12px] font-medium text-zinc-300">
          <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${confidenceDot}`} />
          Confianza {confidenceLabel}
        </div>

        {/* Summary */}
        <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-[#CCCCE0] lg:text-[16px]">
          {verdictSummary}
        </p>

        {/* Next step */}
        <div className="mt-7 rounded-lg border border-white/[0.08] bg-black/30 p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
            Próximo paso
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-zinc-200">
            {verdictSection.next_step}
          </p>
        </div>
      </div>
    </section>
  );
}
