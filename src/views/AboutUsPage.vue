<!-- “关于我们” 页面，用于介绍品牌故事和团队信息。 -->

<template>
  <div class="about-us-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <section class="hero-section">
        <img src="/images/about-us-hero-with-text.png" :alt="t('about_us.hero.alt')" class="hero-image">
      </section>

      <section class="intro-section">
        <div class="intro-container">
          <div class="intro-left">
            <div class="intro-tagline-wrapper">
              <span class="tagline-line">{{ t('about_us.intro.tagline1') }}</span>
              <span class="tagline-line">{{ t('about_us.intro.tagline2') }}</span>
              <span class="tagline-line">{{ t('about_us.intro.tagline3') }}</span>
            </div>
          </div>
          <div class="intro-right">
            <p class="description">{{ t('about_us.intro.p1') }}</p>
            <p class="description">{{ t('about_us.intro.p2') }}</p>
            <img src="/images/signature.png" :alt="t('about_us.intro.signature_alt')" class="signature-image">
          </div>
        </div>
      </section>

      <section class="image-banner-section">
        <img src="/images/about-us-banner.jpg" :alt="t('about_us.banner.alt')" class="banner-image">
      </section>

      <section class="features-section">
        <div class="features-container">
          <div v-for="(feature, index) in features" :key="index" class="feature-item">
            <img :src="feature.icon" :alt="feature.title" class="feature-icon">
            <h3 class="feature-title" v-html="feature.title"></h3>
            <p class="feature-description" v-html="feature.description"></p>
          </div>
        </div>
      </section>

      <section class="lifelong-friends-section">
        <div class="lifelong-friends-container">
          <div class="lf-left">
            <img src="/images/pet-feeder-promo.png" :alt="t('about_us.lifelong.image_alt')">
          </div>
          <div class="lf-right">
            <h2 class="lf-title" v-html="t('about_us.lifelong.title')"></h2>
            <p class="lf-description">{{ t('about_us.lifelong.p1') }}</p>
            <p class="lf-description">{{ t('about_us.lifelong.p2') }}</p>
            <div class="lf-stats">
              <div class="stat-item">
                <span class="stat-value">130+</span>
                <span class="stat-label">{{ t('about_us.lifelong.stat1_label') }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">400+</span>
                <span class="stat-label">{{ t('about_us.lifelong.stat2_label') }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">100h+</span>
                <span class="stat-label">{{ t('about_us.lifelong.stat3_label') }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="about-ponti-section">
        <div class="ponti-container">
          <div class="ponti-left">
            <h3 class="ponti-subtitle">{{ t('about_us.ponti.subtitle') }}</h3>
            <h2 class="ponti-title" v-html="t('about_us.ponti.title')"></h2>
            <p class="ponti-description">{{ t('about_us.ponti.p1') }}</p>
            <p class="ponti-description">{{ t('about_us.ponti.p2') }}</p>
          </div>
          <div class="ponti-right">
            <img src="/images/about-ponti-portrait.jpg" :alt="t('about_us.ponti.portrait_alt')" class="ponti-portrait">
            <span class="ponti-vertical-name">PO<br>NTI</span>
          </div>
        </div>
      </section>

      <section class="about-clan-section">
        <div class="clan-container">
          <h2 class="clan-title">{{ t('about_us.clan.title') }}</h2>
          <div class="clan-video-wrapper">
            <video
              src="/videos/about-us-video.mp4"
              controls
              class="video-player"
            ></video>
          </div>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue'; // 引入 computed
import { useI18n } from 'vue-i18n'; // 引入 useI18n
import { ElIcon } from 'element-plus';
import { VideoPlay } from '@element-plus/icons-vue';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

const { t } = useI18n(); // 获取 t 函数

// 【重要】将 featuresData 转换为计算属性 features
const features = computed(() => [
  {
    icon: '/images/icons/feature-green.png',
    title: t('about_us.features.feature1.title'),
    description: t('about_us.features.feature1.description')
  },
  {
    icon: '/images/icons/feature-intelligent.png',
    title: t('about_us.features.feature2.title'),
    description: t('about_us.features.feature2.description')
  },
  {
    icon: '/images/icons/feature-simple.png',
    title: t('about_us.features.feature3.title'),
    description: t('about_us.features.feature3.description')
  },
  {
    icon: '/images/icons/feature-reddot.png',
    title: t('about_us.features.feature4.title'),
    description: t('about_us.features.feature4.description')
  }
]);

// 不再需要 formatTitle 函数
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
  max-width: 1500px; 
  margin: 0 auto; 
  height: auto;
  border-radius: 0px;
}

/* ▼▼▼ 2. 公司介绍区域 ▼▼▼ */
.intro-section {
  padding: 100px 2%;
  background-color: #f8f8f8;
}
.intro-container {
  /* max-width: 1200px;
  margin: 0 auto; */
  width: 100%;
  padding: 0 0%; /* 在容器内部增加左右内边距，控制内容与屏幕边缘的距离 */
  display: flex;
  justify-content: center; /* 尝试将内容组居中对齐 */
  align-items: flex-start;
  /* 控制点 1: 调整左右两块的间距 */
  gap: 80px; /* 【修改】从 -150px 修正为一个合理的间距 */
}
.intro-left {
  /* 让左侧内容块占据可用空间的一半，但不要超过其自身所需宽度 */
  flex-basis: 30%;
}
.intro-right {
  /* 让右侧内容块占据可用空间的一半，但不要超过一个设定的最大值 */
  flex-basis: 50%;
  max-width: 600px;
}

/* 公司介绍区域的描述 */
.description {
  font-size: 22px; /* 【修改】 1.145vw -> 22px */
  line-height: 1.8;
  color: #333;
  margin: 0 0 24px 0; /* 【修改】 1.25vw -> 24px */
}
.signature-image {
  /* 控制点 1: 调整宽度来改变大小 */
  width: 70px; /* 【修改】 3.64vw -> 70px */
  height: auto;
  padding-left: 0px;
  /* 控制点 2: 调整上边距来改变与上方段落的距离 */
  margin-top: -20px; /* 【修改】 -1.04vw -> -20px */
}
/* ▲▲▲ END: CSS MODIFICATION FOR PARAGRAPH ▲▲▲ */


/* ▼▼▼ START: CSS MODIFICATION FOR TAGLINE ▼▼▼ */
.intro-tagline-wrapper {
  display: flex;
  flex-direction: column;
}
.tagline-line {
  font-size: 60px; /* 【修改】 2.125vw -> 60px */
  font-weight: bold;
  letter-spacing: 2px;
  line-height: 1.2;
  color: #000;
  white-space: nowrap;
}
.tagline-line:nth-child(1) {
  margin-bottom: 90px; /* 【修改】 4.68vw -> 90px */  /* 拉大第一行和第二行的间距 */
}
.tagline-line:nth-child(2) {
  margin-bottom: 15px; /* 【修改】 0.78vw -> 15px */  /* 第二行和第三行的间距 */
}
/* ▲▲▲ END: CSS MODIFICATION FOR TAGLINE ▲▲▲ */


/* ▼▼▼ 3. 图片横幅区域样式 ▼▼▼ */
.image-banner-section {
  /* 移除背景图片相关的属性，只作为容器 */
  padding: 60px 0; /* 给这个区域一些上下间距 */
  background-color: #fff;
  text-align: center; /* 简单地让内部的图片居中 */
}

.banner-image {
  /* 控制点 1: 调整这个宽度来改变图片大小 */
  width: 80%;
  /* 控制点 2: 限制图片在超大屏幕上的最大宽度 */
  max-width: 1600px;
  height: auto; /* 自动保持图片的原始宽高比 */
  border-radius: 0px; /* 可选：给图片加个圆角 */
}

/* ▼▼▼ 4. 特性介绍区域样式 ▼▼▼ */
.features-section {
  padding: 100px 20px;
  background-color: #fff;
}
.features-container {
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0px;
}
.feature-item {
  text-align: center;
}
.feature-icon {
  width: 160px; /* 【修改】 8.33vw -> 160px */
  height: 160px; /* 【修改】 8.33vw -> 160px */
  margin-bottom: 20px; /* 【修改】 1.04vw -> 20px */
}
.feature-title {
  font-size: 24px; /* 【修改】 1.25vw -> 24px */
  font-weight: bold;
  color: #000;
  margin: 0 0 10px 0;
  line-height: 1.4;
}
.feature-description {
  font-size: 22px; /* 【修改】 1.145vw -> 22px */
  color: #555;
  line-height: 1.6;
  margin: 0;
}


/* ▼▼▼ 5. 产品特性与数据展示区域 ▼▼▼ */
.lifelong-friends-section {
  padding: 100px 20px;
  background-color: #fff;
}

.lifelong-friends-container {
  max-width: 1500px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center; /* 将左右内容作为一个整体居中 */
  /* 控制点 1: 调整左右两部分的间距 */
  gap: 80px;
}

.lf-left {
  /* 控制点 2: 调整左侧图片部分的宽度 */
  width: 600px;
  flex-shrink: 0; /* 防止被压缩 */
}

.lf-left img {
  width: 100%;
  border-radius: 0px;
}

.lf-right { /* 【修改】 修正了 lf-right 的拼写错误 */
  /* 控制点 3: 调整右侧文字部分的宽度 */
  width: 480px;
  flex-shrink: 0; /* 防止被压缩 */
}

.lf-title {
  font-size: 60px; /* 【修改】 3.125vw -> 60px */
  font-weight: bold;
  color: #000;
  line-height: 1.3;
  margin: 0 0 20px 0; /* 【修改】 1.04vw -> 20px */
  letter-spacing: 1px;
}

.lf-description {
  font-size: 22px; /* 【修改】 1.145vw -> 22px */
  color: #555;
  line-height: 1.7;
  margin: 0 0 24px 0; /* 【修改】 1.25vw -> 24px */
}

.lf-stats {
  display: flex;
  justify-content: flex-start;
  text-align: left;
  gap: 60px;
}

.lf-stats .stat-item {
  display: flex;
  flex-direction: column;
}

.lf-stats .stat-value {
  font-size: 36px; /* 【修改】 1.875vw -> 36px */
  font-weight: bold;
  color: #000;
  line-height: 1.1;
}

.lf-stats .stat-label {
  font-size: 14px; /* 【修改】 0.73vw -> 14px */
  color: #666;
  margin-top: 8px; /* 【修改】 0.41vw -> 8px */
  white-space: nowrap;
}

/* ▼▼▼ 6. 创始人介绍区域 ▼▼▼ */
.about-ponti-section {
  padding: 100px 20px;
  background-color: #fff;
}

.ponti-container {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  gap: 80px;
}

.ponti-left {
  flex: 1.5;
}

.ponti-subtitle {
  font-size: 24px; /* 【修改】 1.25vw -> 24px */
  font-weight: bold;
  color: #555;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0 0 10px 0;
}

.ponti-title {
  font-size: 60px; /* 【修改】 3.125vw -> 60px */
  font-weight: bold;
  color: #000;
  line-height: 1.4;
  text-transform: uppercase;
  margin: 0 0 30px 0; /* 【修改】 1.56vw -> 30px */
}

.ponti-description {
  font-size: 22px; /* 【修改】 1.145vw -> 22px */
  color: #666;
  line-height: 1.8;
  margin: 0 0 20px 0; /* 【修改】 1.04vw -> 20px */
}

.ponti-right {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
}

.ponti-portrait {
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 0px;
}

.ponti-vertical-name {
  position: absolute;
  right: -50px;
  bottom: 20px;
  font-size: 60px; /* 【修改】 3.125vw -> 60px */
  font-weight: bold;
  color: #e0e0e0;
  line-height: 0.9;
  text-align: center;
  z-index: -1;
}

/* ▼▼▼ 7. 关于我们视频区域 ▼▼▼ */
.about-clan-section {
  padding: 100px 20px;
  background-color: #fff;
}

.clan-container {
  max-width: 1500px;
  margin: 0 auto;
  text-align: center;
}

.clan-title {
  font-size: 60px; /* 【修改】 3.125vw -> 60px */
  font-weight: bold;
  color: #000;
  margin: 0 0 40px 0; /* 【修改】 2.08vw -> 40px */
}

.clan-video-wrapper {
  position: relative;
  width: 100%;
  border-radius: 0px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.video-thumbnail {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 30 / 9;
  object-fit: cover;
}

.play-button-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
}

.clan-video-wrapper:hover .play-button-overlay {
  background-color: rgba(0, 0, 0, 0.4);
}

.play-icon {
  font-size: 80px; /* 【修改】 4.16vw -> 80px */
  color: white;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  padding: 20px; /* 【修改】 1.04vw -> 20px */
  transition: transform 0.3s ease;
}

.clan-video-wrapper:hover .play-icon {
  transform: scale(1.1);
}

/* ▼▼▼ 【无需修改】媒体查询部分保持不变 ▼▼▼ */
/* 它们现在会正确地覆盖上面我们设置的大的 px 值 */

/* --- 平板电脑样式 (宽度 ≤ 1199px) --- */
@media (max-width: 1199px) {
  .intro-container,
  .lifelong-friends-container,
  .ponti-container {
    flex-direction: column; /* 將左右佈局改為垂直堆疊 */
    gap: 40px;
    align-items: center;
    text-align: center;
  }

  .intro-left, .intro-right, .lf-left, .lf-right, .ponti-left, .ponti-right {
    flex-basis: 100%;
    max-width: 600px;
  }

  .intro-right, .ponti-left {
    text-align: left;
  }

  .features-container {
    grid-template-columns: repeat(2, 1fr); /* 特性區塊變為兩欄 */
    gap: 40px;
  }

  .ponti-vertical-name {
    display: none;
  }
  
  /* 【新增】覆盖平板电脑上的字体 */
  .description,
  .lf-description,
  .ponti-description {
    font-size: 18px;
  }
  .tagline-line,
  .lf-title,
  .ponti-title,
  .clan-title {
    font-size: 42px;
  }
  .feature-icon {
    width: 120px;
    height: 120px;
  }
  .feature-title {
    font-size: 20px;
  }
  .feature-description {
    font-size: 16px;
  }
  .lf-stats .stat-value {
    font-size: 30px;
  }
  .ponti-subtitle {
    font-size: 20px;
  }
  .play-icon {
    font-size: 60px;
  }
}

/* --- 手機样式 (宽度 ≤ 767px) --- */
@media (max-width: 767px) {
  .hero-section, .intro-section, .features-section, .lifelong-friends-section, .about-ponti-section, .about-clan-section {
    padding: 50px 20px; /* 縮小所有區塊的上下間距 */
  }

  /* 調整字體大小為固定像素，確保手機上的可讀性 */
  .tagline-line { font-size: 32px; }
  .description { font-size: 15px; line-height: 1.6; }
  .feature-title { font-size: 20px; }
  .feature-description { font-size: 14px; }
  .lf-title, .ponti-title, .clan-title { font-size: 28px; }
  .lf-description, .ponti-description { font-size: 15px; }
  .lf-stats .stat-value { font-size: 24px; }
  .lf-stats .stat-label { font-size: 12px; }

  .features-container {
    grid-template-columns: 1fr; /* 特性區塊變為單欄 */
  }

  .lifelong-friends-container, .ponti-container, .ponti-left {
    text-align: center;
  }
  
  .intro-right, .ponti-left {
    text-align: center; /* 在手机上也居中 */
  }

  .lf-stats {
    justify-content: center;
  }

  .feature-icon {
    width: 100px;
    height: 100px;
  }
  .play-icon {
    font-size: 50px;
  }
}
</style>