<template>
  <header 
    class="app-header" 
    :class="{ 'scrolled': isScrolled }"
    @mouseleave="isMenuVisible = false"
  >
    <div class="header-container">
      <a href="/" class="logo">
        <img src="/images/logo.png" alt="PetsClan Logo">
      </a>
      
      <nav class="main-nav">
        <a href="#">{{ $t('header.home') }}</a>
        <div 
          class="nav-item-shop"
          @mouseenter="isMenuVisible = true"
        >
          <a href="#">{{ $t('header.shop') }}</a>
        </div>
        <a href="#">{{ $t('header.about_us') }}</a>
        <a href="#">{{ $t('header.app') }}</a>
      </nav>

      <div class="header-actions">
        <el-icon @click="isSearchVisible = true"><Search /></el-icon>
        <el-icon><User /></el-icon>
        
        <el-badge :value="cartStore.totalItems" :hidden="cartStore.totalItems === 0" class="cart-badge">
          <el-icon @click="cartStore.openCart()"><ShoppingCart /></el-icon>
        </el-badge>
        
        <el-dropdown @command="changeLanguage" trigger="click">
          <span class="el-dropdown-link lang">
            {{ currentLanguageAbbr }} <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item 
                v-for="lang in languages" 
                :key="lang.code" 
                :command="lang.code"
              >
                {{ lang.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    
    <MegaMenu 
      v-show="isMenuVisible"
      @mouseenter="isMenuVisible = true" 
    />

    <Teleport to="body">
      <SearchOverlay 
        v-if="isSearchVisible" 
        @close="isSearchVisible = false" 
      />
    </Teleport>

    <Teleport to="body">
      <ShoppingCartPanel />
    </Teleport>
  </header>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'; // 导入 onMounted (为API预留)
import { useI18n } from 'vue-i18n'; // 导入 useI18n
import { useCartStore } from '../stores/cart';    // 导入 useCartStore
import MegaMenu from './MegaMenu.vue';
import SearchOverlay from './SearchOverlay.vue';
import ShoppingCartPanel from './ShoppingCartPanel.vue'; // 4. 导入 ShoppingCartPanel 组件

// 获取 cart store 实例
const cartStore = useCartStore();

defineProps({
  isScrolled: {
    type: Boolean,
    default: false
  }
});

const isMenuVisible = ref(false); 
const isSearchVisible = ref(false);
// const isCartVisible = ref(false); // 5. 添加控制购物车的状态

// 6. 定义一个响应式数组来存放购物车商品，并为API调用预留位置
// const cartItems = ref([]);

// 预留的API调用位置：通常在组件挂载或用户登录后获取购物车数据
onMounted(() => {
  // fetchCartItems();
});

const fetchCartItems = async () => {
  // 这里是未来你调用获取购物车数据的API的地方
  // 例如: const response = await fetch('/api/cart');
  // const data = await response.json();
  // cartItems.value = data.items;
  console.log("在这里调用获取购物车数据的API");
};

// --- i18n 语言切换逻辑 ---
const { locale } = useI18n();

// 定义我们支持的语言列表
const languages = ref([
    { code: 'en', name: 'English', abbr: 'EN' },
    { code: 'zh-Hans', name: '简体中文', abbr: 'CN' },
    { code: 'zh-Hant', name: '繁體中文', abbr: 'TW' },
    { code: 'ja', name: '日本語', abbr: 'JP' },
    { code: 'ko', name: '한국어', abbr: 'KR' },
    { code: 'de', name: 'Deutsch', abbr: 'DE' },
    { code: 'es', name: 'Español', abbr: 'ES' },
    { code: 'fr', name: 'Français', abbr: 'FR' },
    { code: 'it', name: 'Italiano', abbr: 'IT' },
    { code: 'ms', name: 'Bahasa Melayu', abbr: 'MY' },
    { code: 'pt', name: 'Português', abbr: 'PT' },
    { code: 'th', name: 'ภาษาไทย', abbr: 'TH' }
]);

// 计算属性，用于显示当前语言的名称
const currentLanguageAbbr = computed(() => {
  // 找到当前locale对应的语言对象，返回其缩写
  return languages.value.find(lang => lang.code === locale.value)?.abbr || 'EN';
});

// 切换语言的函数
const changeLanguage = (langCode) => {
  locale.value = langCode;
  // 你可以在这里把用户的语言偏好保存到 localStorage
  // localStorage.setItem('user-language', langCode);
};
</script>

<style scoped>
.app-header {
  position: relative;
  width: 100%;
  height: var(--header-height);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  background-color: transparent;
}
.app-header.scrolled,
.app-header:hover {
  background-color: var(--secondary-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.header-container {
  max-width: var(--container-width);
  height: 100%;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

/* --- Logo 智能切换样式 --- */

/* 1. 让logo的容器成为定位的基准 */
.logo {
  position: relative;
  width: var(--logo-width);
  height: var(--logo-height);
}

/* 容器控制尺寸，这个我们刚修复好，保持不变 */
.logo {
  position: relative;
  width: var(--logo-width);
  height: var(--logo-height);
}

/* 默认状态，使用滤镜将深色logo变为白色 */
.logo img {
  width: 100%;
  height: 100%;
  display: block; /* 使用 block 即可，不再需要 absolute 定位 */
  filter: brightness(0) invert(1);
  transition: filter 0.3s ease-in-out; /* 让颜色变化有平滑的动画效果 */
}

/* 滚动或悬停时，移除滤镜，恢复原始深色 */
.app-header.scrolled .logo img,
.app-header:hover .logo img {
  filter: none;
}

/* 导航栏间距 */
.main-nav {
  margin-left: 455px;
}
.nav-item-shop {
  display: inline-block;
}

/* 默认状态 (导航栏透明时)，所有文字和图标为白色 */
.main-nav a,
.header-actions .el-icon,
.el-dropdown-link {
  color: var(--secondary-color); /* 白色 */
  transition: color 0.3s ease, transform 0.2s ease;
}

/* 滚动后 (导航栏变白时)，所有文字和图标变回深色 */
.app-header.scrolled .main-nav a,
.app-header.scrolled .header-actions .el-icon,
.app-header.scrolled .el-dropdown-link,
.app-header:hover .main-nav a,
.app-header:hover .header-actions .el-icon,
.app-header:hover .el-dropdown-link  {
  color: var(--text-color); /* 深色 */
}

/* 之前已有的 a 标签样式，我们把它合并和简化 */
.main-nav a, .nav-item-shop > a {
  display: inline-block;
  font-size: var(--font-size-nav);
  margin: 0 25px;
  text-decoration: none;
}

.main-nav a:hover, .nav-item-shop > a:hover {
  transform: scale(1.1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-left: auto;
}
.header-actions .el-icon {
  font-size: var(--icon-size);
  cursor: pointer;
}

.header-actions .el-icon:hover {
  transform: scale(1.2);
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: var(--font-size-nav);
  font-weight: bold;
}
.lang {
  /* 这个class现在只用于 el-dropdown-link 的一部分，所以主要的样式移到上面去了 */
  transition: transform 0.2s ease;
}
.lang:hover {
  transform: scale(1.1);
}

.cart-badge {
  /* 确保小红点位置正确 */
  display: flex;
  align-items: center;
}
</style>