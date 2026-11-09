import Link from "next/link";
import { contato } from "@/data/contato";
import siteConfig from "@/lib/site-config";

export function SiteFooter() {
  // Fixo: valores dinâmicos (new Date()) quebram o prerender no Next 16. Atualizar anualmente.
  const year = 2026;
  return (
    <footer id="contato" className="border-t border-[var(--wp-graphite)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-xl font-extrabold text-[var(--wp-white)]">
            WAKANDA<span className="text-[var(--wp-red)]">·</span>PRO
          </p>
          <p className="tech-meta mt-1">CAMAÇARI · BAHIA · BRASIL</p>
          <p className="mt-4 max-w-xs text-sm text-[var(--wp-silver-mute)]">
            Equipe de robótica educacional em estreia na FIRST Tech Challenge.
          </p>
        </div>

        <div>
          <p className="tech-meta text-[var(--wp-gold-soft)]">Navegação</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--wp-silver-mute)]">
            <li><Link className="hover:text-[var(--wp-white)]" href="/equipe">A Equipe</Link></li>
            <li><Link className="hover:text-[var(--wp-white)]" href="/historia">Nossa História</Link></li>
            <li><Link className="hover:text-[var(--wp-white)]" href="/robo">Projeto Vibranium</Link></li>
            <li><Link className="hover:text-[var(--wp-white)]" href="/biobuzz">Temporada BIOBUZZ</Link></li>
            <li><Link className="hover:text-[var(--wp-white)]" href="/galeria">Galeria</Link></li>
            <li><Link className="hover:text-[var(--wp-white)]" href="/diario">Diário de bordo</Link></li>
          </ul>
        </div>

        <div>
          <p className="tech-meta text-[var(--wp-gold-soft)]">Contato</p>
          <a
            className="mt-3 block text-sm hover:text-[var(--wp-white)]"
            href={`mailto:${contato.email}`}
          >
            {contato.email}
          </a>
          <a
            className="mt-2 block text-sm hover:text-[var(--wp-white)]"
            href={contato.redesSociais.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram @wakandaproftc ↗
          </a>
          <p className="mt-8 text-xs text-[var(--wp-silver-dim)]">
            © {year} {siteConfig.nomeEquipe} {siteConfig.numeroFtc}. Projeto educacional independente.
            Inspirado em temas de ficção científica; sem vínculo com a Marvel.
          </p>
        </div>
      </div>
    </footer>
  );
}
