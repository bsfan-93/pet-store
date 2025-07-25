<template>
  <el-carousel 
    class="hero-section-carousel"
    height="100vh" 
    arrow="never"
    :interval="5000"
  >
    <el-carousel-item v-for="banner in banners" :key="banner.id">
      <div 
        class="carousel-slide" 
        :style="{ backgroundImage: `url(${banner.url})` }"
      >
        <div class="hero-content">
          <h1>
            {{ t('hero.title1') }}<br>
            {{ t('hero.title2') }}
          </h1>
          <el-button type="success" class="shop-now-btn">
            {{ t('hero.shop_now') }}
          </el-button>
        </div>
      </div>
    </el-carousel-item>
  </el-carousel>
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
/* 轮播组件的整体样式 */
.hero-section-carousel {
  height: 100vh;
}

/* 【修改】单个轮播幻灯片的样式 
  - 添加 position: relative; 作为定位上下文
  - 删除了 flex 相关的属性
*/
.carousel-slide {
  position: relative;     /* 新增：为绝对定位的子元素提供容器 */
  width: 100%;
  height: 100%;
  background-size: cover;     /* 确保背景图覆盖整个区域并自适应 */
  background-position: center;
}

/* 【修改】文本和按钮的容器样式
  - 改为绝对定位，固定在左下角
*/
.hero-content {
  position: absolute; /* 新增 */
  bottom: 3.125vw;       /* 调整：距离底部的位置，使其随视口宽度缩放 */
  left: 10vw;        /* 调整：距离左边的位置，使其随视口宽度缩放 */
  z-index: 10;        /* 新增：确保在图片上层 */
  color: var(--secondary-color);
}

/* <h1> 标签的具体样式 (保持不变) */
.hero-content h1 {
  font-size: 2.708vw;   /* 调整：字体大小随视口宽度缩放 */
  font-weight: 400;
  margin-bottom: 1.5625vw; /* 调整：边距随视口宽度缩放 */
  line-height: 1.2;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}

/* "Shop Now" 按钮样式 (保持不变) */
.shop-now-btn {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--secondary-color);
  padding: 1.04vw 2.08vw; /* 20px/19.2vw 40px/19.2vw */
  border-radius:  2.6vw; /* 50px/19.2vw */
  border-width: 0.1vw; /* 2px/19.2vw */
  font-size: 0.9375vw; /* 18px/19.2vw */
  font-weight: bold;
  letter-spacing: 0.052vw; /* 1px/19.2vw */
  transition: all 0.3s ease;
}

.shop-now-btn:hover {
    background-color: var(--accent-color);
    border-color: var(--accent-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}


/* ▼▼▼【重点修改】轮播指示器的样式 ▼▼▼ */

/* 【新增】指示器容器的样式
  - 将整个指示器区域绝对定位到右下角
*/
:deep(.el-carousel__indicators--horizontal) {
  position: absolute;
  bottom: 78px;  /* 调整此值以与按钮垂直对齐 */
  right: 10%;
  left: auto; /* 取消Element Plus默认的居中 */
  transform: none; /* 取消Element Plus默认的居中 */
  z-index: 10;
}

/* 【修改】单个指示器(小圆点)的样式
  - 修改宽高，使其拉长
*/
:deep(.el-carousel__indicator--horizontal .el-carousel__button) {
  width: 40px;   /* 拉长宽度 */
  height: 4px;   /* 减小高度 */
  background: rgba(255, 255, 255, 0.5); /* 未选中时的颜色 */
  border-radius: 2px; /* 设置圆角 */
  border: none; /* 移除边框 */
  opacity: 1;
}

/* 【修改】当前激活的指示器的样式
*/
:deep(.el-carousel__indicator--horizontal.is-active .el-carousel__button) {
  background: var(--secondary-color); /* 选中时的颜色 (例如: 白色) */
}
</style>