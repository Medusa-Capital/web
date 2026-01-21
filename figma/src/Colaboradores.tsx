import { Footer } from './imports/1920WLight';
import { BackgroundEffects } from './components/VisualEffects';
import { UnifiedHeader } from './components/UnifiedHeader';
import { useState } from 'react';
import { Users, TrendingUp, Award, Clock } from 'lucide-react';

const colaboradores = [
  {
    id: 1,
    name: 'Pablo Gil',
    role: 'Trader Profesional & Formador',
    image: 'https://pablogiltrader.com/wp-content/uploads/2023/09/imagen_newsletter-1.jpg',
    collaboration: {
      title: 'Curso Exclusivo de 3h',
      description: 'Criptomonedas: Fundamentos y Estrategias Avanzadas',
      platform: 'Publicado en Pablo Gil Trader'
    },
    stats: [
      { icon: Award, label: 'Forbes', value: 'Top Líder' },
      { icon: Clock, label: 'Experiencia', value: '+37 años' },
      { icon: TrendingUp, label: 'Rankia', value: 'Mejor 2023-25' },
      { icon: Users, label: 'Alumnos', value: '15K+' }
    ],
    credentials: [
      'Top Líder Forbes 2025 en industria financiera',
      'Mejor Divulgador Financiero 2023-2025 (Rankia)',
      'Ex-Director Análisis Técnico en Santander y BBVA',
      'Fundador Hedge Fund Market Neutral (2000-2013)',
      'Embajador y estratega en IG y XTB'
    ],
    social: {
      twitter: '#',
      linkedin: '#',
      website: 'https://pablogiltrader.com'
    }
  },
  {
    id: 2,
    name: 'Javier del Valle',
    role: 'Experto DeFi & Blockchain',
    image: 'https://d31dn7nfpuwjnm.cloudfront.net/images/avatar/ponente_1852_original_1666797913.jpg?1666797913',
    collaboration: {
      title: 'Curso Exclusivo de 3h',
      description: 'Bitcoin: Análisis Fundamental y Perspectivas',
      platform: 'Publicado en su plataforma educativa'
    },
    stats: [
      { icon: Users, label: 'Comunidad', value: '30K+' },
      { icon: Clock, label: 'Experiencia', value: '+10 años' },
      { icon: Award, label: 'Ponencias', value: '100+' },
      { icon: TrendingUp, label: 'Proyectos DeFi', value: '50+' }
    ],
    credentials: [
      'Pionero en DeFi y ecosistema Bitcoin en España',
      'Conferenciante internacional en eventos blockchain',
      'Asesor estratégico en proyectos descentralizados'
    ],
    social: {
      twitter: '#',
      linkedin: '#',
      website: '#'
    }
  },
  {
    id: 3,
    name: 'Diego Puertas',
    role: 'Analista Macro & Podcaster',
    image: 'https://i.scdn.co/image/ab6765630000ba8a40a865bd822a3baa5ea27af5',
    collaboration: {
      title: 'Análisis Macro Exclusivo',
      description: 'Reportes semanales de análisis macroeconómico y flujos de capital',
      platform: 'Exclusivo para Comunidad Medusa Capital'
    },
    stats: [
      { icon: Users, label: 'Oyentes', value: '40K+' },
      { icon: Clock, label: 'Experiencia', value: '+7 años' },
      { icon: TrendingUp, label: 'Episodios', value: '200+' },
      { icon: Award, label: 'Rating', value: '4.9/5' }
    ],
    credentials: [
      'Analista macroeconómico especializado en cripto',
      'Host del podcast de economía y mercados',
      'Colaborador habitual en medios financieros'
    ],
    social: {
      twitter: '#',
      linkedin: '#',
      website: '#'
    }
  }
];

export default function Colaboradores() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#010052] relative overflow-x-hidden">
      <div className="relative z-10">
        {/* Header */}
        <UnifiedHeader />

        {/* Hero Section */}
        <section className="pt-[140px] pb-16 px-8 flex flex-col items-center">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                  stroke="#B9B8EB" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <p className="font-['Inter'] text-[16px] text-white leading-[24px]">
                Expertos del Sector Tradicional Confían en Nosotros
              </p>
            </div>
            <div aria-hidden="true" className="absolute border border-[#6366f1] border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
          </div>

          {/* Hero Heading */}
          <div className="max-w-[1200px] text-center mb-8">
            <h1 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[72px] leading-[90px] text-white mb-4">
              Los Mayores Expertos del Sector
              <br />
              Tradicional <span className="text-[#b9b8eb]">Confían en Nosotros</span>
            </h1>
            <p className="font-['Inter'] text-[20px] leading-[32px] text-[rgba(204,204,224,0.7)] max-w-[900px] mx-auto">
              Colaboramos con los mayores profesionales del sector tradicional para dar a conocer
              <br />
              las enormes posibilidades que existen en el mercado de activos digitales
            </p>
          </div>
        </section>

        {/* Team Grid */}
        <section className="pt-0 pb-16 px-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="space-y-8">
              {colaboradores.map((colaborador) => (
                <div
                  key={colaborador.id}
                  className="relative bg-[rgba(27,26,100,0.5)] rounded-[24px] border border-[rgba(185,184,235,0.2)] overflow-hidden transition-all duration-300 hover:border-[rgba(185,184,235,0.4)] hover:bg-[rgba(27,26,100,0.6)] group"
                  onMouseEnter={() => setHoveredCard(colaborador.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Gradiente de fondo */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgba(99,102,241,0.08)] to-transparent pointer-events-none" />
                  
                  <div className="flex flex-col lg:flex-row">
                    {/* Imagen */}
                    <div className="relative lg:w-[400px] h-[300px] lg:h-auto overflow-hidden flex-shrink-0">
                      <img
                        src={colaborador.image}
                        alt={colaborador.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[rgba(1,0,82,0.3)]" />
                    </div>

                    {/* Contenido */}
                    <div className="relative py-6 px-8 flex-1">
                      {/* Social links - Esquina superior derecha */}
                      <div className="absolute top-6 right-6 flex gap-2">
                        <a
                          href={colaborador.social.twitter}
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.2)] transition-all duration-200 hover:bg-[rgba(99,102,241,0.2)] hover:scale-110"
                        >
                          <svg className="w-4 h-4 text-[#b9b8eb]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                          </svg>
                        </a>
                        <a
                          href={colaborador.social.linkedin}
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.2)] transition-all duration-200 hover:bg-[rgba(99,102,241,0.2)] hover:scale-110"
                        >
                          <svg className="w-4 h-4 text-[#b9b8eb]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                        {colaborador.social.website !== '#' && (
                          <a
                            href={colaborador.social.website}
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.2)] transition-all duration-200 hover:bg-[rgba(99,102,241,0.2)] hover:scale-110"
                          >
                            <svg className="w-4 h-4 text-[#b9b8eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                          </a>
                        )}
                      </div>

                      {/* Header */}
                      <div className="mb-5 pr-32">
                        <h3 className="font-['Cormorant_Garamond'] text-[38px] font-bold text-white mb-2 leading-tight">
                          {colaborador.name}
                        </h3>
                        <p className="font-['Inter'] text-[13px] text-[#6366f1] uppercase tracking-wider font-semibold">
                          {colaborador.role}
                        </p>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                        {colaborador.stats.map((stat, idx) => (
                          <div 
                            key={idx}
                            className="bg-[rgba(197,191,230,0.05)] border border-[rgba(197,191,230,0.15)] rounded-[12px] p-3 hover:border-[rgba(197,191,230,0.3)] transition-all duration-300"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <stat.icon className="w-4 h-4 text-[#6366f1]" />
                              <p className="font-['Inter'] text-[10px] text-[rgba(204,204,224,0.6)] uppercase tracking-wide">
                                {stat.label}
                              </p>
                            </div>
                            <p className="font-['Inter'] text-[16px] font-bold text-white leading-tight">
                              {stat.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Collaboration Section - DESTACADO */}
                        <div className="bg-gradient-to-br from-[rgba(99,102,241,0.15)] to-[rgba(139,92,246,0.1)] border-2 border-[rgba(99,102,241,0.3)] rounded-[16px] p-5">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-[rgba(99,102,241,0.3)] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-sm">🤝</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-['Inter'] text-[10px] text-[#b9b8eb] uppercase tracking-wider mb-2 font-semibold">
                                Colaboración con Medusa Capital
                              </p>
                              <h4 className="font-['Cormorant_Garamond'] text-[22px] font-bold text-white leading-tight mb-2">
                                {colaborador.collaboration.title}
                              </h4>
                              <p className="font-['Inter'] text-[14px] leading-[22px] text-[rgba(204,204,224,0.85)] mb-3">
                                {colaborador.collaboration.description}
                              </p>
                              <div className="inline-block bg-[rgba(99,102,241,0.2)] border border-[rgba(99,102,241,0.3)] rounded-[6px] px-3 py-1.5">
                                <p className="font-['Inter'] text-[12px] text-[#b9b8eb]">
                                  📍 {colaborador.collaboration.platform}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Credentials */}
                        <div>
                          <p className="font-['Inter'] text-[10px] text-[rgba(185,184,235,0.6)] uppercase tracking-wider mb-3 font-semibold">
                            Credenciales Destacadas
                          </p>
                          <div className="space-y-2">
                            {colaborador.credentials.map((credential, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="text-[#6366f1] mt-1 shrink-0 text-sm">✓</span>
                                <p className="font-['Inter'] text-[13px] leading-[20px] text-[rgba(204,204,224,0.85)]">
                                  {credential}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-8">
          <div className="max-w-[1000px] mx-auto relative">
            <div className="relative bg-[rgba(27,26,100,0.5)] rounded-[32px] p-12 border border-[rgba(185,184,235,0.2)] overflow-hidden">
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 60%)',
                }}
              />
              
              <div className="relative z-10 text-center">
                <h2 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[48px] leading-[60px] text-white mb-4">
                  ¿Quieres Colaborar con Medusa Capital?
                </h2>
                <p className="font-['Inter'] text-[18px] leading-[28px] text-[rgba(204,204,224,0.7)] max-w-[600px] mx-auto mb-8">
                  Estamos siempre buscando talento excepcional para crear contenido educativo de máxima calidad.
                </p>
                
                <button className="inline-block bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-8 py-4 rounded-[12px] font-['Inter'] font-semibold text-[18px] text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-105">
                  Contáctanos
                </button>
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