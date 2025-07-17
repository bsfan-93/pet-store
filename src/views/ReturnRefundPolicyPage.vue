<template>
  <div class="policy-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="policy-container">
        <h1>Return & Refund Policy</h1>
        
        <div class="policy-text">
          <p>Our media team works closely with the media and social partners to solve issues regarding pets' life conditions. We aim to support with high-tech and healthy living styles for both humans and pets.</p>
          <p>Customer Service:15380822206@163.com (We will reply to your email within 24 hours.)</p>
          <p>Customer Service Phone: (86) 15380822206 (9:00am-12:00pm & 1:00pm-18:00pm Mon.-Sun.)</p>
          <p>In addition to ensuring neat, clean, compliant and safe basic goods display requirements, we will try our best to comprehensively enrich product types and ensure sufficient quantity to meet customers' purchasing needs.</p>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
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
  font-size: 32px;
  font-weight: 600;
  color: #000;
  margin-bottom: 40px;
  text-align: center;
}

.policy-text {
  font-size: 14px;
  line-height: 1.8;
  text-align: left;
}
.policy-text p {
  margin: 0 0 1.5em 0;
}
</style>