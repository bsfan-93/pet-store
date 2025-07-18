import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    proxy: {
      // A single rule to proxy all requests starting with /api
      '/api': {
        target: 'http://192.168.2.9:9999', // Your backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix before sending to backend
      },
    }
  }
})