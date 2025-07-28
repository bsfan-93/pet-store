// src/views/PlaceholderPage.vue

<template>
  <div class="placeholder-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <h1>{{ pageTitle }}</h1>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n'; // 1. 引入 useI18n
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

const route = useRoute();
const { t } = useI18n(); // 2. 获取 t 函数

// 3. 修改 pageTitle 的逻辑
const pageTitle = computed(() => {
  // 从 URL 获取 topic，例如 "Privacy-Policy"
  const topic = route.params.topic || 'Page';
  
  // 将 topic 转换为 i18n 的键名，例如 "footer.links.privacy_policy"
  const i18nKey = `footer.links.${topic.replace(/-/g, '_').toLowerCase()}`;
  
  // 使用 t 函数获取翻译
  return t(i18nKey);
});
</script>

<style scoped>
.placeholder-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.header-wrapper {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}
/* This ensures the header text is dark on a white background */
.header-wrapper :deep(.main-nav a),
.header-wrapper :deep(.header-actions .el-icon),
.header-wrapper :deep(.el-dropdown-link),
.header-wrapper :deep(.logo img) {
  color: var(--text-color);
  filter: none;
}
.main-content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}
h1 {
  font-size: 48px; /* Enlarged font size */
  font-weight: bold; /* Bold text */
  text-align: center;
}

/* ▼▼▼ 【新增】針對手機的響應式樣式 ▼▼▼ */
@media (max-width: 767px) {
    .main-content {
        padding: 60px 20px;
    }
    h1 {
        font-size: 32px;
    }
}
</style>