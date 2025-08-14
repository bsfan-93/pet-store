<template>
  <router-link :to="`/product/${product.id}`" class="product-card">
    <div class="image-container">
      <img :src="product.url" :alt="product.name" class="product-image">
      <span v-if="product.tag" class="tag" :class="product.tag.toLowerCase()">
        {{ product.tag }}
      </span>
    </div>
    <div class="info-container">
      <div class="color-info">
        <span class="color-swatch" :style="{ backgroundColor: product.colorHex }"></span>
        <span class="color-name">{{ product.colorName }}</span>
      </div>
      <h4 class="product-name">{{ product.name }}</h4>
      <p class="product-subtitle">{{ product.subtitle }}</p>
      <div class="price-row">
        <div class="product-price">
          <span class="currency">$</span>
          <span class="amount">{{ product.price }}</span>
        </div>
        <el-icon class="cart-icon" @click.prevent="addToCart"><ShoppingCart /></el-icon>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { ElIcon, ElMessage } from 'element-plus';
import { ShoppingCart } from '@element-plus/icons-vue';
// ▼▼▼ START: 核心修改点 2 - 引入 useCartStore ▼▼▼
import { useCartStore } from '../stores/cart';
// ▲▲▲ END: 核心修改点 2 ▲▲▲

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

// ▼▼▼ START: 核心修改点 4 - 定义 cartStore 和 addToCart 方法 ▼▼▼
const cartStore = useCartStore();

const addToCart = () => {
  // 构造一个要添加到购物车的商品对象
  // 假设从卡片添加时，数量为1，且没有预选规格
  const productToAdd = {
    id: props.product.id,
    goodId: props.product.id,
    name: props.product.name,
    price: props.product.price,
    url: props.product.url,
    quantity: 1,
    // 因为在列表页无法选择规格，我们传递 null 或默认值
    specId: null, 
    specName: 'Standard', // 您可以根据需要修改默认值
    colorId: null,
    colorName: props.product.colorName,
  };
  
  // 调用 cartStore 中的 addItem 方法
  cartStore.addItem(productToAdd);
  
  // 弹出一个成功的提示
  ElMessage.success(`${props.product.name} has been added to your cart!`);
};
// ▲▲▲ END: 核心修改点 4 ▲▲▲

// defineProps({
//   product: {
//     type: Object,
//     required: true
//   }
// });
</script>

<style scoped>
.product-card {
  display: block;
  text-decoration: none;
  color: #333;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  border: 1px solid #f0f0f0;
}
.product-card:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #f7f7f7;
}
.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 10px;
  box-sizing: border-box;
}
.tag {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: #fff;
  text-transform: uppercase;
}
.tag.new {
  background-color: #a2c185;
}
.tag.hot {
  background-color: #f5a623;
}

.info-container {
  padding: 15px;
  text-align: left;
}
.color-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.color-swatch {
  width: 12px;
  height: 12px;
  /* border-radius: 50%; */
  margin-right: 8px;
  border: 1px solid #eee;
}
.color-name {
  font-size: 13px;
  color: #666;
  text-transform: uppercase;
}
.product-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 6px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.product-subtitle {
  font-size: 14px;
  color: #7CB342 ;
  margin: 0 0 12px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/* .product-price {
  font-size: 16px;
  font-weight: 700;
  color: #000;
} */

/* 将 .product-price 改为 flex 容器 */
.product-price {
  display: flex;
  align-items: baseline; /* 基线对齐，让 $ 和数字底部对齐 */
  color: #000;
}
/* 设置货币符号的样式 */
.currency {
  font-size: 14px;
  font-weight: 700; /* 正常字重，看起来更细 */
  margin-right: 2px; /* 与数字的间距 */
}
/* 设置价格数字的样式 */
.amount {
  font-size: 16px;
  font-weight: 400; /* 粗体字重 */
}
/* ▲▲▲ END: 核心修改点 2 ▲▲▲ */
.cart-icon {
  font-size: 18px;
  cursor: pointer;
  color: #aaa;
  transition: color 0.2s;
}
.cart-icon:hover {
  color: #000;
}
</style>