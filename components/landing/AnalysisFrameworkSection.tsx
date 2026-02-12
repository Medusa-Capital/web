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
  Download,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const analysisSteps = [
  {
    number: 1,
    title: "Filtros de Descarte",
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
  },
  {
    number: 2,
    title: "Análisis Fundamental",
    subtitle: "La base de cada decisión de inversión",
    description:
      "¿Tiene demanda real, genera ingresos verificables y el inversor captura ese valor?",
    icon: BarChart3,
    tags: [
      "Product-Market Fit",
      "Revenue Real",
      "Captura de Valor",
      "Alineación de Incentivos",
    ],
  },
  {
    number: 3,
    title: "Contexto Macroeconómico",
    subtitle: "El marco que confirma, no que anticipa",
    description:
      "¿Favorece el entorno macro la entrada de capital en activos de riesgo?",
    icon: Globe,
    tags: [
      "Liquidez Global",
      "Ciclo Risk-On / Risk-Off",
      "Flujos Institucionales",
    ],
  },
  {
    number: 4,
    title: "Análisis Técnico",
    subtitle: "Validación de timing",
    description:
      "Si los fundamentales dicen SÍ pero el técnico dice NO, no se opera",
    icon: TrendingUp,
    tags: ["Estructura de mercado", "Zonas de liquidez"],
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

        {/* Analysis Steps Grid */}
        <div className="mb-16 md:mb-20">
          <div className="flex flex-col gap-4">
            {/* Step 1: Filtros de Descarte — full width featured card */}
            {(() => {
              const step = analysisSteps[0];
              const Icon = step.icon;
              return (
                <div className="relative rounded-[20px] p-6 md:p-8 overflow-hidden border border-[#B9B8EB]/12 bg-gradient-to-br from-[#1b1a64]/70 to-[#151450]/90">
                  {/* Watermark number */}
                  <span
                    className="absolute top-4 right-6 md:right-10 text-[120px] md:text-[160px] font-bold leading-none pointer-events-none select-none"
                    style={{ color: "rgba(185, 184, 235, 0.06)" }}
                  >
                    {step.number}
                  </span>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5 bg-[#B9B8EB]/10 ring-1 ring-[#B9B8EB]/15">
                      <Icon className="w-5 h-5 text-[#B9B8EB]" strokeWidth={1.5} />
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
                          className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#e8a0a0] border border-[#e8a0a0]/30 bg-[#e8a0a0]/8"
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
                    className="relative rounded-[20px] p-6 md:p-7 overflow-hidden border border-[#B9B8EB]/12 bg-gradient-to-br from-[#1b1a64]/70 to-[#151450]/90 flex flex-col"
                  >
                    {/* Watermark number */}
                    <span
                      className="absolute top-2 right-4 md:right-6 text-[120px] md:text-[140px] font-bold leading-none pointer-events-none select-none"
                      style={{ color: "rgba(185, 184, 235, 0.06)" }}
                    >
                      {step.number}
                    </span>

                    <div className="relative z-10 flex flex-col h-full">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5 bg-[#B9B8EB]/10 ring-1 ring-[#B9B8EB]/15">
                        <Icon className="w-5 h-5 text-[#B9B8EB]" strokeWidth={1.5} />
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
                            className="px-3 py-1.5 rounded-full text-xs font-medium text-[#B9B8EB]/80 border border-[#B9B8EB]/20 bg-[#B9B8EB]/8"
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
