import type { Analysis } from "@/lib/sistema-medusa/schemas";
import { PillarStatusPill } from "./PillarStatusPill";

interface FundamentalPillarsGridProps {
  data: Analysis["fundamental_pillars"];
}

const STEP_RESULT_LABELS: Record<string, string> = {
  PASA: "Pasa",
  NO_PASA: "No pasa",
  PARCIAL: "Parcial",
};

export function FundamentalPillarsGrid({ data }: FundamentalPillarsGridProps) {
  return (
    <section aria-labelledby="pillars-heading" className="mt-10">
      <header className="mb-3 flex items-baseline justify-between border-b border-white/[0.06] pb-3">
        <h2 id="pillars-heading" className="text-[15px] font-semibold text-white">
          Pilares fundamentales
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          Paso 2 — {STEP_RESULT_LABELS[data.step_2_result] ?? data.step_2_result}
        </span>
      </header>

      <p className="mb-4 text-[13px] leading-relaxed text-zinc-400">
        {data.step_2_summary}
      </p>

      <ol className="space-y-3">
        {data.pillars.map((pillar, index) => (
          <li
            key={pillar.id}
            className="rounded-lg border border-white/[0.06] bg-[#111118] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[14px] font-semibold text-white">
                <span className="font-mono text-[11px] text-zinc-500">
                  Pilar {String(index + 1).padStart(2, "0")} —{" "}
                </span>
                {pillar.name}
              </h3>
              <PillarStatusPill status={pillar.status} />
            </div>

            <p className="mt-3 text-[13px] leading-relaxed text-zinc-300">
              {pillar.analysis}
            </p>

            {pillar.key_metrics.length > 0 ? (
              <dl className="mt-4 divide-y divide-white/[0.04] border-t border-white/[0.04]">
                {pillar.key_metrics.map((metric) => (
                  <div
                    key={metric.metric}
                    className="flex items-baseline justify-between gap-3 py-2"
                  >
                    <dt className="text-[12px] text-zinc-500">{metric.metric}</dt>
                    <dd className="font-mono text-[12px] text-zinc-200">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
