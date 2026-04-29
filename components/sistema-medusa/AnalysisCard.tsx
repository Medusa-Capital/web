import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/sistema-medusa/enums/category";
import { CHAIN_LABELS } from "@/lib/sistema-medusa/enums/chain";
import { getTokenBrand } from "@/lib/sistema-medusa/token-registry";
import type { AnalysisListItem } from "@/lib/sistema-medusa/queries";
import type { Verdict } from "@/lib/sistema-medusa/enum-values";
import { VerdictBadge } from "./VerdictBadge";
import { TokenAvatar } from "./TokenAvatar";

const VERDICT_SPINE: Record<Verdict, string> = {
  AVANZA_A_AT: "bg-emerald-500",
  EN_REVISION: "bg-amber-500",
  DESCARTE: "bg-red-500",
  AT_BLOQUEA: "bg-orange-500",
  EN_CARTERA: "bg-[#6366f1]",
};

interface AnalysisCardProps {
  item: AnalysisListItem;
}

export function AnalysisCard({ item }: AnalysisCardProps) {
  const brand = getTokenBrand(item.ticker);

  return (
    <Link
      href={`/sistema-medusa/${item.ticker.toLowerCase()}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111118] transition-all hover:border-white/[0.14] hover:bg-[#13131e]"
      style={
        {
          // brand-tinted hover glow via CSS var (kept subtle so cards don't fight)
          ["--brand" as string]: brand.brand_color,
        } as React.CSSProperties
      }
    >
      {/* Verdict spine — left edge, semantic */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-0 h-full w-[3px] ${VERDICT_SPINE[item.verdict]}`}
      />

      {/* Brand-tinted ambient glow on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
        style={{ background: brand.brand_color }}
      />

      <div className="relative flex h-full flex-col p-6 pl-7">
        {/* Header: avatar + title block + verdict */}
        <div className="flex items-start gap-4">
          <TokenAvatar
            ticker={item.ticker}
            logoUrl={brand.logo_url}
            brandColor={brand.brand_color}
            size="lg"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <span className="font-[family-name:var(--font-heading)] text-[34px] font-bold leading-[0.95] tracking-tight text-white">
                {item.ticker}
              </span>
              <VerdictBadge verdict={item.verdict} size="sm" />
            </div>
            <p className="mt-1.5 truncate text-[14px] font-medium text-[#B8C0D9]">
              {item.project_name}
            </p>
          </div>
        </div>

        {/* Meta row: category · chain · date */}
        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[11px] text-zinc-300">
            {CATEGORY_LABELS[item.category]}
          </span>
          <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[11px] text-zinc-300">
            {CHAIN_LABELS[item.chain]}
          </span>
          <span className="ml-auto font-mono text-[11px] text-zinc-500">
            {item.data_date}
          </span>
        </div>

        {/* Executive summary — 4 lines for more substance */}
        <p className="mt-4 line-clamp-4 flex-1 text-[13.5px] leading-relaxed text-zinc-300">
          {item.executive_summary}
        </p>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            {item.methodology_version} · v{item.version_number}
          </span>
          <span
            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-zinc-400 transition-colors"
            style={{ color: undefined }}
          >
            <span className="transition-colors group-hover:text-[var(--brand)]">
              Leer análisis
            </span>
            <ArrowUpRight
              className="h-3 w-3 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
