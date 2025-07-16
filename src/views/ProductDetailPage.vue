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
          >
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
                <span class="option-label">Quantity</span>
                <el-input-number v-model="form.quantity" :min="1" size="default" />
              </div>
              <div class="option-item">
                <span class="option-label">size</span>
                <el-select v-model="form.size" placeholder="Select" size="default">
                    <el-option
                      v-for="size in sizeOptions"
                      :key="size.id"
                      :label="size.value"
                      :value="size.value"
                    />
                </el-select>
              </div>
              <div class="option-item">
                <span class="option-label">Color</span>
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
                <span class="option-label">Standard</span>
                <el-select v-model="form.standard" placeholder="Select" size="default">
                    <el-option label="OS" value="os" />
                </el-select>
              </div>
            </div>
          </div>
          <div class="action-buttons">
            <el-button size="large" class="cart-btn" @click="handleAddToCart">
              <el-icon style="margin-right: 8px;"><ShoppingCart /></el-icon>
              Add to Cart
            </el-button>
            <el-button size="large" class="buy-now-btn">Buy Now</el-button>
          </div>
        </div>
      </div>

      <section class="video-section" v-if="productVideo">
        <div class="section-container">
          <h2 class="section-title">Unique Selling Points</h2>
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
          <h2 class="section-title">Product Specifications</h2>
          <div class="specs-images-container">
            <div class="spec-image-placeholder"></div>
            <div class="spec-image-placeholder"></div>
          </div>
          <h2 class="section-title">Product Parameters</h2>
          <div class="params-table">
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
    Loading...
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, provide, computed, watch } from 'vue';
import { getPhotoDetails, getGoodDetail } from '../api';
import { useCartStore } from '../stores/cart';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

const props = defineProps({
  id: String // vue-router 会传递一个名为 'id' 的 prop
});

// 您原有的 watch 逻辑可以根据新的 prop 'id' 来调整
watch(() => props.id, (newId) => {
  if (newId) {
    fetchProductData(newId);
  }
}, { immediate: true });

const cartStore = useCartStore();
const megaMenuData = ref(null);
provide('megaMenuData', megaMenuData);

const productDetail = ref(null);
const mainImage = ref('');

const mainImageContainer = ref(null);
const isMagnifierVisible = ref(false);
const mouseX = ref(0);
const mouseY = ref(0);
const zoomLevel = 2;

const form = reactive({
  quantity: 1,
  size: '',
  color: '',
  standard: 'os'
});

const colorOptions = computed(() => {
  if (!productDetail.value) return [];
  const colors = productDetail.value.specifications.find(s => s.name === 'color')?.values || [];
  const colorMap = { 'red': '#D32F2F', 'blue': '#1976D2', 'green': '#689F38', 'gray': '#E0E0E0' };
  return colors.map(c => ({...c, hex: colorMap[c.value.toLowerCase()] || '#ccc'}));
});
const sizeOptions = computed(() => {
  if (!productDetail.value) return [];
  return productDetail.value.specifications.find(s => s.name === 'size')?.values || [];
});
const productVideo = computed(() => {
  if (!productDetail.value) return null;
  return productDetail.value.detailPic.find(p => p.isVideo)?.url || null;
});
const featureImages = computed(() => {
  if (!productDetail.value) return [];
  return productDetail.value.detailPic.filter(p => !p.isVideo).map(p => p.url);
});
const getFeatureImageById = (imageId) => {
    if (!productDetail.value) return '';
    const pic = productDetail.value.goodPic.find(p => p.id === imageId);
    return pic ? pic.url : '';
}

const magnifierStyle = computed(() => {
  if (!mainImageContainer.value) return {};

  const lensSize = 150;
  const container = mainImageContainer.value;
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  // 【关键修改】调整镜片的位置计算
  const lensHalfSize = lensSize / 2;
  const lensX = Math.max(0, Math.min(mouseX.value - lensHalfSize, containerWidth - lensSize));
  const lensY =  Math.max(0, Math.min(mouseY.value - lensHalfSize, containerHeight - lensSize));

  // 【关键修改】使用新的公式计算背景图的偏移
  const bgPosX = -(mouseX.value * zoomLevel - lensSize / 2);
  const bgPosY = -(mouseY.value * zoomLevel - lensSize / 2);

  return {
    top: `${lensY}px`,
    left: `${lensX}px`,
    backgroundImage: `url(${mainImage.value})`,
    backgroundSize: `${containerWidth * zoomLevel}px ${containerHeight * zoomLevel}px`,
    backgroundPosition: `${bgPosX}px ${bgPosY}px`,
  };
});


const fetchProductData = async (goodId) => {
  try {
    productDetail.value = null;
    const data = await getGoodDetail(goodId);
    productDetail.value = data;
    if (data.goodPic.length > 0) {
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
  }
};
const fetchMegaMenuData = async () => {
  const cachedData = sessionStorage.getItem('megaMenuData');
  if (cachedData) {
    try {
      megaMenuData.value = JSON.parse(cachedData);
      return;
    } catch (e) {
      sessionStorage.removeItem('megaMenuData');
    }
  }
  try {
    const rawData = await getPhotoDetails(0);
    const transformedData = {
      links: rawData.map(item => ({ id: item.id, name: item.name, url: `/category/${item.name.toLowerCase()}` })),
      products: rawData.map(item => ({ id: item.id, name: item.name, imageUrl: item.url }))
    };
    megaMenuData.value = transformedData;
    sessionStorage.setItem('megaMenuData', JSON.stringify(transformedData));
  } catch (error) {
    console.error("获取菜单数据失败:", error);
  }
};

watch(() => props.productId, (newId) => {
  if (newId) {
    fetchProductData(newId);
  }
}, { immediate: true });

onMounted(() => {
  fetchMegaMenuData();
});

const handleMouseEnter = () => {
  isMagnifierVisible.value = true;
};
const handleMouseLeave = () => {
  isMagnifierVisible.value = false;
};
const handleMouseMove = (event) => {
  if (!mainImageContainer.value) return;
  const rect = mainImageContainer.value.getBoundingClientRect();
  mouseX.value = event.clientX - rect.left;
  mouseY.value = event.clientY - rect.top;
};

const handleAddToCart = () => {
  if (!productDetail.value) return;
  const itemToAdd = {
    id: productDetail.value.good.id,
    name: productDetail.value.good.name,
    price: productDetail.value.good.price,
    url: mainImage.value,
    selectedSize: form.size,
    selectedColor: form.color,
    quantity: form.quantity
  };
  cartStore.addItem(itemToAdd);
}
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
  overflow: hidden;
}

.main-image-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.magnifier-view {
  display: block;
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  background-color: #fff;
  pointer-events: none;
  background-repeat: no-repeat;
  z-index: 10; /* 【新增】确保放大镜在图片上层 */
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
  background-color: #f0ad4e;
  border-color: #eea236;
  color: white;
  flex-grow: 1;
}
.buy-now-btn:hover {
  background-color: #ec971f;
  border-color: #d58512;
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
.specs-images-container {
  display: flex;
  justify-content: center;
  margin-bottom: 60px;
}
.spec-image-placeholder {
  width: 100%;
  max-width: 800px;
  aspect-ratio: 1 / 1;
  background-color: var(--light-gray-color);
  border-radius: 12px;
  overflow: hidden;
}
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