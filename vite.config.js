import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

/*
 * base:
 *  - Locale / dev  → "/"
 *  - GitHub Pages  → "/<nome-repo>/"  (iniettata dal workflow tramite BASE_PATH)
 *  Non c'è routing client-side, quindi funziona a qualunque sotto-path.
 */
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "apple-touch-icon.png",
        "icons/icon-192.png",
        "icons/icon-512.png",
        "icons/icon-maskable-512.png",
      ],
      manifest: {
        name: "Isola Magica",
        short_name: "Isola Magica",
        description:
          "Impara l'inglese giocando — 30 isole da Starters a Flyers. Più giocatori, ognuno con la sua avventura.",
        lang: "it",
        dir: "ltr",
        start_url: ".",
        scope: ".",
        display: "standalone",
        orientation: "portrait",
        background_color: "#1E1440",
        theme_color: "#2D1B4E",
        categories: ["education", "games", "kids"],
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // App shell + icone: precache (offline al primo avvio)
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff,woff2}"],
        navigateFallback: "index.html",
        // Gli MP3 sono tanti: niente precache, si cacheano man mano che si giocano
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.endsWith(".mp3"),
            handler: "CacheFirst",
            options: {
              cacheName: "regno-audio-clips",
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
              rangeRequests: true,
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.endsWith("audio/manifest.json"),
            handler: "StaleWhileRevalidate",
            options: { cacheName: "regno-audio-manifest" },
          },
          {
            urlPattern: ({ url }) =>
              url.origin === "https://fonts.googleapis.com" ||
              url.origin === "https://fonts.gstatic.com",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
});
