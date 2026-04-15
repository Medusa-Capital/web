"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/app/ideas/actions";
import { TITLE_MIN, TITLE_MAX, BODY_MIN, BODY_MAX } from "@/lib/feedback/schemas";
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
        className="rounded-md bg-[#6366f1] px-4 py-2 text-sm font-medium text-white shadow-[0_0_24px_rgba(99,102,241,0.25)] transition hover:bg-[#7376f3]"
      >
        Proponer idea
      </button>

      <dialog
        ref={dialogRef}
        className="m-auto w-full max-w-xl rounded-xl border border-[#6366f1]/30 bg-[#0f0f17] p-0 text-white backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          <header className="flex items-start justify-between">
            <h2 className="font-heading text-2xl text-white">
              Propón una idea
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[#B9B8EB]/60 hover:text-white"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </header>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-[#B9B8EB]/80">Título</span>
            <input
              type="text"
              required
              minLength={TITLE_MIN}
              maxLength={TITLE_MAX}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resume tu idea en una frase"
              className="rounded-md border border-[#6366f1]/20 bg-[#13131c] px-3 py-2 text-sm text-white placeholder:text-[#B9B8EB]/30 focus:border-[#6366f1] focus:outline-none"
            />
            <span className="text-xs text-[#B9B8EB]/40">
              {title.length}/{TITLE_MAX}
            </span>
          </label>

          {similar.length > 0 && (
            <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
              <p className="text-xs uppercase tracking-wider text-amber-200/80">
                Ideas parecidas — ¿quieres votarlas en su lugar?
              </p>
              <ul className="mt-2 space-y-1.5">
                {similar.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`/ideas/${s.id}`}
                      className="text-sm text-amber-100 underline underline-offset-2 hover:text-white"
                    >
                      {s.title}
                    </a>
                    <span className="ml-2 text-[10px] uppercase text-amber-200/60">
                      {STATUS_LABELS[s.status as keyof typeof STATUS_LABELS] ??
                        s.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-[#B9B8EB]/80">Descripción</span>
            <textarea
              required
              minLength={BODY_MIN}
              maxLength={BODY_MAX}
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Detalla el problema, el caso de uso y cómo lo imaginas funcionando."
              className="rounded-md border border-[#6366f1]/20 bg-[#13131c] px-3 py-2 text-sm text-white placeholder:text-[#B9B8EB]/30 focus:border-[#6366f1] focus:outline-none"
            />
            <span className="text-xs text-[#B9B8EB]/40">
              {body.length}/{BODY_MAX}
            </span>
          </label>

          {error && (
            <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}

          <footer className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm text-[#B9B8EB]/70 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-[#6366f1] px-4 py-2 text-sm font-medium text-white shadow-[0_0_24px_rgba(99,102,241,0.25)] transition hover:bg-[#7376f3] disabled:opacity-50"
            >
              {pending ? "Publicando…" : "Publicar idea"}
            </button>
          </footer>
        </form>
      </dialog>
    </>
  );
}
