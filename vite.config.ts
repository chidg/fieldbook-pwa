import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import pluginChecker from "vite-plugin-checker"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  build: {
    outDir: "./build",
  },
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      srcDir: "src",
      devOptions: {
        enabled: true,
        type: "module",
      },
      manifest: {
        short_name: "Fieldbook NCMRR",
        name: "Fieldbook for NCMRR",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
        ],
        start_url: "/",
        display: "standalone",
        theme_color: "#000000",
        background_color: "#ffffff",
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /\.css$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "css-cache",
              cacheableResponse: {
                statuses: [0, 200],
              },
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
      injectManifest: {
        globDirectory: "build",
        globPatterns: [
          "**/assets/**/*.{js,css}",
          "index.html",
          "manifest.webmanifest",
        ],
        globIgnores: ["**/*.map"],
      },
    }),
    pluginChecker({ typescript: true }),
  ],
})
