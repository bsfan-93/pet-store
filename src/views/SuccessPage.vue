<!-- “支付成功” 页面，用户成功完成购买后会跳转到此页面。 -->

<template>
  <div class="success-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>
    <main class="main-content">
      <div class="success-container">
        <el-icon class="success-icon"><Select /></el-icon>
        <h1>支付成功！</h1>
        <p>感谢您的购买，我们会尽快为您处理订单。</p>
        <el-button class="home-button" @click="goToHome">返回首页</el-button>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { ElButton, ElIcon } from 'element-plus';
import { Select } from '@element-plus/icons-vue';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

const router = useRouter();
const cartStore = useCartStore();

// 页面加载时，清空已选中的（即已支付的）商品
onMounted(() => {
  cartStore.clearSelectedItems();
});

const goToHome = () => {
  router.push('/');
};
</script>

<style scoped>
.success-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f7f7f7;
}
.header-wrapper {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}
.header-wrapper :deep(.main-nav a),
.header-wrapper :deep(.header-actions .el-icon),
.header-wrapper :deep(.el-dropdown-link),
.header-wrapper :deep(.logo img) {
  color: var(--text-color);
  filter: none;
}
.main-content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
}
.success-container {
  text-align: center;
  background-color: #fff;
  padding: 60px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}
.success-icon {
  font-size: 80px;
  color: #67C23A;
  margin-bottom: 20px;
}
h1 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 15px;
}
p {
  color: #666;
  margin-bottom: 30px;
}
.home-button {
  background-color: #000;
  color: #fff;
  border: none;
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 4px;
}
.home-button:hover {
    background-color: #333;
}
</style>