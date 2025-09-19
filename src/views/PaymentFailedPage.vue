<template>
  <div class="failed-page-container">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader :is-scrolled="true" />
    </div>

    <main class="main-content">
      <div class="failed-container">
        <!-- 头部：图标 + 标题 -->
        <div class="failed-header-content">
          <img src="/images/failed.png" alt="failed" class="failed-icon" />
          <h1>Payment Failed</h1>
        </div>

        <!-- 按钮 -->
        <el-button class="retry-btn" @click="goToShopAllPage">My Account</el-button>

        <!-- 提示文案 -->
        <p>To complete your payment, please go to “My Account” page.</p>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

const router = useRouter();

const goToShopAllPage = () => {
  router.push('/shop/all');
};
</script>

<style scoped>
.failed-page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header-wrapper {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.main-content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f7f7;
  padding: 60px 20px;
}

.failed-container {
  text-align: center;
  background-color: #fff;
  padding: 100px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  max-width: 500px;
  width: 100%;
}

.failed-header-content {
  display: flex;
  flex-direction: row;   /* 横排 */
  align-items: center;   /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  gap: 16px;             /* 图标和文字间距 */
  margin-bottom: 50px;
}

.failed-header-content h1 {
  font-size: 50px;
  font-weight: 500;
  margin: 0;
  color: #000; /* 红色标题 */
}

p {
  color: #000;
  margin-bottom: 0;
  font-size: 14px;
}

.retry-btn {
  background-color: #92C45C;
  color: #fff;
  border: none;
  padding: 28px 40px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  margin-bottom: 40px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.failed-icon {
  width: 50px;
  height: 50px;
}
</style>
