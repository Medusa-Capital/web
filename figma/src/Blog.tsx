import { Footer } from './imports/1920WLight';
import { BackgroundEffects } from './components/VisualEffects';
import { UnifiedHeader } from './components/UnifiedHeader';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPosts } from './blogData';

export default function Blog() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                  stroke="#B9B8EB" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <p className="font-['Inter'] text-[16px] text-white leading-[24px]">
                Contenido educativo de calidad
              </p>
            </div>
            <div aria-hidden="true" className="absolute border border-[#6366f1] border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
          </div>

          {/* Hero Heading */}
          <div className="max-w-[900px] text-center mb-8">
            <h1 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[72px] leading-[90px] text-white mb-4">
              Blog de
              <br />
              <span className="text-[#b9b8eb]">Medusa Capital</span>
            </h1>
            <p className="font-['Inter'] text-[20px] leading-[32px] text-[rgba(204,204,224,0.7)] max-w-[700px] mx-auto">
              Análisis profundo, estrategias probadas y educación cripto de calidad. 
              Todo lo que necesitas saber para invertir con criterio.
            </p>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="pt-0 pb-16 px-8">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="font-['Cormorant_Garamond'] text-[42px] font-bold text-white mb-8">
              Artículos destacados
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="relative backdrop-blur-md bg-[rgba(27,26,100,0.4)] rounded-[24px] border border-[rgba(185,184,235,0.2)] overflow-hidden transition-all duration-300 hover:border-[rgba(185,184,235,0.4)] hover:bg-[rgba(27,26,100,0.5)] group cursor-pointer block"
                >
                  {/* Gradiente de fondo */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgba(99,102,241,0.08)] to-transparent pointer-events-none" />
                  
                  {/* Imagen */}
                  <div className="relative h-[220px] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,0,82,0.9)] via-transparent to-transparent" />
                    
                    {/* Category badge */}
                    <div className="absolute top-4 left-4 backdrop-blur-md bg-[rgba(99,102,241,0.3)] border border-[rgba(99,102,241,0.4)] px-3 py-1 rounded-[8px]">
                      <p className="text-white text-xs font-['Inter'] font-semibold uppercase tracking-wider">
                        {post.category}
                      </p>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="relative p-6">
                    <h3 className="font-['Cormorant_Garamond'] text-[24px] font-bold text-white mb-3 leading-tight group-hover:text-[#b9b8eb] transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="font-['Inter'] text-[14px] leading-[22px] text-[rgba(204,204,224,0.7)] mb-4">
                      {post.excerpt}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-[rgba(185,184,235,0.6)] text-[12px] font-['Inter'] mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    {/* Read more link */}
                    <div className="flex items-center gap-2 text-[#6366f1] font-['Inter'] font-semibold text-[14px] group-hover:gap-3 transition-all">
                      <span>Leer artículo</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Regular Posts */}
        <section className="py-16 px-8">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="font-['Cormorant_Garamond'] text-[42px] font-bold text-white mb-8">
              Más artículos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="relative backdrop-blur-md bg-[rgba(27,26,100,0.3)] rounded-[20px] border border-[rgba(185,184,235,0.15)] overflow-hidden transition-all duration-300 hover:border-[rgba(185,184,235,0.3)] hover:bg-[rgba(27,26,100,0.4)] group cursor-pointer block"
                >
                  {/* Imagen más pequeña */}
                  <div className="relative h-[160px] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,0,82,0.8)] via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 backdrop-blur-md bg-[rgba(99,102,241,0.2)] border border-[rgba(99,102,241,0.3)] px-2 py-1 rounded-[6px]">
                      <p className="text-white text-[10px] font-['Inter'] font-semibold uppercase tracking-wider">
                        {post.category}
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-['Cormorant_Garamond'] text-[20px] font-bold text-white mb-2 leading-tight group-hover:text-[#b9b8eb] transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="font-['Inter'] text-[13px] leading-[20px] text-[rgba(204,204,224,0.6)] mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-3 text-[rgba(185,184,235,0.5)] text-[11px] font-['Inter']">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-24 px-8">
          <div className="max-w-[800px] mx-auto relative">
            <div className="relative backdrop-blur-md bg-[rgba(27,26,100,0.5)] rounded-[32px] p-12 border border-[rgba(185,184,235,0.2)] overflow-hidden">
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 60%)',
                }}
              />
              
              <div className="relative z-10 text-center">
                <h2 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[42px] leading-[52px] text-white mb-4">
                  Suscríbete a nuestra newsletter
                </h2>
                <p className="font-['Inter'] text-[16px] leading-[26px] text-[rgba(204,204,224,0.7)] max-w-[500px] mx-auto mb-8">
                  Recibe análisis exclusivos, alertas de proyectos prometedores y contenido educativo directamente en tu email.
                </p>
                
                <div className="flex gap-3 max-w-[500px] mx-auto">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="flex-1 px-5 py-3 rounded-[12px] border-2 border-[rgba(185,184,235,0.2)] bg-[rgba(1,0,82,0.5)] text-white font-['Inter'] outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] transition-all"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-[12px] font-['Inter'] font-semibold text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-105">
                    Suscribirme
                  </button>
                </div>
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