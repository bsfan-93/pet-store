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
            <p class="empty-text">{{ $t('cart.empty_message') }}</p>
            <button class="continue-btn" @click="cartStore.closeCart()">{{ $t('cart.continue_shopping') }}</button>
            <div class="login-prompt">
              <span>{{ $t('cart.login_prompt') }}</span>
              <a href="#" @click.prevent="handleLoginClick">{{ $t('cart.login_link') }}</a>
            </div>
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
          <button class="checkout-btn" @click="handleCheckout">{{ checkoutButtonText }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { createCheckoutSession } from '../api'; // Import createCheckoutSession
import { ElIcon, ElInputNumber, ElMessage } from 'element-plus';
import { Close, Delete } from '@element-plus/icons-vue';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

const handleCheckout = async () => {
  if (authStore.isLoggedIn) {
    if (cartStore.items.length === 0) {
      ElMessage.info('Your cart is empty.');
      return;
    }

    // Map cart items to the format your backend expects
    const itemsToCheckout = cartStore.items.map(item => ({
      goodId: item.id,
      quantity: item.quantity,
      name: item.name,
      amount: item.price,
      goodImage: item.url,
    }));

    try {
      const checkoutUrl = await createCheckoutSession(itemsToCheckout);
      if (checkoutUrl) {
        // Redirect to Stripe
        window.location.href = checkoutUrl;
      } else {
        ElMessage.error('Could not initiate payment. Please try again.');
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      ElMessage.error('An error occurred while creating the payment session.');
    }
  } else {
    // If not logged in, close cart and redirect to login page
    cartStore.closeCart();
    router.push('/login');
  }
};
</script>

<style scoped>
/* 您的样式完全正确，这里为了简洁省略，您无需修改 */
/* ... */
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
.panel-header h3 { margin: 0; font-size: 18px; }
.close-icon { font-size: 24px; cursor: pointer; }
.panel-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
}
.cart-empty { text-align: center; margin-top: 30%; }
.empty-text { font-size: 18px; font-weight: 500; margin: 0 0 20px 0; }
.continue-btn {
  width: 100%; padding: 14px; background-color: var(--text-color); color: var(--secondary-color);
  border: none; border-radius: 4px; font-size: 16px; cursor: pointer; margin-bottom: 30px;
}
.login-prompt { font-size: 14px; }
.login-prompt a { color: var(--text-color); text-decoration: underline; margin-left: 5px; cursor: pointer; }
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