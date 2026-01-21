import { TrackRecordCarousel } from './components/TrackRecordCarousel';
import { ROICalculator } from './components/ROICalculator';
import { PerformanceChart } from './components/PerformanceChart';
import { Footer } from './imports/1920WLight';
import { BackgroundEffects } from './components/VisualEffects';
import { Link } from 'react-router-dom';
import { UnifiedHeader } from './components/UnifiedHeader';
import { useState, useEffect } from 'react';

export default function TrackRecord() {
  const [visibleStats, setVisibleStats] = useState(false);

  useEffect(() => {
    setVisibleStats(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#010052] relative overflow-x-hidden">
      <div className="relative z-10">
        {/* Header */}
        <UnifiedHeader />

        {/* Hero Section */}
        <section className="pt-[140px] pb-24 px-8 flex flex-col items-center">
          {/* Badge animado */}
          <div 
            className="mb-8 bg-[rgba(255,255,255,0.14)] relative rounded-[3.35544e+07px] shrink-0"
            style={{
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(99, 102, 241, 0.2), 0 0 60px rgba(99, 102, 241, 0.1)',
              animation: 'glow-pulse 2s ease-in-out infinite',
            }}
          >
            <div className="flex gap-[12px] items-center justify-center px-[16px] py-[8px] relative rounded-[inherit]">
              <svg className="size-6" fill="none" viewBox="0 0 24 24">
                <path 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  stroke="#B9B8EB" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <p className="font-['Inter'] text-[16px] text-white leading-[24px]">
                Track record verificable y documentado
              </p>
            </div>
            <div aria-hidden="true" className="absolute border border-[#6366f1] border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
          </div>

          {/* Hero Heading */}
          <div className="max-w-[900px] text-center mb-8">
            <h1 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[72px] leading-[90px] text-white mb-4">
              No Vendemos Humo.
              <br />
              <span className="text-[#b9b8eb]">Mostramos Resultados</span>
            </h1>
            <p className="font-['Inter'] text-[20px] leading-[32px] text-[rgba(204,204,224,0.7)] max-w-[700px] mx-auto">
              Cada tesis de inversión está documentada con capturas, fechas y análisis completo. 
              Transparencia total, sin trucos.
            </p>
          </div>

          {/* Métricas destacadas con glassmorphism */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1000px] mt-12">
            {/* Métrica 1 */}
            <div 
              className="relative backdrop-blur-md bg-[rgba(27,26,100,0.4)] rounded-[24px] p-8 border border-[rgba(185,184,235,0.2)] transition-all duration-300 hover:border-[rgba(185,184,235,0.4)] hover:bg-[rgba(27,26,100,0.5)]"
              style={{
                transform: visibleStats ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleStats ? 1 : 0,
                transition: 'all 0.6s ease-out',
              }}
            >
              <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-[rgba(99,102,241,0.1)] to-transparent pointer-events-none" />
              <div className="relative z-10">
                <p className="font-['Inter'] text-[14px] text-[rgba(185,184,235,0.6)] mb-2 uppercase tracking-wider">
                  ROI Promedio
                </p>
                <p className="font-['Cormorant_Garamond:Bold',sans-serif] text-[48px] leading-[56px] text-white mb-1">
                  +620%
                </p>
                <p className="font-['Inter'] text-[14px] text-[rgba(185,184,235,0.5)]">
                  En 2024
                </p>
              </div>
            </div>

            {/* Métrica 2 */}
            <div 
              className="relative backdrop-blur-md bg-[rgba(27,26,100,0.4)] rounded-[24px] p-8 border border-[rgba(185,184,235,0.2)] transition-all duration-300 hover:border-[rgba(185,184,235,0.4)] hover:bg-[rgba(27,26,100,0.5)]"
              style={{
                transform: visibleStats ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleStats ? 1 : 0,
                transition: 'all 0.6s ease-out 0.1s',
              }}
            >
              <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-[rgba(99,102,241,0.1)] to-transparent pointer-events-none" />
              <div className="relative z-10">
                <p className="font-['Inter'] text-[14px] text-[rgba(185,184,235,0.6)] mb-2 uppercase tracking-wider">
                  Tesis Documentadas
                </p>
                <p className="font-['Cormorant_Garamond:Bold',sans-serif] text-[48px] leading-[56px] text-white mb-1">
                  12+
                </p>
                <p className="font-['Inter'] text-[14px] text-[rgba(185,184,235,0.5)]">
                  Con pruebas verificables
                </p>
              </div>
            </div>

            {/* Métrica 3 */}
            <div 
              className="relative backdrop-blur-md bg-[rgba(27,26,100,0.4)] rounded-[24px] p-8 border border-[rgba(185,184,235,0.2)] transition-all duration-300 hover:border-[rgba(185,184,235,0.4)] hover:bg-[rgba(27,26,100,0.5)]"
              style={{
                transform: visibleStats ? 'translateY(0)' : 'translateY(20px)',
                opacity: visibleStats ? 1 : 0,
                transition: 'all 0.6s ease-out 0.2s',
              }}
            >
              <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-[rgba(99,102,241,0.1)] to-transparent pointer-events-none" />
              <div className="relative z-10">
                <p className="font-['Inter'] text-[14px] text-[rgba(185,184,235,0.6)] mb-2 uppercase tracking-wider">
                  vs BTC
                </p>
                <p className="font-['Cormorant_Garamond:Bold',sans-serif] text-[48px] leading-[56px] text-white mb-1">
                  +500%
                </p>
                <p className="font-['Inter'] text-[14px] text-[rgba(185,184,235,0.5)]">
                  Outperformance
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección: Track Record Carousel */}
        <section className="py-24 px-8 relative">
          {/* Gradiente de fondo sutil */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          
          <div className="relative z-10">
            {/* Encabezado de sección */}
            <div className="max-w-[800px] mx-auto text-center mb-16">
              <h2 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[56px] leading-[70px] text-white mb-4">
                Tesis Documentadas
              </h2>
              <p className="font-['Inter'] text-[18px] leading-[28px] text-[rgba(204,204,224,0.7)]">
                Cada proyecto incluye capturas de Discord con timestamp, análisis completo y resultados verificables.
              </p>
            </div>

            <TrackRecordCarousel />
          </div>
        </section>

        {/* Sección: Calculadora ROI */}
        <section className="py-24 px-8 relative">
          {/* Gradiente de fondo sutil */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(185, 184, 235, 0.06) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />

          <div className="relative z-10">
            {/* Encabezado de sección */}
            <div className="max-w-[800px] mx-auto text-center mb-16">
              <h2 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[56px] leading-[70px] text-white mb-4">
                ¿Qué Habrías Ganado?
              </h2>
              <p className="font-['Inter'] text-[18px] leading-[28px] text-[rgba(204,204,224,0.7)]">
                Calcula cuánto habrías multiplicado tu inversión siguiendo nuestras tesis de 2024.
              </p>
            </div>

            <ROICalculator />
          </div>
        </section>

        {/* Sección: Gráfico de Rendimiento */}
        <section className="py-24 px-8 relative">
          {/* Gradiente de fondo sutil */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />

          <div className="relative z-10">
            {/* Encabezado de sección */}
            <div className="max-w-[800px] mx-auto text-center mb-16">
              <h2 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[56px] leading-[70px] text-white mb-4">
                Rendimiento Histórico
              </h2>
              <p className="font-['Inter'] text-[18px] leading-[28px] text-[rgba(204,204,224,0.7)]">
                Visualiza el rendimiento de nuestras tesis de inversión a lo largo del tiempo.
              </p>
            </div>

            <PerformanceChart />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-8">
          <div className="max-w-[1000px] mx-auto relative">
            {/* Glassmorphism container */}
            <div className="relative backdrop-blur-md bg-[rgba(27,26,100,0.5)] rounded-[32px] p-12 border border-[rgba(185,184,235,0.2)] overflow-hidden">
              {/* Gradiente de fondo */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 60%)',
                }}
              />
              
              <div className="relative z-10 text-center">
                <h2 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[48px] leading-[60px] text-white mb-4">
                  ¿Listo para Replicar Estos Resultados?
                </h2>
                <p className="font-['Inter'] text-[18px] leading-[28px] text-[rgba(204,204,224,0.7)] max-w-[600px] mx-auto mb-8">
                  Únete a Medusa Capital y aprende la metodología exacta que usamos para identificar estas oportunidades.
                </p>
                
                <Link 
                  to="/"
                  className="inline-block bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-8 py-4 rounded-[12px] font-['Inter'] font-semibold text-[18px] text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-105"
                >
                  Quiero Reservar Mi Plaza
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>

      {/* Keyframes para animaciones */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes glow-pulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(99, 102, 241, 0.2), 0 0 60px rgba(99, 102, 241, 0.1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.6), 0 0 60px rgba(99, 102, 241, 0.4), 0 0 90px rgba(99, 102, 241, 0.2);
          }
        }
      `}} />
    </div>
  );
}