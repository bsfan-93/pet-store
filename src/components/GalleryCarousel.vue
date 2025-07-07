<template>
  <section class="gallery-section" v-if="images.length > 0">
    <div class="container">
      <el-carousel
        :interval="4000"
        arrow="always"
        height="450px"
        class="card-carousel"
        indicator-position="outside"
      >
        <el-carousel-item v-for="image in images" :key="image.id">
          <img :src="image.url" :alt="image.name" class="carousel-image" />
        </el-carousel-item>
      </el-carousel>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElCarousel, ElCarouselItem } from 'element-plus';

// 1. 将数据状态和获取逻辑都放在组件内部
const images = ref([]);

const fetchGalleryData = async () => {
  try {
    const response = await fetch('http://192.168.2.9:9999/standalones/photo/details?type=3');
    if (!response.ok) throw new Error('Gallery API Error');
    const result = await response.json();
    if (result.success && Array.isArray(result.data)) {
      const baseUrl = 'http://192.168.2.9:9999';
      images.value = result.data.map(item => ({...item, url: baseUrl + item.url}));
    }
  } catch (error) {
    console.error("获取Gallery数据失败:", error);
  }
};

// 2. 在组件自己挂载时，调用自己的数据获取函数
onMounted(() => {
  fetchGalleryData();
});
</script>

<style scoped>
/* 样式与我们之前确认的最终版保持一致 */
.gallery-section { padding: 60px 0 80px 0; background-color: #f4f3f0; overflow-x: hidden; }
.container { max-width: var(--container-width, 1200px); margin: 0 auto; }
.card-carousel { width: calc(100% + 400px); margin: 0 -200px; }
:deep(.el-carousel__container) { height: 100% !important; }
:deep(.el-carousel__item) { width: 55%; padding: 0 15px; box-sizing: border-box; transition: transform 0.4s ease; }
.carousel-image { display: block; width: 100%; height: 100%; object-fit: cover; border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
:deep(.el-carousel__arrow) { background-color: rgba(0, 0, 0, 0.3); font-size: 24px; width: 50px; height: 50px; }
:deep(.el-carousel__arrow:hover) { background-color: rgba(0, 0, 0, 0.5); }
:deep(.el-carousel__indicators--outside) { position: static; margin-top: 30px; }
:deep(.el-carousel__indicator button) { background-color: #a0a0a0; }
:deep(.el-carousel__indicator.is-active button) { background-color: #333; }
</style>