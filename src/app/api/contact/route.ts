import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { auditor } from "@/lib/auth";
import { ensureDynamic } from "@/lib/dynamic-render";
import { headers } from "next/headers";
import { z } from "zod";

// ------------------------------------------------------------------
// API pública de contato (usada pelo formulário do site).
// POST JSON: { nome, email, assunto, mensagem, consentimento }
// Honeypot: campo oculto "website" — bots preenchem e são descartados.
// Rate-limit em memória: 5 envios/hora por IP (single-instance; para
// multi-instância trocar por armazenamento compartilhado).
// ------------------------------------------------------------------

const LIMITE_JANELA_MS = 60 * 60 * 1000; // 1h
const LIMITE_POR_IP = 5;
const ultimoEnvio = new Map<string, number[]>(); // ip -> timestamps(ms)

function ipDaRequisicao(cabecas: Headers): string {
  const bruto =
    cabecas.get("x-forwarded-for")?.split(",")[0]?.trim() ?? cabecas.get("x-real-ip")?.trim() ?? "local";
  return bruto.slice(0, 64);
}

function excedeuTaxa(ip: string): boolean {
  const agora = Date.now();
  const janela = (ultimoEnvio.get(ip) ?? []).filter((t) => agora - t < LIMITE_JANELA_MS);
  if (janela.length >= LIMITE_POR_IP) {
    ultimoEnvio.set(ip, janela);
    return true;
  }
  janela.push(agora);
  ultimoEnvio.set(ip, janela);
  return false;
}

const esquema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(120),
  email: z.string().trim().toLowerCase().email("E-mail inválido").max(160),
  assunto: z.string().trim().min(1, "Escolha um assunto").max(80),
  mensagem: z.string().trim().min(10, "Escreva ao menos 10 caracteres").max(4000),
  consentimento: z.literal(true, { error: "É necessário aceitar o consentimento" }),
});

export async function POST(req: Request): Promise<Response> {
  await ensureDynamic();

  let bruto: unknown;
  try {
    bruto = await req.json();
  } catch {
    return Response.json({ ok: false, erros: { _: "Corpo inválido." } }, { status: 400 });
  }

  const dados = bruto as Record<string, unknown>;
  // honeypot: se um "humano" de verdade preencheu o campo oculto, descarta silenciosamente
  if (typeof dados.website === "string" && dados.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const cabecas = await headers();
  const ip = ipDaRequisicao(cabecas);
  if (excedeuTaxa(ip)) {
    return Response.json(
      { ok: false, erros: { _: "Muitos envios. Tente novamente mais tarde." } },
      { status: 429 },
    );
  }

  const parse = esquema.safeParse({
    nome: dados.nome,
    email: dados.email,
    assunto: dados.assunto,
    mensagem: dados.mensagem,
    consentimento: dados.consentimento,
  });
  if (!parse.success) {
    const erros: Record<string, string> = {};
    for (const issue of parse.error.issues) {
      const campo = issue.path.join(".") || "_";
      if (!erros[campo]) erros[campo] = issue.message;
    }
    return Response.json({ ok: false, erros }, { status: 400 });
  }

  try {
    await db.insert(contactMessages).values({
      nome: parse.data.nome,
      email: parse.data.email,
      assunto: parse.data.assunto,
      mensagem: parse.data.mensagem,
      ip,
    });
  } catch {
    return Response.json(
      { ok: false, erros: { _: "Não foi possível registrar agora. Tente novamente." } },
      { status: 500 },
    );
  }

  await auditor("contato_recebido", {
    detalhe: `${parse.data.assunto} — ${parse.data.email}`,
    ip,
  });

  return Response.json({ ok: true });
}
