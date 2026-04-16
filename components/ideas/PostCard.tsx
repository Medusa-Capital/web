"use client";

import Link from "next/link";
import { useTransition, useState } from "react";
import { toggleVote } from "@/app/ideas/actions";
import { STATUS_LABELS, STATUS_TONE } from "./status";
import type { PostListItem } from "@/lib/feedback/queries";

export function PostCard({ post }: { post: PostListItem }) {
  const [optimisticVoted, setOptimisticVoted] = useState(post.hasVoted);
  const [optimisticCount, setOptimisticCount] = useState(post.voteCount);
  const [pending, startTransition] = useTransition();

  function onVoteClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;

    const next = !optimisticVoted;
    setOptimisticVoted(next);
    setOptimisticCount((c) => c + (next ? 1 : -1));

    startTransition(async () => {
      const res = await toggleVote({ postId: post.id });
      if (!res.ok) {
        // Roll back on error
        setOptimisticVoted(!next);
        setOptimisticCount((c) => c - (next ? 1 : -1));
      }
    });
  }

  return (
    <Link
      href={`/ideas/${post.id}`}
      className="group flex gap-4 rounded-lg border border-[#6366f1]/15 bg-[#0f0f17] px-5 py-4 transition hover:border-[#6366f1]/40 hover:bg-[#13131c]"
    >
      <button
        type="button"
        onClick={onVoteClick}
        aria-pressed={optimisticVoted}
        aria-label={optimisticVoted ? "Quitar voto" : "Votar"}
        className={`flex w-14 shrink-0 flex-col items-center justify-center rounded-md border px-2 py-2 text-sm transition ${
          optimisticVoted
            ? "border-[#6366f1] bg-[#6366f1]/15 text-white"
            : "border-[#6366f1]/20 bg-transparent text-[#B9B8EB]/70 hover:border-[#6366f1]/50 hover:text-white"
        } ${pending ? "opacity-60" : ""}`}
      >
        <span className="text-xs leading-none">▲</span>
        <span className="mt-1 font-semibold tabular-nums">
          {optimisticCount}
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium text-white group-hover:text-[#B9B8EB]">
            {post.title}
          </h3>
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${STATUS_TONE[post.status]}`}
          >
            {STATUS_LABELS[post.status]}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-[#B9B8EB]/60">
          {post.body}
        </p>
        <div className="mt-2 flex items-center gap-3 text-xs text-[#B9B8EB]/40">
          <span>{post.authorName ?? "Miembro anterior"}</span>
          <span>·</span>
          <span>
            {post.commentCount} {post.commentCount === 1 ? "comentario" : "comentarios"}
          </span>
        </div>
      </div>
    </Link>
  );
}
