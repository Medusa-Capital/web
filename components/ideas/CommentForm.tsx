"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addComment } from "@/app/ideas/actions";
import { COMMENT_MAX } from "@/lib/feedback/schemas";

export function CommentForm({ postId }: { postId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await addComment({ postId, body });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setBody("");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-white/[0.06] bg-[#111118] p-4"
    >
      <textarea
        required
        rows={3}
        maxLength={COMMENT_MAX}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Añade tu comentario…"
        className="w-full resize-none rounded-lg border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-[14px] text-white placeholder:text-[#3f3f46] focus:border-[#6366f1]/60 focus:outline-none focus:ring-1 focus:ring-[#6366f1]/30"
      />
      {error && (
        <p className="mt-2 text-[12px] text-red-400">{error}</p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-[#3f3f46]">
          {body.length}/{COMMENT_MAX}
        </span>
        <button
          type="submit"
          disabled={pending || body.trim().length === 0}
          className="rounded-lg bg-[#6366f1] px-3.5 py-1.5 text-[13px] font-semibold text-white transition-all hover:bg-[#5558e6] disabled:opacity-40"
        >
          {pending ? "Enviando…" : "Comentar"}
        </button>
      </div>
    </form>
  );
}
