// src/main.js

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/styles/main.css'
import App from './App.vue'
import i18n from './i18n'
import router from './router' // 1. 导入我们创建的路由实例
import { useAuthStore } from './stores/auth'; // 引入认证状态库

const pinia = createPinia()
const app = createApp(App)

app.use(pinia); // 必须在使用 store 之前加载 Pinia

// ▼▼▼【新增这一整块逻辑】▼▼▼
const authStore = useAuthStore();
const loginTimestamp = localStorage.getItem('login_timestamp');
if (loginTimestamp) {
  const twelveHours = 12 * 60 * 60 * 1000; // 12小时的毫秒数
  const now = Date.now();
  if (now - loginTimestamp > twelveHours) {
    console.log("Token 已过期，自动登出。");
    authStore.handleLogout(); // 自动执行登出
  }
}
// ▲▲▲ 新增逻辑结束 ▲▲▲

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(i18n)
app.use(pinia)
app.use(router) // 2. 在 Vue 应用中使用路由

app.mount('#app')