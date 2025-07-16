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

const pinia = createPinia()
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(i18n)
app.use(pinia)
app.use(router) // 2. 在 Vue 应用中使用路由

app.mount('#app')