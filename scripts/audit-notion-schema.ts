// scripts/audit-notion-schema.ts
//
// Audits the Notion database schema to identify unused, duplicated,
// or inconsistent properties. Run this before cleaning up the DB.
//
// Usage:
//   bun scripts/audit-notion-schema.ts
//   # or without bun:
//   npx tsx scripts/audit-notion-schema.ts
//
// Requires NOTION_API_KEY and NOTION_DATABASE_ID in .env.local
//
// Output:
//   1. Every property in the database (name, type, select/multi_select options)
//   2. Sample data from 10 pages (all statuses) to see what's actually populated
//
// After running, compare the output against the properties used by sync-notion.ts:
//   Nombre, Slug, Descripción, Fecha Publicación, Responsable,
//   Status, Tags, Category, Type, Featured, (page cover)

import { getNotionClient, getDatabaseId } from "../lib/notion";

async function auditSchema() {
  const notion = getNotionClient();
  const databaseId = getDatabaseId();

  const db = await notion.databases.retrieve({ database_id: databaseId });

  // --- Section 1: Full property list ---
  console.log("=== ALL PROPERTIES ===\n");

  const properties = (db as Record<string, unknown>).properties as Record<
    string,
    Record<string, unknown>
  >;

  const sorted = Object.entries(properties).sort(([a], [b]) => a.localeCompare(b));

  for (const [name, prop] of sorted) {
    console.log(`Property: "${name}"`);
    console.log(`  Type: ${prop.type}`);

    if (prop.type === "select" && prop.select) {
      const sel = prop.select as { options: Array<{ name: string; color: string }> };
      console.log(`  Options: ${sel.options.map((o) => `"${o.name}" (${o.color})`).join(", ")}`);
    }
    if (prop.type === "multi_select" && prop.multi_select) {
      const ms = prop.multi_select as { options: Array<{ name: string; color: string }> };
      console.log(`  Options: ${ms.options.map((o) => `"${o.name}" (${o.color})`).join(", ")}`);
    }
    if (prop.type === "relation" && prop.relation) {
      const rel = prop.relation as { database_id: string };
      console.log(`  Related DB: ${rel.database_id}`);
    }
    if (prop.type === "formula" && prop.formula) {
      const f = prop.formula as { expression: string };
      console.log(`  Expression: ${f.expression}`);
    }
    if (prop.type === "rollup" && prop.rollup) {
      console.log(`  Rollup config: ${JSON.stringify(prop.rollup)}`);
    }
    console.log("");
  }

  // --- Section 2: Sample page data ---
  console.log("\n=== SAMPLE DATA (10 pages, all statuses) ===");

  const pages = await notion.databases.query({
    database_id: databaseId,
    page_size: 10,
  });

  for (const page of pages.results) {
    const p = (page as Record<string, unknown>).properties as Record<
      string,
      Record<string, unknown>
    >;

    // Print the title first for readability
    const titleProp = Object.entries(p).find(([, v]) => v.type === "title");
    const titleText = titleProp
      ? (titleProp[1].title as Array<{ plain_text: string }>)
          ?.map((t) => t.plain_text)
          .join("") || "(untitled)"
      : "(no title prop)";
    console.log(`\n--- "${titleText}" ---`);

    for (const [name, prop] of Object.entries(p).sort(([a], [b]) => a.localeCompare(b))) {
      const type = prop.type as string;
      let value: string;

      switch (type) {
        case "title": {
          const arr = prop.title as Array<{ plain_text: string }>;
          value = arr?.map((t) => t.plain_text).join("") || "(empty)";
          break;
        }
        case "rich_text": {
          const arr = prop.rich_text as Array<{ plain_text: string }>;
          value = arr?.map((t) => t.plain_text).join("") || "(empty)";
          break;
        }
        case "select": {
          const sel = prop.select as { name: string } | null;
          value = sel?.name || "(empty)";
          break;
        }
        case "multi_select": {
          const ms = prop.multi_select as Array<{ name: string }>;
          value = ms?.map((o) => o.name).join(", ") || "(empty)";
          break;
        }
        case "date": {
          const d = prop.date as { start: string } | null;
          value = d?.start || "(empty)";
          break;
        }
        case "checkbox":
          value = String(prop.checkbox);
          break;
        case "people": {
          const ppl = prop.people as Array<{ name?: string }>;
          value = ppl?.map((person) => person.name || "unknown").join(", ") || "(empty)";
          break;
        }
        case "number":
          value = String(prop.number ?? "(empty)");
          break;
        case "url":
          value = (prop.url as string) || "(empty)";
          break;
        case "email":
          value = (prop.email as string) || "(empty)";
          break;
        case "phone_number":
          value = (prop.phone_number as string) || "(empty)";
          break;
        case "formula":
          value = JSON.stringify(prop.formula);
          break;
        case "relation": {
          const rel = prop.relation as Array<{ id: string }>;
          value = rel?.length ? `${rel.length} relation(s)` : "(empty)";
          break;
        }
        case "rollup":
          value = JSON.stringify(prop.rollup);
          break;
        case "created_time":
          value = prop.created_time as string;
          break;
        case "last_edited_time":
          value = prop.last_edited_time as string;
          break;
        case "created_by":
          value = JSON.stringify(prop.created_by);
          break;
        case "last_edited_by":
          value = JSON.stringify(prop.last_edited_by);
          break;
        case "files": {
          const files = prop.files as Array<{ name: string }>;
          value = files?.map((f) => f.name).join(", ") || "(empty)";
          break;
        }
        case "status": {
          const st = prop.status as { name: string } | null;
          value = st?.name || "(empty)";
          break;
        }
        default:
          value = `(${type})`;
      }
      console.log(`  ${name} [${type}]: ${value}`);
    }
  }
}

auditSchema().catch(console.error);
