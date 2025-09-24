// src/views/CheckoutPage.vue

<template>
  <div class="checkout-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="checkout-container">
        <div class="checkout-top">
            <h1 class="checkout-title">FRIENDSHIPS.FEEDING LIFELONG</h1>
        </div>

        <div class="checkout-content-grid">
          <div class="order-summary-section">
            <h2 class="section-title">My order</h2>
            <div class="order-items">
              <div v-for="item in processedItems" :key="item.goodId" class="order-item">
                <img :src="item.goodImage" :alt="item.name" class="item-image">
                <div class="item-info">
                  <p class="item-name">{{ item.name }}</p>
                  <p class="item-specs">{{ item.specificationFormatted }}</p>
                </div>
                <div class="item-price-info">
                  <span class="item-quantity">x{{ item.quantity }}</span>
                  <div class="price-group">
                    <span
                      class="original-price"
                      v-if="isFirstPurchaseStatus"
                    >${{ (item.amount).toFixed(2) }}</span>
                    <span
                      class="discounted-price"
                      :class="{ 'no-discount': !isFirstPurchaseStatus }"
                    >${{ (isFirstPurchaseStatus ? item.amount * 0.85 : item.amount).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="total-price-section">
              <span>Total Price:</span>
              <div class="price-group">
                 <span
                  class="original-total-price"
                  v-if="isFirstPurchaseStatus"
                >${{ undiscountedTotalPrice.toFixed(2) }}</span>
                <span
                  class="discounted-total-price"
                  :class="{ 'no-discount': !isFirstPurchaseStatus }"
                >${{ finalTotalPrice.toFixed(2) }}</span>
              </div>
            </div>
          </div>
          
          <div class="payment-method-section">
            <h2 class="section-title">Payment method</h2>
            <div class="payment-buttons">
              <el-button class="payment-btn" @click="handlePayment('paypal')">
                <div class="payment-btn-content">
                  <img src="/images/paypal.png" alt="PayPal" class="payment-logo"/>
                  <span>PayPal</span>
                </div>
              </el-button>
              <el-button class="payment-btn" @click="handlePayment('stripe')" :loading="isProcessing">
                <div class="payment-btn-content">
                  <img src="/images/stripe.png" alt="Stripe" class="payment-logo"/>
                  <span>Stripe</span>
                </div>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { createStripeCheckoutSession, createPaypalOrder, isFirstPurchase } from '../api';
import { ElMessage, ElButton, ElIcon, ElDialog } from 'element-plus';
import { Close } from '@element-plus/icons-vue';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const isProcessing = ref(false);
const checkoutItems = ref([]);
const dialogVisible = ref(true);

const authStore = useAuthStore();
const isFirstPurchaseStatus = ref(false);


onMounted(async () => {
  try {
    const items = route.query.items;
    if (items) {
      checkoutItems.value = JSON.parse(items);
      sessionStorage.setItem('checkoutItems', items);
    } else {
      const storedItems = sessionStorage.getItem('checkoutItems');
      if (storedItems) {
        checkoutItems.value = JSON.parse(storedItems);
      } else {
        ElMessage.error("订单信息丢失，请重新选择商品。");
        router.push('/');
      }
    }

    if (authStore.isLoggedIn) {
      try {
        const result = await isFirstPurchase();
        isFirstPurchaseStatus.value = result;
        console.log('Is first purchase:', isFirstPurchaseStatus.value);
      } catch (error) {
        console.error("Failed to check if it's the first purchase:", error);
      }
    }

  } catch (e) {
    console.error("无法解析订单信息:", e);
    ElMessage.error("无法解析订单信息。");
    router.push('/');
  }
});

const processedItems = computed(() => {
  return checkoutItems.value.map(item => {
    let specificationObject = {};
    try {
      if (item.specification && typeof item.specification === 'string') {
        specificationObject = JSON.parse(item.specification);
      }
    } catch (e) {
      console.error("Failed to parse specification JSON:", e);
    }

    const formattedSpecs = [];
    if (specificationObject.color) {
      formattedSpecs.push(`${specificationObject.color}`);
    }
    if (specificationObject.size) {
      formattedSpecs.push(`${specificationObject.size}`);
    }

    return {
      ...item,
      specificationFormatted: formattedSpecs.length > 0 ? formattedSpecs.join("/").toLowerCase() : ''
    };
  });
});


// 【修改】这个计算属性现在只计算总价，不应用折扣
const undiscountedTotalPrice = computed(() => {
  return checkoutItems.value.reduce((total, item) => total + (item.amount * item.quantity), 0);
});

// 【新增】这个计算属性用于应用折扣，得到最终支付价格
const finalTotalPrice = computed(() => {
  return isFirstPurchaseStatus.value ? undiscountedTotalPrice.value * 0.85 : undiscountedTotalPrice.value;
});

const originalTotalPrice = computed(() => {
  // 这部分逻辑保持不变，用于总价的划线价
  return checkoutItems.value.reduce((total, item) => total + ((item.originalAmount || item.amount) * item.quantity), 0);
});

const handlePayment = async (method) => {
  if (checkoutItems.value.length === 0) {
      ElMessage.warning("请选择商品进行结账。");
      return;
  }

  isProcessing.value = true;
  try {
    let checkoutUrl;
    
    // 构建新的请求体，匹配新的接口
    const payload = {
      items: checkoutItems.value.map(item => ({
        goodId: item.goodId,
        specId: item.specId,
        colorId: item.colorId,
        standardId: item.standardId,
        quantity: item.quantity,
        imageUrl: item.imageUrl
      })),
      currency: "USD",
      // 【修改】使用动态计算的最终总价
      totalAmount: finalTotalPrice.value
    };

    if (method === 'stripe') {
      checkoutUrl = await createStripeCheckoutSession(payload);
    } else if (method === 'paypal') {
      checkoutUrl = await createPaypalOrder(payload);
    }
    
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      ElMessage.error(t('product.payment_session_failed_message'));
    }
  } catch (error) {
    console.error("创建支付会话失败:", error);
    ElMessage.error(error.message || t('product.payment_session_failed_message'));
  } finally {
    isProcessing.value = false;
  }
};

const closeCheckout = () => {
  router.push('/');
};

const closeDialog = () => {
    router.push('/');
};
</script>

<style scoped>
/* 恢复正常的页面结构样式 */
.checkout-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7; /* 背景色与你的设计图一致 */
}

.header-wrapper {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.header-wrapper :deep(.main-nav a),
.header-wrapper :deep(.header-actions .el-icon),
.header-wrapper :deep(.el-dropdown-link),
.header-wrapper :deep(.logo img) {
  color: var(--text-color);
  filter: none;
}

/* ▼▼▼ 核心修改：使用 :deep() 穿透修改 el-dialog 的样式 ▼▼▼ */
:deep(.checkout-dialog-wrapper.el-dialog) {
  background-color: transparent;
  box-shadow: none;
  --el-dialog-bg-color: transparent; /* 确保背景色是透明的 */
  --el-dialog-box-shadow: none;
  --el-dialog-padding-primary: 0;
}

:deep(.checkout-dialog-wrapper .el-dialog__header) {
  display: none; /* 隐藏 el-dialog 默认的头部 */
}

:deep(.checkout-dialog-wrapper .el-dialog__body) {
  padding: 0;
  background-color: transparent;
}
/* ▲▲▲ 修改结束 ▲▲▲ */

.main-content {
  flex-grow: 1; /* 占据页面剩余空间 */
  padding: 60px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ▼▼▼ 核心修改：移除 el-dialog，直接样式化 checkout-container ▼▼▼ */
.checkout-container {
  max-width: 900px;
  width: 90%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 40px;
  position: relative;
}
/* ▲▲▲ 修改结束 ▲▲▲ */

.checkout-top {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  /* padding-bottom: 20px;
  border-bottom: 1px solid #eee; */
  margin-bottom: 40px;
}

.checkout-title {
  font-size: 18px;
  font-weight: 600;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}

.close-icon {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.checkout-content-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 20px;
  /* 新增：为 grid 容器添加顶部间距 */
  margin-top: 60px;
}

.order-summary-section {
  padding-right: 40px;
  border-right: 1px solid #999;
}

.payment-method-section {
  padding-left: 20px;
}

/* 副标题 */
.section-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 35px;
  text-transform: capitalize;
  color: #000;
}

.order-items {
  /* border-bottom: 1px solid #eee;
  padding-bottom: 20px; */
  margin-bottom: 80px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.item-info {
  flex-grow: 1;
}

.item-name {
  font-weight: 600;
  margin: 0 0 5px 0;
}

.item-specs {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.item-price-info {
  display: flex;
  flex-direction: column;
  text-align: right;
  font-weight: 500;
  white-space: nowrap;
}

.item-quantity {
  font-size: 14px;
  color: #000;
}

.price-group {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 10px;
}

.original-price,
.original-total-price {
  font-size: 14px;
  color: #666;
  text-decoration: line-through;
}

.original-price.no-discount {
  text-decoration: none; /* 移除划线 */
  color: #000; /* 设置为黑色 */
  font-weight: bold; /* 保持加粗 */
}

.discounted-price,
.discounted-total-price {
  font-size: 14px;
  font-weight: bold;
  color: #e64545;
}

.total-price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #000;
}

.payment-buttons {
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 按钮靠上对齐 */
  align-items: flex-start; /* 关键修改：按钮组整体左对齐 */
  gap: 30px; /* 按钮之间的垂直间距 */
}

.payment-btn {
  width: 100%;
  height: 60px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 将内容左对齐 */
  padding: 0 20px; /* 增加内边距 */
  width: 350px; /* 增加按钮宽度 */
  /* 核心修改：确保所有按钮的margin都为0 */
  margin: 0;
  color: #000;
}

.payment-btn-content {
  display: flex; /* 确保图标和文字水平排列 */
  align-items: center; /* 确保图标和文字垂直居中 */
  width: 100%;
  position: relative;
}

.payment-btn-content span {
  position: absolute;
  left: 300%;
  transform: translateX(-50%);
}

.payment-btn:hover {
  background-color: #f5f5f5;
  border-color: #000;
}

.payment-logo {
  height: 40px;
  margin-right: 15px;
}

@media (max-width: 767px) {
  .checkout-content-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
</style>