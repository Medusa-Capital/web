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
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <textarea
        required
        rows={3}
        maxLength={COMMENT_MAX}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Añade tu comentario…"
        className="rounded-md border border-[#6366f1]/20 bg-[#13131c] px-3 py-2 text-sm text-white placeholder:text-[#B9B8EB]/30 focus:border-[#6366f1] focus:outline-none"
      />
      {error && (
        <p className="text-xs text-red-300">{error}</p>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#B9B8EB]/40">
          {body.length}/{COMMENT_MAX}
        </span>
        <button
          type="submit"
          disabled={pending || body.trim().length === 0}
          className="rounded-md bg-[#6366f1] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#7376f3] disabled:opacity-50"
        >
          {pending ? "Enviando…" : "Comentar"}
        </button>
      </div>
    </form>
  );
}
