import { motion } from 'motion/react';
import imgMedusaCapitalCoin from "figma:asset/dd73933ba786c0718da0c1645290aed8dbf878d9.png";
import imgMedusaCapital from "figma:asset/2ea8f5033567aae81a6720ed94c2da53d3f5d2c9.png";
import { Users, Star, TrendingUp } from 'lucide-react';

interface ButtonBackgroundImageAndTextProps {
  text: string;
  additionalClassNames?: string;
}

// Componente de botón (lo mantenemos para no romper compatibilidad)
export function ButtonBackgroundImageAndText({ text, additionalClassNames }: ButtonBackgroundImageAndTextProps) {
  return (
    <button className={`relative inline-block ${additionalClassNames || ''}`}>
      <div className="relative content-stretch flex h-[48px] items-center justify-center px-[32px] py-[24px] rounded-[10px] bg-[#68FE9B] cursor-pointer transition-all duration-300 hover:shadow-[0_0_40px_rgba(104,254,155,0.8),0_0_80px_rgba(104,254,155,0.4)] hover:scale-105" style={{ boxShadow: '0 0 30px rgba(104, 254, 155, 0.6), 0 0 60px rgba(104, 254, 155, 0.3)' }}>
        <div className="absolute -inset-2 rounded-[10px] blur-xl opacity-60 -z-10" style={{ background: '#68FE9B' }} />
        <div className="absolute inset-0 pointer-events-none rounded-[10px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 50%)' }} />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] text-center text-nowrap text-[#010052] leading-[24px] z-10 relative">
          {text}
        </p>
      </div>
    </button>
  );
}

export function HeroAndSocialProof() {
  return (
    <div className="relative w-full px-[384px] py-[70px]">
      {/* Contenedor principal con borde y efectos */}
      <div className="relative rounded-[44px] overflow-visible">
        {/* Borde exterior blanco/grisáceo con glow - desvanece hacia abajo */}
        <div 
          className="absolute inset-[-3px] rounded-[44px] bg-gradient-to-b from-[rgba(255,255,255,0.3)] via-[rgba(255,255,255,0.15)] to-[rgba(255,255,255,0.05)]"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)'
          }}
        />
        <div 
          className="absolute inset-[-2px] rounded-[44px] bg-gradient-to-b from-[rgba(200,200,220,0.4)] via-[rgba(200,200,220,0.2)] to-transparent blur-[0.5px]"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)'
          }}
        />
        
        {/* Contenedor de fondo */}
        <div className="relative rounded-[44px] bg-[#010052] overflow-hidden">
          {/* Efectos de fondo */}
          <div className="absolute inset-0 overflow-hidden rounded-[44px]">
            {/* Gradiente radial superior derecho (detrás de la moneda) */}
            <div className="absolute top-[100px] right-[200px] w-[600px] h-[600px] blur-[120px]" 
                 style={{ background: "radial-gradient(circle at center, rgba(99,102,241,0.25) 0%, transparent 70%)" }} />
            {/* Gradiente radial inferior */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[80px]" 
                 style={{ background: "radial-gradient(circle at center, rgba(67,85,217,0.15) 0%, transparent 70%)" }} />
          </div>

          {/* Contenido */}
          <div className="relative px-[96px] py-[70px]">
            {/* Sección superior - Hero */}
            <div className="flex items-center justify-between gap-12 mb-20">
              {/* Lado izquierdo - Texto */}
              <div className="flex-1">
                <h2 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[50px] leading-[62.5px] text-white mb-8">
                  <span className="block">Conviértete en un</span>
                  <span className="block">Inversor Experto en</span>
                  <span className="block">Bitcoin y otros</span>
                  <span className="block">Activos Digitales</span>
                </h2>
                
                <p className="font-['Inter:Regular',sans-serif] text-[18px] leading-[29.25px] text-[#cccce0] mb-10 max-w-[520px]">
                  En Medusa Capital aprenderás a navegar por el mercado de las criptomonedas, estrategias de inversión rentables, y sabrás cómo moverte por el universo DeFi de manera segura. Obtendrás <span className="font-['Inter:Medium',sans-serif] font-medium text-white">conocimiento, criterio propio y herramientas para ser encontrar las mejores oportunidades del mercado</span>.
                </p>

                <ButtonBackgroundImageAndText text="Empezar Ahora" />
              </div>

              {/* Lado derecho - Moneda animada */}
              <div className="relative shrink-0 w-[400px] h-[400px]" style={{ perspective: '1000px' }}>
                {/* Moneda animada */}
                <motion.div 
                  className="absolute inset-0 overflow-hidden pointer-events-none z-10"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ 
                    rotateY: [0, 360]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                >
                  <img alt="Medusa Capital Coin" className="absolute left-0 max-w-none size-full top-0" src={imgMedusaCapitalCoin} />
                </motion.div>
                
                {/* Glow effect más intenso */}
                <div className="absolute bg-[rgba(185,184,235,0.2)] blur-[40px] filter inset-[-25%] rounded-full" />
                <div className="absolute bg-[rgba(99,102,241,0.15)] blur-[60px] filter inset-[-30%] rounded-full" />
              </div>
            </div>

            {/* Logo pequeño de Medusa en el centro (separador) */}
            <div className="flex justify-center mb-12">
              {/* Logo removido */}
            </div>

            {/* Sección inferior - Social Proof */}
            <div className="text-center">
              {/* Logo de Medusa Capital */}
              <div className="flex justify-center mb-8">
                <img 
                  src={imgMedusaCapital} 
                  alt="Medusa Capital Logo" 
                  className="h-[96px] w-auto opacity-90"
                />
              </div>

              <h3 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[56px] leading-[68px] text-white mb-12 max-w-[950px] mx-auto">
                Te ayudamos a entender el mercado de activos digitales con el mismo rigor con el que analizan empresas tradicionales
              </h3>

              {/* Métricas - Pills/Badges con Glow */}
              <div className="flex items-stretch pt-6 max-w-[1100px] mx-auto">
                {/* Métrica 1 */}
                <div className="flex-1 px-10 py-8 text-center border-r border-[rgba(185,184,235,0.15)] group hover:bg-[rgba(99,102,241,0.05)] transition-all relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-[rgba(185,184,235,0.15)] to-transparent" />
                  </div>
                  <div className="relative w-12 h-12 mx-auto mb-5 rounded-full bg-gradient-to-br from-[rgba(185,184,235,0.15)] to-[rgba(99,102,241,0.15)] border border-[rgba(185,184,235,0.25)] flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#b9b8eb]" />
                  </div>
                  <div className="relative text-[52px] font-['Cormorant_Garamond:Bold',sans-serif] bg-gradient-to-br from-[#b9b8eb] to-[#6366f1] bg-clip-text text-transparent leading-none mb-3">
                    +250
                  </div>
                  <p className="relative font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(185,184,235,0.7)]">
                    Alumnos formados
                  </p>
                </div>

                {/* Métrica 2 */}
                <div className="flex-1 px-10 py-8 text-center border-r border-[rgba(185,184,235,0.15)] group hover:bg-[rgba(99,102,241,0.05)] transition-all relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-[rgba(185,184,235,0.15)] to-transparent" />
                  </div>
                  <div className="relative w-12 h-12 mx-auto mb-5 rounded-full bg-gradient-to-br from-[rgba(185,184,235,0.15)] to-[rgba(99,102,241,0.15)] border border-[rgba(185,184,235,0.25)] flex items-center justify-center">
                    <Star className="w-6 h-6 text-[#b9b8eb]" />
                  </div>
                  <div className="relative text-[52px] font-['Cormorant_Garamond:Bold',sans-serif] bg-gradient-to-br from-[#b9b8eb] to-[#6366f1] bg-clip-text text-transparent leading-none mb-3">
                    +50
                  </div>
                  <p className="relative font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(185,184,235,0.7)]">
                    Reseñas positivas
                  </p>
                </div>

                {/* Métrica 3 */}
                <div className="flex-1 px-10 py-8 text-center group hover:bg-[rgba(99,102,241,0.05)] transition-all relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-[rgba(185,184,235,0.15)] to-transparent" />
                  </div>
                  <div className="relative w-12 h-12 mx-auto mb-5 rounded-full bg-gradient-to-br from-[rgba(185,184,235,0.15)] to-[rgba(99,102,241,0.15)] border border-[rgba(185,184,235,0.25)] flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#b9b8eb]" />
                  </div>
                  <div className="relative text-[52px] font-['Cormorant_Garamond:Bold',sans-serif] bg-gradient-to-br from-[#b9b8eb] to-[#6366f1] bg-clip-text text-transparent leading-none mb-3">
                    +20.000
                  </div>
                  <p className="relative font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(185,184,235,0.7)]">
                    Seguidores
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}