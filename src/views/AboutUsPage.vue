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
            <div class="intro-tagline-wrapper">
              <span class="tagline-line">PETS CLAN</span>
              <span class="tagline-line">EFFORTLESS</span>
              <span class="tagline-line">PET CARE.</span>
            </div>
          </div>
          <div class="intro-right">
            <p class="description">
              At Pets Clan, we are committed to bringing a smarter, greener, and more convenient pet lifestyle to every pet owner. We firmly believe that Technology and Design should be centered on user needs to create products that can truly improve the quality of life.
            </p>
            <p class="description">
              We are not only a promoter of technology, but also a bridge between pets and pet owners, helping you to establish a deeper emotional connection with your pet.
            </p>
            <img src="/images/signature.png" alt="Pets Clan Signature" class="signature-image">
          </div>
          </div>
      </section>

      <section class="image-banner-section">
        <img src="/images/about-us-banner.jpg" alt="Pets Clan Banner" class="banner-image">
      </section>

      <section class="features-section">
        <div class="features-container">
          <div v-for="(feature, index) in featuresData" :key="index" class="feature-item">
            <img :src="feature.icon" :alt="feature.title" class="feature-icon">
            <h3 class="feature-title" v-html="feature.title"></h3>
            <p class="feature-description" v-html="feature.description"></p>
            </div>
        </div>
      </section>

      <section class="lifelong-friends-section">
        <div class="lifelong-friends-container">
          <div class="lf-left">
            <img src="/images/pet-feeder-promo.png" alt="Pets Clan Smart Feeder">
          </div>
          <div class="lf-right">
            <h2 class="lf-title">PETS CLAN,<br>FEEDING LIFELONG FRIENDSHIPS.</h2>
            <p class="lf-description">
              ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopgrstuwwx234567890JSAHJDSA
              HBDHASXJHSAJHXJSHAXJUSAHCXHSAJKCHUSAHCJKASHCUHSAJCHJASHCUJASGBCHA
              GCSSCGHASHC]KHXJCHASUHC]XHAC]HZXJCHIASHXCJASHCJHASC]ZHCJKSAHSHFDIE
              SHDIHYSDIYHASDHYUASHYDUAHSYDUAYSHDIUASIODHASIODJOIASJUDIOASUIDOI
              ASUDIIOASUIDOIASUDHIASUDIOUSAIDIUAIOSDUIIASUDIIASIUDIOASUDIASIU
            </p>
            <p class="lf-description">
              ABCDEFGHIKLMNOPORSTUVWXYZabcdefghiklmnoparstuwwx234567890ISAHIDSA
              HBDHASXJHSAJHXJSHAXJUSAHCXH5AJKCHUSAHCJKASHCUHSAJCHJASHCUJASGBCHA
              GCSSCGHASHC]KHX]CHASUHC]XHAC]HZX]JCHIASHXCJASHC|HASC]ZHCIKSAH
            </p>
            <div class="lf-stats">
              <div class="stat-item">
                <span class="stat-value">130+</span>
                <span class="stat-label">experimental test results</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">400+</span>
                <span class="stat-label">Precise feeding</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">100h+</span>
                <span class="stat-label">Long-lasting battery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="about-ponti-section">
        <div class="ponti-container">
          <div class="ponti-left">
            <h3 class="ponti-subtitle">ABOUT PONTI</h3>
            <h2 class="ponti-title">HONGDIANJIANG IFJIANG<br>DUOCI HUODEZHE</h2>
            <p class="ponti-description">
              Ades ront, ton n 1t485 n coyisri sal s a long Kongbased thtisn dsignerxpekiangn ppducandiustrnidsign.le pplecs comtine he deane df istn dsig wifhe igtnesof ks psnese miimalism. Ater serenyesrsin jags, Andres Pontinaw fesin Hang Kang where he ibunded Poni Deign Shrdion 2012. Hedeigs for mulildie gobstomparies,induding Caseify fends. Hser REF,Kotcik, Mona, Nelsse, Qong, pnasomc, The Peniusus ibsh, Phil, and Ssmsonite He hs rececned numerusnkitersnslensignansrd, induding the ped Dot Deign Award, he if Deign Anar, andithe Good Design Award.
            </p>
            <p class="ponti-description">
              A gaduste aithe Porecnicodf Milan, al Andes Poni ied seren yesrin anan betnesn 2006 arid 2011 He sared asa resesrdher n indusid and fansprtiondesgnatkyushu Unversily in fhaoka and weton to wekas a youngdesane undihe guidcnee of lapanese design mastes Chiskl Murata in Osakaand junzo Yamashits in Kyota. In these formstive yesrs, Andres Pontl honed his artisic inguags, design sitband knowe dge of kechndog a weias ta dfonal kpanese msteras and manubvckuing ischriques.
            </p>
          </div>
          <div class="ponti-right">
            <img src="/images/about-ponti-portrait.jpg" alt="Portrait of Ponti" class="ponti-portrait">
            <span class="ponti-vertical-name">PO<br>NTI</span>
          </div>
        </div>
      </section>

      <section class="about-clan-section">
        <div class="clan-container">
          <h2 class="clan-title">About Pets Clan</h2>
          <div class="clan-video-wrapper">
            <img src="/images/about-clan-video-thumb.jpg" alt="About Pets Clan Video" class="video-thumbnail">
            <div class="play-button-overlay">
              <el-icon class="play-icon"><VideoPlay /></el-icon>
            </div>
          </div>
        </div>
      </section>

    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElIcon } from 'element-plus';
import { VideoPlay } from '@element-plus/icons-vue';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

// 为特性区域创建数据源
const featuresData = ref([
  {
    icon: '/images/icons/feature-green.png',
    title: 'Green living, energy conservation<br>and environmental protection',
    description: 'Waste-free design, responsible for<br>pets and the planet'
  },
  {
    icon: '/images/icons/feature-intelligent.png',
    title: 'Intelligent control,<br>feeding at any time',
    description: 'Remotely monitor your pet’s health<br>and feed them anytime'
  },
  {
    icon: '/images/icons/feature-simple.png',
    title: 'Simple design,<br>zero waste',
    description: 'No need for extra consumables,<br>with environmental protection<br>and intelligence going hand in hand'
  },
  {
    icon: '/images/icons/feature-reddot.png',
    title: 'Red Dot Design,<br>a choice of quality',
    description: 'Award-winning design, a perfect<br>integration of technology and aesthetics'
  }
]);

// ▼▼▼ START: SCRIPT MODIFICATION ▼▼▼
const formatTitle = (title) => {
  return title.replace(',', ',<br>');
};
// ▲▲▲ END: SCRIPT MODIFICATION ▲▲▲
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
  padding: 100px 20px;
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
  /* gap: -150px; */
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

/* ▼▼▼ START: CSS MODIFICATION FOR PARAGRAPH ▼▼▼ */
.description {
  font-size: 22px;
  line-height: 1.8;
  color: #333;
  margin: 0 0 24px 0; /* 统一段落的下边距 */
}
.signature-image {
  /* 控制点 1: 调整宽度来改变大小 */
  width: 70px; 
  height: auto;
  padding-left: 0px;
  /* 控制点 2: 调整上边距来改变与上方段落的距离 */
  margin-top: -20px; 
}
/* ▲▲▲ END: CSS MODIFICATION FOR PARAGRAPH ▲▲▲ */


/* ▼▼▼ START: CSS MODIFICATION FOR TAGLINE ▼▼▼ */
.intro-tagline-wrapper {
  display: flex;
  flex-direction: column;
}
.tagline-line {
  font-size: 60px;
  font-weight: bold;
  letter-spacing: 2px;
  line-height: 1.2;
  color: #000;
  white-space: nowrap;
}
.tagline-line:nth-child(1) {
  margin-bottom: 90px; /* 拉大第一行和第二行的间距 */
}
.tagline-line:nth-child(2) {
  margin-bottom: 15px; /* 第二行和第三行的间距 */
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
  width: 160px;
  height: 160px;
  margin-bottom: 20px;
}
.feature-title {
  font-size: 24px;
  font-weight: bold;
  color: #000;
  margin: 0 0 10px 0;
  line-height: 1.4;
}
.feature-description {
  font-size: 22px;
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

lf-right {
  /* 控制点 3: 调整右侧文字部分的宽度 */
  width: 480px;
  flex-shrink: 0; /* 防止被压缩 */
}

.lf-title {
  font-size: 60px;
  font-weight: bold;
  color: #000;
  line-height: 1.3;
  margin: 0 0 20px 0;
  letter-spacing: 1px;
}

.lf-description {
  font-size: 22px;
  color: #555;
  line-height: 1.7;
  margin: 0 0 24px 0;
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
  font-size: 36px;
  font-weight: bold;
  color: #000;
  line-height: 1.1;
}

.lf-stats .stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
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
  font-size: 24px;
  font-weight: bold;
  color: #555;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0 0 10px 0;
}

.ponti-title {
  font-size: 60px;
  font-weight: bold;
  color: #000;
  line-height: 1.4;
  text-transform: uppercase;
  margin: 0 0 30px 0;
}

.ponti-description {
  font-size: 22px;
  color: #666;
  line-height: 1.8;
  margin: 0 0 20px 0;
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
  font-size: 60px;
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
  font-size: 60px;
  font-weight: bold;
  color: #000;
  margin: 0 0 40px 0;
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
  font-size: 80px;
  color: white;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  padding: 20px;
  transition: transform 0.3s ease;
}

.clan-video-wrapper:hover .play-icon {
  transform: scale(1.1);
}
</style>