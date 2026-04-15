import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Retry wrapper: 2 retries with exponential backoff + jitter on transient 5xx /
// connection errors. Keeps the DB client edge-safe (neon-http only — no Pool,
// no WebSocket, no Node-only imports).
neonConfig.fetchFunction = async (url: RequestInfo, init?: RequestInit) => {
  const MAX_RETRIES = 2;
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, init);
      // Retry on 5xx; surface everything else immediately (4xx are programmer errors)
      if (res.status >= 500 && attempt < MAX_RETRIES) {
        lastError = new Error(`Neon HTTP ${res.status}`);
        await sleep(100 * Math.pow(2, attempt) + Math.random() * 50);
        continue;
      }
      return res;
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES) {
        await sleep(100 * Math.pow(2, attempt) + Math.random() * 50);
      }
    }
  }

  throw lastError;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
export type Database = typeof db;
