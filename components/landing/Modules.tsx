"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const modules = [
  {
    id: 1,
    title: "Bitcoin y el Derecho de Propiedad",
    subtitle: "Redefiniendo el dinero desde su origen",
    description:
      "Entiende por qué existe Bitcoin, cómo funciona su red, cómo se custodia, cómo se representa el valor y cómo propone una alternativa soberana al sistema fiat. Este módulo incluye fundamentos teóricos, arquitectura del sistema e implicaciones económicas.",
  },
  {
    id: 2,
    title: "Fundamentos de Blockchain y Navegación Web3",
    subtitle: "Tu brújula en el ecosistema descentralizado",
    description:
      "Aprende sobre DeFi, exchanges centralizados y descentralizados, wallets, bridges, bots y los fundamentos para navegar Web3 de forma segura.",
  },
  {
    id: 3,
    title: "Ciclos de Mercado y Dinámica de Capitales",
    subtitle: "Entendiendo los flujos del dinero",
    description:
      "Examina los flujos de capital, dinámicas macro y micro, ciclos de mercado, comportamiento institucional y mecánicas del 'smart money'.",
  },
  {
    id: 4,
    title: "Análisis Fundamental de Proyectos",
    subtitle: "Evaluando el valor real",
    description:
      "Aprende a evaluar whitepapers, valoración de tokens, tokenomics y desarrollo de tesis de inversión para proyectos cripto.",
  },
  {
    id: 5,
    title: "Análisis On-Chain",
    subtitle: "Leyendo la blockchain",
    description:
      "Enfócate en leer el comportamiento de la blockchain, rastrear smart money, identificar wallets y usar herramientas como Arkham.",
  },
  {
    id: 6,
    title: "Psicología del Trading",
    subtitle: "Dominando tu mente",
    description:
      "Aborda sesgos cognitivos, disciplina emocional, teoría de la reflexividad y marcos de toma de decisiones.",
  },
  {
    id: 7,
    title: "Estrategia y Gestión de Portafolio",
    subtitle: "Construyendo tu cartera",
    description:
      "Cubre perfilamiento de inversor, gestión activa/pasiva, estrategias delta-neutral y control de riesgos.",
  },
];

export function Modules() {
  const [activeModule, setActiveModule] = useState(1);
  const currentModule = modules.find((m) => m.id === activeModule)!;

  return (
    <section className="relative py-24 px-6 bg-[#010052] z-20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-white leading-tight mb-12">
          Tu Ruta de Aprendizaje
          <br />
          con Medusa Capital
        </h2>

        {/* Tab navigation - pill style matching legacy */}
        <div className="inline-flex flex-wrap justify-center gap-1 mb-12 p-1.5 rounded-full bg-[#0a0a3a] border border-[#B9B8EB]/5">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                activeModule === module.id
                  ? "bg-[#4355d9] text-white"
                  : "bg-transparent text-[#B9B8EB]/50 hover:text-[#B9B8EB]"
              )}
            >
              Módulo {module.id}
            </button>
          ))}
        </div>

        {/* Module content card with gradient background */}
        <div className="relative">
          {/* Radial glow on the right side */}
          <div
            className="absolute pointer-events-none"
            style={{
              right: "-50px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "350px",
              height: "350px",
              background: "radial-gradient(circle, rgba(185, 184, 235, 0.35) 0%, rgba(185, 184, 235, 0.15) 40%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
          {/* Card with gradient from top to bottom */}
          <div
            className="relative rounded-3xl p-8 md:p-12 border border-[#B9B8EB]/20"
            style={{
              background: "linear-gradient(180deg, rgba(67, 85, 217, 0.4) 0%, rgba(27, 26, 100, 0.6) 50%, rgba(1, 0, 82, 0.8) 100%)",
            }}
          >
            {/* Title with pill border */}
            <Badge variant="pill" className="mb-6">
              <h3 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold text-white">
                {currentModule.title}
              </h3>
            </Badge>
            <p className="text-[#B9B8EB] font-medium mb-4">
              {currentModule.subtitle}
            </p>
            <p className="text-[#B9B8EB]/60 leading-relaxed max-w-2xl mx-auto text-sm md:text-base">
              {currentModule.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
