import {
  getAllTags,
  getFeaturedArticles,
  getRegularArticles,
} from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { NewsletterSection } from "@/components/blog/NewsletterSection";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageBackground } from "@/components/landing/PageBackground";
import Link from "next/link";

export const metadata = {
  title: "Blog - Medusa Capital",
  description:
    "Análisis profundo, estrategias probadas y educación cripto de calidad. Todo lo que necesitas saber para invertir con criterio.",
};

export default function BlogPage() {
  const featuredArticles = getFeaturedArticles();
  const regularArticles = getRegularArticles();
  const tags = getAllTags();

  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <div className="relative z-10">
        <Header />
        <main className="pt-8 pb-16">
          <div className="max-w-6xl mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 font-heading">
                Blog
              </h1>
              <p className="text-[#B9B8EB]/60 max-w-2xl mx-auto">
                Análisis profundo, estrategias probadas y educación cripto de calidad.
                <br />
                Todo lo que necesitas saber para invertir con criterio.
              </p>
            </div>

            {/* Featured Articles Section */}
            {featuredArticles.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-[#50d98a]/20 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[#50d98a]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Artículos Destacados
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredArticles.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* More Articles Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Más Artículos</h2>
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
              {regularArticles.length === 0 ? (
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
                  {regularArticles.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
        <NewsletterSection />
        <Footer />
      </div>
    </div>
  );
}
