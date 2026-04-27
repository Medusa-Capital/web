-- ---------------------------------------------------------------------------
-- Sistema Medusa manual constraints, search index, read view, and triggers
-- Drizzle emits the base schema in 0002. Keep JSONB payload shape validation in
-- Zod; this migration only targets real database columns and structural reads.
-- ---------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "analyses_search_trgm_idx"
  ON "sistema_medusa"."analyses"
  USING gin (lower(ticker || ' ' || project_name) gin_trgm_ops);

CREATE UNIQUE INDEX "analysis_versions_active_payload_hash_idx"
  ON "sistema_medusa"."analysis_versions" ("analysis_id", "payload_hash")
  WHERE "unpublished_at" IS NULL;

ALTER TABLE "sistema_medusa"."analyses"
  ADD CONSTRAINT "analyses_ticker_format"
    CHECK (ticker ~ '^[A-Z0-9]+$' AND char_length(ticker) BETWEEN 1 AND 20);

ALTER TABLE "sistema_medusa"."analysis_versions"
  ADD CONSTRAINT "analysis_versions_methodology_version_format"
    CHECK (methodology_version ~ '^V[0-9]+(\.[0-9]+)?(-[a-zA-Z]+)?$'),
  ADD CONSTRAINT "analysis_versions_revision_note_len"
    CHECK (revision_note IS NULL OR char_length(revision_note) <= 500);

CREATE VIEW "sistema_medusa"."published_versions" AS
  SELECT *
  FROM "sistema_medusa"."analysis_versions"
  WHERE "unpublished_at" IS NULL;

CREATE OR REPLACE FUNCTION "sistema_medusa"."refresh_analysis_current"()
RETURNS trigger AS $$
DECLARE
  v_id uuid;
  v_verdict public.verdict;
BEGIN
  SELECT id, verdict INTO v_id, v_verdict
    FROM "sistema_medusa"."analysis_versions"
   WHERE analysis_id = COALESCE(NEW.analysis_id, OLD.analysis_id)
     AND unpublished_at IS NULL
   ORDER BY version_number DESC
   LIMIT 1;

  UPDATE "sistema_medusa"."analyses"
     SET latest_version_id = v_id,
         current_verdict = v_verdict,
         updated_at = now()
   WHERE id = COALESCE(NEW.analysis_id, OLD.analysis_id);

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "analysis_versions_refresh_current"
AFTER INSERT OR UPDATE OF unpublished_at ON "sistema_medusa"."analysis_versions"
FOR EACH ROW EXECUTE FUNCTION "sistema_medusa"."refresh_analysis_current"();
