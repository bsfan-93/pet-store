<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="links-section">
        <div v-for="column in footerColumns" :key="column.title" class="footer-column">
          <h4>{{ $t(column.title) }}</h4>
          <ul>
            <li v-for="link in column.links" :key="link.text">
              <a 
                :href="link.href || '#'" 
                @click.prevent="link.action ? link.action() : null"
              >
                {{ $t(link.text) }} </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="subscribe-section">
        <h4>{{ $t('footer.join_title') }}</h4>
        <form @submit.prevent="handleSubscribe" class="subscribe-form-new">
          <el-input 
            v-model="email"
            :placeholder="$t('footer.placeholder_email')" 
            class="email-input-new"
          >
            <template #append>
              <el-button :icon="ArrowRightBold" native-type="submit" />
            </template>
          </el-input>
        </form>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="social-icons">
        <a 
          v-for="social in socialLinks" 
          :key="social.name" 
          :href="social.link" 
          :class="['social-icon', `social-icon--${social.name}`]" 
          target="_blank"
        >
          <img :src="social.src" :alt="social.name">
        </a>
      </div>
      <div class="download-app">
        <h4>{{ $t('footer.download_app_title') }}</h4>
        <div class="store-buttons">
          <a href="#" class="store-link"><img src="/images/app-store.png" alt="Download on the App Store"></a>
          <a href="#" class="store-link"><img src="/images/google-play.png" alt="Get it on Google Play"></a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// 从 vue 中导入 ref (用于创建响应式变量) 和 inject (用于注入上层组件提供的数据)
import { ref, inject } from 'vue';
// 从 element-plus 中导入需要的组件
import { ElInput, ElButton, ElMessage } from 'element-plus';
// 从 Element Plus 的图标库中导入需要的图标
import { ArrowRightBold } from '@element-plus/icons-vue';
// 从我们自己封装的 api 文件中导入 subscribeMail 函数
import { subscribeMail } from '../api';

// 创建一个响应式变量 email，并初始化为空字符串
const email = ref('');
// 注入由 App.vue 提供的全局导航函数 navigateTo
const navigateTo = inject('navigateTo'); 
const emailError = ref('');

// 创建一个响应式数组 footerColumns，用于存储页脚链接的数据结构
const footerColumns = ref([
  {
    title: 'footer.about_title', // 列标题的 i18n 键
    links: [ // 该列下的链接数组
      { text: 'footer.links.about_us', action: () => navigateTo('about') }, // About Us 链接，点击时执行导航到 'about' 页面的操作
      { text: 'footer.links.blog', href: '#' },
      { text: 'footer.links.privacy_policy', href: '#' }, // 隐私政策链接
      { text: 'footer.links.terms_of_service', href: '#' } // 服务条款链接
    ]
  },
  {
    title: 'footer.support_title',
    links: [
      { text: 'footer.links.faq', action: () => navigateTo('faq') }, // 修改
      { text: 'footer.links.contact_us', href: '#' },
      { text: 'footer.links.app_service', href: '#' },
      { text: 'footer.links.user_manual', href: '#' },
      { text: 'footer.links.shipping_policy', href: '#' },
      { text: 'footer.links.warranty_policy', href: '#' },
      { text: 'footer.links.price_match_policy', href: '#' },
      { text: 'footer.links.return_refund_policy', href: '#' }
    ]
  },
  {
    title: 'footer.works_title',
    links: [
      { text: 'footer.links.user_manual', href: '#' }
    ]
  }
]);

// 创建一个响应式数组 socialLinks，用于存储社交媒体图标的数据
const socialLinks = ref([
  { name: 'facebook', src: '/images/icons/facebook.png', link: 'https://www.facebook.com/' },
  { name: 'instagram', src: '/images/icons/instagram.png', link: 'https://www.instagram.com/' },
  { name: 'pinterest', src: '/images/pinterest.png', link: 'https://www.pinterest.com/' },
  { name: 'tiktok', src: '/images/icons/tiktok.png', link: 'https://www.tiktok.com/' },
  { name: 'youtube', src: '/images/icons/youtube.png', link: 'https://www.youtube.com/' }
]);

// 【新增】当用户输入时，清除错误提示
const clearError = () => {
  if (emailError.value) {
    emailError.value = '';
  }
}

// 【修改】处理订阅逻辑
const handleSubscribe = async () => {
  // 提交前先清空之前的错误
  emailError.value = ''; 

if (!email.value || !/^\S+@\S+\.\S+$/.test(email.value)) {
    // 【修改】不再使用 ElMessage，而是设置本地错误状态
    emailError.value = 'Please enter a valid email address.';
    return;
  }
  try {
    await subscribeMail(email.value);
    ElMessage.success('Subscription successful! Thank you.');
    email.value = '';
  } catch (error) {
    ElMessage.error(error.message || 'An error occurred. Please try again later.');
  }
};
</script>

<style scoped>
/* 定义 .app-footer 类的样式 */
.app-footer {
  background-color: #000; /* 背景色设置为黑色 */
  color: #fff; /* 文字颜色设置为白色 */
  padding: 60px 9%; /* 上下内边距60px，左右内边距5% */
}

/* 页脚主容器样式 */
.footer-container {
  display: flex; /* 使用 Flexbox 布局 */
  flex-wrap: wrap; /* 允许子元素在空间不足时换行 */
  justify-content: space-between; /* 子元素之间平均分布空间 */
  gap: 400px; /* 子元素之间的间距为 40px */
}

/* 链接区域容器样式 */
.links-section {
  display: flex; /* 使用 Flexbox 布局 */
  gap: 170px; /* 链接列之间的间距 */
  flex-grow: 1; /* 允许此容器占据所有剩余空间 */
  /* flex-basis: 500px; 给一个更合理的初始宽度 */
}

/* 单个链接列的样式 */
.footer-column {
  /* flex-basis: 100px; 定义了在分配多余空间之前，元素的初始大小 */
}

/* 链接列标题的样式 */
.footer-column h4 {
  font-size: 14px; /* 字体大小 */
  font-weight: 600; /* 字体粗细 */
  margin-bottom: 26px; /* 下边距 */
  color: #fff; /* 文字颜色 */
  white-space: nowrap; /* 防止标题换行 */
}

/* 链接列表的样式 */
.footer-column ul {
  list-style: none; /* 移除默认的列表项目符号（如小黑点） */
  padding: 0; /* 移除内边距 */
  margin: 0; /* 移除外边距 */
}

/* 链接本身的样式 */
.footer-column a {
  display: block; /* 将链接变为块级元素，使其可以占据整行 */
  color: #888; /* 链接文字颜色 */
  text-decoration: none; /* 移除下划线 */
  font-size: 14px; /* 字体大小 */
  margin-bottom: 16px; /* 下边距 */
  transition: color 0.2s; /* 为颜色变化添加 0.2 秒的过渡动画 */
  white-space: nowrap; /* 防止链接文字换行 */
}

/* 鼠标悬停在链接上时的样式 */
.footer-column a:hover {
  color: #fff; /* 鼠标悬停时文字颜色变为白色 */
}

/* 订阅区域容器样式 */
.subscribe-section {
  flex-basis: 350px; /* 初始大小 */
  flex-shrink: 0; /* 防止在空间不足时被压缩 */
}

/* 订阅区域标题样式 */
.subscribe-section h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 26px;
}

/* ▼▼▼ 【修改】订阅表单的样式 ▼▼▼ */
.subscribe-form-new {
  position: relative; /* 为错误信息定位提供基准 */
  padding-bottom: 20px; /* 为错误信息预留空间 */
}
.subscribe-form-new :deep(.el-input__wrapper) {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: none !important;
  padding-left: 20px;
  height: 48px;
}
.subscribe-form-new :deep(.el-input-group__append) {
  background: transparent;
  box-shadow: none;
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
}
.subscribe-form-new :deep(.el-input-group__append .el-button) {
  background-color: #f0f0f0;
  color: #333;
  border-radius: 50%;
  padding: 8px;
  width: 36px;
  height: 36px;
  border: none;
}
.subscribe-form-new :deep(.el-input-group__append .el-button:hover) {
    background-color: #e0e0e0;
}

/* ▼▼▼ 【新增】错误信息的样式 ▼▼▼ */
.error-message {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding: 4px 0 0 15px; /* 增加左内边距，使其与输入框文字对齐 */
  position: absolute;
  top: 48px; /* 定位到输入框下方 */
  left: 0;
}

.footer-bottom {
  border-top: 1px solid #333;
  padding-top: 40px;
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

/* 社交图标容器样式 */
.social-icons {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 单个社交图标样式 */
.social-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  border: 2px solid #fff;
  border-radius: 50%;
  transition: transform 0.2s ease;
}

/* 鼠标悬停在社交图标上时的样式 */
.social-icon:hover {
  transform: scale(1.1);
}

/* 社交图标内图片的样式 */
.social-icon img {
  width: 15px;
  height: 15px;
}

/* ▼▼▼ 【最终修正】使用属性选择器，直接反转 pinterest.png 的颜色 ▼▼▼ */
img[src*="pinterest.png"] {
  filter: invert(1);
}

/* ▼▼▼ 【新增】单独为 Pinterest 图标设置样式 ▼▼▼ */
.social-icon--pinterest img {
  /* 2. 单独调整大小 (您可以自由修改这里的数值) */
  width: 30px; 
  height: 30px;
}

/* App下载区域标题样式 */
.download-app h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 15px 0;
  text-align: right;
}

/* App商店按钮容器样式 */
.store-buttons {
  display: flex;
  gap: 15px;
}

/* App商店图片样式 */
.store-buttons img {
  height: 30px;
}

/* App商店链接样式 */
.store-link {
  display: inline-block;
  border: 1.8px solid #fff;
  border-radius: 6px;
  line-height: 0;
  transition: transform 0.2s ease;
}

/* 鼠标悬停在App商店链接上时的样式 */
.store-link:hover {
  transform: scale(1.05);
}
</style>