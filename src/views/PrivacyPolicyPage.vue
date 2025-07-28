<template>
  <div class="policy-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="policy-container">
        <h1 class="policy-title">{{ t('privacy_policy_page.title') }}</h1>
        <p class="update-date">{{ t('privacy_policy_page.update_date') }}</p>
        <p class="intro-paragraph">{{ t('privacy_policy_page.intro') }}</p>
        <h2 class="section-title">{{ t('privacy_policy_page.section_1_title') }}</h2>
        <div class="definition-list">
          <p class="definition-item">{{ t('privacy_policy_page.def_a') }}</p>
          <p class="definition-item">{{ t('privacy_policy_page.def_b') }}</p>
          <p class="definition-item">{{ t('privacy_policy_page.def_c') }}</p>
          <p class="definition-item">{{ t('privacy_policy_page.def_d') }}</p>
          <p class="definition-item">{{ t('privacy_policy_page.def_e') }}</p>
          <p class="definition-item">{{ t('privacy_policy_page.def_f') }}</p>
        </div>
        <h2 class="section-title">{{ t('privacy_policy_page.section_2_title') }}</h2>
        <p class="section-paragraph">{{ t('privacy_policy_page.section_2_para') }}</p>
        <h3 class="subsection-title">{{ t('privacy_policy_page.subsection_a_title') }}</h3>
        <p class="section-paragraph">{{ t('privacy_policy_page.subsection_a_para') }}</p>
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
/* 上,下,左,右 */
  padding: 40px 20px 160px 20px;
}
.policy-container {
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #333;
  text-align: left;
}
.policy-title {
  font-size: 60px;
  font-weight: 700;
  color: #000;
  margin-bottom: 60px;
  text-align: center;
  letter-spacing: 2px;
}
.update-date {
  font-size: 14px;
  font-weight: 600;
  color: #000;
  text-align: left;
  margin-bottom: 2px;
}
.intro-paragraph {
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 1px;
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-top: 40px;
  margin-bottom: 1px;
}
.definition-list {
  font-size: 15px;
  line-height: 1.5;
}
.definition-item {
  margin-bottom: 0.5em;
}
.section-paragraph {
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 1em;
}
.subsection-title {
  font-size: 15px;
  font-weight: normal;
  color: #000;
  margin-top: 1px;
  margin-bottom: 1px;
}
</style>