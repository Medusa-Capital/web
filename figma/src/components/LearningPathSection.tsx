import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Module {
  number: number;
  title: string;
  subtitle: string;
  description: string;
  percentage: number;
  imageUrl: string;
}

const modules: Module[] = [
  {
    number: 1,
    title: "Bitcoin y el Derecho de Propiedad",
    subtitle: "Redefiniendo el dinero desde su origen",
    description: "Entiende por qué existe Bitcoin, cómo funciona su red, cómo se custodia, cómo se representa el valor y cómo propone una alternativa soberana al sistema fiat. Este módulo incluye fundamentos teóricos, arquitectura del sistema e implicaciones económicas.",
    percentage: 11,
    imageUrl: "https://www.estrategiasdeinversion.com/uploads/noticias_redaccion/graficos_dentro/202601/semana_1/btc_portada.jpg"
  },
  {
    number: 2,
    title: "Fundamentos de Blockchain y Navegación Web3",
    subtitle: "Comprende la tecnología y sus implicaciones económicas",
    description: "Aprende sobre Finanzas Descentralizadas, Plataformas de Intercambio Centralizadas y Descentralizados, carteras, puentes y los fundamentos para navegar Web3 de forma segura.",
    percentage: 22,
    imageUrl: "https://img.computing.es/wp-content/uploads/2024/01/29164754/blockchain.jpg"
  },
  {
    number: 3,
    title: "DeFi - Finanzas Descentralizadas",
    subtitle: "El sistema financiero abierto",
    description: "Explora protocolos de préstamos, plataformas de intercambio descentralizadas, liquidity pools, yield farming y staking. Aprende a evaluar riesgos de contratos inteligentes y a generar rendimiento pasivo a través de las Finanzas Descentralizadas",
    percentage: 33,
    imageUrl: "https://media.licdn.com/dms/image/v2/D4D12AQHGtgWKSk8kEA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1678283219216?e=2147483647&v=beta&t=q-J13FfgI3lE-G8ZLqUwInUQRDjy6lC9EyizBbATrQA"
  },
  {
    number: 4,
    title: "Ciclos de Mercado y Dinámica de Capitales",
    subtitle: "Narrativas, ciclos y comportamiento institucional",
    description: "Entiende los flujos de capital, dinámicas macro y micro, ciclos de mercado, comportamiento institucional y mecánicas del 'Dinero Inteligente'. Gracias a la blockchain podemos saber qué hacen los peces grandes.",
    percentage: 44,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUfAcCT5FDTrc7-zuTO48aD3anRW3Qtkgrsg&s"
  },
  {
    number: 5,
    title: "Análisis Fundamental de Proyectos",
    subtitle: "Detecta valor en un mercado saturado",
    description: "Aprende a evaluar whitepapers, valoración de tokens, diseño de la token economía y desarrollo de tesis de inversión para proyectos cripto.",
    percentage: 56,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjsmUdW-ZpKRozvY8NXNzPSEz3arWVnFfnCg&s"
  },
  {
    number: 6,
    title: "Análisis On-Chain",
    subtitle: "Radiografía del mercado",
    description: "Enfócate en leer el comportamiento de la blockchain, rastrear qué hace el \"dinero Inteligente\", identificar carteras y usar herramientas profesionales como Arkham.",
    percentage: 67,
    imageUrl: "https://tectum.io/wp-content/uploads/2023/05/on-chain-vs-off-chain-16x9-1.jpg"
  },
  {
    number: 7,
    title: "Psicología del Trading",
    subtitle: "Mentalidad, sesgos y toma de decisiones racionales",
    description: "La mente es, en ocasiones, nuestro peor enemigo. A través de este módulo entenderás los sesgos cognitivos, obtendrás disciplina emocional y comprenderás el desarrollo de los precios gracias a teoría de la reflexividad. Todo ello te permitirá toma decisiones racionales.",
    percentage: 78,
    imageUrl: "https://www.avatrade.es/wp-content/uploads/2022/11/Online-Trading-Psychology.png.webp"
  },
  {
    number: 8,
    title: "Estrategia y Gestión de Portafolio",
    subtitle: "De la teoría a la acción",
    description: "Si no te conoces, estás perdido. Este módulo cubre perfilamiento de inversor, gestión activa/pasiva, estrategias delta-neutral y control de riesgos. Todo ello enfocado en el desarrollo de una estrategia personalizada.",
    percentage: 89,
    imageUrl: "https://media.licdn.com/dms/image/v2/C4E12AQFvWMy3K9600Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1520137905379?e=2147483647&v=beta&t=WIa4YqwhDNj0uPt8aBOP0i7YAml7JYnvfqaTu-zFlOk"
  },
  {
    number: 9,
    title: "Fiscalidad de los Criptoactivos",
    subtitle: "Obligaciones y optimización fiscal",
    description: "Entiende cómo declarar los activos digitales en España, calcular plusvalías, documentar operaciones y aplicar estrategias legales para optimizar tu carga tributaria.",
    percentage: 100,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGH-DJ_9DRmgFU-oHKlgSM9zCQIMHki985vg&s"
  }
];

export function LearningPathSection() {
  const [activeModule, setActiveModule] = useState(0);
  const [direction, setDirection] = useState(0);
  const currentModule = modules[activeModule];

  const handleNext = () => {
    if (activeModule < 8) {
      setDirection(1);
      setActiveModule(activeModule + 1);
    }
  };

  const handlePrev = () => {
    if (activeModule > 0) {
      setDirection(-1);
      setActiveModule(activeModule - 1);
    }
  };

  const handleModuleClick = (index: number) => {
    setDirection(index > activeModule ? 1 : -1);
    setActiveModule(index);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <div className="w-full max-w-[1024px] mx-auto px-6 py-8">
      {/* Título */}
      <div className="text-center mb-16">
        <h2 className="font-['Cormorant_Garamond',serif] font-bold text-[60px] leading-[57px] text-white mb-4">
          Tu Ruta de Aprendizaje
        </h2>
        <p className="font-['Inter:Regular',sans-serif] text-[24px] leading-[32px] text-[rgba(185,184,235,0.6)]">
          9 módulos para dominar el ecosistema cripto
        </p>
      </div>

      {/* Selectores de módulos */}
      <div className="relative mb-16 px-12">
        <div className="flex gap-3 items-center justify-center flex-wrap">
          {modules.map((module, index) => (
            <button
              key={index}
              onClick={() => handleModuleClick(index)}
              aria-label={`Módulo ${index + 1}`}
              aria-current={index === activeModule ? 'true' : 'false'}
              className={`${
                index === activeModule 
                  ? 'bg-gradient-to-br from-[#6366f1] to-[#4355d9] shadow-[0_0_30px_rgba(99,102,241,0.5)]'
                  : 'bg-[#010052] border border-[rgba(185,184,235,0.1)]'
              } rounded-full px-5 py-3 transition-all duration-300 hover:scale-110 relative overflow-hidden`}
            >
              {index === activeModule && (
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(185,184,235,0.3)] to-transparent opacity-50" />
              )}
              <p className="font-['Inter'] font-medium text-[14px] text-white relative z-10 m-0">
                {index + 1}
              </p>
            </button>
          ))}
        </div>

        {/* Navegación lateral */}
        <button
          onClick={handlePrev}
          disabled={activeModule === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#010052] border border-[rgba(185,184,235,0.2)] flex items-center justify-center transition-all duration-300 ${
            activeModule === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:scale-110 hover:border-[#b9b8eb]'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="#B9B8EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          disabled={activeModule === 8}
          className={`absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#010052] border border-[rgba(185,184,235,0.2)] flex items-center justify-center transition-all duration-300 ${
            activeModule === 8 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:scale-110 hover:border-[#b9b8eb]'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="#B9B8EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Tarjeta de contenido con icono grande */}
      <div className="relative rounded-[32px] overflow-hidden">
        {/* Borde exterior con gradiente */}
        <div className="absolute inset-[-2px] rounded-[32px] bg-gradient-to-br from-[rgba(185,184,235,0.3)] via-[rgba(99,102,241,0.2)] to-transparent" />
        
        {/* Fondo glassmorphism */}
        <div className="relative rounded-[32px] backdrop-blur-xl bg-[rgba(1,0,82,0.7)]">
          {/* Efectos de fondo */}
          <div className="absolute inset-0 overflow-hidden rounded-[32px]">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[rgba(99,102,241,0.15)] blur-[80px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[rgba(185,184,235,0.1)] blur-[60px] rounded-full" />
          </div>

          <div className="relative p-12">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeModule}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="relative z-10"
              >
                {/* Header con imagen grande */}
                <div className="grid grid-cols-[1fr_auto] gap-8 mb-8">
                  <div>
                    {/* Número y etiqueta */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <div className="text-5xl font-['Cormorant_Garamond:Bold',sans-serif] bg-gradient-to-br from-[#b9b8eb] to-[#6366f1] bg-clip-text text-transparent">
                          {String(activeModule + 1).padStart(2, '0')}
                        </div>
                        <div className="absolute -inset-3 bg-gradient-to-br from-[rgba(185,184,235,0.2)] to-[rgba(99,102,241,0.2)] blur-xl -z-10" />
                      </div>
                      <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-[rgba(185,184,235,0.5)] to-transparent" />
                      <span className="text-sm font-['Inter:Medium',sans-serif] text-[rgba(185,184,235,0.6)] uppercase tracking-wide">
                        Módulo
                      </span>
                    </div>

                    <h3 className="text-[32px] font-['Cormorant_Garamond:Bold',sans-serif] text-white leading-tight mb-3">
                      {currentModule.title}
                    </h3>

                    <p className="text-base font-['Inter:Semi_Bold',sans-serif] font-semibold bg-gradient-to-r from-[#b9b8eb] to-[#6366f1] bg-clip-text text-transparent mb-5">
                      {currentModule.subtitle}
                    </p>
                  </div>

                  {/* Imagen grande con efectos */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-[180px] h-[180px]">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(99,102,241,0.4)] to-[rgba(185,184,235,0.3)] blur-2xl rounded-full" />
                      
                      {/* Border gradiente */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[rgba(185,184,235,0.4)] via-[rgba(99,102,241,0.3)] to-transparent p-[2px]">
                        <div className="w-full h-full rounded-full bg-[rgba(1,0,82,0.8)] backdrop-blur-sm overflow-hidden">
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={activeModule}
                              src={currentModule.imageUrl}
                              alt={currentModule.title}
                              className="w-full h-full object-cover"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.4 }}
                            />
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-base font-['Inter:Regular',sans-serif] text-[rgba(185,184,235,0.7)] leading-relaxed mb-6 -mt-2">
                  {currentModule.description}
                </p>

                {/* Tags con progreso integrado */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="px-3 py-1.5 rounded-full bg-[rgba(99,102,241,0.15)] border border-[rgba(99,102,241,0.3)]">
                    <span className="text-xs font-['Inter:Medium',sans-serif] text-[#b9b8eb]">
                      Módulo {activeModule + 1}/9
                    </span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-[rgba(185,184,235,0.3)]" />
                  {/* Barra de progreso mini */}
                  <div className="flex-1 min-w-[120px] h-2 bg-[rgba(185,184,235,0.1)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#b9b8eb] to-[#6366f1]"
                      initial={{ width: 0 }}
                      animate={{ width: `${currentModule.percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navegación inferior */}
            <div className="flex items-center justify-between mt-10 pt-8 border-t border-[rgba(185,184,235,0.1)]">
              <button
                onClick={handlePrev}
                disabled={activeModule === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeModule === 0 
                    ? 'opacity-30 cursor-not-allowed' 
                    : 'opacity-100 hover:bg-[rgba(185,184,235,0.05)]'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="#B9B8EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={activeModule === 0 ? "0.3" : "0.7"} />
                </svg>
                <span className={`text-sm font-['Inter:Regular',sans-serif] ${activeModule === 0 ? 'text-[rgba(185,184,235,0.3)]' : 'text-[rgba(185,184,235,0.7)]'}`}>
                  Anterior
                </span>
              </button>

              {/* Indicadores de progreso */}
              <div className="flex gap-2">
                {modules.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`rounded-full h-2 transition-all duration-300 ${
                      index === activeModule 
                        ? 'bg-gradient-to-r from-[#b9b8eb] to-[#6366f1] shadow-[0_0_8px_rgba(99,102,241,0.6)]' 
                        : index < activeModule
                        ? 'bg-[rgba(99,102,241,0.4)]'
                        : 'bg-[rgba(185,184,235,0.15)]'
                    }`}
                    animate={{
                      width: index === activeModule ? '32px' : '8px'
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={activeModule === 8}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeModule === 8 
                    ? 'opacity-30 cursor-not-allowed' 
                    : 'opacity-100 hover:bg-[rgba(185,184,235,0.05)]'
                }`}
              >
                <span className={`text-sm font-['Inter:Regular',sans-serif] ${activeModule === 8 ? 'text-[rgba(185,184,235,0.3)]' : 'text-[rgba(185,184,235,0.7)]'}`}>
                  Siguiente
                </span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="#B9B8EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={activeModule === 8 ? "0.3" : "0.7"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}