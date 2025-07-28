<!-- Shop by category”（按类别选购） -->
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
            <h3>{{ t('products.' + item.name.toLowerCase()) }}</h3>
            <el-icon class="arrow-icon"><ArrowRightBold /></el-icon>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'; // 【新增】引入 i18n
import { useRouter } from 'vue-router'; // 【新增】导入 useRouter
import { ElIcon } from 'element-plus';
import { ArrowRightBold } from '@element-plus/icons-vue';

const { t } = useI18n(); // 【新增】获取 t 函数

// 定义 props
defineProps({
  collections: {
    type: Array,
    default: () => []
  }
});

// --- 【新增】使用 Vue Router 进行导航 ---
const router = useRouter();
const goToProduct = (productId) => {
  if (productId) {
    router.push({ path: `/product/${productId}` });
  }
};
// --- 新增结束 ---
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
  /* ▼▼▼ 【修改】將 auto-fit 改為固定的三欄 ▼▼▼ */
  grid-template-columns: repeat(3, 1fr);
  /* ▲▲▲ 修改結束 ▲▲▲ */
  gap: 30px;
}

@media (max-width: 767px) {
  .collection-grid {
    /* 在手機上，覆蓋為單欄佈局 */
    grid-template-columns: 1fr;
    gap: 20px;
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
  color: #fff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.arrow-icon {
  position: absolute;
  bottom: 25px;
  right: 25px;
  font-size: 18px;
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.collection-item:hover .arrow-icon {
  opacity: 1;
}


</style>