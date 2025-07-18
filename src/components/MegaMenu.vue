<template>
  <div class="mega-menu" v-show="visible" v-if="menuData">
    <div class="menu-container">
      <div class="menu-links">
        <ul>
          <li v-for="link in menuData.links" :key="link.id">
            <a href="#" @click.prevent="navigateTo('productDetail', link.goodId)">{{ t('mega_menu.' + link.name) }}</a>
          </li>
        </ul>
      </div>
      <div class="menu-products">
        <a 
          v-for="product in menuData.products" 
          :key="product.id" 
          href="#" 
          @click.prevent="navigateTo('productDetail', product.goodId)" 
          class="product-item"
        >
          <img :src="product.imageUrl" :alt="product.name">
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, watch } from 'vue';
// ▼▼▼【新增】引入 useI18n ▼▼▼
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router'; // 【新增】导入 useRouter
import { getPhotoDetails } from '../api';

// ▼▼▼【新增】获取 t 函数 ▼▼▼
const { t } = useI18n();

const props = defineProps({
  visible: Boolean
});
const emit = defineEmits(['close']); // 【新增】定义一个 close 事件

// --- 【修改】使用 Vue Router 进行导航 ---
const router = useRouter();
const goToProduct = (productId) => {
  if (productId) {
    router.push({ path: `/product/${productId}` });
    emit('close'); // 【新增】跳转后，触发 close 事件来关闭菜单
  }
};

const navigateTo = inject('navigateTo');
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
/* 您的样式代码完全正确，无需任何修改 */
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
  padding-left: 370px;
  display: flex;
  align-items: flex-start;
  gap: 80px;
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
  padding: 12px 0;
  font-size: 18px;
  font-weight: 500;
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
  gap: 30px;
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