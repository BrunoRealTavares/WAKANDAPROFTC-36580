import Link from "next/link";
import { painelAcaoSair } from "./logout/actions";
import type { Usuario } from "@/lib/auth";
import type { Papel } from "@/db/schema";

const LINKS: Array<{ href: string; rotulo: string }> = [
  { href: "/painel", rotulo: "Painel" },
  { href: "/painel/tarefas", rotulo: "Tarefas" },
  { href: "/painel/calendario", rotulo: "Calendário" },
  { href: "/painel/presenca", rotulo: "Presença" },
  { href: "/painel/documentos", rotulo: "Documentos" },
  { href: "/painel/engenharia", rotulo: "Engenharia" },
  { href: "/painel/robo", rotulo: "Robô" },
  { href: "/painel/inventario", rotulo: "Inventário" },
  { href: "/painel/recursos", rotulo: "Recursos" },
  { href: "/painel/conteudo", rotulo: "Conteúdo" },
  { href: "/painel/usuarios", rotulo: "Usuários" },
];

const ROTULO_PAPEL: Record<Papel, string> = { admin: "Administração", lider: "Liderança", integrante: "Integrante" };

export async function PainelShell({ user, children }: { user: Usuario | null; children: React.ReactNode }) {
  if (!user) {
    // Sem sessão (ex.: /painel/login): contêiner simples, sem sidebar.
    return <div className="min-h-screen bg-[color:var(--wp-void)] text-[color:var(--wp-silver)]">{children}</div>;
  }
  const links = user.papel === "admin" ? LINKS : LINKS.filter((l) => l.href !== "/painel/usuarios");
  return (
    <div className="min-h-screen bg-[color:var(--wp-void)] text-[color:var(--wp-silver)]">
      <div className="mx-auto flex max-w-6xl flex-col md:flex-row">
        <aside className="md:sticky md:top-0 md:h-screen md:w-56 shrink-0 border-b border-[color:var(--wp-edge)] bg-[color:var(--wp-coal)] p-4 md:border-b-0 md:border-r">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[color:var(--wp-red)]">
            Wakanda <span className="text-[color:var(--wp-gold)]">PRO</span>
          </p>
          <nav className="flex flex-col gap-1 text-sm">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-md px-3 py-2 text-[color:var(--wp-silver-mute)] hover:bg-[color:var(--wp-graphite)] hover:text-[color:var(--wp-silver)]">
                {l.rotulo}
              </Link>
            ))}
          </nav>
          <p className="mt-6 border-t border-[color:var(--wp-edge)] pt-3 text-xs text-[color:var(--wp-silver-dim)]">Privacidade: consulte /aviso-privacidade</p>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--wp-edge)] bg-[color:var(--wp-coal)] px-5 py-3">
            <div>
              <p className="text-sm font-medium text-[color:var(--wp-silver)]">{user.nome}</p>
              <p className="text-xs text-[color:var(--wp-silver-mute)]">{ROTULO_PAPEL[user.papel]} — {user.email}</p>
            </div>
            <form action={painelAcaoSair}>
              <button type="submit" className="rounded-md border border-[color:var(--wp-edge)] px-3 py-1.5 text-sm text-[color:var(--wp-silver-mute)] hover:bg-[color:var(--wp-graphite)] hover:text-[color:var(--wp-red)]">
                Sair
              </button>
            </form>
          </header>
          <main className="p-5">{children}</main>
        </div>
      </div>
    </div>
  );
}
