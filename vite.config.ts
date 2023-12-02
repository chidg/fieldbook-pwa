import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import pluginChecker from "vite-plugin-checker"
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  build: { outDir: "./build" },
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({ registerType: "autoUpdate" }),
    pluginChecker({ typescript: true }),
  ],
})
