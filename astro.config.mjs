import { defineConfig } from "astro/config";

export default defineConfig({
  // Cloudflare Pages は静的サイトを完全サポート
  output: "static",

  // 高速キャッシング用の設定
  vite: {
    ssr: {
      external: ["@cloudflare/workers-types"],
    },
  },

  // サイトURL（本番環境で設定）
  site: process.env.SITE_URL || "http://localhost:3000",

  // Markdown の処理設定
  markdown: {
    syntaxHighlight: "shiki",
  },

  integrations: [],
});
