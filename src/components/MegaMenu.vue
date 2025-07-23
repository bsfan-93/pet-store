<template>
  <div class="mega-menu" v-show="visible" v-if="menuData">
    <div class="menu-container">
      <div class="menu-links">
        <ul>
          <li v-for="link in menuData.links" :key="link.id">
            <a href="#" @click.prevent="goToProduct(link.goodId)">{{ t('mega_menu.' + link.name.toLowerCase()) }}</a>
          </li>
        </ul>
      </div>
      <div class="menu-products">
        <a 
          v-for="product in menuData.products" 
          :key="product.id" 
          href="#" 
          @click.prevent="goToProduct(product.goodId)" 
          class="product-item"
        >
          <img :src="product.imageUrl" :alt="product.name">
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n'; // 引入 useI18n
import { getPhotoDetails } from '../api';

const { t } = useI18n(); // 获取 t 函数

const props = defineProps({
  visible: Boolean
});
const emit = defineEmits(['close']);

const router = useRouter();
const goToProduct = (productId) => {
  if (productId) {
    router.push({ path: `/product/${productId}` });
    emit('close');
  }
};

const menuData = ref(null);

const fetchMegaMenuData = async () => {
  if (menuData.value) return;
  try {
    const rawData = await getPhotoDetails(0);
    menuData.value = {
      links: rawData.map(item => ({ id: item.id, name: item.name, goodId: item.goodId })),
      products: rawData.map(item => ({ id: item.id, name: item.name, imageUrl: item.url, goodId: item.goodId }))
    };
  } catch (error) {
    console.error("在 MegaMenu 中获取数据失败:", error);
  }
};

watch(() => props.visible, (newValue) => {
  if (newValue) {
    fetchMegaMenuData();
  }
});
</script>

<style scoped>
/* Your styles remain unchanged */
.mega-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: var(--secondary-color);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  animation: growDown 0.3s ease-in-out forwards;
  z-index: 999;
}
.menu-container {
  padding-top: 30px;
  padding-bottom: 30px;
  padding-right: 40px;
  padding-left: 170px;
  display: flex;
  align-items: flex-start;
  gap: 180px;
}
.menu-links {
  width: var(--logo-width);
  flex-shrink: 0;
  padding-top: 10px;
}
.menu-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.menu-links li a {
  display: block;
  padding: 30px 0;   /* 12px */
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.2s;
}
.menu-links li a:hover {
  color: var(--accent-color);
}
.menu-products {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  gap: 80px;
}
.product-item {
  display: block;
  width: 300px;
  text-decoration: none;
}
.product-item img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  background-color: #f7f7f8;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}
.product-item:hover img {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
@keyframes growDown {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>