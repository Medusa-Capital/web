import { AlertTriangle, Settings, Eye, type LucideIcon } from "lucide-react";
import type { Analysis } from "@/lib/sistema-medusa/schemas";

interface RisksSectionProps {
  data: Analysis["risks_and_watchpoints"];
}

export function RisksSection({ data }: RisksSectionProps) {
  return (
    <section aria-labelledby="risks-heading" className="mt-12">
      <header className="mb-5 border-b border-white/[0.08] pb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6366f1]">
          Vigilancia
        </p>
        <h2
          id="risks-heading"
          className="mt-2 font-[family-name:var(--font-heading)] text-[28px] font-bold leading-tight text-white"
        >
          Riesgos y puntos de seguimiento
        </h2>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <RiskColumn
          title="Riesgos estructurales"
          items={data.structural_risks}
          icon={AlertTriangle}
          accent="text-red-400"
          iconBg="bg-red-500/10 ring-red-500/20"
          dotColor="bg-red-400"
        />
        <RiskColumn
          title="Riesgos operacionales"
          items={data.operational_risks}
          icon={Settings}
          accent="text-amber-400"
          iconBg="bg-amber-500/10 ring-amber-500/20"
          dotColor="bg-amber-400"
        />
        <RiskColumn
          title="A monitorizar"
          items={data.things_to_monitor}
          icon={Eye}
          accent="text-[#B9B8EB]"
          iconBg="bg-[#6366f1]/10 ring-[#6366f1]/20"
          dotColor="bg-[#6366f1]"
        />
      </div>
    </section>
  );
}

function RiskColumn({
  title,
  items,
  icon: Icon,
  accent,
  iconBg,
  dotColor,
}: {
  title: string;
  items: string[];
  icon: LucideIcon;
  accent: string;
  iconBg: string;
  dotColor: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#111118] p-5">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-1 ${iconBg}`}
        >
          <Icon className={`h-3.5 w-3.5 ${accent}`} strokeWidth={2.5} />
        </span>
        <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-300">
          {title}
        </h3>
      </div>
      {items.length === 0 ? (
        <p className="mt-4 text-[12px] text-zinc-500">—</p>
      ) : (
        <ul className="mt-4 space-y-2.5 text-[13px] text-zinc-300">
          {items.map((item, index) => (
            <li
              key={`${title}-${index}`}
              className="relative pl-4 leading-relaxed"
            >
              <span
                aria-hidden="true"
                className={`absolute left-0 top-[7px] h-1.5 w-1.5 rounded-full ${dotColor}`}
              />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
