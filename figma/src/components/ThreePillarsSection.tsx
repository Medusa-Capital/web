import { BackgroundEffects } from './VisualEffects';

export function ThreePillarsSection() {
  return (
    <section 
      className="w-full py-24 px-8 relative"
    >
      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="font-['Cormorant_Garamond',serif] font-bold text-[60px] leading-[57px] text-white mb-8">
            La Solución: Sistema Medusa
          </h1>
          
          {/* Cita destacada */}
          <div className="max-w-[900px] mx-auto rounded-[30px] p-8 bg-[rgba(197,191,230,0.04)] border border-[rgba(197,191,230,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] mb-6">
            <p className="font-['Inter',sans-serif] text-[18px] leading-[30px] text-white mb-4">
              "La estrategia consiste en identificar proyectos con <span className="font-semibold text-[#b9b8eb]">Product-Market Fit</span>, generación real de ingresos y mecanismos sólidos de captura de valor para el token. Esa es la base que marcará la diferencia en los próximos meses (y años)."
            </p>
          </div>

          <p className="font-['Inter',sans-serif] text-[18px] leading-[30px] text-[rgba(204,204,224,0.7)] max-w-[800px] mx-auto">
            No es un sistema de señales. No es trading especulativo. Es un framework de inversión a largo plazo con gestión activa táctica, diseñado para identificar los pocos activos de calidad que realmente merecen tu capital.
          </p>
        </div>

        {/* FRAMEWORK DE ANÁLISIS */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="font-['Cormorant_Garamond',serif] font-bold text-[42px] leading-tight text-white mb-3">
              Framework de Análisis Multidimensional
            </h3>
            <p className="font-['Inter',sans-serif] text-[18px] text-[rgba(204,204,224,0.7)]">
              Cuatro capas que deben alinearse antes de tomar cualquier decisión de inversión
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tarjeta grande - Análisis Fundamental (ocupa 2 columnas) */}
            <div className="md:col-span-2 rounded-[30px] p-8 bg-[rgba(197,191,230,0.04)] border border-[rgba(197,191,230,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-[rgba(185,184,235,0.3)] hover:shadow-[0_0_20px_rgba(185,184,235,0.2)] transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[rgba(197,191,230,0.08)] shadow-[0_0_15px_rgba(197,191,230,0.4)]">
                    <span className="text-3xl">📊</span>
                  </div>
                  <div>
                    <div className="inline-block bg-[rgba(185,184,235,0.15)] border border-[rgba(185,184,235,0.3)] text-white font-['Inter',sans-serif] font-bold text-[11px] px-3 py-1.5 rounded-full mb-2">
                      PESO: 60%
                    </div>
                    <h4 className="font-['Cormorant_Garamond',serif] font-bold text-[32px] text-white leading-tight">
                      Análisis Fundamental
                    </h4>
                  </div>
                </div>
              </div>
              
              <p className="font-['Inter',sans-serif] text-[17px] leading-[28px] text-[rgba(204,204,224,0.9)] mb-6">
                El análisis que más impacta en la cartera. Si veo un buen proyecto con descuento, compro al menos el 50% de la posición total.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[rgba(185,184,235,0.05)] border border-[rgba(185,184,235,0.2)] rounded-[16px] p-4 hover:border-[rgba(185,184,235,0.4)] transition-all duration-300">
                  <p className="font-['Inter',sans-serif] font-semibold text-[15px] text-[#b9b8eb] text-center">
                    Product-Market Fit
                  </p>
                </div>
                <div className="bg-[rgba(185,184,235,0.05)] border border-[rgba(185,184,235,0.2)] rounded-[16px] p-4 hover:border-[rgba(185,184,235,0.4)] transition-all duration-300">
                  <p className="font-['Inter',sans-serif] font-semibold text-[15px] text-[#b9b8eb] text-center">
                    Revenue Real
                  </p>
                </div>
                <div className="bg-[rgba(185,184,235,0.05)] border border-[rgba(185,184,235,0.2)] rounded-[16px] p-4 hover:border-[rgba(185,184,235,0.4)] transition-all duration-300">
                  <p className="font-['Inter',sans-serif] font-semibold text-[15px] text-[#b9b8eb] text-center">
                    Captura de Valor
                  </p>
                </div>
              </div>
            </div>

            {/* Tarjeta mediana - Análisis Macro */}
            <div className="rounded-[30px] p-8 bg-[rgba(197,191,230,0.04)] border border-[rgba(197,191,230,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-[rgba(185,184,235,0.3)] hover:shadow-[0_0_20px_rgba(185,184,235,0.2)] transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center bg-[rgba(197,191,230,0.08)] shadow-[0_0_15px_rgba(197,191,230,0.4)]">
                  <span className="text-2xl">🌍</span>
                </div>
                <div className="flex-1">
                  <div className="inline-block bg-[rgba(185,184,235,0.15)] border border-[rgba(185,184,235,0.3)] text-white font-['Inter',sans-serif] font-bold text-[11px] px-3 py-1.5 rounded-full mb-2">
                    PESO: 20%
                  </div>
                  <h4 className="font-['Cormorant_Garamond',serif] font-bold text-[26px] text-white leading-tight">
                    Análisis Macro
                  </h4>
                </div>
              </div>
              
              <p className="font-['Inter',sans-serif] text-[15px] leading-[24px] text-[rgba(204,204,224,0.8)] mb-4">
                Monitoreo de variables macroeconómicas que impactan el ciclo de mercado.
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="bg-[rgba(185,184,235,0.05)] border border-[rgba(185,184,235,0.2)] text-[rgba(185,184,235,0.9)] font-['Inter',sans-serif] text-[13px] px-3 py-1.5 rounded-[8px]">
                  Liquidez M2
                </span>
                <span className="bg-[rgba(185,184,235,0.05)] border border-[rgba(185,184,235,0.2)] text-[rgba(185,184,235,0.9)] font-['Inter',sans-serif] text-[13px] px-3 py-1.5 rounded-[8px]">
                  Flujos ETF
                </span>
                <span className="bg-[rgba(185,184,235,0.05)] border border-[rgba(185,184,235,0.2)] text-[rgba(185,184,235,0.9)] font-['Inter',sans-serif] text-[13px] px-3 py-1.5 rounded-[8px]">
                  Tipos Fed
                </span>
                <span className="bg-[rgba(185,184,235,0.05)] border border-[rgba(185,184,235,0.2)] text-[rgba(185,184,235,0.9)] font-['Inter',sans-serif] text-[13px] px-3 py-1.5 rounded-[8px]">
                  Déficit Fiscal
                </span>
              </div>
            </div>

            {/* Tarjeta mediana - Análisis On-Chain */}
            <div className="rounded-[30px] p-8 bg-[rgba(197,191,230,0.04)] border border-[rgba(197,191,230,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-[rgba(185,184,235,0.3)] hover:shadow-[0_0_20px_rgba(185,184,235,0.2)] transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center bg-[rgba(197,191,230,0.08)] shadow-[0_0_15px_rgba(197,191,230,0.4)]">
                  <span className="text-2xl">⛓️</span>
                </div>
                <div className="flex-1">
                  <div className="inline-block bg-[rgba(185,184,235,0.15)] border border-[rgba(185,184,235,0.3)] text-white font-['Inter',sans-serif] font-bold text-[11px] px-3 py-1.5 rounded-full mb-2">
                    PESO: 10%
                  </div>
                  <h4 className="font-['Cormorant_Garamond',serif] font-bold text-[26px] text-white leading-tight">
                    Análisis On-Chain
                  </h4>
                </div>
              </div>
              
              <p className="font-['Inter',sans-serif] text-[15px] leading-[24px] text-[rgba(204,204,224,0.8)] mb-4">
                Datos de blockchain para validar tendencias y comportamiento del mercado.
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="bg-[rgba(185,184,235,0.05)] border border-[rgba(185,184,235,0.2)] text-[rgba(185,184,235,0.9)] font-['Inter',sans-serif] text-[13px] px-3 py-1.5 rounded-[8px]">
                  Exchange Reserves
                </span>
                <span className="bg-[rgba(185,184,235,0.05)] border border-[rgba(185,184,235,0.2)] text-[rgba(185,184,235,0.9)] font-['Inter',sans-serif] text-[13px] px-3 py-1.5 rounded-[8px]">
                  NUPL
                </span>
                <span className="bg-[rgba(185,184,235,0.05)] border border-[rgba(185,184,235,0.2)] text-[rgba(185,184,235,0.9)] font-['Inter',sans-serif] text-[13px] px-3 py-1.5 rounded-[8px]">
                  Netflows
                </span>
                <span className="bg-[rgba(185,184,235,0.05)] border border-[rgba(185,184,235,0.2)] text-[rgba(185,184,235,0.9)] font-['Inter',sans-serif] text-[13px] px-3 py-1.5 rounded-[8px]">
                  Whale Activity
                </span>
              </div>
            </div>

            {/* Tarjeta ancha - Análisis Técnico (2 columnas) */}
            <div className="md:col-span-2 rounded-[30px] p-8 bg-[rgba(197,191,230,0.04)] border border-[rgba(197,191,230,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-[rgba(185,184,235,0.3)] hover:shadow-[0_0_20px_rgba(185,184,235,0.2)] transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(197,191,230,0.08)] shadow-[0_0_15px_rgba(197,191,230,0.4)]">
                  <span className="text-2xl">📈</span>
                </div>
                <div>
                  <div className="inline-block bg-[rgba(185,184,235,0.15)] border border-[rgba(185,184,235,0.3)] text-white font-['Inter',sans-serif] font-bold text-[11px] px-3 py-1.5 rounded-full mb-2">
                    PESO: 10% — Complementario
                  </div>
                  <h4 className="font-['Cormorant_Garamond',serif] font-bold text-[26px] text-white leading-tight">
                    Análisis Técnico
                  </h4>
                </div>
              </div>
              <p className="font-['Inter',sans-serif] text-[16px] leading-[26px] text-[rgba(204,204,224,0.9)]">
                No le doy muchas vueltas. Uso tomas de liquidez como eje principal. Nunca compro solo por técnico si los fundamentales son débiles.
              </p>
            </div>
          </div>
        </div>

        {/* PRINCIPIOS CORE */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="font-['Cormorant_Garamond',serif] font-bold text-[42px] leading-tight text-white mb-2">
              Los Principios que Guían Cada Decisión
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Principio 1 */}
            <div className="rounded-[30px] p-8 min-h-[260px] bg-[rgba(197,191,230,0.04)] border border-[rgba(197,191,230,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-[rgba(185,184,235,0.3)] hover:shadow-[0_0_20px_rgba(185,184,235,0.2)] transition-all duration-300">
              <div className="mb-4 w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(197,191,230,0.08)] shadow-[0_0_15px_rgba(197,191,230,0.4)]">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="border-b border-[rgba(255,255,255,0.1)] mb-4 pb-1"></div>
              <h4 className="font-['Cormorant_Garamond',serif] font-bold text-[24px] text-white mb-3 leading-tight">
                Calidad sobre Cantidad
              </h4>
              <p className="font-['Inter',sans-serif] text-[15px] leading-[24px] text-[#b9b8eb] mb-3 font-semibold">
                "Centrarnos en los pocos activos de calidad que existen."
              </p>
              <p className="font-['Inter',sans-serif] text-[14px] leading-[22px] text-[rgba(204,204,224,0.7)] italic">
                Mejor 3 posiciones de alta convicción que 30 tokens mediocres.
              </p>
            </div>

            {/* Principio 2 */}
            <div className="rounded-[30px] p-8 min-h-[260px] bg-[rgba(197,191,230,0.04)] border border-[rgba(197,191,230,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-[rgba(185,184,235,0.3)] hover:shadow-[0_0_20px_rgba(185,184,235,0.2)] transition-all duration-300">
              <div className="mb-4 w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(197,191,230,0.08)] shadow-[0_0_15px_rgba(197,191,230,0.4)]">
                <span className="text-2xl">🩸</span>
              </div>
              <div className="border-b border-[rgba(255,255,255,0.1)] mb-4 pb-1"></div>
              <h4 className="font-['Cormorant_Garamond',serif] font-bold text-[24px] text-white mb-3 leading-tight">
                Comprar Cuando Hay Sangre
              </h4>
              <p className="font-['Inter',sans-serif] text-[15px] leading-[24px] text-[#b9b8eb] mb-3 font-semibold">
                "Las compras se hacen cuando nadie, pero nadie mira."
              </p>
              <p className="font-['Inter',sans-serif] text-[14px] leading-[22px] text-[rgba(204,204,224,0.7)] italic">
                El mejor momento para comprar es cuando da más miedo.
              </p>
            </div>

            {/* Principio 3 */}
            <div className="rounded-[30px] p-8 min-h-[260px] bg-[rgba(197,191,230,0.04)] border border-[rgba(197,191,230,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-[rgba(185,184,235,0.3)] hover:shadow-[0_0_20px_rgba(185,184,235,0.2)] transition-all duration-300">
              <div className="mb-4 w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(197,191,230,0.08)] shadow-[0_0_15px_rgba(197,191,230,0.4)]">
                <span className="text-2xl">⚙️</span>
              </div>
              <div className="border-b border-[rgba(255,255,255,0.1)] mb-4 pb-1"></div>
              <h4 className="font-['Cormorant_Garamond',serif] font-bold text-[24px] text-white mb-3 leading-tight">
                El Trabajo Se Hace Antes
              </h4>
              <p className="font-['Inter',sans-serif] text-[15px] leading-[24px] text-[#b9b8eb] mb-3 font-semibold">
                "Estos momentos no son para comprar tokens sin parar."
              </p>
              <p className="font-['Inter',sans-serif] text-[14px] leading-[22px] text-[rgba(204,204,224,0.7)] italic">
                La investigación ocurre en silencio, no en ATH.
              </p>
            </div>

            {/* Principio 4 */}
            <div className="rounded-[30px] p-8 min-h-[260px] bg-[rgba(197,191,230,0.04)] border border-[rgba(197,191,230,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-[rgba(185,184,235,0.3)] hover:shadow-[0_0_20px_rgba(185,184,235,0.2)] transition-all duration-300">
              <div className="mb-4 w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(197,191,230,0.08)] shadow-[0_0_15px_rgba(197,191,230,0.4)]">
                <span className="text-2xl">🚪</span>
              </div>
              <div className="border-b border-[rgba(255,255,255,0.1)] mb-4 pb-1"></div>
              <h4 className="font-['Cormorant_Garamond',serif] font-bold text-[24px] text-white mb-3 leading-tight">
                Saber Cuándo Salir
              </h4>
              <p className="font-['Inter',sans-serif] text-[15px] leading-[24px] text-[#b9b8eb] mb-3 font-semibold">
                "Cuando todo el mundo hable de un proyecto... salid."
              </p>
              <p className="font-['Inter',sans-serif] text-[14px] leading-[22px] text-[rgba(204,204,224,0.7)] italic">
                Tomar profits contra-intuitivamente separa ganadores de perdedores.
              </p>
            </div>

            {/* Principio 5 */}
            <div className="rounded-[30px] p-8 min-h-[260px] bg-[rgba(197,191,230,0.04)] border border-[rgba(197,191,230,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-[rgba(185,184,235,0.3)] hover:shadow-[0_0_20px_rgba(185,184,235,0.2)] transition-all duration-300">
              <div className="mb-4 w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(197,191,230,0.08)] shadow-[0_0_15px_rgba(197,191,230,0.4)]">
                <span className="text-2xl">🔄</span>
              </div>
              <div className="border-b border-[rgba(255,255,255,0.1)] mb-4 pb-1"></div>
              <h4 className="font-['Cormorant_Garamond',serif] font-bold text-[24px] text-white mb-3 leading-tight">
                Compound en Ganadores
              </h4>
              <p className="font-['Inter',sans-serif] text-[15px] leading-[24px] text-[#b9b8eb] mb-3 font-semibold">
                "Cuando el mercado te da la razón, haz compound en ellos."
              </p>
              <p className="font-['Inter',sans-serif] text-[14px] leading-[22px] text-[rgba(204,204,224,0.7)] italic">
                No rotar prematuramente de posiciones ganadoras.
              </p>
            </div>

            {/* Principio 6 */}
            <div className="rounded-[30px] p-8 min-h-[260px] bg-[rgba(197,191,230,0.04)] border border-[rgba(197,191,230,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-[rgba(185,184,235,0.3)] hover:shadow-[0_0_20px_rgba(185,184,235,0.2)] transition-all duration-300">
              <div className="mb-4 w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(197,191,230,0.08)] shadow-[0_0_15px_rgba(197,191,230,0.4)]">
                <span className="text-2xl">🛡️</span>
              </div>
              <div className="border-b border-[rgba(255,255,255,0.1)] mb-4 pb-1"></div>
              <h4 className="font-['Cormorant_Garamond',serif] font-bold text-[24px] text-white mb-3 leading-tight">
                Gestión de Riesgo No Negociable
              </h4>
              <p className="font-['Inter',sans-serif] text-[15px] leading-[24px] text-[#b9b8eb] mb-3 font-semibold">
                Máximo 80% exposición. Nunca apalancamiento excesivo.
              </p>
              <p className="font-['Inter',sans-serif] text-[14px] leading-[22px] text-[rgba(204,204,224,0.7)] italic">
                Proteger capital {'>'} Maximizar ganancias.
              </p>
            </div>
          </div>
        </div>

        {/* CTA FINAL */}
        <div className="text-center max-w-[800px] mx-auto">
          <div className="relative inline-flex h-[48px] items-center justify-center px-[32px] py-[24px] rounded-[10px] cursor-pointer transition-all duration-300 mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-[10px] shadow-[0_0_30px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_50px_rgba(99,102,241,0.6)] transition-all duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0.2)] rounded-[10px] pointer-events-none"></div>
            <span className="relative font-['Inter',sans-serif] font-semibold text-[16px] text-white z-10">
              Descargar Framework Completo (PDF Gratis)
            </span>
          </div>
          <p className="font-['Inter',sans-serif] text-[13px] text-[rgba(185,184,235,0.6)] mt-4">
            54 páginas • Casos de estudio • Checklists • Templates
          </p>
        </div>
      </div>
    </section>
  );
}
