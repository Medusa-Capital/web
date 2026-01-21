"use client";

import { TrendingDown, Clock, AlertTriangle } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ProblemSection() {
  const { theme } = useTheme();

  const problems = [
    {
      icon: <AlertTriangle className="w-6 h-6 stroke-[2.5]" />,
      title: "SIGUEN SEÑALES SIN CRITERIO",
      items: [
        "Compran por FOMO lo que dice un anónimo en Twitter",
        "No entienden QUÉ compraron ni POR QUÉ",
        "Venden en pánico cuando cae -20% (justo antes de la subida)",
        "Pierden 60-80% por no gestionar el riesgo",
      ],
    },
    {
      icon: <TrendingDown className="w-6 h-6 stroke-[2.5]" />,
      title: "SABEN PERO EJECUTAN MAL",
      items: [
        "Están +457% arriba y acaban cerrando la posición en negativo",
        "Saben identificar oportunidades pero no cuándo salir",
        "Holdean cadáveres esperando \"la vuelta\"",
        "Saben de DeFi, métricas on-chain... pero no tienen SISTEMA",
      ],
    },
    {
      icon: <Clock className="w-6 h-6 stroke-[2.5]" />,
      title: "DAN SU VIDA SIN VER RESULTADOS",
      items: [
        "Investigan 40h a la semana proyectos que nunca despegan",
        "Pagan 5 comunidades, 3 newsletters y leen a 20 analistas distintos",
        "No tienen tiempo para familia, solo para cripto",
        "Resultado: estrés y 0 resultados mientras otros SÍ ganan",
      ],
    },
  ];

  return (
    <section className="relative py-16 md:py-[75px] px-4 md:px-6">
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
        <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl lg:text-[60px] font-bold dark:text-white light:text-[#010052] text-center mb-8 md:mb-12 leading-tight transition-colors duration-300">
          ¿Por Qué el 90% de los Inversores en Cripto Pierden Dinero?
        </h2>

        {/* Grid de 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="rounded-[20px] md:rounded-[30px] p-6 md:p-8 min-h-[280px] transition-all duration-300 group"
              style={{
                background:
                  theme === "light"
                    ? "rgba(255, 255, 255, 0.9)"
                    : "rgba(197, 191, 230, 0.04)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border:
                  theme === "light"
                    ? "1px solid rgba(1, 0, 82, 0.1)"
                    : "1px solid rgba(197, 191, 230, 0.15)",
                boxShadow:
                  theme === "light"
                    ? "0 4px 20px rgba(1, 0, 82, 0.05)"
                    : "0 8px 32px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* Icon */}
              <div
                className="mb-6 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background:
                    theme === "light"
                      ? "rgba(58, 84, 248, 0.1)"
                      : "rgba(197, 191, 230, 0.08)",
                  boxShadow:
                    theme === "light"
                      ? "0 0 15px rgba(58, 84, 248, 0.2)"
                      : "0 0 15px rgba(197, 191, 230, 0.4)",
                }}
              >
                <div className="dark:text-[#c5bfe6] light:text-[#3a54f8] transition-colors duration-300">
                  {problem.icon}
                </div>
              </div>

              {/* Divider */}
              <div className="border-b dark:border-white/10 light:border-[#010052]/10 mb-4 pb-1 transition-colors duration-300" />

              {/* Title */}
              <h3 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold dark:text-white light:text-[#010052] mb-4 leading-tight transition-colors duration-300">
                {problem.title}
              </h3>

              {/* Items */}
              <div className="space-y-3">
                {problem.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-3">
                    <span className="text-[#ff4444] mt-1 shrink-0 text-lg">
                      ✗
                    </span>
                    <p className="dark:text-[#cccce0]/90 light:text-[#3d3d6b] text-sm md:text-base leading-relaxed transition-colors duration-300">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
