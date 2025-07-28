<template>
  <section class="interactive-showcase-section">
    <div 
      class="showcase-container" 
      ref="containerRef"
      @wheel="handleWheel"
    >
      <div class="image-container">
        <img
          v-for="(item, index) in allItems"
          :key="item.id"
          :src="item.url"
          :alt="item.name"
          class="showcase-image"
          :class="{ active: currentIndex === index }"
        />
      </div>

      <div class="nav-container">
        <ul>
          <li
            v-for="(item, index) in allItems"
            :key="item.id"
            class="nav-item"
            :class="{ active: currentIndex === index }"
            @mouseenter="updateActiveItem(index)"
          >
            <h3>{{ item.name }}</h3>
            <div class="item-details">
              <span v-if="item.tag" class="tag" :class="item.tag.type">{{ item.tag.text }}</span>
              <p>{{ item.description }}</p>
              <button class="buy-now" @click="goToProduct(item.goodId)">{{ t('product.buy_now') }}</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

const allItems = ref([
  {
    id: 1,
    name: 'Scout Smart Camera',
    description: 'Goodbye worries. Hello Scout.',
    url: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?q=80&w=2487&auto=format&fit=crop', 
    goodId: 'your-product-id-1',
    tag: { type: 'new', text: 'New' }
  },
  {
    id: 2,
    name: 'Granary Series',
    description: 'Award-winning automatic feeders.',
    url: 'https://images.unsplash.com/photo-1596492784533-2c15_d440da2?q=80&w=2564&auto=format&fit=crop',
    goodId: 'your-product-id-2',
    tag: { type: 'bestseller', text: 'Best Seller' }
  },
  {
    id: 3,
    name: 'One RFID Feeder',
    description: 'Feeding made personal for multiple-pet families.',
    url: 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=2487&auto=format&fit=crop',
    goodId: 'your-product-id-3'
  },
  {
    id: 4,
    name: 'Dockstream Cordless Fountain',
    description: 'Battery-operated for hydration anywhere.',
    url: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?q=80&w=2532&auto=format&fit=crop',
    goodId: 'your-product-id-4'
  }
]);

const currentIndex = ref(0);
const containerRef = ref(null);

let isScrolling = false;
const scrollCooldown = 800;

const updateActiveItem = (newIndex) => {
  if (newIndex >= 0 && newIndex < allItems.value.length) {
    currentIndex.value = newIndex;
  }
};

// ▼▼▼ 【核心修改】更新 handleWheel 函数的逻辑 ▼▼▼
const handleWheel = (event) => {
  // 如果动画正在播放（冷却期），则阻止任何滚动以避免抖动
  if (isScrolling) {
    event.preventDefault();
    return;
  }
  
  const isScrollingDown = event.deltaY > 0;
  const isAtTop = currentIndex.value === 0;
  const isAtBottom = currentIndex.value === allItems.value.length - 1;

  // 检查是否在边界：如果是，则不阻止默认滚动并退出函数
  if ((isScrollingDown && isAtBottom) || (!isScrollingDown && isAtTop)) {
    return; // 允许页面滚动
  }
  
  // 如果不在边界，则阻止页面滚动，并执行组件内部的切换
  event.preventDefault();

  isScrolling = true;
  setTimeout(() => { isScrolling = false; }, scrollCooldown);

  let newIndex = currentIndex.value + (isScrollingDown ? 1 : -1);
  updateActiveItem(newIndex);
};
// ▲▲▲ 修改结束 ▲▲▲

const goToProduct = (goodId) => {
  if (goodId && goodId.startsWith('your-product-id')) {
      console.warn("Please replace placeholder goodId before navigating.");
      return;
  }
  if (goodId) {
    router.push(`/product/${goodId}`);
  }
};

onMounted(() => {
  updateActiveItem(0);
});
</script>

<style scoped>
/* 样式部分无需任何修改 */
.interactive-showcase-section {
    padding: 100px 0;
    background-color: #968C82;
}
.showcase-container {
    display: flex;
    width: 100%;
    max-width: var(--container-width, 1920px);
    margin: 0 auto;
    background-color: transparent;
    padding: 0 40px;
}
.image-container {
    flex: 1;
    position: relative;
    min-height: 500px;
    overflow: hidden;
    border-radius: 8px;
}
.showcase-image {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;
}
.showcase-image.active {
    opacity: 1;
    transform: translateY(0);
}
.nav-container {
    flex: 1;
    padding-left: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.nav-container ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
.nav-item {
    padding: 60px 0;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.6);
    transition: color 0.3s ease;
}
.nav-item h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 500;
}
.nav-item.active {
    color: #FFFFFF;
}
.item-details {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: all 0.5s ease-out;
}
.nav-item.active .item-details {
    max-height: 200px;
    opacity: 1;
    margin-top: 10px;
}
.item-details p {
    margin: 8px 0;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
}
.tag {
    font-size: 0.8rem;
    font-weight: bold;
    padding: 3px 8px;
    border-radius: 5px;
    color: #fff;
    display: inline-block;
    margin-bottom: 8px;
}
.tag.new { background-color: #007bff; }
.tag.bestseller { background-color: #28a745; }
.buy-now {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    transition: background-color 0.3s ease;
}
.buy-now:hover {
    background-color: #218838;
}
</style>