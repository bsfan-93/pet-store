<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="links-section">
        <div v-for="column in footerColumns" :key="column.title" class="footer-column">
          <h4>{{ $t(column.title) }}</h4>
          <ul>
            <li v-for="link in column.links" :key="link.text">
              <a :href="link.href">{{ $t(link.text) }}</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="subscribe-section">
        <h4>{{ $t('footer.join_title') }}</h4>
        <form @submit.prevent="handleSubscribe" class="subscribe-form">
          <el-input 
            v-model="email"
            :placeholder="$t('footer.placeholder_email')" 
            class="email-input"
          />
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
import { ref } from 'vue';
import { ElInput, ElButton, ElMessage } from 'element-plus';
import { subscribeMail } from '../api';

const email = ref('');

// 页脚链接数据
const footerColumns = ref([
  {
    title: 'footer.about_title',
    links: [
      { text: 'footer.links.about_us', href: '#' },
      { text: 'footer.links.privacy_policy', href: '#' },
      { text: 'footer.links.terms_of_service', href: '#' }
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

// 社交图标数据
const socialLinks = ref([
  { name: 'facebook', src: '/images/icons/facebook.png', link: '#' },
  { name: 'instagram', src: '/images/icons/instagram.png', link: '#' },
  { name: 'tiktok', src: '/images/icons/tiktok.png', link: '#' },
  { name: 'youtube', src: '/images/icons/youtube.png', link: '#' }
]);

// 邮件订阅提交函数
const handleSubscribe = async () => {
  if (!email.value || !/^\S+@\S+\.\S+$/.test(email.value)) {
    ElMessage.error('Please enter a valid email address.');
    return;
  }
  try {
    // API模块已处理了请求细节和成功/失败的判断
    await subscribeMail(email.value);
    ElMessage.success('Subscription successful! Thank you.');
    email.value = '';
  } catch (error) {
    // API模块会抛出错误，我们在这里捕获并显示给用户
    ElMessage.error(error.message || 'An error occurred. Please try again later.');
  }
};
</script>

<style scoped>
.app-footer {
  background-color: var(--text-color);
  color: var(--secondary-color);
  padding: 60px 5%;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 40px;
}

.links-section {
  display: flex;
  gap: 60px; /* 链接栏之间的距离 */
  flex-grow: 1;
}

.footer-column {
  flex-basis: 1000px;
}

.footer-column h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--secondary-color);
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column a {
  display: block;
  color: #888;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 16px;
  transition: color 0.2s;
}
.footer-column a:hover {
  color: var(--secondary-color);
}

.subscribe-section {
  flex-basis: 550px;
  flex-shrink: 0;
}
.subscribe-section h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
}

.subscribe-form {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
.email-input {
  flex-grow: 1;
}
:deep(.el-input__wrapper) {
  background-color: var(--secondary-color);
  border-radius: 4px;
  box-shadow: none !important;
}
.subscribe-btn {
  background-color: var(--primary-color) !important;
  color: var(--secondary-color) !important;
  border: none !important;
  font-weight: bold;
  border-radius: 4px !important;
}

.divider {
  border-top: 1px solid #333;
  margin: 20px 0;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.social-icons {
  display: flex;
  align-items: center;
  gap: 15px;
}
.social-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  border: 2px solid var(--secondary-color);
  border-radius: 50%;
  transition: transform 0.2s ease;
}
.social-icon:hover {
  transform: scale(1.1); /* 悬停时放大1.1倍 */
}
.social-icon img {
  width: 15px;
  height: 15px;
  transition: opacity 0.2s;
}


.download-app h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 15px 0;
  text-align: right;
}
.store-buttons {
  display: flex;
  gap: 15px;
}
.store-buttons img {
  height: 30px;
}

.store-link {
  display: inline-block; /* 让边框生效 */
  border: 1.8px solid var(--secondary-color);
  border-radius: 6px;    /* 6像素的圆角 */
  line-height: 0;        /* 移除图片下方的多余空隙 */
  transition: transform 0.2s ease;
}
.store-link:hover {
  transform: scale(1.05); /* 放大效果可以稍微小一点，更精致 */
}
</style>