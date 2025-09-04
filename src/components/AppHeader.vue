<!-- 网站的通用页头，包含 Logo、主导航和用户操作图标，出现在每个页面的顶部。 -->

<template>
  <header 
    class="app-header" 
    :class="{ 'scrolled': isScrolled }"
  >
    <div class="header-container">
      <router-link to="/" class="logo">
        <img src="/images/logo.png" alt="PetsClan Logo">
      </router-link>
      
      <nav class="main-nav">
        <el-dropdown @command="handleMenuCommand" trigger="hover" popper-class="shop-dropdown-grey">
          <span class="el-dropdown-link nav-item-shop" @click="goToShopAllPage">
            {{ t('header.shop') }}
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="category in menuCategories"
                :key="category.id"
                :command="category.routeName"
              >
                {{ t(category.i18nKey) }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        
        <router-link to="/about">{{ t('header.about_us') }}</router-link>
        <router-link to="/app">{{ t('header.app') }}</router-link>
      </nav>

      <div class="header-actions">
        <el-icon @click="isSearchVisible = true"><Search /></el-icon>
        <el-icon @click="handleUserIconClick"><User /></el-icon>
        <el-badge :value="cartStore.totalItems" :hidden="cartStore.totalItems === 0" class="cart-badge">
          <el-icon @click="cartStore.openCart()"><ShoppingCart /></el-icon>
        </el-badge>
        <el-dropdown @command="changeLanguage" trigger="hover">
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
    
    <Teleport to="body">
      <SearchOverlay 
        v-show="isSearchVisible" 
        @close="isSearchVisible = false" 
      />
    </Teleport>
    <Teleport to="body">
      <ShoppingCartPanel />
    </Teleport>
  </header>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia'; 
import ShoppingCartPanel from './ShoppingCartPanel.vue';
import { Search, User, ShoppingCart, ArrowDown } from '@element-plus/icons-vue';
// 【新增】导入API函数
import { getAllCategories } from '../api';

const SearchOverlay = defineAsyncComponent(() => 
  import('./SearchOverlay.vue')
);

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter(); 
const { t, locale } = useI18n();

const { isLoggedIn } = storeToRefs(authStore); 

const isSearchVisible = ref(false);

// 【新增】用于存储从API获取的分类数据
const menuCategories = ref([]);

// 【新增】创建一个从API返回的ID到前端路由和国际化键名的映射
const categoryMap = {
  '0': { routeName: 'all', i18nKey: 'mega_menu.all' },
  '1': { routeName: 'feeder', i18nKey: 'mega_menu.feeder' }, // 对应 "喂食器"
  '2': { routeName: 'fountains', i18nKey: 'mega_menu.fountains' }, // 对应 "饮水机"
  '3': { routeName: 'leash', i18nKey: 'mega_menu.leash' }  // 对应 "牵引绳"
};


// 【新增】获取并处理分类数据的函数
const fetchMenuCategories = async () => {
  try {
    const rawCategories = await getAllCategories();
    // 过滤掉API返回结果中没有在映射表里定义的分类
    // 并将API数据转换为模板需要的数据结构
    menuCategories.value = rawCategories
      .map(cat => {
        const mapping = categoryMap[cat.id];
        return mapping ? { id: cat.id, ...mapping } : null;
      })
      .filter(Boolean); // 移除所有为null的项

  } catch (error) {
    console.error("Failed to fetch menu categories:", error);
    // 如果API失败，可以提供一个默认的菜单作为备用
    menuCategories.value = [
        { id: '0', routeName: 'all', i18nKey: 'mega_menu.all' }
    ];
  }
};

const handleMenuCommand = (command) => {
  router.push(`/shop/${command}`);
};

// ▼▼▼ 新增了这个函数 ▼▼▼
const goToShopAllPage = () => {
  router.push('/shop/all');
};

const handleUserIconClick = async () => {
  if (isLoggedIn.value) {
    try {
      if (!authStore.userInfo) {
        await authStore.fetchUserInfo();
      }
      router.push('/account');
    } catch (error) {
      console.error("Failed to fetch user info or navigate to account:", error);
      router.push('/account');
    }
  } else {
    router.push('/login');
  }
};

const languages = ref([
    { code: 'en', name: 'English', abbr: 'EN' },
    { code: 'zh', name: '简体中文', abbr: 'CN' },
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

const currentLanguageAbbr = computed(() => {
  return languages.value.find(lang => lang.code === locale.value)?.abbr || 'EN';
});

const changeLanguage = (langCode) => {
  locale.value = langCode;
  localStorage.setItem('user-language', langCode); 
};

defineProps({
  isScrolled: Boolean
});

// 【新增】在组件挂载时调用API获取菜单数据
onMounted(() => {
  fetchMenuCategories();
});
</script>

<style scoped>
/* 原有的样式大部分都可以保留 */
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
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
}
.app-header .logo {
  position: relative;
  width: var(--logo-width);
  height: var(--logo-height);
}
.logo img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  filter: brightness(0) invert(1);
  transition: filter 0.3s ease-in-out;
}
.app-header.scrolled .logo img,
.app-header:hover .logo img {
  filter: none;
}
.main-nav {
  /* margin-left: 20.1vw; */
  display: flex;
  align-items: center;
}

.main-nav a {
  display: inline-block;
  font-size: var(--font-size-nav);
  margin: 0 35px;
  text-decoration: none;
  color: var(--secondary-color);
  transition: color 0.3s ease, transform 0.2s ease;
}

.main-nav a:hover {
   transform: scale(1.1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 40px;
  /* margin-left: auto; */
}
.header-actions .el-icon {
  font-size: var(--icon-size);
  cursor: pointer;
  color: var(--secondary-color);
  transition: color 0.3s ease, transform 0.2s ease;
}
.header-actions .el-icon:hover {
  transform: scale(1.2);
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: var(--font-size-nav);
  font-weight: normal; 
  color: var(--secondary-color);
  transition: color 0.3s ease;
}

.lang:hover {
  transform: scale(1.1);
}

.cart-badge {
  position: relative; 
  display: flex;
  align-items: center;
}
.cart-badge :deep(.el-badge__content) {
  height: 10px;
  line-height: 6px;
  padding: 0;
  font-size: 10px;
  min-width: 10px;
  top: 0;
  right: 5px;
  transform: translateY(-60%) translateX(100%);
}

.app-header.scrolled .main-nav a,
.app-header.scrolled .header-actions .el-icon,
.app-header.scrolled .el-dropdown-link,
.app-header:hover .main-nav a,
.app-header:hover .header-actions .el-icon,
.app-header:hover .el-dropdown-link  {
  color: var(--text-color);
}

.nav-item-shop {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-size: var(--font-size-nav);
  margin: 0 35px;
  color: var(--secondary-color);
  transition: color 0.3s ease, transform 0.2s ease;
  background: none;
  border: none;
  padding: 0;
}

.app-header.scrolled .nav-item-shop,
.app-header:hover .nav-item-shop {
  color: var(--text-color);
}

.nav-item-shop:hover {
  transform: scale(1.1);
}

.el-dropdown-link .el-icon {
  margin-left: 5px;
}

.el-dropdown-link:focus,
.el-dropdown-link:focus-visible {
    outline: none;
}
</style>