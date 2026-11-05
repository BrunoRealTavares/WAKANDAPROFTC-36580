import type { MetadataRoute } from "next";
import siteConfig from "@/lib/site-config";

const rotas = [
  "",
  "/equipe",
  "/historia",
  "/integrantes",
  "/escola",
  "/robo",
  "/biobuzz",
  "/simulador",
  "/galeria",
  "/diario",
  "/parceiros",
  "/contato",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return rotas.map((rota) => ({
    url: `${siteConfig.urlSite}${rota}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: rota === "" ? 1 : 0.7,
  }));
}
