<template>
  <div class="product-detail-page" v-if="productDetail">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="product-main-content">
      <div class="product-container">
        <div class="product-gallery">
          <div 
            class="main-image-container"
            ref="mainImageContainer"
            @mouseenter="isMagnifierVisible = true"
            @mouseleave="isMagnifierVisible = false"
            @mousemove="handleMouseMove"
            @wheel.prevent="handleWheel" >
            <img :src="mainImage" alt="Main product image" class="main-image-content">
            <div 
              v-show="isMagnifierVisible" 
              class="magnifier-view"
              :style="magnifierStyle"
            ></div>
          </div>
          
          <div class="thumbnail-carousel">
            <el-icon class="arrow-icon"><ArrowLeft /></el-icon>
            <div class="thumbnail-track">
              <div 
                v-for="img in productDetail.goodPic" 
                :key="img.id" 
                class="thumbnail-placeholder"
                @click="mainImage = img.url"
              >
                <img :src="img.url" :alt="img.name" class="thumbnail-image-content">
              </div>
            </div>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
        </div>
        <div class="product-info">
          <h1 class="product-title">{{ productDetail.good.name }}</h1>
          <ul class="product-features">
            <li v-for="feature in productDetail.goodFeature" :key="feature.id">{{ feature.description }}</li>
          </ul>
          <div class="price-section">
            <span class="current-price">$ {{ productDetail.good.price }}</span>
            <el-tag type="danger" effect="dark" size="small" class="sale-tag">save 10%</el-tag>
          </div>
          <div class="options-section">
            <div class="options-grid">
              <div class="option-item">
                <span class="option-label">{{ $t('product.quantity') }}</span>
                <el-input-number v-model="form.quantity" :min="1" size="default" />
              </div>
              <div class="option-item">
                <span class="option-label">{{ $t('product.size') }}</span>
                <el-select v-model="form.size" :placeholder="$t('product.select_placeholder')" size="default">
                    <el-option 
                      v-for="size in sizeOptions" 
                      :key="size.id" 
                      :label="size.value" 
                      :value="size.value" 
                    />
                </el-select>
              </div>
              <div class="option-item">
                <span class="option-label">{{ $t('product.color') }}</span>
                <el-radio-group v-model="form.color">
                    <el-radio 
                        v-for="color in colorOptions" 
                        :key="color.id" 
                        :value="color.value"  
                        class="color-swatch"
                        :style="{ '--swatch-color': color.hex || '#ccc' }"
                    />
                </el-radio-group>
              </div>
              <div class="option-item">
                <span class="option-label">{{ $t('product.standard') }}</span>
                <el-select v-model="form.standard" :placeholder="$t('product.select_placeholder')" size="default">
                    <el-option label="OS" value="os" />
                </el-select>
              </div>
            </div>
          </div>
          <div class="action-buttons">
            <el-button size="large" class="cart-btn" @click="handleAddToCart">
              <el-icon style="margin-right: 8px;"><ShoppingCart /></el-icon>
              {{ $t('product.add_to_cart') }}
            </el-button>
            
            <el-button size="large" class="buy-now-btn" @click="handleBuyNow">
              {{ $t('product.buy_now') }}
            </el-button>

            <transition name="fade">
              <div v-if="showAddedFeedback" class="added-feedback">
                <el-icon><Select /></el-icon>
                <span>{{ $t('product.added_feedback') }}</span>
              </div>
            </transition>
            </div>
        </div>
      </div>

      <section class="video-section" v-if="productVideo">
        <div class="section-container">
          <h2 class="section-title">{{ $t('product.usp_title') }}</h2>
          <div class="video-player-container">
            <video :src="productVideo" controls class="video-thumbnail-placeholder"></video>
          </div>
        </div>
      </section>

      <section class="feature-display-section" v-if="featureImages.length">
        <div class="feature-container">
          <div class="feature-hero-placeholder" v-if="featureImages[0]">
             <img :src="featureImages[0]" alt="Feature image 1" class="feature-image-content">
          </div>
          <div class="feature-grid" v-if="featureImages.length > 1">
            <div class="feature-item-placeholder" v-for="imgUrl in featureImages.slice(1)" :key="imgUrl">
               <img :src="imgUrl" alt="Feature image" class="feature-image-content">
            </div>
          </div>
        </div>
      </section>

      <section class="specs-params-section">
        <div class="section-container">
          <h2 class="section-title">{{ $t('product.specs_title') }}</h2>
          <div class="specs-images-container" v-if="productDetail.sizePic && productDetail.sizePic.length > 0">
            <div 
              v-for="pic in productDetail.sizePic" 
              :key="pic.id" 
              class="spec-image-placeholder"
            >
              <img :src="pic.url" :alt="pic.name" class="spec-image-content">
            </div>
          </div>
          
          <h2 class="section-title">{{ $t('product.params_title') }}</h2>
          <div class="params-table" v-if="productDetail.goodParameter && productDetail.goodParameter.length > 0">
            <div class="param-row" v-for="param in productDetail.goodParameter" :key="param.id">
              <span class="param-label">{{ param.paramName }}</span>
              <span class="param-value">{{ param.paramValue }}</span>
            </div>
          </div>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
  <div v-else class="loading-state">
    {{ $t('product.loading') }}
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// ▼▼▼ Ensure addToCart is imported ▼▼▼
import { getGoodDetail, createCheckoutSession, addToCart } from '../api';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import {
  ElButton, ElTag, ElInputNumber, ElSelect, ElOption,
  ElRadioGroup, ElRadio, ElIcon, ElMessage
} from 'element-plus';
import { ArrowLeft, ArrowRight, ShoppingCart, Select } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n'; // 【新增】导入 useI18n

// props and router
const props = defineProps({
  id: String 
});
const route = useRoute();
const router = useRouter(); 
const { t } = useI18n(); // 【新增】获取 t 函数

// Store
const cartStore = useCartStore();
const authStore = useAuthStore();

// 产品详情数据
const productDetail = ref(null);
const mainImage = ref('');

// 放大镜功能相关
const mainImageContainer = ref(null);
const isMagnifierVisible = ref(false);
const mouseX = ref(0);
const mouseY = ref(0);
const zoomLevel = ref(2); 

// 表单数据
const form = reactive({
  quantity: 1,
  size: '',
  color: '',
  standard: 'os'
});
const showAddedFeedback = ref(false);
let feedbackTimer = null; 

// --- Data Fetching ---
const fetchProductData = async (goodId) => {
  if (!goodId) return;
  try {
    productDetail.value = null;
    const data = await getGoodDetail(goodId);
    productDetail.value = data;
    if (data.goodPic && data.goodPic.length > 0) {
      mainImage.value = data.goodPic[0].url;
    }
    if (sizeOptions.value.length > 0) {
      form.size = sizeOptions.value[0].value;
    }
    if (colorOptions.value.length > 0) {
      form.color = colorOptions.value[0].value;
    }
  } catch (error) {
    console.error("Failed to fetch product details:", error);
    ElMessage.error(t('product.product_details_not_loaded'));
  }
};

watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchProductData(newId);
  }
}, { immediate: true });

// --- Computed Properties ---
const colorOptions = computed(() => {
    if (!productDetail.value || !productDetail.value.specifications) return [];
    const colors = productDetail.value.specifications.find(s => s.name === 'color')?.values || [];
    const colorMap = { 'red': '#D32F2F', 'blue': '#1976D2', 'green': '#689F38', 'gray': '#E0E0E0' };
    return colors.map(c => ({...c, hex: colorMap[c.value.toLowerCase()] || '#ccc'}));
});

const sizeOptions = computed(() => {
    if (!productDetail.value || !productDetail.value.specifications) return [];
    return productDetail.value.specifications.find(s => s.name === 'size')?.values || [];
});

const productVideo = computed(() => {
    if (!productDetail.value || !productDetail.value.detailPic) return null;
    return productDetail.value.detailPic.find(p => p.isVideo)?.url || null;
});

const featureImages = computed(() => {
    if (!productDetail.value || !productDetail.value.detailPic) return [];
    return productDetail.value.detailPic.filter(p => !p.isVideo).map(p => p.url);
});

const magnifierStyle = computed(() => {
  if (!mainImageContainer.value) return {};
  const container = mainImageContainer.value;
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const bgPosX = -(mouseX.value * zoomLevel.value - containerWidth / 2);
  const bgPosY = -(mouseY.value * zoomLevel.value - containerHeight / 2);
  return {
    backgroundImage: `url(${mainImage.value})`,
    backgroundSize: `${containerWidth * zoomLevel.value}px ${containerHeight * zoomLevel.value}px`,
    backgroundPosition: `${bgPosX}px ${bgPosY}px`,
  };
});


// --- Methods ---
const handleMouseMove = (event) => {
  if (!mainImageContainer.value) return;
  const rect = mainImageContainer.value.getBoundingClientRect();
  mouseX.value = event.clientX - rect.left;
  mouseY.value = event.clientY - rect.top;
};

const handleWheel = (event) => {
  if (event.deltaY < 0) {
    zoomLevel.value = Math.min(zoomLevel.value + 0.5, 5);
  } else {
    zoomLevel.value = Math.max(zoomLevel.value - 0.5, 1.5);
  }
};

// ▼▼▼ THIS IS THE CORRECTED FUNCTION ▼▼▼
const handleAddToCart = async () => {
  if (!productDetail.value) {
    ElMessage.warning(t('product.product_details_not_loaded')); 
    return;
  }

  // Step 1: Update the local cart store for a responsive feel.
  cartStore.addItem({
    id: productDetail.value.good.id,
    name: productDetail.value.good.name,
    price: productDetail.value.good.price,
    url: mainImage.value,
    selectedSize: form.size,
    selectedColor: form.color,
    quantity: form.quantity
  });
  
  // The unwanted ElMessage.success notification has been removed.

  // Step 2: If the user is logged in, send the update to the server.
  if (authStore.isLoggedIn) {
    const apiPayload = {
      goodId: productDetail.value.good.id,
      // Note: These values are hardcoded as per your API example.
      // You will need to make these dynamic based on user selection.
      spec: 3, 
      color: 1, 
      quantity: form.quantity
    };

    try {
      await addToCart(apiPayload);
    } catch (error) {
      console.error("Failed to save cart to server:", error);
    }
  }
};
// ▲▲▲ END OF CORRECTION ▲▲▲

const handleBuyNow = async () => {
  if (!authStore.isLoggedIn) {
    ElMessage.info(t('product.login_to_purchase_message'));
    router.push('/login');
    return;
  }
  
  if (!productDetail.value) {
    ElMessage.warning(t('product.product_details_not_loaded')); {/* 【修改】 */}
    return;
  }

  const checkoutData = { 
    goodId: productDetail.value.good.id,
    quantity: form.quantity,
    name: productDetail.value.good.name,
    amount: productDetail.value.good.price, 
    goodImage: mainImage.value, 
    currency: "USD", 
    description: productDetail.value.good.name + (productDetail.value.good.description ? ' - ' + productDetail.value.good.description : ''), 
    successUrl: "http://127.0.0.1/success",
    cancelUrl: "http://127.0.0.1/cancel",
    specification: "{}"
  };
  try {
    const checkoutUrl = await createCheckoutSession(checkoutData); 
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }else {
      ElMessage.error(t('product.payment_session_failed_message'));
    }
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    const errorMessage = error.message.includes('Failed to fetch') ? t('product.network_error_message') :
                         (error.message.includes('401') ? t('product.login_to_purchase_message') : 
                         (error.message.includes('500') ? t('product.payment_service_error_message') : 
                         t('product.payment_session_failed_message'))); 
    ElMessage.error(errorMessage); 
  }
};
</script>

<style scoped>
.product-gallery {
  width: 50%;
  flex-shrink: 0;
}

.main-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: var(--light-gray-color);
  border-radius: 12px;
  margin-bottom: 20px;
  cursor: crosshair;
  /* overflow: hidden;  为了让放大镜显示在右侧，这里不能隐藏溢出*/
}

.main-image-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

/* ▼▼▼【修改】放大镜样式 ▼▼▼ */
.magnifier-view {
  display: block; 
  position: absolute;
  top: 0;
  left: 105%; /* 定位在主图右侧，留出5%间隙 */
  width: 500px;   /* 直接定义一个更大的宽度 */
  height: 500px;  /* 直接定义一个更大的高度 */
  background-color: #fff;
  border: 1px solid var(--border-color);
  z-index: 10;
  pointer-events: none;
  border-radius: 12px; /* 边角做得更圆润 */
  box-shadow: 0 8px 24px rgba(0,0,0,0.15); /* 添加阴影使其更有立体感 */
  background-repeat: no-repeat;
}

/* 其余样式保持不变 */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
}
.thumbnail-image-content,
.feature-image-content,
.usp-image-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumbnail-placeholder {
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
}
.thumbnail-placeholder:hover {
  border-color: #337ab7;
}

.product-detail-page {
  background-color: #fff;
}
.header-wrapper {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: var(--secondary-color);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.header-wrapper :deep(.main-nav a),
.header-wrapper :deep(.header-actions .el-icon),
.header-wrapper :deep(.el-dropdown-link) {
  color: var(--text-color);
}
.header-wrapper :deep(.logo img) {
  filter: none;
}
.product-main-content {
  padding: 60px 20px;
}
.product-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 80px;
}
.thumbnail-carousel {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}
.thumbnail-track {
  display: flex;
  gap: 15px;
  flex-grow: 1;
  overflow: hidden;
}
.thumbnail-placeholder {
  width: 22%;
  aspect-ratio: 1/1;
  background-color: var(--light-gray-color);
  border-radius: 8px;
  flex-shrink: 0;
}
.arrow-icon {
  font-size: 24px;
  color: #ccc;
  cursor: pointer;
}
.product-info {
  width: 50%;
  padding-top: 10px;
}
.product-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 20px 0;
}
.product-features {
  padding-left: 20px;
  margin: 0 0 25px 0;
  color: #555;
  font-size: 14px;
  line-height: 1.7;
}
.product-features li {
  margin-bottom: 10px;
}
.price-section {
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 15px;
}
.current-price {
  font-size: 26px;
  font-weight: bold;
}
.options-section {
  border-top: 1px solid var(--border-color);
  padding-top: 30px;
  margin-bottom: 35px;
}
.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 30px;
}
.option-item {
  display: flex;
  align-items: center;
}
.option-label {
  width: 90px;
  font-weight: 500;
  color: #333;
  flex-shrink: 0;
}
.option-item > * {
  flex-grow: 1;
}
.color-swatch {
  margin-right: 15px;
}
.color-swatch :deep(.el-radio__input) {
  display: none;
}
.color-swatch :deep(.el-radio__label) {
  position: relative;
  display: block;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--swatch-color);
  cursor: pointer;
  padding: 0;
  border: 1px solid #dcdfe6;
  transition: border-color 0.2s;
}
.color-swatch.is-checked :deep(.el-radio__label) {
  border: 2px solid #606266;
}
.action-buttons {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  position: relative; /* 【新增】为反馈信息的绝对定位提供基准 */
}

/* ▼▼▼【新增】反馈信息的样式 ▼▼▼ */
.added-feedback {
  position: absolute;
  top: 50%;
  left: calc(50% - 10px); /* 让它出现在第一个按钮的右侧 */
  transform: translate(100%, -50%); /* 垂直居中 */
  
  display: flex;
  align-items: center;
  background-color: #7CB342; /* 成功绿色 */
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap; /* 防止文字换行 */
}

.added-feedback .el-icon {
  margin-right: 6px;
  font-weight: bold;
}

/* ▼▼▼【新增】淡入淡出动画效果 ▼▼▼ */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(100%, -50%) scale(0.8);
}

.cart-btn {
  background-color: #337ab7;
  border-color: #2e6da4;
  color: white;
  flex-grow: 1;
}
.cart-btn:hover {
  background-color: #286090;
  border-color: #204d74;
}
.buy-now-btn {
  background-color: #7CB342;
  border-color: #7CB342;
  color: white;
  flex-grow: 1;
}
.buy-now-btn:hover {
  background-color: #7CB342;
  border-color: #7CB342;
}
.video-section {
  padding: 80px 20px;
  background-color: #fff;
}
.section-container {
  max-width: 1000px;
  margin: 0 auto;
}
.section-title {
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 40px;
}
.video-player-container {
  position: relative;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
}
.video-thumbnail-placeholder {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #000;
}
.play-button-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
}
.video-player-container:hover .play-button-overlay {
  background-color: rgba(0, 0, 0, 0.4);
}
.play-icon {
  font-size: 80px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 20px;
  transition: transform 0.3s;
}
.video-player-container:hover .play-icon {
  transform: scale(1.1);
}
.feature-display-section {
  padding: 80px 20px 40px;
}
.feature-container {
  max-width: 1200px;
  margin: 0 auto;
}
.feature-hero-placeholder {
  width: 100%;
  aspect-ratio: 16 / 7;
  background-color: var(--light-gray-color);
  border-radius: 12px;
  margin-bottom: 20px;
}
.feature-square-placeholder {
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: var(--light-gray-color);
  border-radius: 12px;
  overflow: hidden;
}

.feature-image-content {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.specs-params-section {
  padding: 80px 20px;
}
/* ▼▼▼ 【修改部分】 ▼▼▼ */
.specs-images-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch; /* 关键：将 flex-start 改为 stretch，让两个框等高 */
  gap: 0;
  margin-bottom: 60px;
}
.spec-image-placeholder {
  flex: 1;
  max-width: 500px;
  /* background-color: var(--light-gray-color); */
  border-radius: 0px;
  overflow: hidden;
}
/* ▲▲▲ 【修改结束】 ▲▲▲ */
.spec-image-content {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.params-table {
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}
.param-row {
  display: flex;
  font-size: 14px;
}
.param-row:not(:last-child) {
  border-bottom: 1px solid #e0e0e0;
}
.param-label, .param-value {
  padding: 15px 20px;
}
.param-label {
  width: 200px;
  background-color: #f9f9f9;
  font-weight: 500;
  flex-shrink: 0;
}
.param-value {
  flex-grow: 1;
}

</style>