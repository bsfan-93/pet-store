<template>
  <div class="register-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="register-main">
      <div class="register-box">
        <h1>{{ $t('register.title') }}</h1>
        <p class="subtitle">{{ $t('register.subtitle') }}</p>
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          class="register-form"
          @submit.prevent="submitForm(registerFormRef)"
        >
          <el-form-item prop="name">
            <el-input v-model="registerForm.name" placeholder="$t('register.name_label')" size="large"/>
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="registerForm.email" placeholder="$t('register.email_label')" size="large"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="$t('register.password_label')" show-password size="large"/>
          </el-form-item>
          <el-form-item>
            <el-button 
              :loading="isLoading" 
              class="register-button" 
              type="primary" 
              native-type="submit"
            >
              {{ $t('register.create_button') }}
            </el-button>
          </el-form-item>
        </el-form>
        <div class="login-prompt">
          <span>{{ $t('register.login_prompt') }}</span>
          <router-link to="/login">{{ $t('register.login_link') }}</router-link>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { reactive, ref, inject } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import { registerUser } from '../api'; // 【新增】导入注册 API 函数

const navigateTo = inject('navigateTo');
const registerFormRef = ref(null);
const isLoading = ref(false);

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
});

const registerRules = reactive({
  name: [{ required: true, message: 'Please enter your name', trigger: 'blur' }],
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: ['blur', 'change'] }
  ],
  password: [{ required: true, message: 'Please enter a password', trigger: 'blur' }],
});

// ▼▼▼ 【修改】更新 submitForm 函数以调用 API ▼▼▼
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      isLoading.value = true;
      try {
        // 调用我们刚刚创建的注册API函数
        await registerUser(registerForm); 
        
        ElMessage.success('Account created successfully!');
        navigateTo('login'); // 注册成功后跳转到登录页
      } catch (error) {
        // API 失败时显示错误信息
        ElMessage.error(error.message || 'Registration failed.');
      } finally {
        isLoading.value = false;
      }
    }
  });
};
</script>

<style scoped>
.register-page {
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

.register-main {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f7f7;
  padding: 60px 20px;
}

.register-box {
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
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
}

.register-button {
  width: 100%;
  padding: 20px;
  font-size: 16px;
  font-weight: 500;
  background-color: #7CB342;
  border-color: #7CB342;
}
.register-button:hover {
  background-color: #7CB342;
  border-color: #7CB342;
}

.login-prompt {
  margin-top: 20px;
  font-size: 14px;
}
.login-prompt a {
  color: #1976D2;
  text-decoration: none;
  font-weight: 500;
  margin-left: 5px;
}
.login-prompt a:hover {
  text-decoration: underline;
}
</style>