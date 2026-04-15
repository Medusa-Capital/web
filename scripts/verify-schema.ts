/**
 * One-shot schema verification script. Run after migrations to confirm:
 * - All expected tables exist in the correct schemas
 * - pgEnums are created and reject invalid values
 * - CHECK constraints are in place
 * - updated_at triggers are installed
 *
 * Usage: bun scripts/verify-schema.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local (same trick as drizzle.config.ts)
try {
  const lines = readFileSync(resolve(process.cwd(), ".env.local"), "utf8").split("\n");
  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 1) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim();
    if (k && !(k in process.env)) process.env[k] = v;
  }
} catch { /* .env.local optional in CI */ }

import pkg from "pg";
const { Client } = pkg;

const dbUrl = process.env.DATABASE_URL_UNPOOLED;
if (!dbUrl) { console.error("DATABASE_URL_UNPOOLED not set"); process.exit(1); }

const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

async function main() {
  await client.connect();
  let pass = true;

  // --- Tables ---
  const expectedTables = [
    "public.users",
    "public.sessions",
    "public.user_tokens",
    "feedback.posts",
    "feedback.votes",
    "feedback.comments",
    "feedback.post_status_history",
  ];
  const { rows: tableRows } = await client.query(`
    SELECT schemaname || '.' || tablename AS fqn
    FROM pg_tables WHERE schemaname IN ('public', 'feedback')
    ORDER BY fqn
  `);
  const tables = new Set(tableRows.map((r: { fqn: string }) => r.fqn));
  console.log("\n=== Tables ===");
  for (const t of expectedTables) {
    const ok = tables.has(t);
    console.log(`  ${ok ? "✓" : "✗"} ${t}`);
    if (!ok) pass = false;
  }

  // --- Enums ---
  console.log("\n=== Enums ===");
  const { rows: enumRows } = await client.query(`
    SELECT typname, array_agg(enumlabel ORDER BY enumsortorder) AS labels
    FROM pg_type JOIN pg_enum ON pg_type.oid = enumtypid
    GROUP BY typname ORDER BY typname
  `);
  for (const r of enumRows) {
    const labels = Array.isArray(r.labels) ? r.labels.join(", ") : String(r.labels);
    console.log(`  ✓ ${r.typname}: ${labels}`);
  }
  if (enumRows.length === 0) { console.log("  ✗ no enums found"); pass = false; }

  // Verify pgEnum rejects bad value
  try {
    await client.query(`INSERT INTO users (external_id, provider, email, role)
      VALUES ('__verify__', 'whop', 'verify@test.com', 'superadmin')`);
    console.log("  ✗ pgEnum did NOT reject role='superadmin'");
    pass = false;
    await client.query(`DELETE FROM users WHERE external_id = '__verify__'`);
  } catch {
    console.log("  ✓ pgEnum correctly rejected role='superadmin'");
  }

  // --- CHECK constraints ---
  console.log("\n=== CHECK constraints ===");
  const { rows: checks } = await client.query(`
    SELECT conname FROM pg_constraint WHERE contype = 'c'
    AND connamespace NOT IN (SELECT oid FROM pg_namespace WHERE nspname = 'pg_catalog')
    ORDER BY conname
  `);
  const checkNames = new Set(checks.map((r: { conname: string }) => r.conname));
  const expectedChecks = ["posts_title_len", "posts_body_len", "comments_body_len"];
  for (const c of expectedChecks) {
    const ok = checkNames.has(c);
    console.log(`  ${ok ? "✓" : "✗"} ${c}`);
    if (!ok) pass = false;
  }

  // Verify CHECK actually rejects short title
  try {
    await client.query(`INSERT INTO feedback.posts (title, body)
      VALUES ('short', 'this body is long enough to pass the 50 character check constraint minimum')`);
    console.log("  ✗ posts_title_len did NOT reject short title");
    pass = false;
  } catch {
    console.log("  ✓ posts_title_len correctly rejected short title");
  }

  // --- Triggers ---
  console.log("\n=== Triggers ===");
  const { rows: triggers } = await client.query(`
    SELECT trigger_name, event_object_table FROM information_schema.triggers
    WHERE trigger_schema IN ('public', 'feedback')
    ORDER BY trigger_name
  `);
  const expectedTriggers = ["users_set_updated_at", "posts_set_updated_at", "user_tokens_set_updated_at"];
  const triggerNames = new Set(triggers.map((r: { trigger_name: string }) => r.trigger_name));
  for (const trig of expectedTriggers) {
    const ok = triggerNames.has(trig);
    console.log(`  ${ok ? "✓" : "✗"} ${trig}`);
    if (!ok) pass = false;
  }

  await client.end();

  console.log(`\n${pass ? "✅ All checks passed" : "❌ Some checks failed"}`);
  process.exit(pass ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
