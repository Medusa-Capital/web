import { describe, expect, test } from "bun:test";
import { execFile } from "child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { promisify } from "util";

import { transformAeroInput } from "@/scripts/sistema-medusa/seed-aero";

const execFileAsync = promisify(execFile);

const rawAero = () =>
  JSON.parse(
    readFileSync(
      join(process.cwd(), "sistema-medusa/medusa-web-example-aero.json"),
      "utf8"
    )
  );

function envWithLocal() {
  const env = { ...process.env };
  const local = readFileSync(join(process.cwd(), ".env.local"), "utf8");
  for (const line of local.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex < 1) continue;
    env[trimmed.slice(0, eqIndex).trim()] = trimmed.slice(eqIndex + 1).trim();
  }
  return env;
}

describe("Sistema Medusa CLI --json output", () => {
  test("validate emits structured JSON", async () => {
    const payload = transformAeroInput(rawAero());
    const dir = mkdtempSync(join(tmpdir(), "sistema-medusa-cli-json-"));
    const filePath = join(dir, "aero.json");
    writeFileSync(filePath, JSON.stringify(payload, null, 2));

    const { stdout } = await execFileAsync(
      "bun",
      ["scripts/sistema-medusa/validate.ts", filePath, "--json"],
      { cwd: process.cwd(), env: envWithLocal() }
    );

    expect(JSON.parse(stdout)).toMatchObject({
      ok: true,
      action: "validated",
      ticker: "AERO",
    });
  });

  test("ingest dry-run emits structured JSON", async () => {
    const payload = transformAeroInput(rawAero());
    payload.ticker = `J${Date.now().toString(36).toUpperCase()}`;

    const dir = mkdtempSync(join(tmpdir(), "sistema-medusa-cli-json-"));
    const filePath = join(dir, `${payload.ticker.toLowerCase()}.json`);
    writeFileSync(filePath, JSON.stringify(payload, null, 2));

    const { stdout } = await execFileAsync(
      "bun",
      ["scripts/sistema-medusa/ingest.ts", filePath, "--dry-run", "--json"],
      { cwd: process.cwd(), env: envWithLocal() }
    );

    expect(JSON.parse(stdout)).toMatchObject({
      ok: true,
      action: "validated",
      ticker: payload.ticker,
      version_number: 1,
    });
  });

  test("unpublish failures emit structured JSON and non-zero exit", async () => {
    try {
      await execFileAsync(
        "bun",
        ["scripts/sistema-medusa/unpublish.ts", "NOPE", "1", "--json"],
        { cwd: process.cwd(), env: envWithLocal() }
      );
      throw new Error("Expected unpublish CLI to fail");
    } catch (error) {
      const stdout = (error as { stdout: string }).stdout;
      expect(JSON.parse(stdout)).toMatchObject({
        ok: false,
        errors: ["Analysis not found: NOPE"],
      });
    }
  });
});
