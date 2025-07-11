<template>
  <HomePage v-if="navigationStore.currentPage === 'home'" />
  <ProductDetailPage 
    v-else-if="navigationStore.currentPage === 'productDetail'" 
    :key="navigationStore.currentProductId" 
    :productId="navigationStore.currentProductId" 
  />
  <LoginPage v-else-if="navigationStore.currentPage === 'login'" />
</template>

<script setup>
import { useNavigationStore } from './stores/navigation'; // 导入导航 store
import HomePage from './views/HomePage.vue';
import ProductDetailPage from './views/ProductDetailPage.vue';
import LoginPage from './views/LoginPage.vue';

// 获取导航 store 实例
const navigationStore = useNavigationStore();

// 注意：这里不再需要 onMounted 或任何 URL 处理逻辑，
// 因为所有导航都由 Pinia 状态驱动，更加纯粹和简单。
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>