"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { BlogPostMeta } from "@/lib/blog";

interface Props {
  post: BlogPostMeta;
}

export function BlogCard({ post }: Props) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/blog/${post.slug}`);
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    router.push(`/blog/tags/${tag}`);
  };

  return (
    <article
      onClick={handleCardClick}
      className="glass-card gradient-border h-full flex flex-col cursor-pointer group"
    >
      {post.image && (
        <div className="aspect-video relative overflow-hidden rounded-t-[20px] -mx-[30px] -mt-[clamp(20px,2vw,32px)] mb-4">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <div className="text-sm text-[#B9B8EB]/60 mb-2">
          <time>
            {new Date(post.date).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
          <span className="mx-2">·</span>
          <span>{post.readingTime} min</span>
        </div>
        <h2 className="text-xl font-semibold text-white group-hover:text-[#B9B8EB] transition-colors line-clamp-2 mb-2">
          {post.title}
        </h2>
        <p className="text-[#B9B8EB]/60 text-sm leading-relaxed flex-1 line-clamp-3">
          {post.description}
        </p>
        {post.tags.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {post.tags.slice(0, 3).map((tag) => (
              <button
                key={tag}
                onClick={(e) => handleTagClick(e, tag)}
                className="px-2.5 py-1 text-xs rounded-full bg-[#4355d9]/20 text-[#B9B8EB] hover:bg-[#4355d9]/40 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
