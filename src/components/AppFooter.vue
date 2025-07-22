<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="links-section">
        <div v-for="column in footerColumns" :key="column.title" class="footer-column">
          <h4>{{ t(column.title) }}</h4>
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
        <form @submit.prevent="handleSubscribe" class="subscribe-form-new">
          <el-input 
            v-model="email"
            :placeholder="t('footer.placeholder_email')" 
            class="email-input-new"
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
import { ElInput, ElButton, ElMessage } from 'element-plus';
import { ArrowRightBold } from '@element-plus/icons-vue';
import { subscribeMail } from '../api';

const { t } = useI18n();
const email = ref('');
const emailError = ref('');

// ▼▼▼ MODIFIED THIS DATA STRUCTURE ▼▼▼
const footerColumns = ref([
  {
    title: 'footer.about_title',
    links: [ 
      { text: 'footer.links.about_us', to: '/about' },
      { text: 'footer.links.blog', to: '/placeholder/Blog' },
      { text: 'footer.links.privacy_policy', to: '/placeholder/Privacy-Policy' },
      { text: 'footer.links.terms_of_service', to: '/placeholder/Terms-of-Service' }
    ]
  },
  {
    title: 'footer.support_title',
    links: [
      { text: 'footer.links.faq', to: '/faq' },
      { text: 'footer.links.contact_us', to: '/contact' },
      { text: 'footer.links.order_tracking', to: '/order-tracking' },
      { text: 'footer.links.app_service', to: '/app' },
      { text: 'footer.links.user_manual', to: '/placeholder/User-Manual' },
      { text: 'footer.links.shipping_policy', to: '/placeholder/Shipping-Policy' },
      { text: 'footer.links.warranty_policy', to: '/placeholder/Warranty-Policy' },
      { text: 'footer.links.price_match_policy', to: '/placeholder/Price-Match-Policy' },
      { text: 'footer.links.return_refund_policy', to: '/return-policy' }
    ]
  },
  {
    title: 'footer.works_title',
    links: [
      { text: 'footer.links.user_manual', to: '/placeholder/User-Manual' }
    ]
  }
]);
// ▲▲▲ END OF MODIFICATION ▲▲▲

const socialLinks = ref([
  { name: 'facebook', src: '/images/icons/facebook.png', link: 'https://www.facebook.com/' },
  { name: 'instagram', src: '/images/icons/instagram.png', link: 'https://www.instagram.com/' },
  { name: 'pinterest', src: '/images/pinterest.png', link: 'https://www.pinterest.com/' },
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
  } catch (error) {
    ElMessage.error(error.message || 'An error occurred. Please try again later.');
  }
};
</script>

<style scoped>
/* Your styles are correct and do not need to be changed */
.app-footer {
  background-color: #000;
  color: #fff;
  padding: 60px 9%;
}
.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
}
.links-section {
  display: flex;
  gap: 160px;
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
  padding-top: 5px;
  text-align: left;
  position: absolute;
  bottom: 0px;
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
</style>