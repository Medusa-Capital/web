"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { BlogPostMeta } from "@/lib/blog";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

interface Props {
  post: BlogPostMeta;
}

export function BlogCard({ post }: Props) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/blog/${post.slug}`);
  };

  return (
    <article
      onClick={handleCardClick}
      className="glass-card gradient-border h-full flex flex-col cursor-pointer group"
    >
      {post.image && (
        <div className="aspect-video relative overflow-hidden rounded-t-[20px] -mx-[30px] -mt-[clamp(20px,2vw,32px)] mb-4">
          {post.type && (
            <span className="absolute top-0 left-0 z-10 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase rounded-tl-[20px] rounded-br-xl bg-[#1b1a64]/90 text-white">
              {post.type}
            </span>
          )}
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 text-sm text-[#B9B8EB]/60 mb-2">
          <span className="flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
            <time>{formatDate(post.date)}</time>
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{post.readingTime} min</span>
          </span>
        </div>
        <h2 className="text-xl font-semibold text-white group-hover:text-[#B9B8EB] transition-colors line-clamp-2 mb-2">
          {post.title}
        </h2>
        <p className="text-[#B9B8EB]/60 text-sm leading-relaxed flex-1 line-clamp-3">
          {post.description}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-[#657ef3] hover:text-white transition-colors"
        >
          Leer artículo
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
    </article>
  );
}
