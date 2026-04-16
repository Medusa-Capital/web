import { defineConfig } from "drizzle-kit";
import { readFileSync } from "fs";
import { resolve } from "path";

// drizzle-kit's subprocess doesn't inherit bun's .env.local loading.
// Parse and inject it manually so DATABASE_URL_UNPOOLED is available.
try {
  const envPath = resolve(process.cwd(), ".env.local");
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx < 1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (key && !(key in process.env)) {
      process.env[key] = val;
    }
  }
} catch {
  // .env.local is optional (CI sets env vars directly)
}

const dbUrl = process.env.DATABASE_URL_UNPOOLED;
if (!dbUrl && process.env.NODE_ENV !== "test") {
  // Only warn — don't throw since `generate` doesn't need the DB
  process.stderr.write(
    "[drizzle.config] DATABASE_URL_UNPOOLED is not set — `db:migrate` will fail\n"
  );
}

export default defineConfig({
  schema: "./db/schema/*",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl ?? "postgresql://localhost/placeholder",
  },
});
