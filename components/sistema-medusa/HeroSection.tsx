import { BookOpen } from "lucide-react";

interface HeroSectionProps {
  count: number;
}

export function HeroSection({ count }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] py-12 sm:py-14">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/3 top-0 h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#6366f1]/8 blur-[140px]" />
        <div className="absolute right-0 top-1/2 h-[260px] w-[380px] -translate-y-1/2 rounded-full bg-[#4338ca]/6 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          {/* Left: title block */}
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5">
              <BookOpen
                className="h-3.5 w-3.5 text-[#6366f1]"
                aria-hidden="true"
              />
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6366f1]">
                Medusa Capital — Biblioteca de Research
              </p>
            </div>

            {/* Main heading — single line on lg+ for tighter editorial feel */}
            <h1 className="mt-3 font-[family-name:var(--font-heading)] text-5xl font-bold leading-[1.0] tracking-tight text-white sm:text-6xl lg:text-[64px]">
              Sistema <span className="text-[#B9B8EB]">Medusa</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-[#B8C0D9]">
              Análisis de inversión bajo la metodología Medusa. Filtros de
              descarte, pilares fundamentales, ITA definitiva y veredicto
              cuantitativo.
            </p>
          </div>

          {/* Right: stats panel — sits inline on desktop instead of stacking below */}
          <div className="flex items-stretch gap-0 self-start lg:self-end">
            <div className="border-l border-white/[0.08] pl-6 pr-8">
              <p className="font-mono text-3xl font-semibold tabular-nums leading-none text-white">
                {count}
              </p>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                {count === 1 ? "Análisis publicado" : "Análisis publicados"}
              </p>
            </div>
            <div className="border-l border-white/[0.08] pl-6">
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                Acceso
              </p>
              <p className="mt-1.5 text-[12px] leading-snug text-zinc-300">
                Miembros<br />Medusa Capital
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
