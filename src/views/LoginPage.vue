<template>
  <div class="login-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="login-main">
      <div class="login-box">
        <h1>Login</h1>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          @submit.prevent="submitForm(loginFormRef)"
        >
          <el-form-item prop="email">
            <el-input v-model="loginForm.email" placeholder="Email" size="large"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="Password" show-password size="large"/>
          </el-form-item>
          <a href="#" class="forgot-password">Forgot your password?</a>
          <el-form-item>
            <el-button 
              :loading="isLoading" 
              class="login-button" 
              type="primary" 
              native-type="submit"
            >
              Login
            </el-button>
          </el-form-item>
        </el-form>
        <a href="#" class="sign-up-link">Sign up</a>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import { useAuthStore } from '../stores/auth';
import { inject } from 'vue';

const authStore = useAuthStore();
const navigateTo = inject('navigateTo');

const loginFormRef = ref(null);
const isLoading = ref(false);

const loginForm = reactive({
  email: '',
  password: '',
});

const loginRules = reactive({
  email: [{ required: true, message: 'Please input email address', trigger: 'blur' }],
  password: [{ required: true, message: 'Please input password', trigger: 'blur' }],
});

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      isLoading.value = true;
      try {
        await authStore.handleLogin(loginForm.email, loginForm.password);
        ElMessage.success('Login successful!');
        navigateTo('home'); // 登录成功后跳转到首页
      } catch (error) {
        ElMessage.error(error.message || 'Login failed.');
      } finally {
        isLoading.value = false;
      }
    } else {
      console.log('error submit!');
      return false;
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

.forgot-password {
  display: block;
  text-align: right;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
  text-decoration: none;
}
.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 20px;
  font-size: 16px;
  font-weight: 500;
  background-color: #f0ad4e;
  border-color: #f0ad4e;
}
.login-button:hover {
  background-color: #ec971f;
  border-color: #d58512;
}

.sign-up-link {
  margin-top: 20px;
  display: inline-block;
  font-size: 14px;
  color: #333;
}
</style>