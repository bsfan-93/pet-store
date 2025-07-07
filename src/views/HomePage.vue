<template>
  <div class="home-page">
    <div class="header-wrapper">
      <TopBanner v-show="showTopBanner" />
      <AppHeader :is-scrolled="isHeaderScrolled" />
    </div>
    
    <main>
      <HeroSection :banners="bannerData"/>
      <CollectionList :collections="collectionData" />
      <FeatureSection />
      <GalleryCarousel />
      <HowToSection />
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue';

// 导入所有需要的组件
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import HeroSection from '../components/HeroSection.vue';
import CollectionList from '../components/CollectionList.vue';
import FeatureSection from '../components/FeatureSection.vue';
import GalleryCarousel from '../components/GalleryCarousel.vue';
import HowToSection from '../components/HowToSection.vue';
import AppFooter from '../components/AppFooter.vue';

// --- 响应式状态定义 ---
const megaMenuData = ref(null);
provide('megaMenuData', megaMenuData);
const bannerData = ref([]);
const collectionData = ref([]);
const showTopBanner = ref(true);
const isHeaderScrolled = ref(false);
const galleryData = ref([]); // <-- 【关键修复】恢复这个变量的定义

// --- 函数定义 ---
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  showTopBanner.value = scrollTop < 10;
  isHeaderScrolled.value = scrollTop > 50;
};

const fetchMegaMenuData = async () => {
  try {
    const response = await fetch('http://192.168.2.9:9999/standalones/photo/details?type=0');
    if (!response.ok) throw new Error('菜单API响应错误');
    const result = await response.json();
    if (result.success && Array.isArray(result.data)) {
      const rawData = result.data;
      const baseUrl = 'http://192.168.2.9:9999';
      const transformedData = {
        links: rawData.map(item => ({ id: item.id, name: item.name, url: `/category/${item.name.toLowerCase()}` })),
        products: rawData.map(item => ({ id: item.id, name: item.name, imageUrl: baseUrl + item.url }))
      };
      megaMenuData.value = transformedData;
      sessionStorage.setItem(cacheKey, JSON.stringify(transformedData));
    }
  } catch (error) {
    console.error("获取菜单数据失败:", error);
    megaMenuData.value = { links: [], products: [] };
  }
};

const fetchBannerData = async () => {
  try {
    const response = await fetch('http://192.168.2.9:9999/standalones/photo/details?type=1');
    if (!response.ok) throw new Error('Banner API响应错误');
    const result = await response.json();
    if (result.success && Array.isArray(result.data)) {
      const baseUrl = 'http://192.168.2.9:9999';
      bannerData.value = result.data.map(item => ({ ...item, url: baseUrl + item.url }));
    }
  } catch (error) {
    console.error("获取Banner数据失败:", error);
  }
};

const fetchCollectionData = async () => {
  try {
    const response = await fetch('http://192.168.2.9:9999/standalones/photo/details?type=2');
    if (!response.ok) throw new Error('Collection API Error');
    const result = await response.json();
    if (result.success && Array.isArray(result.data)) {
      const baseUrl = 'http://192.168.2.9:9999';
      collectionData.value = result.data.map(item => ({ ...item, url: baseUrl + item.url }));
    }
  } catch (error) {
    console.error("获取Collection数据失败:", error);
  }
};

const fetchGalleryData = async () => {
  const cacheKey = 'galleryData';
  const cachedData = sessionStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      galleryData.value = JSON.parse(cachedData);
      return;
    } catch(e) {
      sessionStorage.removeItem(cacheKey);
    }
  }
  try {
    const response = await fetch('http://192.168.2.9:9999/standalones/photo/details?type=3');
    if (!response.ok) throw new Error('Gallery API Error');
    const result = await response.json();
    if (result.success && Array.isArray(result.data)) {
      const baseUrl = 'http://192.168.2.9:9999';
      const processedData = result.data.map(item => ({...item, url: baseUrl + item.url}));
      galleryData.value = processedData;
      sessionStorage.setItem(cacheKey, JSON.stringify(processedData));
    }
  } catch (error) {
    console.error("获取Gallery数据失败:", error);
  }
};


// --- 生命周期钩子 ---
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  
  // 调用所有获取数据的函数
  fetchMegaMenuData();
  fetchBannerData();
  fetchCollectionData();
  fetchGalleryData(); // 确保调用
});

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