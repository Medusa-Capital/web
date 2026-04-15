// /ideas — stub page (Phase 2).
// Phase 3 replaces this with the full feedback board list view.
// requireMember() is called in the layout — session data is guaranteed here.

import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function IdeasPage() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  const name = session.displayName ?? session.email;

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-heading text-4xl font-bold text-white tracking-tight">
          Ideas y sugerencias
        </h1>
        <p className="mt-3 text-[#B9B8EB]/70">
          Vota, comenta o propón lo que quieres que construyamos.
        </p>

        {/* Temp greeting — replaced in Phase 3 */}
        <div className="mt-12 rounded-lg border border-[#6366f1]/20 bg-[#6366f1]/5 px-6 py-5">
          <p className="text-white">
            Hola, <span className="font-semibold">{name}</span>. El tablero de
            ideas estará disponible muy pronto.
          </p>
        </div>

        {/* Logout */}
        <form action="/api/auth/whop/logout" method="POST" className="mt-8">
          <button
            type="submit"
            className="text-sm text-[#B9B8EB]/50 hover:text-[#B9B8EB] underline underline-offset-2 transition"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </main>
  );
}
