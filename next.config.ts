import type { NextConfig } from "next";

const nextConfig: NextConfig = { 
  // Pacotes nativos/sqlite nao devem ser empacotados pelo Turbopack
  serverExternalPackages: ["@libsql/client"],
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
