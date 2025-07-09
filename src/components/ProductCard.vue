<template>
  <a :href="`/product/${product.id}`" class="product-card">
    <div class="image-container">
      <img :src="product.url" :alt="product.name" class="product-image">
    </div>
    <div class="card-overlay">
      <h4 class="product-name">{{ product.name }}</h4>
      <p class="product-price" v-if="product.price">$ {{ product.price }}</p>
      <button 
        class="add-to-cart-btn" 
        @click.prevent="cartStore.addItem(product)"
      >
        Add to Cart
      </button>
    </div>
  </a>
</template>

<script setup>
// 1. 导入 useCartStore
import { useCartStore } from '../stores/cart';

// 2. 获取 cart store 实例
const cartStore = useCartStore();

defineProps({
  product: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.product-card {
  display: block;
  position: relative; /* 作为浮层定位的基准 */
  overflow: hidden; /* 隐藏超出部分的浮层 */
  border-radius: 12px;
  background-color: var(--light-gray-color);
  text-decoration: none;
  color: var(--text-color);
  /* 卡片上浮和阴影的过渡动画 */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-8px); /* 悬停时向上移动8px */
  box-shadow: 0 12px 24px rgba(0,0,0,0.1); /* 添加更明显的阴影 */
}

.image-container {
  overflow: hidden; /* 隐藏图片放大时超出的部分 */
  border-radius: 12px;
}

.product-image {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  padding: 15px;
  background-color: var(--secondary-color);
  /* 图片放大动画 */
  transition: transform 0.4s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05); /* 悬停时图片轻微放大 */
}

/* 悬停浮层 */
.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: var(--secondary-color);
  border-top: 1px solid var(--border-color);
  /* 默认状态下，浮层被移出卡片下方 */
  transform: translateY(100%);
  transition: transform 0.4s ease;
}

/* 卡片被悬停时，浮层滑入 */
.product-card:hover .card-overlay {
  transform: translateY(0);
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  font-size: 14px;
  margin: 0 0 15px 0;
  font-weight: 500;
}

.add-to-cart-btn {
  width: 100%;
  padding: 12px;
  background-color: var(--text-color);
  color: var(--secondary-color);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
}
</style>