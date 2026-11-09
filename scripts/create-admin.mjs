// Bootstrap do PRIMEIRO administrador.
// Uso: preencha ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD em .env e rode:
//   npm run create-admin
// Recusa se já existir um admin (a senha pode ser resetada via /painel/usuarios).
import fs from "node:fs";
import path from "node:path";
import { randomBytes, scryptSync } from "node:crypto";
import { createClient } from "@libsql/client";
import { DDL } from "./sqlite-ddl.mjs";

const RAIZ = process.cwd();

function lerEnv(){
  const compartido = {};
  try {
    for (const linha of fs.readFileSync(path.join(RAIZ, ".env"), "utf8").split(/\r?\n/)) {
      const m = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !(m[1] in compartido)) compartido[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch { /* arquivo ausente */ }
  return compartido;
}
const env = lerEnv();
const nome = process.env.ADMIN_NAME || env.ADMIN_NAME;
const email = process.env.ADMIN_EMAIL || env.ADMIN_EMAIL;
const senha = process.env.ADMIN_PASSWORD || env.ADMIN_PASSWORD;

if (!nome || !email || !senha) {
  console.error(
    "\nCredenciais ausentes. Preencha em .env (copie de .env.example):",
    "ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD",
    "Ex.: ADMIN_NAME='Coordenadora' ADMIN_EMAIL='coord@escola' ADMIN_PASSWORD='senha-forte-123'\n",
  );
  process.exit(1);
}

function hashSenha(s){
  const salt = randomBytes(16);
  const hash = scryptSync(s, salt, 64);
  return `hashgrip:${salt.toString("hex")}:${hash.toString("hex")}`; // mesmos formatos de src/lib/auth.ts
}

const pasta = path.join(RAIZ, "data");
fs.mkdirSync(pasta, { recursive: true });
const banco = process.env.WP_DB_NAME || env.WP_DB_NAME || "production.db";
const db = createClient({ url: "file:" + path.join(pasta, banco).split(path.sep).join("/") });

// garante tabelas (idempotente)
for (const sql of DDL) await db.execute(sql);

const existentes = await db.execute({ sql: "SELECT id FROM users WHERE papel = 'admin' LIMIT 1", args: [] });
if (existentes.rows.length > 0) {
  console.error("Já existe um administrador. Use /painel/usuarios para trocar a senha.");
  process.exit(1);
}

const novo = await db.execute({
  sql: "INSERT INTO users (nome, email, senha_hash, papel, ativo, convite_pendente) VALUES (?, ?, ?, 'admin', 1, 0)",
  args: [String(nome).trim(), String(email).trim().toLowerCase(), hashSenha(String(senha))],
});
console.log("Admin criado com id:", Number(novo.lastInsertRowid));
console.log("Acesse /painel/login com o e-mail informado. A senha pode ser trocada em /painel/usuarios.");
