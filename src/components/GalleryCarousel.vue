<!-- 首页的画廊轮播图，以富有视觉冲击力的方式展示产品图片。 -->

<template>
  <section class="gallery-section" v-if="images.length > 0">
    <div class="swiper-container">
      <swiper
        @swiper="onSwiper"
        :modules="[EffectCoverflow, Pagination, Navigation, Autoplay]"
        :effect="'coverflow'"
        :grab-cursor="true"
        :centered-slides="true"
        :slides-per-view="'auto'"
        :coverflow-effect="{
          rotate: 20,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }"
        :pagination="{ clickable: true }"
        :navigation="{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }"
        :loop="true"
        :initial-slide="1"
        class="my-swiper"
      >
        <swiper-slide v-for="image in images" :key="image.id">
          <img :src="image.url" :alt="image.name" class="carousel-image" />
        </swiper-slide>
      </swiper>

      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
      <!-- // 播放按钮 -->
      <!-- <div class="autoplay-control" @click="toggleAutoplay">
        <el-icon v-if="!isPlaying"><VideoPlay /></el-icon>
        <el-icon v-else><VideoPause /></el-icon>
      </div> -->
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPhotoDetails } from '../api';
import { ElIcon } from 'element-plus';
import { VideoPlay, VideoPause } from '@element-plus/icons-vue';

// 重新導入 Navigation 模組
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const images = ref([]);
const swiperInstance = ref(null);
// 播放按钮
// const isPlaying = ref(false);

const onSwiper = (swiper) => {
  swiperInstance.value = swiper;
};
// 播放按钮
// const toggleAutoplay = () => {
//   if (swiperInstance.value) {
//     if (isPlaying.value) {
//       swiperInstance.value.autoplay.stop();
//     } else {
//       swiperInstance.value.autoplay.start();
//     }
//     isPlaying.value = !isPlaying.value;
//   }
// };

// const fetchGalleryData = async () => {
//   try {
//     images.value = await getPhotoDetails(3);
//   } catch (error) {
//     console.error("在GalleryCarousel组件中捕获到错误:", error);
//   }
// };

const fetchGalleryData = async () => {
  try {
    const results = await getPhotoDetails(3);

    // ▼▼▼ 【修改 2/2】检查图片数量，如果太少则复制数组 ▼▼▼
    if (results && results.length > 0 && results.length < 6) {
      // 如果API返回的图片少于6张，就将数组复制一次来确保loop正常工作
      images.value = [...results, ...results];
    } else {
      // 否则，正常使用返回的数组
      images.value = results;
    }
    // ▲▲▲ 修改结束 ▲▲▲

  } catch (error) {
    console.error("在GalleryCarousel组件中捕获到错误:", error);
  }
};

onMounted(() => {
  fetchGalleryData();
});
</script>

<style scoped>
.gallery-section {
  padding: 110px 0;
  background-color: #fff;
  overflow: hidden;
}

.swiper-container {
  position: relative;
  max-width: var(--container-width, 1200px);
  margin: 0 auto;
}

.my-swiper {
  /* 2. 設定一個固定的高度來鎖定尺寸 */
  height: 700px; 
  padding-bottom: 40px; /* 為下方的圓點留出空間 */
}

.swiper-slide {
  /* 1. 使用百分比設定寬度，使其隨容器縮放 */
  width: 45%; 
  
  /* 2. 使用 aspect-ratio 精確鎖定 550x500 的比例 */
  aspect-ratio: 550 / 500; 
}

.carousel-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

/* --- 1. 隱形但可點擊的導覽箭頭 --- */
.swiper-button-prev,
.swiper-button-next {
  position: absolute;
  top: 0;
  width: 25%; /* 佔據容器左右各 25% 的寬度作為點擊區域 */
  height: 100%;
  z-index: 10;
  cursor: pointer;
}
.swiper-button-prev {
  left: 0;
}
.swiper-button-next {
  right: 0;
}
/* 移除預設的箭頭圖示 */
.swiper-button-prev::after,
.swiper-button-next::after {
  content: ''; 
}

:deep(.swiper-pagination) {
  bottom: 0;
}
:deep(.swiper-pagination-bullet) {
  background-color: #968C82;
  opacity: 1;
}
:deep(.swiper-pagination-bullet-active) {
  background-color: #000;
}

/* --- 全尺寸適配 --- */
@media (max-width: 767px) {
  .my-swiper {
    height: 270px;
  }
  .swiper-slide {
    width: 275px;
    height: 250px;
  }
}
</style>