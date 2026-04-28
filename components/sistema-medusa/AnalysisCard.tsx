import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/sistema-medusa/enums/category";
import { CHAIN_LABELS } from "@/lib/sistema-medusa/enums/chain";
import type { AnalysisListItem } from "@/lib/sistema-medusa/queries";
import type { Verdict } from "@/lib/sistema-medusa/enum-values";
import { VerdictBadge } from "./VerdictBadge";

const VERDICT_BORDER: Record<Verdict, string> = {
  AVANZA_A_AT: "border-l-emerald-500",
  EN_REVISION: "border-l-amber-500",
  DESCARTE: "border-l-red-500",
  AT_BLOQUEA: "border-l-orange-500",
  EN_CARTERA: "border-l-[#6366f1]",
};

const VERDICT_GLOW: Record<Verdict, string> = {
  AVANZA_A_AT: "hover:shadow-[0_0_30px_rgba(52,211,153,0.06)]",
  EN_REVISION: "hover:shadow-[0_0_30px_rgba(251,191,36,0.06)]",
  DESCARTE: "hover:shadow-[0_0_30px_rgba(248,113,113,0.06)]",
  AT_BLOQUEA: "hover:shadow-[0_0_30px_rgba(251,146,60,0.06)]",
  EN_CARTERA: "hover:shadow-[0_0_30px_rgba(99,102,241,0.08)]",
};

interface AnalysisCardProps {
  item: AnalysisListItem;
}

export function AnalysisCard({ item }: AnalysisCardProps) {
  return (
    <Link
      href={`/sistema-medusa/${item.ticker.toLowerCase()}`}
      className={`group flex flex-col rounded-lg border border-l-2 border-white/[0.06] bg-[#111118] p-6 transition-all hover:border-white/[0.1] hover:bg-[#13131e] ${VERDICT_BORDER[item.verdict]} ${VERDICT_GLOW[item.verdict]}`}
    >
      {/* Ticker — large editorial serif */}
      <div className="flex items-start justify-between gap-3">
        <span className="font-[family-name:var(--font-heading)] text-4xl font-bold leading-none tracking-tight text-white">
          {item.ticker}
        </span>
        <VerdictBadge verdict={item.verdict} size="sm" />
      </div>

      {/* Project name */}
      <p className="mt-2 text-[13px] font-medium text-[#B8C0D9]">
        {item.project_name}
      </p>

      {/* Meta row */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
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

      {/* Executive summary */}
      <p className="mt-4 line-clamp-3 flex-1 text-[13px] leading-relaxed text-zinc-400">
        {item.executive_summary}
      </p>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-white/[0.04] pt-3.5">
        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
          {item.methodology_version} · v{item.version_number}
        </span>
        <ArrowUpRight
          className="h-3.5 w-3.5 text-zinc-700 transition-all group-hover:text-[#6366f1] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
