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
            {{ $t('hero.title1') }}<br>
            {{ $t('hero.title2') }}
          </h1>
          <el-button type="success" class="shop-now-btn">{{ $t('hero.shop_now') }}</el-button>
        </div>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script setup>
// 定义props，接收从HomePage传递过来的banners数组
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

/* 单个轮播幻灯片的样式 */
.carousel-slide {
  width: 100%;
  height: 100%;
  /* 设置背景图样式 */
  background-size: cover;
  background-position: center;
  /* 使用 Flexbox 来垂直居中内容 */
  display: flex;
  flex-direction: column;
  justify-content: center;      /* 这个属性控制垂直对齐 */
  align-items: flex-start;      /* 内容靠左对齐 */
  padding-left: 10%;             /* 和之前保持一致的左边距 */
}

/* 文本和按钮的容器样式，基本保持不变 */
.hero-content {
  position: relative;
  color: var(--secondary-color);            /* <-- 控制文字颜色 (当前为白色) */
  padding-top: calc(var(--header-height) + 28px);
  transform: translateY(200px); /* 示例: 从中心点向上移动30像素 */
}

/* <h1> 标签的具体样式 */
.hero-content h1 {
  font-size: 52px;    /* <-- 控制字体大小 */
  font-weight: 400;                     /* <-- 控制字体粗细 (例如 700是bold) */
  margin-bottom: 30px;
  line-height: 1.2;
  /* 如果背景图片是深色的，可以给文字加阴影使其更清晰 */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}

.shop-now-btn {
  /* 颜色 */
  background-color: var(--primary-color);     /* 示例: 换成一个活泼的珊瑚色 */
  border-color: var(--primary-color);         /* 边框颜色最好和背景色保持一致 */
  color: var(--secondary-color);              /* 按钮内部文字的颜色 */

  /* 尺寸和形状 */
  padding: 20px 40px;        /* 示例: 让按钮更大一些 */
  border-radius: 50px;       /* 示例: 变成圆角的胶囊形状 */
  border-width: 2px;         /* 示例: 增加边框宽度 */

  /* 文字样式 */
  font-size: 18px;           /* 示例: 增大按钮内的字体 */
  font-weight: bold;         /* 字体加粗 */
  letter-spacing: 1px;       /* 增加文字间距 */

  /* 鼠标悬停效果 */
  transition: all 0.3s ease;
}

/* 你还可以为按钮添加一个鼠标悬停的效果 */
.shop-now-btn:hover {
    background-color: var(--accent-color);   /* 鼠标悬停时颜色变深 */
    border-color: var(--accent-color);
    transform: translateY(-2px); /* 轻微上浮 */
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

/* Element Plus 轮播指示器(小圆点)的样式美化 (可选) */
:deep(.el-carousel__indicator--horizontal .el-carousel__button) {
  width: 10px;
  height: 10px;
  background: transparent;
  border: 1px solid var(--text-color);
  border-radius: 50%;
  opacity: 0.8;
}

:deep(.el-carousel__indicator--horizontal.is-active .el-carousel__button) {
  background: var(--text-color);
}
</style>