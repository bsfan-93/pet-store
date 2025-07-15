<template>
  <HomePage v-if="currentPage === 'home'" />
  <ProductDetailPage v-else-if="currentPage === 'productDetail'" :key="currentProductId" :productId="currentProductId" />
  <LoginPage v-else-if="currentPage === 'login'" />
  <RegisterPage v-else-if="currentPage === 'register'" />
  <AboutUsPage v-else-if="currentPage === 'about'" />
  <MyAccountPage v-else-if="currentPage === 'account'" />
</template>

<script setup>
import { ref, provide, onMounted, onUnmounted } from 'vue';
import HomePage from './views/HomePage.vue';
import ProductDetailPage from './views/ProductDetailPage.vue';
import LoginPage from './views/LoginPage.vue';
import RegisterPage from './views/RegisterPage.vue'; // 导入注册页面组件
import AboutUsPage from './views/AboutUsPage.vue'; // 导入新页面
import MyAccountPage from './views/MyAccountPage.vue'; // 导入新页面

const currentPage = ref('home'); 
const currentProductId = ref(null);

const handleUrlChange = () => {
  const path = window.location.pathname;
  const productMatch = path.match(/^\/product\/(\d+)/);
  const loginMatch = path.match(/^\/login/);
  const registerMatch = path.match(/^\/register/); // 新增
  const aboutMatch = path.match(/^\/about/); // 新增
  const accountMatch = path.match(/^\/account/); // 新增

  if (productMatch) {
    currentPage.value = 'productDetail';
    currentProductId.value = productMatch[1];
  } else if (loginMatch) {
    currentPage.value = 'login';
  } else if (registerMatch) {
    currentPage.value = 'register';
  } else if (aboutMatch) {
    currentPage.value = 'about';
  } else if (accountMatch) { // 新增
    currentPage.value = 'account';
  } else {
    currentPage.value = 'home';
  }
};

const navigateTo = (page, productId = null) => {
  let path = '/';
  if (page === 'productDetail' && productId) {
    path = `/product/${productId}`;
  } else if (page === 'login') {
    path = '/login';
  } else if (page === 'register') {
    path = '/register';
  } else if (page === 'about') {
    path = '/about';
  } else if (page === 'account') { // 新增
    path = '/account';
  }
  
  window.history.pushState({}, '', path);
  handleUrlChange();
  window.scrollTo(0, 0);
};

provide('navigateTo', navigateTo);

onMounted(() => {
  handleUrlChange();
  window.addEventListener('popstate', handleUrlChange);
});

onUnmounted(() => {
  window.removeEventListener('popstate', handleUrlChange);
});
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>