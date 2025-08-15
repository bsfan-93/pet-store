<!-- 首页的**“按分类选购”**模块，展示主要的商品分类入口。 -->

<template>
  <section class="collection-section" v-if="collections.length > 0">
    <div class="container">
      <div class="section-header">
        <h2>{{ t('collection_list.title') }}</h2>
      </div>
      <div class="collection-grid">
        <a 
          v-for="(item, index) in collections" 
          :key="item.id" 
          href="#" 
          @click.prevent="goToCategory(categoryTranslationKeys[index])" 
          class="collection-item"
        >
          <div class="image-wrapper">
            <img :src="item.url" :alt="item.name">
            <h3>{{ t(categoryTranslationKeys[index]) }}</h3>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
// 删除了 ElIcon 和 ArrowRightBold 的导入，因为不再需要了

const { t } = useI18n();

const categoryTranslationKeys = [
  'mega_menu.feeder',
  'mega_menu.fountains',
  'mega_menu.leash'
];

defineProps({
  collections: {
    type: Array,
    default: () => []
  }
});

const router = useRouter();

// ▼▼▼ START: 核心修改点 1 - 修改了跳转逻辑 ▼▼▼
const goToCategory = (categoryKey) => {
  // categoryKey 的值会是 'mega_menu.feeder' 或 'mega_menu.fountains'
  if (categoryKey) {
    // 我们从 "mega_menu.feeder" 中提取出 "feeder"
    const category = categoryKey.split('.')[1];
    // 然后跳转到对应的分类页面，例如 /shop/feeder
    router.push({ path: `/shop/${category}` });
  }
};
// ▲▲▲ END: 核心修改点 1 ▲▲▲

// const goToProduct = (productId) => {
//   if (productId) {
//     router.push({ path: `/product/${productId}` });
//   }
// };
</script>


<style scoped>
.collection-section {
  padding: 140px 0;
  background-color: var(--secondary-color);
}

.container {
  max-width: var(--container-width, 1200px);
  margin: 0 auto;
  padding: 0 20px;
}

/* ▼▼▼ START: 样式修改部分 ▼▼▼ */

.section-header {
  /* 移除了 display: flex 等属性，让 h2 默认左对齐 */
  margin-bottom: 70px;
}

.section-header h2 {
  font-size: 48px; /* 将标题调小一点以匹配设计图 */
  font-weight: 600; /* 字体加粗一些 */
  margin: 0;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 80px;
}

.collection-item {
  text-decoration: none;
  display: block;
  /* 移除了卡片向上浮动的动画 */
  transition: transform 0.3s ease;
}

/* 卡片悬停时不再向上移动 */
.collection-item:hover {
    transform: none; 
}

.image-wrapper {
  width: 100%;
  aspect-ratio: 4 / 3;
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

/* 将文字标题定位到右下角，并调整样式 */
.collection-item h3 {
  position: absolute;
  bottom: 20px;
  right: 25px; /* 从 left 改为 right */
  margin: 0;
  padding: 0;
  font-size: 22px; /* 字体调小 */
  font-weight: 500; /* 字体变细 */
  color: #fff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

/* 删除了 .arrow-icon 和 .collection-item:hover .arrow-icon 样式 */

/* ▲▲▲ END: 样式修改部分 ▲▲▲ */

@media (max-width: 767px) {
  .section-header h2 {
    font-size: 28px;
  }
  .collection-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>