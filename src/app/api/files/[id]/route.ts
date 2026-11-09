import fs from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { getUsuarioSessao } from "@/lib/auth";
import { db } from "@/db";
import { documents } from "@/db/schema";

// Download privado: valida sessão (qualquer usuário ativo) e entrega o arquivo
// de data/uploads como attachment — NUNCA um link público direto.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const usuario = await getUsuarioSessao();
  if (!usuario) return new Response("Não autenticado", { status: 401 });

  const { id } = await params;
  const numero = Number(id);
  if (!Number.isInteger(numero) || numero <= 0) return new Response("Inválido", { status: 400 });

  const reg = (await db.select().from(documents).where(eq(documents.id, numero)).limit(1))[0];
  if (!reg) return new Response("Não encontrado", { status: 404 });

  const caminho = path.join(process.cwd(), "data", reg.arquivoPath);
  const pasta = path.join(process.cwd(), "data", "uploads");
  if (!caminho.startsWith(pasta + path.sep)) return new Response("Caminho inválido", { status: 400 });

  try {
    const bytes = await fs.readFile(caminho);
    const nomeCod = encodeURIComponent(reg.arquivoNome);
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": reg.mime,
        "Content-Length": String(bytes.length),
        "Content-Disposition": `attachment; filename*=UTF-8''${nomeCod}`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new Response("Arquivo ausente", { status: 404 });
  }
}
