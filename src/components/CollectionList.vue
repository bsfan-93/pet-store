<template>
  <section class="collection-section" v-if="collections.length > 0">
    <div class="container">
      <div class="section-header">
        <h2>Shop by category</h2>
      </div>

      <div class="collection-grid">
        <a v-for="item in collections" :key="item.id" :href="`/collection/${item.id}`" class="collection-item">
          <div class="image-wrapper">
            <img :src="item.url" :alt="item.name">
            <h3>{{ item.name }}</h3>

            <el-icon class="arrow-icon"><ArrowRightBold /></el-icon>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>

import { ElIcon } from 'element-plus';
import { ArrowRightBold } from '@element-plus/icons-vue';

defineProps({
  collections: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
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

/* 标题 */
.section-header h2 {
  font-size: 42px;
  font-weight: 700;
  margin: 0;
}

.collection-grid {
  display: grid;
  /* 使用 auto-fit 和 minmax 来创建响应式网格 */
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  /* ▼▼▼ 新增下面这两行来控制整体尺寸 ▼▼▼ */
  /* max-width: 98%;  示例：让网格总宽度为外部容器的95%，你可以调整这个百分比 */
  /* margin: 0 auto;  让变窄后的网格在页面上保持居中 */
}

/* ▼▼▼ 【新增】媒体查询代码块 ▼▼▼ */
/* 当屏幕宽度小于或等于 768px 时 (典型的平板或手机) */
@media (max-width: 768px) {
  .collection-grid {
    /* 将网格布局改为一行一列 */
    grid-template-columns: 1fr;
  }
}

/* 你还可以为更小的手机屏幕再加一个断点 */
@media (max-width: 480px) {
  .section-header h2 {
    font-size: 24px; /* 在超小屏幕上，让标题也小一点 */
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

/* 鼠标悬停时，图片轻微放大，增加动感 */
.collection-item:hover img {
  transform: scale(1.05);
}

/* 图片标题 */
.collection-item h3 {
  position: absolute;
  bottom: 20px;
  left: 20px;
  margin: 0;
  padding: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--secondary-color);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

/* ▼▼▼ 2. 为新增的箭头图标添加样式 ▼▼▼ */
.arrow-icon {
  position: absolute;
  bottom: 25px; /* 与h3的bottom值保持一致，确保水平对齐 */
  right: 25px;  /* 定位到右下角 */
  font-size: 18px; /* 图标大小 */
  color: var(--secondary-color);
  opacity: 0; /* 默认状态下完全透明 */
  transition: opacity 0.3s ease-in-out; /* 让显示/隐藏有动画效果 */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

/* 3. 当鼠标悬停在整个卡片上时，让箭头浮现出来 */
.collection-item:hover .arrow-icon {
  opacity: 1; /* 透明度变为1，显示图标 */
}
</style>