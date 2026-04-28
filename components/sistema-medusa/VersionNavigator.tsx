"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface VersionOption {
  version_number: number;
  published_at: string;
  verdict_label: string;
}

interface VersionNavigatorProps {
  ticker: string;
  options: VersionOption[];
  selectedVersion: number;
}

export function VersionNavigator({
  ticker,
  options,
  selectedVersion,
}: VersionNavigatorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (options.length <= 1) return null;

  return (
    <label className="flex items-center gap-2 text-[12px] text-zinc-400">
      <span className="uppercase tracking-wider text-zinc-500">Versión</span>
      <select
        value={selectedVersion}
        disabled={isPending}
        onChange={(event) => {
          const next = event.target.value;
          startTransition(() => {
            router.replace(
              `/sistema-medusa/${ticker.toLowerCase()}?v=${next}`
            );
          });
        }}
        className="rounded-md border border-white/[0.06] bg-[#111118] px-2 py-1 font-mono text-[12px] text-white focus:border-[#6366f1]/40 focus:outline-none focus:ring-1 focus:ring-[#6366f1]/30"
      >
        {options.map((option) => (
          <option key={option.version_number} value={option.version_number}>
            v{option.version_number} — {option.published_at} · {option.verdict_label}
          </option>
        ))}
      </select>
    </label>
  );
}
