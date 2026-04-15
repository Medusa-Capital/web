-- ---------------------------------------------------------------------------
-- CHECK constraints
-- Drizzle does not emit CHECK constraints from TypeScript schema definitions.
-- These mirror the Zod validation rules in the application layer and enforce
-- them at the DB level as defense-in-depth (direct SQL inserts, seeds, etc.)
-- ---------------------------------------------------------------------------

ALTER TABLE "feedback"."posts"
  ADD CONSTRAINT "posts_title_len" CHECK (char_length(title) BETWEEN 10 AND 100),
  ADD CONSTRAINT "posts_body_len"  CHECK (char_length(body) BETWEEN 50 AND 2000);

ALTER TABLE "feedback"."comments"
  ADD CONSTRAINT "comments_body_len" CHECK (char_length(body) BETWEEN 1 AND 5000);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- Belt-and-suspenders alongside Drizzle's .$onUpdate(() => new Date()).
-- The trigger fires on any UPDATE (including direct SQL), while .$onUpdate()
-- fires on ORM-mediated updates. Together they guarantee the column is always
-- current regardless of the update path.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON "users"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER posts_set_updated_at
  BEFORE UPDATE ON "feedback"."posts"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER user_tokens_set_updated_at
  BEFORE UPDATE ON "user_tokens"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
