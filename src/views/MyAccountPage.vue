<!-- “我的账户” 页面，登录后用户可以在这里查看订单和个人信息。 -->

<template>
  <div class="account-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="account-container">
        <div class="page-header">
          <h1 class="page-title">{{ t('account.title') }}</h1>
          <div v-if="authStore.userInfo" class="user-info-wrapper">
            <div class="user-info">
              <span class="user-name">{{ authStore.userInfo.nickname || authStore.userInfo.username }}</span>
              <span class="user-email">{{ authStore.userInfo.email }}</span>
            </div>
            <a href="#" @click.prevent="logout" class="logout-link">
              {{ t('account.logout') }}
            </a>
          </div>
        </div>

        <div class="card-wrapper">
          <div class="card-header">
            <h3>{{ t('account.order_card.title') }}</h3>
          </div>
          <div class="card-body">
            <div v-if="isLoadingOrders" class="loading-spinner">
              Loading orders...
            </div>
            <div v-else-if="orders.length > 0" class="order-list">
              <template v-for="(order, index) in orders" :key="order.id">
                <a
                  v-if="order.status !== 'completed'"
                  :href="`/order-tracking?orderId=${order.id}`"
                  class="order-item"
                >
                  <div class="order-info">
                    <p class="order-id-text">
                      {{ t('account.order_card.order_prefix') }} {{ index + 1 }}You have no orders yet
                    </p>
                    <p class="order-date-line">
                      <span class="status-dot"></span>
                      <span class="order-date-text">{{ order.date }}</span>
                    </p>
                    <div class="product-details-line">
                      <span class="product-name">{{ order.productName }}</span>
                      <span class="product-specs">{{ order.specs }}</span>
                      <span class="product-quantity">x1</span>
                    </div>
                    <p class="order-status in-progress">In Transit</p>
                  </div>
                  <el-icon class="order-arrow-icon"><ArrowRightBold /></el-icon>
                </a>
                <div v-else class="order-item disabled">
                  <div class="order-info">
                    <p class="order-id-text">
                      {{ t('account.order_card.order_prefix') }} {{ index + 1 }}You have no orders yet
                    </p>
                    <p class="order-date-line">
                      <span class="status-dot grey"></span>
                      <span class="order-date-text">{{ order.date }}</span>
                    </p>
                    <p class="order-products-line">
                      <span class="product-name">{{ order.productName }}</span>
                      <span class="product-specs">{{ order.specs }}</span>
                      <span class="product-quantity">x1</span>
                    </p>
                    <p class="order-status completed">Delivered</p>
                  </div>
                  <el-icon class="order-arrow-icon"><ArrowRightBold /></el-icon>
                </div>
              </template>
            </div>
            <div v-else class="no-orders-placeholder">
              <p>{{ t('account.order_card.no_orders') }}</p>
              <el-button class="go-shopping-btn" @click="router.push('/shop/all')">
                {{ t('account.order_card.go_shopping') }}
              </el-button>
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
const isLoadingOrders = ref(false);

const fetchOrders = async () => {
  isLoadingOrders.value = true;
  try {
    const userOrders = await getUserOrders();
    // ▼▼▼ 移除模拟数据映射，使用真实 API 数据结构 ▼▼▼
    if (Array.isArray(userOrders)) {
        // 映射数据以匹配模板需要的字段。我们假设 API 返回了 orderDate, goodName, specification, and orderStatus
        orders.value = userOrders.map(order => ({
            id: order.id,
            date: order.orderDate || 'N/A', // 假设 API 字段名为 orderDate
            productName: order.goodName || 'N/A', // 假设 API 字段名为 goodName
            specs: order.specification || 'N/A', // 假设 API 字段名为 specification
            // 假设 API 中 status 字段为 orderStatus，且值为 2 代表“已完成”
            status: order.orderStatus === 2 ? 'completed' : 'in-progress', 
        }));
    } else {
        orders.value = [];
    }
    // ▲▲▲ 移除模拟数据映射，使用真实 API 数据结构 ▲▲▲
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    orders.value = [];
  } finally {
    isLoadingOrders.value = false;
  }
};

const goToOrderTracking = (orderId) => {
  router.push({ path: '/order-tracking', query: { orderId } });
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
.account-page {
  background-color: #fff;
}
.header-wrapper {
  position: sticky;
  top: 0;
  z-index: 1100;
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
  max-width: 1100px;
  margin: 0 auto;
}
.page-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 5px;
}
.user-info-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between; /* <-- 这一行是关键 */
  align-items: center;
  margin-bottom: 20px;
}
.page-title {
  font-size: 48px;
  font-weight: 600;
  margin: 0 0 10px 0;
  text-align: left;
}
.user-info {
  font-size: 20px;
  color: #000;
}
.user-info .user-name {
  /* font-weight: bold; */
  margin-right: 25px;
}
.user-info .user-email {
  font-weight: normal;
  color: #000;
}
.logout-link {
  color: #666;
  text-decoration: underline;
  font-size: 12px;
}

/* 卡片样式 */
.card-wrapper {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
.card-header {
  background-color: #f7f7f7;
  padding: 20px 30px;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
}
.card-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #000;
  text-transform: uppercase;
}
.card-body {
  padding: 0;
}
.order-list {
  font-size: 12px;
  display: flex;
  flex-direction: column;
}
.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #f0f0f0;
  text-decoration: none;
  color: #000;
  position: relative;
  transition: background-color 0.2s ease;
}
.order-item:last-child {
  font-size: 12px;
  border-bottom: none;
}
.order-item:hover {
  background-color: #f9f9f9;
}
.order-item.disabled {
  font-size: 12px;
  cursor: default;
  color: #888;
  pointer-events: none;
}
.order-item.disabled .order-arrow-icon {
  color: #ccc;
}
.order-item.disabled .order-info > * {
  color: #888;
}
.order-info {
  display: flex;
  flex-direction: column;
  text-align: left;
  flex-grow: 1;
}
.order-date-line {
  display: flex;
  align-items: center;
  line-height: 1;
  font-size: 12px;
  color: #888;
  margin: 0 0 5px 0;
}
.order-id-text {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 10px 0;
}
.order-date-text {
  margin-left: 5px;
}
/* .order-products-line {
  margin: 0;
  font-size: 14px;
  color: #555;
} */

.product-name {
  /* font-weight: 500; */
  color: #888;
}
.product-specs {
  color: #888;
  /* 设置一个固定的宽度，以保证垂直对齐 */
  width: 100px;
  text-align: left;
  flex-shrink: 0;
  margin-left: 50px; /* 减小间距 */
}
.product-quantity {
  color: #888;
  /* 设置一个固定的宽度，以保证垂直对齐 */
  width: 30px;
  text-align: right;
  flex-shrink: 0;
  margin-left: 50px; /* 减小间距 */
}
.order-status {
  font-size: 12px;
  font-weight: 500;
  margin-top: 10px;
  color: #888;
}
.order-status.in-progress {
  color: #92C45C;
}
.order-status.completed {
  color: #888;
}
.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #92C45C;
  border-radius: 50%;
  margin-right: 8px;
}
.status-dot.grey {
  background-color: #888;
}
.order-arrow-icon {
  font-size: 20px;
  color: #000;
}
.order-item.disabled .order-arrow-icon {
  color: #ccc;
}
.no-orders-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px 20px;
  text-align: center;
}
.no-orders-placeholder p {
  font-size: 18px; /* 控制字体大小 */
  color: #000;    /* 控制字体颜色 */
  font-weight: 500; /* 控制字体粗细 */
  margin-bottom: 40px; /* 控制文本与按钮之间的间距 */
}
.go-shopping-btn {
  font-size: 12px;
  background-color: #000;
  color: #fff;
  padding: 10px 25px;
  height: auto;
  border-radius: 30px;
  font-weight: 700;
  border: none;
}

@media (max-width: 767px) {
  .page-title {
    font-size: 32px;
  }
  .order-item {
    padding: 15px 20px;
  }
}
</style>