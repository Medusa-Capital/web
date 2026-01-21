import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Module {
  number: number;
  title: string;
  subtitle: string;
  description: string;
  percentage: number;
}

interface ModuleCardAsymmetricProps {
  currentModule: Module;
  activeModule: number;
  direction: number;
  variants: any;
  ButtonBackgroundImage: React.ComponentType<{ children: React.ReactNode }>;
  ComponentBackgroundImage3: React.ComponentType<{ children: React.ReactNode }>;
  handlePrev: () => void;
  handleNext: () => void;
}

export function ModuleCardAsymmetric({
  currentModule,
  activeModule,
  direction,
  variants,
  ButtonBackgroundImage,
  ComponentBackgroundImage3,
  handlePrev,
  handleNext
}: ModuleCardAsymmetricProps) {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 right-0 top-[357px]" data-name="Container">
      {/* Efectos de fondo asimétricos */}
      <div className="absolute blur-[45px] filter right-0 top-0 w-[300px] h-[300px]" 
           style={{ background: "radial-gradient(circle at top right, rgba(232,92,48,0.4) 0%, transparent 70%)" }} />
      <div className="absolute blur-[45px] filter left-0 bottom-0 w-[280px] h-[280px]" 
           style={{ background: "radial-gradient(circle at bottom left, rgba(99,102,241,0.35) 0%, transparent 70%)" }} />
      
      <div className="relative rounded-[24px] overflow-hidden w-full">
        {/* Borde animado */}
        <div className="absolute inset-0 rounded-[24px] p-[1px] bg-gradient-to-br from-[rgba(255,122,77,0.5)] via-transparent to-[rgba(99,102,241,0.4)]">
          <div className="w-full h-full rounded-[23px] bg-[rgba(1,0,82,0.85)]" />
        </div>
        
        <div className="relative backdrop-blur-xl">
          {/* Banda superior decorativa */}
          <div className="h-2 bg-gradient-to-r from-[#e85c30] via-[#ff7a4d] to-[#6366f1] opacity-60" />
          
          <div className="p-12 relative">
            {/* Círculos decorativos */}
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-60 h-60 rounded-full border-2 border-[rgba(255,122,77,0.1)] opacity-50" />
            <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-[rgba(99,102,241,0.15)] opacity-40" />
            
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
                {/* Header grid */}
                <div className="grid grid-cols-[1fr_auto] gap-8 mb-8">
                  <div>
                    {/* Número decorativo inline */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <div className="text-5xl font-['Cormorant_Garamond:Bold',sans-serif] bg-gradient-to-br from-[#ff7a4d] to-[#6366f1] bg-clip-text text-transparent">
                          {String(activeModule + 1).padStart(2, '0')}
                        </div>
                        <div className="absolute -inset-2 bg-gradient-to-br from-[rgba(255,122,77,0.2)] to-[rgba(99,102,241,0.2)] blur-xl -z-10" />
                      </div>
                      <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-[rgba(255,122,77,0.5)] to-transparent" />
                      <span className="text-sm font-['Inter:Medium',sans-serif] text-[rgba(185,184,235,0.5)] uppercase tracking-wide">
                        Módulo
                      </span>
                    </div>

                    <h3 className="text-[30px] font-['Cormorant_Garamond:Bold',sans-serif] text-white leading-tight mb-3">
                      {currentModule.title}
                    </h3>

                    <p className="text-base font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#ff7a4d] mb-5">
                      {currentModule.subtitle}
                    </p>
                  </div>

                  {/* Círculo de progreso */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgba(185,184,235,0.1)"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="url(#progressGradient)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - currentModule.percentage / 100) }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                        <defs>
                          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#e85c30" />
                            <stop offset="50%" stopColor="#ff7a4d" />
                            <stop offset="100%" stopColor="#6366f1" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-['Inter:Bold',sans-serif] bg-gradient-to-br from-[#ff7a4d] to-[#6366f1] bg-clip-text text-transparent">
                          {currentModule.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-sm font-['Inter:Regular',sans-serif] text-[rgba(185,184,235,0.7)] leading-relaxed max-w-[650px] mb-6">
                  {currentModule.description}
                </p>

                {/* Tags decorativos */}
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-[rgba(232,92,48,0.15)] border border-[rgba(232,92,48,0.3)]">
                    <span className="text-xs font-['Inter:Medium',sans-serif] text-[#ff7a4d]">
                      {activeModule + 1}/9
                    </span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-[rgba(185,184,235,0.3)]" />
                  <div className="px-3 py-1 rounded-full bg-[rgba(99,102,241,0.15)] border border-[rgba(99,102,241,0.3)]">
                    <span className="text-xs font-['Inter:Medium',sans-serif] text-[#6366f1]">
                      Contenido completo
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navegación inferior */}
            <div className="content-stretch flex items-center justify-between pb-0 pt-8 px-0 mt-8 relative shrink-0 w-full border-t border-[rgba(185,184,235,0.1)]">
              <button onClick={handlePrev} disabled={activeModule === 0} className={`transition-opacity duration-300 ${activeModule === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:opacity-80'}`}>
                <ButtonBackgroundImage>
                  <ComponentBackgroundImage3>
                    <path d="M10 12L6 8L10 4" id="Vector" stroke="var(--stroke-0, #B9B8EB)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={activeModule === 0 ? "0.2" : "0.5"} strokeWidth="1.33333" />
                  </ComponentBackgroundImage3>
                  <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
                    <div className={`flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-nowrap ${activeModule === 0 ? 'text-[rgba(185,184,235,0.2)]' : 'text-[rgba(185,184,235,0.5)]'}`}>
                      <p className="leading-[20px]">Anterior</p>
                    </div>
                  </div>
                </ButtonBackgroundImage>
              </button>

              <div className="relative shrink-0" data-name="Container">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-start relative">
                  {[...Array(9)].map((_, index) => (
                    <motion.div
                      key={index}
                      className={`rounded-full shrink-0 h-[8px] transition-all duration-300 ${
                        index === activeModule 
                          ? 'bg-gradient-to-r from-[#e85c30] to-[#ff7a4d] shadow-[0_0_8px_rgba(255,122,77,0.6)]' 
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
              </div>

              <button onClick={handleNext} disabled={activeModule === 8} className={`transition-opacity duration-300 ${activeModule === 8 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:opacity-80'}`}>
                <ButtonBackgroundImage>
                  <div className={`content-stretch flex flex-col items-center relative shrink-0 ${activeModule === 8 ? 'text-[rgba(185,184,235,0.2)]' : 'text-[rgba(185,184,235,0.5)]'}`} data-name="Container">
                    <div className={`flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-nowrap`}>
                      <p className="leading-[20px]">Siguiente</p>
                    </div>
                  </div>
                  <ComponentBackgroundImage3>
                    <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #B9B8EB)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={activeModule === 8 ? "0.2" : "0.5"} strokeWidth="1.33333" />
                  </ComponentBackgroundImage3>
                </ButtonBackgroundImage>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
