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
                <span>{{ item.name }}</span>
                <el-icon><Document /></el-icon>
              </router-link>
              <div v-else class="item-button-disabled">
                <span>{{ item.name }}</span>
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
      { id: 1, name: 'pets clan feeder 1', link: '/placeholder/feeder-1', imageUrl: '/images/manual_feeder1.png' },
      { id: 2, name: 'pets clan feeder 1', link: '/placeholder/feeder-2', imageUrl: '/images/manual_feeder2.png' },
      { id: 3, name: 'pets clan feeder 1', link: '/placeholder/feeder-3', imageUrl: '/images/manual_feeder3.png' },
      { id: 4, name: 'pets clan feeder 1', link: '/placeholder/feeder-4', imageUrl: '/images/manual_feeder4.png' }
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
  padding: 80px 20px 120px 20px;
}
.manual-container {
  max-width: 1000px;
  margin: 0 auto;
  text-align: left;
}
.page-title {
  font-size: 32px;
  font-weight: 600;
  color: #000;
  margin-bottom: 60px;
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
.item-button span {
  flex-grow: 1;
  text-align: left;
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-button .el-icon {
  font-size: 18px;
  flex-shrink: 0;
}
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
.item-button-disabled span {
  flex-grow: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-button-disabled .el-icon {
  font-size: 18px;
  flex-shrink: 0;
}
</style>