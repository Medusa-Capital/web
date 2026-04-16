"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { TrendingUp, Clock } from "lucide-react";
import { STATUS_LABELS, STATUS_DOT, type PostStatus } from "./status";

const SORTS = [
  { value: "votes", label: "Más votadas", icon: TrendingUp },
  { value: "newest", label: "Más recientes", icon: Clock },
] as const;

const STATUSES: { value: "all" | PostStatus; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "open", label: STATUS_LABELS.open },
  { value: "planned", label: STATUS_LABELS.planned },
  { value: "in_progress", label: STATUS_LABELS.in_progress },
  { value: "shipped", label: STATUS_LABELS.shipped },
  { value: "declined", label: STATUS_LABELS.declined },
];

export function ListControls({
  sort,
  status,
}: {
  sort: string;
  status: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    next.set(key, value);
    startTransition(() => {
      router.push(`/ideas?${next.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Status filters — Featurebase-style pill tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => update("status", s.value)}
            aria-pressed={status === s.value}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all ${
              status === s.value
                ? "bg-white/[0.1] text-white"
                : "text-[#71717a] hover:bg-white/[0.04] hover:text-[#a1a1aa]"
            }`}
          >
            {s.value !== "all" && (
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${STATUS_DOT[s.value as PostStatus]}`}
              />
            )}
            {s.label}
          </button>
        ))}

        {/* Sort controls — right aligned */}
        <div className="ml-auto flex items-center gap-0.5 rounded-lg border border-white/[0.06] bg-white/[0.02] p-0.5">
          {SORTS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => update("sort", s.value)}
                aria-pressed={sort === s.value}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-medium transition-all ${
                  sort === s.value
                    ? "bg-white/[0.08] text-white"
                    : "text-[#52525b] hover:text-[#a1a1aa]"
                }`}
              >
                <Icon className="h-3 w-3" />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
