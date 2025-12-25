import { getAllTags, getPostsByTag } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageBackground } from "@/components/landing/PageBackground";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `Artículos sobre ${decodedTag} - Medusa Capital Blog`,
    description: `Explora nuestros artículos sobre ${decodedTag} y aprende más sobre inversión en criptomonedas.`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);
  const allTags = getAllTags();

  // Check if tag exists
  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <div className="relative z-10">
        <Header />
        <main className="pt-8 pb-16">
          <div className="max-w-6xl mx-auto px-6">
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
              Todos los artículos
            </Link>

            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 rounded-full bg-[#4355d9]/30 text-white border border-[#B9B8EB]/20 mb-4">
                {decodedTag}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">
                Artículos sobre {decodedTag}
              </h1>
              <p className="text-[#B9B8EB]/60">
                {posts.length} {posts.length === 1 ? "artículo" : "artículos"}{" "}
                encontrado{posts.length === 1 ? "" : "s"}
              </p>
            </div>

            {/* Other tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              <Link
                href="/blog"
                className="px-4 py-2 text-sm rounded-full bg-[#1b1a64]/50 text-[#B9B8EB] border border-[#B9B8EB]/20 hover:bg-[#4355d9]/30 hover:text-white transition-colors"
              >
                Todos
              </Link>
              {allTags.map((t) => (
                <Link
                  key={t}
                  href={`/blog/tags/${t}`}
                  className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                    t.toLowerCase() === decodedTag.toLowerCase()
                      ? "bg-[#4355d9]/30 text-white border-[#B9B8EB]/20"
                      : "bg-[#1b1a64]/50 text-[#B9B8EB] border-[#B9B8EB]/20 hover:bg-[#4355d9]/30 hover:text-white"
                  }`}
                >
                  {t}
                </Link>
              ))}
            </div>

            {/* Posts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
