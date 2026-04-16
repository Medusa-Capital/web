import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// WebSocket polyfill for Node.js (Vercel serverless functions). The browser
// global ws is auto-wired when present, but Node needs an explicit import.
neonConfig.webSocketConstructor = ws;

// Pool-backed driver supports transactions (required by the OAuth callback
// and webhook routes). All routes in this app run on the Node.js runtime.
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
export type Database = typeof db;
