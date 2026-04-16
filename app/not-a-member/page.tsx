// /not-a-member — shown when a user authenticates via Whop but has no active
// Medusa Capital membership. CTA points to the booking page.

import Link from "next/link";

export const metadata = {
  title: "Acceso restringido — Medusa Capital",
  description: "Necesitas una membresía activa de Medusa Capital para acceder.",
  robots: "noindex",
};

export default function NotAMemberPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#6366f1]/30 bg-[#6366f1]/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#6366f1]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>

        {/* Copy */}
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-white">
            Acceso restringido
          </h1>
          <p className="text-sm text-[#B9B8EB]/70 leading-relaxed">
            Necesitas una membresía activa de Medusa Capital para acceder a
            esta sección.
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/?utm_source=not-a-member#book-call"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#6366f1] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4f46e5] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-offset-2 focus:ring-offset-[#0a0a0f]"
        >
          Hazte miembro
        </Link>

        <p className="text-xs text-[#B9B8EB]/40">
          ¿Ya eres miembro?{" "}
          <Link
            href="/login"
            className="text-[#B9B8EB]/60 underline underline-offset-2 hover:text-[#B9B8EB]"
          >
            Vuelve a entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
