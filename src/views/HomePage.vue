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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue';
import { getPhotoDetails } from '../api';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import HeroSection from '../components/HeroSection.vue';
import CollectionList from '../components/CollectionList.vue';
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

// --- 函数定义 ---
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  showTopBanner.value = scrollTop < 10;
  isHeaderScrolled.value = scrollTop > 50;
};

// 2. 使用新的API函数重构数据获取逻辑
const fetchMegaMenuData = async () => {
  const cachedData = sessionStorage.getItem('megaMenuData');
  if (cachedData) {
    try {
      megaMenuData.value = JSON.parse(cachedData);
      return;
    } catch (e) {
      sessionStorage.removeItem('megaMenuData');
    }
  }
  try {
    const rawData = await getPhotoDetails(0); // type=0 for MegaMenu
    // API模块已经处理了数据转换和URL拼接
    const transformedData = {
      links: rawData.map(item => ({ id: item.id, name: item.name, url: `/category/${item.name.toLowerCase()}` })),
      products: rawData.map(item => ({ id: item.id, name: item.name, imageUrl: item.url }))
    };
    megaMenuData.value = transformedData;
    sessionStorage.setItem('megaMenuData', JSON.stringify(transformedData));
  } catch (error) {
    console.error("获取菜单数据失败:", error);
    megaMenuData.value = { links: [], products: [] };
  }
};

const fetchBannerData = async () => {
  try {
    bannerData.value = await getPhotoDetails(1); // type=1 for Banners
  } catch (error) {
    console.error("获取Banner数据失败:", error);
  }
};

const fetchCollectionData = async () => {
  try {
    collectionData.value = await getPhotoDetails(2); // type=2 for Collections
  } catch (error) {
    console.error("获取Collection数据失败:", error);
  }
};

// --- 生命周期钩子 ---
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  
  // 获取数据 (不再调用 fetchGalleryData)
  fetchMegaMenuData();
  fetchBannerData();
  fetchCollectionData();
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