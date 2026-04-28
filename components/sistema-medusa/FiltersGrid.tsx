import type { Analysis } from "@/lib/sistema-medusa/schemas";
import { FilterStatusPill } from "./FilterStatusPill";

interface FiltersGridProps {
  data: Analysis["discard_filters"];
}

const STEP_RESULT_STYLE: Record<string, { label: string; color: string }> = {
  PASA: { label: "Pasa", color: "text-emerald-400" },
  DESCARTE_AUTOMATICO: { label: "Descarte automático", color: "text-red-400" },
};

export function FiltersGrid({ data }: FiltersGridProps) {
  const result = STEP_RESULT_STYLE[data.step_1_result] ?? {
    label: data.step_1_result,
    color: "text-zinc-400",
  };

  return (
    <section aria-labelledby="filters-heading" className="mt-10">
      <header className="mb-5 flex items-baseline justify-between border-b border-white/[0.06] pb-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            Paso 1
          </p>
          <h2
            id="filters-heading"
            className="mt-1 font-[family-name:var(--font-heading)] text-2xl font-bold text-white"
          >
            Filtros de descarte
          </h2>
        </div>
        <span className={`text-[12px] font-semibold ${result.color}`}>
          {result.label}
        </span>
      </header>

      {data.step_1_summary && (
        <p className="mb-5 text-[13px] leading-relaxed text-zinc-400">
          {data.step_1_summary}
        </p>
      )}

      <ol className="space-y-3">
        {data.filters.map((filter, index) => (
          <li
            key={filter.id}
            className="rounded-lg border border-white/[0.06] bg-[#111118] p-5 transition-colors hover:bg-[#13131e]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="shrink-0 font-mono text-[10px] font-semibold text-zinc-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[14px] font-semibold text-white">
                    {filter.name}
                  </h3>
                </div>
                <p className="mt-2.5 text-[13px] leading-relaxed text-zinc-400">
                  {filter.justification}
                </p>
                {filter.key_metric && (
                  <p className="mt-2.5 font-mono text-[11px] text-zinc-600">
                    {filter.key_metric}
                  </p>
                )}
              </div>
              <div className="shrink-0">
                <FilterStatusPill status={filter.status} />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
