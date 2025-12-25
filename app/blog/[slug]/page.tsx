import { notFound } from "next/navigation";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PageBackground } from "@/components/landing/PageBackground";
import Link from "next/link";
import Image from "next/image";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Artículo no encontrado - Medusa Capital" };
  }

  return {
    title: `${post.title} - Medusa Capital Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <div className="relative z-10">
        <Header />
        <article className="pt-8 pb-16">
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

            {/* Article header */}
            <header className="mb-12">
              {post.image && (
                <div className="aspect-video relative overflow-hidden rounded-2xl mb-8">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-heading leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-[#B9B8EB]/60 text-sm">
                <time>
                  {new Date(post.date).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>·</span>
                <span>{post.author}</span>
                <span>·</span>
                <span>{post.readingTime} min de lectura</span>
              </div>

              {post.tags.length > 0 && (
                <div className="flex gap-2 mt-6 flex-wrap">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tags/${tag}`}
                      className="px-3 py-1.5 text-sm rounded-full bg-[#4355d9]/20 text-[#B9B8EB] hover:bg-[#4355d9]/40 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            {/* Article content */}
            <div className="prose-content">
              <MarkdownRenderer content={post.content} />
            </div>

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-[#B9B8EB]/20">
              <Link
                href="/blog"
                className="inline-block px-6 py-3 rounded-full btn-primary-glow text-white font-medium"
              >
                Ver más artículos
              </Link>
            </footer>
          </div>
        </article>
        <Footer />
      </div>
    </div>
  );
}
