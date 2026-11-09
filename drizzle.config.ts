import type { Config } from "drizzle-kit";

export default {
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: process.env.WP_DB_URL ?? "file:./data/production.db",
  },
  verbose: true,
  strict: true,
} satisfies Config;
