<template>
  <div class="about-us-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <section class="hero-section">
        <img src="/images/about-us-hero-with-text.png" alt="Welcome to Pets Clan" class="hero-image">
      </section>

      <section class="intro-section">
        <div class="intro-container">
          <div class="intro-left">
            <p class="tagline-main">PETS CLAN,</p>
            <p class="tagline-sub">EFFORTLESS PET CARE.</p>
          </div>
          <div class="intro-right">
            <p class="description">
              At Pets Clan, we are committed to bringing a smarter, greener, and more convenient pet lifestyle to every pet owner. We firmly believe that Technology and Design should be centered on user needs to create products that can truly improve the quality of life. We are not only a promoter of technology, but also a bridge between pets and pet owners, helping you to establish a deeper emotional connection with your pet.
            </p>
            <img src="/images/signature.png" alt="Pets Clan Signature" class="signature-image">
          </div>
        </div>
      </section>

      <section class="image-banner-section">
        </section>

      <section class="features-section">
        <div class="features-container">
          <div v-for="(feature, index) in featuresData" :key="index" class="feature-item">
            <img :src="feature.icon" :alt="feature.title" class="feature-icon">
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
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

// 【新增】为特性区域创建数据源
const featuresData = ref([
  {
    icon: '/images/icons/feature-green.png',
    title: 'Green living, energy conservation and environmental protection',
    description: 'Waste-free design, responsible for pets and the planet'
  },
  {
    icon: '/images/icons/feature-intelligent.png',
    title: 'Intelligent control, feeding at any time',
    description: 'Remotely monitor your pet’s health and feed them anytime'
  },
  {
    icon: '/images/icons/feature-simple.png',
    title: 'Simple design, zero waste',
    description: 'No need for extra consumables, with environmental protection and intelligence going hand in hand'
  },
  {
    icon: '/images/icons/feature-reddot.png',
    title: 'Red Dot Design, a choice of quality',
    description: 'Award-winning design, a perfect integration of technology and aesthetics'
  }
]);
</script>

<style scoped>
/* 确保页面最外层是白色背景 */
.about-us-page {
  background-color: #fff;
}

.header-wrapper {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}
.header-wrapper :deep(.main-nav a),
.header-wrapper :deep(.header-actions .el-icon),
.header-wrapper :deep(.el-dropdown-link) {
  color: var(--text-color);
}
.header-wrapper :deep(.logo img) {
  filter: none;
}
.main-content {
  flex-grow: 1;
}

/* ▼▼▼ 1. 英雄区域 ▼▼▼ */
.hero-section {
  padding: 60px 0;
  width: 100%;
  background-color: #fff;
}
.hero-image {
  display: block;
  width: 90%; 
  max-width: 1400px; 
  margin: 0 auto; 
  height: auto;
  border-radius: 8px;
}

/* ▼▼▼ 2. 公司介绍区域 ▼▼▼ */
.intro-section {
  padding: 100px 20px;
  background-color: #f8f8f8;
}
.intro-container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  gap: 100px;
}
.intro-left {
  flex: 0 0 auto;
  color: #000;
  padding-right: 50px;
}
.tagline-main {
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 1px;
}
.tagline-sub {
  font-size: 36px;
  font-weight: bold;
  margin-top: 10px;
  letter-spacing: 1.5px;
}
.intro-right {
  flex: 1;
}
.description {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin: 0 0 40px 0;
}
.signature-image {
  width: 150px;
  height: auto;
}

/* ▼▼▼ 3. 图片横幅区域样式 ▼▼▼ */
.image-banner-section {
  width: 100%;
  height: 70vh;
  background-color: #e0e0e0;
  background-image: url('/images/about-us-banner.jpg');
  background-size: cover;
  background-position: center;
}

/* ▼▼▼ 4. 【新增】特性介绍区域样式 ▼▼▼ */
.features-section {
  padding: 100px 20px;
  background-color: #fff; /* 确保是白色背景 */
}
.features-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 创建一个四栏网格 */
  gap: 40px;
}
.feature-item {
  text-align: left;
}
.feature-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
}
.feature-title {
  font-size: 16px;
  font-weight: bold;
  color: #000;
  margin: 0 0 10px 0;
  line-height: 1.4;
}
.feature-description {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin: 0;
}
</style>