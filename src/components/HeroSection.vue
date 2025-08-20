<template>
  <div class="hero-section-wrapper">
    <el-carousel 
      class="hero-section-carousel"
      height="100vh" 
      arrow="never"
      :interval="5000"
    >
      <el-carousel-item v-for="(banner, index) in banners" :key="banner.id">
        <div 
          class="carousel-slide" 
          :style="{ backgroundImage: `url(${banner.url})` }"
        >
          <div class="hero-content">
            <h1>
              {{ t('hero.title1') }}<br>
              {{ t('hero.title2') }}
            </h1>
            
            <router-link :to="index === 0 ? '/shop/all' : `/product/${banner.goodId}`">
              <el-button v-if="index === 0 || banner.goodId" type="success" class="shop-now-btn">
                {{ t('hero.shop_now') }}
              </el-button>
            </router-link>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ElCarousel, ElCarouselItem, ElButton } from 'element-plus';

const { t } = useI18n();

defineProps({
  banners: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.hero-section-wrapper {
  width: 100%;
  height: 100vh; 
}
.hero-section-carousel {
  height: 100vh;
}
.carousel-slide {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position:  center center;
}
.hero-content {
  position: absolute;
  bottom: 3.125vw;
  left: 10vw;
  z-index: 10;
  color: #fff;
}
.hero-content h1 {
  font-size: 2.708vw;
  font-weight: 400;
  margin-bottom: 1.5625vw;
  line-height: 1.2;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}
.shop-now-btn {
  background-color: #92C45C;
  border-color: #92C45C;
  color: var(--secondary-color);
  padding: 1.04vw 2.08vw;
  border-radius:  2.6vw;
  border-width: 0.1vw;
  font-size: 0.9375vw;
  font-weight: bold;
  letter-spacing: 0.052vw;
  transition: all 0.3s ease;
}
.shop-now-btn:hover {
    background-color: #92C45C;
    border-color: #92C45C;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
:deep(.el-carousel__indicators--horizontal) {
  position: absolute;
  bottom: 78px;
  right: 10%;
  left: auto;
  transform: none;
  z-index: 10;
}
:deep(.el-carousel__indicator--horizontal .el-carousel__button) {
  width: 40px;
  height: 4px;
  background: rgba(150, 140, 130, 0.5);
  border-radius: 2px;
  border: none;
  opacity: 1;
}
:deep(.el-carousel__indicator--horizontal.is-active .el-carousel__button) {
  background: var(--secondary-color);
}
@media (max-width: 767px) {
  .hero-content h1 {
    font-size: 32px;
    margin-bottom: 20px;
  }
  .hero-section-wrapper,
  .hero-section-carousel {
    height: 60vh;
  }
  .shop-now-btn {
    font-size: 16px;
    padding: 12px 24px;
  }
  :deep(.el-carousel__indicators--horizontal) {
    bottom: 20px;
  }
}
</style>