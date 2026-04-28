"use client";

// Client component so we can read searchParams without Suspense on the page.
// Renders error message based on ?error= query param.

import { useSearchParams } from "next/navigation";
import Link from "next/link";

const ERROR_COPY: Record<string, { title: string; body: string }> = {
  canceled: {
    title: "Cancelaste el acceso",
    body: "No se creó ninguna sesión. Vuelve a intentarlo cuando quieras.",
  },
  retry: {
    title: "Hubo un problema al iniciar sesión",
    body: "Intenta entrar de nuevo. Si el problema persiste, contacta con nosotros.",
  },
  "no-email": {
    title: "Necesitamos tu email para continuar",
    body: "Añade un email en tu perfil de Whop y vuelve a intentarlo.",
  },
};

export function LoginContent() {
  const searchParams = useSearchParams();
  const errorKey = searchParams.get("error") ?? null;
  const errorInfo = errorKey ? ERROR_COPY[errorKey] ?? null : null;

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo / brand */}
        <div className="text-center space-y-2">
          <h1 className="font-heading text-3xl font-bold text-white tracking-tight">
            Medusa Capital
          </h1>
          <p className="text-sm text-[#B9B8EB]/70">
            Accede con tu cuenta de Whop para entrar.
          </p>
        </div>

        {/* Error banner */}
        {errorInfo && (
          <div className="rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm">
            <p className="font-medium text-red-300">{errorInfo.title}</p>
            <p className="mt-0.5 text-red-400/80">{errorInfo.body}</p>
          </div>
        )}

        {/* CTA */}
        <a
          href={`/api/auth/whop/login${searchParams.get("returnTo") ? `?returnTo=${encodeURIComponent(searchParams.get("returnTo")!)}` : ""}`}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#6366f1] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4f46e5] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2 focus:ring-offset-[#0a0a0f]"
        >
          Entrar con Whop
        </a>

        {/* Not a member */}
        <p className="text-center text-xs text-[#B9B8EB]/50">
          ¿No eres miembro todavía?{" "}
          <Link
            href="/#book-call"
            className="text-[#B9B8EB]/80 underline underline-offset-2 hover:text-[#B9B8EB]"
          >
            Habla con nosotros
          </Link>
        </p>
      </div>
    </main>
  );
}
