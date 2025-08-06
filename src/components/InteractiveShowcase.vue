<template>
  <section class="interactive-showcase-section" ref="containerRef">
    <div class="showcase-container">
      <div class="image-container">
        <transition-group :name="transitionName">
          <img
            v-for="(item, index) in allItems"
            v-show="currentIndex === index"
            :key="item.id"
            :src="item.url"
            :alt="item.name"
            class="showcase-image"
          />
        </transition-group>
      </div>
      <div class="nav-container">
        <div class="custom-scrollbar">
          <div class="scrollbar-thumb" :style="thumbStyle"></div>
        </div>
        <ul ref="navListRef">
          <li
            v-for="(item, index) in allItems"
            :key="item.id"
            class="nav-item"
            :class="{ active: currentIndex === index }"
            @mouseenter="updateActiveItem(index)"
          >
            <transition name="fade-effect">
              <div v-if="currentIndex === index" class="active-details">
                <span v-if="item.tag" class="tag">{{ item.tag.text }}</span>
                <h3 class="product-title">{{ item.name }}</h3>
                <p class="product-description">{{ item.description }}</p>
                <button class="buy-now" @click="goToProduct(item.goodId)">
                  {{ t("product.buy_now") }}
                </button>
              </div>
            </transition>
            <transition name="fade-effect">
              <h3 v-if="currentIndex !== index" class="inactive-title">
                {{ item.name }}
              </h3>
            </transition>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();

const allItems = ref([
  { id: 1, name: 'Pets Clan Feeder Pro', description: 'New ways of pet feeding', url: '/images/manual_feeder4.png', goodId: 'your-product-id-1', tag: { type: 'new', text: 'New' } },
  { id: 2, name: 'Water feeder series', description: 'Fresh, clean water for your pets.', url: '/images/manual_fountain2.png', goodId: 'your-product-id-2', tag: null },
  { id: 3, name: 'Cute Pet Family Series', description: 'Smart leash for modern pet owners.', url: '/images/manual_leash1.png', goodId: 'your-product-id-3', tag: null }
]);

const currentIndex = ref(0);
const containerRef = ref(null);
const navListRef = ref(null);
const thumbStyle = ref({});
const transitionDirection = ref("down");
const transitionName = computed(() => `fly-${transitionDirection.value}`);
let isAnimating = false;
const animationCooldown = 800;
let isHijacked = false; 

const updateThumbPosition = async () => {
  await nextTick();
  const listElement = navListRef.value;
  if (!listElement || !listElement.children[currentIndex.value]) return;
  const activeItemElement = listElement.children[currentIndex.value];
  thumbStyle.value = {
    height: `${activeItemElement.offsetHeight}px`,
    transform: `translateY(${activeItemElement.offsetTop}px)`,
  };
};

const updateActiveItem = (newIndex) => {
  if (
    isAnimating ||
    newIndex === currentIndex.value ||
    newIndex < 0 ||
    newIndex >= allItems.value.length
  ) {
    return;
  }
  transitionDirection.value = newIndex > currentIndex.value ? "down" : "up";
  isAnimating = true;
  setTimeout(() => {
    isAnimating = false;
  }, animationCooldown);
  currentIndex.value = newIndex;
};

const handleWheel = (event) => {
  if (!isHijacked) return;

  const isScrollingDown = event.deltaY > 0;

  if (
    (currentIndex.value === 0 && !isScrollingDown) ||
    (currentIndex.value === allItems.value.length - 1 && isScrollingDown)
  ) {
    // 在边界处，不阻止默认事件，让浏览器自然滚动
    return;
  }

  event.preventDefault();

  if (isAnimating) return;

  const newIndex = currentIndex.value + (isScrollingDown ? 1 : -1);
  updateActiveItem(newIndex);
};

const goToProduct = (goodId) => {
  if (goodId && goodId.startsWith("your-product-id")) {
    console.warn("Please replace placeholder goodId before navigating.");
    return;
  }
  if (goodId) {
    router.push(`/product/${goodId}`);
  }
};

watch(currentIndex, updateThumbPosition);

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      // 当组件完全进入视窗时，我们才开始“劫持”滚轮事件
      isHijacked = entry.isIntersecting;
    },
    { threshold: 1.0 } // 阈值设为1.0，表示完全可见时才劫持
  );

  if (containerRef.value) {
    observer.observe(containerRef.value);
    window.addEventListener("wheel", handleWheel, { passive: false });
  }

  updateThumbPosition();

  onUnmounted(() => {
    if (containerRef.value) {
      observer.unobserve(containerRef.value);
    }
    window.removeEventListener("wheel", handleWheel);
  });
});
</script>

<style scoped>
.interactive-showcase-section {
  height: 100vh;
  padding: 0;
  background-color: #f5f5f3;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* --- 其他所有样式保持不变 --- */
.showcase-container { 
    display: flex; 
    align-items: center; 
    width: 100%; 
    margin: 0 auto; 
    padding: 0 5%;
    box-sizing: border-box; 
}
.image-container { flex: 1.2; position: relative; height: 600px; }
.showcase-image { position: absolute; width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 15px 15px rgba(0,0,0,0.1)); }
.fly-down-enter-active, .fly-down-leave-active, .fly-up-enter-active, .fly-up-leave-active { transition: all 0.9s cubic-bezier(0.68, -0.55, 0.27, 1.55); position: absolute; }
.fly-down-enter-from { opacity: 0; transform: translate(-200px, 200px) scale(0.8); }
.fly-down-leave-to { opacity: 0; transform: translate(200px, -200px) scale(1.2); }
.fly-up-enter-from { opacity: 0; transform: translate(200px, -200px) scale(0.8); }
.fly-up-leave-to { opacity: 0; transform: translate(-200px, 200px) scale(1.2); }
.fade-effect-enter-active, .fade-effect-leave-active { transition: opacity 0.5s ease-in-out; }
.fade-effect-enter-from, .fade-effect-leave-to { opacity: 0; }
.nav-container { flex: 1; padding-left: 10%; display: flex; gap: 20px; align-items: center; }
.custom-scrollbar { width: 2px; height: 450px; background-color: #000000; position: relative; }
.scrollbar-thumb { width: 6px; background-color: #4A5C44; position: absolute; left: 50%; top: 0; transform: translateX(-50%); transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), height 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
.nav-container ul { list-style: none; padding: 0; margin: 0; flex-grow: 1; position: relative; }
.nav-item { min-height: 150px; display: flex; flex-direction: column; justify-content: center; cursor: pointer; }
.active-details .tag { font-size: 14px; font-weight: 500; color: #92C45C; margin-bottom: 8px; }
.active-details .product-title { font-size: 32px; font-weight: bold; color: #000; margin: 0; }
.active-details .product-description { font-size: 16px; color: #333; margin: 8px 0 20px 0; }
.active-details .buy-now { background-color: #92C45C; color: #000; border: none; padding: 10px 25px; font-size: 14px; font-weight: 500; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease; align-self: flex-start; }
.active-details .buy-now:hover { background-color: #82b350; }
.inactive-title { font-size: 22px; font-weight: 500; color: #888; margin: 0; transition: color 0.3s ease; }
.nav-item:hover .inactive-title { color: #000; }
</style>