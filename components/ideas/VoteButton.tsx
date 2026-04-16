"use client";

import { useState, useTransition } from "react";
import { ChevronUp } from "lucide-react";
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
      className={`flex w-14 shrink-0 flex-col items-center gap-0.5 rounded-lg border py-2.5 transition-all ${
        voted
          ? "border-[#6366f1]/60 bg-[#6366f1]/15 text-[#818cf8]"
          : "border-white/[0.08] bg-white/[0.03] text-[#71717a] hover:border-[#6366f1]/40 hover:text-[#a5b4fc]"
      } ${pending ? "opacity-50" : ""}`}
    >
      <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
      <span className="text-sm font-semibold tabular-nums leading-none">
        {count}
      </span>
    </button>
  );
}
