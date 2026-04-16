import { z } from "zod";

// Title/body length bounds match the DB CHECK constraints exactly.
// Both layers enforce so direct SQL inserts (seeds, scripts) can't violate.

export const TITLE_MIN = 10;
export const TITLE_MAX = 100;
export const BODY_MIN = 50;
export const BODY_MAX = 2000;

export const CreatePostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(TITLE_MIN, `El título debe tener al menos ${TITLE_MIN} caracteres`)
    .max(TITLE_MAX, `El título no puede superar ${TITLE_MAX} caracteres`),
  body: z
    .string()
    .trim()
    .min(BODY_MIN, `La descripción debe tener al menos ${BODY_MIN} caracteres`)
    .max(BODY_MAX, `La descripción no puede superar ${BODY_MAX} caracteres`),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;

export const ToggleVoteSchema = z.object({
  postId: z.string().uuid(),
});

export type ToggleVoteInput = z.infer<typeof ToggleVoteSchema>;

export const SortSchema = z.enum(["votes", "newest"]).default("votes");
export type Sort = z.infer<typeof SortSchema>;

export const StatusFilterSchema = z
  .enum(["all", "open", "planned", "in_progress", "shipped", "declined"])
  .default("all");
export type StatusFilter = z.infer<typeof StatusFilterSchema>;

export const COMMENT_MIN = 1;
export const COMMENT_MAX = 5000;

export const AddCommentSchema = z.object({
  postId: z.string().uuid(),
  body: z
    .string()
    .trim()
    .min(COMMENT_MIN, "El comentario no puede estar vacío")
    .max(COMMENT_MAX, `El comentario no puede superar ${COMMENT_MAX} caracteres`),
});
export type AddCommentInput = z.infer<typeof AddCommentSchema>;

export const StatusEnum = z.enum([
  "open",
  "planned",
  "in_progress",
  "shipped",
  "declined",
]);

export const ChangeStatusSchema = z.object({
  postId: z.string().uuid(),
  toStatus: StatusEnum,
  reason: z.string().trim().max(2000).optional().nullable(),
});
export type ChangeStatusInput = z.infer<typeof ChangeStatusSchema>;
