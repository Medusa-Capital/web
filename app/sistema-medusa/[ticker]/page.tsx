import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAnalysisIdByTicker,
  getMemberVersionView,
  getMemberView,
  listVersions,
} from "@/lib/sistema-medusa/queries";
import { getSessionCachedRole } from "@/lib/auth/require";
import { CATEGORY_LABELS } from "@/lib/sistema-medusa/enums/category";
import { CHAIN_LABELS } from "@/lib/sistema-medusa/enums/chain";
import { VERDICT_LABELS } from "@/lib/sistema-medusa/enums/verdict";
import type { AnalysisView } from "@/lib/sistema-medusa/types";
import type { Verdict } from "@/lib/sistema-medusa/enum-values";
import { BaseDataTable } from "@/components/sistema-medusa/BaseDataTable";
import { ComparativeTable } from "@/components/sistema-medusa/ComparativeTable";
import { ComplianceDisclaimer } from "@/components/sistema-medusa/ComplianceDisclaimer";
import { FiltersGrid } from "@/components/sistema-medusa/FiltersGrid";
import { FundamentalPillarsGrid } from "@/components/sistema-medusa/FundamentalPillarsGrid";
import { ItaBox } from "@/components/sistema-medusa/ItaBox";
import { MethodologyTag } from "@/components/sistema-medusa/MethodologyTag";
import { RisksSection } from "@/components/sistema-medusa/RisksSection";
import { SourcesList } from "@/components/sistema-medusa/SourcesList";
import { SistemaMedusaAnalytics } from "@/components/sistema-medusa/SistemaMedusaAnalytics";
import { VerdictBadge } from "@/components/sistema-medusa/VerdictBadge";
import { VerdictBox } from "@/components/sistema-medusa/VerdictBox";
import { VersionNavigator } from "@/components/sistema-medusa/VersionNavigator";
import { DeleteAnalysisButton } from "@/components/sistema-medusa/DeleteAnalysisButton";
import { TokenAvatar } from "@/components/sistema-medusa/TokenAvatar";
import { getTokenBrand } from "@/lib/sistema-medusa/token-registry";
import { deleteAnalysis } from "./actions";

export const dynamic = "force-dynamic";

const VERSION_REGEX = /^\d{1,4}$/;
const TICKER_REGEX = /^[a-z0-9]{1,20}$/;

const VERDICT_BAR: Record<Verdict, string> = {
  AVANZA_A_AT: "bg-emerald-500",
  EN_REVISION: "bg-amber-500",
  DESCARTE: "bg-red-500",
  AT_BLOQUEA: "bg-orange-500",
  EN_CARTERA: "bg-[#6366f1]",
};

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
  const role = await getSessionCachedRole();

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

  const verdictBar = VERDICT_BAR[view.data.verdict] ?? VERDICT_BAR.EN_REVISION;
  const brand = getTokenBrand(view.data.ticker);

  return (
    <article>
      <SistemaMedusaAnalytics
        action="view_detail"
        params={{
          ticker,
          version_number: selectedVersion,
          verdict: view.data.verdict,
          methodology_version: view.data.methodology_version,
        }}
      />

      {/* Editorial header — full-width, brand-tinted glow */}
      <header className="relative overflow-hidden border-b border-white/[0.06] bg-[#0a0a0f]">
        {/* Brand-tinted ambient glow — radial wash from upper-left */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 1100px 420px at 18% 0%, ${brand.brand_color}55 0%, ${brand.brand_color}1a 38%, transparent 72%)`,
          }}
        />
        {/* Secondary brand wash from the right — keeps the dark side from feeling dead */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 700px 300px at 90% 0%, ${brand.brand_color}22 0%, transparent 60%)`,
          }}
        />

        <div className="relative mx-auto max-w-[1500px] px-4 pb-10 pt-10 sm:px-6 lg:px-10">
          {/* Breadcrumb */}
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#6366f1]">
            Medusa Capital — Sistema Medusa {view.data.methodology_version}
          </p>

          {/* Avatar + project name */}
          <div className="mt-5 flex items-center gap-5">
            <TokenAvatar
              ticker={view.data.ticker}
              logoUrl={brand.logo_url}
              brandColor={brand.brand_color}
              size="xl"
            />
            <h1 className="font-[family-name:var(--font-heading)] text-5xl font-bold leading-[1.0] tracking-tight text-white sm:text-6xl lg:text-[68px]">
              {view.data.project_name}
            </h1>
          </div>

          {/* Ticker + verdict badge row */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              className="rounded-md border px-3 py-1 font-mono text-[15px] font-semibold"
              style={{
                color: brand.brand_color,
                borderColor: `${brand.brand_color}40`,
                backgroundColor: `${brand.brand_color}14`,
              }}
            >
              {view.data.ticker}
            </span>
            <VerdictBadge verdict={view.data.verdict} size="lg" />
          </div>

          {/* Meta row */}
          <dl className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[12px] text-zinc-500">
            <div>
              <dt className="inline">Categoría: </dt>
              <dd className="inline text-zinc-300">{CATEGORY_LABELS[view.data.category]}</dd>
            </div>
            <div>
              <dt className="inline">Chain: </dt>
              <dd className="inline text-zinc-300">{CHAIN_LABELS[view.data.chain]}</dd>
            </div>
            <div>
              <dt className="inline">Análisis: </dt>
              <dd className="inline font-mono text-zinc-300">{view.data.analysis_date}</dd>
            </div>
            <div>
              <dt className="inline">Analista: </dt>
              <dd className="inline text-zinc-300">{view.data.analyst}</dd>
            </div>
          </dl>

          {/* Tags + methodology + version navigator */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
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
            <div className="ml-auto flex items-center gap-3">
              <VersionNavigator
                ticker={tickerLower}
                options={versionOptions}
                selectedVersion={selectedVersion}
              />
              {role === "internal" ? (
                <DeleteAnalysisButton
                  ticker={ticker}
                  onDelete={deleteAnalysis.bind(null, ticker)}
                />
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* Content area — two-column on large screens */}
      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex gap-10">
          {/* Main content column */}
          <div className="min-w-0 flex-1">
            {/* Executive summary — editorial lead with drop-cap-ish weight */}
            <p className="text-[16px] leading-relaxed text-zinc-200 lg:text-[17px]">
              {view.data.executive_summary}
            </p>

            {view.mode === "member" ? (
              <>
                <ScoreSummaryStrip
                  filters={view.data.discard_filters.filters.map((f) => f.status)}
                  pillars={view.data.fundamental_pillars.pillars.map((p) => p.status)}
                  itaAnswer={view.data.ita_definitiva.answer}
                />
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
          </div>

          {/* Sticky sidebar — hidden on mobile/tablet */}
          {view.mode === "member" ? (
            <aside className="hidden w-72 shrink-0 xl:block">
              <div className="sticky top-20 space-y-4">
                {/* Verdict summary card */}
                <div className="overflow-hidden rounded-lg border border-white/[0.06] bg-[#111118]">
                  <div className={`h-0.5 w-full ${verdictBar}`} />
                  <div className="p-5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                      Veredicto
                    </p>
                    <div className="mt-3">
                      <VerdictBadge verdict={view.data.verdict} size="lg" />
                    </div>
                    <p className="mt-4 text-[12px] leading-relaxed text-zinc-400">
                      {view.data.verdict_summary}
                    </p>
                  </div>
                </div>

                {/* Key metadata card */}
                <div className="rounded-lg border border-white/[0.06] bg-[#111118] p-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                    Ficha técnica
                  </p>
                  <dl className="mt-4 space-y-3">
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        Activo
                      </dt>
                      <dd className="mt-0.5 font-mono text-[13px] font-semibold text-white">
                        {view.data.ticker}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        Categoría
                      </dt>
                      <dd className="mt-0.5 text-[13px] text-zinc-300">
                        {CATEGORY_LABELS[view.data.category]}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        Chain
                      </dt>
                      <dd className="mt-0.5 text-[13px] text-zinc-300">
                        {CHAIN_LABELS[view.data.chain]}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        Fecha del análisis
                      </dt>
                      <dd className="mt-0.5 font-mono text-[12px] text-zinc-300">
                        {view.data.analysis_date}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        Analista
                      </dt>
                      <dd className="mt-0.5 text-[13px] text-zinc-300">
                        {view.data.analyst}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        Metodología
                      </dt>
                      <dd className="mt-1">
                        <MethodologyTag version={view.data.methodology_version} />
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Version navigator card */}
                {versionOptions.length > 1 ? (
                  <div className="rounded-lg border border-white/[0.06] bg-[#111118] p-5">
                    <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                      Versiones
                    </p>
                    <VersionNavigator
                      ticker={tickerLower}
                      options={versionOptions}
                      selectedVersion={selectedVersion}
                    />
                  </div>
                ) : null}

                {/* Tags */}
                {view.data.tags.length > 0 ? (
                  <div className="rounded-lg border border-white/[0.06] bg-[#111118] p-5">
                    <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                      Tags
                    </p>
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
                  </div>
                ) : null}
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </article>
  );
}

const ITA_LABEL: Record<string, { label: string; tone: string }> = {
  SI_CLARO: { label: "Sí, claro", tone: "text-emerald-400" },
  SI_CON_RESERVAS: { label: "Sí, con reservas", tone: "text-amber-400" },
  NO: { label: "No", tone: "text-red-400" },
};

function ScoreSummaryStrip({
  filters,
  pillars,
  itaAnswer,
}: {
  filters: string[];
  pillars: string[];
  itaAnswer: string;
}) {
  const filterPass = filters.filter((s) => s === "VERDE").length;
  const pillarPass = pillars.filter((s) => s === "VERDE").length;
  const ita = ITA_LABEL[itaAnswer] ?? { label: itaAnswer, tone: "text-zinc-300" };

  const dotClass = (s: string) =>
    s === "VERDE"
      ? "bg-emerald-500"
      : s === "AMARILLO"
        ? "bg-amber-500"
        : s === "ROJO"
          ? "bg-red-500"
          : "bg-zinc-700";

  return (
    <section
      aria-label="Resumen del análisis"
      className="mt-8 grid gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.04] sm:grid-cols-3"
    >
      {/* Filters score */}
      <div className="bg-[#0e0e15] p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
          Paso 1 · Filtros
        </p>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="font-[family-name:var(--font-heading)] text-3xl font-bold leading-none text-white">
            {filterPass}
          </span>
          <span className="font-mono text-[12px] text-zinc-500">
            / {filters.length} superados
          </span>
        </div>
        <ul className="mt-3 flex items-center gap-1.5">
          {filters.map((s, i) => (
            <li
              key={i}
              aria-hidden="true"
              className={`h-1.5 w-6 rounded-full ${dotClass(s)}`}
            />
          ))}
        </ul>
      </div>

      {/* Pillars score */}
      <div className="bg-[#0e0e15] p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
          Paso 2 · Pilares
        </p>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="font-[family-name:var(--font-heading)] text-3xl font-bold leading-none text-white">
            {pillarPass}
          </span>
          <span className="font-mono text-[12px] text-zinc-500">
            / {pillars.length} en verde
          </span>
        </div>
        <ul className="mt-3 flex items-center gap-1.5">
          {pillars.map((s, i) => (
            <li
              key={i}
              aria-hidden="true"
              className={`h-1.5 flex-1 rounded-full ${dotClass(s)}`}
            />
          ))}
        </ul>
      </div>

      {/* ITA */}
      <div className="bg-[#0e0e15] p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
          ITA Definitiva
        </p>
        <div className="mt-2.5">
          <span
            className={`font-[family-name:var(--font-heading)] text-3xl font-bold leading-none ${ita.tone}`}
          >
            {ita.label}
          </span>
        </div>
        <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-zinc-600">
          ¿Gano dinero si el proyecto gana?
        </p>
      </div>
    </section>
  );
}
