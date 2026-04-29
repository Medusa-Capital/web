import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/sistema-medusa/enums/category";
import { CHAIN_LABELS } from "@/lib/sistema-medusa/enums/chain";
import type { AnalysisListItem } from "@/lib/sistema-medusa/queries";
import type { Verdict } from "@/lib/sistema-medusa/enum-values";
import { VerdictBadge } from "./VerdictBadge";

const VERDICT_SPINE: Record<Verdict, string> = {
  AVANZA_A_AT: "bg-emerald-500",
  EN_REVISION: "bg-amber-500",
  DESCARTE: "bg-red-500",
  AT_BLOQUEA: "bg-orange-500",
  EN_CARTERA: "bg-[#6366f1]",
};

const VERDICT_GLOW: Record<Verdict, string> = {
  AVANZA_A_AT: "hover:shadow-[0_0_40px_rgba(52,211,153,0.08)]",
  EN_REVISION: "hover:shadow-[0_0_40px_rgba(251,191,36,0.08)]",
  DESCARTE: "hover:shadow-[0_0_40px_rgba(248,113,113,0.08)]",
  AT_BLOQUEA: "hover:shadow-[0_0_40px_rgba(251,146,60,0.08)]",
  EN_CARTERA: "hover:shadow-[0_0_40px_rgba(99,102,241,0.10)]",
};

const VERDICT_TICKER_TINT: Record<Verdict, string> = {
  AVANZA_A_AT: "group-hover:text-emerald-100",
  EN_REVISION: "group-hover:text-amber-100",
  DESCARTE: "group-hover:text-red-100",
  AT_BLOQUEA: "group-hover:text-orange-100",
  EN_CARTERA: "group-hover:text-[#B9B8EB]",
};

interface AnalysisCardProps {
  item: AnalysisListItem;
}

export function AnalysisCard({ item }: AnalysisCardProps) {
  return (
    <Link
      href={`/sistema-medusa/${item.ticker.toLowerCase()}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-[#111118] transition-all hover:border-white/[0.12] hover:bg-[#13131e] ${VERDICT_GLOW[item.verdict]}`}
    >
      {/* Verdict spine — left edge */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-0 h-full w-[3px] ${VERDICT_SPINE[item.verdict]}`}
      />

      <div className="flex h-full flex-col p-6 pl-7">
        {/* Header: ticker monogram + verdict badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span
              className={`block font-[family-name:var(--font-heading)] text-[44px] font-bold leading-[0.9] tracking-tight text-white transition-colors ${VERDICT_TICKER_TINT[item.verdict]}`}
            >
              {item.ticker}
            </span>
            <p className="mt-1.5 truncate text-[13px] font-medium text-[#B8C0D9]">
              {item.project_name}
            </p>
          </div>
          <VerdictBadge verdict={item.verdict} size="sm" />
        </div>

        {/* Meta row: category · chain · date */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="rounded border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[11px] text-zinc-400">
            {CATEGORY_LABELS[item.category]}
          </span>
          <span className="rounded border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[11px] text-zinc-400">
            {CHAIN_LABELS[item.chain]}
          </span>
          <span className="ml-auto font-mono text-[11px] text-zinc-600">
            {item.data_date}
          </span>
        </div>

        {/* Executive summary — pulls down so footer sticks to bottom */}
        <p className="mt-4 line-clamp-3 flex-1 text-[13px] leading-relaxed text-zinc-400">
          {item.executive_summary}
        </p>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-white/[0.04] pt-3.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-600">
            {item.methodology_version} · v{item.version_number}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-zinc-600 transition-colors group-hover:text-[#B9B8EB]">
            Leer análisis
            <ArrowUpRight
              className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
