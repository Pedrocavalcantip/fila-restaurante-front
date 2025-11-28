import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // ← Permite acesso externo (outros dispositivos na rede)
    port: 3001,
    proxy: {
      // Redireciona chamadas /api/* para o backend em localhost:3000
      // Evita problemas de CORS em desenvolvimento sem alterar o backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})
