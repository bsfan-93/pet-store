<template>
  <el-dialog
    v-model="dialogVisible"
    width="auto"
    :show-close="false"
    align-center
    class="subscribe-dialog"
  >
    <div class="popup-container">
      <div class="popup-image">
        <img src="/images/popup_shown.png" alt="Dog">
      </div>
      <div class="popup-content">
        <el-icon class="close-icon" @click="closeDialog"><Close /></el-icon>
        <h2>Unlock <span class="highlight">20%</span> OFF Your order Today</h2>
        <p>Make it more convenient for pets</p>
        <form @submit.prevent="handleSubscribe">
          <label for="email-input">Email</label>
          <el-input 
            id="email-input"
            v-model="email" 
            placeholder="Email" 
            class="email-input"
            @input="clearError"
          />
          <div v-if="emailError" class="error-message">{{ emailError }}</div>
          <el-button 
            :loading="isLoading" 
            native-type="submit" 
            class="subscribe-btn"
          >
            Subscribe For
          </el-button>
        </form>
        <a href="#" class="no-thanks-link" @click.prevent="closeDialog">No, Thanks</a>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElDialog, ElInput, ElButton, ElIcon, ElMessage } from 'element-plus';
import { subscribeMail } from '../api';

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue']);

const email = ref('');
const isLoading = ref(false);
const emailError = ref('');

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const closeDialog = () => {
  dialogVisible.value = false;
};

const clearError = () => {
  if (emailError.value) {
    emailError.value = '';
  }
}

const handleSubscribe = async () => {
  if (!email.value || !/^\S+@\S+\.\S+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email address.';
    return;
  }
  isLoading.value = true;
  try {
    await subscribeMail(email.value);
    ElMessage.success('Subscription successful! Thank you.');
    localStorage.setItem('hasSubscribed', 'true');
    closeDialog();
  } catch (error) {
    ElMessage.error(error.message || 'Subscription failed. Please try again.');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* ▼▼▼ 【修改】调整了弹窗的高度 ▼▼▼ */
.popup-container {
  display: flex;
  width: 970px;
  height: 550px; /* <-- 从 480px 增加到 550px  */
}

.popup-image {
  width: 485px;
  height: 550px; /* <-- 从 480px 增加到 550px  */
  flex-shrink: 0;
  background-color: #000;
}
.popup-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.popup-content {
  position: relative;
  width: 485px;
  height: 550px; /* <-- 从 480px 增加到 550px  */
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;
  box-sizing: border-box;
}

.error-message {
  color: #D32F2F;
  font-size: 12px;
  margin-top: -15px;
  margin-bottom: 10px;
}

.close-icon {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 20px;
  color: #999;
  cursor: pointer;
}
h2 {
  font-size: 34px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #000;
  line-height: 1.3;
}
.highlight {
  color: #D32F2F;
}
p {
  font-size: 18px;
  color: #666;
  margin: 0 0 40px 0;
}
form {
  display: flex;
  flex-direction: column;
}
label {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}
.email-input {
  margin-bottom: 18px;
}

/* 使用 :deep() 来修改 Element Plus 组件的内部样式 */
.email-input :deep(.el-input__wrapper) {
  height: 30px; /* 增加输入框高度 */
  border-radius: 4px; /* 可以调整圆角 */
}
.email-input :deep(.el-input__inner) {
  font-size: 14px; /* 增加输入框内文字大小 */
}

.subscribe-btn {
  background-color: #f0c14b;
  color: #111;
  border: none;
  padding: 18px;
  font-size: 16px;
  font-weight: 500;
}
.subscribe-btn:hover {
  background-color: #e8b63a;
}
.no-thanks-link {
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  color: #999;
  text-decoration: underline;
}
:global(.subscribe-dialog.el-dialog) {
  background-color: transparent;
  box-shadow: none;
  width: auto !important;
}
:global(.subscribe-dialog .el-dialog__body) {
  padding: 0;
}
</style>