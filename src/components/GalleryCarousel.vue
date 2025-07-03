<template>
  <section class="gallery-section">
    <h2>{{ $t('gallery.title') }}</h2>
    <div class="carousel-wrapper">
      <el-carousel 
        ref="carouselRef" 
        height="400px" 
        :autoplay="false" 
        arrow="never" 
        indicator-position="none">
        <el-carousel-item v-for="item in galleryImages" :key="item">
          <img :src="`/images/gallery-${item}.jpg`" class="carousel-image"/>
        </el-carousel-item>
      </el-carousel>

      <div class="nav-overlay left" @click="prevSlide"></div>
      <div class="nav-overlay right" @click="nextSlide"></div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const carouselRef = ref(null);
const galleryImages = [1, 2, 3, 4, 5]; // 假设有5张图

const prevSlide = () => {
  carouselRef.value?.prev();
};

const nextSlide = () => {
  carouselRef.value?.next();
};
</script>

<style scoped>
.gallery-section {
  padding: 80px 0;
  text-align: center;
  background-color: var(--light-gray-color);
}

.gallery-section h2 {
  font-size: 32px;
  margin-bottom: 40px;
}

.carousel-wrapper {
  max-width: var(--container-width);
  margin: 0 auto;
  position: relative;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nav-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 30%; /* 点击区域宽度 */
  z-index: 10;
  cursor: pointer;
}

.nav-overlay.left {
  left: 0;
}

.nav-overlay.right {
  right: 0;
}
</style>