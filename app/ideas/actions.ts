"use server";

import { revalidatePath } from "next/cache";
import { sql, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  feedbackPosts,
  feedbackVotes,
  feedbackComments,
  postStatusHistory,
} from "@/db/schema";
import { requireMemberCore, requireInternalCore } from "@/lib/auth/require";
import { assertSameOrigin } from "@/lib/csrf";
import {
  CreatePostSchema,
  ToggleVoteSchema,
  AddCommentSchema,
  ChangeStatusSchema,
} from "@/lib/feedback/schemas";
import {
  getPostMinimal,
  getPostAuthorRecipient,
  listVoterRecipients,
} from "@/lib/feedback/queries";
import { sendEmail } from "@/lib/email/client";
import { newCommentEmail, statusChangeEmail } from "@/lib/email/templates";
import { buildUnsubscribeUrl } from "@/lib/email/unsubscribe-token";
import { type PostStatus } from "@/components/ideas/status";
import { ok, err, type ActionResult } from "@/lib/result";
import { captureError } from "@/lib/logger";

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`${name} environment variable is not set`);
  return val;
}

export async function createPost(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    await assertSameOrigin();
  } catch {
    return err("Solicitud rechazada", "UNAUTHORIZED");
  }

  const auth = await requireMemberCore();
  if (!auth.ok) return err("Inicia sesión para proponer ideas", "UNAUTHORIZED");

  const parsed = CreatePostSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Datos no válidos";
    return err(first, "VALIDATION");
  }

  try {
    const [row] = await db
      .insert(feedbackPosts)
      .values({
        authorId: auth.data.userId,
        title: parsed.data.title,
        body: parsed.data.body,
      })
      .returning({ id: feedbackPosts.id });

    if (!row) return err("No se pudo crear la idea", "INTERNAL");

    // Auto-vote: author implicitly votes for their own post
    await db
      .insert(feedbackVotes)
      .values({ postId: row.id, userId: auth.data.userId })
      .onConflictDoNothing();

    revalidatePath("/ideas");
    return ok({ id: row.id });
  } catch (e) {
    await captureError(e, { action: "createPost" });
    return err("Error al guardar la idea", "INTERNAL");
  }
}

export async function toggleVote(
  input: unknown
): Promise<ActionResult<{ voted: boolean }>> {
  try {
    await assertSameOrigin();
  } catch {
    return err("Solicitud rechazada", "UNAUTHORIZED");
  }

  const auth = await requireMemberCore();
  if (!auth.ok) return err("Inicia sesión para votar", "UNAUTHORIZED");

  const parsed = ToggleVoteSchema.safeParse(input);
  if (!parsed.success) return err("ID inválido", "VALIDATION");

  const { postId } = parsed.data;
  const userId = auth.data.userId;

  try {
    // Atomic toggle: try insert; if conflict (already voted), delete instead.
    // Two separate statements but each is atomic — race-safe via composite PK.
    // Never delete-then-insert (would briefly drop the vote).
    const inserted = await db
      .insert(feedbackVotes)
      .values({ postId, userId })
      .onConflictDoNothing()
      .returning({ postId: feedbackVotes.postId });

    if (inserted.length > 0) {
      revalidatePath("/ideas");
      revalidatePath(`/ideas/${postId}`);
      return ok({ voted: true });
    }

    await db
      .delete(feedbackVotes)
      .where(
        sql`${feedbackVotes.postId} = ${postId} AND ${feedbackVotes.userId} = ${userId}`
      );

    revalidatePath("/ideas");
    revalidatePath(`/ideas/${postId}`);
    return ok({ voted: false });
  } catch (e) {
    await captureError(e, { action: "toggleVote", postId });
    return err("Error al votar", "INTERNAL");
  }
}

// ---------------------------------------------------------------------------
// addComment — member action
// ---------------------------------------------------------------------------
// Insert + (best-effort) email author. Email failure does not roll back the
// comment — captureError logs and we return ok regardless.

export async function addComment(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    await assertSameOrigin();
  } catch {
    return err("Solicitud rechazada", "UNAUTHORIZED");
  }

  const auth = await requireMemberCore();
  if (!auth.ok) return err("Inicia sesión para comentar", "UNAUTHORIZED");

  const parsed = AddCommentSchema.safeParse(input);
  if (!parsed.success) {
    return err(parsed.error.issues[0]?.message ?? "Datos no válidos", "VALIDATION");
  }

  const { postId, body } = parsed.data;
  const userId = auth.data.userId;

  let commentId: string;
  let commenterName: string;
  let postTitle: string;
  let authorRecipient: Awaited<ReturnType<typeof getPostAuthorRecipient>>;

  try {
    const post = await getPostMinimal(postId);
    if (!post) return err("Idea no encontrada", "NOT_FOUND");
    postTitle = post.title;

    const [row] = await db
      .insert(feedbackComments)
      .values({ postId, authorId: userId, body })
      .returning({ id: feedbackComments.id });

    if (!row) return err("No se pudo guardar el comentario", "INTERNAL");
    commentId = row.id;

    commenterName = auth.data.displayName ?? auth.data.email;

    // Look up author recipient AFTER the insert so the post can't go missing
    // mid-action without affecting the user's comment.
    authorRecipient = await getPostAuthorRecipient(postId);
  } catch (e) {
    await captureError(e, { action: "addComment", postId });
    return err("Error al guardar el comentario", "INTERNAL");
  }

  // Best-effort email — never block / fail the action
  if (authorRecipient && authorRecipient.id !== userId) {
    try {
      const appOrigin = requireEnv("NEXT_PUBLIC_APP_URL");
      const unsubscribeUrl = await buildUnsubscribeUrl(authorRecipient.id);
      const tpl = newCommentEmail({
        recipientName: authorRecipient.displayName,
        postTitle,
        postUrl: `${appOrigin}/ideas/${postId}`,
        commenterName,
        commentBody: body,
        unsubscribeUrl,
      });
      await sendEmail({
        to: authorRecipient.email,
        subject: tpl.subject,
        html: tpl.html,
        text: tpl.text,
        listUnsubscribeUrl: unsubscribeUrl,
      });
    } catch (e) {
      await captureError(e, { action: "addComment_email", postId });
    }
  }

  revalidatePath(`/ideas/${postId}`);
  revalidatePath("/ideas");
  return ok({ id: commentId });
}

// ---------------------------------------------------------------------------
// changeStatus — internal-only
// ---------------------------------------------------------------------------
// Updates posts.status, appends to post_status_history, emails the author
// and all voters (filtered for soft-delete + unsubscribe). All DB work in
// a single transaction; email fanout outside the transaction (best-effort).

export async function changeStatus(
  input: unknown
): Promise<ActionResult<{ toStatus: PostStatus }>> {
  try {
    await assertSameOrigin();
  } catch {
    return err("Solicitud rechazada", "UNAUTHORIZED");
  }

  const auth = await requireInternalCore();
  if (!auth.ok) return err("Permisos insuficientes", "UNAUTHORIZED");

  const parsed = ChangeStatusSchema.safeParse(input);
  if (!parsed.success) {
    return err(parsed.error.issues[0]?.message ?? "Datos no válidos", "VALIDATION");
  }

  const { postId, toStatus, reason } = parsed.data;
  const changedBy = auth.data.userId;

  let txResult: {
    fromStatus: PostStatus;
    postTitle: string;
    changed: boolean;
  };

  try {
    txResult = await db.transaction(async (tx) => {
      const [post] = await tx
        .select({
          status: feedbackPosts.status,
          title: feedbackPosts.title,
        })
        .from(feedbackPosts)
        .where(eq(feedbackPosts.id, postId))
        .for("update")
        .limit(1);

      if (!post) throw new Error("Post not found");

      const fromStatus = post.status as PostStatus;

      if (fromStatus === toStatus) {
        return { fromStatus, postTitle: post.title, changed: false };
      }

      await tx
        .update(feedbackPosts)
        .set({ status: toStatus, updatedAt: new Date() })
        .where(eq(feedbackPosts.id, postId));

      await tx.insert(postStatusHistory).values({
        postId,
        changedBy,
        fromStatus,
        toStatus,
        reason: reason ?? null,
      });

      return { fromStatus, postTitle: post.title, changed: true };
    });
  } catch (e) {
    await captureError(e, { action: "changeStatus", postId });
    return err("Error al cambiar el estado", "INTERNAL");
  }

  if (!txResult.changed) {
    revalidatePath(`/ideas/${postId}`);
    return ok({ toStatus });
  }

  // Email fanout — best-effort, outside transaction
  try {
    const appOrigin = requireEnv("NEXT_PUBLIC_APP_URL");
    const postUrl = `${appOrigin}/ideas/${postId}`;
    const recipients: Array<{
      recipient: { id: string; email: string; displayName: string | null };
      isAuthor: boolean;
    }> = [];

    const author = await getPostAuthorRecipient(postId);
    const exclude: string[] = [changedBy];
    if (author && author.id !== changedBy) {
      recipients.push({ recipient: author, isAuthor: true });
      exclude.push(author.id);
    }

    const voters = await listVoterRecipients(postId, exclude);
    for (const v of voters) {
      recipients.push({ recipient: v, isAuthor: false });
    }

    await Promise.allSettled(
      recipients.map(async ({ recipient, isAuthor }) => {
        const unsubscribeUrl = await buildUnsubscribeUrl(recipient.id);
        const tpl = statusChangeEmail({
          recipientName: recipient.displayName,
          postTitle: txResult.postTitle,
          postUrl,
          fromStatus: txResult.fromStatus,
          toStatus,
          reason: reason ?? null,
          unsubscribeUrl,
          isAuthor,
        });
        await sendEmail({
          to: recipient.email,
          subject: tpl.subject,
          html: tpl.html,
          text: tpl.text,
          listUnsubscribeUrl: unsubscribeUrl,
        });
      })
    );
  } catch (e) {
    await captureError(e, { action: "changeStatus_email", postId });
  }

  revalidatePath(`/ideas/${postId}`);
  revalidatePath("/ideas");
  return ok({ toStatus });
}
