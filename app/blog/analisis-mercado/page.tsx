import { getMarketAnalysisPosts } from "@/lib/blog";
import { MarketAnalysisCard } from "@/components/blog/MarketAnalysisCard";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageBackground } from "@/components/landing/PageBackground";
import Link from "next/link";

export const metadata = {
  title: "Análisis de Mercado - Medusa Capital",
  description:
    "Análisis semanal del mercado de criptomonedas. Cada lunes, un nuevo análisis macro del ecosistema cripto.",
};

export default function MarketAnalysisPage() {
  const posts = getMarketAnalysisPosts();

  // Group posts by year for archive display
  const postsByYear = posts.reduce(
    (acc, post) => {
      const year = new Date(post.date).getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(post);
      return acc;
    },
    {} as Record<number, typeof posts>
  );

  const years = Object.keys(postsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <div className="relative z-10">
        <Header />
        <main className="pt-8 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#B9B8EB]/60 hover:text-white transition-colors mb-8"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver al blog
            </Link>

            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#4355d9]/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#657ef3]"
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
                <h1 className="text-3xl md:text-4xl font-bold text-white font-heading">
                  Análisis de Mercado
                </h1>
              </div>
              <p className="text-[#B9B8EB]/60 max-w-2xl">
                Cada lunes publicamos un análisis macro del mercado de
                criptomonedas. Tendencias, niveles clave y contexto para tomar
                mejores decisiones de inversión.
              </p>
            </div>

            {/* Archive */}
            {posts.length === 0 ? (
              <div className="text-center py-16 rounded-xl border border-[#B9B8EB]/10 bg-[#1b1a64]/20">
                <p className="text-[#B9B8EB]/60 text-lg mb-2">
                  Próximamente
                </p>
                <p className="text-[#B9B8EB]/40 text-sm">
                  El primer análisis semanal se publicará pronto.
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                {years.map((year) => (
                  <section key={year}>
                    <h2 className="text-lg font-semibold text-[#B9B8EB]/40 mb-4">
                      {year}
                    </h2>
                    <div className="space-y-2">
                      {postsByYear[year].map((post, index) => (
                        <MarketAnalysisCard
                          key={post.slug}
                          post={post}
                          isLatest={year === years[0] && index === 0}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
