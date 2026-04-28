import { createHash } from "crypto";
import { existsSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { and, desc, eq, isNull } from "drizzle-orm";
import { canonicalize } from "@/lib/sistema-medusa/canonicalize";
import { analysisSchema, type Analysis } from "@/lib/sistema-medusa/schemas";

const MAX_FILE_BYTES = 1024 * 1024;

type IngestAction = "created" | "noop";

export type IngestResult = {
  ok: true;
  action: IngestAction;
  ticker: string;
  version_number: number;
  payload_hash: string;
};

export async function ingestAnalysis(inputPath: string): Promise<IngestResult> {
  const filePath = resolveInputPath(inputPath);
  const stat = statSync(filePath);
  if (stat.size > MAX_FILE_BYTES) {
    throw new Error("Sistema Medusa payload exceeds 1MB");
  }

  const payload = analysisSchema.parse(
    JSON.parse(readFileSync(filePath, "utf8"))
  );
  const payloadHash = sha256(canonicalize(payload));
  const { db } = await import("@/db");
  const { analyses, analysisVersions, publishEvents } = await import("@/db/schema");

  return db.transaction(async (tx) => {
    const [upserted] = await tx
      .insert(analyses)
      .values(parentValues(payload))
      .onConflictDoUpdate({
        target: analyses.ticker,
        set: {
          projectName: payload.project_name,
          chain: payload.chain,
          category: payload.category,
          contractAddress: payload.contract_address ?? null,
          updatedAt: new Date(),
        },
      })
      .returning({ id: analyses.id });

    if (!upserted) throw new Error("Analysis upsert returned no row");

    const [locked] = await tx
      .select({ id: analyses.id })
      .from(analyses)
      .where(eq(analyses.id, upserted.id))
      .for("update")
      .limit(1);

    if (!locked) throw new Error("Analysis lock returned no row");

    const [latestPublished] = await tx
      .select({
        versionNumber: analysisVersions.versionNumber,
        payloadHash: analysisVersions.payloadHash,
      })
      .from(analysisVersions)
      .where(
        and(
          eq(analysisVersions.analysisId, locked.id),
          isNull(analysisVersions.unpublishedAt)
        )
      )
      .orderBy(desc(analysisVersions.versionNumber))
      .limit(1);

    if (latestPublished?.payloadHash === payloadHash) {
      return {
        ok: true,
        action: "noop",
        ticker: payload.ticker,
        version_number: latestPublished.versionNumber,
        payload_hash: payloadHash,
      };
    }

    const [latestVersion] = await tx
      .select({ versionNumber: analysisVersions.versionNumber })
      .from(analysisVersions)
      .where(eq(analysisVersions.analysisId, locked.id))
      .orderBy(desc(analysisVersions.versionNumber))
      .limit(1);

    const versionNumber = (latestVersion?.versionNumber ?? 0) + 1;

    const [version] = await tx
      .insert(analysisVersions)
      .values({
        analysisId: locked.id,
        versionNumber,
        payloadSchemaVersion: 1,
        methodologyVersion: payload.methodology_version,
        payload: payload as unknown as Record<string, unknown>,
        payloadHash,
        verdict: payload.verdict,
        dataDate: payload.base_data.data_date,
        analysisDate: payload.analysis_date,
      })
      .returning({ id: analysisVersions.id });

    if (!version) throw new Error("Version insert returned no row");

    await tx.insert(publishEvents).values({
      analysisId: locked.id,
      analysisVersionId: version.id,
      versionNumber,
      eventType: "published",
      verdict: payload.verdict,
    });

    return {
      ok: true,
      action: "created",
      ticker: payload.ticker,
      version_number: versionNumber,
      payload_hash: payloadHash,
    };
  });
}

function parentValues(payload: Analysis) {
  return {
    ticker: payload.ticker,
    projectName: payload.project_name,
    chain: payload.chain,
    category: payload.category,
    contractAddress: payload.contract_address ?? null,
  };
}

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

function resolveInputPath(inputPath: string): string {
  const stat = statSync(inputPath);
  if (stat.isFile()) return inputPath;

  const entries = [
    join(inputPath, `${inputPath.split("/").at(-1)}.json`),
    join(inputPath, "analysis.json"),
  ];
  const match = entries.find((entry) => existsSync(entry));
  if (match) return match;

  throw new Error(`No Sistema Medusa JSON found at ${inputPath}`);
}

if (import.meta.main) {
  const path = process.argv[2];
  if (!path) {
    console.error("Usage: bun scripts/sistema-medusa/ingest.ts <path>");
    process.exit(1);
  }

  try {
    const result = await ingestAnalysis(path);
    console.log(
      `${result.action}: ${result.ticker} v${result.version_number} (${result.payload_hash})`
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
