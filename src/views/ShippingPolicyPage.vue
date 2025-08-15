<!-- 配送政策说明书 -->

<template>
  <div class="policy-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="policy-container">
        <h1 class="policy-title">{{ t('shipping_policy_page.title') }}</h1>
        <div class="policy-text">
          <div class="policy-group">
            <p>{{ t('shipping_policy_page.p1') }}</p>
          </div>
          <div class="policy-group">
            <p>{{ t('shipping_policy_page.p2') }}</p>
          </div>
          <div class="policy-group">
            <p>{{ t('shipping_policy_page.p3') }}</p>
          </div>
          <div class="policy-group">
            <p v-html="t('shipping_policy_page.notice')"></p>
          </div>
          <div class="policy-group">
            <h2 class="section-title">{{ t('shipping_policy_page.signature_title') }}</h2>
            <p>{{ t('shipping_policy_page.signature_p1') }}</p>
            <p>{{ t('shipping_policy_page.signature_p2') }}</p>
          </div>
          <div class="policy-group">
            <h2 class="section-title">{{ t('shipping_policy_page.important_notice_title') }}</h2>
            <p>{{ t('shipping_policy_page.important_notice_p1') }}</p>
          </div>
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
/* --- 基礎樣式 (保持不變) --- */
.policy-page { 
    background-color: #fff; 
}
.header-wrapper { 
    position: sticky; 
    top: 0; z-index: 1000; 
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
    padding: 40px 20px 160px 20px; 
}
.policy-container { 
    max-width: 1100px; 
    margin: 0 auto; 
    font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif; 
    color: #333; 
    text-align: left; 
}
.policy-title { 
    font-size: 60px; 
    font-weight: 600; 
    color: #000;
    margin-bottom: 40px; 
    text-align: center; 
    letter-spacing: 2px; 
}

/* ▼▼▼ 【核心修改】 ▼▼▼ */
.policy-text {
  font-size: 15px;
  line-height: 1.5; /* 控制段落內部的行高 */
}

/* 2. 為每個紅框區塊（policy-group）設定一個較大的下邊距，拉開區塊間的距離 */
.policy-group {
  margin-bottom: 0;
}

/* 3. 對於區塊內部的多個段落，設定一個較小的下邊距，讓它們保持緊湊 */
.policy-group p + p {
  margin-top: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin-bottom: 1em; /* 控制標題和下方第一段文字的距離 */
}
</style>