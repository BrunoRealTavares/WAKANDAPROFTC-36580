import { getUsuarioSessao } from "@/lib/auth";
import { PainelShell } from "./painel-shell";

// Layout SEM auth aplicado (o login deve ser alcançável); cada page usa requireUser().
// PainelShell exibe contêiner simples quando há sessão (ex.: tela de login)
// e sidebar/topbar quando o usuário está autenticado.
// Rota bloqueante (Cookie-aware): o painel inteiro depende de sessão; sem prerender.
export const instant = false;
export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const user = await getUsuarioSessao();
  return (
    <PainelShell user={user}>
      <div>{children}</div>
    </PainelShell>
  );
}
