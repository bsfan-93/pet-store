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
                {{ $t(link.text) }}
              </a>
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
            @input="clearError"
          >
            <template #append>
              <el-button :icon="ArrowRightBold" native-type="submit" />
            </template>
          </el-input>
          <div v-if="emailError" class="error-message">{{ emailError }}</div>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 
import { ElInput, ElButton, ElMessage } from 'element-plus';
import { ArrowRightBold } from '@element-plus/icons-vue';
import { subscribeMail } from '../api';

const router = useRouter(); 
const email = ref('');
const emailError = ref('');

// 【修复】确保所有 action 都使用 router.push
const footerColumns = ref([
  {
    title: 'footer.about_title',
    links: [ 
      { text: 'footer.links.about_us', action: () => router.push('/about') },
      { text: 'footer.links.blog', href: '#' },
      { text: 'footer.links.privacy_policy', href: '#' },
      { text: 'footer.links.terms_of_service', href: '#' }
    ]
  },
  {
    title: 'footer.support_title',
    links: [
      { text: 'footer.links.faq', action: () => router.push('/faq') },
      { text: 'footer.links.contact_us', action: () => router.push('/contact') },
      { text: 'footer.links.order_tracking', action: () => router.push('/tracking') },
      { text: 'footer.links.app_service', action: () => router.push('/app') },
      { text: 'footer.links.user_manual', href: '#' },
      { text: 'footer.links.shipping_policy', href: '#' },
      { text: 'footer.links.warranty_policy', href: '#' },
      { text: 'footer.links.price_match_policy', href: '#' },
      { text: 'footer.links.return_refund_policy', action: () => router.push('/return-policy') }
    ]
  },
  {
    title: 'footer.works_title',
    links: [
      { text: 'footer.links.user_manual', href: '#' }
    ]
  }
]);

const socialLinks = ref([
  { name: 'facebook', src: '/images/icons/facebook.png', link: 'https://www.facebook.com/' },
  { name: 'instagram', src: '/images/icons/instagram.png', link: 'https://www.instagram.com/' },
  { name: 'pinterest', src: '/images/pinterest.png', link: 'https://www.pinterest.com/' },
  { name: 'tiktok', src: '/images/icons/tiktok.png', link: 'https://www.tiktok.com/' },
  { name: 'youtube', src: '/images/icons/youtube.png', link: 'https://www.youtube.com/' }
]);

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
/* 您的样式无需改动 */
.app-footer {
  background-color: #000;
  color: #fff;
  padding: 60px 9%;
}
.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px; /* 减小gap以适应更多内容 */
}
.links-section {
  display: flex;
  gap: 160px; /* 减小gap */
  flex-grow: 1;
}
.footer-column h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 36px;
  color: #fff;
  white-space: nowrap;
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
  white-space: nowrap;
}
.footer-column a:hover {
  color: #fff;
}
.subscribe-section {
  flex-basis: 400px; /* 减小宽度 */
  flex-shrink: 0;
}
.subscribe-section h4 {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 36px;
  margin-top: -20px; /* 新增此行来调整上间距，可自行修改数值 */
}
.subscribe-form-new {
  position: relative;
  padding-bottom: 20px;
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
.error-message {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding: 4px 0 0 15px;
  position: absolute;
  top: 48px;
  left: 0;
}
.footer-bottom {
  border-top: 1px solid #000;
  padding-top: 40px;
  margin-top: 40px;
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
  border: 2px solid #fff;
  border-radius: 50%;
  transition: transform 0.2s ease;
}
.social-icon:hover {
  transform: scale(1.1);
}
.social-icon img {
  width: 15px;
  height: 15px;
}
img[src*="pinterest.png"] {
  filter: invert(1);
}
.social-icon--pinterest img {
  width: 30px; 
  height: 30px;
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
  display: inline-block;
  border: 1.8px solid #fff;
  border-radius: 6px;
  line-height: 0;
  transition: transform 0.2s ease;
}
.store-link:hover {
  transform: scale(1.05);
}

/* ▼▼▼ 【新增】错误信息的样式 ▼▼▼ */
.error-message {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 5px; /* 与输入框的间距 */
  text-align: left;  /* 确保文字左对齐 */
  position: absolute;  /* 使用绝对定位，不影响其他元素布局 */
  bottom: 0px;       /* 定位在表单底部 */
}
</style>