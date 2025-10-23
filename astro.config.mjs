import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";

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

  integrations: [
    partytown({
      config: {
        // Google Analytics データレイヤー操作をメインスレッドに転送
        forward: ["dataLayer.push", "gtag"],
        // Partytown debug モードを有効（開発時の確認用）
        debug: false,
      },
    }),
  ],
});
