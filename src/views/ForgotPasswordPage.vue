<template>
  <div class="forgot-password-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="form-box">
        <h1>{{ t('forgot_password.title') }}</h1>
        <p class="subtitle">{{ t('forgot_password.subtitle') }}</p>
        
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          @submit.prevent="submitForm(formRef)"
          hide-required-asterisk
          class="recover-form"
        >
          <el-form-item prop="email">
            <el-input 
              v-model="form.email" 
              :placeholder="t('forgot_password.email_label')" 
              size="large"
            />
          </el-form-item>
          <el-form-item>
            <el-button 
              :loading="isLoading" 
              class="submit-button" 
              native-type="submit"
            >
              {{ t('forgot_password.recover_button') }}
            </el-button>
          </el-form-item>
        </el-form>

        <router-link to="/login" class="back-to-login">
          {{ t('forgot_password.back_to_login') }}
        </router-link>
      </div>
    </main>

    <AppFooter />
  </div>
</template>


<script setup>
// Script 部分无需修改
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import { requestPasswordReset } from '../api';

const { t } = useI18n();
const formRef = ref(null);
const isLoading = ref(false);

const form = reactive({
  email: '',
});

const rules = reactive({
  email: [
    { required: true, message: t('login.validation.email_required'), trigger: 'blur' },
    { type: 'email', message: t('login.validation.email_format'), trigger: ['blur', 'change'] }
  ],
});

// ▼▼▼ 2. 修改 submitForm 函數以呼叫 API ▼▼▼
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      isLoading.value = true;
      try {
        // 呼叫 API 函數，並傳入用戶輸入的郵箱
        await requestPasswordReset(form.email);
        // 無論成功或失敗，都顯示成功訊息，防止用戶猜測郵箱是否存在
        ElMessage.success(t('forgot_password.success_message'));
      } catch (error) {
        // 即使後端出錯，也顯示成功訊息以增強安全性
        ElMessage.success(t('forgot_password.success_message'));
        console.error("Password reset request failed:", error);
      } finally {
        // 無論結果如何，最終都將加載狀態設為 false
        isLoading.value = false;
      }
    }
  });
};
</script>

<style scoped>
/* 整体页面和头部样式 */
.forgot-password-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.header-wrapper {
  position: sticky; top: 0; z-index: 1000;
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
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding: 60px 20px;
}

/* ▼▼▼ 2. 样式修正：为 form-box 添加白色背景和阴影，形成卡片效果 ▼▼▼ */
.form-box {
  background-color: #f7f7f7;
  padding: 60px 50px; /* 调整内边距 */
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.0);
  width: 100%;
  max-width: 645px;
   /* 1. 设置您需要的高度 */
  height: 476px;
  display: flex;
  flex-direction: column;
  /* 将主轴对齐方式改为 space-between，让内容上下分布 */
  justify-content: flex-start; 
  padding: 30px 40px; /* 增加上下内边距，让内容离边框远一些 */
}
.form-header {
    text-align: center; /* 让标题和副标题居中 */
    width: 100%;
}
h1 {
  font-size: 60px;
  font-weight: 600;
  margin-bottom: 0px;
  color: #000;
  text-align: center; /* 标题居中 */
}
.subtitle {
  color: #968C82;
  margin-bottom: 30px;
  font-size: 16px;
  text-align: center; /* 副标题居中 */
}
/* 新增一个 class 给 form，使其宽度受控 */
.recover-form {
    width: 100%;
    margin: 0 auto;
}
.form-label {
  display: block;
  font-size: 14px; /* 字体调小一点以匹配图片 */
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  text-align: left;
}
:deep(.el-form-item) {
  margin-bottom: 20px;
}
:deep(.el-input__wrapper) {
  height: 60px;
}
:deep(.el-input__inner) {
  /* 您可以根据需要修改这个数值 */
  font-size: 18px; 
}
.submit-button {
  width: 100%;
  height: 60px;
  font-size: 20px;
  font-weight: 600;
  background-color: #92C45C; 
  border-color: #92C45C;
  color: #fff;
  margin-top: 15px;
}
.submit-button:hover {
  background-color: #92C45C;
  border-color: #92C45C;
}
.back-to-login {
  display: block;
  margin-top: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #968C82;
  text-decoration: none;
  text-align: center; /* 返回链接居中 */
}
.back-to-login:hover {
  text-decoration: underline;
}
</style>