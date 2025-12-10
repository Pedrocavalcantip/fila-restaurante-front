import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build otimizado para produção
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react'],
        },
      },
    },
  },
  
  // Servidor de desenvolvimento
  server: {
    host: '0.0.0.0',
    port: 3001,
    // Proxy só funciona em desenvolvimento
    // Em produção, VITE_API_URL aponta direto para o backend
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  
  // Preview (testar build localmente)
  preview: {
    port: 3001,
  },
})
