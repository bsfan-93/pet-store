<template>
  <transition name="slide" v-if="cartStore.isCartVisible">
    <div class="cart-overlay" @click.self="cartStore.closeCart()">
      <div class="cart-panel">
        <div class="panel-header">
          <h3>{{ $t('cart.title') }}</h3>
          <el-icon class="close-icon" @click="cartStore.closeCart()"><Close /></el-icon>
        </div>

        <div class="panel-content">
          <div v-if="cartStore.items.length === 0" class="cart-empty">
            <p class="empty-text">{{ $t('cart.empty_message') }}</p>
            <button class="continue-btn" @click="cartStore.closeCart()">{{ $t('cart.continue_shopping') }}</button>
            <div class="login-prompt">
              <span>{{ $t('cart.login_prompt') }}</span>
              <a href="#">{{ $t('cart.login_link') }}</a>
            </div>
          </div>

          <div v-else class="cart-items">
            <div v-for="item in cartStore.items" :key="item.id" class="cart-item-display">
              {{ item.name }} - ${{ item.price }} x {{ item.quantity }}
            </div>
          </div>
        </div>
        
        <div v-if="cartStore.items.length > 0" class="panel-footer">
          <div class="subtotal">
            <span>{{ $t('cart.subtotal') }}</span>
            <span>$ {{ cartStore.subtotal }}</span>
          </div>
          <button class="checkout-btn">{{ $t('checkout_button') }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>

// 1. 导入 useCartStore
import { useCartStore } from '../stores/cart';

// 2. 获取 cart store 实例
const cartStore = useCartStore();

// 定义props来接收购物车商品数据，目前默认为空数组
// defineProps({
//   items: {
//     type: Array,
//     default: () => []
//   }
// });

// const emit = defineEmits(['close']);

// const close = () => {
//   emit('close');
// };
</script>

<style scoped>
/* 整个半透明的背景遮罩 */
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  justify-content: flex-end; /* 让面板从右边出来 */
}

/* 白色侧滑面板 */
.cart-panel {
  width: 100%;
  max-width: 420px; /* 面板最大宽度 */
  height: 100%;
  background-color: var(--secondary-color);
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

/* 面板头部 */
.panel-header {
  padding: 20px 25px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.panel-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-icon {
  font-size: 24px;
  cursor: pointer;
}

/* 面板主要内容区 */
.panel-content {
  flex-grow: 1; /* 占据所有可用垂直空间 */
  overflow-y: auto;
  padding: 30px 25px;
}

/* 空购物车样式 */
.cart-empty {
  text-align: center;
  margin-top: 30%;
}
.empty-text {
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 20px 0;
}
.continue-btn {
  width: 100%;
  padding: 14px;
  /* ▼▼▼ 【修改】使用CSS变量 ▼▼▼ */
  background-color: var(--text-color);
  color: var(--secondary-color);
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 30px;
}
.login-prompt {
  font-size: 14px;
}
.login-prompt a {
  /* ▼▼▼ 【修改】使用CSS变量 ▼▼▼ */
  color: var(--text-color);
  text-decoration: underline;
  margin-left: 5px;
}

/* 面板页脚 */
.panel-footer {
  padding: 20px 25px;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}
.subtotal {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  margin-bottom: 20px;
}
.checkout-btn {
  width: 100%;
  padding: 14px;
  /* ▼▼▼ 【修改】使用CSS变量 ▼▼▼ */
  background-color: var(--accent-color);
  color: var(--secondary-color);
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}


/* 滑入滑出动画 */
.slide-enter-active,
.slide-leave-active {
  transition: background-color 0.4s ease;
}
.slide-enter-active .cart-panel,
.slide-leave-active .cart-panel {
  transition: transform 0.4s ease;
}

/* 进入前和离开后的状态 */
.slide-enter-from,
.slide-leave-to {
  background-color: transparent;
}
.slide-enter-from .cart-panel,
.slide-leave-to .cart-panel {
  transform: translateX(100%);
}

.cart-item-display {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
</style>