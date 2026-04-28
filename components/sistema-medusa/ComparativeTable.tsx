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
  return (
    <section aria-labelledby="comparative-heading" className="mt-10">
      <header className="mb-3 flex items-baseline justify-between border-b border-white/[0.06] pb-3">
        <h2
          id="comparative-heading"
          className="text-[15px] font-semibold text-white"
        >
          Análisis comparativo
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          vs peers
        </span>
      </header>

      <div className="overflow-x-auto rounded-lg border border-white/[0.06] bg-[#111118]">
        <table className="w-full text-left">
          <thead className="border-b border-white/[0.06] text-[10px] uppercase tracking-wider text-zinc-500">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Token</th>
              <th scope="col" className="px-4 py-3 font-medium">MC</th>
              <th scope="col" className="px-4 py-3 font-medium">Revenue</th>
              <th scope="col" className="px-4 py-3 font-medium">P/S</th>
              <th scope="col" className="px-4 py-3 font-medium">Captura</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {data.peer_tokens.map((peer) => {
              const isOwn = peer.ticker.toUpperCase() === ownTicker.toUpperCase();
              return (
                <tr
                  key={peer.ticker}
                  className={
                    isOwn
                      ? "bg-[#6366f1]/[0.05] text-white"
                      : "text-zinc-300"
                  }
                >
                  <td className="px-4 py-3 font-mono text-[12px]">
                    {peer.url ? (
                      <a
                        href={peer.url}
                        rel="noreferrer"
                        target="_blank"
                        className="hover:text-[#6366f1]"
                      >
                        {peer.ticker}
                      </a>
                    ) : (
                      peer.ticker
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-[12px]">{fmtUsd(peer.mc)}</td>
                  <td className="px-4 py-3 font-mono text-[12px]">{fmtUsd(peer.revenue)}</td>
                  <td className="px-4 py-3 font-mono text-[12px]">{fmtRatio(peer.ps_ratio)}</td>
                  <td className="px-4 py-3 font-mono text-[12px]">{fmtPct(peer.value_capture_pct)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data.summary ? (
        <p className="mt-4 text-[13px] leading-relaxed text-zinc-400">
          {data.summary}
        </p>
      ) : null}
    </section>
  );
}
