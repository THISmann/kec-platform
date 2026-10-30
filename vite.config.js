/**
 * Configuration Vite.
 * - Alias "@" -> /src pour des imports lisibles et stables.
 * - Le mode ("mock" par défaut, "http" pour les vraies API) est lu depuis
 *   les fichiers .env (voir .env.example).
 */
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Les tokens SCSS (mixins, breakpoints) sont injectés dans chaque <style lang="scss">
        additionalData: `@use "@/assets/styles/tokens" as *;`
      }
    }
  },
  server: { port: 5173, host: true },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Sépare les librairies lourdes (cartographie) du code applicatif
        manualChunks: { geo: ['d3-geo', 'topojson-client'] }
      }
    }
  }
})
