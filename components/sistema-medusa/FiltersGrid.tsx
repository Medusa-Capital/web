import { Check, X, Minus } from "lucide-react";
import type { Analysis } from "@/lib/sistema-medusa/schemas";
import type { FilterStatus } from "@/lib/sistema-medusa/enum-values";
import { FilterStatusPill } from "./FilterStatusPill";

interface FiltersGridProps {
  data: Analysis["discard_filters"];
}

const STEP_RESULT_STYLE: Record<string, { label: string; color: string }> = {
  PASA: { label: "Pasa", color: "text-emerald-400" },
  DESCARTE_AUTOMATICO: { label: "Descarte automático", color: "text-red-400" },
};

const MEDALLION_STYLE: Record<
  FilterStatus,
  { ring: string; bg: string; icon: string; iconColor: string }
> = {
  VERDE: {
    ring: "ring-emerald-500/30",
    bg: "bg-emerald-500/10",
    icon: "check",
    iconColor: "text-emerald-400",
  },
  AMARILLO: {
    ring: "ring-amber-500/30",
    bg: "bg-amber-500/10",
    icon: "minus",
    iconColor: "text-amber-400",
  },
  ROJO: {
    ring: "ring-red-500/30",
    bg: "bg-red-500/10",
    icon: "x",
    iconColor: "text-red-400",
  },
};

function MedallionIcon({ status }: { status: FilterStatus }) {
  const m = MEDALLION_STYLE[status];
  const Icon = m.icon === "check" ? Check : m.icon === "x" ? X : Minus;
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ${m.bg} ${m.ring}`}
    >
      <Icon className={`h-4 w-4 ${m.iconColor}`} strokeWidth={3} />
    </span>
  );
}

export function FiltersGrid({ data }: FiltersGridProps) {
  const result = STEP_RESULT_STYLE[data.step_1_result] ?? {
    label: data.step_1_result,
    color: "text-zinc-400",
  };

  return (
    <section aria-labelledby="filters-heading" className="mt-12">
      <header className="mb-6 flex items-end justify-between border-b border-white/[0.08] pb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6366f1]">
            Paso 1
          </p>
          <h2
            id="filters-heading"
            className="mt-2 font-[family-name:var(--font-heading)] text-[32px] font-bold leading-tight text-white sm:text-[38px]"
          >
            Filtros de descarte
          </h2>
        </div>
        <span
          className={`inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider ${result.color}`}
        >
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${
              data.step_1_result === "PASA" ? "bg-emerald-400" : "bg-red-400"
            }`}
          />
          {result.label}
        </span>
      </header>

      {data.step_1_summary && (
        <p className="mb-6 max-w-3xl text-[14px] leading-relaxed text-zinc-300">
          {data.step_1_summary}
        </p>
      )}

      <ol className="grid gap-3 lg:grid-cols-2">
        {data.filters.map((filter, index) => (
          <li
            key={filter.id}
            className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#111118] p-5 transition-colors hover:border-white/[0.12] hover:bg-[#13131e]"
          >
            <div className="flex items-start gap-4">
              <MedallionIcon status={filter.status} />

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-[family-name:var(--font-heading)] text-[18px] font-bold leading-tight text-white">
                      {filter.name}
                    </h3>
                  </div>
                  <FilterStatusPill status={filter.status} />
                </div>

                <p className="mt-2.5 text-[13px] leading-relaxed text-zinc-400">
                  {filter.justification}
                </p>

                {filter.key_metric && (
                  <p className="mt-3 border-t border-white/[0.04] pt-2.5 font-mono text-[11px] text-zinc-500">
                    {filter.key_metric}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
