<template>
  <transition name="slide" >
    <div v-if="cartStore.isCartVisible" class="cart-overlay" @click.self="cartStore.closeCart()">
      <div class="cart-panel">
        <div class="panel-header">
          <h3>{{ $t('cart.title') }}</h3>
          <el-icon class="close-icon" @click="cartStore.closeCart()"><Close /></el-icon>
        </div>
        <div class="panel-content">
          <div v-if="!cartStore.items || cartStore.items.length === 0" class="cart-empty">
            <div v-if="!authStore.isLoggedIn" class="login-prompt">
              <span class="login-prompt-text">{{ t('cart.login_prompt') }}</span>
              <a href="#" @click.prevent="handleLoginClick" class="login-link">
                {{ t('cart.login_link') }}
              </a>
            </div>
            <div v-else class="logged-in-empty-cart-message">
              <p>{{ t('cart.welcome_back', { userName: authStore.userInfo?.nickname || authStore.userInfo?.username || '' }) }}</p>
              <p>{{ t('cart.start_Browse') }}</p>
            </div>
            <button class="continue-btn" @click="handleContinueShopping">{{ t('cart.continue_shopping') }}</button>
            </div>
          <div v-else class="cart-items">
            <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
              <el-checkbox
                :model-value="item.selected"
                @change="() => cartStore.toggleItemSelection(item.id)"
                size="large"
              />
              <img :src="item.url || '/images/placeholder.png'" :alt="item.name" class="item-image">
              <div class="item-details">
                <p class="item-name">{{ item.name || item.goodName }}</p>
                <p class="item-specs">{{ item.colorName || 'Default Color' }}/{{ item.specName || 'Default Size' }}</p>
                <el-input-number
                  size="small"
                  :model-value="item.quantity"
                  @change="(currentValue) => cartStore.updateQuantity(item.id, currentValue)"
                  :min="1"
                />
              </div>
              <div class="item-actions">
                <p class="item-total-price">${{ ((item.price || 0) * item.quantity).toFixed(2) }}</p>
                <el-icon class="item-remove" @click="cartStore.removeItems(item.id)"><Delete /></el-icon>
              </div>
            </div>
          </div>
        </div>
        <div v-if="cartStore.items.length > 0" class="panel-footer">
          <div class="subtotal">
            <span>{{ $t('cart.subtotal') }}</span>
            <span>$ {{ cartStore.subtotal }}</span>
          </div>
          <button class="checkout-btn" @click="handleCheckout" :disabled="isLoading || cartStore.selectedItems.length === 0">
            {{ isLoading ? 'Processing...' : t('cart.checkout') }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useI18n } from 'vue-i18n';
import { ElIcon, ElInputNumber, ElMessage, ElCheckbox } from 'element-plus';
import { Close, Delete } from '@element-plus/icons-vue';
// 移除 createCartCheckoutSession 的导入，因为支付逻辑已转移到 CheckoutPage
// import { createCartCheckoutSession } from '../api';

const cartStore = useCartStore();
const authStore = useAuthStore();
const { t } = useI18n();
const isLoading = ref(false);
const router = useRouter();

const handleLoginClick = () => {
  cartStore.closeCart();
  router.push('/login');
};

const handleContinueShopping = () => {
  router.push('/shop/all');
  cartStore.closeCart();
};

const handleCheckout = () => {
  if (!authStore.isLoggedIn) {
    cartStore.closeCart();
    router.push('/login');
    return;
  }

  if (cartStore.selectedItems.length === 0) {
    ElMessage.warning("Please select items to checkout.");
    return;
  }
  
  // ▼▼▼ 核心修改：移除重复定义并修正路由跳转 ▼▼▼
  const checkoutItems = cartStore.selectedItems.map(item => {
    // 确保 item 有有效价格
    if (!item.price || item.price <= 0) {
      console.warn(`Item "${item.name}" has invalid price and will be skipped.`, item);
      return null;
    }
    return {
      goodId: item.goodId || item.id,
      quantity: item.quantity,
      name: item.name || item.goodName,
      amount: item.price,
      goodImage: item.url,
      currency: "USD",
      description: `${item.name || item.goodName} - ${item.colorName || ''}/${item.specName || ''}`,
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cancel`,
      specification: JSON.stringify({ color: item.colorName, size: item.specName })
    };
  }).filter(Boolean);

  if (checkoutItems.length === 0) {
    ElMessage.error("Selected items have no valid price.");
    return;
  }
  
  cartStore.closeCart();
  router.push({
    name: 'Checkout',
    query: {
      items: JSON.stringify(checkoutItems)
    }
  });
  // ▲▲▲ 修改结束 ▲▲▲
};
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  gap: 15px;
}
/* 其他样式保持不变 */
.cart-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1600;
  display: flex;
  justify-content: flex-end;
}
.cart-panel {
  width: 100%;
  max-width: 480px;
  height: 100%;
  background-color: var(--secondary-color);
  box-shadow: -5px 0 25px rgba(0,0,0,0.15);
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
.panel-header h3 { margin: 0; font-size: 18px; }
.close-icon { font-size: 24px; cursor: pointer; }
/* ▼▼▼ START: CSS 修改的核心区域 ▼▼▼ */
.panel-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  /* 关键改动 1: 将面板内容设为 Flex 布局 */
  display: flex;
  flex-direction: column;
  align-items: center; /* 让所有子元素水平居中 */
}

/* ▼▼▼ START: CSS 修改的核心区域 ▼▼▼ */
/* 1. 空购物车容器样式 */
.cart-empty {
  display: flex;
  flex-direction: column; /* 保持垂直排列 */
  align-items: center;   /* 水平居中 */
  justify-content: center; /* 垂直居中 */
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
}

/* 2. "继续购物" 按钮样式 */
.continue-btn {
  width: 100%;
  max-width: 300px;
  padding: 14px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  flex-shrink: 0; /* 防止按钮被压缩 */
}
/* 关键改动 2: 添加一个“弹簧”元素，自动撑开所有可用空间 */
.spacer {
  flex-grow: 1;
}

.continue-btn:hover {
  opacity: 0.8;
}

/* 3. 登录提示样式 */
.login-prompt {
  text-align: center;
  font-size: 14px;
  color: #000;
  flex-shrink: 0; /* 防止文字被压缩 */
  /* ✨ 您可以在这里调整按钮和文字的间距 ✨ */
  margin-top: 20px; 
}
.login-prompt-text {
  margin-right: 5px;
}
.login-link {
  color: #3C72B6;
  text-decoration: underline;
  font-weight: 500;
  cursor: pointer;
}
.login-link:hover {
  color: #6a9edc;
}

/* 4. 已登录用户的空购物车提示 */
.logged-in-empty-cart-message {
  text-align: center;
  color: #666;
  /* ✨ 您也可以在这里调整登录后提示语和按钮的间距 ✨ */
  margin-bottom: 20px;
}
.logged-in-empty-cart-message p {
  margin: 0 0 10px;
  line-height: 1.6;
}
/* ▲▲▲ END: CSS 修改的核心区域 ▲▲▲ */

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #fff;
  flex-shrink: 0;
}
.item-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.item-name {
  font-weight: 500;
  font-size: 14px;
}
.item-specs {
  font-size: 12px;
  color: #968C82;
}
.item-actions {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 20px;
}
.item-total-price {
  font-weight: 500;
  font-size: 16px;
}
.item-remove {
  cursor: pointer;
  color: #968C82;
  font-size: 18px;
}
.item-remove:hover {
  color: #3C72B6;
}
.panel-footer {
  padding: 20px 25px;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}
.subtotal {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 500;
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
  transition: all 0.4s ease;
}
.slide-enter-active .cart-panel,
.slide-leave-active .cart-panel {
  transition: transform 0.4s ease;
}
.slide-enter-from {
  background-color: rgba(0, 0, 0, 0);
}
.slide-enter-from .cart-panel {
  transform: translateX(100%);
}
.slide-leave-to {
  background-color: rgba(0, 0, 0, 0);
}
.slide-leave-to .cart-panel {
  transform: translateX(100%);
}
</style>