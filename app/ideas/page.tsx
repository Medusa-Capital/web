// /ideas — feedback board list view.
// Personalized (vote state per viewer) → never cache. requireMember()
// is enforced by the layout, so session.userId is guaranteed here.

import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/auth/session";
import { listPosts } from "@/lib/feedback/queries";
import { SortSchema, StatusFilterSchema } from "@/lib/feedback/schemas";
import { PostCard } from "@/components/ideas/PostCard";
import { ProposeIdeaModal } from "@/components/ideas/ProposeIdeaModal";
import { ListControls } from "@/components/ideas/ListControls";

export const dynamic = "force-dynamic";

export default async function IdeasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const sort = SortSchema.parse(sp.sort ?? "votes");
  const status = StatusFilterSchema.parse(sp.status ?? "all");

  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  const posts = await listPosts({
    viewerId: session.userId,
    sort,
    status,
  });

  const name = session.displayName ?? session.email;

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-4xl font-bold text-white tracking-tight">
              Ideas y sugerencias
            </h1>
            <p className="mt-2 text-[#B9B8EB]/70">
              Vota, comenta o propón lo que quieres que construyamos.
            </p>
          </div>
          <ProposeIdeaModal />
        </header>

        <div className="mt-8">
          <ListControls sort={sort} status={status} />
        </div>

        <section className="mt-6 flex flex-col gap-3">
          {posts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#6366f1]/20 bg-[#0f0f17] px-6 py-12 text-center">
              <p className="text-[#B9B8EB]/70">
                No hay ideas todavía. Sé el primero en proponer una.
              </p>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </section>

        <footer className="mt-12 flex items-center justify-between text-xs text-[#B9B8EB]/40">
          <span>
            Hola, <span className="text-[#B9B8EB]/60">{name}</span>
          </span>
          <form action="/api/auth/whop/logout" method="POST">
            <button
              type="submit"
              className="underline underline-offset-2 hover:text-[#B9B8EB]"
            >
              Cerrar sesión
            </button>
          </form>
        </footer>
      </div>
    </main>
  );
}
