import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Dados vivem em data/ (PRIVADO ? nunca em public/). Cria a pasta se faltar.
const PASTA_DADOS = path.join(process.cwd(), "data");
fs.mkdirSync(PASTA_DADOS, { recursive: true });

const ARQUIVO_DB = path.join(PASTA_DADOS, process.env.WP_DB_NAME ?? "production.db");
const URL_DB = "file:" + ARQUIVO_DB.split(path.sep).join("/");

const client = createClient({ url: URL_DB });

export const db = drizzle(client, { schema });
export { schema };
