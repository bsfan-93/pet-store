<template>
  <transition name="slide" v-if="cartStore.isCartVisible">
    <div class="cart-overlay" @click.self="cartStore.closeCart()">
      <div class="cart-panel">
        <div class="panel-header">
          <h3>{{ $t('cart.title') }}</h3>
          <el-icon class="close-icon" @click="cartStore.closeCart()"><Close /></el-icon>
        </div>

        <div class="panel-content">
          <div v-if="!cartStore.items || cartStore.items.length === 0" class="cart-empty">
            <div v-if="!authStore.isLoggedIn" class="login-prompt">
              <span class="login-prompt-text">{{ $t('cart.login_prompt') }}</span>
              <a href="#" @click.prevent="handleCheckout" class="login-link">
                {{ $t('cart.login_link') }}
              </a>
            </div>
            <div v-else class="logged-in-empty-cart-message">
              <p>{{ $t('cart.welcome_back', { userName: authStore.userInfo?.name || '' }) }}</p>
              <p>{{ $t('cart.start_Browse') }}</p>
            </div>
            
            <button class="continue-btn" @click="cartStore.closeCart()">{{ $t('cart.continue_shopping') }}</button>
            
          </div>

          <div v-else class="cart-items">
            <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
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
          <button class="checkout-btn" @click="handleCheckout">{{ $t('cart.checkout') }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { inject } from 'vue';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { ElIcon, ElInputNumber, ElButton } from 'element-plus'; // ElButton 可以保留，因为它可能在其他地方被使用

const cartStore = useCartStore();
const authStore = useAuthStore();
const navigateTo = inject('navigateTo');

// 定义统一的处理函数，用于跳转或结算
const handleCheckout = () => {
  if (authStore.isLoggedIn) {
    console.log("用户已登录，可以进行结算。");
  } else {
    cartStore.closeCart();
    // 【修改】添加类型检查，确保 navigateTo 是一个函数
    if (typeof navigateTo === 'function') {
      navigateTo('login'); // 未登录时跳转到登录页面
    } else {
      console.error("Error: navigateTo function not available for redirection. Falling back to window.location.href.");
      window.location.href = '/login'; // 备用方案：直接跳转到登录页
    }
  }
};
</script>

<style scoped>
/* 您的其余样式保持不变 */
.cart-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
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
.panel-header h3 { margin: 0; 
  font-size: 18px; 
}
.close-icon { font-size: 24px; 
  cursor: pointer; 
}
.panel-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
}

.cart-empty {
  display: flex;              /* 使用 Flexbox 布局 */
  flex-direction: column;     /* 子元素垂直堆叠 */
  align-items: center;        /* 子元素水平居中对齐 */
  justify-content: center;    /* 子元素在可用空间内垂直居中 */
  height: 100%;               /* 确保容器占据所有可用高度，以实现垂直居中 */
  padding: 30px 20px;         /* 增加一些整体内边距，防止内容贴边 */
  box-sizing: border-box;     /* 确保内边距不增加元素总尺寸 */
}

/* empty-text 样式不再使用，因为标签已移除 */
/*
.empty-text {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
  border: none;
}
*/

.continue-btn {
  width: 80%;               /* 赋予按钮明确的宽度 */
  max-width: 300px;         /* 限制按钮最大宽度 */
  padding: 14px;
  background-color: var(--text-color);
  color: var(--secondary-color);
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 30px; /* 增加与下方提示的间距 */
}

/* 【修改】新的登录提示样式，恢复为简单链接 */
/* 移除 .login-prompt-enhanced 和 .login-checkout-btn 的样式 */
/*
.login-prompt-enhanced { ... }
.login-prompt-enhanced p { ... }
.login-checkout-btn { ... }
*/

.login-prompt {
  text-align: center;
  margin-top: 20px; /* 调整与上方按钮的间距 */
  font-size: 14px; /* 保持与原简单样式一致的字体大小 */
}

.login-prompt-text { /* 为“Have an account?”文本添加样式 */
  color: #666; /* 保持原样式中的颜色 */
  margin-right: 5px;
}

.login-link { /* 为“Log in to check out faster.”链接添加样式 */
  color: var(--text-color); /* 使用通用文字颜色作为链接颜色 */
  text-decoration: underline;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
}

.login-link:hover {
  color: #333; /* 链接悬停时的颜色 */
}

.login-benefit-text { /* 为“Your cart will be saved across devices!”文本添加样式 */
  font-size: 13px;
  line-height: 1.5;
  color: #777;
  margin-top: 10px; /* 调整与上方链接的间距 */
  text-align: center;
}

/* 已登录状态下的提示（保持不变） */
.logged-in-empty-cart-message {
  width: 80%;
  max-width: 350px;
  margin: 0 auto;
  padding: 30px 20px;
  background-color: #fff;
  border-radius: 8px;
  border: none;
  text-align: center;
}

.logged-in-empty-cart-message p {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 15px;
}
.logged-in-empty-cart-message p:last-child {
  margin-bottom: 0;
}

/* ... 购物车商品列表及底部样式保持不变 ... */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.cart-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}
.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
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
  color: #888;
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
  color: #999;
  font-size: 18px;
}
.item-remove:hover {
  color: var(--primary-color);
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
  transition: transform 0.4s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>