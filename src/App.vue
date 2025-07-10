<template>
  <HomePage v-if="currentPage === 'home'" />
  <ProductDetailPage v-else-if="currentPage === 'productDetail'" :key="currentProductId" :productId="currentProductId" />
</template>

<script setup>
import { ref, provide, onMounted } from 'vue';
import { getPhotoDetails } from './api'; // 确保 API 函数被导入
import HomePage from './views/HomePage.vue';
import ProductDetailPage from './views/ProductDetailPage.vue';

// 1. 导航状态管理
const currentPage = ref('home'); 
const currentProductId = ref(null);
const navigateTo = (page, productId = null) => {
  currentPage.value = page;
  currentProductId.value = productId;
  window.scrollTo(0, 0);
};
provide('navigateTo', navigateTo); // 向所有后代组件提供导航函数

// 2. 超级菜单数据管理
const megaMenuData = ref(null);
provide('megaMenuData', megaMenuData); // 向所有后代组件提供菜单数据

const fetchMegaMenuData = async () => {
  try {
    const rawData = await getPhotoDetails(0); // type=0 for MegaMenu
    megaMenuData.value = {
      links: rawData.map(item => ({ id: item.id, name: item.name, url: `/category/${item.name.toLowerCase()}` })),
      products: rawData.map(item => ({ id: item.id, name: item.name, imageUrl: item.url }))
    };
  } catch (error) {
    console.error("在 App.vue 获取菜单数据失败:", error);
    megaMenuData.value = null; // 失败时清空
  }
};

// 3. 在应用挂载时获取数据
onMounted(() => {
  fetchMegaMenuData();
});
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>