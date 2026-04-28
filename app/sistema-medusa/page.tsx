// /sistema-medusa — member-only research library.
//
// dynamic = "force-dynamic": this is per-viewer auth, not "to avoid ISR" —
// requireMember() in the layout reads the iron-session cookie on every
// render, which already opts the route out of static generation. Using
// force-dynamic here is documentation: ISR + on-demand revalidation is
// not worth the tooling cost at v1 scale.

import Link from "next/link";
import { z } from "zod";
import { listAnalyses } from "@/lib/sistema-medusa/queries";
import {
  CATEGORY_VALUES,
  CHAIN_VALUES,
  VERDICT_VALUES,
} from "@/lib/sistema-medusa/enum-values";
import { AnalysisCard } from "@/components/sistema-medusa/AnalysisCard";
import { EmptyLibrary } from "@/components/sistema-medusa/EmptyLibrary";
import { HeroSection } from "@/components/sistema-medusa/HeroSection";
import { ListControls } from "@/components/sistema-medusa/ListControls";
import { NoResults } from "@/components/sistema-medusa/NoResults";
import { SistemaMedusaAnalytics } from "@/components/sistema-medusa/SistemaMedusaAnalytics";

export const dynamic = "force-dynamic";

const PAGE_LIMIT = 50;

const searchParamsSchema = z.object({
  verdict: z.enum(VERDICT_VALUES).optional(),
  category: z.enum(CATEGORY_VALUES).optional(),
  chain: z.enum(CHAIN_VALUES).optional(),
  q: z.string().trim().min(1).max(200).optional(),
  sort: z.enum(["newest", "verdict", "ticker"]).default("newest"),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export default async function SistemaMedusaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const flat = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ])
  );

  const parsed = searchParamsSchema.safeParse(flat);
  const params = parsed.success
    ? parsed.data
    : searchParamsSchema.parse({});

  const items = await listAnalyses({
    filters: {
      verdict: params.verdict,
      category: params.category,
      chain: params.chain,
      q: params.q,
    },
    sort: params.sort,
    offset: params.offset,
    limit: PAGE_LIMIT,
  });

  const hasFilters = Boolean(
    params.verdict ?? params.category ?? params.chain ?? params.q
  );

  return (
    <>
      <SistemaMedusaAnalytics
        action="view_list"
        params={{
          result_count: items.length,
          has_filters: hasFilters,
          sort: params.sort,
          offset: params.offset,
        }}
      />
      <HeroSection count={items.length + params.offset} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-lg border border-white/[0.06] bg-[#0d0d14] p-5">
          <ListControls
            selectedVerdict={params.verdict ?? null}
            selectedCategory={params.category ?? null}
            selectedChain={params.chain ?? null}
            initialQ={params.q ?? ""}
            selectedSort={params.sort}
          />
        </div>

        <section className="mt-8">
          {items.length === 0 ? (
            hasFilters ? (
              <NoResults />
            ) : (
              <EmptyLibrary />
            )
          ) : (
            <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <li key={item.ticker}>
                  <AnalysisCard item={item} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {items.length === PAGE_LIMIT ? (
          <Paginator currentOffset={params.offset} params={raw} />
        ) : null}
      </main>
    </>
  );
}

function Paginator({
  currentOffset,
  params,
}: {
  currentOffset: number;
  params: Record<string, string | string[] | undefined>;
}) {
  const next = currentOffset + PAGE_LIMIT;
  const prev = Math.max(0, currentOffset - PAGE_LIMIT);
  const hrefFor = (offset: number) => {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (key === "offset") continue;
      if (typeof value === "string" && value.length > 0) qs.set(key, value);
    }
    if (offset > 0) qs.set("offset", String(offset));
    const s = qs.toString();
    return s ? `/sistema-medusa?${s}` : "/sistema-medusa";
  };

  return (
    <nav
      aria-label="Paginación de análisis"
      className="mt-8 flex items-center justify-between"
    >
      <Link
        href={hrefFor(prev)}
        aria-disabled={currentOffset === 0}
        className={
          "rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[12px] " +
          (currentOffset === 0
            ? "pointer-events-none text-zinc-600"
            : "text-zinc-300 hover:text-white")
        }
      >
        Anterior
      </Link>
      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        Mostrando {currentOffset + 1}–{currentOffset + PAGE_LIMIT}
      </span>
      <Link
        href={hrefFor(next)}
        className="rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[12px] text-zinc-300 hover:text-white"
      >
        Siguiente
      </Link>
    </nav>
  );
}
