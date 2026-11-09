import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import siteConfig from "@/lib/site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.urlSite),
  title: {
    default: "Wakanda Pro 36580 — Equipe de Robótica FTC",
    template: "%s | Wakanda Pro 36580",
  },
  applicationName: "Wakanda Pro 36580",
  authors: [{ name: "Wakanda Pro 36580" }],
  creator: "Wakanda Pro 36580",
  publisher: "Wakanda Pro 36580",
  keywords: [
    "Wakanda Pro",
    "FTC 36580",
    "FIRST Tech Challenge",
    "BIOBUZZ",
    "robótica",
    "robotics",
    "SESI Milton Santos",
    "Camaçari",
    "Bahia",
  ],
  description:
    "Wakanda Pro 36580, equipe de robótica educacional da Escola SESI Milton Santos (Camaçari/BA), em estreia na FIRST Tech Challenge — temporada BIOBUZZ 2026–27.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Wakanda Pro 36580",
    title: "Wakanda Pro 36580 — Equipe de Robótica FTC",
    description:
      "Equipe de robótica educacional de Camaçari/BA, em estreia na FIRST Tech Challenge — temporada BIOBUZZ 2026–27.",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary",
    title: "Wakanda Pro 36580 — Equipe de Robótica FTC",
    description:
      "Equipe de robótica educacional de Camaçari/BA, em estreia na FIRST Tech Challenge — temporada BIOBUZZ 2026–27.",
  },
  icons: {
    icon: "/img/escudo-wakanda-pro.png.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--wp-void)] font-sans text-[var(--wp-white)] antialiased">
        {children}
      </body>
    </html>
  );
}
