"use server";

import { revalidatePath } from "next/cache";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { feedbackPosts, feedbackVotes } from "@/db/schema";
import { requireMemberCore } from "@/lib/auth/require";
import { assertSameOrigin } from "@/lib/csrf";
import { CreatePostSchema, ToggleVoteSchema } from "@/lib/feedback/schemas";
import { ok, err, type ActionResult } from "@/lib/result";
import { captureError } from "@/lib/logger";

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
