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
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

const route = useRoute();

// This computed property will format the topic from the URL
// e.g., "Privacy-Policy" becomes "Privacy Policy"
const pageTitle = computed(() => {
  const topic = route.params.topic || 'Page';
  return topic.replace(/-/g, ' ');
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
</style>