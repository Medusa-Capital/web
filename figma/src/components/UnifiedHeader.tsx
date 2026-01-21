import { Link, useLocation } from 'react-router-dom';
import svgPaths from "../imports/svg-adcpnuou9u";

export function UnifiedHeader() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 content-stretch flex items-center justify-between pt-[32px] pb-[32px] px-[48px] backdrop-blur-md bg-[rgba(1,0,82,0.85)]">
      {/* Logo - Replica exacta de la página principal */}
      <Link to="/" className="content-stretch flex flex-col items-start relative shrink-0 cursor-pointer">
        <div className="aspect-[168.75/56] content-stretch flex flex-col items-start overflow-clip relative shrink-0">
          <div className="content-stretch flex flex-col h-[56px] items-center justify-center overflow-clip relative shrink-0 w-[168.75px]">
            <div className="h-[56px] relative w-[168.757px]">
              <img 
                src="https://medusacapital.xyz/assets/img/logo.svg" 
                alt="Medusa Capital" 
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </Link>
      
      {/* Navegación */}
      <div className="flex items-center gap-[32px]">
        <div className="content-stretch flex gap-[32px] items-center relative shrink-0">
          <Link 
            to="/colaboradores"
            className={`flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[20px] transition-all duration-300 text-nowrap ${
              isActive('/colaboradores') 
                ? 'text-white' 
                : 'text-[rgba(185,184,235,0.7)] hover:text-white hover:scale-110 hover:drop-shadow-[0_0_16px_rgba(99,102,241,0.9)]'
            }`}
          >
            <p className="cursor-pointer leading-[28px]">Colaboradores</p>
          </Link>
          <Link 
            to="/blog"
            className={`flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[20px] transition-all duration-300 text-nowrap ${
              isActive('/blog') 
                ? 'text-white' 
                : 'text-[rgba(185,184,235,0.7)] hover:text-white hover:scale-110 hover:drop-shadow-[0_0_16px_rgba(99,102,241,0.9)]'
            }`}
          >
            <p className="cursor-pointer leading-[28px]">Blog</p>
          </Link>
          <Link 
            to="/track-record" 
            className={`flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[20px] transition-all duration-300 text-nowrap ${
              isActive('/track-record') 
                ? 'text-white' 
                : 'text-[rgba(185,184,235,0.7)] hover:text-white hover:scale-110 hover:drop-shadow-[0_0_16px_rgba(99,102,241,0.9)]'
            }`}
          >
            <p className="cursor-pointer leading-[28px]">Track Record</p>
          </Link>
        </div>
        
        {/* CTA Button - Verde neón con efectos glow de la página principal */}
        <Link 
          to="/"
          className="relative content-stretch flex h-[48px] items-center justify-center px-[32px] py-[24px] rounded-[10px] bg-[#68FE9B] cursor-pointer transition-all duration-300 hover:shadow-[0_0_40px_rgba(104,254,155,0.8),0_0_80px_rgba(104,254,155,0.4)] hover:scale-105"
          style={{ boxShadow: '0 0 30px rgba(104, 254, 155, 0.6), 0 0 60px rgba(104, 254, 155, 0.3)' }}
        >
          <div className="absolute -inset-2 rounded-[10px] blur-xl opacity-60 -z-10" style={{ background: '#68FE9B' }} />
          <div className="absolute inset-0 pointer-events-none rounded-[10px]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 50%)' }} />
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-[#010052] z-10">
            <p className="leading-[24px]">Quiero Reservar Mi Plaza</p>
          </div>
        </Link>
      </div>
    </div>
  );
}