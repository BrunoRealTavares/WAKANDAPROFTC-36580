import Link from "next/link";
import { getUsuarioSessao } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FormularioLogin } from "./login-form";

// Tela de login do painel. A conta de acesso é criada pela administração
// da equipe em /painel/usuarios (não há registro público).
export default async function PaginaLogin() {
  const user = await getUsuarioSessao();
  if (user) redirect(user.convitePendente === 1 ? "/painel/trocar-senha" : "/painel");
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm items-center px-6">
      <div className="w-full">
        <p className="mb-6 text-lg font-semibold tracking-widest text-[color:var(--wp-red)]">
          WAKANDA <span className="text-[color:var(--wp-gold)]">PRO</span>
          <span className="block text-xs font-normal tracking-normal text-[color:var(--wp-silver-dim)]">acesso da equipe</span>
        </p>
        <p className="mb-6 text-sm text-[color:var(--wp-silver-mute)]">
          Conta de acesso é criada pela administração da equipe (não há cadastro público). Para recuperar a senha, use o painel abaixo — a administração gera uma senha temporária.
        </p>
        <div className="rounded-lg border border-[color:var(--wp-edge)] bg-[color:var(--wp-graphite)] p-5">
          <FormularioLogin />
        </div>
        <p className="mt-4 text-xs text-[color:var(--wp-silver-dim)]">
          <Link href="/" className="underline">Voltar ao site</Link> — Consulte /aviso-privacidade
        </p>
      </div>
    </div>
  );
}
