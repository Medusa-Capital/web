import { sql, eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { feedbackPosts, users } from "@/db/schema";
import type { Sort, StatusFilter } from "./schemas";

// ---------------------------------------------------------------------------
// Types returned to the UI
// ---------------------------------------------------------------------------

export interface PostListItem {
  id: string;
  title: string;
  body: string;
  status: "open" | "planned" | "in_progress" | "shipped" | "declined";
  createdAt: Date;
  authorName: string | null;
  voteCount: number;
  hasVoted: boolean;
  commentCount: number;
}

export interface PostDetail extends PostListItem {
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// listPosts
// ---------------------------------------------------------------------------
// One round-trip: aggregate vote count + comment count + author + viewer's
// vote presence in a single query. Sorted by votes desc (default) or newest.
// Personalized via viewerId — never cache.
// ---------------------------------------------------------------------------

export async function listPosts(opts: {
  viewerId: string;
  sort: Sort;
  status: StatusFilter;
}): Promise<PostListItem[]> {
  const { viewerId, sort, status } = opts;

  const voteCount = sql<number>`(
    SELECT COUNT(*)::int FROM feedback.votes v WHERE v.post_id = ${feedbackPosts.id}
  )`.as("vote_count");

  const commentCount = sql<number>`(
    SELECT COUNT(*)::int FROM feedback.comments c WHERE c.post_id = ${feedbackPosts.id}
  )`.as("comment_count");

  const hasVoted = sql<boolean>`EXISTS (
    SELECT 1 FROM feedback.votes v
    WHERE v.post_id = ${feedbackPosts.id} AND v.user_id = ${viewerId}
  )`.as("has_voted");

  const rows = await db
    .select({
      id: feedbackPosts.id,
      title: feedbackPosts.title,
      body: feedbackPosts.body,
      status: feedbackPosts.status,
      createdAt: feedbackPosts.createdAt,
      authorName: users.displayName,
      voteCount,
      commentCount,
      hasVoted,
    })
    .from(feedbackPosts)
    .leftJoin(users, eq(users.id, feedbackPosts.authorId))
    .where(status === "all" ? undefined : eq(feedbackPosts.status, status))
    .orderBy(
      sort === "votes" ? desc(voteCount) : desc(feedbackPosts.createdAt),
      desc(feedbackPosts.createdAt)
    );

  return rows;
}

// ---------------------------------------------------------------------------
// getPost — detail view
// ---------------------------------------------------------------------------

export async function getPost(opts: {
  viewerId: string;
  postId: string;
}): Promise<PostDetail | null> {
  const { viewerId, postId } = opts;

  const voteCount = sql<number>`(
    SELECT COUNT(*)::int FROM feedback.votes v WHERE v.post_id = ${feedbackPosts.id}
  )`.as("vote_count");

  const commentCount = sql<number>`(
    SELECT COUNT(*)::int FROM feedback.comments c WHERE c.post_id = ${feedbackPosts.id}
  )`.as("comment_count");

  const hasVoted = sql<boolean>`EXISTS (
    SELECT 1 FROM feedback.votes v
    WHERE v.post_id = ${feedbackPosts.id} AND v.user_id = ${viewerId}
  )`.as("has_voted");

  const [row] = await db
    .select({
      id: feedbackPosts.id,
      title: feedbackPosts.title,
      body: feedbackPosts.body,
      status: feedbackPosts.status,
      createdAt: feedbackPosts.createdAt,
      updatedAt: feedbackPosts.updatedAt,
      authorName: users.displayName,
      voteCount,
      commentCount,
      hasVoted,
    })
    .from(feedbackPosts)
    .leftJoin(users, eq(users.id, feedbackPosts.authorId))
    .where(eq(feedbackPosts.id, postId))
    .limit(1);

  return row ?? null;
}

// ---------------------------------------------------------------------------
// findSimilarPosts — for ProposeIdeaModal autocomplete
// ---------------------------------------------------------------------------
// Caller MUST escape ILIKE wildcards (% _ \) before calling.
// Returns top 5 ordered by recency.
// ---------------------------------------------------------------------------

export async function findSimilarPosts(
  escapedQuery: string
): Promise<{ id: string; title: string; status: string }[]> {
  if (escapedQuery.length < 3) return [];

  return db
    .select({
      id: feedbackPosts.id,
      title: feedbackPosts.title,
      status: feedbackPosts.status,
    })
    .from(feedbackPosts)
    .where(sql`${feedbackPosts.title} ILIKE ${"%" + escapedQuery + "%"} ESCAPE '\\'`)
    .orderBy(desc(feedbackPosts.createdAt))
    .limit(5);
}

/**
 * Escape ILIKE metacharacters so user input is treated literally.
 * Use `ESCAPE '\\'` in the SQL.
 */
export function escapeIlike(input: string): string {
  return input.replace(/[%_\\]/g, "\\$&");
}
