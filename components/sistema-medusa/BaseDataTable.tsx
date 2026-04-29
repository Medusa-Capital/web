import type { Analysis } from "@/lib/sistema-medusa/schemas";

interface BaseDataTableProps {
  data: Analysis["base_data"];
}

const COMPACT = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});
const PRECISE = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6,
});

function fmtUsd(
  value: number | null | undefined,
  mode: "compact" | "precise" = "compact"
) {
  if (value === null || value === undefined) return "—";
  const fmt = mode === "compact" ? COMPACT : PRECISE;
  return `$${fmt.format(value)}`;
}

function fmtRatio(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return value.toFixed(2);
}

function fmtSupply(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return COMPACT.format(value);
}

export function BaseDataTable({ data }: BaseDataTableProps) {
  return (
    <section aria-labelledby="base-data-heading" className="mt-10">
      <header className="mb-5 flex items-baseline justify-between border-b border-white/[0.06] pb-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            Datos base
          </p>
          <h2
            id="base-data-heading"
            className="mt-1 font-[family-name:var(--font-heading)] text-2xl font-bold text-white"
          >
            Métricas clave
          </h2>
        </div>
        <span className="font-mono text-[11px] text-zinc-600">{data.data_date}</span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          label="Precio"
          value={fmtUsd(data.price_usd, "precise")}
        />
        <MetricCard label="Market Cap" value={fmtUsd(data.market_cap_usd)} />
        <MetricCard
          label="FDV"
          value={fmtUsd(data.fdv_usd)}
          sub={`MC/FDV: ${fmtRatio(data.mc_fdv_ratio)}`}
        />
        <MetricCard
          label="Revenue anualizado"
          value={fmtUsd(data.revenue_annualized_usd)}
          sub={
            data.mc_revenue_ratio !== null && data.mc_revenue_ratio !== undefined
              ? `P/S: ${fmtRatio(data.mc_revenue_ratio)}`
              : undefined
          }
        />
        <MetricCard label="TVL" value={fmtUsd(data.tvl_usd)} />
        <MetricCard
          label="Supply circulante"
          value={fmtSupply(data.circulating_supply)}
          sub={
            data.total_supply
              ? `Total: ${fmtSupply(data.total_supply)}`
              : undefined
          }
        />
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-[#111118] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-2 font-mono text-[18px] font-semibold tabular-nums text-white">
        {value}
      </p>
      {sub && (
        <p className="mt-1 text-[11px] text-zinc-600">{sub}</p>
      )}
    </div>
  );
}
