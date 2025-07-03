<template>
  <div class="home-page">
    <div class="header-wrapper">
      <TopBanner v-show="showTopBanner" />
      <AppHeader :is-scrolled="isHeaderScrolled" />
    </div>
    
    <main>
      <HeroSection :banners="bannerData"/>
      <NewAndPopular :new-items="newProducts" :popular-items="popularProducts" />
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
import NewAndPopular from '../components/NewAndPopular.vue';
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
const newProducts = ref([]);
const popularProducts = ref([]); // <-- 【关键修复】补上这个缺失的变量定义

const showTopBanner = ref(true);
const isHeaderScrolled = ref(false);

// --- 函数定义 ---
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  showTopBanner.value = scrollTop < 10;
  isHeaderScrolled.value = scrollTop > 50;
};

// 将 fetch 逻辑统一成一个可复用的函数
const fetchAPIData = async (url, targetRef, transformFn) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API响应错误: ${url}`);
    const result = await response.json();
    if (result.success && Array.isArray(result.data)) {
      const baseUrl = 'http://192.168.2.9:9999';
      // 如果提供了转换函数，则使用它，否则默认处理
      targetRef.value = transformFn ? transformFn(result.data, baseUrl) : result.data.map(item => ({ ...item, url: baseUrl + item.url }));
    }
  } catch (error) {
    console.error(`获取数据失败 from ${url}:`, error);
  }
};

// --- 生命周期钩子 ---
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  
  // 获取超级菜单数据（它有特殊的缓存和转换逻辑，所以单独处理）
  const cachedMegaMenu = sessionStorage.getItem('megaMenuData');
  if (cachedMegaMenu) {
    megaMenuData.value = JSON.parse(cachedMegaMenu);
  } else {
    fetchAPIData('http://192.168.2.9:9999/standalones/photo/details?type=0', megaMenuData, (data, baseUrl) => {
      const transformed = {
        links: data.map(item => ({ id: item.id, name: item.name, url: `/category/${item.name.toLowerCase()}` })),
        products: data.map(item => ({ id: item.id, name: item.name, imageUrl: baseUrl + item.url }))
      };
      sessionStorage.setItem('megaMenuData', JSON.stringify(transformed));
      return transformed;
    });
  }

  // 获取其他所有模块的数据
  fetchAPIData('http://192.168.2.9:9999/standalones/photo/details?type=1', bannerData);
  fetchAPIData('http://192.168.2.9:9999/standalones/photo/details?type=2', collectionData);
  fetchAPIData(`http://192.168.2.9:9999/standalones/good/list?tag=new`, newProducts);
  fetchAPIData(`http://192.168.2.9:9999/standalones/good/list?tag=popular`, popularProducts);
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
main { 
  /* 保持为空是正确的 */
}
</style>