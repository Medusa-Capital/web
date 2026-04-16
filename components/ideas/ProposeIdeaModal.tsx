"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { createPost } from "@/app/ideas/actions";
import {
  TITLE_MIN,
  TITLE_MAX,
  BODY_MIN,
  BODY_MAX,
} from "@/lib/feedback/schemas";
import { STATUS_LABELS } from "./status";

interface SimilarPost {
  id: string;
  title: string;
  status: string;
}

const SIMILAR_DEBOUNCE_MS = 300;

export function ProposeIdeaModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [similar, setSimilar] = useState<SimilarPost[]>([]);
  const [pending, startTransition] = useTransition();
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open / close the native <dialog> imperatively
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  // Close on cancel (Esc / backdrop click)
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    function onCancel() {
      setOpen(false);
    }
    d.addEventListener("close", onCancel);
    return () => d.removeEventListener("close", onCancel);
  }, []);

  // Debounced similar-posts lookup
  useEffect(() => {
    const trimmed = title.trim();
    if (trimmed.length < 3) {
      setSimilar([]);
      return;
    }
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/ideas/similar?q=${encodeURIComponent(trimmed)}`
        );
        if (!res.ok) return;
        const json = (await res.json()) as { data: SimilarPost[] };
        setSimilar(json.data);
      } catch {
        // Best-effort suggestion — silent failure is acceptable
      }
    }, SIMILAR_DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [title]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await createPost({ title, body });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setOpen(false);
      setTitle("");
      setBody("");
      setSimilar([]);
      router.refresh();
      router.push(`/ideas/${res.data.id}`);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-[#6366f1] px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all hover:bg-[#5558e6] hover:shadow-[0_0_28px_rgba(99,102,241,0.3)]"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
        Proponer idea
      </button>

      <dialog
        ref={dialogRef}
        className="m-auto w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#111118] p-0 text-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Propón una idea
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-[#52525b] transition-colors hover:bg-white/[0.06] hover:text-white"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-[#a1a1aa]">
              Título
            </span>
            <input
              type="text"
              required
              minLength={TITLE_MIN}
              maxLength={TITLE_MAX}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resume tu idea en una frase"
              className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-[14px] text-white placeholder:text-[#3f3f46] focus:border-[#6366f1]/60 focus:outline-none focus:ring-1 focus:ring-[#6366f1]/30"
            />
            <span className="text-[11px] text-[#3f3f46]">
              {title.length}/{TITLE_MAX}
            </span>
          </label>

          {similar.length > 0 && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5">
              <p className="text-[12px] font-medium uppercase tracking-wider text-amber-400/80">
                Ideas parecidas — ¿quieres votarlas en su lugar?
              </p>
              <ul className="mt-2 space-y-1.5">
                {similar.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`/ideas/${s.id}`}
                      className="text-[13px] text-amber-200 underline underline-offset-2 hover:text-white"
                    >
                      {s.title}
                    </a>
                    <span className="ml-2 text-[10px] uppercase text-amber-400/50">
                      {STATUS_LABELS[
                        s.status as keyof typeof STATUS_LABELS
                      ] ?? s.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-[#a1a1aa]">
              Descripción
            </span>
            <textarea
              required
              minLength={BODY_MIN}
              maxLength={BODY_MAX}
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Detalla el problema, el caso de uso y cómo lo imaginas funcionando."
              className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-[14px] text-white placeholder:text-[#3f3f46] focus:border-[#6366f1]/60 focus:outline-none focus:ring-1 focus:ring-[#6366f1]/30"
            />
            <span className="text-[11px] text-[#3f3f46]">
              {body.length}/{BODY_MAX}
            </span>
          </label>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-[13px] text-red-300">
              {error}
            </p>
          )}

          <footer className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-2 text-[13px] font-medium text-[#71717a] transition-colors hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-[#6366f1] px-4 py-2 text-[13px] font-semibold text-white transition-all hover:bg-[#5558e6] disabled:opacity-50"
            >
              {pending ? "Publicando…" : "Publicar idea"}
            </button>
          </footer>
        </form>
      </dialog>
    </>
  );
}
