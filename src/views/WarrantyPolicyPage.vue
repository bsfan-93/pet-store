<template>
  <div class="policy-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="policy-container">
        <h1 class="policy-title">{{ t('warranty_policy_page.title') }}</h1>
        <div class="policy-text">
          <p>{{ t('warranty_policy_page.p1') }}</p>
          <h2>{{ t('warranty_policy_page.discount_heading') }}</h2>
          <p>{{ t('warranty_policy_page.p2') }}</p>
          <p>{{ t('warranty_policy_page.p3') }}</p>
          <p class="disclaimer">{{ t('warranty_policy_page.disclaimer') }}</p>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

const { t } = useI18n();
</script>

<style scoped>
.policy-page {
  background-color: #fff;
}
.header-wrapper {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #fff;
  border-bottom: 1px solid #fff;
}
.header-wrapper :deep(.main-nav a),
.header-wrapper :deep(.header-actions .el-icon),
.header-wrapper :deep(.el-dropdown-link),
.header-wrapper :deep(.logo img) {
  color: var(--text-color);
  filter: none;
}
.main-content {
  padding: 40px 20px 160px 20px;
}
.policy-container {
  max-width: 1100px;
  margin: 0 auto;
  font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif; /* 使用更適合中文的字體 */
  color: #000; /* 讓文字顏色更深一點 */
  text-align: left;
}
h1 {
  font-size: 60px;
  font-weight: 600;
  color: #000;
  margin-bottom: 40px;
  text-align: center;
  letter-spacing: 2px;
}

/* ▼▼▼ 【核心修改】精準控制間距和樣式 ▼▼▼ */
.policy-text {
  font-size: 15px;
  line-height: 1.6;  /* 增加行高以匹配圖片 */
}

/* 移除所有 p 標籤的預設間距 */
.policy-text p {
  margin: 0;
}

/* 為第一個段落後的每個兄弟元素（h2, p）添加一個固定的上邊距 */
.policy-text > * + * {
  margin-top: 20px;
}

h2 {
  font-size: 20px;
  font-weight: 600;
  color: #000;
  /* 覆蓋上面的通用間距，實現更精準的控制 */
  margin-top: 30px; /* 增加與上方段落的間距 */
  margin-bottom: 2px; /* 減小與下方段落的間距 */
}

.disclaimer {
  font-size: 14px;
  font-weight: 550;
  color: #000;
  /* border-top: 1px solid #eee; */
  padding-top: 1.6px;
  margin-top: 0 !important; /* 使用 !important 確保覆蓋通用間距 */
  line-height: 1.8;
}
</style>