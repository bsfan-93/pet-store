<template>
  <div class="mega-menu" v-show="visible" v-if="menuData">
    <div class="menu-container">
      <div class="menu-links">
        <ul>
          <li v-for="link in menuData.links" :key="link.id">
            <a href="#" @click.prevent="navigateTo('productDetail', link.goodId)">{{ link.name }}</a>
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
import { getPhotoDetails } from '../api';

// 1. 接收来自 AppHeader 的 visible prop
const props = defineProps({
  visible: Boolean
});

// 2. 注入全局的导航函数
const navigateTo = inject('navigateTo');

// 3. 在组件内部管理自己的数据
const menuData = ref(null);

// 4. 定义获取数据的函数
const fetchMegaMenuData = async () => {
  // 为避免重复请求，只有在没有数据时才请求。
  // 如果您希望每次都重新获取，可以移除 if (menuData.value) return; 这行。
  if (menuData.value) return;

  try {
    const rawData = await getPhotoDetails(0);
    
    // ▼▼▼ 【修改】根据新的 API 格式来转换数据 ▼▼▼
    menuData.value = {
      // 左侧链接区的数据
      links: rawData.map(item => ({ 
        id: item.id, 
        name: item.name, 
        goodId: item.goodId // 确保 goodId 被保存
      })),
      // 右侧图片区的数据
      products: rawData.map(item => ({ 
        id: item.id, 
        name: item.name, 
        imageUrl: item.url, // 图片地址
        goodId: item.goodId // 确保 goodId 被保存
      }))
    };

  } catch (error) {
    console.error("在 MegaMenu 中获取数据失败:", error);
  }
};

// 5. 使用 watch 监听 visible prop 的变化
watch(() => props.visible, (newValue) => {
  // 当菜单需要显示时 (从 false 变为 true)，就触发数据获取
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