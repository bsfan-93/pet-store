 <!-- “订单追踪” 页面，用于查询订单的物流状态。 -->

<template>
  <div class="tracking-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="tracking-container">
        <div class="tracking-box">
          <h2>{{ t('order_tracking.title') }}</h2>
          
          <el-input
            v-model="trackingNumber"
            :placeholder="t('order_tracking.placeholder')"
            size="large"
            class="tracking-input"
            @keyup.enter="handleTrack"
          />
          
          <el-button 
            class="track-button"
            @click="handleTrack"
            :loading="isLoading"
          >
            {{ t('order_tracking.track_button') }}
          </el-button>
        </div>

         <div v-if="logisticsDetails" class="logistics-details">
          <h3>Logistics details</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in logisticsDetails"
              :key="index"
              hide-timestamp
            >
              <p class="timeline-title">{{ activity.title }} {{ activity.timestamp }}</p>
              <p class="timeline-description">{{ activity.description }}</p>
            </el-timeline-item>
          </el-timeline>
          </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div class="customer-service-info">
          <p v-html="t('order_tracking.service_email', { email: '15380822206@163.com' })"></p>
          <p v-html="t('order_tracking.service_phone', { phone: '(86)15380822206' })"></p>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'; // 1. 引入 useI18n
import { ElInput, ElButton, ElTimeline, ElTimelineItem, ElMessage } from 'element-plus';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
// 引入新的 API 函数
import { trackOrder } from '../api';

const { t } = useI18n(); // 2. 获取 t 函数

const trackingNumber = ref('');

// ▼▼▼ START: 新增状态变量 ▼▼▼
const isLoading = ref(false);
const logisticsDetails = ref(null);
const errorMessage = ref('');
// ▲▲▲ END: 新增状态变量 ▲▲▲

// ▼▼▼ START: 修改 handleTrack 函数 ▼▼▼
const handleTrack = async () => {
  if (!trackingNumber.value) {
    ElMessage.warning('Please enter a tracking number.');
    return;
  }
  
  // 开始查询，进入加载状态
  isLoading.value = true;
  logisticsDetails.value = null; // 清空上一次的查询结果
  errorMessage.value = '';     // 清空上一次的错误信息

  try {
    // 调用 API 函数
    const result = await trackOrder(trackingNumber.value);
    logisticsDetails.value = result;
  } catch (error) {
    // 捕获 API 抛出的错误
    errorMessage.value = error.message;
  } finally {
    // 结束加载状态
    isLoading.value = false;
  }
};
// ▲▲▲ END: 修改 handleTrack 函数 ▲▲▲
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
  margin: 0 0 40px 0;
}
.tracking-input {
  margin-bottom: 40px;
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

/* ▼▼▼ START: 核心修改点 - 全新的物流信息区域样式 ▼▼▼ */
.logistics-details {
  background-color: #f7f7f7;
  border-radius: 8px;
  padding: 30px 40px;
  margin-top: 30px;
  text-align: left;
  border: none;
}

.logistics-details h3 {
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin: 0 0 25px 0;
}

/* 新增这条规则来移除 timeline 的默认左边距 */
.logistics-details :deep(.el-timeline) {
  padding-left: 0;
}

/* 调整时间线节点样式 */
.logistics-details :deep(.el-timeline-item__node) {
  background-color: #000; /* 圆点为黑色 */
  width: 9px;
  height: 9px;
  left: 1px;
  box-shadow: none;
}

/* 调整时间线竖线样式 */
.logistics-details :deep(.el-timeline-item__tail) {
  border-left: 2px solid #e0e0e0; /* 竖线为浅灰色 */
}

/* 调整每个时间节点之间的间距 */
.logistics-details :deep(.el-timeline-item) {
  padding-bottom: 20px;
}
.logistics-details :deep(.el-timeline-item:last-child) {
  padding-bottom: 0;
}

/* 调整内容区域与时间线的距离 */
.logistics-details :deep(.el-timeline-item__wrapper) {
  padding-left: 25px; /* 设置内容与左侧时间线的间距 */
}

/* 标题行（状态+时间）的样式 */
.timeline-title {
  font-size: 14px;
  font-weight: 600; /* 加粗 */
  color: #333;
  margin: 0 0 8px 0; /* 与下方描述的间距 */
  text-align: left; /* 确保左对齐 */
}

/* 描述文字的样式 */
.timeline-description {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.6;
  text-align: left; /* 确保左对齐 */
}
/* ▲▲▲ END: 核心修改点 ▲▲▲ */

.error-message {
  margin-top: 20px;
  color: #F56C6C; /* Element Plus 的危险颜色 */
  text-align: center;
}

.customer-service-info {
  margin-top: 30px; /* 调整与上方模块的间距 */
  font-size: 13px;
  color: #888;
  line-height: 1.6;
  text-align: left;
}

</style>