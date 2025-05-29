import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      entry: "./src/DashboardPlugin.ts",
      name: 'SparcDashboard',
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    cssCodeSplit: false,
    outDir: 'dist',
    rollupOptions: {
      // Externalizing Vue, Pinia, and Element Plus
      external: ['vue', 'pinia', 'element-plus', "@abi-software/flatmapvuer",
      "@abi-software/scaffoldvuer"],
      output: {
        globals: {
          vue: 'Vue',
          pinia: 'Pinia',
          'element-plus': 'ElementPlus',
          "@abi-software/flatmapvuer" : "flatmapvuer",
          "@abi-software/scaffoldvuer": "scaffoldvuer"
        },
      },
    },
  },
})
