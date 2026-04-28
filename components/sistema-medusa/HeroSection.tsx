import { LineChart } from "lucide-react";

interface HeroSectionProps {
  count: number;
}

export function HeroSection({ count }: HeroSectionProps) {
  return (
    <section className="border-b border-white/[0.06] py-12 text-center">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-4 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6366f1]/15 text-[#6366f1]">
            <LineChart aria-hidden="true" className="h-6 w-6" />
          </div>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Sistema Medusa
        </h1>
        <p className="mt-3 text-[14px] text-zinc-400">
          Análisis de inversión bajo la metodología Medusa. Filtros de descarte,
          pilares fundamentales, ITA definitiva y veredicto.
        </p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          {count} {count === 1 ? "análisis publicado" : "análisis publicados"}
        </p>
      </div>
    </section>
  );
}
