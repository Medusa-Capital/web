import {
  BarChart3,
  Globe,
  TrendingUp,
  Target,
  Droplets,
  Settings,
  DoorOpen,
  RefreshCcw,
  Shield,
  Filter,
} from "lucide-react";
import { PdfLeadCaptureForm } from "./PdfLeadCaptureForm";

const BLURRED_TAGS = new Set([
  "Dilución excesiva",
  "Desalineación equity/token",
  "Revenue real",
  "Alineación de incentivos",
  "Ciclo risk-on / risk-off",
  "Flujos institucionales",
  "Zonas de liquidez",
]);

const analysisSteps = [
  {
    number: 1,
    title: "Filtros de descarte",
    subtitle: "El 85% no pasa este filtro",
    description:
      "Antes de analizar, descartamos. Si un activo tiene cualquiera de estos factores de riesgo estructural, no entra en cartera. De esta manera, nos ahorramos cientos de horas de estudio de proyectos.",
    icon: Filter,
    tags: [
      "Dilución excesiva",
      "Desalineación equity/token",
      "Activo ilíquido",
      "Valoración injustificada",
      "Modelo de negocio incomprensible",
    ],
    accent: "#e8a0a0",
  },
  {
    number: 2,
    title: "Análisis fundamental",
    subtitle: "La base de cada decisión de inversión",
    description:
      "¿Tiene demanda real, genera ingresos verificables y el inversor captura ese valor?",
    icon: BarChart3,
    tags: [
      "Product-market fit",
      "Revenue real",
      "Captura de valor",
      "Alineación de incentivos",
    ],
    accent: "#6B8AFF",
  },
  {
    number: 3,
    title: "Contexto macroeconómico",
    subtitle: "El marco que confirma, no que anticipa",
    description:
      "¿Favorece el entorno macro la entrada de capital en activos de riesgo?",
    icon: Globe,
    tags: [
      "Liquidez global",
      "Ciclo risk-on / risk-off",
      "Flujos institucionales",
    ],
    accent: "#50d98a",
  },
  {
    number: 4,
    title: "Análisis técnico",
    subtitle: "Validación de timing",
    description:
      "Si los fundamentales dicen SÍ pero el técnico dice NO, no se opera",
    icon: TrendingUp,
    tags: ["Estructura de mercado", "Zonas de liquidez"],
    accent: "#fbbf24",
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
            La solución: el Sistema Medusa
          </h2>
          <p className="text-[#cccce0] text-base md:text-lg leading-relaxed max-w-3xl mx-auto transition-colors duration-300">
            Un plan de 4 pasos que filtra el 85% de tokens que destruyen capital antes de que inviertas un euro
          </p>
        </div>

        {/* Analysis Steps Grid */}
        <div className="mb-16 md:mb-20">
          <div className="flex flex-col gap-4">
            {/* Step 1: Filtros de Descarte — full width featured card */}
            {(() => {
              const step = analysisSteps[0];
              const Icon = step.icon;
              return (
                <div
                  className="relative rounded-[20px] p-6 md:p-8 overflow-hidden bg-gradient-to-br from-[#1b1a64]/70 to-[#151450]/90"
                  style={{ borderWidth: 1, borderStyle: "solid", borderColor: `${step.accent}30` }}
                >
                  {/* Accent corner glow */}
                  <div
                    className="absolute -top-16 -right-16 w-56 h-56 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${step.accent}20, transparent 70%)`,
                      filter: "blur(40px)",
                    }}
                  />

                  {/* Watermark number */}
                  <span
                    className="absolute top-4 right-6 md:right-10 text-[120px] md:text-[160px] font-bold leading-none pointer-events-none select-none"
                    style={{ color: `${step.accent}10` }}
                  >
                    {step.number}
                  </span>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                      style={{ background: `${step.accent}15`, boxShadow: `inset 0 0 0 1px ${step.accent}25` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: step.accent }} strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <h3 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold italic text-white mb-2 leading-tight">
                      {step.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="font-semibold text-sm md:text-base text-white mb-3">
                      {step.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-sm md:text-base leading-relaxed text-[#cccce0] mb-5 max-w-3xl">
                      {step.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-medium${BLURRED_TAGS.has(tag) ? " blur-[5px] select-none" : ""}`}
                          style={{
                            color: step.accent,
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderColor: `${step.accent}40`,
                            background: `${step.accent}12`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Steps 2-4: Three equal columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysisSteps.slice(1).map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.number}
                    className="relative rounded-[20px] p-6 md:p-7 overflow-hidden bg-gradient-to-br from-[#1b1a64]/70 to-[#151450]/90 flex flex-col"
                    style={{ borderWidth: 1, borderStyle: "solid", borderColor: `${step.accent}20` }}
                  >
                    {/* Accent corner glow */}
                    <div
                      className="absolute -top-12 -right-12 w-40 h-40 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle, ${step.accent}18, transparent 70%)`,
                        filter: "blur(30px)",
                      }}
                    />

                    {/* Watermark number */}
                    <span
                      className="absolute top-2 right-4 md:right-6 text-[120px] md:text-[140px] font-bold leading-none pointer-events-none select-none"
                      style={{ color: `${step.accent}0D` }}
                    >
                      {step.number}
                    </span>

                    <div className="relative z-10 flex flex-col h-full">
                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                        style={{ background: `${step.accent}15`, boxShadow: `inset 0 0 0 1px ${step.accent}25` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: step.accent }} strokeWidth={1.5} />
                      </div>

                      {/* Title */}
                      <h3 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold italic text-white mb-1 leading-tight">
                        {step.title}
                      </h3>

                      {/* Subtitle */}
                      <p className="font-semibold text-sm text-white mb-3">
                        {step.subtitle}
                      </p>

                      {/* Description */}
                      <p className="text-sm leading-relaxed text-[#cccce0]/80 mb-5">
                        {step.description}
                      </p>

                      {/* Tags */}
                      <div className="mt-auto flex flex-wrap gap-2">
                        {step.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium${BLURRED_TAGS.has(tag) ? " blur-[5px] select-none" : ""}`}
                            style={{
                              color: `${step.accent}CC`,
                              borderWidth: 1,
                              borderStyle: "solid",
                              borderColor: `${step.accent}30`,
                              background: `${step.accent}10`,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Philosophy Quote */}
        <blockquote className="relative border-l-2 border-[#B9B8EB]/40 pl-6 md:pl-8 py-2 max-w-4xl mx-auto">
          <p className="font-[family-name:var(--font-heading)] text-lg md:text-xl lg:text-2xl italic text-[#cccce0] leading-relaxed">
            Concentración en pocos activos de alta convicción. Comprar con
            descuento, nunca por impulso. Saber cuándo salir. Proteger capital
            por encima de maximizar ganancias.
          </p>
          <footer className="mt-4 text-sm text-[#B9B8EB]/50">
            — Filosofía de inversión, Sistema Medusa
          </footer>
        </blockquote>

        {/* CTA Section */}
        <div className="text-center mt-12 md:mt-16">
          <PdfLeadCaptureForm />
        </div>
      </div>
    </section>
  );
}
