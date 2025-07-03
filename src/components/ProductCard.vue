<template>
  <a :href="`/goods/${product.id}`" class="product-card">
    <img :src="product.url" :alt="product.name" class="product-image">
    <div class="card-overlay">
      <h4 class="product-name">{{ product.name }}</h4>
      <p class="product-price">$ {{ product.price }}</p>
      <button class="add-to-cart-btn">Add to Cart</button>
    </div>
  </a>
</template>

<script setup>
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
  border-radius: 8px;
  background-color: #f7f7f8;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  transition: box-shadow 0.3s ease;
}

.product-card:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.product-image {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  padding: 10px;
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
  background: linear-gradient(to top, rgba(255, 255, 255, 1) 70%, rgba(255, 255, 255, 0));
  
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
}

.add-to-cart-btn {
  width: 100%;
  padding: 10px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}
</style>