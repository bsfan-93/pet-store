<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="links-section">
        <div v-for="column in footerColumns" :key="column.title" class="footer-column">
          <h4>{{ $t(column.title) }}</h4>
          <ul>
            <li v-for="link in column.links" :key="link.text">
              <a 
                href="#" @click.prevent="link.action ? link.action() : null" >
                {{ $t(link.text) }} </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="subscribe-section">
        <h4>{{ $t('footer.join_title') }}</h4>
        <form @submit.prevent="handleSubscribe" class="subscribe-form">
          <el-input 
            v-model="email" :placeholder="$t('footer.placeholder_email')" class="email-input" />
          <el-button native-type="submit" class="subscribe-btn">{{ $t('footer.signup_button') }}</el-button>
        </form>
      </div>
    </div>

    <div class="divider"></div>

    <div class="footer-bottom">
      <div class="social-icons">
        <a v-for="social in socialLinks" :key="social.name" :href="social.link" class="social-icon" target="_blank">
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
// 从我们自己封装的 api 文件中导入 subscribeMail 函数
import { subscribeMail } from '../api';

// 创建一个响应式变量 email，并初始化为空字符串
const email = ref('');
// 注入由 App.vue 提供的全局导航函数 navigateTo
const navigateTo = inject('navigateTo'); 

// 创建一个响应式数组 footerColumns，用于存储页脚链接的数据结构
const footerColumns = ref([
  {
    title: 'footer.about_title', // 列标题的 i18n 键
    links: [ // 该列下的链接数组
      { text: 'footer.links.about_us', action: () => navigateTo('about') }, // About Us 链接，点击时执行导航到 'about' 页面的操作
      { text: 'footer.links.privacy_policy', href: '#' }, // 隐私政策链接
      { text: 'footer.links.terms_of_service', href: '#' } // 服务条款链接
    ]
  },
  {
    title: 'footer.support_title',
    links: [
      { text: 'footer.links.faq', href: '#' },
      { text: 'footer.links.contact_us', href: '#' },
      { text: 'footer.links.app_service', href: '#' },
      { text: 'footer.links.user_manual', href: '#' },
      { text: 'footer.links.shipping_policy', href: '#' },
      { text: 'footer.links.warranty_policy', href: '#' }
    ]
  },
  {
    title: 'footer.works_title',
    links: [
      { text: 'footer.links.app', href: '#' }
    ]
  }
]);

// 创建一个响应式数组 socialLinks，用于存储社交媒体图标的数据
const socialLinks = ref([
  { name: 'facebook', src: '/images/icons/facebook.png', link: 'https://www.facebook.com/' },
  { name: 'instagram', src: '/images/icons/instagram.png', link: 'https://www.instagram.com/' },
  { name: 'tiktok', src: '/images/icons/tiktok.png', link: 'https://www.tiktok.com/' },
  { name: 'youtube', src: '/images/icons/youtube.png', link: 'https://www.youtube.com/' }
]);

// 定义处理邮件订阅的函数，它是一个异步函数 (async)
const handleSubscribe = async () => {
  // 检查 email 是否为空，或者格式是否不符合标准 email 格式
  if (!email.value || !/^\S+@\S+\.\S+$/.test(email.value)) {
    // 如果格式不正确，使用 ElMessage 显示错误提示
    ElMessage.error('Please enter a valid email address.');
    return; // 结束函数执行
  }
  try {
    // 调用 API 函数发送订阅请求，并等待其完成
    await subscribeMail(email.value);
    // 如果请求成功，显示成功提示
    ElMessage.success('Subscription successful! Thank you.');
    // 清空输入框
    email.value = '';
  } catch (error) {
    // 如果 API 请求失败 (例如网络错误或服务器返回错误)，则捕获错误
    // 显示 API 返回的错误信息，或者一个通用的失败提示
    ElMessage.error(error.message || 'An error occurred. Please try again later.');
  }
};
</script>

<style scoped>
/* 定义 .app-footer 类的样式 */
.app-footer {
  background-color: var(--text-color); /* 背景色使用 CSS 变量 */
  color: var(--secondary-color); /* 文字颜色使用 CSS 变量 */
  padding: 60px 9%; /* 上下内边距60px，左右内边距9% */
}

/* 页脚主容器样式 */
.footer-container {
  display: flex; /* 使用 Flexbox 布局 */
  flex-wrap: wrap; /* 允许子元素在空间不足时换行 */
  justify-content: space-between; /* 子元素之间平均分布空间 */
  gap: 210px; /* 子元素之间的间距为 40px */
}

/* 链接区域容器样式 */
.links-section {
  display: flex; /* 使用 Flexbox 布局 */
  gap: 10px; /* 链接列之间的间距 */
  flex-grow: 1; /* 允许此容器占据所有剩余空间 */
}

/* 单个链接列的样式 */
.footer-column {
  flex-basis: 1000px; /* 定义了在分配多余空间之前，元素的初始大小 */
}

/* 链接列标题的样式 */
.footer-column h4 {
  font-size: 14px; /* 字体大小 */
  font-weight: 600; /* 字体粗细 */
  margin-bottom: 34px; /* 下边距 */
  color: var(--secondary-color); /* 文字颜色 */
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
}

/* 鼠标悬停在链接上时的样式 */
.footer-column a:hover {
  color: var(--secondary-color); /* 鼠标悬停时文字颜色变为白色 */
}

/* 订阅区域容器样式 */
.subscribe-section {
  flex-basis: 450px; /* 初始大小 */
  flex-shrink: 0; /* 防止在空间不足时被压缩 */
}

/* 订阅区域标题样式 */
.subscribe-section h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
}

/* 订阅表单样式 */
.subscribe-form {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

/* 邮件输入框样式 */
.email-input {
  flex-grow: 1; /* 占据所有可用空间 */
}

/* :deep() 选择器用于修改子组件（这里是 Element Plus）的内部样式 */
:deep(.el-input__wrapper) {
  background-color: var(--secondary-color); /* 背景色 */
  border-radius: 4px; /* 圆角 */
  box-shadow: none !important; /* 强制移除阴影 */
}

/* 订阅按钮样式 */
.subscribe-btn {
  background-color: var(--primary-color) !important; /* 强制使用主题色背景 */
  color: var(--secondary-color) !important; /* 强制使用白色文字 */
  border: none !important; /* 强制移除边框 */
  font-weight: bold; /* 字体加粗 */
  border-radius: 24px !important; /* 强制设置圆角 */
}

/* 分割线样式 */
/* .divider { */
  /* border-top: 1px solid #333; 顶边框作为分割线 */
  /* margin: 20px 0; 上下外边距 */
/* } */

/* 页脚底部容器样式 */
.footer-bottom {
  display: flex;
  justify-content: space-between; /* 两端对齐 */
  align-items: flex-end; /* 底部对齐 */
}

/* 社交图标容器样式 */
.social-icons {
  display: flex;
  align-items: center; /* 垂直居中 */
  gap: 15px; /* 图标间距 */
}

/* 单个社交图标样式 */
.social-icon {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 25px; /* 宽度 */
  height: 25px; /* 高度 */
  border: 2px solid var(--secondary-color); /* 边框 */
  border-radius: 50%; /* 变为圆形 */
  transition: transform 0.2s ease; /* 为形变添加动画 */
}

/* 鼠标悬停在社交图标上时的样式 */
.social-icon:hover {
  transform: scale(1.1); /* 悬停时放大1.1倍 */
}

/* 社交图标内图片的样式 */
.social-icon img {
  width: 15px;
  height: 15px;
  transition: opacity 0.2s; /* 为透明度添加动画 */
}

/* App下载区域标题样式 */
.download-app h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 15px 0; /* 下边距15px */
  text-align: right; /* 文字右对齐 */
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
  display: inline-block; /* 使其可以设置边框和大小 */
  border: 1.8px solid var(--secondary-color); /* 边框 */
  border-radius: 6px;   /* 圆角 */
  line-height: 0;      /* 移除图片下方的多余空隙 */
  transition: transform 0.2s ease; /* 形变动画 */
}

/* 鼠标悬停在App商店链接上时的样式 */
.store-link:hover {
  transform: scale(1.05); /* 悬停时轻微放大 */
}
</style>