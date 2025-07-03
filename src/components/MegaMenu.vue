<template>
  <div class="mega-menu" v-if="menuData && menuData.links && menuData.products">
    <div class="menu-container">
      <div class="menu-links">
        <ul>
          <li v-for="link in menuData.links" :key="link.id">
            <a :href="link.url">{{ link.name }}</a>
          </li>
        </ul>
      </div>
      <div class="menu-products">
        <a v-for="product in menuData.products" :key="product.id" :href="`/product/${product.name.toLowerCase()}`" class="product-item">
          <img :src="product.imageUrl" :alt="product.name">
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
const menuData = inject('megaMenuData');
</script>

<style scoped>
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
  padding-left: 370px; /* <-- 修改这个值来控制向右移动的距离 */

  display: flex;
  align-items: flex-start;
  gap: 80px;
}

/* 左侧链接区 */
.menu-links {
  width: var(--logo-width); /* 宽度与Logo平齐 */
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

/* 右侧产品区 */
.menu-products {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  gap: 30px;
}

.product-item {
  display: block;
  width: 300px;         /* <-- 修改这个值来调整图片大小 */
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

/* 下拉动画 */
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