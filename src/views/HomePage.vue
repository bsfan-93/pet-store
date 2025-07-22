<template>
  <div class="home-page">
    <div class="header-wrapper">
      <TopBanner v-show="showTopBanner" />
      <AppHeader :is-scrolled="isHeaderScrolled" />
    </div>
    
    <main>
      <HeroSection :banners="bannerData"/>
      <CollectionList :collections="collectionData" />
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
import SubscribePopup from '../components/SubscribePopup.vue'; // 【新增】导入弹窗组件
import { useAuthStore } from '../stores/auth'; // 【新增】导入 auth store

// =======================================================
// ▼▼▼ 【新增】控制弹窗的逻辑 ▼▼▼
// =======================================================
const isPopupVisible = ref(false);

const authStore = useAuthStore(); // 【新增】获取 auth store 实例

onMounted(() => {
  // 【修改】在设置定时器之前，先检查 localStorage
  const hasSubscribed = localStorage.getItem('hasSubscribed');

  // 只有当用户没有订阅过时，才设置定时器显示弹窗
  if (!hasSubscribed && !authStore.isLoggedIn) {
    setTimeout(() => {
      isPopupVisible.value = true;
    }, 3000);
  }

  window.addEventListener('scroll', handleScroll);
  fetchBannerData();
  fetchCollectionData();
});
// =======================================================

// HomePage 现在只关心自己的数据
const bannerData = ref([]);
const collectionData = ref([]);
const showTopBanner = ref(true);
const isHeaderScrolled = ref(false);

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  showTopBanner.value = scrollTop < 10;
  isHeaderScrolled.value = scrollTop > 50;
};

const fetchBannerData = async () => {
  try {
    bannerData.value = await getPhotoDetails(1);
  } catch (error) {
    console.error("获取Banner数据失败:", error);
  }
};

const fetchCollectionData = async () => {
  try {
    collectionData.value = await getPhotoDetails(2);
  } catch (error) {
    console.error("获取Collection数据失败:", error);
  }
};

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
main { }
</style>