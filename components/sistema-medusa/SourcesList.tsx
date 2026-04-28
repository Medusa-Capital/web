import type { Analysis } from "@/lib/sistema-medusa/schemas";

interface SourcesListProps {
  data: Analysis["sources"];
}

const SOURCE_TYPE_LABELS: Record<string, string> = {
  onchain: "On-chain",
  aggregator: "Agregador",
  official_docs: "Docs oficiales",
  research: "Research",
};

export function SourcesList({ data }: SourcesListProps) {
  return (
    <section aria-labelledby="sources-heading" className="mt-10">
      <header className="mb-3 border-b border-white/[0.06] pb-3">
        <h2
          id="sources-heading"
          className="text-[15px] font-semibold text-white"
        >
          Fuentes
        </h2>
      </header>

      <div className="rounded-lg border border-white/[0.06] bg-[#111118] p-5">
        {data.primary.length > 0 ? (
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Primarias
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {data.primary.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded border border-[#6366f1]/30 bg-[#6366f1]/[0.08] px-2.5 py-1 font-mono text-[11px] text-[#a5b4fc] transition-opacity hover:opacity-80"
                  >
                    {source.name}
                    <span className="text-[9px] uppercase tracking-wider text-[#a5b4fc]/60">
                      {SOURCE_TYPE_LABELS[source.type] ?? source.type}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {data.secondary.length > 0 ? (
          <div className="mt-5">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Secundarias
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {data.secondary.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                    className="inline-flex items-center rounded border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-zinc-400 transition-colors hover:text-white"
                  >
                    {source.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
