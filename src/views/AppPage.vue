<template>
  <div class="app-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      
      <section class="app-hero-section">
        <div class="hero-container">
          <img src="/images/app-hero-background.jpg" alt="App Hero" class="hero-bg-image">
          
          <div class="hero-content">
            <div class="os-buttons">
                <a href="https://www.apple.com/" target="_blank" class="os-button">{{ t('app_page.hero.ios') }}</a>
                <a href="https://www.mi.com/" target="_blank" class="os-button">{{ t('app_page.hero.android') }}</a>
            </div>
          </div>
        </div>
      </section>

      <section class="all-in-one-section">
        <div class="content-wrapper">
          <img src="/images/app-all-in-one.png" :alt="t('app_page.all_in_one.alt')" class="aio-image">
          <div class="aio-text-overlay">
            <div class="aio-text">
              <h2>{{ t('app_page.all_in_one.title') }}</h2>
              <p v-html="t('app_page.all_in_one.description')"></p>
            </div>
          </div>
        </div>
      </section>

      <section class="data-service-section">
        <div class="content-wrapper data-service-container">
          <img src="/images/app-data-service.png" :alt="t('app_page.data_service.alt')" class="section-image-large">
          <div class="data-service-overlay">
            <div class="data-service-text">
              <h2>{{ t('app_page.data_service.title') }}</h2>
              <p>{{ t('app_page.data_service.description') }}</p>
            </div>
          </div>
        </div>
      </section>
      
      <section class="product-features-section">
        <div class="product-features-container">
          <div 
            v-for="(item, index) in productFeatures" 
            :key="index" 
            class="product-item"
            :class="{ 'reverse-layout': index === 1 }"
          >
            <div class="product-image-wrapper">
              <img :src="item.image" :alt="item.title" class="product-image">
            </div>
            <div class="product-text-content">
              <h3 class="product-title">{{ item.title }}</h3>
              <p class="product-description" v-html="item.description"></p>
            </div>
          </div>
        </div>
      </section>

      <section class="remote-control-section">
        <div class="content-wrapper">
          <h2>{{ t('app_page.remote_control.title') }}</h2>
          <video
            :src="'/videos/remote-control.mp4'"
            controls
            class="section-video"
          ></video>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

const { t } = useI18n();

const productFeatures = computed(() => [
  { 
    title: t('app_page.features.feeder.title'), 
    description: t('app_page.features.feeder.description'),
    image: '/images/app-feature-feeder.png' 
  },
  { 
    title: t('app_page.features.fountains.title'), 
    description: t('app_page.features.fountains.description'),
    image: '/images/app-feature-fountains.png'
  },
  { 
    title: t('app_page.features.leash.title'), 
    description: t('app_page.features.leash.description'),
    image: '/images/app-feature-leash.png'
  },
]);
</script>

<style scoped>
/* ▼▼▼ 核心修复：直接定义在最前面，使用固定 px 值 ▼▼▼ */
.content-wrapper,
.hero-container,
.product-features-container {
  width: 100%;
  max-width: 1750px; /* 【关键】直接写死 1750px，确保限制生效 */
  margin: 0 auto;    /* 居中 */
  position: relative;
  line-height: 0;
}

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

/* Hero 区域 */
.app-hero-section {
  width: 100%;
  height: auto; 
  position: relative; 
  display: flex;           
  justify-content: center; /* 确保内部容器居中 */
  background-color: #f8f8f8; 
}

.hero-bg-image {
  width: 100%;
  height: auto; /* 自动高度，等比缩放 */
  display: block;
}

.hero-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.os-buttons {
  position: absolute;
  bottom: 50px; 
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  gap: 20px;
}

.os-button {
  display: inline-block;
  padding: 12px 35px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  border-radius: 120px;
  text-decoration: none;
  font-weight: 500;
  font-size: 26px;
  transition: all 0.2s ease;
}
.os-button:hover {
  background-color: #fff;
  transform: scale(1.05);
}

/* All-in-one Section */
.all-in-one-section {
  padding: 80px 20px;
  line-height: 0;
  display: flex;         
  justify-content: center;
}

.aio-image {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 2 / 1;   
  object-fit: cover;
}

.aio-text-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center; 
  padding: 0 8%;
  box-sizing: border-box;
}

.aio-text {
  width: 40%; /* 相对宽度 */
  text-align: center;
}

.aio-text h2 {
  font-size: 55px; 
  font-weight: 400;
  color: #000;
  margin-bottom: 25px;
  line-height: 1.4;
}

.aio-text p {
  font-size: 24px;
  font-weight: 500;
  color: #000;
  margin-bottom: 25px;
  line-height: 1.8;
}

/* Data Service Section */
.data-service-section {
  padding: 80px 20px; 
  line-height: 0;
  display: flex;         
  justify-content: center;
}

.data-service-image {
  display: block;
  width: 100%;
  height: auto;
}

.data-service-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding:  0 15% 0 8%;
  box-sizing: border-box;
}

.data-service-text {
  width: 60%; 
  text-align: center;
}

.data-service-text h2 {
  font-size: 55px;
  font-weight: 400;
  color: #000;
  margin-bottom: 30px;
  line-height: 1.3;
}

.data-service-text p {
  font-size: 22px;
  color: #000;
  line-height: 1.0;
}

.section-image-large {
  display: block;
  width: 100%;
  height: auto;       
  aspect-ratio: 16 / 9; 
  border-radius: 0px;
  object-fit: cover;
}

/* 三栏产品特性区 */
.product-features-section {
  padding: 80px 20px;
  background-color: #fff;
  display: flex;          /* 【新增】确保此区域也居中 */
  justify-content: center;
}

.product-features-container {
  /* max-width: 1750px; (已在最上方统一定义) */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.product-item {
  border: 1px solid #eee;
  border-radius: 0px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.product-image-wrapper {
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #fff;
}
.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.product-text-content {
  padding: 30px;
  text-align: center;
}
.product-title {
  font-size: 50px;
  font-weight: 400;
  margin: 0 0 25px 0;
}
.product-description {
  font-size: 22px;
  font-weight: 400;
  color: #000;
  line-height: 2.0;
  margin: 0;
}
.product-item.reverse-layout {
  flex-direction: column-reverse;
}


/* 远程控制区域 */
.remote-control-section {
  padding: 80px 20px 20px;
  background-color: #fff;
  text-align: center;
  display: flex;           /* 【新增】 */
  justify-content: center; /* 【新增】 */
}
.remote-control-section h2 {
  font-size: 60px;
  font-weight: 500;
  color: #000;
  margin-bottom: 50px;
}
.section-video {
  display: block;
  width: 100%;
  /* max-width: 1500px; */ /* 【修改】由父容器 content-wrapper 控制宽度 */
  max-height: 80vh;
  margin: 0 auto;
  object-fit: cover;
  border-radius: 12px;
}

/* 媒体查询 */
@media (max-width: 1199px) {
  .os-button {
    font-size: 20px;
    padding: 10px 30px;
    border-radius: 100px;
  }
  .aio-text {
    width: 60%; 
  }
  .aio-text h2 {
    font-size: 42px;
  }
  .aio-text p {
    font-size: 18px;
  }
  
  .data-service-text {
    width: 70%; 
  }
  .data-service-text h2 {
    font-size: 42px;
  }
  .data-service-text p {
    font-size: 18px;
  }

  .product-features-container {
    grid-template-columns: 1fr;
  }
  .product-title {
    font-size: 36px;
  }
  .product-description {
    font-size: 18px;
  }
  .remote-control-section h2 {
    font-size: 42px;
  }
}

@media (max-width: 767px) {
  .app-hero-section {
    height: auto; 
  }
  
  .hero-bg-image {
    min-height: 300px; 
    object-fit: cover;
  }

  .os-button {
    font-size: 16px;
    padding: 10px 24px;
    border-radius: 60px;
  }

  .all-in-one-section,
  .data-service-section {
    padding: 40px 15px;
  }

  .aio-text-overlay,
  .data-service-overlay {
    padding: 0 5%;
  }
  .aio-text,
  .data-service-text {
    width: 100%; 
  }
  .aio-text h2,
  .data-service-text h2 {
    font-size: 28px;
  }
  .aio-text p,
  .data-service-text p {
    font-size: 15px;
  }

  .product-features-section {
    padding: 40px 15px;
  }
  .product-features-container {
    gap: 20px;
  }
  .product-text-content {
    padding: 20px;
  }
  .product-title {
    font-size: 24px;
  }
  .product-description {
    font-size: 15px;
  }

  .remote-control-section {
    padding: 40px 15px 15px;
  }
  .remote-control-section h2 {
    font-size: 28px;
  }
}
</style>