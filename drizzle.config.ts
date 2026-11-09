import { defineConfig } from "drizzle-kit";

// Banco local: SQLite em arquivo (via libSQL).
// Migra??o futura para Supabase/Postgres: ver README-BACKEND.md
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: "file:./data/production.db" },
});
