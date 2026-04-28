import type { Analysis } from "@/lib/sistema-medusa/schemas";
import {
  ITA_ANSWER_DOT,
  ITA_ANSWER_LABELS,
} from "@/lib/sistema-medusa/enums/ita-answer";

interface ItaBoxProps {
  data: Analysis["ita_definitiva"];
}

export function ItaBox({ data }: ItaBoxProps) {
  const answerLabel = ITA_ANSWER_LABELS[data.answer];
  const dot = ITA_ANSWER_DOT[data.answer];
  return (
    <section
      aria-labelledby="ita-heading"
      className="mt-10 rounded-lg border border-[#6366f1]/30 bg-[#6366f1]/[0.06] p-6"
    >
      <h2
        id="ita-heading"
        className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6366f1]"
      >
        ITA Definitiva
      </h2>
      <p className="mt-3 text-[15px] font-medium leading-relaxed text-white">
        {data.question}
      </p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-white/[0.06] bg-[#0a0a0f]/60 px-3 py-1.5 text-[13px] font-semibold uppercase tracking-wider text-white">
        <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {answerLabel}
      </div>
      <p className="mt-4 text-[13px] leading-relaxed text-zinc-300">
        {data.rationale}
      </p>
    </section>
  );
}
