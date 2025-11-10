// vite.config.js

// 1. 从 'vite' 导入 loadEnv
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// 2. 将 'defineConfig' 从一个对象改成一个函数
export default defineConfig(({ mode }) => {
  // 3. 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');
  
  // 4. 返回配置对象
  return {
    plugins: [vue()],
    server: {
      host: true,
      force: true, 
      proxy: {
        '/api': {
          // 5. 使用 env 变量来设置 target
          target: env.VITE_API_BASE_URL, // <-- 不再硬编码
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''), 
        },
      }
    }
  }
})