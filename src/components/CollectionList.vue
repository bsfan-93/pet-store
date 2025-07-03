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
defineProps({
  collections: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.collection-section {
  padding: 80px 0;
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
  font-size: 60px;
  font-weight: 700;
  margin: 0;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
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
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
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

.collection-item h3 {
  position: absolute;
  bottom: 25px;
  left: 25px;
  margin: 0;
  padding: 0;
  font-size: 24px;
  font-weight: 600;
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

/* ▼▼▼ 2. 为新增的箭头图标添加样式 ▼▼▼ */
.arrow-icon {
  position: absolute;
  bottom: 25px; /* 与h3的bottom值保持一致，确保水平对齐 */
  right: 25px;  /* 定位到右下角 */
  font-size: 28px; /* 图标大小 */
  color: white;
  opacity: 0; /* 默认状态下完全透明 */
  transition: opacity 0.3s ease-in-out; /* 让显示/隐藏有动画效果 */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

/* 3. 当鼠标悬停在整个卡片上时，让箭头浮现出来 */
.collection-item:hover .arrow-icon {
  opacity: 1; /* 透明度变为1，显示图标 */
}
</style>