<!-- “App 下载” 页面，展示应用的特色功能并提供下载链接 -->

<template>
  <div class="app-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <section 
        class="app-hero-section"
        :style="{ backgroundImage: 'url(/images/app-hero-background.jpg)' }"
      >
        <div class="hero-content">
          <div class="os-buttons">
            <a href="#" class="os-button">{{ t('app_page.hero.ios') }}</a>
            <a href="#" class="os-button">{{ t('app_page.hero.android') }}</a>
          </div>
        </div>
      </section>

      <section class="all-in-one-section">
        <img src="/images/app-all-in-one.png" alt="t('app_page.all_in_one.alt')" class="aio-image">
        <div class="aio-text-overlay">
          <div class="aio-text">
            <h2>{{ t('app_page.all_in_one.title') }}</h2>
            <p v-html="t('app_page.all_in_one.description')"></p>
          </div>
        </div>
      </section>

      <section class="data-service-section">
        <div class="data-service-container">
          <img src="/images/app-data-service.png" alt="t('app_page.data_service.alt')" class="section-image-large">
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
        <h2>{{ t('app_page.remote_control.title') }}</h2>
        <video
          :src="'/videos/remote-control.mp4'"
          controls
          class="section-video"
        ></video>
      </section>
      </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue'; // 引入 computed
import { useI18n } from 'vue-i18n'; // 引入 useI18n
import { ref } from 'vue';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

const { t } = useI18n(); // 获取 t 函数
// Add image paths to your data
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
  height: 60vh;
  /* 可选值： cover ，contain ， auto ， [length/percentage] */
  background-size: cover;            
  /* 控制点 2: 调整这个值来改变图片的显示焦点，避免重要内容被裁掉 */
  /* 可选值: center top, center center, center bottom */
  background-position: center bottom; 
  position: relative; 
  
}
.hero-content {
  /* This container is now less important for centering */
}

.os-buttons {
  position: absolute;
  bottom: 2.6vw; /* 50px / 19.2 */ 
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  justify-content: center;
  gap: 20px;
}

.os-button {
  display: inline-block;
  padding: 0.625vw 1.82vw; /* 12px/19.2 35px/19.2 */
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  border-radius: 6.25vw; /* 120px/19.2 */
  text-decoration: none;
  font-weight: 500;
  font-size: 1.35vw; /* 26px/19.2 */
  transition: all 0.2s ease;
}
.os-button:hover {
  background-color: #fff;
  transform: scale(1.05);
}

/* ▼▼▼ START: CSS MODIFICATION ▼▼▼ */
/* All-in-one Section */
.all-in-one-section {
  position: relative; /* 关键：作为文字浮动层的定位基准 */
  padding: 80px 0; /* 控制点 1: 调整这个值来改变与上方英雄图的白色间距 */
  line-height: 0; /* 消除图片下方的微小间隙 */
}

.aio-image {
  display: block;
  width: 100%; /* 让图片铺满宽度 */
  /* height: 100vh; */ /* <-- 【刪除】移除固定的視窗高度 */
  height: 98vh;      /* ▼▼▼ 【修改】讓高度自動計算 ▼▼▼ */
  aspect-ratio: 2 / 1; /* <-- 【新增】設定一個合適的長寬比，例如 2:1 */
  object-fit: cover; /* ▼▼▼ 【在這裡新增這一行】 ▼▼▼ */
}

.aio-text-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  /* 使用 Flexbox 轻松控制文字的位置 */
  display: flex;
  align-items: center; /* 垂直居中 */
  
  padding: 0 8%; /* 与页面其他内容左右对齐 */
  box-sizing: border-box;
}

.aio-text {
  /* 控制点 2: 调整这个宽度来改变文字块的宽度 */
  width: 40vw; /* 保持与原来百分比类似，但使用 vw */;
  /* max-width: 1450px; 保持 max-width，防止过大 */
  text-align: center; /* 修改这里，让文字居中 */
}

.aio-text h2 {
  font-size: 2.86vw; /* 55px/19.2 */
  font-weight: 400;
  color: #000;
  margin-bottom: 1.3vw; /* 25px/19.2 */
  line-height: 1.4;
}

.aio-text p {
  font-size: 1.25vw; /* 24px/19.2 */
  font-weight: 500;
  color: #000;
  margin-bottom: 1.3vw; /* 25px/19.2 */
  line-height: 1.8;
}

/* Data Service Section */
.data-service-section {
  position: relative; /* 关键：作为文字浮动层的定位基准 */
  padding: 80px 0; /* 控制与上下模块的间距 */
  line-height: 0; /* 消除图片下方的微小间隙 */
}

.data-service-image {
  display: block;
  width: 100%; /* 让图片铺满宽度 */
  height: auto; /* 高度自动，保证图片不变形 */
}

.data-service-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: flex-end;        /* 保持文本容器在右侧 */
  /* 将右侧内边距从 8% 增加到 15%，使其向左移动 */
  padding:  0 15% 0 8%; /* 上 右 下 左 */
  box-sizing: border-box;
}

.data-service-text {
  width: 60vw; /* 保持与原来百分比类似，但使用 vw */
  max-width: 550px;
  text-align: left;
  text-align: center; /* 修改这里，让文字居中 */
}

.data-service-text h2 {
  /* 3. 使用 clamp() 实现响应式字体大小 */
  font-size: clamp(32px, 4.5vw, 55px); 
  font-weight: 400;
  color: #000;
  margin-bottom: 1.52vw; /* 30px/19.2 */
  line-height: 1.3; /* 4. 优化行高 */
}

.data-service-text p {
  font-size: clamp(16px, 2vw, 22px); /* 描述文本也做响应式处理 */
  color: #000;
  line-height: 1.0;
}

.section-image-large {
  display: block;
  width: 100%;
  /* max-width: 1450px; */
  /* height: 100vh; */ /* <-- 【刪除】移除固定的視窗高度 */
  height: 91vh;      /* ▼▼▼ 【修改】讓高度自動計算 ▼▼▼ */
  /* aspect-ratio: 16 / 9; <-- 【新增】設定一個合適的長寬比 */
  border-radius: 0px;
  object-fit: cover; /* ▼▼▼ 【在這裡新增這一行】 ▼▼▼ */
}

/* 三栏产品特性区 */
.product-features-section {
  padding: 80px 20px;
  background-color: #fff;
}
.product-features-container {
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}
.product-item {
  border: 1px solid #eee;
  border-radius: 0px;
  overflow: hidden;
  display: flex; /* 关键：设为 Flex 布局 */
  flex-direction: column; /* 关键：默认垂直排列 (图片在上，文字在下) */
}
.product-image-wrapper {
  width: 100%;
  aspect-ratio: 1 / 1; /* 让图片区域变成正方形 */
  background-color: #fff;
}
.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.product-text-content {
  padding: 1.56vw; /* 30px/19.2 */
  text-align: center;
}
.product-title {
  font-size: 2.6vw; /* 50px/19.2 */
  font-weight: 400;
  margin: 0 0 1.3vw 0; /* 25px/19.2 */
}
.product-description {
  font-size: 1.145vw; /* 22px/19.2 */
  font-weight: 400;
  color: #000;
  line-height: 2.0;
  margin: 0;
}
/* 仅对有 .reverse-layout 的卡片 (中间那个) 应用翻转效果 */
.product-item.reverse-layout {
  flex-direction: column-reverse; /* 关键：翻转垂直排列顺序 (文字在上，图片在下) */
}


/* 远程控制区域 */
.remote-control-section {
  padding: 80px 20px 20px;
  background-color: #fff;
  text-align: center;
}
.remote-control-section h2 {
  font-size: 3.125vw; /* 60px/19.2 */
  font-weight: 500;
  color: #000;
  margin-bottom: 2.6vw; /* 50px/19.2 */
}
/* 新增 video 标签的样式 */
.section-video {
  display: block;
  width: 100%;
  max-width: 1500px;
  max-height: 80vh;
  margin: 0 auto;
  object-fit: cover;
  border-radius: 12px; /* 可以给视频也加上圆角 */
}
.remote-control-image {
  max-width: 1500px;
  max-height: 80vh;
  display: block; /* 确保是块级元素 */
  margin: 0 auto; /* 自动计算左右外边距，实现居中 */
}
</style>