"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
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
      className="flex flex-col gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4"
    >
      <div className="flex items-center gap-2">
        <Shield className="h-3.5 w-3.5 text-amber-400/70" />
        <span className="text-[12px] font-medium uppercase tracking-wider text-amber-400/70">
          Interno
        </span>
        <span className="text-[12px] text-[#52525b]">— cambiar estado</span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <select
          value={next}
          onChange={(e) => setNext(e.target.value as PostStatus)}
          className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[13px] text-white focus:border-[#6366f1]/60 focus:outline-none"
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
          className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[13px] text-white placeholder:text-[#3f3f46] focus:border-[#6366f1]/60 focus:outline-none"
        />

        <button
          type="submit"
          disabled={pending || next === currentStatus}
          className="rounded-lg bg-amber-500/80 px-3.5 py-1.5 text-[13px] font-semibold text-[#0a0a0f] transition-all hover:bg-amber-400 disabled:opacity-40"
        >
          {pending ? "Aplicando…" : "Aplicar"}
        </button>
      </div>

      {error && <p className="text-[12px] text-red-400">{error}</p>}
    </form>
  );
}
