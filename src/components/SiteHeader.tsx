import Link from "next/link";
import { ElectricLogo } from "@/components/ElectricLogo";
import { assets } from "@/data/assets";

const navItems = [
  { href: "/equipe", label: "Equipe" },
  { href: "/historia", label: "História" },
  { href: "/integrantes", label: "Integrantes" },
  { href: "/escola", label: "Escola" },
  { href: "/robo", label: "Robô" },
  { href: "/biobuzz", label: "BIOBUZZ" },
  { href: "/simulador", label: "Simulador" },
  { href: "/diario", label: "Diário" },
  { href: "/galeria", label: "Galeria" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-[var(--wp-graphite)] bg-[color-mix(in_srgb,var(--wp-void)_78%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <ElectricLogo src={assets.escudo} alt="Escudo Wakanda Pro" tamanho="sm" />
          <span className="font-display text-lg font-extrabold tracking-tight text-[var(--wp-white)]">
            WAKANDA<span className="text-[var(--wp-red)]">•</span>PRO
          </span>
          <span className="tech-meta group-hover:text-[var(--wp-gold-soft)] transition-colors">
            36580
          </span>
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="hidden items-center gap-4 lg:flex xl:gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--wp-silver-mute)] transition-colors hover:text-[var(--wp-white)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <span className="tech-meta hidden xl:block">2026–27 / BIOBUZZ</span>

        {/* Menu mobile — implementado na próxima fase com Sheet acessível */}
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded border border-[var(--wp-edge)] text-[var(--wp-silver-mute)] lg:hidden"
          aria-label="Abrir menu"
        >
          <span className="block h-px w-4 bg-current shadow-[0_4px_0_currentColor,0_-4px_0_currentColor]" />
        </button>
      </div>
    </header>
  );
}
