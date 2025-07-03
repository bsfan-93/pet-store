// src/main.js

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/styles/main.css'
import App from './App.vue'
import i18n from './i18n' // <-- 1. 确认你导入了 i18n 实例

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(i18n) // <-- 2. 确认你在这里全局使用了 i18n 实例

app.mount('#app')