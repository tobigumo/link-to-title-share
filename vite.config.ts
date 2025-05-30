import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
            },
          },
        ],
      },
      manifest: {
        name: "Link to Title Share",
        short_name: "TitleShare",
        description: "URLのタイトルを取得して他のアプリに共有するPWA",
        theme_color: "#1DB954",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/link-to-title-share/",
        scope: "/link-to-title-share/",
        share_target: {
          action: "/link-to-title-share/",
          method: "GET",
          enctype: "application/x-www-form-urlencoded",
          params: {
            url: "url",
            title: "title",
            text: "text",
          },
        },
        icons: [
          {
            src: "assets/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "assets/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],

  // GitHub Pages用の設定
  base: "/link-to-title-share/",

  // エントリーポイント
  root: "src",

  // 出力ディレクトリ
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
      },
    },
  },

  // 開発サーバー設定
  server: {
    port: 3000,
    open: true,
  },

  // publicDir設定
  publicDir: "../public",
});
