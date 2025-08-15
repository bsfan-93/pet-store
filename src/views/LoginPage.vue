<!-- “登录” 页面，供已有用户登录账户。 -->

<template>
  <div class="login-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="login-main">
      <div class="login-box">
        <h1>{{ $t('login.title') }}</h1>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          @submit.prevent="submitForm(loginFormRef)"
          :hide-required-asterisk="true"
        >
          <div class="form-group">
            <label class="form-label">{{ $t('login.email_label') }}</label>
            <el-form-item prop="email">
              <el-input v-model="loginForm.email" placeholder="Email" size="large"/>
            </el-form-item>
          </div>
          
          <div class="form-group">
            <label class="form-label">{{ $t('login.password_label') }}</label>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" 
              type="password" 
              :placeholder="$t('login.password_label')"
              show-password size="large"
              />
            </el-form-item>
          </div>
          
          <router-link to="/forgot-password" class="forgot-password">
            {{ $t('login.forgot_password') }}
          </router-link>
          
          <el-form-item>
            <el-button 
              :loading="isLoading" 
              class="login-button" 
              type="primary" 
              native-type="submit"
            >
              {{ $t('login.login_button') }}
            </el-button>
          </el-form-item>
        </el-form>
        <div class="sign-up-prompt">
          <span>{{ $t('login.signup_prompt') }}</span>
          <router-link to="/register" class="sign-up-link">{{ $t('login.signup_link') }}</router-link>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router'; // 导入 useRouter
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import { useAuthStore } from '../stores/auth';
import { useI18n } from 'vue-i18n'; // 【新增】导入 useI18n

const authStore = useAuthStore();
const router = useRouter(); // 获取 router 实例
const { t } = useI18n(); // 【新增】获取 t 函数

const loginFormRef = ref(null);
const isLoading = ref(false);

const loginForm = reactive({
  email: '',
  password: '',
});

const loginRules = reactive({
    email: [
      { required: true, message: t('login.validation.email_required'), trigger: 'blur' }, 
      { type: 'email', message: t('login.validation.email_format'), trigger: ['blur', 'change'] } 
    ],
  password: [{ required: true, message: t('login.validation.password_required'), trigger: 'blur' }], 
});

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      isLoading.value = true;
      try {
        await authStore.handleLogin(loginForm.email, loginForm.password);
        ElMessage.success(t('login.success_message'));
        router.push('/'); // 使用 router.push() 跳转到首页
      } catch (error) {
        ElMessage.error(t('login.error_message'));
        // 登录失败时，不做任何跳转，停留在当前页面
      } finally {
        isLoading.value = false;
      }
    }
  });
};
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
.login-main {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f7f7;
  padding: 60px 20px;
}
.login-box {
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
  font-weight: 600;
  margin-bottom: 30px;
}

/* ▼▼▼ 【修改】表单相关样式 ▼▼▼ */
.form-group {
  margin-bottom: 22px; /* 控制每个输入框组的间距 */
  text-align: left;
}
.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
  color: #333;
}
.login-form :deep(.el-form-item) {
  margin-bottom: 5px; /* 为校验信息预留空间 */
}
.login-form :deep(.el-input__wrapper) {
  height: 48px; /* 调整输入框高度 */
  font-size: 16px; /* 调整输入框内文字大小 */
}
/* ▲▲▲ 修改结束 ▲▲▲ */

.forgot-password {
  display: block;
  text-align: right;
  margin-top: -15px; /* 向上移动一点，更紧凑 */
  margin-bottom: 25px;
  font-size: 14px;
  color: #666;
  text-decoration: none;
}
.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 22px;
  font-size: 16px;
  font-weight: 500;
  background-color: #7CB342;
  border-color: #7CB342;;
}
.login-button:hover {
  background-color: #7CB342;;
  border-color: #7CB342;;
}

.sign-up-prompt {
  margin-top: 20px;
  font-size: 14px;
}
.sign-up-link {
  color: #1976D2;
  text-decoration: none;
  font-weight: 500;
  margin-left: 5px;
}
.sign-up-link:hover {
  text-decoration: underline;
}

</style>