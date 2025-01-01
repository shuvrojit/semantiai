import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'
import { resolve } from 'path'

// Convert import.meta.url to a file path
const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background/background.ts'),
        contentScript: resolve(__dirname, 'src/contentScript/contentScript.ts')
      },
      output: {
        entryFileNames: '[name].js'
      }
    }
  },
  server: {
    port: 3000
  }
})
