"use server";

import { redirect } from "next/navigation";
import { logout, getUsuarioSessao, auditor, ipResumido } from "@/lib/auth";

export async function painelAcaoSair(): Promise<void> {
  const usuario = await getUsuarioSessao();
  await logout();
  await auditor("logout", { usuarioId: usuario?.id ?? null, ip: await ipResumido() });
  redirect("/painel/login");
}
