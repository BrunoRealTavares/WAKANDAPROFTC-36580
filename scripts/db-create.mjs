// Fallback: cria todas as tabelas com SQL puro (scripts/sqlite-ddl.mjs).
// Uso: node scripts/db-create.mjs  (idempotente — CREATE IF NOT EXISTS)
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import { DDL } from "./sqlite-ddl.mjs";

const pasta = path.join(process.cwd(), "data");
fs.mkdirSync(pasta, { recursive: true });
const banco = process.env.WP_DB_NAME || "production.db";
const db = createClient({ url: "file:" + path.join(pasta, banco).split(path.sep).join("/") });
for (const sql of DDL) await db.execute(sql);
console.log("Tabelas criadas em", path.join(pasta, banco));
