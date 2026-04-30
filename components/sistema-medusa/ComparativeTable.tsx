import type { Analysis } from "@/lib/sistema-medusa/schemas";

interface ComparativeTableProps {
  data: Analysis["comparative_analysis"];
  ownTicker: string;
}

const COMPACT = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

function fmtUsd(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return `$${COMPACT.format(value)}`;
}

function fmtRatio(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return value.toFixed(2);
}

function fmtPct(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return `${value.toFixed(0)}%`;
}

export function ComparativeTable({ data, ownTicker }: ComparativeTableProps) {
  if (data.peer_tokens.length === 0) {
    return null;
  }

  // P/S bar scale — invert so lower P/S = longer bar (better valuation = more visible)
  const psValues = data.peer_tokens
    .map((p) => p.ps_ratio)
    .filter((v): v is number => v !== null && v !== undefined);
  const maxPs = psValues.length > 0 ? Math.max(...psValues) : 1;

  // Capture % scale — direct (higher = longer)
  const captureValues = data.peer_tokens
    .map((p) => p.value_capture_pct)
    .filter((v): v is number => v !== null && v !== undefined);
  const maxCapture = captureValues.length > 0 ? Math.max(...captureValues, 100) : 100;

  return (
    <section aria-labelledby="comparative-heading" className="mt-12">
      <header className="mb-5 flex items-end justify-between border-b border-white/[0.08] pb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6366f1]">
            Benchmark
          </p>
          <h2
            id="comparative-heading"
            className="mt-2 font-[family-name:var(--font-heading)] text-[28px] font-bold leading-tight text-white"
          >
            Análisis comparativo
          </h2>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
          vs peers
        </span>
      </header>

      <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-[#111118]">
        <table className="w-full text-left">
          <thead className="border-b border-white/[0.06] text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            <tr>
              <th scope="col" className="px-5 py-3.5 font-semibold">Token</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">MC</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">Revenue</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">P/S</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">Captura</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {data.peer_tokens.map((peer) => {
              const isOwn = peer.ticker.toUpperCase() === ownTicker.toUpperCase();
              const psPct =
                peer.ps_ratio !== null && peer.ps_ratio !== undefined
                  ? Math.min(100, (peer.ps_ratio / maxPs) * 100)
                  : 0;
              const capturePct =
                peer.value_capture_pct !== null && peer.value_capture_pct !== undefined
                  ? Math.min(100, (peer.value_capture_pct / maxCapture) * 100)
                  : 0;

              return (
                <tr
                  key={peer.ticker}
                  className={
                    isOwn
                      ? "relative bg-[#6366f1]/[0.08] text-white"
                      : "text-zinc-300"
                  }
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {isOwn ? (
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-[#6366f1]"
                        />
                      ) : null}
                      {peer.url ? (
                        <a
                          href={peer.url}
                          rel="noreferrer"
                          target="_blank"
                          className={`font-mono text-[13px] font-semibold ${isOwn ? "text-white" : "text-zinc-200"} hover:text-[#6366f1]`}
                        >
                          {peer.ticker}
                        </a>
                      ) : (
                        <span
                          className={`font-mono text-[13px] font-semibold ${isOwn ? "text-white" : "text-zinc-200"}`}
                        >
                          {peer.ticker}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[12px] tabular-nums">
                    {fmtUsd(peer.mc)}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[12px] tabular-nums">
                    {fmtUsd(peer.revenue)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-12 font-mono text-[12px] tabular-nums">
                        {fmtRatio(peer.ps_ratio)}
                      </span>
                      <span
                        aria-hidden="true"
                        className="relative hidden h-1 w-20 overflow-hidden rounded-full bg-white/[0.05] sm:block"
                      >
                        <span
                          className={`absolute left-0 top-0 h-full ${isOwn ? "bg-[#6366f1]" : "bg-zinc-600"}`}
                          style={{ width: `${psPct}%` }}
                        />
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-12 font-mono text-[12px] tabular-nums">
                        {fmtPct(peer.value_capture_pct)}
                      </span>
                      <span
                        aria-hidden="true"
                        className="relative hidden h-1 w-20 overflow-hidden rounded-full bg-white/[0.05] sm:block"
                      >
                        <span
                          className={`absolute left-0 top-0 h-full ${isOwn ? "bg-emerald-400" : "bg-zinc-600"}`}
                          style={{ width: `${capturePct}%` }}
                        />
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data.summary ? (
        <p className="mt-4 max-w-3xl text-[14px] leading-relaxed text-zinc-300">
          {data.summary}
        </p>
      ) : null}
    </section>
  );
}
