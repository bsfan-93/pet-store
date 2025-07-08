// src/main.js

import { createApp } from 'vue'
// 1. 从 pinia 中导入 createPinia
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/styles/main.css'
import App from './App.vue'
import i18n from './i18n'

// 2. 创建 Pinia 实例
const pinia = createPinia()
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(i18n)
// 3. 在 Vue 应用中使用 Pinia 实例
app.use(pinia)

app.mount('#app')