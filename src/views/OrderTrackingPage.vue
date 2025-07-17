<template>
  <div class="tracking-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="tracking-container">
        <div class="tracking-box">
          <h2>Track your order</h2>
          
          <el-input
            v-model="trackingNumber"
            placeholder="tracking"
            size="large"
            class="tracking-input"
          />
          
          <div class="verify-link-wrapper">
            <span>Verify by </span><a href="#">phone number</a>
          </div>
          
          <el-button 
            class="track-button"
            @click="handleTrack"
          >
            Track
          </el-button>
        </div>

        <div class="customer-service-info">
          <p>Customer Service:15380822206@163.com (We will reply to your email within 24 hours.)</p>
          <p>Customer Service Phone: (86) 15380822206 (9:00am-12:00pm & 1:00pm-18:00pm Mon.-Sun.)</p>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElInput, ElButton } from 'element-plus';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

const trackingNumber = ref('');

const handleTrack = () => {
  if (trackingNumber.value) {
    console.log(`开始查询订单号: ${trackingNumber.value}`);
    // 在这里可以添加实际的 API 调用逻辑
  } else {
    console.log('请输入订单号');
  }
};
</script>

<style scoped>
.tracking-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
}
.tracking-container {
  width: 100%;
  max-width: 500px;
  text-align: center;
}
.tracking-box {
  background-color: #f7f7f7;
  padding: 40px;
  border-radius: 8px;
  margin-bottom: 30px;
}
h2 {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 30px 0;
}
.tracking-input {
  margin-bottom: 15px;
}
.tracking-input :deep(.el-input__wrapper) {
  height: 50px;
  font-size: 16px;
}
.verify-link-wrapper {
  text-align: left;
  font-size: 14px;
  margin-bottom: 30px;
  color: #666;
}
.verify-link-wrapper a {
  color: #007bff;
  /* text-decoration: underline; */
}
.track-button {
  width: 100%;
  height: 50px;
  background-color: #7CB342;
  border-color: #7CB342;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
}
.track-button:hover {
  background-color: #7CB342;
  border-color: #7CB342;
}
.customer-service-info {
  font-size: 13px;
  color: #888;
  line-height: 1.6;
  text-align: left; /* 新增：将文字左对齐 */
}
</style>