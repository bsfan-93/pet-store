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
            :product="product"
          />
        </div>

        <div v-else class="empty-state">
          <p>No products found.</p>
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
import { ElButton, ElIcon } from 'element-plus';
import { Sort } from '@element-plus/icons-vue';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import ProductCard from '../components/ProductCard.vue';

const { t } = useI18n();
const route = useRoute();
const isLoading = ref(false);
const products = ref([]);

const mockProducts = [
  { id: '1', url: '/images/manual_feeder1.png', tag: 'New', colorName: 'Blue', colorHex: '#a0c7e4', name: 'Pets Clan smart feeder', subtitle: 'New product launch', price: '133.5' },
  { id: '2', url: '/images/manual_feeder3.png', tag: 'HOT', colorName: 'Gree', colorHex: '#a9b3a9', name: 'Pets Clan smart feeder', subtitle: 'personalized feeding', price: '133.5' },
  { id: '3', url: '/images/manual_feeder2.png', tag: null, colorName: 'White', colorHex: '#ffffff', name: 'Pets Clan smart feeder', subtitle: 'personalized feeding', price: '133.5' },
  { id: '4', url: '/images/manual_fountain3.png', tag: 'New', colorName: 'Gree', colorHex: '#a9b3a9', name: 'Pets Clan smart Fountains', subtitle: 'A clear view into your cat’s hydration', price: '49.9' },
  { id: '5', url: '/images/manual_fountain1.png', tag: 'HOT', colorName: 'White', colorHex: '#ffffff', name: 'Pets Clan smart Fountains', subtitle: 'Effortless detach and clean process', price: '49.9' },
  { id: '6', url: '/images/manual_fountain2.png', tag: null, colorName: 'Blue', colorHex: '#3b5998', name: 'Pets Clan smart Fountains', subtitle: 'Effortless detach and clean process', price: '49.9' },
  // ▼▼▼ START: 修正 Leash 商品数据 ▼▼▼
  { id: '7', url: '/images/manual_leash1.png', tag: 'New', colorName: 'Cute Pet Family Series', colorHex: '#d2b48c', name: 'Pets Clan smart Leash', subtitle: 'Changing the new way of pet travel', price: '100.9' },
  { id: '8', url: '/images/app-feature-leash.png', tag: 'HOT', colorName: 'Cute Pet Family Series', colorHex: '#4a4a4a', name: 'Pets Clan smart Leash', subtitle: 'Effortless detach and clean process', price: '100.9' },
  // 这里使用了已有的图片路径来修复裂图问题
  { id: '9', url: '/images/manual_leash1.png', tag: null, colorName: 'Cute Pet Family Series', colorHex: '#808080', name: 'Pets Clan smart Leash', subtitle: 'Effortless detach and clean process', price: '100.9' },
  { id: '10', url: '/images/manual_leash2.png', tag: null, colorName: 'Cute Pet Family Series', colorHex: '#00ced1', name: 'Pets Clan smart Leash', subtitle: 'Changing the new way of pet travel', price: '100.9' },
  // ▲▲▲ END: 修正 Leash 商品数据 ▲▲▲
];

const category = computed(() => route.params.category);

const pageTitle = computed(() => {
  const cat = category.value;
  if (cat && cat !== 'all') {
    const titleKey = `mega_menu.${cat}`;
    const translated = t(titleKey);
    // 如果找不到翻译，就用路由参数并首字母大写
    return translated.startsWith('mega_menu.') ? (cat.charAt(0).toUpperCase() + cat.slice(1)) : translated;
  }
  return t('shop_page.all_products_title');
});

const getPriority = (tag) => {
  if (tag === 'New') return 1;
  if (tag === 'HOT') return 2;
  return 3;
};

// 监听路由变化，并根据分类筛选商品
watch(category, (newCategory) => {
  isLoading.value = true;
  let filtered;
  if (newCategory && newCategory !== 'all') {
    // 修正了筛选逻辑，使其更准确
    const categoryKeyword = newCategory.replace(/s$/, ''); // 处理 "fountains" -> "fountain"
    filtered = mockProducts.filter(p => p.name.toLowerCase().includes(categoryKeyword));
  } else {
    filtered = [...mockProducts];
  }
  
  // 默认排序
  filtered.sort((a, b) => {
    const priorityA = getPriority(a.tag);
    const priorityB = getPriority(b.tag);
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    return parseFloat(a.price) - parseFloat(b.price);
  });
  
  products.value = filtered;
  isLoading.value = false;
}, { immediate: true });


const sortAscending = ref(true);

const sortProducts = () => {
  products.value.sort((a, b) => {
    const priorityA = getPriority(a.tag);
    const priorityB = getPriority(b.tag);
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    const priceA = parseFloat(a.price);
    const priceB = parseFloat(b.price);
    
    return sortAscending.value ? priceA - priceB : priceB - priceA;
  });

  sortAscending.value = !sortAscending.value;
};

</script>

<style scoped>
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
  background-color: #f5f5f5;
  border-color: #888;
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