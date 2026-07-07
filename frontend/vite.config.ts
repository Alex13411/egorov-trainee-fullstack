import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    // Disable HMR eval — required for browsers with strict CSP (Cursor preview, etc.)
    hmr: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
