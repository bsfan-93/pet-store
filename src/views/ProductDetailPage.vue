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
            <el-button 
              size="large" 
              class="cart-btn" 
              @click="handleAddToCart($event)" 
              :loading="isAddingToCart" 
              :disabled="!form.size || !form.color || isAddingToCart"
            >
              <el-icon style="margin-right: 8px;"><ShoppingCart /></el-icon>
              {{ $t('product.add_to_cart') }}
            </el-button>
            
            <el-button 
              size="large" 
              class="buy-now-btn" 
              @click="handleBuyNow" 
              type="default"
              :disabled="!form.size || !form.color"
            >
              {{ $t('product.buy_now') }}
            </el-button>

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
import { useI18n } from 'vue-i18n';

// props and router
const props = defineProps({
  id: String 
});
const route = useRoute();
const router = useRouter(); 
const { t } = useI18n(); 

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

const isAddingToCart = ref(false); // 确保这个 ref 变量已定义

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
    // ▼▼▼ 2. 核心逻辑：在这里自动为用户选择第一个选项 ▼▼▼
    const sizes = data.specifications?.find(s => s.name === 'size')?.values || [];
    if (sizes.length > 0) {
      form.size = sizes[0].value;
    }
    const colors = data.specifications?.find(s => s.name === 'color')?.values || [];
    if (colors.length > 0) {
      form.color = colors[0].value;
    }
    // ▲▲▲ 逻辑结束 ▲▲▲
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

const handleAddToCart = async (event) => { // 接收事件对象
  // 调试用：查看方法是否被多次调用
  console.log('handleAddToCart called. Current isAddingToCart:', isAddingToCart.value); 
  console.log('Event target:', event?.target); // 打印触发事件的元素

  // 【核心防御 1】防止函数在同步操作进行中被重复调用
  if (isAddingToCart.value) { 
    console.log('handleAddToCart: Already adding, preventing duplicate call due to guard.');
    // 再次尝试禁用按钮，以防万一
    if (event?.target) {
        event.target.disabled = true;
    }
    return;
  }

  // 【核心防御 2】立即设置加载状态和禁用按钮
  isAddingToCart.value = true; 
  if (event?.target) { // 确保 event.target 存在
    event.target.disabled = true; // 直接禁用点击的按钮元素
  }

  try {
    if (!productDetail.value) {
      ElMessage.warning(t('product.product_details_not_loaded')); 
      return; 
    }

    // 【新增】在访问 specifications 之前，进行严格的空值检查
    if (!productDetail.value.specifications || !Array.isArray(productDetail.value.specifications)) {
      ElMessage.error(t('product.specifications_not_loaded_error')); // + 新增一个国际化键
      console.error("Product specifications are missing or not in expected array format.", productDetail.value);
      return; // 如果规格信息不完整，阻止添加购物车操作
    }


    const selectedSizeValue = form.size;
    const selectedColorValue = form.color;

    const selectedSizeId = productDetail.value.specifications
      .find(s => s.name === 'size')
      ?.values.find(v => v.value === selectedSizeValue)
      ?.id;

    const selectedColorId = productDetail.value.specifications
      .find(s => s.name === 'color')
      ?.values.find(v => v.value === selectedColorValue)
      ?.id;

    // 【修正】更新本地购物车状态
    cartStore.addItem({
      id: productDetail.value.good.id, 
      goodId: productDetail.value.good.id, 
      name: productDetail.value.good.name,
      price: productDetail.value.good.price,
      url: mainImage.value,
      quantity: form.quantity,
      specId: selectedSizeId,
      specName: selectedSizeValue,
      colorId: selectedColorId,
      colorName: selectedColorValue,
    });

    if (authStore.isLoggedIn) {
      const apiPayload = {
        goodId: productDetail.value.good.id,
        spec: selectedSizeId,
        color: selectedColorId,
        quantity: form.quantity
      };

      if (selectedSizeId === undefined || selectedSizeId === null ||
          selectedColorId === undefined || selectedColorId === null) {
          ElMessage.error(t('product.select_options_error')); 
          console.error("Missing spec or color ID in payload:", apiPayload);
          return; 
      }

      await addToCart(apiPayload); // 实际发送 POST 请求到后端
    }

    // 显示添加成功反馈
    // showAddedFeedback.value = true;
    // clearTimeout(feedbackTimer);
    // feedbackTimer = setTimeout(() => {
    //   showAddedFeedback.value = false;
    // }, 2000); 

  } catch (error) {
    console.error("handleAddToCart Error:", error);
    ElMessage.error(error.message || t('product.network_error_message') || '添加到购物车失败，请重试。');
  } finally {
    isAddingToCart.value = false; // 无论成功或失败，都重置为非加载状态
    if (event?.target) { // 确保 event.target 存在
      event.target.disabled = false; // 显式重新启用按钮
    }
    console.log('handleAddToCart completed.'); 
  }
};

const handleBuyNow = async () => {
 if (!authStore.isLoggedIn) {
  ElMessage.info(t('product.login_to_purchase_message'));
  router.push('/login');
  return;
 }
 
 if (!productDetail.value) {
  ElMessage.warning(t('product.product_details_not_loaded'));
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
 /* overflow: hidden; 为了让放大镜显示在右侧，这里不能隐藏溢出*/
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
 width: 500px;  /* 直接定义一个更大的宽度 */
 height: 500px; /* 直接定义一个更大的高度 */
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

.cart-btn {
 background-color: #3C72B6;
 border-color: #3C72B6;
 color: white;
 flex-grow: 1;
 flex-basis: 0; /* 【新增】确保 flex-grow:1 能更均匀地分配空间 */
}
.cart-btn:hover {
 background-color: #3C72B6;
 border-color: #3C72B6;
}

/* 立即购买按钮样式 - 【核心修改：简化样式使其可见】 */
.buy-now-btn {
  background-color: #92C45C; /* 绿色 */
  border-color: #92C45C;
  color: white;
  flex-grow: 1; /* 允许按钮填充可用空间 */
  flex-basis: 0; /* 确保 flex-grow:1 能更均匀地分配空间 */
  
  /* 【移除所有上次尝试移除对勾的复杂样式】 */
  /* 保留 Element Plus size="large" 的默认内边距 */
  /* Element Plus size="large" 按钮默认 padding 是 12px 19px (垂直 12px, 水平 19px) */
  padding-left: 19px; 
  padding-right: 19px; 
  padding-top: 12px; 
  padding-bottom: 12px;
}

.buy-now-btn:hover {
  background-color: #92C45C;
  border-color: #92C45C;
}

.buy-now-btn:hover {
 background-color: #92C45C;
 border-color: #92C45C;
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
 /* aspect-ratio: 16 / 7; */ /* <-- 這個比例可能太寬 */
 aspect-ratio: 16 / 9; /* ▼▼▼ 【修改】改為更通用的 16:9 ▼▼▼ */
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
 flex-direction: row;  /* 保持横向排列 */
 justify-content: center;  /* 保持水平居中 */
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
  height: auto; /* ▼▼▼ 【修改/確認】確保圖片高度自動，防止被拉伸 ▼▼▼ */
  object-fit: contain;
}

.params-table {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f0f0f0; /* 為整體添加一個淺灰色外邊框 */
}

.param-row {
  display: flex;
  justify-content: space-between; /* 2. 讓左右兩欄的內容推向兩側 */
  align-items: center;
  background-color: #b8b5b5; /* 1. 統一的深灰色背景 */
  font-size: 14px;
}
/* 2. 為每一行（除了最後一行）添加白色的下邊框作為分隔線 */
.param-row:not(:last-child) {
  border-bottom: 1px solid #fff;
}

.param-label, .param-value {
  padding: 18px 20px;
}

.param-label {
  font-weight: 600;
  color: #000;
  /* 1. 移除垂直分隔線 */
  border-right: none; 
}

.param-value {
  font-weight: 600;
  color: #000;
  /* 2. 讓右側文字靠右對齊 */
  text-align: right; 
}

/* ▼▼▼ 【新增】針對手機的響應式樣式 ▼▼▼ */
@media (max-width: 767px) {
 .product-main-content {
  padding: 30px 15px;
 }

 .product-container {
  flex-direction: column; /* 垂直堆疊 */
  gap: 30px;
 }

 .product-gallery, .product-info {
  width: 100%;
 }

 .magnifier-view {
  display: none; /* 手機上禁用放大鏡 */
 }

 .options-grid {
  grid-template-columns: 1fr; /* 單欄顯示 */
 }

 .action-buttons {
  flex-direction: column; /* 按鈕垂直排列 */
 }

 .added-feedback {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 10px;
 }

 .specs-images-container {
  flex-direction: column;
  gap: 20px;
 }
 
 .section-title {
  font-size: 24px;
 }
}
</style>