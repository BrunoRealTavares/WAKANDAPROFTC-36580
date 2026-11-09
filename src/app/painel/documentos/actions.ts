"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { requireUser, auditor, ipResumido, podeExcluirDocumento, podeVerFinanceiro } from "@/lib/auth";
import { ERRO, OK, errosZod, numeroOuUndefined, textoOuUndefined, type ActionState } from "@/lib/action-state";

const LIMITE_BYTES = 20 * 1024 * 1024; // 20 MB

const esquema = z.object({
  titulo: z.string().trim().min(2, "Informe um título"),
  categoria: z.string().trim().min(1).max(40).default("geral"),
});

function nomeArquivoSeguro(nome: string): string {
  // mantém apenas letras/números, ponto e traço; qualquer acento/espaco vira "-"
  return nome
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(-80) || "arquivo";
}

export async function acaoEnviarDocumento(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser(["admin", "lider"]);
  const dados = esquema.safeParse({
    titulo: fd.get("titulo") ?? "",
    categoria: textoOuUndefined(fd.get("categoria")) ?? "geral",
  });
  if (!dados.success) return ERRO(errosZod(dados.error));

  const arquivo = fd.get("arquivo");
  if (!(arquivo instanceof File) || arquivo.size === 0) return ERRO({ arquivo: "Selecione um arquivo." });
  if (arquivo.size > LIMITE_BYTES) return ERRO({ arquivo: "Arquivo maior que o limite de 20 MB." });

  const pasta = path.join(process.cwd(), "data", "uploads");
  await fs.mkdir(pasta, { recursive: true });
  const seguro = nomeArquivoSeguro(arquivo.name);
  const salvo = `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}-${seguro}`;
  const destino = path.join(pasta, salvo);
  const bytes = Buffer.from(await arquivo.arrayBuffer());
  await fs.writeFile(destino, bytes);

  await db.insert(documents).values({
    titulo: dados.data.titulo,
    categoria: dados.data.categoria,
    arquivoNome: arquivo.name,
    arquivoPath: `uploads/${salvo}`,
    mime: arquivo.type || "application/octet-stream",
    tamanho: arquivo.size,
    enviadoPorId: user.id,
  });
  await auditor("upload_doc", { usuarioId: user.id, detalhe: dados.data.titulo, ip: await ipResumido() });
  revalidatePath("/painel/documentos");
  return OK("Documento enviado.");
}

export async function acaoExcluirDocumento(fd: FormData): Promise<void> {
  const user = await requireUser(["admin", "lider"]);
  const id = numeroOuUndefined(fd.get("id"));
  if (id && podeExcluirDocumento(user.papel)) {
    const reg = (await db.select().from(documents).where(eq(documents.id, id)).limit(1))[0];
    if (reg) {
      try {
        await fs.rm(path.join(process.cwd(), "data", reg.arquivoPath), { force: true });
      } catch {
        /* arquivo já ausente */
      }
      await db.delete(documents).where(eq(documents.id, id));
      await auditor("excluir_doc", { usuarioId: user.id, detalhe: reg.titulo, ip: await ipResumido() });
    }
  }
  revalidatePath("/painel/documentos");
}
