<template>
  <section 
    v-if="imageUrl"
    class="how-to-section"
    :style="{ backgroundImage: `url(${imageUrl})` }"
  >
    <div class="content-overlay">
      <h2>{{ $t('how_to.title') }}</h2>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 1. 创建一个ref来存储图片的URL
const imageUrl = ref('');

// 2. 创建一个函数来获取数据
const fetchHowToImage = async () => {
  try {
    const response = await fetch('http://192.168.2.9:9999/standalones/photo/details?type=4');
    if (!response.ok) throw new Error('HowToSection API Error');
    const result = await response.json();

    // 检查请求是否成功，data是否为数组且不为空
    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      const baseUrl = 'http://192.168.2.9:9999';
      // API返回的是数组，我们只取第一项
      const imageItem = result.data[0]; 
      imageUrl.value = baseUrl + imageItem.url;
    }
  } catch (error) {
    console.error("获取HowToSection图片失败:", error);
  }
};

// 3. 在组件挂载时，调用获取数据的函数
onMounted(() => {
  fetchHowToImage();
});
</script>

<style scoped>
.how-to-section {
  height: 90vh; /* 可以适当调整高度 */
  background-size: cover;
  background-position: center;
  color: var(--secondary-color);
  
  /* 【关键修改】使用Flexbox将内容定位到左下角 */
  display: flex;
  justify-content: flex-end;  /* 垂直方向：底部对齐 */
  align-items: flex-start; /* 水平方向：左侧对齐 */

  /* 使用padding来控制文字和边缘的距离 */
  box-sizing: border-box; /* 确保padding不会撑大元素 */
  padding: 0 0 10vh 10%; /* 上 右 下 左, 你可以调整左和下的值 */
}

.content-overlay {
  text-align: left; /* 文字本身左对齐 */
}

.content-overlay h2 {
  font-size: var(--font-size-title);
  text-shadow: 2px 2px 4px rgba(0,0,0,0.6); /* 可以适当加深阴影使其更清晰 */
  max-width: 400px; /* 给文字一个最大宽度，避免在超宽屏上拉伸太长 */
}
</style>