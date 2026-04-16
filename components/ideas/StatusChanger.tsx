"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { changeStatus } from "@/app/ideas/actions";
import { STATUS_LABELS, type PostStatus } from "./status";

const ORDER: PostStatus[] = [
  "open",
  "planned",
  "in_progress",
  "shipped",
  "declined",
];

export function StatusChanger({
  postId,
  currentStatus,
}: {
  postId: string;
  currentStatus: PostStatus;
}) {
  const router = useRouter();
  const [next, setNext] = useState<PostStatus>(currentStatus);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await changeStatus({
        postId,
        toStatus: next,
        reason: reason.trim() || null,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setReason("");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-amber-200/70">
          Interno
        </span>
        <span className="text-xs text-[#B9B8EB]/50">— cambiar estado</span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <select
          value={next}
          onChange={(e) => setNext(e.target.value as PostStatus)}
          className="rounded-md border border-[#6366f1]/20 bg-[#13131c] px-3 py-1.5 text-sm text-white focus:border-[#6366f1] focus:outline-none"
        >
          {ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Razón opcional (visible en el email)"
          maxLength={2000}
          className="flex-1 rounded-md border border-[#6366f1]/20 bg-[#13131c] px-3 py-1.5 text-sm text-white placeholder:text-[#B9B8EB]/30 focus:border-[#6366f1] focus:outline-none"
        />

        <button
          type="submit"
          disabled={pending || next === currentStatus}
          className="rounded-md bg-amber-500/80 px-3 py-1.5 text-sm font-medium text-[#0a0a0f] transition hover:bg-amber-400 disabled:opacity-50"
        >
          {pending ? "Aplicando…" : "Aplicar"}
        </button>
      </div>

      {error && <p className="text-xs text-red-300">{error}</p>}
    </form>
  );
}
