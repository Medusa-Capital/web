// /ideas/[id] — post detail.
// Comments + status changes ship in Phase 4. For now: title, body, vote control,
// status badge, author, back link.

import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sessionOptions, type SessionData } from "@/lib/auth/session";
import { getPost } from "@/lib/feedback/queries";
import { VoteButton } from "@/components/ideas/VoteButton";
import { STATUS_LABELS, STATUS_TONE } from "@/components/ideas/status";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  const post = await getPost({ viewerId: session.userId, postId: id });
  if (!post) notFound();

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
                {post.createdAt.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
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

        <p className="mt-12 text-xs text-[#B9B8EB]/40">
          Comentarios disponibles muy pronto.
        </p>
      </div>
    </main>
  );
}
