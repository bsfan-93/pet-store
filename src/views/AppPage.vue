<template>
  <div class="app-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <section class="app-hero-section">
        <div class="hero-content">
          <h1>Pets Clan</h1>
          <div class="os-buttons">
            <a href="#" class="os-button">IOS</a>
            <a href="#" class="os-button">Android</a>
          </div>
        </div>
      </section>

      <section class="all-in-one-section">
        <div class="image-placeholder-large"></div>
      </section>

      <section class="product-features-section">
        <div class="product-features-container">
          <div v-for="(item, index) in productFeatures" :key="index" class="product-item">
            <div class="product-image-placeholder"></div>
            <h3 class="product-title">{{ item.title }}</h3>
            <p class="product-description">{{ item.description }}</p>
          </div>
        </div>
      </section>

      <section class="data-service-section">
        <div class="image-placeholder-large"></div>
      </section>

      <section class="remote-control-section">
        <h2>Achieve remote control via interconnection support</h2>
        <div class="image-placeholder-large"></div>
      </section>

    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

const productFeatures = ref([
  { title: 'Feeder', description: 'Get to know your furpals even better with data tracking over time' },
  { title: 'Fountains', description: 'Get to know your furpals even better with data tracking over time' },
  { title: 'Leash', description: 'Get to know your furpals even better with data tracking over time' },
]);
</script>

<style scoped>
.app-page {
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

/* 英雄区 */
.app-hero-section {
  width: 100%;
  height: 70vh;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.hero-content {
  color: #fff;
}
.hero-content h1 {
  font-size: 6vw;
  font-weight: bold;
  margin: 0 0 20px 0;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}
.os-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}
.os-button {
  display: inline-block;
  padding: 10px 30px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}
.os-button:hover {
  background-color: #fff;
  transform: scale(1.05);
}

/* All-in-one 图片占位区 */
.all-in-one-section {
  padding: 80px 20px;
  display: flex;
  justify-content: center;
}
.image-placeholder-large {
  width: 100%;
  max-width: 1100px;
  aspect-ratio: 1100 / 550;
  background-color: #f0f0f0;
  border: 1px dashed #ccc;
  border-radius: 8px;
}

/* 三栏产品特性区 */
.product-features-section {
  padding: 80px 20px;
  background-color: #fff;
}
.product-features-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}
.product-item {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  text-align: left;
}
.product-image-placeholder {
  width: 100%;
  aspect-ratio: 4 / 3;
  background-color: #f0f0f0;
}
.product-title {
  font-size: 24px;
  font-weight: 500;
  margin: 20px 20px 10px;
}
.product-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 20px 20px;
}

/* 数据服务图片占位区 */
.data-service-section {
  padding: 80px 20px;
  text-align: center;
  background-color: #f7f7f7;
  display: flex;
  justify-content: center;
}

/* ▼▼▼ 【新增】远程控制区域样式 ▼▼▼ */
.remote-control-section {
  padding: 80px 20px 120px; /* 增加底部间距 */
  background-color: #fff;
  text-align: center;
}
.remote-control-section h2 {
  font-size: 28px;
  font-weight: 500;
  color: #000;
  margin-bottom: 40px;
}
.remote-control-section .image-placeholder-large {
  max-width: 900px; /* 调整此区域图片的最大宽度 */
  aspect-ratio: 900 / 500; /* 调整此区域图片的高宽比 */
  /* 【关键修改】添加这行代码使其水平居中 */
  margin: 0 auto;
}
</style>