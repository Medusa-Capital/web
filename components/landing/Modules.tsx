"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

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
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#050520] to-[#0a0a2e]">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-[#CCCCE0] leading-tight mb-12">
          Tu Ruta de Aprendizaje
          <br />
          con Medusa Capital
        </h2>

        {/* Tab navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeModule === module.id
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
              )}
            >
              Módulo {module.id}
            </button>
          ))}
        </div>

        {/* Module content card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <h3 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-[#CCCCE0] mb-3">
            {currentModule.title}
          </h3>
          <p className="text-purple-400 font-medium mb-6">
            {currentModule.subtitle}
          </p>
          <p className="text-white/60 leading-relaxed max-w-2xl mx-auto">
            {currentModule.description}
          </p>
        </div>
      </div>
    </section>
  );
}
