<!-- 首页的一个图文介绍模块。 -->

<template>
  <section 
    v-if="imageUrl"
    class="how-to-section"
    :style="{ backgroundImage: `url(${imageUrl})` }"
  >
    <div class="content-overlay">
      <h2>{{ t('how_to.title') }}</h2>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getPhotoDetails } from '../api';

const { t } = useI18n();
const imageUrl = ref('');

const fetchHowToImage = async () => {
  try {
    const images = await getPhotoDetails(4);
    if (images && images.length > 0) {
      imageUrl.value = images[0].url;
    }
  } catch (error) {
    console.error("在HowToSection组件中捕获到错误:", error);
  }
};

onMounted(() => {
  fetchHowToImage();
});
</script>

<style scoped>
.how-to-section {
  /* height: 90vh; */ /* <-- 【刪除】移除固定的視窗高度 */
  aspect-ratio: 2 / 1; /* ▼▼▼ 【新增】設定一個 2:1 的長寬比 ▼▼▼ */
  background-size: cover;
  background-position: center;
  color: var(--secondary-color);
  
  /* 【关键修改】使用Flexbox将内容定位到左下角 */
  display: flex;
  justify-content: flex-end;  /* 垂直方向：底部对齐 */
  align-items: flex-start; /* 水平方向：左侧对齐 */

  /* 使用padding来控制文字和边缘的距离 */
  box-sizing: border-box; /* 确保padding不会撑大元素 */
  padding: 0 0 10vh 10vm; /* 调整：使内边距随视口宽度缩放 */
}

.content-overlay {
  text-align: left; /* 文字本身左对齐 */
}

.content-overlay h2 {
  font-size: 2.5vw; /* 假设设计稿标题是 48px，基准宽度 1920px (48/1920*100) */
  text-shadow: 2px 2px 4px rgba(0,0,0,0.6); /* 可以适当加深阴影使其更清晰 */
  max-width: 20.83vw; /* 假设原来 max-width 400px (400/1920*100) */
}

@media (max-width: 767px) {
    .content-overlay h2 {
        font-size: 28px;
    }
}

/* ▼▼▼ 【新增】針對手機的響應式樣式 ▼▼▼ */
@media (max-width: 767px) {
  .how-to-section {
    height: auto; /* 移除固定的視窗高度 */
    aspect-ratio: 4 / 3; /* 設定一個適合手機的長寬比，例如 4:3 */
    padding: 0 0 5vh 5vw; /* 調整文字位置 */
  }

  .content-overlay h2 {
    font-size: 28px; /* 固定標題字體大小 */
    max-width: none; /* 移除最大寬度限制 */
  }
}
</style>