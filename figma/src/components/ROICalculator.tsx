import { useState } from 'react';
import { Check } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  ticker: string;
  roi: number;
  roiDisplay: string;
  description: string;
  timeline: string;
  badgeColor: string;
  logoUrl: string;
}

const projects: Project[] = [
  {
    id: 'metadao',
    name: 'MetaDAO',
    ticker: 'META',
    roi: 10.23,
    roiDisplay: '+1.023%',
    description: 'Entrada temprana con producto probado + plan de salida escalonado.',
    timeline: '📅 Entrada: $10 → Salida: $60 | ⏱️ 8 meses',
    badgeColor: '#4dff88',
    logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/200x200/38146.png'
  },
  {
    id: 'hyperliquid',
    name: 'Hyperliquid',
    ticker: 'HYPE',
    roi: 5.01,
    roiDisplay: '+501%',
    description: 'DEX de perpetuals sin VCs extractivos. Tesis sólida + producto funcionando.',
    timeline: '📅 Entrada: $2 (Enero 2024) → Salida: $28 (Noviembre 2024) | ⏱️ 10 meses',
    badgeColor: '#4dff88',
    logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/200x200/32196.png'
  },
  {
    id: 'syrup',
    name: 'Maple Finance',
    ticker: 'SYRUP',
    roi: 2.30,
    roiDisplay: '+230%',
    description: 'Tokenomics innovadora + equipo con track record + timing correcto (risk-on).',
    timeline: '📅 Entrada: $0.20 → Salida: $0.70 | ⏱️ 6 meses',
    badgeColor: '#4dff88',
    logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/200x200/33824.png'
  }
];

export function ROICalculator() {
  const [amount, setAmount] = useState<number>(1000);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 1000000) {
      setAmount(numValue);
      if (selectedProject) {
        setShowResults(false);
        setTimeout(() => setShowResults(true), 50);
      }
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setShowResults(false);
    setTimeout(() => setShowResults(true), 100);
  };

  const calculateResults = () => {
    if (!selectedProject || amount < 100) return null;
    
    const finalAmount = amount * (1 + selectedProject.roi);
    const profit = finalAmount - amount;
    
    return {
      finalAmount,
      profit
    };
  };

  const results = calculateResults();

  return (
    <section className="w-full py-16 px-8 relative">
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Columna Izquierda - Copy */}
          <div className="flex flex-col justify-start pt-4">
            <h2 className="font-['Cormorant_Garamond',serif] font-bold text-[48px] leading-[1.2] text-white mb-4">
              Calcula Tu ROI Real
            </h2>

            <p className="font-['Inter'] text-[18px] leading-[1.6] text-[rgba(204,204,224,0.7)] mb-6 max-w-[480px]">
              Estas son rentabilidades reales de proyectos que identificamos, analizamos y compartimos con nuestra comunidad en 2024.
            </p>

            {/* Bullet Points */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Check className="w-5 h-5 text-[#6366f1]" strokeWidth={2.5} />
                </div>
                <span className="font-['Inter'] font-medium text-[15px] text-[rgba(204,204,224,0.85)]">
                  Rentabilidades reales documentadas
                </span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Check className="w-5 h-5 text-[#6366f1]" strokeWidth={2.5} />
                </div>
                <span className="font-['Inter'] font-medium text-[15px] text-[rgba(204,204,224,0.85)]">
                  Sin promesas de "100x" imposibles
                </span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Check className="w-5 h-5 text-[#6366f1]" strokeWidth={2.5} />
                </div>
                <span className="font-['Inter'] font-medium text-[15px] text-[rgba(204,204,224,0.85)]">
                  Basado en proyectos con tesis sólida
                </span>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Card Calculadora con Glassmorphism */}
          <div className="relative backdrop-blur-md bg-[rgba(27,26,100,0.4)] rounded-[24px] p-8 border border-[rgba(185,184,235,0.2)]">
            {/* Gradiente de fondo */}
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(99,102,241,0.1)] to-transparent pointer-events-none rounded-[24px]" />
            
            <div className="relative z-10">
              {/* Campo 1: Inversión Inicial */}
              <div className="mb-6">
                <label className="block font-['Inter'] font-semibold text-[14px] text-[rgba(185,184,235,0.8)] mb-3 uppercase tracking-wider">
                  ¿Cuánto habrías invertido?
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-['Inter'] font-bold text-[22px] text-[rgba(185,184,235,0.5)] pointer-events-none">
                    €
                  </span>
                  <input
                    type="text"
                    value={amount.toLocaleString('es-ES')}
                    onChange={handleAmountChange}
                    className="w-full pl-12 pr-4 py-3 rounded-[12px] border-2 border-[rgba(185,184,235,0.2)] font-['Inter'] font-semibold text-[22px] text-white bg-[rgba(1,0,82,0.5)] transition-all duration-200 outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
                    placeholder="1000"
                  />
                </div>
              </div>

              {/* Campo 2: Selector de Proyecto */}
              <div className="mb-6">
                <label className="block font-['Inter'] font-semibold text-[14px] text-[rgba(185,184,235,0.8)] mb-3 uppercase tracking-wider">
                  Selecciona un proyecto
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-4 py-3 rounded-[12px] border-2 font-['Inter'] font-semibold text-[16px] text-white bg-[rgba(1,0,82,0.5)] transition-all duration-200 outline-none cursor-pointer flex items-center justify-between"
                    style={{
                      borderColor: selectedProject ? '#6366f1' : 'rgba(185,184,235,0.2)',
                      boxShadow: selectedProject ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none'
                    }}
                  >
                    {selectedProject ? (
                      <div className="flex items-center gap-3">
                        <img 
                          src={selectedProject.logoUrl} 
                          alt={selectedProject.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>{selectedProject.name}</span>
                        <span className="text-[#4dff88]">{selectedProject.roiDisplay}</span>
                      </div>
                    ) : (
                      <span className="text-[rgba(185,184,235,0.5)]">Selecciona un proyecto...</span>
                    )}
                    
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="none"
                      className="transition-transform duration-200"
                      style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      <path d="M4 6L8 10L12 6" stroke="rgba(185,184,235,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 rounded-[12px] border border-[rgba(185,184,235,0.2)] overflow-hidden z-50 backdrop-blur-md bg-[rgba(1,0,82,0.95)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                      {projects.map((project) => (
                        <button
                          key={project.id}
                          type="button"
                          onClick={() => {
                            handleProjectSelect(project);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full px-4 py-3 flex items-center gap-3 font-['Inter'] font-semibold text-[15px] text-white transition-all duration-150 cursor-pointer border-none text-left hover:bg-[rgba(99,102,241,0.1)]"
                          style={{
                            background: selectedProject?.id === project.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                            borderBottom: '1px solid rgba(185,184,235,0.1)'
                          }}
                        >
                          <img 
                            src={project.logoUrl} 
                            alt={project.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span>{project.name}</span>
                              <span className="font-['Inter'] font-bold text-[14px] text-[#4dff88]">
                                {project.roiDisplay}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Campo 3: Resultados */}
              {results && amount >= 100 && (
                <div
                  className="rounded-[16px] p-6 mb-5 relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]"
                  style={{
                    opacity: showResults ? 1 : 0,
                    transform: showResults ? 'translateY(0)' : 'translateY(20px)',
                    boxShadow: '0 8px 24px rgba(99,102,241,0.4)'
                  }}
                >
                  {/* Logo del proyecto como fondo */}
                  {selectedProject && (
                    <div className="absolute top-0 right-0 w-[180px] h-[180px] pointer-events-none opacity-10 translate-x-[20%] -translate-y-[20%]">
                      <img 
                        src={selectedProject.logoUrl} 
                        alt=""
                        className="w-full h-full object-contain brightness-125 saturate-50"
                      />
                    </div>
                  )}

                  <p className="font-['Inter'] font-medium text-[14px] text-white/90 mb-2 relative z-10">
                    Habrías convertido
                  </p>

                  <div className="font-['Cormorant_Garamond'] font-bold text-[42px] leading-none text-white mb-4 relative z-10">
                    {formatCurrency(results.finalAmount)}
                  </div>

                  {/* Results Breakdown */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20 relative z-10">
                    <div>
                      <p className="font-['Inter'] text-[12px] text-white/80 mb-1">
                        Inversión inicial
                      </p>
                      <p className="font-['Inter'] font-semibold text-[18px] text-white">
                        {formatCurrency(amount)}
                      </p>
                    </div>

                    <div>
                      <p className="font-['Inter'] text-[12px] text-white/80 mb-1">
                        Ganancia neta
                      </p>
                      <p className="font-['Inter'] font-semibold text-[18px] text-white">
                        {formatCurrency(results.profit)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Section */}
              <div className="rounded-[12px] p-5 bg-[rgba(185,184,235,0.05)] border border-[rgba(185,184,235,0.1)]">
                <p className="font-['Inter'] text-[13px] leading-[1.6] text-[rgba(204,204,224,0.7)] text-center mb-4">
                  Esto no es suerte. Es metodología replicable con tesis documentada, gestión de riesgo y plan de salida desde día 1.
                </p>

                <button className="w-full px-6 py-3 rounded-[12px] bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] font-['Inter'] font-semibold text-[15px] text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-[1.02]">
                  Quiero Aprender el Sistema Medusa
                </button>
              </div>

              {/* Disclaimer */}
              <p className="font-['Inter'] text-[11px] leading-[1.5] text-center mt-4 text-[rgba(185,184,235,0.4)]">
                Disclaimer: Rentabilidades pasadas no garantizan resultados futuros. Este cálculo muestra resultados históricos de tesis documentadas en Medusa Capital. La inversión en criptomonedas conlleva riesgo de pérdida total del capital.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
