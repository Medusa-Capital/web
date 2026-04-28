import { describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

import { transformAeroInput } from "@/scripts/sistema-medusa/seed-aero";
import { validateAnalysisFile } from "@/scripts/sistema-medusa/validate";

const rawAero = () =>
  JSON.parse(
    readFileSync(
      join(process.cwd(), "sistema-medusa/medusa-web-example-aero.json"),
      "utf8"
    )
  );

describe("validateAnalysisFile", () => {
  test("validates a canonical payload without touching the DB", () => {
    const payload = transformAeroInput(rawAero());
    const dir = mkdtempSync(join(tmpdir(), "sistema-medusa-validate-"));
    const filePath = join(dir, "aero.json");
    writeFileSync(filePath, JSON.stringify(payload, null, 2));

    expect(validateAnalysisFile(filePath)).toMatchObject({
      ok: true,
      action: "validated",
      ticker: "AERO",
    });
  });

  test("returns field-path errors for invalid payloads", () => {
    const payload = transformAeroInput(rawAero());
    payload.base_data.data_source_primary = "javascript:alert(1)";

    const dir = mkdtempSync(join(tmpdir(), "sistema-medusa-validate-"));
    const filePath = join(dir, "bad.json");
    writeFileSync(filePath, JSON.stringify(payload, null, 2));

    const result = validateAnalysisFile(filePath);
    expect(result).toMatchObject({ ok: false, action: "validated" });
    expect(result.errors).toContain("base_data.data_source_primary: https only");
  });
});
