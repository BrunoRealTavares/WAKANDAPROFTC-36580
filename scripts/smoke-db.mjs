// Smoke test do esquema: banco TEMPORÁRIO data/smoke.db (criado e APAGADO ao final).
// Rode: npm run smoke-db  (ou node scripts/smoke-db.mjs)
import fs from "node:fs";
import path from "node:path";
import { scryptSync, randomBytes } from "node:crypto";
import { createClient } from "@libsql/client";
import { DDL } from "./sqlite-ddl.mjs";

const pasta = path.join(process.cwd(), "data");
fs.mkdirSync(pasta, { recursive: true });
const arq = path.join(pasta, "smoke.db");
try { fs.rmSync(arq, { force: true }); } catch {}
const db = createClient({ url: "file:" + arq.split(path.sep).join("/") });

const hash = (() => {
  const salt = randomBytes(16);
  return `hashgrip:${salt.toString("hex")}:${scryptSync("x", salt, 64).toString("hex")}`;
})();

let codigo = 0;
try {
  for (const sql of DDL) await db.execute(sql);
  await db.execute({ sql: "INSERT INTO users (nome,email,senha_hash,papel) VALUES (?,?,?,'admin')", args: ["Alice", "alice@x", hash] });
  await db.execute({ sql: "INSERT INTO events (titulo,tipo,inicio,criado_por_id) VALUES (?,?,unixepoch(),'1')", args: ["Treino", "treino"] });
  await db.execute({ sql: "INSERT INTO tasks (titulo,categoria,status,criado_por_id) VALUES (?,?, 'pendente','1')", args: ["Chassi", "engenharia"] });
  await db.execute({ sql: "INSERT INTO attendance (event_id,user_id,presente) VALUES (1,1,1)", args: [] });
  await db.execute({ sql: "INSERT INTO documents (titulo,arquivo_nome,arquivo_path,enviado_por_id) VALUES (?,?,?,'1')", args: ["Doc", "a.pdf", "uploads/a.pdf"] });
  await db.execute({ sql: "INSERT INTO inventory_items (nome,quantidade,minimo) VALUES (?,?,?)", args: ["Parafuso M3", 2, 10] });
  const tarefas = await db.execute("SELECT COUNT(*) AS n FROM tasks");
  const eventos = await db.execute("SELECT COUNT(*) AS n FROM events");
  const itens = await db.execute("SELECT COUNT(*) AS n FROM inventory_items");
  if (Number(tarefas.rows[0].n) !== 1 || Number(eventos.rows[0].n) !== 1 || Number(itens.rows[0].n) !== 1) {
    throw new Error("Contagem inesperada no smoke test");
  }
  console.log("OK");
} catch (e) {
  console.error("SMOKE FALHOU:", e?.message || e);
  codigo = 1;
} finally {
  try { db.close?.(); } catch {}
  try { fs.rmSync(arq, { force: true }); } catch { /* windows pode prender o handle */ }
}
process.exit(codigo);
