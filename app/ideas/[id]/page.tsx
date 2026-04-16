// /ideas/[id] — post detail with comments + (internal-only) status changer.

import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sessionOptions, type SessionData } from "@/lib/auth/session";
import { getPost, listComments } from "@/lib/feedback/queries";
import { VoteButton } from "@/components/ideas/VoteButton";
import { CommentForm } from "@/components/ideas/CommentForm";
import { StatusChanger } from "@/components/ideas/StatusChanger";
import {
  STATUS_LABELS,
  STATUS_TONE,
  type PostStatus,
} from "@/components/ideas/status";

export const dynamic = "force-dynamic";

const dateFmt = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const dateTimeFmt = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  const [post, comments] = await Promise.all([
    getPost({ viewerId: session.userId, postId: id }),
    listComments(id),
  ]);
  if (!post) notFound();

  const isInternal = session.role === "internal";

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/ideas"
          className="text-sm text-[#B9B8EB]/60 underline-offset-4 hover:text-white hover:underline"
        >
          ← Volver a ideas
        </Link>

        <article className="mt-6 flex gap-5">
          <VoteButton
            postId={post.id}
            initialVoted={post.hasVoted}
            initialCount={post.voteCount}
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-3xl font-bold text-white">
                {post.title}
              </h1>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${STATUS_TONE[post.status]}`}
              >
                {STATUS_LABELS[post.status]}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-3 text-xs text-[#B9B8EB]/40">
              <span>{post.authorName ?? "Miembro anterior"}</span>
              <span>·</span>
              <time dateTime={post.createdAt.toISOString()}>
                {dateFmt.format(post.createdAt)}
              </time>
            </div>

            <div className="prose prose-invert mt-6 max-w-none text-[#B9B8EB]/90">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                skipHtml
                allowedElements={[
                  "p", "ul", "ol", "li", "strong", "em", "code", "pre",
                  "blockquote", "a", "h2", "h3", "h4", "hr", "br",
                ]}
                components={{
                  a: ({ href, children }) => {
                    const safe = href?.startsWith("https://") ? href : undefined;
                    return safe ? (
                      <a href={safe} rel="nofollow noopener" target="_blank">
                        {children}
                      </a>
                    ) : (
                      <span>{children}</span>
                    );
                  },
                }}
              >
                {post.body}
              </ReactMarkdown>
            </div>
          </div>
        </article>

        {isInternal && (
          <div className="mt-8">
            <StatusChanger
              postId={post.id}
              currentStatus={post.status as PostStatus}
            />
          </div>
        )}

        <section className="mt-12">
          <h2 className="font-heading text-xl font-semibold text-white">
            Comentarios{" "}
            <span className="text-sm font-normal text-[#B9B8EB]/40">
              ({comments.length})
            </span>
          </h2>

          <ul className="mt-4 flex flex-col gap-3">
            {comments.length === 0 && (
              <li className="rounded-md border border-dashed border-[#6366f1]/20 bg-[#0f0f17] px-4 py-6 text-center text-sm text-[#B9B8EB]/50">
                Aún no hay comentarios. Sé el primero.
              </li>
            )}
            {comments.map((c) => (
              <li
                key={c.id}
                className="rounded-md border border-[#6366f1]/15 bg-[#0f0f17] px-4 py-3"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium text-white">
                    {c.authorName ?? "Miembro anterior"}
                  </span>
                  <time
                    dateTime={c.createdAt.toISOString()}
                    className="text-xs text-[#B9B8EB]/40"
                  >
                    {dateTimeFmt.format(c.createdAt)}
                  </time>
                </div>
                <p className="mt-1.5 whitespace-pre-wrap text-sm text-[#B9B8EB]/90">
                  {c.body}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <CommentForm postId={post.id} />
          </div>
        </section>
      </div>
    </main>
  );
}
