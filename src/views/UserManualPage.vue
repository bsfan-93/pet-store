<!-- “用户手册” 页面，提供产品的电子版使用说明书。 -->

<template>
  <div class="manual-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="manual-container">
        <h1 class="page-title">{{ t('user_manual_page.title') }}</h1>
        
        <section v-for="section in manualSections" :key="section.titleKey" class="manual-section">
          <h2 class="section-title">{{ t(section.titleKey) }}</h2>
          <div class="item-grid">
            <div v-for="item in section.items" :key="item.id" class="manual-item">
              <div class="image-container">
                <img :src="item.imageUrl" :alt="item.name" class="item-image">
              </div>
                            <router-link v-if="item.link" :to="item.link" class="item-button">
                <span>{{ t('user_manual_page.product_name') }} {{ item.id }}</span>
                <!-- <span>{{ t('user_manual_page.download_manual') }}</span> -->
                <el-icon><Document /></el-icon>
              </router-link>
              <div v-else class="item-button-disabled">
                <span>{{ t('user_manual_page.product_name') }} {{ item.id }}</span>
                <!-- <span>{{ t('user_manual_page.download_manual') }}</span> -->
                <el-icon><Document /></el-icon>
              </div>
                          </div>
          </div>
        </section>

      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import { ElIcon } from 'element-plus';
import { Document } from '@element-plus/icons-vue';

const { t } = useI18n();

// ▼▼▼ 1. 為每個 item 添加 imageUrl 屬性 ▼▼▼
const manualSections = ref([
  {
    titleKey: 'user_manual_page.feeder',
    items: [
      { id: 1, name: 'Feeder Model 1', link: '/placeholder/feeder-1', imageUrl: '/images/manual_feeder1.png' },
      { id: 2, name: 'Feeder Model 2', link: '/placeholder/feeder-2', imageUrl: '/images/manual_feeder2.png' },
      { id: 3, name: 'Feeder Model 3', link: '/placeholder/feeder-3', imageUrl: '/images/manual_feeder3.png' },
      { id: 4, name: 'Feeder Model 4', link: '/placeholder/feeder-4', imageUrl: '/images/manual_feeder4.png' }
    ]
  },
  {
    titleKey: 'user_manual_page.fountains',
    items: [
      { id: 5, name: 'pets clan Fountains', link: '/placeholder/fountains-1', imageUrl: '/images/manual_fountain1.png' },
      { id: 6, name: 'pets clan Fountains', link: '/placeholder/fountains-2', imageUrl: '/images/manual_fountain2.png' }
    ]
  },
  {
    titleKey: 'user_manual_page.leash',
    items: [
      { id: 7, name: 'pets clan Leash 1', link: '/placeholder/leash-1', imageUrl: '/images/manual_leash1.png' },
      { id: 8, name: 'pets clan Leash 2', link: '/placeholder/leash-2', imageUrl: '/images/manual_leash2.png' }
    ]
  }
]);
</script>

<style scoped>
.manual-page {
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
  padding: 40px 20px 120px 20px;
}
.manual-container {
  max-width: 1000px;
  margin: 0 auto;
  text-align: left;
}
.page-title {
  font-size: 60px;
  font-weight: 600;
  color: #000;
  margin-bottom: 40px;
  /* ▼▼▼ 3. 將標題居中 ▼▼▼ */
  text-align: center; 
}
.manual-section {
  margin-bottom: 60px;
}
.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #000;
  margin-bottom: 30px;
}
.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 30px;
}
.manual-item {
  display: flex;
  flex-direction: column;
  gap: 0; 
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s;
}
.manual-item:hover {
  transform: translateY(-5px);
}
.image-container { /* 替換 .image-placeholder */
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #f0f0f0;
}
.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 確保圖片填滿容器且不變形 */
}
.item-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 15px;
  background-color: #e8f5e9;
  color: #388e3c;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.3s;
  box-sizing: border-box;
}
.item-button:hover {
  background-color: #dcedc8;
}

/* ▼▼▼ 样式修改：重写 item-button 内部的布局规则 ▼▼▼ */

/* 1. 产品名称（第一个 span）占据所有剩余空间 */
.item-button span:first-child {
  flex-grow: 1;
  text-align: left;
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 2. 下载手册文本（第二个 span）和图标（el-icon）紧密排列在右侧 */
.item-button span:nth-child(2) {
    /* 移除 flex-grow: 1; */
    flex-shrink: 0; /* 防止被压缩 */
    margin-left: 10px; /* 与产品名称保持间距 */
    white-space: nowrap;
}

/* 3. 图标紧随下载文本 */
.item-button .el-icon {
  font-size: 18px;
  flex-shrink: 0;
  margin-left: 5px; /* 与下载文本保持间距 */
}

/* 4. 重复应用于不可点击状态 */
.item-button-disabled {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 15px;
  background-color: #f5f5f5;
  color: #aaa;
  font-weight: 500;
  text-decoration: none;
  box-sizing: border-box;
  cursor: not-allowed;
}

.item-button-disabled span:first-child {
  flex-grow: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-button-disabled span:nth-child(2) {
    flex-shrink: 0;
    margin-left: 10px;
    white-space: nowrap;
}

.item-button-disabled .el-icon {
  font-size: 18px;
  flex-shrink: 0;
  margin-left: 5px;
}
</style>