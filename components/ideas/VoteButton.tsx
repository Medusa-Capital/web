"use client";

import { useState, useTransition } from "react";
import { toggleVote } from "@/app/ideas/actions";

export function VoteButton({
  postId,
  initialVoted,
  initialCount,
}: {
  postId: string;
  initialVoted: boolean;
  initialCount: number;
}) {
  const [voted, setVoted] = useState(initialVoted);
  const [count, setCount] = useState(initialCount);
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (pending) return;
    const next = !voted;
    setVoted(next);
    setCount((c) => c + (next ? 1 : -1));

    startTransition(async () => {
      const res = await toggleVote({ postId });
      if (!res.ok) {
        setVoted(!next);
        setCount((c) => c - (next ? 1 : -1));
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={voted}
      aria-label={voted ? "Quitar voto" : "Votar"}
      className={`flex w-16 shrink-0 flex-col items-center justify-center rounded-md border px-2 py-3 text-sm transition ${
        voted
          ? "border-[#6366f1] bg-[#6366f1]/15 text-white"
          : "border-[#6366f1]/20 bg-transparent text-[#B9B8EB]/70 hover:border-[#6366f1]/50 hover:text-white"
      } ${pending ? "opacity-60" : ""}`}
    >
      <span className="text-xs leading-none">▲</span>
      <span className="mt-1 text-base font-semibold tabular-nums">{count}</span>
    </button>
  );
}
