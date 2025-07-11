<template>
  <HomePage v-if="currentPage === 'home'" />
  <ProductDetailPage v-else-if="currentPage === 'productDetail'" :key="currentProductId" :productId="currentProductId" />
</template>

<script setup>
import { ref, provide, onMounted, onUnmounted } from 'vue';
import { getPhotoDetails } from './api';
import HomePage from './views/HomePage.vue';
import ProductDetailPage from './views/ProductDetailPage.vue';

// --- 状态定义 ---
const currentPage = ref('home'); 
const currentProductId = ref(null);

// =======================================================
// ▼▼▼ 【修改】导航逻辑 ▼▼▼
// =======================================================

// 1. 定义一个函数，根据当前 URL 路径来设置页面状态
const handleUrlChange = () => {
  const path = window.location.pathname;
  const match = path.match(/^\/product\/(\d+)/); // 匹配 /product/123 这样的路径

  if (match) {
    // 如果 URL 匹配详情页路径
    const productId = match[1];
    currentPage.value = 'productDetail';
    currentProductId.value = productId;
  } else {
    // 否则，都视为首页
    currentPage.value = 'home';
    currentProductId.value = null;
  }
};

// 2. 修改 navigateTo 函数，让它在切换状态的同时，也改变浏览器地址栏的 URL
const navigateTo = (page, productId = null) => {
  if (page === 'productDetail' && productId) {
    // 使用 history.pushState 来改变 URL 而不刷新页面
    window.history.pushState({}, '', `/product/${productId}`);
  } else {
    window.history.pushState({}, '', '/');
  }
  // 手动调用 handleUrlChange 来更新组件状态，以响应 URL 变化
  handleUrlChange();
  window.scrollTo(0, 0);
};

// 将 navigateTo 函数提供给所有后代组件
provide('navigateTo', navigateTo);

// --- 生命周期钩子 ---
onMounted(() => {
  // 3. 在组件首次加载时，立即根据当前 URL 设置初始页面
  handleUrlChange();

  // 4. 监听浏览器的前进和后退事件
  window.addEventListener('popstate', handleUrlChange);

  // ... (获取超级菜单数据的逻辑保持不变)
  fetchMegaMenuData();
});

onUnmounted(() => {
  // 5. 在组件销毁时，移除监听器
  window.removeEventListener('popstate', handleUrlChange);
});

// --- 超级菜单数据获取 (保持不变) ---
const megaMenuData = ref(null);
provide('megaMenuData', megaMenuData);

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
    const rawData = await getPhotoDetails(0);
    megaMenuData.value = {
      links: rawData.map(item => ({ id: item.id, name: item.name, goodId: item.goodId })),
      products: rawData.map(item => ({ id: item.id, name: item.name, imageUrl: item.url, goodId: item.goodId }))
    };
    sessionStorage.setItem('megaMenuData', JSON.stringify(transformedData));
  } catch (error) {
    console.error("在 App.vue 获取菜单数据失败:", error);
    megaMenuData.value = null;
  }
};
// =======================================================
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>