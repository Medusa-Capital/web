import { useParams, Link } from 'react-router-dom';
import { Footer } from './imports/1920WLight';
import { BackgroundEffects } from './components/VisualEffects';
import { UnifiedHeader } from './components/UnifiedHeader';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { blogPosts, articleContents } from './blogData';

export default function ArticlePage() {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === parseInt(id || '0'));
  const content = articleContents[parseInt(id || '0')];

  if (!post || !content) {
    return (
      <div className="min-h-screen bg-[#010052] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-4xl mb-4">Artículo no encontrado</h1>
          <Link to="/blog" className="text-[#6366f1] hover:text-[#b9b8eb]">
            Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010052] relative overflow-x-hidden">
      {/* Efectos de fondo globales */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <BackgroundEffects />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <UnifiedHeader />

        {/* Artículo */}
        <article className="pt-[140px] pb-24 px-8">
          <div className="max-w-[900px] mx-auto">
            {/* Botón volver */}
            <Link 
              to="/blog"
              className="inline-flex items-center gap-2 text-[rgba(185,184,235,0.7)] hover:text-white transition-colors mb-8 font-['Inter'] text-[14px]"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al blog
            </Link>

            {/* Category badge */}
            <div className="mb-6">
              <div className="inline-block backdrop-blur-md bg-[rgba(99,102,241,0.3)] border border-[rgba(99,102,241,0.4)] px-4 py-2 rounded-[8px]">
                <p className="text-white text-sm font-['Inter'] font-semibold uppercase tracking-wider">
                  {post.category}
                </p>
              </div>
            </div>

            {/* Título */}
            <h1 className="font-['Cormorant_Garamond:Bold',sans-serif] text-[56px] leading-[70px] text-white mb-6">
              {post.title}
            </h1>

            {/* Meta info */}
            <div className="flex items-center gap-6 text-[rgba(185,184,235,0.6)] text-[14px] font-['Inter'] mb-8 pb-8 border-b border-[rgba(185,184,235,0.2)]">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Imagen destacada */}
            <div className="relative rounded-[24px] overflow-hidden mb-12">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Contenido del artículo */}
            <div className="prose prose-invert max-w-none">
              {content}
            </div>
          </div>
        </article>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
