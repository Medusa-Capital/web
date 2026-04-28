import type { Analysis } from "@/lib/sistema-medusa/schemas";
import { PillarStatusPill } from "./PillarStatusPill";

interface FundamentalPillarsGridProps {
  data: Analysis["fundamental_pillars"];
}

const STEP_RESULT_STYLE: Record<string, { label: string; color: string }> = {
  PASA: { label: "Pasa", color: "text-emerald-400" },
  NO_PASA: { label: "No pasa", color: "text-red-400" },
  PARCIAL: { label: "Parcial", color: "text-amber-400" },
};

export function FundamentalPillarsGrid({ data }: FundamentalPillarsGridProps) {
  const result = STEP_RESULT_STYLE[data.step_2_result] ?? {
    label: data.step_2_result,
    color: "text-zinc-400",
  };

  return (
    <section aria-labelledby="pillars-heading" className="mt-10">
      <header className="mb-5 flex items-baseline justify-between border-b border-white/[0.06] pb-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            Paso 2
          </p>
          <h2
            id="pillars-heading"
            className="mt-1 font-[family-name:var(--font-heading)] text-2xl font-bold text-white"
          >
            Pilares fundamentales
          </h2>
        </div>
        <span className={`text-[12px] font-semibold ${result.color}`}>
          {result.label}
        </span>
      </header>

      {data.step_2_summary && (
        <p className="mb-5 text-[13px] leading-relaxed text-zinc-400">
          {data.step_2_summary}
        </p>
      )}

      <ol className="space-y-4">
        {data.pillars.map((pillar, index) => (
          <li
            key={pillar.id}
            className="overflow-hidden rounded-lg border border-white/[0.06] bg-[#111118]"
          >
            {/* Pillar header */}
            <div className="flex items-start justify-between gap-4 p-5">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                  Pilar {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-heading)] text-xl font-bold text-white">
                  {pillar.name}
                </h3>
              </div>
              <PillarStatusPill status={pillar.status} />
            </div>

            {/* Analysis text */}
            <div className="border-t border-white/[0.04] px-5 py-4">
              <p className="text-[13px] leading-relaxed text-zinc-300">
                {pillar.analysis}
              </p>
            </div>

            {/* Key metrics */}
            {pillar.key_metrics.length > 0 && (
              <div className="border-t border-white/[0.04]">
                <dl className="divide-y divide-white/[0.04]">
                  {pillar.key_metrics.map((metric) => (
                    <div
                      key={metric.metric}
                      className="flex items-baseline justify-between gap-4 px-5 py-2.5"
                    >
                      <dt className="text-[12px] text-zinc-500">
                        {metric.metric}
                      </dt>
                      <dd className="shrink-0 font-mono text-[12px] font-medium text-zinc-200">
                        {metric.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
