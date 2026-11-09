"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { attendance, users } from "@/db/schema";
import { requireUser, auditor, ipResumido } from "@/lib/auth";
import { ERRO, OK, numeroOuUndefined, type ActionState } from "@/lib/action-state";

/** Admin/lider marcam presença de cada integrante num evento. */
export async function acaoRegistrarPresencaEquipe(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser(["admin", "lider"]);
  const eventId = numeroOuUndefined(fd.get("eventoId"));
  if (!eventId) return ERRO({ eventoId: "Escolha um evento." });

  // todos os users ativos
  const membros = await db.select({ id: users.id }).from(users).where(eq(users.ativo, 1));
  const idsMarcados = new Set<number>();
  for (const valor of fd.getAll("presentes")) {
    const n = Number(valor);
    if (Number.isInteger(n) && n > 0) idsMarcados.add(n);
  }

  let gravados = 0;
  for (const m of membros) {
    const presente = idsMarcados.has(m.id) ? 1 : 0;
    const existente = (await db.select().from(attendance).where(and(eq(attendance.eventId, eventId), eq(attendance.userId, m.id))).limit(1))[0];
    if (existente) {
      await db.update(attendance).set({ presente }).where(eq(attendance.id, existente.id));
    } else {
      await db.insert(attendance).values({ eventId, userId: m.id, presente });
    }
    gravados++;
  }
  await auditor("presenca_registrada", { usuarioId: user.id, detalhe: `evento:${eventId} (${ gravados } membros)`, ip: await ipResumido() });
  revalidatePath("/painel/presenca");
  return OK(`Presença registrada para ${idsMarcados.size} de ${gravados} membros.`);
}

/** Integrante marca a própria presença num evento futuro. */
export async function acaoMarcarPresencaPropria(_estado: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const eventId = numeroOuUndefined(fd.get("eventoId"));
  if (!eventId) return ERRO({ eventoId: "Escolha um evento." });
  await db
    .insert(attendance)
    .values({ eventId, userId: user.id, presente: 1 })
    .onConflictDoUpdate({ target: [attendance.eventId, attendance.userId], set: { presente: 1 } });
  await auditor("presenca_registrada", { usuarioId: user.id, detalhe: `evento:${eventId} (própria)`, ip: await ipResumido() });
  revalidatePath("/painel/presenca");
  return OK("Presença própria registrada.");
}
