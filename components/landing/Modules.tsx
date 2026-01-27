"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

const modules = [
  {
    id: 1,
    title: "Bitcoin y el Derecho de Propiedad",
    subtitle: "Redefiniendo el dinero desde su origen",
    description:
      "Entiende por qué existe Bitcoin, cómo funciona su red, cómo se custodia, cómo se representa el valor y cómo propone una alternativa soberana al sistema fiat. Este módulo incluye fundamentos teóricos, arquitectura del sistema e implicaciones económicas.",
    imageUrl:
      "https://www.estrategiasdeinversion.com/uploads/noticias_redaccion/graficos_dentro/202601/semana_1/btc_portada.jpg",
  },
  {
    id: 2,
    title: "Esenciales Blockchain",
    subtitle: "Comprende la tecnología y sus implicaciones económicas",
    description:
      "Sienta las bases para moverte con soltura en el entorno blockchain. Se explican conceptos clave como DeFi, exchanges centralizados y descentralizados, wallets, bridges, bots y herramientas básicas para navegar en Web3. Es una guía práctica para entender cómo funciona este nuevo ecosistema y cómo participar de forma segura y eficaz.",
    imageUrl:
      "https://img.computing.es/wp-content/uploads/2024/01/29164754/blockchain.jpg",
  },
  {
    id: 3,
    title: "DeFi - Finanzas Descentralizadas",
    subtitle: "El sistema financiero abierto",
    description:
      "Explora protocolos de lending, DEXs, liquidity pools, yield farming y staking. Aprende a evaluar riesgos de smart contracts y a generar rendimiento en DeFi.",
    imageUrl:
      "https://media.licdn.com/dms/image/v2/D4D12AQHGtgWKSk8kEA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1678283219216?e=2147483647&v=beta&t=q-J13FfgI3lE-G8ZLqUwInUQRDjy6lC9EyizBbATrQA",
  },
  {
    id: 4,
    title: "Dinámicas de Mercado",
    subtitle: "Narrativas, ciclos y comportamiento institucional",
    description:
      "Aprende cómo fluye el capital en cripto. Analizamos las dinámicas macro y micro que mueven el mercado: ciclos, rotación sectorial, comportamiento institucional, y las mecánicas detrás del dinero inteligente. Clave para interpretar tendencias y posicionarse antes que el resto.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUfAcCT5FDTrc7-zuTO48aD3anRW3Qtkgrsg&s",
  },
  {
    id: 5,
    title: "Análisis Fundamental",
    subtitle: "Detecta valor en un mercado saturado",
    description:
      "Una guía para detectar oportunidades sólidas a largo plazo. Aprenderás a analizar whitepapers, evaluar la propuesta de valor de un token, entender la tokenomics, y construir una tesis completa sobre un proyecto. Incluye estudios reales sobre casos relevantes como $HYPE, Terra, stablecoins y más.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjsmUdW-ZpKRozvY8NXNzPSEz3arWVnFfnCg&s",
  },
  {
    id: 6,
    title: "Análisis On-Chain",
    subtitle: "Lectura directa del comportamiento del mercado",
    description:
      "Profundiza en la lectura directa de la blockchain. Estudia el comportamiento de smart money, detecta wallets relevantes, identifica señales de entrada y salida de capital, y utiliza herramientas como Arkham para tomar decisiones basadas en datos reales y verificables.",
    imageUrl:
      "https://tectum.io/wp-content/uploads/2023/05/on-chain-vs-off-chain-16x9-1.jpg",
  },
  {
    id: 7,
    title: "Psicología del Trading",
    subtitle: "Mentalidad, sesgos y toma de decisiones racionales",
    description:
      "El mayor enemigo de tus inversiones eres tú mismo. En este módulo abordamos la psicología financiera, sesgos cognitivos, sistemas de pensamiento, y cómo desarrollar la disciplina emocional necesaria para mantener tu plan. Incluye la teoría de la reflexividad y cómo impacta en cripto.",
    imageUrl:
      "https://www.avatrade.es/wp-content/uploads/2022/11/Online-Trading-Psychology.png.webp",
  },
  {
    id: 8,
    title: "Estrategia y Gestión de Cartera",
    subtitle: "De la teoría a la acción",
    description:
      "Aprende a construir, proteger y escalar tu portafolio. Diseña tu perfil de inversor, comprende la diferencia entre gestión activa y pasiva, y domina estrategias complejas (Delta Neutral), gestión por escenarios y control del riesgo. Todo con enfoque práctico, desde la teoría hasta el caso de uso.",
    imageUrl:
      "https://media.licdn.com/dms/image/v2/C4E12AQFvWMy3K9600Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1520137905379?e=2147483647&v=beta&t=WIa4YqwhDNj0uPt8aBOP0i7YAml7JYnvfqaTu-zFlOk",
  },
  {
    id: 9,
    title: "Fiscalidad de los Criptoactivos",
    subtitle: "Obligaciones y optimización fiscal",
    description:
      "Entiende cómo declarar criptoactivos en España, calcular plusvalías, documentar operaciones y aplicar estrategias legales para optimizar tu carga tributaria.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGH-DJ_9DRmgFU-oHKlgSM9zCQIMHki985vg&s",
  },
];

export function Modules() {
  const { theme } = useTheme();
  const [activeModule, setActiveModule] = useState(1);
  const [direction, setDirection] = useState(0);
  const currentModule = modules.find((m) => m.id === activeModule)!;

  const handleModuleChange = (moduleId: number) => {
    setDirection(moduleId > activeModule ? 1 : -1);
    const module = modules.find((m) => m.id === moduleId);
    trackEvent("module_view", {
      module_id: moduleId,
      module_title: module?.title || "unknown",
      category: "engagement",
    });
    setActiveModule(moduleId);
  };

  const goToPrev = () => {
    if (activeModule > 1) handleModuleChange(activeModule - 1);
  };

  const goToNext = () => {
    if (activeModule < modules.length) handleModuleChange(activeModule + 1);
  };

  const progressPercentage = (activeModule / modules.length) * 100;

  return (
    <section className="relative py-16 md:py-[100px] px-4 md:px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(36px,6vw,72px)] font-bold dark:text-white light:text-[#010052] leading-tight mb-4 transition-colors duration-300">
            Tu ruta de aprendizaje
          </h2>
          <p className="dark:text-[#B9B8EB]/60 light:text-[#3d3d6b]/70 text-xl md:text-2xl transition-colors duration-300">
            9 módulos para dominar el ecosistema cripto
          </p>
        </div>

        {/* Module selector - horizontal scroll */}
        <div className="relative mb-8 md:mb-12">
          {/* Navigation arrows */}
          <button
            onClick={goToPrev}
            disabled={activeModule === 1}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full dark:bg-[#1a1952] light:bg-white border dark:border-[#B9B8EB]/20 light:border-[#010052]/15 flex items-center justify-center transition-all",
              activeModule === 1
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-[#4355d9] hover:border-[#4355d9]"
            )}
          >
            <ChevronLeft className="w-5 h-5 dark:text-white light:text-[#010052]" />
          </button>
          <button
            onClick={goToNext}
            disabled={activeModule === modules.length}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full dark:bg-[#1a1952] light:bg-white border dark:border-[#B9B8EB]/20 light:border-[#010052]/15 flex items-center justify-center transition-all",
              activeModule === modules.length
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-[#4355d9] hover:border-[#4355d9]"
            )}
          >
            <ChevronRight className="w-5 h-5 dark:text-white light:text-[#010052]" />
          </button>

          {/* Module pills */}
          <div className="mx-12 overflow-x-auto scrollbar-hide">
            <div className="flex justify-center gap-2 md:gap-3 min-w-max px-4">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => handleModuleChange(module.id)}
                  className={cn(
                    "relative px-4 md:px-5 py-2.5 md:py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                    activeModule === module.id
                      ? "bg-[#4355d9] text-white shadow-lg shadow-[#4355d9]/30"
                      : "dark:bg-[#1a1952] light:bg-white dark:text-[#B9B8EB]/50 light:text-[#3d3d6b]/60 dark:hover:text-[#B9B8EB] light:hover:text-[#010052] dark:hover:bg-[#252463] light:hover:bg-[#f5f3f0] border dark:border-[#B9B8EB]/10 light:border-[#010052]/10"
                  )}
                >
                  <span className="relative z-10">{module.id}</span>
                  {activeModule === module.id && (
                    <motion.div
                      layoutId="activeModule"
                      className="absolute inset-0 bg-[#4355d9] rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Module content card */}
        <div className="relative">
          {/* Decorative glows */}
          <div
            className="absolute pointer-events-none transition-opacity duration-300"
            style={{
              right: "-100px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "400px",
              height: "400px",
              background: theme === "light"
                ? "radial-gradient(circle, rgba(58, 84, 248, 0.1) 0%, rgba(58, 84, 248, 0.03) 40%, transparent 70%)"
                : "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.1) 40%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute pointer-events-none transition-opacity duration-300"
            style={{
              left: "-100px",
              top: "30%",
              width: "300px",
              height: "300px",
              background: theme === "light"
                ? "radial-gradient(circle, rgba(1, 0, 82, 0.08) 0%, transparent 60%)"
                : "radial-gradient(circle, rgba(67, 85, 217, 0.25) 0%, transparent 60%)",
              filter: "blur(50px)",
            }}
          />

          {/* Card */}
          <div
            className="relative rounded-2xl md:rounded-3xl border dark:border-[#B9B8EB]/15 light:border-[#010052]/10 overflow-hidden transition-all duration-300"
            style={{
              background: theme === "light"
                ? "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 243, 240, 0.9) 50%, rgba(255, 255, 255, 0.95) 100%)"
                : "linear-gradient(135deg, rgba(67, 85, 217, 0.3) 0%, rgba(27, 26, 100, 0.5) 50%, rgba(1, 0, 82, 0.7) 100%)",
            }}
          >
            <div className="relative p-6 md:p-12">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeModule}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -50 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {/* Two-column layout */}
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-8 mb-6">
                    {/* Content column */}
                    <div>
                      {/* Module number with divider */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          <span className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] font-bold bg-gradient-to-br from-[#B9B8EB] to-[#6366f1] bg-clip-text text-transparent">
                            {String(activeModule).padStart(2, "0")}
                          </span>
                          <div
                            className="absolute -inset-3 rounded-lg blur-xl -z-10 transition-colors duration-300"
                            style={{
                              background:
                                theme === "light"
                                  ? "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(185, 184, 235, 0.1))"
                                  : "linear-gradient(135deg, rgba(185, 184, 235, 0.2), rgba(99, 102, 241, 0.2))",
                            }}
                          />
                        </div>
                        <div className="h-12 w-px bg-gradient-to-b from-transparent via-[#B9B8EB]/50 to-transparent" />
                        <span className="text-xs font-medium uppercase tracking-wide dark:text-[#B9B8EB]/60 light:text-[#3d3d6b]/60 transition-colors duration-300">
                          Módulo
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-[family-name:var(--font-heading)] text-xl md:text-[32px] font-bold dark:text-white light:text-[#010052] mb-3 leading-tight transition-colors duration-300">
                        {currentModule.title}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-sm md:text-base font-semibold bg-gradient-to-r from-[#B9B8EB] to-[#6366f1] bg-clip-text text-transparent mb-4">
                        {currentModule.subtitle}
                      </p>
                    </div>

                    {/* Image column */}
                    <div className="flex items-center justify-center md:justify-end">
                      <div className="relative w-[140px] h-[140px] md:w-[180px] md:h-[180px]">
                        {/* Glow effect */}
                        <div
                          className="absolute inset-0 rounded-full blur-2xl transition-colors duration-300"
                          style={{
                            background:
                              theme === "light"
                                ? "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(185, 184, 235, 0.15))"
                                : "linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(185, 184, 235, 0.3))",
                          }}
                        />

                        {/* Border gradient */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#B9B8EB]/40 via-[#6366f1]/30 to-transparent p-[2px]">
                          <div className="w-full h-full rounded-full dark:bg-[#010052]/80 light:bg-white/80 backdrop-blur-sm overflow-hidden transition-colors duration-300">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={activeModule}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.4 }}
                                className="w-full h-full relative"
                              >
                                <Image
                                  src={currentModule.imageUrl}
                                  alt={currentModule.title}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="dark:text-[#B9B8EB]/70 light:text-[#3d3d6b] leading-relaxed text-sm md:text-base transition-colors duration-300 mb-6">
                    {currentModule.description}
                  </p>

                  {/* Progress tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="px-3 py-1.5 rounded-full bg-[#6366f1]/15 border border-[#6366f1]/30">
                      <span className="text-xs font-medium dark:text-[#B9B8EB] light:text-[#4355d9] transition-colors duration-300">
                        Módulo {activeModule}/{modules.length}
                      </span>
                    </div>
                    <div className="w-1 h-1 rounded-full dark:bg-[#B9B8EB]/30 light:bg-[#010052]/20" />
                    {/* Mini progress bar */}
                    <div className="flex-1 min-w-[120px] h-2 dark:bg-[#B9B8EB]/10 light:bg-[#010052]/10 rounded-full overflow-hidden transition-colors duration-300">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#B9B8EB] to-[#6366f1]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t dark:border-[#B9B8EB]/10 light:border-[#010052]/10 transition-colors duration-300">
                <button
                  onClick={goToPrev}
                  disabled={activeModule === 1}
                  className={cn(
                    "flex items-center gap-2 text-sm transition-colors",
                    activeModule === 1
                      ? "dark:text-[#B9B8EB]/20 light:text-[#010052]/20 cursor-not-allowed"
                      : "dark:text-[#B9B8EB]/50 light:text-[#3d3d6b]/60 dark:hover:text-white light:hover:text-[#010052]"
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden md:inline">Anterior</span>
                </button>

                {/* Dot indicators */}
                <div className="flex gap-1.5">
                  {modules.map((module) => (
                    <motion.button
                      key={module.id}
                      onClick={() => handleModuleChange(module.id)}
                      className={cn(
                        "h-2 rounded-full transition-colors duration-300",
                        activeModule === module.id
                          ? "bg-gradient-to-r from-[#B9B8EB] to-[#6366f1] shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                          : module.id < activeModule
                            ? "bg-[#6366f1]/40"
                            : "dark:bg-[#B9B8EB]/15 light:bg-[#010052]/15"
                      )}
                      animate={{
                        width: activeModule === module.id ? 32 : 8,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>

                <button
                  onClick={goToNext}
                  disabled={activeModule === modules.length}
                  className={cn(
                    "flex items-center gap-2 text-sm transition-colors",
                    activeModule === modules.length
                      ? "dark:text-[#B9B8EB]/20 light:text-[#010052]/20 cursor-not-allowed"
                      : "dark:text-[#B9B8EB]/50 light:text-[#3d3d6b]/60 dark:hover:text-white light:hover:text-[#010052]"
                  )}
                >
                  <span className="hidden md:inline">Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
