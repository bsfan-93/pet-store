<!-- 网站的通用页脚，包含链接和订阅表单，出现在每个页面的底部。 -->

<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="links-section">
        <div v-for="column in footerColumns" :key="column.title" class="footer-column">
          <ul>
            <li v-for="link in column.links" :key="link.text">
              <router-link :to="link.to">
                {{ t(link.text) }}
              </router-link>
              </li>
          </ul>
        </div>
      </div>

      <div class="subscribe-section">
          <h4>{{ t('footer.join_title') }}</h4>
        <form 
         v-if="!subscriptionStore.isSubscribed"
         @submit.prevent="handleSubscribe" 
         class="subscribe-form-new"
         >
          <el-input 
            v-model="email"
            :placeholder="t('footer.placeholder_email')" 
            class="email-input-new"
          >
            <template #suffix>
              <el-button 
                :icon="ArrowRightBold" 
                native-type="submit" 
                class="subscribe-button-inner"
                circle 
              />
            </template>
          </el-input>
          <div v-if="emailError" class="error-message">{{ emailError }}</div>
        </form>
        
        <div v-else class="subscribe-success-message">
          <el-icon class="success-icon"><Select /></el-icon>
          <span>You have been subscribed to <br>our newsletter.</span>
        </div>
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
        <h4>{{ t('footer.download_app_title') }}</h4>
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
import { useI18n } from 'vue-i18n';
import { ElInput, ElButton, ElMessage, ElIcon } from 'element-plus';
import { ArrowRightBold } from '@element-plus/icons-vue';
import { subscribeMail } from '../api';
import { useSubscriptionStore } from '../stores/subscription';

const { t } = useI18n();
const email = ref('');
const emailError = ref('');
// const isSubscribed = ref(false);

// ▼▼▼ 1. 脚本修改：获取 store 实例，并删除旧的 isSubscribed ▼▼▼
const subscriptionStore = useSubscriptionStore();

// ▼▼▼ MODIFIED THIS DATA STRUCTURE ▼▼▼
const footerColumns = ref([
  {
    title: 'footer.about_title',
    links: [ 
      { text: 'footer.links.about_us', to: '/about' },
      { text: 'footer.links.contact_us', to: '/contact' },
      { text: 'footer.links.order_tracking', to: '/order-tracking' },
    ]
  },
  {
    title: 'footer.support_title',
    links: [
      { text: 'footer.links.privacy_policy', to: '/Privacy-Policy' },
      { text: 'footer.links.shipping_policy', to: '/Shipping-Policy' },
      { text: 'footer.links.terms_of_service', to: '/terms-of-service' },
      { text: 'footer.links.warranty_policy', to: '/Warranty-Policy' },
      { text: 'footer.links.return_refund_policy', to: '/return-policy' }
    ]
  },
  {
    title: 'footer.works_title',
    links: [
            { text: 'footer.links.faq', to: '/faq' },
            { text: 'footer.links.app_service', to: '/app' },
            { text: 'footer.links.user_manual', to: '/user-manual' }
    ]
  }
]);
// ▲▲▲ END OF MODIFICATION ▲▲▲

const socialLinks = ref([
  { name: 'facebook', src: '/images/icons/facebook.png', link: 'https://www.facebook.com/' },
  { name: 'instagram', src: '/images/icons/instagram.png', link: 'https://www.instagram.com/' },
  { name: 'tiktok', src: '/images/icons/tiktok.png', link: 'https://www.tiktok.com/' },
  { name: 'youtube', src: '/images/icons/youtube.png', link: 'https://www.youtube.com/' }
]);

const handleSubscribe = async () => {
  emailError.value = ''; 
  if (!email.value || !/^\S+@\S+\.\S+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email address.';
    return;
  }
  try {
    await subscribeMail(email.value);
    ElMessage.success('Subscription successful! Thank you.');
    email.value = '';
    // ▼▼▼ 3. 脚本修改：成功后不再弹出提示，而是改变状态 ▼▼▼
    //     isSubscribed.value = true;
    // ▼▼▼ 3. 脚本修改：订阅成功后，同样调用 store 的 action ▼▼▼
    subscriptionStore.subscribe();
  } catch (error) {
    ElMessage.error(error.message || 'An error occurred. Please try again later.');
  }
};
</script>

<style scoped>
/* 1. PC端样式 (1200px 以上) - 使用固定的 PX 值，确保在大屏/缩放时不乱跑 */
.app-footer {
  background-color: #000;
  color: #fff;
  padding: 60px 9%; /* 固定 padding */
}

.footer-container {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  gap: 40px; /* 固定间距 */
}

.links-section {
  display: flex;
  gap: 120px; /* 固定间距 */
  flex-grow: 1;
}

.footer-column h4 {
  font-size: 14px; /* 固定字体 */
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
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 30px;
  transition: color 0.2s;
  white-space: nowrap;
}

.footer-column a:hover {
  color: #fff;
}

.subscribe-section {
  flex-basis: 400px;
  flex-shrink: 0;
}

.subscribe-section h4 {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 36px;
  margin-top: -20px;
}

.subscribe-form-new {
  position: relative;
}

.subscribe-form-new :deep(.el-input__wrapper) {
 background-color: #fff;
 border-radius: 10px;
 box-shadow: none !important;
 padding-left: 20px;
 padding-right: 5px; 
 height: 52px; /* 固定高度 */
}
.subscribe-form-new :deep(.el-input__suffix) {
 margin-right: 8px; 
}
.subscribe-form-new :deep(.subscribe-button-inner.el-button.is-circle) {
 background-color: #92C45C; 
 color: #000;
 border: none;
 width: 80px;
 height: 40px;
 border-radius: 8px;
}
.subscribe-form-new :deep(.subscribe-button-inner.el-button.is-circle:hover) {
 background-color: #92C45C;
}

.footer-bottom {
  border-top: 1px solid #333;
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
  transition: transform 0.2s;
}

.social-icon img {
  width: 15px;
  height: 15px;
}

.download-app h4 {
  font-size: 14px;
  margin-bottom: 15px;
  text-align: right;
}

.store-buttons {
  display: flex;
  gap: 15px;
}

.store-buttons img {
  height: 30px;
}

.subscribe-success-message {
  display: flex;
  align-items: center;
  padding: 40px 20px;
  border: 1px solid #92C45C;
  border-radius: 10px;
  color: #fff;
  height: 52px;
  box-sizing: border-box;
  font-size: 16px;
}

.subscribe-success-message .success-icon {
 background-color: #92C45C; 
 border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
 color: #fff;
 font-size: 16px;
 margin-right: 40px;
  flex-shrink: 0;
}

.subscribe-success-message span {
 font-size: 16px;
  line-height: 1.6;
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

/* 2. 平板端适配 (覆盖PC样式) */
@media (max-width: 1199px) {
  .footer-container {
    flex-direction: column;
    gap: 40px;
  }
  .links-section {
    gap: 60px;
    justify-content: space-between;
  }
  .footer-bottom {
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }
  .download-app h4 {
    text-align: center;
  }
}

/* 3. 手机端适配 (覆盖平板样式) */
@media (max-width: 767px) {
  .app-footer {
    padding: 40px 20px;
  }
  .links-section {
    flex-direction: column;
    gap: 30px;
  }
  .subscribe-section h4 {
    font-size: 24px;
  }
  .footer-column a {
    margin-bottom: 20px;
  }
}
</style>