<template>
  <div class="policy-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="policy-container">
        <h1>{{ t('terms_of_service_page.title') }}</h1>
        <div class="policy-text">
          <p v-html="t('terms_of_service_page.intro_1')"></p>
          <p v-html="t('terms_of_service_page.intro_2')"></p>
          <h2>{{ t('terms_of_service_page.section_1_title') }}</h2>
          <p v-html="t('terms_of_service_page.s1_1_text')"></p>
          <p v-html="t('terms_of_service_page.s1_2_text')"></p>
          <p v-html="t('terms_of_service_page.s1_3_text')"></p>
          <p v-html="t('terms_of_service_page.s1_4_text')"></p>
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
  padding: 80px 20px 120px 20px;
}
.policy-container {
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #000;
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
.policy-text {
  font-size: 15px;
  line-height: 1.9;
}
.policy-text p {
  margin: 0 0 0em 0;
}
.policy-text p:last-child {
    margin-bottom: 0;
}
.notice {
  font-weight: 700;
/* 使用 !important 來強制覆蓋其他樣式，確保上邊距生效 */
  margin-top: 3em !important; 
}

h2 {
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin-top: 50px;
  margin-bottom: 2px;
}

/* ▼▼▼ 2. 強制 strong 標籤使用更粗的字重 ▼▼▼ */
p > strong {
  margin-right: 0.5em;
  font-weight: 600; /* 確保加粗效果 */
}
</style>