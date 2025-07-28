<template>
  <section class="new-popular-section">
    <div class="container">
      <h2 class="section-title">{{ $t('new_popular.title') }}</h2>
      
      <el-tabs v-model="activeTab" class="product-tabs">
        <el-tab-pane label="New Arrivals" name="new">
          <div class="product-grid">
            <ProductCard v-for="item in newItems" :key="item.id" :product="item"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Best Sellers" name="popular">
          <div class="product-grid">
            <ProductCard v-for="item in popularItems" :key="item.id" :product="item"/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import ProductCard from './ProductCard.vue';
import { ElTabs, ElTabPane } from 'element-plus';

defineProps({
  newItems: { type: Array, default: () => [] },
  popularItems: { type: Array, default: () => [] }
});

const activeTab = ref('new');
</script>

<style scoped>
.new-popular-section {
  padding: 80px 0;
  background-color: var(--secondary-color);
}
.container {
  max-width: var(--container-width, 1200px);
  margin: 0 auto;
  padding: 0 20px;
}
.section-title {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 40px;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

/* 自定义Element Plus Tabs的样式 */
:deep(.el-tabs__header) {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}
:deep(.el-tabs__nav) {
  border: 1px solid var(--border-color);
  border-radius: 50px;
  padding: 5px;
}
:deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 500;
  padding: 0 25px;
  height: 40px;
  border-radius: 40px;
}
:deep(.el-tabs__item.is-active) {
  background-color: var(--text-color);
  color: var(--secondary-color);
}
:deep(.el-tabs__active-bar) {
  display: none;
}

/* ▼▼▼ 【新增】針對手機的響應式樣式 ▼▼▼ */
@media (max-width: 767px) {
    .new-popular-section {
        padding: 60px 0;
    }
    .section-title {
        font-size: 28px;
    }
    :deep(.el-tabs__item) {
        font-size: 14px;
        padding: 0 15px;
        height: 35px;
    }
}
</style>