"use client";

import { FileX, Scale, Brain, Users, ChevronRight } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { trackCTAClick } from "@/lib/analytics";

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
      icon: <FileX className="w-6 h-6 stroke-[1.5]" />,
      title: "Sin tesis",
      lead: "Compran narrativas, no inversiones.",
      bullets: [
        "Entran por ruido de redes, no por criterios propios",
        "No definen qué invalidaría su idea",
        "Sin horizonte temporal ni escenarios definidos",
      ],
    },
    {
      icon: <Scale className="w-6 h-6 stroke-[1.5]" />,
      title: "Sin gestión de riesgo",
      lead: "Un buen activo con mal sizing sigue perdiendo.",
      bullets: [
        "Tamaños de posición arbitrarios o emocionales",
        "Sin plan para drawdowns ni reservas de liquidez",
        "Promedian a la baja o venden en pánico",
      ],
    },
    {
      icon: <Brain className="w-6 h-6 stroke-[1.5]" />,
      title: "Sin sistema",
      lead: "Confunden invertir con trading impulsivo.",
      bullets: [
        "Persiguen el precio, ignoran los fundamentales",
        "Cambian el plan ante cualquier volatilidad",
        "No miden resultados, no iteran, no aprenden",
      ],
    },
  ];

  const processSteps = ["Tesis", "Valoración", "Ejecución", "Revisión"];

  const scrollToMethod = () => {
    trackCTAClick("problem_section_cta", "scroll_to_method");
    const methodSection = document.getElementById("method");
    if (methodSection) {
      methodSection.scrollIntoView({ behavior: "smooth" });
    }
  };

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

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-[56px] font-bold dark:text-white light:text-[#010052] mb-3 md:mb-4 leading-[1.15] transition-colors duration-300 max-w-4xl mx-auto">
            Por qué la mayoría pierde dinero en cripto
            <br />
            <span className="dark:text-[#B9B8EB]/80 light:text-[#3a54f8]/90 text-[0.9em]">(y cómo evitarlo)</span>
          </h2>
          <p className="dark:text-[#cccce0] light:text-[#3d3d6b] text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-3 transition-colors duration-300">
            No es el mercado, es el proceso. Estos son los 3 patrones más comunes.
          </p>
          {/* Proof line with icon */}
          <div className="flex items-center justify-center gap-2 dark:text-[#B9B8EB]/80 light:text-[#3d3d6b]/85 text-sm transition-colors duration-300">
            <Users className="w-4 h-4 shrink-0" />
            <span>Basado en los errores más frecuentes que vemos en alumnos y carteras reales.</span>
          </div>
        </div>

        {/* Grid de 3 Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8 md:mb-10">
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
                  className="absolute top-6 right-6 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold opacity-60 group-hover:opacity-90 transition-opacity duration-300"
                  style={{
                    background: theme === "light" ? accent.bg : accent.bgDark,
                    color: accent.color,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Header */}
                <div className="p-6 pb-0 relative z-10">
                  {/* Icon wrapper */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background: theme === "light" ? accent.bg : accent.bgDark,
                    }}
                  >
                    <div style={{ color: accent.color }}>
                      {problem.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className={`font-[family-name:var(--font-heading)] text-2xl md:text-[28px] font-bold leading-tight tracking-[-0.02em] transition-colors duration-300 ${
                      theme === "light" ? "text-[#010052]" : "text-white"
                    }`}
                  >
                    {problem.title}
                  </h3>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col p-6 pt-3 relative z-10">
                  {/* Lead sentence / quote */}
                  <p
                    className={`text-base leading-relaxed mb-4 pb-4 transition-colors duration-300 ${
                      theme === "light"
                        ? "text-[#3d3d6b] border-b border-[#010052]/20"
                        : "text-[#cccce0] border-b border-white/20"
                    }`}
                  >
                    {problem.lead}
                    {(index === 0 || index === 2) && <br />}&nbsp;
                  </p>

                  {/* Bullets with colored dots */}
                  <div className="space-y-3">
                    {problem.bullets.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex items-start gap-3">
                        <span
                          className="w-[5px] h-[5px] rounded-full mt-[7px] shrink-0"
                          style={{ background: accent.color }}
                        />
                        <p
                          className={`text-[13px] leading-relaxed transition-colors duration-300 ${
                            theme === "light" ? "text-[#3d3d6b]/80" : "text-[#cccce0]/80"
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

        {/* Closing bridge + CTA */}
        <div className="text-center">
          <p className="dark:text-[#cccce0] light:text-[#3d3d6b] text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-3 transition-colors duration-300">
            Nuestro método convierte esto en un proceso repetible:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-6">
            {processSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-2 md:gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full dark:bg-emerald-500/30 dark:text-emerald-300 light:bg-emerald-500/25 light:text-emerald-700 text-xs font-semibold transition-colors duration-300">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium dark:text-white/90 light:text-[#010052]/90 transition-colors duration-300">
                    {step}
                  </span>
                </div>
                {index < processSteps.length - 1 && (
                  <ChevronRight className="w-4 h-4 dark:text-[#B9B8EB]/30 light:text-[#3d3d6b]/30 transition-colors duration-300" />
                )}
              </div>
            ))}
          </div>
          <Button
            variant="secondaryGlow"
            size="lg"
            onClick={scrollToMethod}
            className="px-8 py-6 text-base font-semibold rounded-xl"
          >
            Ver el método
          </Button>
        </div>
      </div>
    </section>
  );
}
