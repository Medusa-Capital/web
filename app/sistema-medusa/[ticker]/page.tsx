// /sistema-medusa/[ticker] — detail page (member-gated by parent layout).
//
// Builds the AnalysisView discriminated union once at the top so section
// components stay mode-agnostic. v1 always renders mode="member"; v2's
// /analisis/[ticker] will render mode="public" from the same components.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAnalysisIdByTicker,
  getMemberVersionView,
  getMemberView,
  listVersions,
} from "@/lib/sistema-medusa/queries";
import {
  CATEGORY_LABELS,
} from "@/lib/sistema-medusa/enums/category";
import { CHAIN_LABELS } from "@/lib/sistema-medusa/enums/chain";
import { VERDICT_LABELS } from "@/lib/sistema-medusa/enums/verdict";
import type { AnalysisView } from "@/lib/sistema-medusa/types";
import { BaseDataTable } from "@/components/sistema-medusa/BaseDataTable";
import { ComparativeTable } from "@/components/sistema-medusa/ComparativeTable";
import { ComplianceDisclaimer } from "@/components/sistema-medusa/ComplianceDisclaimer";
import { FiltersGrid } from "@/components/sistema-medusa/FiltersGrid";
import { FundamentalPillarsGrid } from "@/components/sistema-medusa/FundamentalPillarsGrid";
import { ItaBox } from "@/components/sistema-medusa/ItaBox";
import { MethodologyTag } from "@/components/sistema-medusa/MethodologyTag";
import { RisksSection } from "@/components/sistema-medusa/RisksSection";
import { SourcesList } from "@/components/sistema-medusa/SourcesList";
import { VerdictBadge } from "@/components/sistema-medusa/VerdictBadge";
import { VerdictBox } from "@/components/sistema-medusa/VerdictBox";
import { VersionNavigator } from "@/components/sistema-medusa/VersionNavigator";

export const dynamic = "force-dynamic";

const VERSION_REGEX = /^\d{1,4}$/;
const TICKER_REGEX = /^[a-z0-9]{1,20}$/;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticker: string }>;
}): Promise<Metadata> {
  const { ticker } = await params;
  return {
    title: `${ticker.toUpperCase()} — Sistema Medusa`,
    robots: { index: false, follow: false },
  };
}

export default async function SistemaMedusaDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ ticker: string }>;
  searchParams: Promise<{ v?: string }>;
}) {
  const { ticker: rawTicker } = await params;
  const sp = await searchParams;

  if (!TICKER_REGEX.test(rawTicker)) notFound();
  const ticker = rawTicker.toUpperCase();
  const tickerLower = rawTicker.toLowerCase();

  const versionParam = sp.v;
  const versionNumber =
    versionParam && VERSION_REGEX.test(versionParam)
      ? Number.parseInt(versionParam, 10)
      : null;

  const data =
    versionNumber !== null
      ? await getMemberVersionView(ticker, versionNumber)
      : await getMemberView(ticker);

  if (!data) notFound();

  const view: AnalysisView = { mode: "member", data };

  const analysisId = await getAnalysisIdByTicker(ticker);
  const versions = analysisId ? await listVersions(analysisId) : [];
  const versionOptions = versions.map((v) => ({
    version_number: v.version_number,
    published_at: v.published_at.toISOString().slice(0, 10),
    verdict_label: VERDICT_LABELS[v.verdict],
  }));
  const selectedVersion =
    versionNumber ?? Math.max(...versions.map((v) => v.version_number), 1);

  return (
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="border-b border-white/[0.06] pb-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6366f1]">
          Medusa Capital — Sistema Medusa {view.data.methodology_version}
        </p>
        <div className="mt-3 flex flex-wrap items-baseline gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {view.data.project_name}
          </h1>
          <span className="rounded border border-white/[0.06] bg-[#111118] px-2 py-1 font-mono text-[13px] text-zinc-300">
            {view.data.ticker}
          </span>
          <VerdictBadge verdict={view.data.verdict} size="md" />
        </div>

        <dl className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-[12px] text-zinc-500">
          <div>
            <dt className="inline">Categoría: </dt>
            <dd className="inline text-zinc-300">
              {CATEGORY_LABELS[view.data.category]}
            </dd>
          </div>
          <div>
            <dt className="inline">Chain: </dt>
            <dd className="inline text-zinc-300">
              {CHAIN_LABELS[view.data.chain]}
            </dd>
          </div>
          <div>
            <dt className="inline">Fecha del análisis: </dt>
            <dd className="inline font-mono text-zinc-300">
              {view.data.analysis_date}
            </dd>
          </div>
          <div>
            <dt className="inline">Analista: </dt>
            <dd className="inline text-zinc-300">{view.data.analyst}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <MethodologyTag version={view.data.methodology_version} />
          {view.data.tags.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {view.data.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[10px] uppercase tracking-wider text-zinc-500"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="ml-auto">
            <VersionNavigator
              ticker={tickerLower}
              options={versionOptions}
              selectedVersion={selectedVersion}
            />
          </div>
        </div>
      </header>

      <p className="mt-6 text-[14px] leading-relaxed text-zinc-300">
        {view.data.executive_summary}
      </p>

      {view.mode === "member" ? (
        <>
          <BaseDataTable data={view.data.base_data} />
          <FiltersGrid data={view.data.discard_filters} />
          <FundamentalPillarsGrid data={view.data.fundamental_pillars} />
          <ItaBox data={view.data.ita_definitiva} />
          <ComparativeTable
            data={view.data.comparative_analysis}
            ownTicker={view.data.ticker}
          />
          <RisksSection data={view.data.risks_and_watchpoints} />
          <VerdictBox
            verdict={view.data.verdict}
            verdictSummary={view.data.verdict_summary}
            verdictSection={view.data.verdict_section}
          />
          <SourcesList data={view.data.sources} />
        </>
      ) : null}

      <ComplianceDisclaimer />
    </article>
  );
}
