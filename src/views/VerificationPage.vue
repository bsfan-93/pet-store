<!-- “邮箱验证” 页面，用户注册后需要在此输入验证码以激活账户。 -->
 
<template>
  <div class="verification-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="form-main">
      <div class="form-box">
        <h1>{{ t('verification.title') }}</h1>
        <p class="subtitle">{{ t('verification.subtitle') }}</p>
        
        <el-form
          ref="formRef"
          :model="form"
          class="verification-form"
          @submit.prevent="submitForm(formRef)"
        >
          <el-form-item prop="code">
            <el-input 
              v-model="form.code" 
              :placeholder="t('verification.placeholder')" 
              size="large"
            />
          </el-form-item>
          <el-form-item>
            <el-button 
              :loading="isLoading" 
              class="submit-button" 
              type="primary" 
              native-type="submit"
            >
              {{ t('verification.button') }}
            </el-button>
          </el-form-item>
        </el-form>

        <div class="back-link-container">
          <span>{{ t('verification.prompt') }} </span>
          <router-link to="/login" class="login-link">{{ t('verification.login_link') }}</router-link>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n'; // 1. 引入 useI18n
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

const router = useRouter();
const formRef = ref(null);
const isLoading = ref(false);
const { t } = useI18n(); // 2. 获取 t 函数

const form = reactive({
  code: '',
});

// 这是一个示例提交函数，将来需要替换为真实的API调用
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      isLoading.value = true;
      console.log('Verification code submitted:', form.code);
      // 模拟API调用
      setTimeout(() => {
        ElMessage.success('Account created successfully!');
        router.push('/login');
        isLoading.value = false;
      }, 1500);
    }
  });
};
</script>

<style scoped>
/* 样式与注册和登录页面类似 */
.verification-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.header-wrapper {
  position: sticky; top: 0; z-index: 1000; background-color: #fff;
}
.header-wrapper :deep(.main-nav a),
.header-wrapper :deep(.header-actions .el-icon),
.header-wrapper :deep(.el-dropdown-link),
.header-wrapper :deep(.logo img) {
  color: var(--text-color); filter: none;
}
.form-main {
  flex-grow: 1; 
  display: flex; 
  justify-content: center; 
  align-items: center;
  background-color: #f7f7f7; 
  padding: 60px 20px;
}
.form-box {
  background-color: #fff; 
  padding: 40px; 
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
  width: 100%; 
  max-width: 400px;
  text-align: center;
}
h1 {
  font-size: 32px; 
  font-weight: 700; 
  margin-bottom: 10px;
}
.subtitle {
  color: #7CB342; 
  margin-bottom: 30px;
}
.submit-button {
  width: 100%; 
  padding: 20px; 
  font-size: 16px; 
  font-weight: 500;
  background-color: #7CB342; 
  border-color: #7CB342;
}
.submit-button:hover {
  background-color: #8bc34a; 
  border-color: #8bc34a;
}
/* ▼▼▼ START: 核心修改点 2 ▼▼▼ */
.back-link-container {
  margin-top: 20px;
  font-size: 14px;
}
.back-link-container span {
  color: #000; /* 设置不可点击部分的文字颜色为黑色 */
}
.login-link {
  color: #1976D2; /* 设置 "Log in" 的文字颜色为蓝色 */
  text-decoration: none;
  font-weight: 500;
  margin-left: 5px; /* 添加一些左边距 */
}
.login-link:hover {
  text-decoration: underline;
}
/* ▲▲▲ END: 核心修改点 2 ▲▲▲ */
</style>