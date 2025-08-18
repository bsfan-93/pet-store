<template>
  <section class="interactive-showcase-section">
    <div class="showcase-container">
      <div class="image-container">
        <transition-group name="fade-slow">
          <img
            v-for="(item, index) in allItems"
            v-show="activeIndex === index"
            :key="item.id"
            :src="item.url"
            :alt="item.name"
            class="showcase-image"
          />
        </transition-group>
      </div>
      <div class="nav-container">
        <ul>
          <li
            v-for="(item, index) in allItems"
            :key="item.id"
            class="nav-item"
            ref="navItemsRef"
          >
            <div class="content-wrapper" :class="{ active: activeIndex === index }">
              <span v-if="item.tag" class="tag">{{ item.tag }}</span>
              <span class="nav-item-title">{{ item.name }}</span>
              <p class="nav-item-description">{{ item.description }}</p>
              <div class="nav-item-actions">
                <button class="buy-now" @click="goToProduct(item.goodId)">{{ t('product.buy_now') }}</button>
                <a href="#" @click.prevent="goToProduct(item.goodId)" class="learn-more">Learn More →</a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

const allItems = ref([
  { id: 1, name: 'Dockstream 2 Smart Fountain', description: 'The next generation of pet hydration', url: '/images/manual_fountain2.png', goodId: 'your-product-id-2', tag: 'New' },
  { id: 2, name: 'Scout Smart Camera', description: 'Goodbye worries, Hello Scout.', url: '/images/feature-camera.jpg', goodId: 'your-product-id-camera', tag: null },
  { id: 3, name: 'Granary Series', description: 'Award-winning automatic feeders', url: '/images/pet-feeder-promo.png', goodId: 'your-product-id-feeder', tag: null },
  { id: 4, name: 'One RFID Feeder', description: 'Feeding made personal for multiple-pet families', url: '/images/manual_feeder2.png', goodId: 'your-product-id-rfid', tag: null },
]);

const activeIndex = ref(0);
const navItemsRef = ref([]);
let observer = null;

const goToProduct = (goodId) => {
  if (goodId) router.push(`/product/${goodId}`);
};

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const newIndex = parseInt(entry.target.dataset.index, 10);
          activeIndex.value = newIndex;
        }
      });
    },
    {
      root: null,
      rootMargin: "-50% 0px -50% 0px", // 觸發線在視窗垂直正中央
      threshold: 0,
    }
  );

  navItemsRef.value.forEach((item, index) => {
    item.dataset.index = index;
    observer.observe(item);
  });
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
/* 整體佈局 */
.interactive-showcase-section {
  padding: 120px 0;
  background-color: #f5f5f3;
}
.showcase-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 80px;
  align-items: flex-start; /* 讓 sticky 佈局正常工作 */
}

/* 左側圖片容器 */
.image-container {
  flex: 1.2; /* 讓圖片區更寬一點 */
  height: 600px;
  position: sticky;
  top: calc(50vh - 300px); /* 垂直置中鎖定 */
}
.showcase-image {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

/* 右側導覽列表 */
.nav-container {
  flex: 1;
}
.nav-container ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

/* 列表項 */
.nav-item {
  /* 關鍵：讓每個 li 高度由內容決定，但有一個最小高度 */
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 讓內容在 li 內部垂直置中 */
}
/* 關鍵：為列表的頂部和底部增加緩衝區 */
.nav-container ul::before,
.nav-container ul::after {
  content: '';
  display: block;
  height: calc(50vh - 150px); /* 50%視窗高度 - 項目最小高度的一半 */
}

/* 內容區塊的樣式和動畫 */
.content-wrapper {
  transition: all 0.5s ease;
  opacity: 0.4;
  filter: blur(2px);
}
.content-wrapper.active {
  opacity: 1;
  filter: blur(0);
}
.tag, .nav-item-description, .nav-item-actions {
  transition: all 0.4s ease;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
}
.content-wrapper.active .tag,
.content-wrapper.active .nav-item-description,
.content-wrapper.active .nav-item-actions {
  max-height: 100px; /* 給一個足夠大的值 */
  opacity: 1;
}

/* 文字和按鈕樣式 */
.tag {
  color: #555;
  font-size: 14px;
  margin-bottom: 10px;
}
.nav-item-title {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 10px;
  display: block;
  transition: font-size 0.4s ease;
}
.content-wrapper.active .nav-item-title {
  font-size: 28px;
}
.nav-item-description {
  font-size: 16px;
  color: #666;
}
.nav-item-actions {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}
.buy-now {
  background-color: #92C45C;
  color: #fff;
  border: none;
  padding: 10px 25px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 20px;
  cursor: pointer;
}
.learn-more {
  color: #000;
  text-decoration: none;
  font-weight: 500;
}

/* 圖片切換動畫 */
.fade-slow-enter-active,
.fade-slow-leave-active {
  transition: opacity 0.8s ease;
}
.fade-slow-enter-from,
.fade-slow-leave-to {
  opacity: 0;
}
</style>