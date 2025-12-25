"use client";

import { useRouter } from "next/navigation";
import type { BlogPostMeta } from "@/lib/blog";

interface Props {
  post: BlogPostMeta;
  isLatest?: boolean;
}

export function MarketAnalysisCard({ post, isLatest = false }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/blog/${post.slug}`);
  };

  // Format date as "Lunes, 23 de diciembre de 2024"
  const formattedDate = new Date(post.date).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Capitalize first letter
  const capitalizedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <article
      onClick={handleClick}
      className={`
        group cursor-pointer rounded-xl border transition-all duration-200
        ${
          isLatest
            ? "bg-[#4355d9]/10 border-[#4355d9]/30 hover:border-[#4355d9]/50 hover:bg-[#4355d9]/15"
            : "bg-[#1b1a64]/30 border-[#B9B8EB]/10 hover:border-[#B9B8EB]/30 hover:bg-[#1b1a64]/50"
        }
      `}
    >
      <div className="px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            {isLatest && (
              <span className="px-2 py-0.5 text-xs font-medium rounded bg-[#4355d9]/30 text-[#B9B8EB]">
                Último
              </span>
            )}
            <time className="text-sm text-[#B9B8EB]/50">{capitalizedDate}</time>
          </div>
          <h3 className="text-white font-medium group-hover:text-[#B9B8EB] transition-colors truncate">
            {post.title}
          </h3>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-[#B9B8EB]/40">{post.readingTime} min</span>
          <svg
            className="w-5 h-5 text-[#B9B8EB]/40 group-hover:text-[#B9B8EB] group-hover:translate-x-1 transition-all"
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
        </div>
      </div>
    </article>
  );
}
