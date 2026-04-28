import type { Analysis } from "@/lib/sistema-medusa/schemas";

interface RisksSectionProps {
  data: Analysis["risks_and_watchpoints"];
}

export function RisksSection({ data }: RisksSectionProps) {
  return (
    <section aria-labelledby="risks-heading" className="mt-10">
      <header className="mb-3 border-b border-white/[0.06] pb-3">
        <h2
          id="risks-heading"
          className="text-[15px] font-semibold text-white"
        >
          Riesgos y puntos de seguimiento
        </h2>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <RiskColumn
          title="Riesgos estructurales"
          items={data.structural_risks}
        />
        <RiskColumn
          title="Riesgos operacionales"
          items={data.operational_risks}
        />
        <RiskColumn title="A monitorizar" items={data.things_to_monitor} />
      </div>
    </section>
  );
}

function RiskColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-[#111118] p-5">
      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="mt-3 text-[12px] text-zinc-500">—</p>
      ) : (
        <ul className="mt-3 space-y-2 text-[13px] text-zinc-300">
          {items.map((item, index) => (
            <li
              key={`${title}-${index}`}
              className="relative pl-4 leading-relaxed before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#6366f1]"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
