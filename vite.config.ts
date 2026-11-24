import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      // el front llama a /api y vite lo pasa al gateway, asi no hay problemas de cors
      proxy: {
        '/api': {
          target: env.VITE_GATEWAY_URL ?? 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
  }
})
