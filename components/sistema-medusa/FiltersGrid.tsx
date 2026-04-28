import type { Analysis } from "@/lib/sistema-medusa/schemas";
import { FilterStatusPill } from "./FilterStatusPill";

interface FiltersGridProps {
  data: Analysis["discard_filters"];
}

const STEP_RESULT_LABELS: Record<string, string> = {
  PASA: "Pasa",
  DESCARTE_AUTOMATICO: "Descarte automático",
};

export function FiltersGrid({ data }: FiltersGridProps) {
  return (
    <section aria-labelledby="filters-heading" className="mt-10">
      <header className="mb-3 flex items-baseline justify-between border-b border-white/[0.06] pb-3">
        <h2 id="filters-heading" className="text-[15px] font-semibold text-white">
          Filtros de descarte
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          Paso 1 — {STEP_RESULT_LABELS[data.step_1_result] ?? data.step_1_result}
        </span>
      </header>

      <p className="mb-4 text-[13px] leading-relaxed text-zinc-400">
        {data.step_1_summary}
      </p>

      <ol className="space-y-2">
        {data.filters.map((filter, index) => (
          <li
            key={filter.id}
            className="rounded-lg border border-white/[0.06] bg-[#111118] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[11px] text-zinc-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[14px] font-medium text-white">
                    {filter.name}
                  </h3>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">
                  {filter.justification}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                  <span className="font-mono">{filter.key_metric}</span>
                </div>
              </div>
              <FilterStatusPill status={filter.status} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
