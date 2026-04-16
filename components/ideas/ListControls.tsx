"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { STATUS_LABELS, type PostStatus } from "./status";

const SORTS = [
  { value: "votes", label: "Más votadas" },
  { value: "newest", label: "Más recientes" },
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-1.5">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => update("status", s.value)}
            aria-pressed={status === s.value}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              status === s.value
                ? "border-[#6366f1] bg-[#6366f1]/15 text-white"
                : "border-[#6366f1]/20 text-[#B9B8EB]/70 hover:border-[#6366f1]/50 hover:text-white"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex gap-1.5">
        {SORTS.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => update("sort", s.value)}
            aria-pressed={sort === s.value}
            className={`rounded-md px-2.5 py-1 text-xs transition ${
              sort === s.value
                ? "bg-[#6366f1]/20 text-white"
                : "text-[#B9B8EB]/60 hover:text-white"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
