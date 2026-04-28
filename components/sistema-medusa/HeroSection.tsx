import { BookOpen } from "lucide-react";

interface HeroSectionProps {
  count: number;
}

export function HeroSection({ count }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] py-16 sm:py-20">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[#6366f1]/8 blur-[140px]" />
        <div className="absolute right-0 top-1/2 h-[300px] w-[400px] -translate-y-1/2 rounded-full bg-[#4338ca]/6 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
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

          {/* Main heading — Cormorant editorial serif */}
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-6xl font-bold leading-[1.0] tracking-tight text-white sm:text-7xl lg:text-8xl">
            Sistema
            <br />
            <span className="text-[#B9B8EB]">Medusa</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-[#B8C0D9]">
            Análisis de inversión bajo la metodología Medusa. Filtros de
            descarte, pilares fundamentales, ITA definitiva y veredicto
            cuantitativo.
          </p>

          {/* Stats row */}
          <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/[0.06] pt-6">
            <div>
              <p className="font-mono text-2xl font-semibold tabular-nums text-white">
                {count}
              </p>
              <p className="mt-0.5 text-[11px] uppercase tracking-wider text-zinc-500">
                {count === 1 ? "análisis publicado" : "análisis publicados"}
              </p>
            </div>
            <div className="h-8 w-px bg-white/[0.08]" />
            <div>
              <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                Acceso exclusivo
              </p>
              <p className="mt-0.5 text-[12px] text-zinc-300">
                Miembros Medusa Capital
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
