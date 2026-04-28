"use server";

import { and, eq, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { requireInternalCore } from "@/lib/auth/require";

export async function deleteAnalysis(ticker: string): Promise<void> {
  const auth = await requireInternalCore();
  if (!auth.ok) redirect("/login");

  const { db } = await import("@/db");
  const { analyses, analysisVersions, publishEvents } = await import(
    "@/db/schema"
  );

  await db.transaction(async (tx) => {
    const [parent] = await tx
      .select({ id: analyses.id })
      .from(analyses)
      .where(eq(analyses.ticker, ticker.toLowerCase()))
      .for("update")
      .limit(1);

    if (!parent) return;

    // Unpublish all active versions. The analysis_versions_refresh_current
    // trigger fires on each UPDATE and sets latest_version_id = NULL once no
    // published version remains.
    const activeVersions = await tx
      .select({
        id: analysisVersions.id,
        versionNumber: analysisVersions.versionNumber,
        verdict: analysisVersions.verdict,
      })
      .from(analysisVersions)
      .where(
        and(
          eq(analysisVersions.analysisId, parent.id),
          isNull(analysisVersions.unpublishedAt)
        )
      );

    for (const version of activeVersions) {
      await tx
        .update(analysisVersions)
        .set({ unpublishedAt: new Date() })
        .where(eq(analysisVersions.id, version.id));

      await tx.insert(publishEvents).values({
        analysisId: parent.id,
        analysisVersionId: version.id,
        versionNumber: version.versionNumber,
        eventType: "unpublished",
        verdict: version.verdict,
      });
    }
  });

  redirect("/sistema-medusa");
}
