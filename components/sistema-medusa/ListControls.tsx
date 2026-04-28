"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { trackSistemaMedusaEvent } from "@/lib/analytics";
import {
  CATEGORY_VALUES,
  CHAIN_VALUES,
  VERDICT_VALUES,
} from "@/lib/sistema-medusa/enum-values";
import {
  CATEGORY_DOT,
  CATEGORY_LABELS,
} from "@/lib/sistema-medusa/enums/category";
import {
  CHAIN_DOT,
  CHAIN_LABELS,
} from "@/lib/sistema-medusa/enums/chain";
import {
  VERDICT_DOT,
  VERDICT_LABELS,
} from "@/lib/sistema-medusa/enums/verdict";

const SORT_LABELS = {
  newest: "Más reciente",
  verdict: "Por veredicto",
  ticker: "Por ticker",
} as const;
type SortKey = keyof typeof SORT_LABELS;

interface ListControlsProps {
  selectedVerdict: string | null;
  selectedCategory: string | null;
  selectedChain: string | null;
  initialQ: string;
  selectedSort: SortKey;
}

export function ListControls({
  selectedVerdict,
  selectedCategory,
  selectedChain,
  initialQ,
  selectedSort,
}: ListControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(initialQ);

  useEffect(() => {
    setQ(initialQ);
  }, [initialQ]);

  const buildHref = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) params.delete(key);
      else params.set(key, value);
      params.delete("offset");
      const qs = params.toString();
      return qs ? `/sistema-medusa?${qs}` : "/sistema-medusa";
    },
    [searchParams]
  );

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedSearch = useCallback(
    (value: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        const trimmed = value.trim();
        if (trimmed.length === 0) params.delete("q");
        else params.set("q", trimmed);
        params.delete("offset");
        const qs = params.toString();
        trackSistemaMedusaEvent("search", {
          query_length: trimmed.length,
          has_query: trimmed.length > 0,
        });
        router.replace(qs ? `/sistema-medusa?${qs}` : "/sistema-medusa");
      }, 300);
    },
    [router, searchParams]
  );

  return (
    <div className="space-y-4">
      <label className="relative block">
        <span className="sr-only">Buscar análisis</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
        />
        <input
          type="search"
          value={q}
          onChange={(event) => {
            const next = event.target.value;
            setQ(next);
            debouncedSearch(next);
          }}
          placeholder="Buscar por ticker o nombre…"
          className="w-full rounded-md border border-white/[0.06] bg-[#111118] py-2 pl-9 pr-3 text-[13px] text-white placeholder:text-zinc-500 focus:border-[#6366f1]/40 focus:outline-none focus:ring-1 focus:ring-[#6366f1]/30"
          maxLength={200}
        />
      </label>

      <div
        role="radiogroup"
        aria-label="Filtrar por veredicto"
        className="flex flex-wrap items-center gap-1.5"
      >
        <FilterPill
          href={buildHref("verdict", null)}
          isActive={!selectedVerdict}
          label="Todos los veredictos"
          analytics={{ filter_type: "verdict", filter_value: "all" }}
        />
        {VERDICT_VALUES.map((value) => (
          <FilterPill
            key={value}
            href={buildHref("verdict", value)}
            isActive={selectedVerdict === value}
            label={VERDICT_LABELS[value]}
            dotClass={VERDICT_DOT[value]}
            analytics={{ filter_type: "verdict", filter_value: value }}
          />
        ))}
      </div>

      <div
        role="radiogroup"
        aria-label="Filtrar por categoría"
        className="flex flex-wrap items-center gap-1.5"
      >
        <FilterPill
          href={buildHref("category", null)}
          isActive={!selectedCategory}
          label="Todas las categorías"
          analytics={{ filter_type: "category", filter_value: "all" }}
        />
        {CATEGORY_VALUES.map((value) => (
          <FilterPill
            key={value}
            href={buildHref("category", value)}
            isActive={selectedCategory === value}
            label={CATEGORY_LABELS[value]}
            dotClass={CATEGORY_DOT[value]}
            analytics={{ filter_type: "category", filter_value: value }}
          />
        ))}
      </div>

      <div
        role="radiogroup"
        aria-label="Filtrar por chain"
        className="flex flex-wrap items-center gap-1.5"
      >
        <FilterPill
          href={buildHref("chain", null)}
          isActive={!selectedChain}
          label="Todas las chains"
          analytics={{ filter_type: "chain", filter_value: "all" }}
        />
        {CHAIN_VALUES.map((value) => (
          <FilterPill
            key={value}
            href={buildHref("chain", value)}
            isActive={selectedChain === value}
            label={CHAIN_LABELS[value]}
            dotClass={CHAIN_DOT[value]}
            analytics={{ filter_type: "chain", filter_value: value }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <span className="text-[11px] uppercase tracking-wider text-zinc-500">
          Orden
        </span>
        <div className="flex flex-wrap items-center gap-1">
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <FilterPill
              key={key}
              href={buildHref("sort", key === "newest" ? null : key)}
              isActive={selectedSort === key}
              label={SORT_LABELS[key]}
              analytics={{ filter_type: "sort", filter_value: key }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface FilterPillProps {
  href: string;
  isActive: boolean;
  label: string;
  dotClass?: string;
  analytics?: Record<string, string>;
}

function FilterPill({
  href,
  isActive,
  label,
  dotClass,
  analytics,
}: FilterPillProps) {
  return (
    <a
      role="radio"
      aria-checked={isActive}
      href={href}
      onClick={() => {
        if (analytics) trackSistemaMedusaEvent("filter_applied", analytics);
      }}
      className={
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12px] transition-colors " +
        (isActive
          ? "border-[#6366f1]/40 bg-[#6366f1]/15 text-white"
          : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:border-white/[0.12] hover:text-white")
      }
    >
      {dotClass ? (
        <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
      ) : null}
      {label}
    </a>
  );
}
