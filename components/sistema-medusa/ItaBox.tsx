import type { Analysis } from "@/lib/sistema-medusa/schemas";
import {
  ITA_ANSWER_LABELS,
} from "@/lib/sistema-medusa/enums/ita-answer";

const ITA_STYLE: Record<
  string,
  { bg: string; accent: string; text: string; border: string; quote: string }
> = {
  SI_CLARO: {
    bg: "bg-emerald-500/[0.07]",
    accent: "border-l-emerald-500",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    quote: "text-emerald-500/20",
  },
  SI_CON_RESERVAS: {
    bg: "bg-amber-500/[0.07]",
    accent: "border-l-amber-500",
    text: "text-amber-400",
    border: "border-amber-500/20",
    quote: "text-amber-500/20",
  },
  NO: {
    bg: "bg-red-500/[0.07]",
    accent: "border-l-red-500",
    text: "text-red-400",
    border: "border-red-500/20",
    quote: "text-red-500/20",
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
      className={`relative mt-12 overflow-hidden rounded-xl border-l-4 border border-white/[0.06] p-8 sm:p-10 ${style.bg} ${style.accent}`}
    >
      {/* Editorial quote glyph */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -left-2 -top-6 select-none font-[family-name:var(--font-heading)] text-[180px] font-bold leading-none ${style.quote}`}
      >
        &ldquo;
      </span>

      <div className="relative">
        <p
          id="ita-heading"
          className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500"
        >
          ITA Definitiva — La pregunta única
        </p>

        {/* The question — large editorial Cormorant */}
        <h2 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-[28px] font-bold leading-[1.15] text-white sm:text-[34px] lg:text-[40px]">
          {data.question}
        </h2>

        {/* Answer + rationale row */}
        <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
          <div className="lg:shrink-0">
            <span
              className={`inline-flex items-center gap-2 rounded-md border bg-black/20 px-4 py-2.5 text-[14px] font-bold uppercase tracking-wider ${style.text} ${style.border}`}
            >
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-current" />
              {answerLabel}
            </span>
          </div>
          <p className="max-w-3xl text-[14px] leading-relaxed text-zinc-300 lg:text-[15px]">
            {data.rationale}
          </p>
        </div>
      </div>
    </section>
  );
}
