"use client";

import Link from "next/link";
import { useTransition, useState } from "react";
import { MessageSquare, ChevronUp } from "lucide-react";
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
        setOptimisticVoted(!next);
        setOptimisticCount((c) => c - (next ? 1 : -1));
      }
    });
  }

  return (
    <Link
      href={`/ideas/${post.id}`}
      className="group flex items-start gap-4 rounded-xl border border-white/[0.06] bg-[#111118] px-5 py-4 transition-all hover:border-white/[0.12] hover:bg-[#16161f]"
    >
      {/* Vote button */}
      <button
        type="button"
        onClick={onVoteClick}
        aria-pressed={optimisticVoted}
        aria-label={optimisticVoted ? "Quitar voto" : "Votar"}
        className={`flex w-12 shrink-0 flex-col items-center gap-0.5 rounded-lg border py-2 text-sm transition-all ${
          optimisticVoted
            ? "border-[#6366f1]/60 bg-[#6366f1]/15 text-[#818cf8]"
            : "border-white/[0.08] bg-white/[0.03] text-[#71717a] hover:border-[#6366f1]/40 hover:text-[#a5b4fc]"
        } ${pending ? "opacity-50" : ""}`}
      >
        <ChevronUp className="h-3.5 w-3.5" strokeWidth={2.5} />
        <span className="text-[13px] font-semibold tabular-nums leading-none">
          {optimisticCount}
        </span>
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-medium leading-snug text-white group-hover:text-[#e4e4e7]">
            {post.title}
          </h3>
          <span
            className={`mt-0.5 shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${STATUS_TONE[post.status]}`}
          >
            {STATUS_LABELS[post.status]}
          </span>
        </div>

        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[#71717a]">
          {post.body}
        </p>

        <div className="mt-2.5 flex items-center gap-3 text-[12px] text-[#52525b]">
          <span>{post.authorName ?? "Miembro anterior"}</span>
          <span className="text-[#3f3f46]">·</span>
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {post.commentCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
