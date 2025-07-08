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
import { getPhotoDetails } from '../api';

const images = ref([]);

// 2. 使用新的API函数重构数据获取逻辑
const fetchGalleryData = async () => {
  try {
    // API模块已经处理了URL拼接和错误
    images.value = await getPhotoDetails(3); // type=3 for Gallery
  } catch (error) {
    // API模块中已经console.error了，这里可以根据需要做一些UI上的提示
    console.error("在GalleryCarousel组件中捕获到错误:", error);
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