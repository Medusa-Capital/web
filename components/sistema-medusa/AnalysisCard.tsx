import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/sistema-medusa/enums/category";
import { CHAIN_LABELS } from "@/lib/sistema-medusa/enums/chain";
import type { AnalysisListItem } from "@/lib/sistema-medusa/queries";
import { MethodologyTag } from "./MethodologyTag";
import { VerdictBadge } from "./VerdictBadge";

interface AnalysisCardProps {
  item: AnalysisListItem;
}

export function AnalysisCard({ item }: AnalysisCardProps) {
  return (
    <Link
      href={`/sistema-medusa/${item.ticker.toLowerCase()}`}
      className="group block rounded-lg border border-white/[0.06] bg-[#111118] p-5 transition-colors hover:border-white/[0.12] hover:bg-[#13131c]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[13px] uppercase text-zinc-300">
              {item.ticker}
            </span>
            <span className="truncate text-[15px] font-semibold tracking-tight text-white group-hover:text-white">
              {item.project_name}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-500">
            <span>{CATEGORY_LABELS[item.category]}</span>
            <span aria-hidden="true">·</span>
            <span>{CHAIN_LABELS[item.chain]}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{item.data_date}</span>
          </div>
        </div>
        <VerdictBadge verdict={item.verdict} />
      </div>

      <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-zinc-400">
        {item.executive_summary}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <MethodologyTag version={item.methodology_version} />
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          v{item.version_number}
        </span>
      </div>
    </Link>
  );
}
