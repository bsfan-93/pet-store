<template>
  <section class="new-popular-section">
    <div class="container">
      <h2 class="section-title">New & Popular</h2>
      
      <el-tabs v-model="activeTab" class="product-tabs">
        <el-tab-pane label="New" name="new">
          <div class="product-grid">
            <ProductCard v-for="item in newItems" :key="item.id" :product="item"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Popular" name="popular">
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
  grid-template-columns: repeat(4, 1fr); /* 每行4个产品 */
  gap: 25px;
}

/* 自定义Element Plus Tabs的样式 */
:deep(.el-tabs__header) {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}
:deep(.el-tabs__nav) {
  border: none;
}
:deep(.el-tabs__item) {
  font-size: 18px;
  font-weight: 500;
  padding: 0 25px;
  height: 50px;
}
:deep(.el-tabs__active-bar) {
  background-color: var(--text-color);
  height: 2px;
}
</style>