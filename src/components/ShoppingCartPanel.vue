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
              <a href="#" @click.prevent="handleCheckout">{{ $t('cart.login_link') }}</a>
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
          <button class="checkout-btn" @click="handleCheckout">{{ $t('cart.checkout_button') }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useNavigationStore } from '../stores/navigation'; // 导入导航 store

const cartStore = useCartStore();
const authStore = useAuthStore();
const navigationStore = useNavigationStore(); // 获取导航 store 实例

const handleCheckout = () => {
  if (authStore.isLoggedIn) {
    console.log("用户已登录，可以进行结算。");
  } else {
    cartStore.closeCart();
    // 直接调用 store 的 action 来导航
    navigationStore.navigateTo('login');
  }
};
</script>

<style scoped>
/* 您的样式完全正确，无需修改 */
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
}
.cart-panel {
  width: 100%;
  max-width: 420px;
  height: 100%;
  background-color: var(--secondary-color);
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}
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
.panel-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 30px 25px;
}
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
  color: var(--text-color);
  text-decoration: underline;
  margin-left: 5px;
}
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
  background-color: var(--accent-color);
  color: var(--secondary-color);
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}
.slide-enter-active,
.slide-leave-active {
  transition: background-color 0.4s ease;
}
.slide-enter-active .cart-panel,
.slide-leave-active .cart-panel {
  transition: transform 0.4s ease;
}
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