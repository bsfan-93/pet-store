<!-- “退货与退款政策” 页面，说明相关的条款和流程。 -->

<template>
  <div class="policy-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="policy-container">
        <h1>{{ t('return_refund_policy.title') }}</h1>
        
        <div class="policy-text">
          <p>{{ t('return_refund_policy.p1') }}</p>
          <p v-html="t('return_refund_policy.p2')"></p>
          <p v-html="t('return_refund_policy.p3')"></p>
          <p>{{ t('return_refund_policy.p4') }}</p>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'; // 1. 引入 useI18n
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

const { t } = useI18n(); // 2. 获取 t 函数
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
  border-bottom: 1px solid #eee;
}
.header-wrapper :deep(.main-nav a),
.header-wrapper :deep(.header-actions .el-icon),
.header-wrapper :deep(.el-dropdown-link),
.header-wrapper :deep(.logo img) {
  color: var(--text-color);
  filter: none;
}

.main-content {
  padding: 80px 20px;
}

.policy-container {
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Outfit', sans-serif;
  color: #555;
}

h1 {
  font-size: 60px;
  font-weight: 600;
  color: #000;
  margin-bottom: 40px;
  text-align: center;
  word-spacing: 10px; /* <-- 新增這一行來加大單詞間距 */
}

.policy-text {
  font-size: 15px;
  line-height: 1.8;
  text-align: left;
}
.policy-text p {
  margin: 0 0 1.5em 0;
}

/* ▼▼▼ 【新增】針對手機的響應式樣式 ▼▼▼ */
@media (max-width: 767px) {
    .main-content {
        padding: 40px 20px;
    }

    h1 {
        font-size: 28px;
        word-spacing: 0;
    }

    .policy-text {
        font-size: 15px;
    }
}
</style>