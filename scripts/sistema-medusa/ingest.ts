import { createHash } from "crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  statSync,
} from "fs";
import { dirname, join, resolve, sep } from "path";
import { and, desc, eq, isNull } from "drizzle-orm";
import { canonicalize } from "@/lib/sistema-medusa/canonicalize";
import { analysisSchema, type Analysis } from "@/lib/sistema-medusa/schemas";

const MAX_FILE_BYTES = 1024 * 1024;

type IngestAction =
  | "created"
  | "noop"
  | "force_created"
  | "created_archive_failed"
  | "archive_recovered"
  | "validated";

type IngestOptions = {
  force?: boolean;
  dryRun?: boolean;
};

export type IngestSuccess = {
  ok: true;
  action: Exclude<IngestAction, "created_archive_failed">;
  ticker: string;
  version_number: number;
  payload_hash: string;
  diff?: string[];
};

export type IngestFailure = {
  ok: false;
  action: "created_archive_failed";
  ticker: string;
  version_number: number;
  payload_hash: string;
  error: string;
};

export type IngestResult = IngestSuccess | IngestFailure;

export async function ingestAnalysis(
  inputPath: string,
  options: IngestOptions = {}
): Promise<IngestResult> {
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

  if (options.dryRun) {
    return dryRunIngest(payload, payloadHash, analyses, analysisVersions);
  }

  const txResult = await db.transaction(async (tx) => {
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
        id: analysisVersions.id,
        versionNumber: analysisVersions.versionNumber,
        payloadHash: analysisVersions.payloadHash,
        verdict: analysisVersions.verdict,
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

    if (latestPublished?.payloadHash === payloadHash && !options.force) {
      return {
        ok: true,
        action: "noop",
        ticker: payload.ticker,
        version_number: latestPublished.versionNumber,
        payload_hash: payloadHash,
      };
    }

    const forceSupersededVersion =
      options.force && latestPublished?.payloadHash === payloadHash
        ? latestPublished
        : null;

    if (forceSupersededVersion) {
      await tx
        .update(analysisVersions)
        .set({ unpublishedAt: new Date() })
        .where(eq(analysisVersions.id, forceSupersededVersion.id));

      await tx.insert(publishEvents).values({
        analysisId: locked.id,
        analysisVersionId: forceSupersededVersion.id,
        versionNumber: forceSupersededVersion.versionNumber,
        eventType: "superseded",
        verdict: forceSupersededVersion.verdict,
      });
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
      action: forceSupersededVersion ? "force_created" : "created",
      ticker: payload.ticker,
      version_number: versionNumber,
      payload_hash: payloadHash,
    } satisfies IngestSuccess;
  });

  return archiveInboxFile(filePath, txResult);
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

function archiveInboxFile(filePath: string, result: IngestSuccess): IngestResult {
  const paths = archivePaths(filePath, result.ticker, result.version_number);
  if (!paths) return result;

  if (existsSync(paths.destination)) {
    return result;
  }

  if (!existsSync(paths.source)) {
    return result;
  }

  try {
    mkdirSync(dirname(paths.destination), { recursive: true });
    renameSync(paths.source, paths.destination);

    if (result.action === "noop") {
      return { ...result, action: "archive_recovered" };
    }

    return result;
  } catch (error) {
    return {
      ok: false,
      action: "created_archive_failed",
      ticker: result.ticker,
      version_number: result.version_number,
      payload_hash: result.payload_hash,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function archivePaths(filePath: string, ticker: string, versionNumber: number) {
  const inboxRoot = resolve(process.cwd(), "content/sistema-medusa/inbox");
  const source = resolve(filePath);
  const inboxPrefix = `${inboxRoot}${sep}`;

  if (!source.startsWith(inboxPrefix)) return null;

  return {
    source,
    destination: resolve(
      process.cwd(),
      "content/sistema-medusa/published",
      ticker.toLowerCase(),
      `v${versionNumber}.json`
    ),
  };
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const asJson = args.includes("--json");
  const path = args.find((arg) => !arg.startsWith("--"));
  if (!path) {
    console.error("Usage: bun scripts/sistema-medusa/ingest.ts <path> [--force]");
    process.exit(1);
  }

  try {
    const result = await ingestAnalysis(path, {
      force: args.includes("--force"),
      dryRun: args.includes("--dry-run"),
    });
    if (!result.ok) {
      if (asJson) {
        console.log(JSON.stringify({ ...result, errors: [result.error] }, null, 2));
      } else {
        console.error(
          `${result.action}: ${result.ticker} v${result.version_number} (${result.error})`
        );
      }
      process.exit(1);
    }

    if (asJson) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(
        `${result.action}: ${result.ticker} v${result.version_number} (${result.payload_hash})`
      );
    }
    process.exit(0);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (asJson) {
      console.log(JSON.stringify({ ok: false, errors: [message] }, null, 2));
    } else {
      console.error(message);
    }
    process.exit(1);
  }
}

async function dryRunIngest(
  payload: Analysis,
  payloadHash: string,
  tables: typeof import("@/db/schema").analyses,
  versionTable: typeof import("@/db/schema").analysisVersions
): Promise<IngestSuccess> {
  const { db } = await import("@/db");

  const [parent] = await db
    .select({ id: tables.id })
    .from(tables)
    .where(eq(tables.ticker, payload.ticker))
    .limit(1);

  if (!parent) {
    return {
      ok: true,
      action: "validated",
      ticker: payload.ticker,
      version_number: 1,
      payload_hash: payloadHash,
      diff: ["new analysis"],
    };
  }

  const [latest] = await db
    .select({
      versionNumber: versionTable.versionNumber,
      payloadHash: versionTable.payloadHash,
      payload: versionTable.payload,
    })
    .from(versionTable)
    .where(
      and(eq(versionTable.analysisId, parent.id), isNull(versionTable.unpublishedAt))
    )
    .orderBy(desc(versionTable.versionNumber))
    .limit(1);

  if (!latest) {
    return {
      ok: true,
      action: "validated",
      ticker: payload.ticker,
      version_number: 1,
      payload_hash: payloadHash,
      diff: ["new analysis"],
    };
  }

  if (latest.payloadHash === payloadHash) {
    return {
      ok: true,
      action: "validated",
      ticker: payload.ticker,
      version_number: latest.versionNumber,
      payload_hash: payloadHash,
      diff: [],
    };
  }

  const latestPayload = analysisSchema.parse(latest.payload);

  return {
    ok: true,
    action: "validated",
    ticker: payload.ticker,
    version_number: latest.versionNumber + 1,
    payload_hash: payloadHash,
    diff: diffPaths(latestPayload, payload),
  };
}

function diffPaths(left: unknown, right: unknown, path = ""): string[] {
  if (canonicalize(left) === canonicalize(right)) return [];

  if (isPlainObject(left) && isPlainObject(right)) {
    const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
    return [...keys].flatMap((key) => {
      const childPath = path ? `${path}.${key}` : key;
      return diffPaths(left[key], right[key], childPath);
    });
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    const max = Math.max(left.length, right.length);
    return Array.from({ length: max }).flatMap((_, index) => {
      return diffPaths(left[index], right[index], `${path}[]`);
    });
  }

  return [path || "$"];
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
