import type { Analysis } from "@/lib/sistema-medusa/schemas";
import {
  ITA_ANSWER_LABELS,
} from "@/lib/sistema-medusa/enums/ita-answer";

const ITA_STYLE: Record<string, { bg: string; accent: string; text: string; border: string }> = {
  SI_CLARO: {
    bg: "bg-emerald-500/[0.07]",
    accent: "border-l-emerald-500",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  SI_CON_RESERVAS: {
    bg: "bg-amber-500/[0.07]",
    accent: "border-l-amber-500",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  NO: {
    bg: "bg-red-500/[0.07]",
    accent: "border-l-red-500",
    text: "text-red-400",
    border: "border-red-500/20",
  },
};

interface ItaBoxProps {
  data: Analysis["ita_definitiva"];
}

export function ItaBox({ data }: ItaBoxProps) {
  const answerLabel = ITA_ANSWER_LABELS[data.answer];
  const style = ITA_STYLE[data.answer] ?? ITA_STYLE["SI_CLARO"];

  return (
    <section
      aria-labelledby="ita-heading"
      className={`mt-10 rounded-lg border-l-4 border border-white/[0.06] p-7 ${style.bg} ${style.accent}`}
    >
      {/* Section label */}
      <p
        id="ita-heading"
        className="text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-500"
      >
        ITA Definitiva
      </p>

      {/* The question — large Cormorant */}
      <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-bold leading-snug text-white sm:text-3xl">
        {data.question}
      </h2>

      {/* Answer badge */}
      <div className="mt-5">
        <span
          className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-[13px] font-bold uppercase tracking-wider ${style.text} ${style.border} bg-black/20`}
        >
          <span aria-hidden="true" className={`h-2 w-2 rounded-full bg-current`} />
          {answerLabel}
        </span>
      </div>

      {/* Rationale */}
      <p className="mt-5 text-[13px] leading-relaxed text-zinc-300">
        {data.rationale}
      </p>
    </section>
  );
}
