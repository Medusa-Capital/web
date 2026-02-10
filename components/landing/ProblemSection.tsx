"use client";

import { Dices, TrendingDown, Hourglass } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

// Accent colors for each card
const cardAccents = [
  { color: "#f87171", bg: "rgba(248, 113, 113, 0.1)", bgDark: "rgba(248, 113, 113, 0.15)" }, // red
  { color: "#fb923c", bg: "rgba(251, 146, 60, 0.1)", bgDark: "rgba(251, 146, 60, 0.15)" },   // orange
  { color: "#fbbf24", bg: "rgba(251, 191, 36, 0.1)", bgDark: "rgba(251, 191, 36, 0.15)" },   // amber
];

export function ProblemSection() {
  const { theme } = useTheme();

  const problems = [
    {
      icon: <Dices className="w-6 h-6 stroke-[1.5]" />,
      title: "Siguen señales sin criterio",
      bullets: [
        "Compran por FOMO lo que dice un anónimo en Twitter",
        "No entienden QUÉ compraron ni POR QUÉ",
        "Venden en pánico cuando cae -20% (justo antes de la subida)",
        "Pierden 60-80% por no gestionar el riesgo",
      ],
    },
    {
      icon: <TrendingDown className="w-6 h-6 stroke-[1.5]" />,
      title: "Saben pero ejecutan mal",
      bullets: [
        "Están +457% arriba y acaban cerrando la posición en negativo",
        "Saben identificar oportunidades pero no cuándo salir",
        "Holdean cadáveres esperando \"la vuelta\"",
        "Saben de DeFi, métricas on-chain... pero no tienen SISTEMA",
      ],
    },
    {
      icon: <Hourglass className="w-6 h-6 stroke-[1.5]" />,
      title: "Dan su vida sin ver resultados",
      bullets: [
        "Investigan 40h a la semana proyectos que nunca despegan",
        "Pagan 5 comunidades, 3 newsletters y leen a 20 analistas distintos",
        "No tienen tiempo para familia, solo para cripto",
        "Resultado: estrés y 0 resultados mientras otros SÍ ganan",
      ],
    },
  ];


  return (
    <section className="relative py-12 md:py-16 px-4 md:px-6">
      {/* Background decorative elements */}
      <div
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{
          top: "20%",
          left: "10%",
          width: "400px",
          height: "400px",
          background:
            theme === "light"
              ? "radial-gradient(circle, rgba(255, 68, 68, 0.08) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(255, 68, 68, 0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{
          bottom: "10%",
          right: "10%",
          width: "350px",
          height: "350px",
          background:
            theme === "light"
              ? "radial-gradient(circle, rgba(58, 84, 248, 0.08) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(197, 191, 230, 0.1) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(36px,6vw,72px)] font-bold dark:text-white light:text-[#010052] mb-3 md:mb-4 leading-[1.15] transition-colors duration-300">
            Por qué la mayoría pierde dinero en cripto
            <br />
            <span className="dark:text-[#B9B8EB]/80 light:text-[#3a54f8]/90 text-[0.9em]">(y cómo evitarlo)</span>
          </h2>
        </div>

        {/* Grid de 3 Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 my-12 md:my-16">
          {problems.map((problem, index) => {
            const accent = cardAccents[index];
            return (
              <div
                key={index}
                className={`h-full flex flex-col rounded-[20px] transition-all duration-[400ms] ease-[cubic-bezier(0.2,0,0,1)] group hover:-translate-y-1.5 relative overflow-hidden backdrop-blur-xl ${
                  theme === "light"
                    ? "bg-white/90 border border-[#010052]/10 shadow-[0_4px_24px_rgba(1,0,82,0.08)] hover:shadow-[0_24px_48px_-12px_rgba(1,0,82,0.15)]"
                    : "bg-[#1b1a64]/60 border border-[#c5bfe6]/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)]"
                }`}
              >
                {/* Card number badge */}
                <div
                  className="absolute top-8 right-8 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold opacity-60 group-hover:opacity-90 transition-opacity duration-300"
                  style={{
                    background: theme === "light" ? accent.bg : accent.bgDark,
                    color: accent.color,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Header */}
                <div className="p-8 pb-0 relative z-10">
                  {/* Icon wrapper */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background: theme === "light" ? accent.bg : accent.bgDark,
                    }}
                  >
                    <div className="scale-125" style={{ color: accent.color }}>
                      {problem.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className={`font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold leading-tight tracking-[-0.02em] transition-colors duration-300 ${
                      theme === "light" ? "text-[#010052]" : "text-white"
                    }`}
                  >
                    {problem.title}
                  </h3>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col p-8 pt-4 relative z-10">
                  {/* Bullets with colored dots */}
                  <div className="space-y-4 flex-1">
                    {problem.bullets.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex items-start gap-3 min-h-[56px]">
                        <span
                          className="w-[6px] h-[6px] rounded-full mt-[9px] shrink-0"
                          style={{ background: accent.color }}
                        />
                        <p
                          className={`text-base leading-relaxed transition-colors duration-300 ${
                            theme === "light" ? "text-[#3d3d6b]/85" : "text-[#cccce0]/85"
                          }`}
                        >
                          {bullet}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
