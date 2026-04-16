// /ideas — feedback board list view (Featurebase-style).
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
import { Lightbulb } from "lucide-react";

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
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  );

  const posts = await listPosts({
    viewerId: session.userId,
    sort,
    status,
  });

  return (
    <main className="px-4 pb-16 pt-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Hero section — Featurebase-style */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.06] bg-[#111118]">
            <Lightbulb className="h-5 w-5 text-[#6366f1]" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Comparte tu feedback
          </h1>
          <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-[#71717a]">
            Cuéntanos qué funcionalidad te gustaría ver. Vota, comenta o propón
            ideas para mejorar la plataforma.
          </p>
          <div className="mt-5">
            <ProposeIdeaModal />
          </div>
        </div>

        {/* Filter controls */}
        <div className="mt-10">
          <ListControls sort={sort} status={status} />
        </div>

        {/* Post list */}
        <section className="mt-4 flex flex-col gap-2">
          {posts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/[0.08] bg-[#111118] px-6 py-16 text-center">
              <Lightbulb className="mx-auto h-8 w-8 text-[#3f3f46]" />
              <p className="mt-3 text-[15px] text-[#52525b]">
                No hay ideas todavía. Sé el primero en proponer una.
              </p>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </section>

        {/* Post count */}
        {posts.length > 0 && (
          <p className="mt-6 text-center text-[12px] text-[#3f3f46]">
            {posts.length} {posts.length === 1 ? "idea" : "ideas"}
          </p>
        )}
      </div>
    </main>
  );
}
