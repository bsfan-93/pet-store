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
/* 最終方案：使用 clamp() 實現有上下限的、嚴格的等比縮放 */
.app-footer {
  background-color: #000;
  color: #fff;
  /* padding: 90px -> clamp(最小, 理想, 最大) */
  padding: 60px 9%;
}

.footer-container {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  /* 為了穩定佈局，這裡使用一個相對較固定的間距 */
  gap: clamp(20px, 2vw, 40px);
}

.links-section {
  display: flex;
  /* gap: 160px */
  gap: clamp(40px, 8.33vw, 160px);
  flex-grow: 1;
}

.footer-column h4 {
  /* font-size: 14px */
  font-size: clamp(12px, 0.73vw, 14px);
  font-weight: 600;
  margin-bottom: clamp(18px, 1.875vw, 36px);
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
  font-size: clamp(12px, 0.73vw, 14px); /* font-size: 14px */
  margin-bottom: clamp(12px, 1.5vw, 30px);
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
  /* font-size: 36px */
  font-size: clamp(24px, 1.875vw, 36px);
  font-weight: 600;
  margin-bottom: clamp(18px, 1.875vw, 36px);
  margin-top: clamp(-20px, -1.04vw, -20px);
}

.subscribe-form-new {
  position: relative;
}

/* ▼▼▼ 这是修正后的样式，确保能正确应用 ▼▼▼ */
.subscribe-form-new :deep(.el-input__wrapper) {
 background-color: #fff;
 border-radius: 10px;
 box-shadow: none !important;
 padding-left: clamp(15px, 1.04vw, 20px);
 padding-right: 5px; 
 height: clamp(44px, 2.7vw, 52px);
}
.subscribe-form-new :deep(.el-input__suffix) {
 margin-right: 8px; 
}
.subscribe-form-new :deep(.subscribe-button-inner.el-button.is-circle) {
  /* 匹配图片中的淡绿色背景 */
 background-color: #92C45C; 
  /* 匹配图片中的深色箭头 */
 color: #000;
 border: none;
 width: 80px;
 height: 40px;
  /* 匹配图片中的圆角矩形 */
  border-radius: 8px;
}
.subscribe-form-new :deep(.subscribe-button-inner.el-button.is-circle:hover) {
 background-color: #92C45C;
}
/* ▲▲▲ 修正结束 ▲▲▲ */

.footer-bottom {
  border-top: 1px solid #000;
  padding-top: clamp(30px, 2.08vw, 40px);
  margin-top: clamp(30px, 2.08vw, 40px);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.social-icons {
  display: flex;
  align-items: center;
  gap: clamp(12px, 0.78vw, 15px);
}

.social-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: clamp(22px, 1.3vw, 25px);
  height: clamp(22px, 1.3vw, 25px);
  border: 2px solid #fff;
  border-radius: 50%;
  transition: transform 0.2s;
}

.social-icon img {
  width: clamp(12px, 0.78vw, 15px);
  height: clamp(12px, 0.78vw, 15px);
}

.download-app h4 {
  font-size: clamp(12px, 0.73vw, 14px);
  margin-bottom: clamp(12px, 0.78vw, 15px);
  text-align: right;
}

.store-buttons {
  display: flex;
  gap: 15px;
}

.store-buttons img {
  height: clamp(28px, 1.56vw, 30px);
}

/* ▼▼▼ 4. 样式修改：为成功提示框添加样式 ▼▼▼ */
.subscribe-success-message {
  display: flex;
  align-items: center;
  padding: 40px 20px;
  border: 1px solid #92C45C; /* 绿色边框 */
  border-radius: 10px;
  color: #fff;
  /* 让它的高度和输入框保持一致 */
  height: clamp(44px, 2.7vw, 52px); 
  box-sizing: border-box;
  font-size: 16px;
}

/* 2. 图标样式（核心修改） */
.subscribe-success-message .success-icon {
  /* 用背景色和圆角制作圆形背景 */
 background-color: #92C45C; 
 border-radius: 50%;
  
  /* 控制圆形的大小 */
  width: 24px;
  height: 24px;

  /* 让内部的对勾居中 */
  display: flex;
  justify-content: center;
  align-items: center;

  /* 控制对勾本身的颜色和大小 */
 color: #fff; /* 白色对勾 */
 font-size: 16px;

  /* 与文字的间距 */
 margin-right: 40px;
  flex-shrink: 0; /* 防止图标被压缩 */
}

/* 3. 文字样式 */
.subscribe-success-message span {
 font-size: 16px;
  line-height: 1.6; /* 改善换行后的行间距 */
}


.store-link {
  display: inline-block;
  border: 1.8px solid #fff; /* <-- 控制白色邊框的關鍵 */
  border-radius: 6px;      /* 這是圓角 */
  line-height: 0;          /* 確保邊框能緊貼圖片 */
  transition: transform 0.2s ease;
}

.store-link:hover {
  transform: scale(1.05);
}
</style>