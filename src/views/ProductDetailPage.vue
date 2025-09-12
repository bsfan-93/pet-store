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
            @mousemove="handleMouseMove"
            @mouseleave="resetImageTransform"
            @wheel.prevent="handleWheel"
          >
            <img
              :src="mainImage"
              alt="Main product image"
              class="main-image-content"
              :style="mainImageStyle"
            >
          </div>
          <div class="thumbnail-carousel">
            <el-icon class="arrow-icon" @click="scrollThumbnails('left')"><ArrowLeft /></el-icon>
            <div class="thumbnail-track" ref="thumbnailTrackRef">
              <div
                v-for="img in productDetail.goodPic"
                :key="img.id"
                class="thumbnail-placeholder"
                @click="mainImage = img.url"
              >
                <img :src="img.url" :alt="img.name" class="thumbnail-image-content">
              </div>
            </div>
            <el-icon class="arrow-icon" @click="scrollThumbnails('right')"><ArrowRight /></el-icon>
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
              <div class="option-item" v-if="sizeOptions.length > 0">
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
                <span class="option-label">{{ $t('product.quantity') }}</span>
                <el-input-number v-model="form.quantity" :min="1" size="default" />
              </div>
              <div class="option-item" v-if="standardOptions.length > 0">
                <span class="option-label">{{ $t('product.standard') }}</span>
                <el-select v-model="form.standard" :placeholder="$t('product.select_placeholder')" size="default">
                    <el-option
                        v-for="standard in standardOptions"
                        :key="standard.id"
                        :label="standard.value"
                        :value="standard.value"
                    />
                </el-select>
              </div>
              
              <div class="option-item" v-if="colorOptions.length > 0">
                <span class="option-label">{{ $t('product.color') }}</span>
                 <div class="color-options-wrapper">
                    <div
                      v-for="color in colorOptions"
                      :key="color.id"
                      class="color-swatch"
                      :class="{ 'is-active': form.color === color.value }"
                      :style="{ backgroundColor: color.code }"
                      @click="form.color = color.value"
                    ></div>
                </div>
              </div>
              <div class="option-item" v-else-if="singleColorOption">
                <span class="option-label">{{ $t('product.color') }}</span>
                <div class="color-options-wrapper">
                  <div
                    class="color-swatch-display"
                    :style="{ backgroundColor: singleColorOption.code }"
                    ></div>
                </div>
              </div>
              </div>
          </div>
          <div class="action-buttons">
            <el-button
              size="large"
              class="cart-btn"
              @click="handleAddToCart($event)"
              :loading="isAddingToCart"
              :disabled="isAddingToCart || !isOptionsSelected"
            >
              <el-icon style="margin-right: 8px;"><ShoppingCart /></el-icon>
              {{ $t('product.add_to_cart') }}
            </el-button>

            <el-button
              size="large"
              class="buy-now-btn"
              @click="handleBuyNow"
              type="default"
              :disabled="!isOptionsSelected"
            >
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
import { getGoodDetail } from '../api';
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

const props = defineProps({
  id: String
});

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const cartStore = useCartStore();
const authStore = useAuthStore();
const productDetail = ref(null);
const mainImage = ref('');
const mainImageContainer = ref(null);

const isZoomActive = ref(false);
const zoomLevel = ref(1.8);
const transformOrigin = ref('center center');

const mainImageStyle = computed(() => ({
  transformOrigin: transformOrigin.value,
  transform: `scale(${isZoomActive.value ? zoomLevel.value : 1})`,
}));

const handleMouseMove = (event) => {
  if (!mainImageContainer.value) return;
  isZoomActive.value = true;
  const rect = mainImageContainer.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const xPercent = (x / rect.width) * 100;
  const yPercent = (y / rect.height) * 100;
  transformOrigin.value = `${xPercent}% ${yPercent}%`;
};

const resetImageTransform = () => {
  isZoomActive.value = false;
  zoomLevel.value = 1.8;
};

const handleWheel = (event) => {
  if (isZoomActive.value) {
    const zoomFactor = event.deltaY < 0 ? 0.2 : -0.2;
    zoomLevel.value = Math.max(1, Math.min(zoomLevel.value + zoomFactor, 4));
  }
};

const form = reactive({
  quantity: 1,
  size: '',
  color: '',
  standard: ''
});

const showAddedFeedback = ref(false);
let feedbackTimer = null;
const isAddingToCart = ref(false);
const thumbnailTrackRef = ref(null);

const scrollThumbnails = (direction) => {
  const container = thumbnailTrackRef.value;
  if (!container || container.scrollWidth <= container.clientWidth) return;
  const scrollAmount = (container.clientWidth / 2);
  container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
};

const fetchProductData = async (goodId) => {
  if (!goodId) {
    productDetail.value = null;
    return;
  }
  try {
    productDetail.value = null;
    const data = await getGoodDetail(goodId);
    productDetail.value = data;
    if (data.goodPic && data.goodPic.length > 0) {
      mainImage.value = data.goodPic[0].url;
    }

    const sizes = data.specifications?.find(s => s.name === 'size')?.values;
    if (sizes && sizes.length > 0) {
      form.size = sizes[0].value;
    } else {
      form.size = '';
    }

    const colors = data.specifications?.find(s => s.name === 'color')?.values;
    if (colors && colors.length > 0) {
      form.color = colors[0].value;
    } else if (data.good.color) {
      form.color = data.good.color.name;
    } else {
      form.color = '';
    }

    const standards = data.specifications?.find(s => s.name === 'standard')?.values;
    if (standards && standards.length > 0) {
        form.standard = standards[0].value;
    } else {
        form.standard = '';
    }
  } catch (error) {
    console.error("Failed to fetch product details:", error);
    ElMessage.error(t('product.product_details_not_loaded'));
    productDetail.value = null;
  }
};

watch(() => route.params.id, (newId) => {
  if (newId) fetchProductData(newId);
}, { immediate: true });

// 改进后的 colorOptions 计算属性，优先使用 specifications
const colorOptions = computed(() => {
    if (!productDetail.value || !productDetail.value.specifications) return [];
    const colors = productDetail.value.specifications.find(s => s.name === 'color')?.values || [];
    return colors.length > 0 ? colors : [];
});

// 新增的单色选项计算属性
const singleColorOption = computed(() => {
    if (productDetail.value && productDetail.value.good.color && colorOptions.value.length === 0) {
        return productDetail.value.good.color;
    }
    return null;
});

// 新增计算属性来简化按钮的 disabled 状态
const isOptionsSelected = computed(() => {
    const needsSize = sizeOptions.value.length > 0;
    const needsColor = colorOptions.value.length > 0;
    const needsStandard = standardOptions.value.length > 0;
    
    let isSizeSelected = needsSize ? !!form.size : true;
    let isColorSelected = needsColor ? !!form.color : (singleColorOption.value ? true : true);
    let isStandardSelected = needsStandard ? !!form.standard : true;

    return isSizeSelected && isColorSelected && isStandardSelected;
});

const sizeOptions = computed(() => {
    if (!productDetail.value || !productDetail.value.specifications) return [];
    return productDetail.value.specifications.find(s => s.name === 'size')?.values || [];
});

const standardOptions = computed(() => {
    if (!productDetail.value || !productDetail.value.specifications) return [];
    return productDetail.value.specifications.find(s => s.name === 'standard')?.values || [];
});

const productVideo = computed(() => {
    if (!productDetail.value || !productDetail.value.detailPic) return null;
    return productDetail.value.detailPic.find(p => p.isVideo)?.url || null;
});

const featureImages = computed(() => {
    if (!productDetail.value || !productDetail.value.detailPic) return [];
    return productDetail.value.detailPic.filter(p => !p.isVideo).map(p => p.url);
});

const handleAddToCart = async (event) => {
  if (isAddingToCart.value) return;
  isAddingToCart.value = true;
  try {
    if (!productDetail.value?.specifications) {
      ElMessage.error(t('product.specifications_not_loaded_error'));
      return;
    }
    const selectedSizeValue = form.size;
    const selectedColorValue = form.color;
    const selectedStandardValue = form.standard;
    const sizeSpec = productDetail.value.specifications.find(s => s.name === 'size');
    const colorSpec = productDetail.value.specifications.find(s => s.name === 'color');
    const standardSpec = productDetail.value.specifications.find(s => s.name === 'standard');
    
    const selectedSizeId = sizeSpec?.values.find(v => v.value === selectedSizeValue)?.id;
    let selectedColorId, selectedColorName;

    if (colorSpec) {
      const selectedColor = colorSpec.values.find(v => v.value === selectedColorValue);
      selectedColorId = selectedColor?.id;
      selectedColorName = selectedColor?.value;
    } else if (singleColorOption.value) {
      selectedColorId = singleColorOption.value.id;
      selectedColorName = singleColorOption.value.name;
    }
    
    const selectedStandardId = standardSpec?.values.find(v => v.value === selectedStandardValue)?.id;

    const needsSize = !!sizeSpec;
    const needsColor = !!(colorSpec || singleColorOption.value);
    const needsStandard = !!standardSpec;
    
    let validationFailed =
      (needsSize && !selectedSizeId) ||
      (needsColor && !selectedColorId) ||
      (needsStandard && !selectedStandardId);

    if (validationFailed) {
      ElMessage.error(t('product.select_options_error'));
      return;
    }

    await cartStore.addItem({
      id: productDetail.value.good.id,
      goodId: productDetail.value.good.id,
      name: productDetail.value.good.name,
      price: productDetail.value.good.price,
      url: mainImage.value,
      quantity: form.quantity,
      specId: selectedSizeId,
      specName: selectedSizeValue,
      colorId: selectedColorId,
      colorName: selectedColorName,
      standardId: selectedStandardId,
      standardName: selectedStandardValue,
    });
    showAddedFeedback.value = true;
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => { showAddedFeedback.value = false; }, 2000);
  } catch (error) {
    ElMessage.error(error.message || t('product.network_error_message'));
  } finally {
    isAddingToCart.value = false;
  }
};

const handleBuyNow = () => {
  if (!authStore.isLoggedIn) {
    ElMessage.info(t('product.login_to_purchase_message'));
    router.push('/login');
    return;
  }
  if (!productDetail.value?.specifications) {
    ElMessage.error(t('product.specifications_not_loaded_error'));
    return;
  }
  const selectedSizeValue = form.size;
  const selectedColorValue = form.color;
  const selectedStandardValue = form.standard;
  const sizeSpec = productDetail.value.specifications.find(s => s.name === 'size');
  const colorSpec = productDetail.value.specifications.find(s => s.name === 'color');
  const standardSpec = productDetail.value.specifications.find(s => s.name === 'standard');

  const selectedSizeId = sizeSpec?.values.find(v => v.value === selectedSizeValue)?.id;
  let selectedColorId, selectedColorName;

    if (colorSpec) {
      const selectedColor = colorSpec.values.find(v => v.value === selectedColorValue);
      selectedColorId = selectedColor?.id;
      selectedColorName = selectedColor?.value;
    } else if (singleColorOption.value) {
      selectedColorId = singleColorOption.value.id;
      selectedColorName = singleColorOption.value.name;
    }

  const selectedStandardId = standardSpec?.values.find(v => v.value === selectedStandardValue)?.id;

  const needsSize = !!sizeSpec;
  const needsColor = !!(colorSpec || singleColorOption.value);
  const needsStandard = !!standardSpec;

  let validationFailed =
    (needsSize && !selectedSizeId) ||
    (needsColor && !selectedColorId) ||
    (needsStandard && !selectedStandardId);

  if (validationFailed) {
      ElMessage.error(t('product.select_options_error'));
      return;
  }
  const checkoutData = {
    goodId: productDetail.value.good.id,
    quantity: form.quantity,
    name: productDetail.value.good.name,
    amount: productDetail.value.good.price,
    goodImage: mainImage.value,
    currency: "USD",
    description: `${productDetail.value.good.name} - ${selectedColorName || ''}/${selectedSizeValue || ''}`,
    specification: JSON.stringify({ color: selectedColorName, size: selectedSizeValue }),
    successUrl: `${window.location.origin}/success`,
    cancelUrl: `${window.location.origin}/cancel`
  };
  router.push({
    name: 'Checkout',
    query: {
      items: JSON.stringify([checkoutData])
    }
  });
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
  overflow: hidden;
  cursor: zoom-in;
}
.main-image-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s ease, transform-origin 0.1s ease;
}

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
 position: relative;
 z-index: 20;
}
.thumbnail-track {
  display: flex;
  gap: 15px;
  flex-grow: 1;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  flex-shrink: 1;
  min-width: 0;
}
.thumbnail-track::-webkit-scrollbar {
  display: none;
}
.thumbnail-placeholder {
 width: 120px;
  flex-shrink: 0;
 aspect-ratio: 1 / 1;
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

/* 新的颜色选择器样式 */
.color-options-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
.color-swatch {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 30px;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
}
.color-swatch.is-active {
  border-color: #000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
.color-swatch-display {
  width: 150px;
  height: 30px;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}


.action-buttons {
 display: flex;
 gap: 20px;
 margin-top: 10px;
 position: relative;
}
.cart-btn {
 background-color: #3C72B6;
 border-color: #3C72B6;
 color: white;
 flex-grow: 1;
 flex-basis: 0;
}
.cart-btn:hover {
 background-color: #3C72B6;
 border-color: #3C72B6;
}
.buy-now-btn {
  background-color: #92C45C;
  border-color: #92C45C;
  color: white;
  flex-grow: 1;
  flex-basis: 0;
  padding-left: 19px;
  padding-right: 19px;
  padding-top: 12px;
  padding-bottom: 12px;
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
 aspect-ratio: 16 / 9;
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
.specs-images-container {
 display: flex;
 flex-direction: row;
 justify-content: center;
 align-items: stretch;
 gap: 0;
 margin-bottom: 60px;
}
.spec-image-placeholder {
 flex: 1;
 max-width: 500px;
 border-radius: 0px;
 overflow: hidden;
}
.spec-image-content {
  width: 100%;
  height: auto;
  object-fit: contain;
}
.params-table {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}
.param-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #b8b5b5;
  font-size: 14px;
}
.param-row:not(:last-child) {
  border-bottom: 1px solid #fff;
}
.param-label, .param-value {
  padding: 18px 20px;
}
.param-label {
  font-weight: 600;
  color: #000;
  border-right: none;
}
.param-value {
  font-weight: 600;
  color: #000;
  text-align: right;
}
@media (max-width: 767px) {
 .product-main-content {
  padding: 30px 15px;
 }
 .product-container {
  flex-direction: column;
  gap: 30px;
 }
 .product-gallery, .product-info {
  width: 100%;
 }
 .magnifier-view {
  display: none;
 }
 .options-grid {
  grid-template-columns: 1fr;
 }
 .action-buttons {
  flex-direction: column;
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

.sale-tag {
  border-radius: 16px;
  border: none;
  background-color: #e53935;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  font-size: 12px;
  line-height: 1;
}
</style>