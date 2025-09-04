<template>
  <div class="shop-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="shop-container">
        <div class="page-title-container">
          <h1>{{ pageTitle }}</h1>
          <el-button class="filter-button" @click="sortProducts">
            <span>{{ t('shop_page.filters_button') }}</span>
            <el-icon class="filter-icon"><Sort /></el-icon>
          </el-button>
        </div>

        <div v-if="isLoading" class="loading-state">
          <p>Loading products...</p>
        </div>
        
        <div v-else-if="products.length > 0" class="product-grid">
          <ProductCard 
            v-for="product in products" 
            :key="product.id" 
            :product="mapProductData(product)"
          />
        </div>

        <div v-else class="empty-state">
          <p>No products found in this category.</p>
        </div>

      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

// Component Imports
import { ElButton, ElIcon } from 'element-plus';
import { Sort } from '@element-plus/icons-vue';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import ProductCard from '../components/ProductCard.vue';
import { getGoodsByPage } from '../api';

// Composables
const { t } = useI18n();
const route = useRoute();

// State
const isLoading = ref(true);
const products = ref([]);
// 【核心】用于控制排序方向的状态，true为升序，false为降序
const sortAsc = ref(true); 

// Mappings
const categoryIdMap = {
  'all': '0',
  'feeder': '1',
  'fountains': '2',
  'leash': '3'
};

// Computed Properties
const currentCategory = computed(() => route.params.category);

const pageTitle = computed(() => {
  const cat = currentCategory.value;
  if (cat && cat !== 'all') {
    const titleKey = `mega_menu.${cat}`;
    const translated = t(titleKey);
    return translated.startsWith('mega_menu.') ? (cat.charAt(0).toUpperCase() + cat.slice(1)) : translated;
  }
  return t('shop_page.all_products_title');
});

// Functions
const fetchProducts = async () => {
  isLoading.value = true;
  products.value = [];
  try {
    const categoryId = categoryIdMap[currentCategory.value] || '0';
    // 【核心】调用API时，传入当前的排序方向
    const results = await getGoodsByPage(categoryId, sortAsc.value);
    products.value = results || [];
  } catch (error) {
    console.error(`Failed to fetch products for category: ${currentCategory.value}`, error);
    products.value = [];
  } finally {
    isLoading.value = false;
  }
};

const mapProductData = (product) => {
  return {
    id: product.id,
    url: product.coverImageUrl || '/images/placeholder.png',
    tag: null,
    colorName: product.color ? product.color.name : 'Default',
    colorHex: product.color ? product.color.code : '#ccc',
    name: product.name,
    subtitle: product.subtitle,
    price: product.price
  };
};

// 【核心】"Filters" 按钮的点击事件处理函数
const sortProducts = () => {
  // 1. 切换排序方向
  sortAsc.value = !sortAsc.value;
  // 2. 重新调用API，从后端获取已排序的数据
  fetchProducts();
};

// Watchers
watch(currentCategory, (newCategory) => {
  if (newCategory) {
    // 当分类切换时，重置为默认的升序排序，并获取数据
    sortAsc.value = true;
    fetchProducts();
  }
}, { immediate: true });
</script>

<style scoped>
/* 样式部分保持不变 */
.shop-page {
  background-color: #fff;
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
.main-content {
  padding: 60px 20px;
}
.shop-container {
  max-width: 1400px;
  margin: 0 auto;
}

.page-title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}
.page-title-container h1 {
  font-size: 42px;
  font-weight: 700;
  text-align: left;
  margin: 0;
}

.filter-button {
  height: auto;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  border: 1.9px solid #000;
  color: #333;
  background-color: #fff;
  display: inline-flex;
  align-items: center;
}
.filter-button:hover, .filter-button:focus {
  background-color: #fff;
  border-color: #fff;
  color: #333;
}

.filter-icon {
  margin-left: 8px;
  font-size: 12px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}
.loading-state, .empty-state {
  text-align: center;
  padding: 80px 0;
  color: #666;
}
</style>