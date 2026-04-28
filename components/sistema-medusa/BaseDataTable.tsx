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

function fmtUsd(value: number | null | undefined, mode: "compact" | "precise" = "compact") {
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
      <header className="mb-3 flex items-baseline justify-between border-b border-white/[0.06] pb-3">
        <h2
          id="base-data-heading"
          className="text-[15px] font-semibold text-white"
        >
          Datos base
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          {data.data_date}
        </span>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        <Metric label="Precio" value={fmtUsd(data.price_usd, "precise")} />
        <Metric label="Market Cap" value={fmtUsd(data.market_cap_usd)} />
        <Metric
          label="FDV"
          value={fmtUsd(data.fdv_usd)}
          sub={`MC/FDV: ${fmtRatio(data.mc_fdv_ratio)}`}
        />
        <Metric
          label="Revenue anualizado"
          value={fmtUsd(data.revenue_annualized_usd)}
          sub={
            data.mc_revenue_ratio !== null && data.mc_revenue_ratio !== undefined
              ? `P/S: ${fmtRatio(data.mc_revenue_ratio)}`
              : undefined
          }
        />
        <Metric label="TVL" value={fmtUsd(data.tvl_usd)} />
        <Metric
          label="Supply"
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

function Metric({
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
      <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className="mt-1 font-mono text-[16px] font-medium text-white">
        {value}
      </div>
      {sub ? (
        <div className="mt-1 text-[11px] text-zinc-500">{sub}</div>
      ) : null}
    </div>
  );
}
