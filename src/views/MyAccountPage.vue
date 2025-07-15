<template>
  <div class="account-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="account-container">
        <div class="page-header">
          <h1>My account</h1>
          <a href="#" @click.prevent="logout" class="logout-link">Log out</a>
        </div>

        <div class="cards-wrapper">
          <div class="account-card">
            <div class="card-header">
              <h3>MY ORDER</h3>
              <el-icon><ArrowRight /></el-icon>
            </div>
            <div class="card-body order-card-body">
              <p>You have no orders yet</p>
              <el-button class="go-shopping-btn" @click="navigateTo('home')">GO SHOPPING</el-button>
            </div>
          </div>

          <div class="account-card">
            <div class="card-header">
              <h3>ACCOUNT SETTINGS</h3>
              <el-icon><ArrowRight /></el-icon>
            </div>
            <div class="card-body settings-card-body">
              <p v-if="authStore.userInfo">{{ authStore.userInfo.name }}</p>
              <p>Manage Subscriptions</p>
              <p v-if="authStore.userInfo">{{ authStore.userInfo.username }}</p>
              <div class="address-info">
                <p v-if="authStore.userInfo">{{ authStore.userInfo.name }}</p>
                <p>United States</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { ElButton, ElIcon } from 'element-plus';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const navigateTo = inject('navigateTo');

const logout = () => {
  authStore.handleLogout();
  navigateTo('home'); // 登出后跳转到首页
};
</script>

<style scoped>
.account-page {
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
  padding: 60px 20px;
}
.account-container {
  max-width: 1000px;
  margin: 0 auto;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}
.page-header h1 {
  font-size: 36px;
  font-weight: 600;
}
.logout-link {
  color: #666;
  text-decoration: underline;
  font-size: 14px;
}
.cards-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}
.account-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #e0e0e0;
}
.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}
.card-body {
  padding: 30px;
}
.order-card-body {
  text-align: center;
  padding: 60px 30px;
}
.order-card-body p {
  margin-bottom: 20px;
  color: #666;
}
.go-shopping-btn {
  background-color: #000;
  color: #fff;
  padding: 20px 40px;
  border-radius: 30px;
}
.go-shopping-btn:hover {
  background-color: #333;
}
.settings-card-body p {
  margin: 0 0 15px 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}
.settings-card-body p:last-child {
    border-bottom: none;
}
.address-info {
    margin-top: 20px;
}
.address-info p {
    border-bottom: none;
    margin-bottom: 5px;
}
</style>