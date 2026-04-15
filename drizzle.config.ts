import { defineConfig } from "drizzle-kit";

// DATABASE_URL_UNPOOLED is only required for `drizzle-kit migrate` (direct
// connection to Neon). `drizzle-kit generate` only reads schema files and
// does not connect to the database.
export default defineConfig({
  schema: "./db/schema/*",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED ?? "postgresql://localhost/placeholder",
  },
});
