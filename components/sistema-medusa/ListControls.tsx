"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
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
import { CHAIN_DOT, CHAIN_LABELS } from "@/lib/sistema-medusa/enums/chain";
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
  const hasActiveFilters = Boolean(
    selectedVerdict || selectedCategory || selectedChain || initialQ
  );

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
    <div className="space-y-6">
      {/* Search */}
      <label className="relative block">
        <span className="sr-only">Buscar análisis</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600"
        />
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            debouncedSearch(e.target.value);
          }}
          placeholder="Ticker o nombre…"
          className="w-full rounded-md border border-white/[0.07] bg-white/[0.03] py-2 pl-8 pr-7 text-[12px] text-white placeholder:text-zinc-600 focus:border-[#6366f1]/40 focus:outline-none focus:ring-1 focus:ring-[#6366f1]/20"
          maxLength={200}
        />
        {q && (
          <button
            type="button"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
            onClick={() => {
              setQ("");
              debouncedSearch("");
            }}
          >
            <X className="h-3 w-3" aria-hidden="true" />
            <span className="sr-only">Limpiar búsqueda</span>
          </button>
        )}
      </label>

      {/* Clear all filters */}
      {hasActiveFilters && (
        <a
          href="/sistema-medusa"
          className="block rounded border border-white/[0.06] py-1.5 text-center text-[11px] text-zinc-500 transition-colors hover:border-white/10 hover:text-zinc-300"
        >
          Limpiar filtros
        </a>
      )}

      {/* Verdict */}
      <FilterSection label="Veredicto" ariaLabel="Filtrar por veredicto">
        <SidebarItem
          href={buildHref("verdict", null)}
          isActive={!selectedVerdict}
          label="Todos"
          analytics={{ filter_type: "verdict", filter_value: "all" }}
        />
        {VERDICT_VALUES.map((value) => (
          <SidebarItem
            key={value}
            href={buildHref("verdict", value)}
            isActive={selectedVerdict === value}
            label={VERDICT_LABELS[value]}
            dotClass={VERDICT_DOT[value]}
            analytics={{ filter_type: "verdict", filter_value: value }}
          />
        ))}
      </FilterSection>

      {/* Category */}
      <FilterSection label="Categoría" ariaLabel="Filtrar por categoría">
        <SidebarItem
          href={buildHref("category", null)}
          isActive={!selectedCategory}
          label="Todas"
          analytics={{ filter_type: "category", filter_value: "all" }}
        />
        {CATEGORY_VALUES.map((value) => (
          <SidebarItem
            key={value}
            href={buildHref("category", value)}
            isActive={selectedCategory === value}
            label={CATEGORY_LABELS[value]}
            dotClass={CATEGORY_DOT[value]}
            analytics={{ filter_type: "category", filter_value: value }}
          />
        ))}
      </FilterSection>

      {/* Chain */}
      <FilterSection label="Cadena" ariaLabel="Filtrar por chain">
        <SidebarItem
          href={buildHref("chain", null)}
          isActive={!selectedChain}
          label="Todas"
          analytics={{ filter_type: "chain", filter_value: "all" }}
        />
        {CHAIN_VALUES.map((value) => (
          <SidebarItem
            key={value}
            href={buildHref("chain", value)}
            isActive={selectedChain === value}
            label={CHAIN_LABELS[value]}
            dotClass={CHAIN_DOT[value]}
            analytics={{ filter_type: "chain", filter_value: value }}
          />
        ))}
      </FilterSection>

      {/* Sort */}
      <FilterSection label="Orden" ariaLabel="Ordenar resultados">
        {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
          <SidebarItem
            key={key}
            href={buildHref("sort", key === "newest" ? null : key)}
            isActive={selectedSort === key}
            label={SORT_LABELS[key]}
            analytics={{ filter_type: "sort", filter_value: key }}
          />
        ))}
      </FilterSection>
    </div>
  );
}

function FilterSection({
  label,
  ariaLabel,
  children,
}: {
  label: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel}>
      <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

interface SidebarItemProps {
  href: string;
  isActive: boolean;
  label: string;
  dotClass?: string;
  analytics?: Record<string, string | number | boolean>;
}

function SidebarItem({
  href,
  isActive,
  label,
  dotClass,
  analytics,
}: SidebarItemProps) {
  return (
    <a
      role="radio"
      aria-checked={isActive}
      href={href}
      onClick={() => {
        if (analytics) trackSistemaMedusaEvent("filter_applied", analytics);
      }}
      className={
        "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[12px] transition-colors " +
        (isActive
          ? "bg-[#6366f1]/10 font-semibold text-white"
          : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300")
      }
    >
      {dotClass ? (
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`}
        />
      ) : (
        <span className="h-1.5 w-1.5 shrink-0" />
      )}
      <span className="flex-1">{label}</span>
      {isActive && (
        <span
          aria-hidden="true"
          className="h-1 w-1 shrink-0 rounded-full bg-[#6366f1]"
        />
      )}
    </a>
  );
}
