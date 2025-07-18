<template>
  <section class="collection-section" v-if="collections.length > 0">
    <div class="container">
      <div class="section-header">
        <h2>{{ t('collection_list.title') }}</h2>
      </div>

      <div class="collection-grid">
        <a 
          v-for="item in collections" 
          :key="item.id" 
          href="#" 
          @click.prevent="goToProduct(item.goodId)" 
          class="collection-item"
        >
          <div class="image-wrapper">
            <img :src="item.url" :alt="item.name">
            <h3>{{ t('products.' + item.name) }}</h3>
            <el-icon class="arrow-icon"><ArrowRightBold /></el-icon>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject } from 'vue'; // 【修正】引入 inject
import { useI18n } from 'vue-i18n'; // 【新增】引入 i18n
import { ElIcon } from 'element-plus';
import { ArrowRightBold } from '@element-plus/icons-vue';

const { t } = useI18n(); // 【新增】获取 t 函数

defineProps({
  collections: {
    type: Array,
    default: () => []
  }
});

// ▼▼▼【修正】恢复使用项目原有的 navigateTo 函数 ▼▼▼
const navigateTo = inject('navigateTo');
</script>


<style scoped>
/* 样式无需修改 */
.collection-section {
  padding: 120px 0;
  background-color: var(--secondary-color);
}

.container {
  max-width: var(--container-width, 1200px);
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.section-header h2 {
  font-size: 42px;
  font-weight: 700;
  margin: 0;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

@media (max-width: 768px) {
  .collection-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .section-header h2 {
    font-size: 24px;
  }
}

.collection-item {
  text-decoration: none;
  display: block;
  transition: transform 0.3s ease;
}

.collection-item:hover {
    transform: translateY(-5px);
}

.image-wrapper {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 15px 15px rgba(0,0,0,0.05);
}

.collection-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.collection-item:hover img {
  transform: scale(1.05);
}

.collection-item h3 {
  position: absolute;
  bottom: 20px;
  left: 20px;
  margin: 0;
  padding: 0;
  font-size: 20px;
  font-weight: 600;
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.arrow-icon {
  position: absolute;
  bottom: 25px;
  right: 25px;
  font-size: 18px;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.collection-item:hover .arrow-icon {
  opacity: 1;
}
</style>