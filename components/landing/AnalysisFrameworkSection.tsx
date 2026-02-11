import {
  BarChart3,
  Globe,
  Link as LinkIcon,
  TrendingUp,
  Target,
  Droplets,
  Settings,
  DoorOpen,
  RefreshCcw,
  Shield,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Analysis layers with their weights and accent colors
const analysisLayers = [
  {
    id: "fundamental",
    weight: 60,
    title: "Análisis fundamental",
    description:
      "El análisis que más impacta en la cartera. Si veo un buen proyecto con descuento, compro al menos el 50% de la posición total.",
    icon: BarChart3,
    tags: ["Product-Market Fit", "Revenue Real", "Captura de Valor"],
    accent: {
      color: "#3a54f8",
      bgDark: "rgba(58, 84, 248, 0.2)",
      gradient: "from-[#3a54f8] to-[#657ef3]",
    },
  },
  {
    id: "macro",
    weight: 20,
    title: "Análisis macro",
    description:
      "Monitoreo de variables macroeconómicas que impactan el ciclo de mercado.",
    icon: Globe,
    tags: ["Liquidez M2", "Flujos ETF", "Tipos Fed", "Déficit Fiscal"],
    accent: {
      color: "#50d98a",
      bgDark: "rgba(80, 217, 138, 0.15)",
      gradient: "from-[#50d98a] to-[#68fe9a]",
    },
  },
  {
    id: "onchain",
    weight: 10,
    title: "Análisis on-chain",
    description:
      "Datos de blockchain para validar tendencias y comportamiento del mercado.",
    icon: LinkIcon,
    tags: ["Exchange Reserves", "NUPL", "Netflows", "Whale Activity"],
    accent: {
      color: "#fb923c",
      bgDark: "rgba(251, 146, 60, 0.15)",
      gradient: "from-[#fb923c] to-[#fdba74]",
    },
  },
  {
    id: "technical",
    weight: 10,
    title: "Análisis técnico",
    subtitle: "Complementario",
    description:
      "Uso tomas de liquidez como eje principal. Nunca compro solo por técnico si los fundamentales son débiles.",
    icon: TrendingUp,
    tags: [],
    accent: {
      color: "#fbbf24",
      bgDark: "rgba(251, 191, 36, 0.15)",
      gradient: "from-[#fbbf24] to-[#fcd34d]",
    },
  },
];

const principles = [
  {
    icon: Target,
    title: "Calidad sobre cantidad",
    quote: "Centrarnos en los pocos activos de calidad que existen.",
    detail: "Mejor 3 posiciones de alta convicción que 30 tokens mediocres.",
  },
  {
    icon: Droplets,
    title: "Comprar cuando hay sangre",
    quote: "Las compras se hacen cuando nadie, pero nadie mira.",
    detail: "El mejor momento para comprar es cuando da más miedo.",
  },
  {
    icon: Settings,
    title: "El trabajo se hace antes",
    quote: "Estos momentos no son para comprar tokens sin parar.",
    detail: "La investigación ocurre en silencio, no en ATH.",
  },
  {
    icon: DoorOpen,
    title: "Saber cuándo salir",
    quote: "Cuando todo el mundo hable de un proyecto... salid.",
    detail:
      "Tomar profits contra-intuitivamente separa ganadores de perdedores.",
  },
  {
    icon: RefreshCcw,
    title: "Compound en ganadores",
    quote: "Cuando el mercado te da la razón, haz compound en ellos.",
    detail: "No rotar prematuramente de posiciones ganadoras.",
  },
  {
    icon: Shield,
    title: "Gestión de riesgo",
    quote: "Máximo 80% exposición. Nunca apalancamiento excesivo.",
    detail: "Proteger capital > Maximizar ganancias.",
  },
];

export function AnalysisFrameworkSection() {
  return (
    <section className="relative py-16 md:py-24 px-4 md:px-6">
      {/* Background decorative elements */}
      <div
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{
          top: "15%",
          left: "5%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(58, 84, 248, 0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{
          bottom: "20%",
          right: "10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(80, 217, 138, 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(36px,6vw,72px)] font-bold text-white mb-4 leading-[1.1] transition-colors duration-300">
            Sistema Medusa
          </h2>
          <p className="text-[#cccce0] text-base md:text-lg leading-relaxed max-w-3xl mx-auto transition-colors duration-300">
            La estrategia consiste en identificar proyectos con Product-Market Fit,
            generación real de ingresos y mecanismos sólidos de captura de valor
            para el token. Esa es la base que marcará la diferencia en los próximos
            meses (y años).
          </p>
        </div>

        {/* Treemap-style Analysis Grid */}
        <div className="mb-16 md:mb-20">
          {/*
            Treemap Layout:
            - Left half (60%): Fundamental
            - Right top (20%): Macro
            - Right bottom left (10%): On-Chain
            - Right bottom right (10%): Technical
          */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-3 md:gap-4">
            {/* LEFT: Fundamental (60%) - Full height */}
            {(() => {
              const layer = analysisLayers[0];
              const Icon = layer.icon;
              return (
                <div
                  className="relative rounded-[20px] p-6 md:p-8 flex flex-col transition-all duration-300 overflow-hidden group bg-gradient-to-br from-[#3a54f8]/20 to-[#1b1a64]/80 border border-[#3a54f8]/25"
                >
                  {/* Subtle glow */}
                  <div
                    className="absolute -top-20 -right-20 w-64 h-64 opacity-40 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${layer.accent.color}30, transparent 70%)`,
                      filter: "blur(40px)",
                    }}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Weight prominently displayed */}
                    <div className="mb-4">
                      <span
                        className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                        style={{ color: layer.accent.color }}
                      >
                        {layer.weight}%
                      </span>
                    </div>

                    {/* Icon + Title */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: layer.accent.bgDark,
                        }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: layer.accent.color }}
                          strokeWidth={1.5}
                        />
                      </div>
                      <h3
                        className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold leading-tight transition-colors duration-300 text-white"
                      >
                        {layer.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p
                      className="text-base md:text-lg leading-relaxed mb-4 max-w-md transition-colors duration-300 text-[#cccce0]"
                    >
                      {layer.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {layer.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 bg-[#3a54f8]/20 text-white/90 border border-[#3a54f8]/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* RIGHT: Nested grid for Macro + On-Chain + Technical */}
            <div className="flex flex-col gap-3 md:gap-4">
              {/* TOP RIGHT: Macro (20%) */}
              {(() => {
                const layer = analysisLayers[1];
                const Icon = layer.icon;
                return (
                  <div
                    className="relative rounded-[20px] p-5 md:p-6 flex flex-col transition-all duration-300 overflow-hidden group bg-gradient-to-br from-[#50d98a]/15 to-[#1b1a64]/60 border border-[#50d98a]/20"
                  >
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Weight */}
                      <div className="flex items-baseline gap-3 mb-3">
                        <span
                          className="text-4xl md:text-5xl font-bold tracking-tight"
                          style={{ color: layer.accent.color }}
                        >
                          {layer.weight}%
                        </span>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{
                              background: layer.accent.bgDark,
                            }}
                          >
                            <Icon
                              className="w-4 h-4"
                              style={{ color: layer.accent.color }}
                              strokeWidth={1.5}
                            />
                          </div>
                          <h3
                            className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold leading-tight transition-colors duration-300 text-white"
                          >
                            {layer.title}
                          </h3>
                        </div>
                      </div>

                      {/* Description */}
                      <p
                        className="text-sm leading-relaxed mb-3 transition-colors duration-300 text-[#cccce0]/90"
                      >
                        {layer.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {layer.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-300 bg-[#50d98a]/15 text-white/90 border border-[#50d98a]/25"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* BOTTOM RIGHT: Two 10% cards side by side */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {/* On-Chain (10%) - Orange */}
                {(() => {
                  const layer = analysisLayers[2];
                  const Icon = layer.icon;
                  return (
                    <div
                      className="relative rounded-[16px] p-4 md:p-5 flex flex-col transition-all duration-300 overflow-hidden bg-gradient-to-br from-[#fb923c]/10 to-[#1b1a64]/40 border border-[#fb923c]/15"
                    >
                      <div className="relative z-10 flex flex-col h-full">
                        {/* Weight + Title */}
                        <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                          <span className="text-3xl md:text-4xl font-bold tracking-tight text-[#fb923c]">
                            {layer.weight}%
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Icon
                              className="w-4 h-4 shrink-0 text-[#fb923c]"
                              strokeWidth={1.5}
                            />
                            <h4
                              className="font-[family-name:var(--font-heading)] font-bold text-base md:text-lg leading-tight transition-colors duration-300 text-white"
                            >
                              {layer.title}
                            </h4>
                          </div>
                        </div>

                        {/* Description */}
                        <p
                          className="text-xs leading-relaxed mb-3 transition-colors duration-300 text-[#cccce0]/80"
                        >
                          {layer.description}
                        </p>

                        {/* Tags - compact */}
                        <div className="mt-auto flex flex-wrap gap-2">
                          {layer.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-300 bg-[#fb923c]/15 text-white/90 border border-[#fb923c]/25"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Technical (10%) - Yellow/Amber */}
                {(() => {
                  const layer = analysisLayers[3];
                  const Icon = layer.icon;
                  return (
                    <div
                      className="relative rounded-[16px] p-4 md:p-5 flex flex-col transition-all duration-300 overflow-hidden bg-gradient-to-br from-[#fbbf24]/10 to-[#1b1a64]/40 border border-[#fbbf24]/15"
                    >
                      <div className="relative z-10 flex flex-col h-full">
                        {/* Weight + Title */}
                        <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                          <span className="text-3xl md:text-4xl font-bold tracking-tight text-[#fbbf24]">
                            {layer.weight}%
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Icon
                              className="w-4 h-4 shrink-0 text-[#fbbf24]"
                              strokeWidth={1.5}
                            />
                            <h4
                              className="font-[family-name:var(--font-heading)] font-bold text-base md:text-lg leading-tight transition-colors duration-300 text-white"
                            >
                              {layer.title}
                            </h4>
                          </div>
                        </div>

                        {/* Description */}
                        <p
                          className="text-xs leading-relaxed mb-3 transition-colors duration-300 text-[#cccce0]/80"
                        >
                          {layer.description}
                        </p>

                        {/* Subtitle as tag */}
                        <div className="mt-auto flex flex-wrap gap-2">
                          <span
                            className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#fbbf24]/15 text-white/90 border border-[#fbbf24]/25"
                          >
                            Complementario
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Principles Section */}
        <div>
          <div className="text-center mb-8 md:mb-10">
            <h3 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-white mb-3 leading-tight transition-colors duration-300">
              Los principios que guían cada decisión
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <div
                  key={index}
                  className="relative rounded-[20px] p-6 md:p-7 transition-all duration-[400ms] ease-[cubic-bezier(0.2,0,0,1)] group hover:-translate-y-1.5 overflow-hidden bg-gradient-to-br from-[#1b1a64]/70 to-[#1b1a64]/40 border border-[#B9B8EB]/12 hover:border-[#B9B8EB]/25"
                >
                  {/* Subtle corner glow on hover */}
                  <div
                    className="absolute -top-12 -right-12 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: "radial-gradient(circle, rgba(185, 184, 235, 0.15), transparent 70%)",
                      filter: "blur(20px)",
                    }}
                  />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 bg-[#B9B8EB]/10 ring-1 ring-[#B9B8EB]/15"
                    >
                      <Icon
                        className="w-5 h-5 text-[#B9B8EB]"
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Title */}
                    <h4
                      className="font-bold text-lg mb-3 transition-colors duration-300 text-white"
                    >
                      {principle.title}
                    </h4>

                    {/* Quote */}
                    <p
                      className="text-[15px] leading-relaxed mb-4 transition-colors duration-300 text-[#cccce0]"
                    >
                      &ldquo;{principle.quote}&rdquo;
                    </p>

                    {/* Detail — as a subtle footnote */}
                    <p
                      className="text-sm leading-relaxed pt-3 transition-colors duration-300 text-[#B9B8EB]/60 border-t border-white/8"
                    >
                      {principle.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 md:mt-16">
          <Button
            variant="secondaryGlow"
            size="lg"
            className="px-8 py-6 text-base font-semibold rounded-xl gap-2"
          >
            <Download className="w-5 h-5" />
            Descargar framework completo (PDF gratis)
          </Button>
          <p
            className="text-sm mt-4 transition-colors duration-300 text-[#B9B8EB]/60"
          >
            54 páginas - Casos de estudio - Checklists - Templates
          </p>
        </div>
      </div>
    </section>
  );
}
