<template>
  <section class="gallery-section" v-if="images.length > 0">
    <div class="container">
      <el-carousel
        :interval="5000"
        type="card"
        height="600px"
        arrow="never"
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

onMounted(() => {
  fetchGalleryData();
});
</script>

<style scoped>
.gallery-section {
  padding: 90px 20px;
  background-color: #f4f3f0;
}
.container {
  max-width: var(--container-width, 1200px);
  margin: 0 auto;
}
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}
:deep(.el-carousel__item) {
  border-radius: 12px;
}
:deep(.el-carousel__indicators--outside button) {
  background-color: #a0a0a0;
}
:deep(.el-carousel__indicator.is-active button) {
  background-color: #333;
}
</style>