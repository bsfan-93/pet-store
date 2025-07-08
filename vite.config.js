import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 当你的请求路径以 /standalones 开头时，
      // Vite会把这个请求转发到 target 指定的地址
      '/standalones': {
        target: 'http://192.168.2.9:9999', // 你的后端服务器地址
        changeOrigin: true, // 必须设置为true，不然会转发失败
        // 我们不再需要 rewrite，因为我们请求的路径已经是后端期望的路径了
      }
    }
  }
})