import { Client } from "@notionhq/client";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

export function getNotionClient(): Client {
  if (!NOTION_API_KEY) {
    throw new Error("NOTION_API_KEY environment variable is not set");
  }
  return new Client({ auth: NOTION_API_KEY });
}

export function getDatabaseId(): string {
  if (!NOTION_DATABASE_ID) {
    throw new Error("NOTION_DATABASE_ID environment variable is not set");
  }
  return NOTION_DATABASE_ID;
}

export function isNotionConfigured(): boolean {
  return Boolean(NOTION_API_KEY && NOTION_DATABASE_ID);
}
