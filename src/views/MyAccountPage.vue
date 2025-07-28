<template>
  <div class="account-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="account-container">
        <div class="page-header">
          <h1>{{ $t('account.title') }}</h1>
          <a href="#" @click.prevent="logout" class="logout-link">
            {{ $t('account.logout') }}
          </a>
        </div>

        <div class="cards-wrapper">
          <div class="account-card">
            <div class="card-header" @click="router.push('/order-tracking')">
              <h3>{{ $t('account.order_card.title') }}</h3>
              <el-icon><ArrowRight /></el-icon>
            </div>
            <div class="card-body order-card-body">
              <p>{{ $t('account.order_card.no_orders') }}</p>
              <el-button class="go-shopping-btn" @click="router.push('/')">
                {{ $t('account.order_card.go_shopping') }}
              </el-button>
            </div>
          </div>

          <div class="account-card">
            <div class="card-header" @click="router.push('/placeholder/Account-Settings')">
              <h3>{{ $t('account.settings_card.title') }}</h3>
              <el-icon>
                <ArrowRight />
              </el-icon>
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
import { inject } from 'vue';
import { useRouter } from 'vue-router';
import { ElButton, ElIcon } from 'element-plus';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const navigateTo = inject('navigateTo');

const logout = async () => {
  await authStore.handleLogout();
  window.location.href = '/'; 
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
  padding: 80px 20px;
}
.account-container {
  max-width: 1200px;
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
  margin: 0;
}
.logout-link {
  color: #666;
  text-decoration: underline;
  font-size: 14px;
}
.logout-link:hover {
    color: #000;
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
  background-color: #e9ecef;
  border-radius: 8px 8px 0 0;
  /* ▼▼▼ 3. 添加鼠標指針和過渡效果 ▼▼▼ */
  cursor: pointer;
  transition: background-color 0.2s ease;
}

/* ▼▼▼ 3. 添加懸停效果 ▼▼▼ */
.card-header:hover {
    background-color: #d8dcdf;
}

.card-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #333;
}
.card-header .el-icon {
  font-size: 16px;
}
.card-body {
  padding: 30px;
  font-size: 14px;
}
.order-card-body {
  text-align: center;
  padding: 70px 30px;
  color: #666;
}
.go-shopping-btn {
  background-color: #000;
  color: #fff;
  padding: 20px 40px;
  height: auto;
  border-radius: 30px;
  margin-top: 10px;
  font-weight: 500;
}
.go-shopping-btn:hover {
  background-color: #333;
}

/* ▼▼▼ 【修改】账户设置卡片的样式 ▼▼▼ */
.settings-card-body {
  /* 让内容高度与另一张卡片对齐 */
  min-height: 225px; 
}
.settings-card-body p {
  margin: 0;
  padding-bottom: 15px; /* 设置每行之间的间距 */
}
.settings-card-body .user-name {
  font-weight: 500;
}
.settings-card-body .user-email {
  color: #888;
  padding-bottom: 0; /* 最后一行不需要下边距 */
}

/* ▼▼▼ 【新增】針對平板和手機的響應式樣式 ▼▼▼ */

/* --- 平板和手機樣式 (寬度 ≤ 992px) --- */
@media (max-width: 992px) {
  .cards-wrapper {
    grid-template-columns: 1fr; /* 關鍵：將兩欄網格改為單欄 */
    gap: 20px;
  }
}

/* --- 僅手機樣式 (寬度 ≤ 767px) --- */
@media (max-width: 767px) {
  .main-content {
    padding: 40px 20px; /* 縮小頁面邊距 */
  }

  .page-header {
    flex-direction: column; /* 讓標題和登出連結垂直排列 */
    align-items: flex-start;
    gap: 15px;
    margin-bottom: 30px;
  }

  .page-header h1 {
    font-size: 28px; /* 縮小標題字體 */
  }

  .order-card-body {
    padding: 50px 20px; /* 調整卡片內部間距 */
  }
}
</style>