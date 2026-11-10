import Link from "next/link";
import { assets } from "@/data/assets";
import { ElectricLogo } from "@/components/ElectricLogo";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/historia", label: "About Us" },
  { href: "/robo", label: "Research" },
  { href: "/escola", label: "Company" },
  { href: "/contato", label: "Contact Us" },
];

export function ModernNavbar() {
  return (
    <header
      className="fixed top-0 z-50 w-full border-b border-[var(--wp-edge)] bg-[color-mix(in_srgb,var(--wp-void)_85%,transparent)] backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Top-left header: escudo + WAKANDA PRO + lâmpada */}
        <Link href="/" className="flex items-center gap-3 group">
          <ElectricLogo src={assets.escudo} alt="Escudo Wakanda Pro" tamanho="sm" />
          <div className="flex flex-col">
            <span className="font-display text-sm font-extrabold text-[var(--wp-white)] tracking-tight">
              WAKANDA PRO
            </span>
            <span className="text-[10px] text-[var(--wp-silver-dim)] uppercase tracking-[0.15em]">
              FTC 36580 · BIOBUZZ
            </span>
          </div>
          <svg
            className="ml-1 h-4 w-4 text-[var(--wp-gold)] drop-shadow-[0_0_8px_rgba(224,176,80,0.7)] group-hover:drop-shadow-[0_0_14px_rgba(224,176,80,0.9)] transition-all"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H9M12 2l-4 4v3.33c0 .87.47 1.64 1.17 2.09l2.39 2.39c.15.15.35.22.56.22s.41-.07.56-.22l2.39-2.39A1.94 1.94 0 0 0 16 9.33V2z" />
            <path d="M19 12H7c-2.3 0-4.2 1.9-4.2 4.2 0 1.2.4 2.3 1.1 3.1 1 1.1 2.3 1.7 3.8 1.7 2.4 0 4.6-1.5 5.3-3.5 0.7-2 1-3.3 1-5.5 0-2.3-1.9-4.2-4.2-4.2z" />
          </svg>
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--wp-silver-mute)] transition-colors hover:text-[var(--wp-white)] hover:drop-shadow-[0_0_10px_rgba(53,201,222,0.5)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <span className="tech-meta hidden xl:block">2026–27 / DARK MODE</span>
      </div>
    </header>
  );
}
