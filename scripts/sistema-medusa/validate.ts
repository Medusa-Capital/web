import { existsSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { ZodError } from "zod";
import { analysisSchema } from "@/lib/sistema-medusa/schemas";

type ValidateResult =
  | {
      ok: true;
      action: "validated";
      ticker: string;
    }
  | {
      ok: false;
      action: "validated";
      errors: string[];
    };

export function validateAnalysisFile(inputPath: string): ValidateResult {
  try {
    const filePath = resolveInputPath(inputPath);
    const payload = analysisSchema.parse(
      JSON.parse(readFileSync(filePath, "utf8"))
    );

    return { ok: true, action: "validated", ticker: payload.ticker };
  } catch (error) {
    return {
      ok: false,
      action: "validated",
      errors: formatValidationError(error),
    };
  }
}

function formatValidationError(error: unknown): string[] {
  if (error instanceof ZodError) {
    return error.issues.map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "$";
      return `${path}: ${issue.message}`;
    });
  }

  return [error instanceof Error ? error.message : String(error)];
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
  const args = process.argv.slice(2);
  const asJson = args.includes("--json");
  const path = args.find((arg) => !arg.startsWith("--"));

  if (!path) {
    console.error("Usage: bun scripts/sistema-medusa/validate.ts <path> [--json]");
    process.exit(1);
  }

  const result = validateAnalysisFile(path);

  if (asJson) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.ok) {
    console.log(`validated: ${result.ticker}`);
  } else {
    console.error(result.errors.join("\n"));
  }

  if (!result.ok) process.exit(1);
}
