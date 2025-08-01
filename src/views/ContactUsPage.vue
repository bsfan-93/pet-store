<template>
  <div class="contact-us-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="contact-us-container">
        <h1>{{ t('contact_us.title') }}</h1>
        
        <div class="info-text">
          <p>{{ t('contact_us.p1') }}</p>
          <p v-html="t('contact_us.p2', { email: '15380822206@163.com' })"></p>
          <p v-html="t('contact_us.p3', { phone: '(86)15380822206', hours: '9:00am-12:00pm & 1:00pm-18:00pm Mon.-Sun.' })"></p>
        </div>

        <div class="retail-service">
          <h2>{{ t('contact_us.retail_service_title') }}</h2>
          <p>{{ t('contact_us.retail_service_p') }}</p>
        </div>

        <div class="form-section">
          <h2>{{ t('contact_us.form_title') }}</h2>
          <div class="form-box">
            <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              @submit.prevent="sendMessage(formRef)"
            >
              <el-form-item prop="email">
                <el-input 
                  v-model="form.email" 
                  :placeholder="t('contact_us.email_placeholder')" 
                  size="large">
                </el-input>
              </el-form-item>
              <el-form-item prop="message">
                <el-input
                  v-model="form.message"
                  type="textarea"
                  :rows="6"
                  :placeholder="t('contact_us.message_placeholder')"
                  size="large"
                ></el-input>
              </el-form-item>
              <el-button 
                native-type="submit" 
                class="send-button" 
                size="large"
                :loading="isLoading"
              >
                {{ t('contact_us.send_button') }}
              </el-button>
            </el-form>
            </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n'; // 1. 引入 useI18n
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import { sendContactMessage } from '../api'; 

const { t } = useI18n(); // 2. 获取 t 函数

// ▼▼▼ 3. 更新 script 邏輯 ▼▼▼
const formRef = ref(null);
const isLoading = ref(false);
const form = reactive({
  email: '',
  message: ''
});

// 新增表單驗證規則
const rules = reactive({
  email: [
    { required: true, message: 'Please enter your email address', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: ['blur', 'change'] }
  ],
  message: [
    { required: true, message: 'Please enter your message', trigger: 'blur' }
  ]
});

// 更新發送消息的函數
const sendMessage = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      isLoading.value = true;
      try {
        await sendContactMessage(form.email, form.message);
        ElMessage.success('Your message has been sent successfully!');
        // 清空表單
        form.email = '';
        form.message = '';
      } catch (error) {
        ElMessage.error(error.message || 'Failed to send message. Please try again.');
      } finally {
        isLoading.value = false;
      }
    }
  });
};
</script>

<style scoped>
.contact-us-page {
  background-color: #fff;
}
.header-wrapper {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}
.header-wrapper :deep(.main-nav a),
.header-wrapper :deep(.header-actions .el-icon),
.header-wrapper :deep(.el-dropdown-link),
.header-wrapper :deep(.logo img) {
  color: var(--text-color);
  filter: none;
}

.main-content {
  padding: 40px 20px;
}

.contact-us-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  font-family: 'Outfit', sans-serif;
  color: #555;
  /* 【关键修改】将文本对齐方式从 center 改为 left */
  text-align: left; 
}

h1 {
  font-size: 32px;
  font-weight: 600;
  color: #000;
  margin-bottom: 40px;
  /* 【关键修改】将大标题居中对齐 */
  text-align: center;
  word-spacing: 10px; /* <-- 新增這一行來加大單詞間距 */
}

.info-text {
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 60px;
}
.info-text p {
  margin: 0 0 1em 0;
}

.retail-service {
  margin-bottom: 60px;
}

.retail-service h2 {
  font-size: 24px;
  font-weight: 600;
  color: #000;
  margin-bottom: 20px;
}
.retail-service p {
  font-size: 14px;
  line-height: 1.8;
}

.form-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: #000;
  margin-bottom: 20px;
}

.form-box {
  background-color: #f7f7f7;
  padding: 40px;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
}

.form-box form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-box :deep(.el-input__wrapper),
.form-box :deep(.el-textarea__inner) {
  box-shadow: none !important;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-box :deep(.el-input__wrapper) {
  height: 50px;
}

.send-button {
  background-color: #7CB342; /* 蓝色按钮 */
  color: #fff;
  border-radius: 35px;
  height: 50px;
  border: none;
  font-weight: 500;
  width: 70%;
  align-self: center;
}
.send-button:hover {
  background-color: #7CB342;
}

/* ▼▼▼ 【新增】針對手機的響應式樣式 ▼▼▼ */
@media (max-width: 767px) {
    .main-content {
        padding: 40px 20px;
    }

    h1 {
        font-size: 28px;
        word-spacing: 0; /* 手機上移除單字間距 */
    }

    .form-box {
        padding: 20px; /* 縮小表單容器的內邊距 */
    }
}
</style>