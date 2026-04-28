import { and, eq, isNull } from "drizzle-orm";

type UnpublishOptions = {
  reason?: string;
};

export type UnpublishResult = {
  ok: true;
  action: "unpublished";
  ticker: string;
  version_number: number;
  reason?: string;
};

export async function unpublishAnalysis(
  ticker: string,
  versionNumber: number,
  options: UnpublishOptions = {}
): Promise<UnpublishResult> {
  const { db } = await import("@/db");
  const { analyses, analysisVersions, publishEvents } = await import("@/db/schema");

  return db.transaction(async (tx) => {
    const [parent] = await tx
      .select({ id: analyses.id })
      .from(analyses)
      .where(eq(analyses.ticker, ticker))
      .for("update")
      .limit(1);

    if (!parent) throw new Error(`Analysis not found: ${ticker}`);

    const [version] = await tx
      .select({
        id: analysisVersions.id,
        verdict: analysisVersions.verdict,
      })
      .from(analysisVersions)
      .where(
        and(
          eq(analysisVersions.analysisId, parent.id),
          eq(analysisVersions.versionNumber, versionNumber),
          isNull(analysisVersions.unpublishedAt)
        )
      )
      .for("update")
      .limit(1);

    if (!version) {
      throw new Error(`Published version not found: ${ticker} v${versionNumber}`);
    }

    await tx
      .update(analysisVersions)
      .set({ unpublishedAt: new Date() })
      .where(eq(analysisVersions.id, version.id));

    await tx.insert(publishEvents).values({
      analysisId: parent.id,
      analysisVersionId: version.id,
      versionNumber,
      eventType: "unpublished",
      verdict: version.verdict,
    });

    return {
      ok: true,
      action: "unpublished",
      ticker,
      version_number: versionNumber,
      ...(options.reason ? { reason: options.reason } : {}),
    };
  });
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const asJson = args.includes("--json");
  const reasonIndex = args.indexOf("--reason");
  const reason = reasonIndex >= 0 ? args[reasonIndex + 1] : undefined;
  const positional = args.filter((arg, index) => {
    if (arg.startsWith("--")) return false;
    if (reasonIndex >= 0 && index === reasonIndex + 1) return false;
    return true;
  });
  const [ticker, version] = positional;

  if (!ticker || !version) {
    console.error(
      "Usage: bun scripts/sistema-medusa/unpublish.ts <ticker> <version> [--reason \"...\"] [--json]"
    );
    process.exit(1);
  }

  try {
    const result = await unpublishAnalysis(ticker.toUpperCase(), Number(version), {
      reason,
    });
    console.log(asJson ? JSON.stringify(result, null, 2) : `unpublished: ${ticker} v${version}`);
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
