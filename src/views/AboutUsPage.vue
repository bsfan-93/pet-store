<template>
  <div class="about-us-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <section class="hero-section">
        <div class="hero-image-placeholder"></div>
      </section>

      <section class="stats-section">
        <div class="stats-container">
          <div class="stat-item">
            <p class="stat-title">Market Covered</p>
            <p class="stat-value">30+ Countries</p>
          </div>
          <div class="stat-item">
            <p class="stat-title">Market Covered</p>
            <p class="stat-value">400+</p>
          </div>
          <div class="stat-item">
            <p class="stat-title">Market Covered</p>
            <p class="stat-value">Win the Red Dot Award</p>
          </div>
        </div>
      </section>

      <section class="innovation-section">
        <div class="innovation-container">
          <div class="image-grid">
            <div class="image-placeholder"></div>
            <div class="image-placeholder"></div>
            <div class="image-placeholder"></div>
            <div class="image-placeholder"></div>
          </div>
          <div class="text-content">
            <h2>创新</h2>
            <p>我们致力于通过前沿技术和人性化设计，重新定义人与宠物的关系。我们的每一个产品，都是对传统养宠方式的一次革新，旨在为您和您的爱宠带来更智能、更健康、更便捷的生活体验。</p>
            <p>从精准的科学喂养到实时的健康监测，我们相信，科技的力量能够让爱宠的每一个瞬间都充满关怀与安心。</p>
          </div>
        </div>
      </section>

      <section class="team-section">
        <div class="team-container">
          <div class="text-content">
            <h2>团队</h2>
            <p>我们的团队由一群充满激情的设计师、工程师、兽医和宠物爱好者组成。我们因对宠物的热爱而相聚，致力于将这份热爱融入到每一个产品的细节之中。</p>
            <p>我们相信，只有真正懂宠物的人，才能创造出它们真正需要和喜爱的产品。我们为共同的使命而努力：让每一个养宠家庭的生活都变得更加美好。</p>
          </div>
          <div class="image-grid">
            <div class="image-placeholder"></div>
            <div class="image-placeholder"></div>
            <div class="image-placeholder"></div>
            <div class="image-placeholder"></div>
          </div>
        </div>
      </section>

      <section class="closing-section">
        <div class="closing-container">
          <p class="closing-text">Because when you get to share a life with your pets, they improve every aspect of your life in return.</p>
          <div class="closing-image-placeholder"></div>
        </div>
      </section>
      
      <section class="info-section">
        <div class="info-container image-right">
          <div class="info-text">
            <h3>文案产品</h3>
            <p>我们专注于创造有意义的连接。通过我们的产品，我们希望不仅能解决您在养宠过程中的痛点，更能深化您与爱宠之间的情感纽带。</p>
          </div>
          <div class="info-image-placeholder"></div>
        </div>
      </section>
      
      <section class="info-section">
        <div class="info-container">
          <div class="info-image-placeholder"></div>
          <div class="info-text">
            <h3>文案产品</h3>
            <p>我们相信价值与回报。投资于优质的宠物生活产品，就是投资于您家庭的快乐和福祉。我们的目标是提供高性价比的解决方案，让每一分投入都物有所值。</p>
          </div>
        </div>
      </section>

      <section class="mission-section">
        <div class="mission-container">
          <h2 class="section-title">Our mission</h2>
          <div class="mission-cards-container">
            <div class="mission-card tilt-left">
              <div class="card-image-placeholder"></div>
              <p class="card-caption">文案</p>
            </div>
            <div class="mission-card">
              <div class="card-image-placeholder"></div>
              <p class="card-caption">文案</p>
            </div>
            <div class="mission-card tilt-right">
              <div class="card-image-placeholder"></div>
              <p class="card-caption">文案</p>
            </div>
          </div>
        </div>
      </section>
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
/* ... (之前的样式保持不变) ... */
.about-us-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.header-wrapper {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #fff;
}
.header-wrapper :deep(.main-nav a),
.header-wrapper :deep(.header-actions .el-icon),
.header-wrapper :deep(.el-dropdown-link),
.header-wrapper :deep(.logo img) {
  color: var(--text-color);
  filter: none;
}
.main-content {
  flex-grow: 1;
}
.hero-section {
  width: 100%;
}
.hero-image-placeholder {
  width: 100%;
  height: 500px;
  background-color: #e9ecef;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: #adb5bd;
}
.stats-section {
  padding: 80px 20px;
}
.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  text-align: center;
}
.stat-item {
  flex: 1;
  padding: 0 15px;
}
.stat-title {
  font-size: 16px;
  color: #6c757d;
  margin: 0 0 10px 0;
}
.stat-value {
  font-size: 36px;
  font-weight: 600;
  color: #343a40;
  margin: 0;
}

/* ======================================================= */
/* ▼▼▼ 【新增】创新理念部分的样式 ▼▼▼ */
/* ======================================================= */
.innovation-section {
  padding: 80px 20px;
  background-color: #fff;
}
.innovation-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 60px; /* 图片和文字之间的间距 */
}

/* 左侧图片网格样式 */
.image-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr; /* 两列 */
  grid-template-rows: 1fr 1fr;    /* 两行 */
  gap: 20px; /* 图片之间的间距 */
}
.image-placeholder {
  width: 100%;
  aspect-ratio: 1 / 1; /* 保持正方形 */
  background-color: #e9ecef;
  border-radius: 12px;
}

/* 右侧文案样式 */
.text-content {
  flex: 1;
}
.text-content h2 {
  font-size: 42px;
  font-weight: 600;
  margin-bottom: 25px;
}
.text-content p {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  margin-bottom: 20px;
}

/* ======================================================= */
/* ▼▼▼ 【新增】团队介绍部分的样式 ▼▼▼ */
/* ======================================================= */
.team-section {
  padding: 80px 20px;
  background-color: #f8f9fa; /* 给一个浅灰色背景以作区分 */
}
.team-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 60px;
}

/* ======================================================= */
/* ▼▼▼ 【新增】结尾部分的样式 ▼▼▼ */
/* ======================================================= */
.closing-section {
  padding: 80px 20px;
}
.closing-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}
.closing-text {
  font-size: 28px;
  font-weight: 500;
  line-height: 1.5;
  max-width: 800px;
  margin: 0 auto 40px auto; /* 上下左右居中，并设置下边距 */
}
.closing-image-placeholder {
  width: 1800px;
  height: 500px; /* 您可以根据需要调整图片高度 */
  background-color: #e9ecef;
  border-radius: 12px;
}

/* ======================================================= */
/* ▼▼▼ 【新增】产品介绍部分的样式 ▼▼▼ */
/* ======================================================= */
.info-section {
  padding: 80px 20px;
}
.info-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 60px;
}
/* 通过这个类来控制图片在右侧 */
.info-container.image-right {
  flex-direction: row-reverse;
}
.info-text {
  flex: 1;
}
.info-text h3 {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 20px;
}
.info-text p {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
}
.info-image-placeholder {
  flex: 1;
  width: 100%;
  aspect-ratio: 4 / 3; /* 图片宽高比 */
  background-color: #e9ecef;
  border-radius: 12px;
}

/* ======================================================= */
/* ▼▼▼ 【新增】Our Mission 部分的样式 ▼▼▼ */
/* ======================================================= */
.mission-section {
  padding: 80px 20px;
  background-color: #fff;
}
.mission-container {
  max-width: 1200px;
  margin: 0 auto;
}
.mission-section .section-title {
  text-align: left; /* 标题居左 */
  font-size: 36px;
}
.mission-cards-container {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  margin-top: 40px;
  /* perspective 属性为3D效果提供景深 */
  perspective: 1500px;
}
.mission-card {
  flex: 1;
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: transform 0.4s ease;
}
.mission-card:hover {
  transform: translateY(-10px);
}
.card-image-placeholder {
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #e9ecef;
}
.card-caption {
  padding: 20px;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
}
/* 3D 倾斜效果 */
.tilt-left {
  transform: rotateY(15deg);
}
.tilt-left:hover {
  transform: rotateY(10deg) translateY(-10px);
}
.tilt-right {
  transform: rotateY(-15deg);
}
.tilt-right:hover {
  transform: rotateY(-10deg) translateY(-10px);
}
</style>