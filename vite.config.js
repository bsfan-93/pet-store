import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    proxy: {
      // 将所有以 /api 开头的请求都代理到后端服务器
      '/api': {
        target: 'http://192.168.2.9:9999', // 目标服务器地址
        changeOrigin: true, // 必须设置为 true
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径，去掉 /api 前缀
      }
    }
  }
})