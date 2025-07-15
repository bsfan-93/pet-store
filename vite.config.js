import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    proxy: {
      // 规则一：处理所有 /standalones 开头的请求
      '/standalones': {
        target: 'http://192.168.2.9:9999',
        changeOrigin: true,
      },
      // ▼▼▼ 【新增】规则二：处理所有 /auth 开头的请求 ▼▼▼
      '/auth': {
        target: 'http://192.168.2.9:9999',
        changeOrigin: true,
      }
    }
  }
})