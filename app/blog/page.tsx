import {
  getArticles,
  getAllTags,
  getLatestMarketAnalysis,
  getMarketAnalysisPosts,
} from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { MarketAnalysisCard } from "@/components/blog/MarketAnalysisCard";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageBackground } from "@/components/landing/PageBackground";
import Link from "next/link";

export const metadata = {
  title: "Blog - Medusa Capital",
  description:
    "Artículos sobre inversión en criptomonedas, análisis de mercado y educación financiera.",
};

export default function BlogPage() {
  const articles = getArticles();
  const tags = getAllTags();
  const latestAnalysis = getLatestMarketAnalysis();
  const recentAnalyses = getMarketAnalysisPosts().slice(0, 3);

  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <div className="relative z-10">
        <Header />
        <main className="pt-8 pb-16">
          <div className="max-w-6xl mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">
                Blog
              </h1>
              <p className="text-[#B9B8EB]/60 max-w-2xl mx-auto">
                Artículos sobre inversión en criptomonedas, análisis de mercado
                y educación financiera para inversores exigentes.
              </p>
            </div>

            {/* Market Analysis Section */}
            {recentAnalyses.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#4355d9]/20 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-[#657ef3]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      Análisis de Mercado
                    </h2>
                  </div>
                  <Link
                    href="/blog/analisis-mercado"
                    className="text-sm text-[#B9B8EB]/60 hover:text-white transition-colors flex items-center gap-1"
                  >
                    Ver archivo
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
                <div className="space-y-2">
                  {recentAnalyses.map((post, index) => (
                    <MarketAnalysisCard
                      key={post.slug}
                      post={post}
                      isLatest={index === 0}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Articles Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Artículos</h2>
                {/* Tags filter */}
                {tags.length > 0 && (
                  <div className="hidden md:flex flex-wrap gap-2">
                    {tags.slice(0, 5).map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tags/${tag}`}
                        className="px-3 py-1 text-xs rounded-full bg-[#1b1a64]/50 text-[#B9B8EB]/70 border border-[#B9B8EB]/10 hover:bg-[#4355d9]/30 hover:text-white transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Posts grid */}
              {articles.length === 0 ? (
                <div className="text-center py-16 rounded-xl border border-[#B9B8EB]/10 bg-[#1b1a64]/20">
                  <p className="text-[#B9B8EB]/60 text-lg mb-2">
                    Próximamente
                  </p>
                  <p className="text-[#B9B8EB]/40 text-sm">
                    Los artículos se publicarán pronto.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
