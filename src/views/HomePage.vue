<template>
  <div class="home-page home-page-container"> 
    <div class="header-wrapper">
      <TopBanner v-show="showTopBanner" />
      <AppHeader :is-scrolled="isHeaderScrolled" />
    </div>
    
    <main>
      <HeroSection :banners="bannerData"/>
      <CollectionList :collections="collectionData" />

      <InteractiveShowcase 
        :items="showcaseItemsData"
      />

      <GalleryCarousel />
      <HowToSection />
    </main>

    <AppFooter />
    <SubscribePopup v-model="isPopupVisible" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { getPhotoDetails } from '../api';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import HeroSection from '../components/HeroSection.vue';
import CollectionList from '../components/CollectionList.vue';
import GalleryCarousel from '../components/GalleryCarousel.vue';
import HowToSection from '../components/HowToSection.vue';
import AppFooter from '../components/AppFooter.vue';
import SubscribePopup from '../components/SubscribePopup.vue';
import { useAuthStore } from '../stores/auth';
import InteractiveShowcase from '../components/InteractiveShowcase.vue';

const isPopupVisible = ref(false);
const authStore = useAuthStore();
const bannerData = ref([]);
const collectionData = ref([]);
const showTopBanner = ref(true);
const isHeaderScrolled = ref(false);

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  showTopBanner.value = scrollTop < 10;
  isHeaderScrolled.value = scrollTop > 50;
};

// ▼▼▼ 【核心修改】恢復並簡化數據獲取邏輯 ▼▼▼

// 1. 建立一個統一的函數，只獲取首頁需要的數據
const fetchHomePageData = async () => {
  try {
    // 使用 Promise.all 並行獲取 Banner (type=1) 和 Collection (type=2) 的數據
    const [banners, collections] = await Promise.all([
      getPhotoDetails(1),
      getPhotoDetails(2)
    ]);
    bannerData.value = banners;
    collectionData.value = collections;
  } catch (error) {
    console.error("获取首页数据失败:", error);
  }
};

// 2. 在 onMounted 中統一執行所有初始化操作
onMounted(() => {
  // 彈窗邏輯
  const hasSubscribed = localStorage.getItem('hasSubscribed');
  if (hasSubscribed !== 'true' && !authStore.isLoggedIn) {
    setTimeout(() => {
      isPopupVisible.value = true;
    }, 3000);
  }

  // 添加滾動監聽
  window.addEventListener('scroll', handleScroll);
  
  // 呼叫統一的數據獲取函數，這會請求 type=1 和 type=2
  fetchHomePageData();
});

// ▲▲▲ 修改結束 ▲▲▲

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.header-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}
main {}
</style>