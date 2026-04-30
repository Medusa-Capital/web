import { Check, X, Minus, HelpCircle } from "lucide-react";
import type { Analysis } from "@/lib/sistema-medusa/schemas";
import type { PillarStatus } from "@/lib/sistema-medusa/enum-values";
import { PillarStatusPill } from "./PillarStatusPill";

interface FundamentalPillarsGridProps {
  data: Analysis["fundamental_pillars"];
}

const STEP_RESULT_STYLE: Record<string, { label: string; color: string; dot: string }> = {
  PASA: { label: "Pasa", color: "text-emerald-400", dot: "bg-emerald-400" },
  NO_PASA: { label: "No pasa", color: "text-red-400", dot: "bg-red-400" },
  PARCIAL: { label: "Parcial", color: "text-amber-400", dot: "bg-amber-400" },
};

const PILLAR_RING: Record<PillarStatus, { ring: string; bg: string; iconColor: string; icon: string }> = {
  VERDE: {
    ring: "ring-emerald-500/30",
    bg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    icon: "check",
  },
  AMARILLO: {
    ring: "ring-amber-500/30",
    bg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    icon: "minus",
  },
  ROJO: {
    ring: "ring-red-500/30",
    bg: "bg-red-500/10",
    iconColor: "text-red-400",
    icon: "x",
  },
  NO_VERIFICABLE: {
    ring: "ring-zinc-700",
    bg: "bg-zinc-800/40",
    iconColor: "text-zinc-500",
    icon: "help",
  },
};

function PillarMedallion({ status }: { status: PillarStatus }) {
  const m = PILLAR_RING[status];
  const Icon =
    m.icon === "check" ? Check : m.icon === "x" ? X : m.icon === "help" ? HelpCircle : Minus;
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-1 ${m.bg} ${m.ring}`}
    >
      <Icon className={`h-5 w-5 ${m.iconColor}`} strokeWidth={2.5} />
    </span>
  );
}

export function FundamentalPillarsGrid({ data }: FundamentalPillarsGridProps) {
  const result = STEP_RESULT_STYLE[data.step_2_result] ?? {
    label: data.step_2_result,
    color: "text-zinc-400",
    dot: "bg-zinc-400",
  };

  return (
    <section aria-labelledby="pillars-heading" className="mt-12">
      <header className="mb-6 flex items-end justify-between border-b border-white/[0.08] pb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6366f1]">
            Paso 2
          </p>
          <h2
            id="pillars-heading"
            className="mt-2 font-[family-name:var(--font-heading)] text-[32px] font-bold leading-tight text-white sm:text-[38px]"
          >
            Pilares fundamentales
          </h2>
        </div>
        <span
          className={`inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider ${result.color}`}
        >
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${result.dot}`} />
          {result.label}
        </span>
      </header>

      {data.step_2_summary && (
        <p className="mb-6 max-w-3xl text-[14px] leading-relaxed text-zinc-300">
          {data.step_2_summary}
        </p>
      )}

      <ol className="grid gap-4 lg:grid-cols-2">
        {data.pillars.map((pillar, index) => (
          <li
            key={pillar.id}
            className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#111118] transition-colors hover:border-white/[0.12]"
          >
            {/* Pillar header */}
            <div className="flex items-start gap-4 p-6">
              <PillarMedallion status={pillar.status} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                      Pilar {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 font-[family-name:var(--font-heading)] text-[24px] font-bold leading-tight text-white">
                      {pillar.name}
                    </h3>
                  </div>
                  <PillarStatusPill status={pillar.status} />
                </div>
              </div>
            </div>

            {/* Analysis text */}
            <div className="border-t border-white/[0.04] px-6 py-4">
              <p className="text-[13px] leading-relaxed text-zinc-300">
                {pillar.analysis}
              </p>
            </div>

            {/* Key metrics */}
            {pillar.key_metrics.length > 0 && (
              <div className="border-t border-white/[0.04] bg-white/[0.02]">
                <dl className="divide-y divide-white/[0.04]">
                  {pillar.key_metrics.map((metric) => (
                    <div
                      key={metric.metric}
                      className="flex items-baseline justify-between gap-4 px-6 py-2.5"
                    >
                      <dt className="text-[12px] text-zinc-500">{metric.metric}</dt>
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
