// Componente para efectos de luz/blur de fondo estilo HomepageDarkTheme
// ULTRA-OPTIMIZADO: Gradientes puros SIN filter:blur para máximo rendimiento
export function BackgroundEffects() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* GRADIENTE PRINCIPAL - Centro superior para HERO */}
      <div 
        className="absolute left-1/2 top-0 -translate-x-1/2 w-[1200px] h-[1000px] rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(185,184,235,0.1) 25%, rgba(67,85,217,0.06) 50%, transparent 70%)'
        }}
      />

      {/* GRADIENTE CENTRAL - Iluminación general */}
      <div 
        className="absolute left-1/2 top-[25%] -translate-x-1/2 w-[1000px] h-[800px] rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(ellipse, rgba(185,184,235,0.18) 0%, rgba(100,95,200,0.08) 35%, transparent 65%)'
        }}
      />

      {/* GRADIENTE LATERAL - Efecto lateral difuso */}
      <div 
        className="absolute left-[10%] top-[30%] w-[600px] h-[600px] rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(100,110,230,0.12) 0%, rgba(67,85,217,0.06) 40%, transparent 70%)'
        }}
      />

      {/* GRADIENTE INFERIOR - Para profundidad */}
      <div 
        className="absolute left-1/2 bottom-[15%] -translate-x-1/2 w-[800px] h-[600px] rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(185,184,235,0.12) 0%, rgba(67,85,217,0.06) 45%, transparent 70%)'
        }}
      />
    </div>
  );
}

// Estilos de tarjeta estilo HomepageDarkTheme - OPTIMIZADO sin backdrop-blur
export const glassmorphismCard = "bg-[rgba(26,26,99,0.85)] border-2 border-[rgba(255,255,255,0.1)] rounded-[30px]";

// Badge estilo HomepageDarkTheme - OPTIMIZADO sin backdrop-blur
export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[rgba(185,184,235,0.25)] border border-[rgba(255,255,255,0.2)] rounded-full px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[#B9B8EB]" />
        <span className="font-['Inter'] font-medium text-white text-sm">
          {children}
        </span>
      </div>
    </div>
  );
}