import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,       // build ke baad automatically browser mein khul jayega
      gzipSize: true,    // gzip ke baad ka actual size bhi dikhayega
      brotliSize: true,
    }),
  ],
})