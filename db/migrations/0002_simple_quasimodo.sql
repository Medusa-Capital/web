CREATE SCHEMA "sistema_medusa";
--> statement-breakpoint
CREATE TYPE "public"."category" AS ENUM('DEX', 'AI_DEPIN', 'L1', 'L2', 'RESTAKING', 'RWA', 'PERPS');--> statement-breakpoint
CREATE TYPE "public"."chain" AS ENUM('Ethereum', 'Base', 'Solana', 'Arbitrum', 'Optimism', 'Bitcoin', 'Other');--> statement-breakpoint
CREATE TYPE "public"."confidence_level" AS ENUM('ALTA', 'MEDIA', 'BAJA');--> statement-breakpoint
CREATE TYPE "public"."filter_status" AS ENUM('VERDE', 'AMARILLO', 'ROJO');--> statement-breakpoint
CREATE TYPE "public"."ita_answer" AS ENUM('SI_CLARO', 'SI_CON_RESERVAS', 'NO');--> statement-breakpoint
CREATE TYPE "public"."pillar_status" AS ENUM('VERDE', 'AMARILLO', 'ROJO', 'NO_VERIFICABLE');--> statement-breakpoint
CREATE TYPE "public"."verdict" AS ENUM('AVANZA_A_AT', 'EN_REVISION', 'DESCARTE', 'AT_BLOQUEA', 'EN_CARTERA');--> statement-breakpoint
CREATE TABLE "sistema_medusa"."analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticker" text NOT NULL,
	"project_name" text NOT NULL,
	"chain" "chain" NOT NULL,
	"category" "category" NOT NULL,
	"contract_address" text,
	"coingecko_id" text,
	"defillama_slug" text,
	"latest_version_id" uuid,
	"current_verdict" "verdict",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sistema_medusa"."analysis_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"analysis_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"payload_schema_version" integer DEFAULT 1 NOT NULL,
	"methodology_version" text NOT NULL,
	"payload" jsonb NOT NULL,
	"payload_hash" text NOT NULL,
	"verdict" "verdict" NOT NULL,
	"data_date" date NOT NULL,
	"analysis_date" date NOT NULL,
	"revision_note" text,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"unpublished_at" timestamp with time zone,
	"created_by_user_id" uuid
);
--> statement-breakpoint
CREATE TABLE "sistema_medusa"."publish_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"analysis_id" uuid NOT NULL,
	"analysis_version_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"event_type" text NOT NULL,
	"verdict" text NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"dispatched_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "sistema_medusa"."analyses" ADD CONSTRAINT "analyses_latest_version_id_analysis_versions_id_fk" FOREIGN KEY ("latest_version_id") REFERENCES "sistema_medusa"."analysis_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sistema_medusa"."analysis_versions" ADD CONSTRAINT "analysis_versions_analysis_id_analyses_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "sistema_medusa"."analyses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sistema_medusa"."analysis_versions" ADD CONSTRAINT "analysis_versions_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sistema_medusa"."publish_events" ADD CONSTRAINT "publish_events_analysis_id_analyses_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "sistema_medusa"."analyses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sistema_medusa"."publish_events" ADD CONSTRAINT "publish_events_analysis_version_id_analysis_versions_id_fk" FOREIGN KEY ("analysis_version_id") REFERENCES "sistema_medusa"."analysis_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "analyses_ticker_idx" ON "sistema_medusa"."analyses" USING btree ("ticker");--> statement-breakpoint
CREATE INDEX "analyses_filter_idx" ON "sistema_medusa"."analyses" USING btree ("current_verdict","category","chain");--> statement-breakpoint
CREATE UNIQUE INDEX "analysis_versions_analysis_id_version_number_idx" ON "sistema_medusa"."analysis_versions" USING btree ("analysis_id","version_number");--> statement-breakpoint
CREATE INDEX "analysis_versions_analysis_id_version_number_desc_idx" ON "sistema_medusa"."analysis_versions" USING btree ("analysis_id","version_number" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "publish_events_analysis_id_idx" ON "sistema_medusa"."publish_events" USING btree ("analysis_id");--> statement-breakpoint
CREATE INDEX "publish_events_undispatched_idx" ON "sistema_medusa"."publish_events" USING btree ("dispatched_at") WHERE "sistema_medusa"."publish_events"."dispatched_at" is null;