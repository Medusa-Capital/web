// /ideas/[id] — post detail with comments + (internal-only) status changer.
// Featurebase-style detail view.

import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, MessageSquare } from "lucide-react";
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
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  );

  const [post, comments] = await Promise.all([
    getPost({ viewerId: session.userId, postId: id }),
    listComments(id),
  ]);
  if (!post) notFound();

  const isInternal = session.role === "internal";

  return (
    <main className="px-4 pb-16 pt-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <Link
          href="/ideas"
          className="inline-flex items-center gap-1.5 text-[13px] text-[#71717a] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a ideas
        </Link>

        {/* Post header */}
        <article className="mt-6 rounded-xl border border-white/[0.06] bg-[#111118] p-6">
          <div className="flex items-start gap-5">
            <VoteButton
              postId={post.id}
              initialVoted={post.hasVoted}
              initialCount={post.voteCount}
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {post.title}
                </h1>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${STATUS_TONE[post.status]}`}
                >
                  {STATUS_LABELS[post.status]}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-3 text-[13px] text-[#52525b]">
                <span>{post.authorName ?? "Miembro anterior"}</span>
                <span className="text-[#3f3f46]">·</span>
                <time dateTime={post.createdAt.toISOString()}>
                  {dateFmt.format(post.createdAt)}
                </time>
              </div>

              <div className="prose prose-invert mt-5 max-w-none text-[14px] leading-relaxed text-[#a1a1aa] prose-p:text-[#a1a1aa] prose-strong:text-white prose-a:text-[#818cf8] prose-a:no-underline hover:prose-a:underline prose-code:text-[#c4b5fd]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  skipHtml
                  allowedElements={[
                    "p",
                    "ul",
                    "ol",
                    "li",
                    "strong",
                    "em",
                    "code",
                    "pre",
                    "blockquote",
                    "a",
                    "h2",
                    "h3",
                    "h4",
                    "hr",
                    "br",
                  ]}
                  components={{
                    a: ({ href, children }) => {
                      const safe = href?.startsWith("https://")
                        ? href
                        : undefined;
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
          </div>
        </article>

        {/* Status changer — internal only */}
        {isInternal && (
          <div className="mt-4">
            <StatusChanger
              postId={post.id}
              currentStatus={post.status as PostStatus}
            />
          </div>
        )}

        {/* Comments section */}
        <section className="mt-8">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#52525b]" />
            <h2 className="text-[15px] font-medium text-white">
              Comentarios
            </h2>
            <span className="text-[13px] text-[#52525b]">
              ({comments.length})
            </span>
          </div>

          <div className="mt-4">
            <CommentForm postId={post.id} />
          </div>

          <ul className="mt-6 flex flex-col gap-px overflow-hidden rounded-xl border border-white/[0.06]">
            {comments.length === 0 && (
              <li className="bg-[#111118] px-5 py-8 text-center text-[13px] text-[#52525b]">
                Aún no hay comentarios. Sé el primero.
              </li>
            )}
            {comments.map((c) => (
              <li
                key={c.id}
                className="border-b border-white/[0.04] bg-[#111118] px-5 py-4 last:border-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6366f1]/15 text-[10px] font-semibold text-[#818cf8]">
                      {(c.authorName ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[13px] font-medium text-white">
                      {c.authorName ?? "Miembro anterior"}
                    </span>
                  </div>
                  <time
                    dateTime={c.createdAt.toISOString()}
                    className="text-[12px] text-[#3f3f46]"
                  >
                    {dateTimeFmt.format(c.createdAt)}
                  </time>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-[#a1a1aa]">
                  {c.body}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
