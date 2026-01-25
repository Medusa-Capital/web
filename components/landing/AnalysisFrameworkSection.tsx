"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
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
    title: "Análisis Fundamental",
    description:
      "El análisis que más impacta en la cartera. Si veo un buen proyecto con descuento, compro al menos el 50% de la posición total.",
    icon: BarChart3,
    tags: ["Product-Market Fit", "Revenue Real", "Captura de Valor"],
    accent: {
      color: "#3a54f8",
      bg: "rgba(58, 84, 248, 0.1)",
      bgDark: "rgba(58, 84, 248, 0.2)",
      gradient: "from-[#3a54f8] to-[#657ef3]",
    },
  },
  {
    id: "macro",
    weight: 20,
    title: "Análisis Macro",
    description:
      "Monitoreo de variables macroeconómicas que impactan el ciclo de mercado.",
    icon: Globe,
    tags: ["Liquidez M2", "Flujos ETF", "Tipos Fed", "Déficit Fiscal"],
    accent: {
      color: "#50d98a",
      bg: "rgba(80, 217, 138, 0.1)",
      bgDark: "rgba(80, 217, 138, 0.15)",
      gradient: "from-[#50d98a] to-[#68fe9a]",
    },
  },
  {
    id: "onchain",
    weight: 10,
    title: "Análisis On-Chain",
    description:
      "Datos de blockchain para validar tendencias y comportamiento del mercado.",
    icon: LinkIcon,
    tags: ["Exchange Reserves", "NUPL", "Netflows", "Whale Activity"],
    accent: {
      color: "#fb923c",
      bg: "rgba(251, 146, 60, 0.1)",
      bgDark: "rgba(251, 146, 60, 0.15)",
      gradient: "from-[#fb923c] to-[#fdba74]",
    },
  },
  {
    id: "technical",
    weight: 10,
    title: "Análisis Técnico",
    subtitle: "Complementario",
    description:
      "Uso tomas de liquidez como eje principal. Nunca compro solo por técnico si los fundamentales son débiles.",
    icon: TrendingUp,
    tags: [],
    accent: {
      color: "#fbbf24",
      bg: "rgba(251, 191, 36, 0.1)",
      bgDark: "rgba(251, 191, 36, 0.15)",
      gradient: "from-[#fbbf24] to-[#fcd34d]",
    },
  },
];

const principles = [
  {
    icon: Target,
    title: "Calidad sobre Cantidad",
    quote: "Centrarnos en los pocos activos de calidad que existen.",
    detail: "Mejor 3 posiciones de alta convicción que 30 tokens mediocres.",
  },
  {
    icon: Droplets,
    title: "Comprar Cuando Hay Sangre",
    quote: "Las compras se hacen cuando nadie, pero nadie mira.",
    detail: "El mejor momento para comprar es cuando da más miedo.",
  },
  {
    icon: Settings,
    title: "El Trabajo Se Hace Antes",
    quote: "Estos momentos no son para comprar tokens sin parar.",
    detail: "La investigación ocurre en silencio, no en ATH.",
  },
  {
    icon: DoorOpen,
    title: "Saber Cuándo Salir",
    quote: "Cuando todo el mundo hable de un proyecto... salid.",
    detail:
      "Tomar profits contra-intuitivamente separa ganadores de perdedores.",
  },
  {
    icon: RefreshCcw,
    title: "Compound en Ganadores",
    quote: "Cuando el mercado te da la razón, haz compound en ellos.",
    detail: "No rotar prematuramente de posiciones ganadoras.",
  },
  {
    icon: Shield,
    title: "Gestión de Riesgo",
    quote: "Máximo 80% exposición. Nunca apalancamiento excesivo.",
    detail: "Proteger capital > Maximizar ganancias.",
  },
];

export function AnalysisFrameworkSection() {
  const { theme } = useTheme();

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
          background:
            theme === "light"
              ? "radial-gradient(circle, rgba(58, 84, 248, 0.08) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(58, 84, 248, 0.15) 0%, transparent 70%)",
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
          background:
            theme === "light"
              ? "radial-gradient(circle, rgba(80, 217, 138, 0.06) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(80, 217, 138, 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-[56px] font-bold dark:text-white light:text-[#010052] mb-4 leading-[1.1] transition-colors duration-300">
            Sistema Medusa
          </h2>
          <p className="dark:text-[#cccce0] light:text-[#3d3d6b] text-base md:text-lg leading-relaxed max-w-3xl mx-auto transition-colors duration-300">
            Un framework de inversión a largo plazo con gestión activa táctica,
            diseñado para identificar los pocos activos de calidad que realmente
            merecen tu capital.
          </p>
        </div>

        {/* Weight Distribution Bar */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-sm dark:text-[#B9B8EB] light:text-[#3d3d6b] font-medium transition-colors duration-300">
              Distribución del peso en el análisis
            </span>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden max-w-2xl mx-auto shadow-inner dark:bg-[#1b1a64]/50 light:bg-[#010052]/5">
            {analysisLayers.map((layer, index) => (
              <div
                key={layer.id}
                className="relative group cursor-pointer transition-all duration-300 hover:brightness-110"
                style={{
                  width: `${layer.weight}%`,
                  background:
                    theme === "light"
                      ? layer.accent.color
                      : `linear-gradient(90deg, ${layer.accent.color}dd, ${layer.accent.color})`,
                }}
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-md"
                    style={{
                      background:
                        theme === "light"
                          ? layer.accent.bg
                          : layer.accent.bgDark,
                      color: layer.accent.color,
                    }}
                  >
                    {layer.title}: {layer.weight}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-4">
            {analysisLayers.map((layer) => (
              <div key={layer.id} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: layer.accent.color }}
                />
                <span className="text-xs dark:text-[#cccce0] light:text-[#3d3d6b] transition-colors duration-300">
                  {layer.weight}% {layer.title.split(" ")[1]}
                </span>
              </div>
            ))}
          </div>
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
                  className={`relative rounded-[20px] p-6 md:p-8 flex flex-col transition-all duration-300 overflow-hidden group ${
                    theme === "light"
                      ? "bg-gradient-to-br from-[#3a54f8]/[0.08] to-[#3a54f8]/[0.03] border border-[#3a54f8]/20"
                      : "bg-gradient-to-br from-[#3a54f8]/20 to-[#1b1a64]/80 border border-[#3a54f8]/25"
                  }`}
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
                          background:
                            theme === "light"
                              ? layer.accent.bg
                              : layer.accent.bgDark,
                        }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: layer.accent.color }}
                          strokeWidth={1.5}
                        />
                      </div>
                      <h3
                        className={`font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold leading-tight transition-colors duration-300 ${
                          theme === "light" ? "text-[#010052]" : "text-white"
                        }`}
                      >
                        {layer.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p
                      className={`text-base md:text-lg leading-relaxed mb-4 max-w-md transition-colors duration-300 ${
                        theme === "light" ? "text-[#3d3d6b]" : "text-[#cccce0]"
                      }`}
                    >
                      {layer.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {layer.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            theme === "light"
                              ? "bg-[#3a54f8]/10 text-[#3a54f8] border border-[#3a54f8]/20"
                              : "bg-[#3a54f8]/20 text-white/90 border border-[#3a54f8]/30"
                          }`}
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
                    className={`relative rounded-[20px] p-5 md:p-6 flex flex-col transition-all duration-300 overflow-hidden group ${
                      theme === "light"
                        ? "bg-gradient-to-br from-[#50d98a]/[0.08] to-[#50d98a]/[0.02] border border-[#50d98a]/20"
                        : "bg-gradient-to-br from-[#50d98a]/15 to-[#1b1a64]/60 border border-[#50d98a]/20"
                    }`}
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
                              background:
                                theme === "light"
                                  ? layer.accent.bg
                                  : layer.accent.bgDark,
                            }}
                          >
                            <Icon
                              className="w-4 h-4"
                              style={{ color: layer.accent.color }}
                              strokeWidth={1.5}
                            />
                          </div>
                          <h3
                            className={`font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold leading-tight transition-colors duration-300 ${
                              theme === "light" ? "text-[#010052]" : "text-white"
                            }`}
                          >
                            {layer.title}
                          </h3>
                        </div>
                      </div>

                      {/* Description */}
                      <p
                        className={`text-sm leading-relaxed mb-3 transition-colors duration-300 ${
                          theme === "light"
                            ? "text-[#3d3d6b]"
                            : "text-[#cccce0]/90"
                        }`}
                      >
                        {layer.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {layer.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-300 ${
                              theme === "light"
                                ? "bg-[#50d98a]/10 text-[#2d8a5a] border border-[#50d98a]/20"
                                : "bg-[#50d98a]/15 text-white/90 border border-[#50d98a]/25"
                            }`}
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
                      className={`relative rounded-[16px] p-4 md:p-5 flex flex-col transition-all duration-300 overflow-hidden ${
                        theme === "light"
                          ? "bg-gradient-to-br from-[#fb923c]/[0.08] to-[#fb923c]/[0.02] border border-[#fb923c]/20"
                          : "bg-gradient-to-br from-[#fb923c]/10 to-[#1b1a64]/40 border border-[#fb923c]/15"
                      }`}
                    >
                      <div className="relative z-10 flex flex-col h-full">
                        {/* Weight */}
                        <span className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-[#fb923c]">
                          {layer.weight}%
                        </span>

                        {/* Icon + Title */}
                        <div className="flex items-center gap-2 mb-2">
                          <Icon
                            className="w-4 h-4 shrink-0 text-[#fb923c]"
                            strokeWidth={1.5}
                          />
                          <h4
                            className={`font-semibold text-sm md:text-base leading-tight transition-colors duration-300 ${
                              theme === "light"
                                ? "text-[#010052]"
                                : "text-white/90"
                            }`}
                          >
                            {layer.title}
                          </h4>
                        </div>

                        {/* Description */}
                        <p
                          className={`text-xs leading-relaxed mb-3 transition-colors duration-300 ${
                            theme === "light"
                              ? "text-[#3d3d6b]"
                              : "text-[#cccce0]/80"
                          }`}
                        >
                          {layer.description}
                        </p>

                        {/* Tags - compact */}
                        <div className="mt-auto flex flex-wrap gap-1.5">
                          {layer.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors duration-300 ${
                                theme === "light"
                                  ? "bg-[#fb923c]/10 text-[#c26a1a] border border-[#fb923c]/20"
                                  : "bg-[#fb923c]/15 text-white/90 border border-[#fb923c]/25"
                              }`}
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
                      className={`relative rounded-[16px] p-4 md:p-5 flex flex-col transition-all duration-300 overflow-hidden ${
                        theme === "light"
                          ? "bg-gradient-to-br from-[#fbbf24]/[0.08] to-[#fbbf24]/[0.02] border border-[#fbbf24]/20"
                          : "bg-gradient-to-br from-[#fbbf24]/10 to-[#1b1a64]/40 border border-[#fbbf24]/15"
                      }`}
                    >
                      <div className="relative z-10 flex flex-col h-full">
                        {/* Weight */}
                        <span className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-[#fbbf24]">
                          {layer.weight}%
                        </span>

                        {/* Icon + Title */}
                        <div className="flex items-center gap-2 mb-2">
                          <Icon
                            className="w-4 h-4 shrink-0 text-[#fbbf24]"
                            strokeWidth={1.5}
                          />
                          <h4
                            className={`font-semibold text-sm md:text-base leading-tight transition-colors duration-300 ${
                              theme === "light"
                                ? "text-[#010052]"
                                : "text-white/90"
                            }`}
                          >
                            {layer.title}
                          </h4>
                        </div>

                        {/* Description */}
                        <p
                          className={`text-xs leading-relaxed mb-3 transition-colors duration-300 ${
                            theme === "light"
                              ? "text-[#3d3d6b]"
                              : "text-[#cccce0]/80"
                          }`}
                        >
                          {layer.description}
                        </p>

                        {/* Subtitle as tag */}
                        <div className="mt-auto">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${
                              theme === "light"
                                ? "bg-[#fbbf24]/10 text-[#a16207] border border-[#fbbf24]/20"
                                : "bg-[#fbbf24]/15 text-white/90 border border-[#fbbf24]/25"
                            }`}
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
            <h3 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold dark:text-white light:text-[#010052] mb-3 leading-tight transition-colors duration-300">
              Los Principios que Guían Cada Decisión
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <div
                  key={index}
                  className={`rounded-[16px] p-5 transition-all duration-[400ms] ease-[cubic-bezier(0.2,0,0,1)] group hover:-translate-y-1 ${
                    theme === "light"
                      ? "bg-white/80 border border-[#010052]/8 shadow-[0_2px_12px_rgba(1,0,82,0.04)] hover:shadow-[0_12px_32px_rgba(1,0,82,0.08)]"
                      : "bg-[#1b1a64]/40 border border-white/8 hover:border-white/15 hover:bg-[#1b1a64]/60"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105 ${
                      theme === "light"
                        ? "bg-[#3a54f8]/8"
                        : "bg-[#B9B8EB]/10"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        theme === "light"
                          ? "text-[#3a54f8]"
                          : "text-[#B9B8EB]"
                      }`}
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Title */}
                  <h4
                    className={`font-semibold text-base mb-2 transition-colors duration-300 ${
                      theme === "light" ? "text-[#010052]" : "text-white"
                    }`}
                  >
                    {principle.title}
                  </h4>

                  {/* Quote */}
                  <p
                    className={`text-sm leading-relaxed mb-2 font-medium transition-colors duration-300 ${
                      theme === "light"
                        ? "text-[#3a54f8]/80"
                        : "text-[#B9B8EB]/90"
                    }`}
                  >
                    &ldquo;{principle.quote}&rdquo;
                  </p>

                  {/* Detail */}
                  <p
                    className={`text-xs leading-relaxed italic transition-colors duration-300 ${
                      theme === "light"
                        ? "text-[#3d3d6b]/70"
                        : "text-[#cccce0]/60"
                    }`}
                  >
                    {principle.detail}
                  </p>
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
            className={`text-sm mt-4 transition-colors duration-300 ${
              theme === "light" ? "text-[#6b6b9e]" : "text-[#B9B8EB]/60"
            }`}
          >
            54 páginas • Casos de estudio • Checklists • Templates
          </p>
        </div>
      </div>
    </section>
  );
}
