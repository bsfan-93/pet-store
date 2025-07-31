<template>
  <div class="account-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="account-container">
        <div class="page-header">
          <h1>{{ t('account.title') }}</h1>
          <a href="#" @click.prevent="logout" class="logout-link">
            {{ t('account.logout') }}
          </a>
        </div>

        <div class="cards-wrapper">
          <div class="account-card">
            <div class="card-header">
              <h3>{{ t('account.order_card.title') }}</h3>
            </div>
            <div class="card-body order-card-body">
              <div v-if="isLoadingOrders" class="loading-spinner">
                Loading orders...
              </div>
              <div v-else-if="orders.length > 0" class="order-list">
                <router-link v-for="order in orders" :key="order.id" :to="`/placeholder/orders/${order.id}`" class="order-item">
                  <span class="order-text">{{ t('account.order_card.order_prefix') }} {{ order.name }}</span>
                  <el-icon class="order-arrow-icon"><ArrowRightBold /></el-icon>
                </router-link>
              </div>
              <div v-else class="no-orders-placeholder">
                <p>{{ t('account.order_card.no_orders') }}</p>
                <el-button class="go-shopping-btn" @click="router.push('/')">
                  {{ t('account.order_card.go_shopping') }}
                </el-button>
              </div>
            </div>
          </div>

          <div class="account-card">
            <div class="card-header">
              <h3>{{ t('account.settings_card.title') }}</h3>
            </div>
            <div class="card-body settings-card-body">
              <div v-if="authStore.userInfo">
                <p class="user-name">{{ authStore.userInfo.nickname || authStore.userInfo.username }}</p>
                <p class="user-email">{{ authStore.userInfo.email }}</p>
              </div>
              <div v-else>
                <p>{{ $t('account.settings_card.user_info_not_available') }}</p>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElButton, ElIcon } from 'element-plus';
import { ArrowRightBold } from '@element-plus/icons-vue';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import { useAuthStore } from '../stores/auth';
import { getUserOrders } from '../api';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const orders = ref([]);
const isLoadingOrders = ref(true);

const fetchOrders = async () => {
  isLoadingOrders.value = true;
  try {
    const userOrders = await getUserOrders();
    orders.value = userOrders;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    orders.value = [];
  } finally {
    isLoadingOrders.value = false;
  }
};

onMounted(() => {
  authStore.fetchUserInfo();
  fetchOrders();
});

const logout = async () => {
  await authStore.handleLogout();
  window.location.href = '/'; 
};
</script>

<style scoped>
  /* --- 基礎樣式 --- */
  .account-page {
    background-color: #fff;
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
    max-width: 800px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .page-header h1 {
    font-size: 48px;
    font-weight: 600;
    margin: 0;
    text-align: left;
  }

  .logout-link {
    color: #666;
    text-decoration: underline;
    font-size: 14px;
  }

  /* --- 卡片佈局 --- */
  .cards-wrapper {
    display: flex;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #fff;
    overflow: hidden;
  }

  .account-card {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .account-card + .account-card {
    border-left: 1px solid #e0e0e0;
  }

  .card-header {
    padding: 15px 20px;
    background-color: #f7f7f7;
    border-bottom: 1px solid #e0e0e0;
    text-align: center;
  }

  .card-header h3 {
    margin: 0;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 1px;
    color: #555;
    text-transform: uppercase;
  }

  .card-body {
    padding: 0;
    font-size: 14px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  /* --- 帳戶設定卡片 (右側) --- */
  .settings-card-body {
    align-items: center;
    justify-content: center;
    padding: 30px;
    text-align: center;
  }

  .settings-card-body p {
    margin: 0;
    padding-bottom: 8px;
  }

  .settings-card-body .user-name {
    font-weight: 500;
    font-size: 16px;
    text-transform: uppercase;
  }

  .settings-card-body .user-email {
    color: #555;
    padding-bottom: 0;
  }

  /* --- 訂單卡片 (左側) --- */
  .order-card-body {
    align-items: stretch;
    padding: 10px 25px;
    justify-content: flex-start;
  }

  .no-orders-placeholder {
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }

  .no-orders-placeholder p {
    margin-bottom: 20px;
  }

  .go-shopping-btn {
    background-color: #000;
    color: #fff;
    padding: 12px 35px;
    height: auto;
    border-radius: 30px;
    font-weight: 500;
    border: none;
  }

  .loading-spinner {
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }

  .order-list {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .order-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 0;
    border-bottom: 1px solid #f0f0f0;
    text-decoration: none;
    color: #333;
  }

  .order-item:last-child {
    border-bottom: none;
  }

  .order-item span {
    font-weight: normal;
  }

  /* --- 箭頭樣式 --- */
  .order-arrow {
    font-family: 'Arial', sans-serif;
    font-size: 20px;
    font-weight: normal;
    color: #333;
  }
</style>