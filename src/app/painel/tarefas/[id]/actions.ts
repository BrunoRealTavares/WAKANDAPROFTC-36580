"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { taskComments } from "@/db/schema";
import { requireUser, auditor, ipResumido } from "@/lib/auth";
import { ERRO, OK, errosZod, numeroOuUndefined, type ActionState } from "@/lib/action-state";

const esquema = z.object({ texto: z.string().trim().min(1, "Comentário vazio") });

export async function acaoComentarTarefa(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const taskId = numeroOuUndefined(fd.get("taskId"));
  if (!taskId) return ERRO({ taskId: "Tarefa inválida." });
  const dados = esquema.safeParse({ texto: fd.get("texto") ?? "" });
  if (!dados.success) return ERRO(errosZod(dados.error));
  await db.insert(taskComments).values({ taskId, autorId: user.id, texto: dados.data.texto });
  await auditor("comentar_task", { usuarioId: user.id, detalhe: `taskId:${taskId}`, ip: await ipResumido() });
  revalidatePath(`/painel/tarefas/${taskId}`);
  return OK("Comentário publicado.");
}
