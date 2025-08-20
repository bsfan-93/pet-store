// vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    // ▼▼▼ 新增这个 'optimizeDeps' 配置 ▼▼▼
    force: true, 
    proxy: {
      '/api': {
        target: 'http://192.168.2.9:9999', // 您的后端服务器
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    }
  }
})