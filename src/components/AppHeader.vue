<template>
  <header 
    class="app-header" 
    :class="{ 'scrolled': isScrolled }"
    @mouseleave="isMenuVisible = false"
  >
    <div class="header-container">
      <router-link to="/" class="logo">
        <img src="/images/logo.png" alt="PetsClan Logo">
      </router-link>
      
      <nav class="main-nav">
        <div 
          class="nav-item-shop"
          @mouseenter="openMenu()"            @mouseleave="closeMenuDelayed()"    
        >
          <a href="#" @click.prevent>{{ $t('header.shop') }}</a>
        </div>
        <router-link to="/about">{{ $t('header.about_us') }}</router-link>
        <router-link to="/app">{{ $t('header.app') }}</router-link>
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
    
    <MegaMenu 
      :visible="isMenuVisible"
      @close="isMenuVisible = false"          @mouseenter="clearCloseTimer()"
    />

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
import { ref, computed, defineAsyncComponent, inject } from 'vue'; // 【修改】重新引入 inject
import { useI18n } from 'vue-i18n';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia'; 
import MegaMenu from './MegaMenu.vue';
import ShoppingCartPanel from './ShoppingCartPanel.vue';
import { Menu } from '@element-plus/icons-vue'; // 導入 Menu 圖示

const SearchOverlay = defineAsyncComponent(() => 
  import('./SearchOverlay.vue')
);
const isMobileMenuOpen = ref(false); // 新增 state 來控制手機選單的顯示
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter(); 

// 【关键修改】确保 isLoggedIn 被正确解构，这里已经做对，保留。
const { isLoggedIn } = storeToRefs(authStore); 

// 【修复】重新引入 navigateTo 注入，因为它在 App.vue 中被提供，虽然在 AppHeader 内部使用 router.push 更好。
// 但为了避免其他地方的 break，暂时保留注入并安全使用。
const navigateTo = inject('navigateTo'); 

const handleUserIconClick = async () => {
  if (isLoggedIn.value) {
    try {
      // ▼▼▼ 【修改开始】 ▼▼▼
      // 只有在 authStore.userInfo 不存在时，才去请求用户信息
      if (!authStore.userInfo) {
        await authStore.fetchUserInfo();
      }
      // ▲▲▲ 【修改结束】 ▲▲▲
      router.push('/account');
    } catch (error) {
      console.error("Failed to fetch user info or navigate to account:", error);
      // 即使获取信息失败，也尝试跳转到账户页，让页面自己处理信息不存在的情况
      router.push('/account');
    }
  } else {
    router.push('/login');
  }
};

const isMenuVisible = ref(false);
let closeMenuTimer = null; // + 用于存储计时器 ID

// + 方法：立即打开菜单并清除任何关闭计时器
const openMenu = () => {
  clearTimeout(closeMenuTimer); // 清除可能正在进行的关闭计时器
  isMenuVisible.value = true;
};

// + 方法：延迟关闭菜单（给鼠标一个移动到菜单的时间）
const closeMenuDelayed = () => {
  closeMenuTimer = setTimeout(() => {
    isMenuVisible.value = false;
  }, 200); // 200毫秒延迟，您可以根据需要调整此值
};

// + 方法：清除关闭计时器（当鼠标再次进入触发区域或菜单区域时）
const clearCloseTimer = () => {
  clearTimeout(closeMenuTimer);
};

const isSearchVisible = ref(false);

const { locale } = useI18n();
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
  height: 100%;    /* 继承父级 70px 高度 */
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;    /* 垂直居中内容 */
  overflow: hidden; /* + 添加此行，裁剪任何超出容器高度的内容 */
}

/* --- Logo 智能切换样式 --- */

/* 1. 让logo的容器成为定位的基准 */
.app-header .logo { /* + 确保这里是 .app-header .logo，而不是直接 .logo img */
  position: relative; /* 保持相对定位 */
  width: var(--logo-width); /* 使用 vw 单位的宽度 */
  height: var(--logo-height); /* 使用 vw 单位的高度 */
}

/* 默认状态，使用滤镜将深色logo变为白色 */
.logo img {
  width: 100%;
  height: 100%;
  display: block; /* 使用 block 即可，不再需要 absolute 定位 */
  object-fit: contain; /* + 添加 object-fit: contain; 防止 Logo 变形 */
  filter: brightness(0) invert(1);    /* 意图：默认状态下将 Logo 变为白色 */
  transition: filter 0.3s ease-in-out; /* 让颜色变化有平滑的动画效果 */
}

/* 滚动或悬停时，移除滤镜，恢复原始深色 */
.app-header.scrolled .logo img,
.app-header:hover .logo img {
  filter: none;
}

/* 【修改】导航栏间距 */
/* 将 460px 转换为 vw，例如 460 / 19.2 = 23.95vw */
.main-nav {
  margin-left: 23.95vw; /* 调整：左侧外边距等比缩放 */
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
  margin: 0 35px;
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
    /* 加粗用bold */
  font-weight: normal;    
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
  position: relative; 
  display: flex;
  align-items: center;
}

/* 使用 :deep() 来修改 Element Plus 组件的内部样式 */
.cart-badge :deep(.el-badge__content) {
  /* 调整尺寸和字体 */
  height: 10px;       /* 缩小高度 */
  line-height: 6px;  /* 垂直对齐文字 */
  padding: 0 0px;     /* 调整水平内边距 */
  font-size: 10px;    /* 缩小字号 */
  min-width: 10px;    /* 确保单个数字时也是圆形 */

  /* 重新定位角标 */
  top: 0;             /* 移动到顶部 */
  right: 5px;         /* 向左移动一点 */
  transform: translateY(-60%) translateX(100%); /* 精细调整位置，使其位于图标右上角 */
}

/* ▼▼▼ 【新增/修改】手機版選單的樣式 ▼▼▼ */
.hamburger-menu {
  display: none; /* 預設 (桌面版) 隱藏 */
  cursor: pointer;
}

.hamburger-menu .el-icon {
  font-size: 24px; /* 調整漢堡圖示大小 */
}

/* 手機版彈出選單樣式 */
.mobile-nav {
  position: absolute;
  top: var(--header-height); /* 從 Header 下方開始 */
  left: 0;
  width: 100%;
  background-color: var(--secondary-color);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  border-top: 1px solid var(--border-color);
}

.mobile-nav a {
  padding: 15px 20px;
  font-size: 16px;
  color: var(--text-color);
  text-decoration: none;
  border-bottom: 1px solid var(--border-color);
}

.mobile-nav a:last-child {
  border-bottom: none;
}

.mobile-menu-fade-enter-active,
.mobile-menu-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.mobile-menu-fade-enter-from,
.mobile-menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 媒體查詢，控制電腦/手機版的顯示切換 */
@media (max-width: 767px) {
  .main-nav, .header-actions .el-dropdown-link {
    display: none; /* 在手機上隱藏電腦版導航和語言切換 */
  }

  .hamburger-menu {
    display: block; /* 在手機上顯示漢堡圖示 */
  }

  .header-container {
    padding: 0 15px;
    justify-content: space-between;
  }
  
  .header-actions {
    margin-left: 0;
    gap: 20px;
  }
}

</style>