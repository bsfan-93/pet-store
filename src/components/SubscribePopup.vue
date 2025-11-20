<!-- 订阅弹窗，当新用户首次访问网站时弹出的邮件订阅窗口。 -->

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
        
        <h2 v-html="$t('subscribe_popup.title')"></h2>  
        <p>{{ $t('subscribe_popup.subtitle') }}</p> 
        <form @submit.prevent="handleSubscribe">
          <label for="email-input">
            {{ $t('subscribe_popup.email_label') }}
          </label>
          
          <el-input 
            id="email-input"
            v-model="email" 
            :placeholder="$t('subscribe_popup.email_label')" 
            class="email-input"
            @input="clearError"
          />

          <div v-if="emailError" class="error-message">{{ emailError }}</div>
          <el-button 
            :loading="isLoading" 
            native-type="submit" 
            class="subscribe-btn"
          >
            {{ $t('subscribe_popup.subscribe_button') }}
          </el-button>
        </form>
        <a href="#" class="no-thanks-link" @click.prevent="closeDialog">
          {{ $t('subscribe_popup.no_thanks') }}
        </a>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElDialog, ElInput, ElButton, ElIcon, ElMessage } from 'element-plus';
import { subscribeMail } from '../api';
import { useSubscriptionStore } from '../stores/subscription';

const { t } = useI18n();

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue']);
const subscriptionStore = useSubscriptionStore();

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
    emailError.value = t('subscribe_popup.error_email'); 
    return;
  }
  isLoading.value = true;
  try {
    await subscribeMail(email.value);
    ElMessage.success(t('subscribe_popup.subscription_successful')); 
    
    // ▼▼▼ 【核心修改】直接將訂閱狀態寫入 localStorage ▼▼▼
    // localStorage.setItem('hasSubscribed', 'true');
    // ▼▼▼ 3. 订阅成功后，调用 store 的 action 来更新全局状态 ▼▼▼
    subscriptionStore.subscribe();
    closeDialog();
  } catch (error) {
    ElMessage.error(error.message || t('subscribe_popup.subscription_failed')); 
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.popup-container {
  display: flex;
  width: 970px;
  height: 550px;
  border-radius: 20px; /* 【新增】为整个容器添加圆角 */
  overflow: hidden;    /* 【新增】确保子元素的直角被隐藏 */
}

.popup-image {
  width: 485px;
  height: 550px;
  flex-shrink: 0;
  background-color: #000; /* 修复了语法错误，移除了多余的 '+' */
}

.popup-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.popup-content {
  position: relative;
  width: 485px;
  height: 550px;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;
  box-sizing: border-box;
}

/* ... 其余样式保持不变 ... */
.close-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 22px;
  color: #999;
  cursor: pointer;
}

h2 {
  font-size: 48px; /* 【修改】 2.5vw -> 48px */
  font-weight: 700;
  margin: 0 0 15px 0; /* 【修改】 0.78vw -> 15px */
  color: #000;
  line-height: 1.4;
}
/* ▼▼▼【核心修正】使用 :deep() 选择器 ▼▼▼ */
:deep(.highlight) {
  color: #D32F2F;
}

p {
  font-size: 18px; /* 【修改】 0.9375vw -> 18px */
  color: #555;
  margin: 0 0 40px 0; /* 【修改】 2.08vw -> 40px */
}

form {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.email-input {
  margin-bottom: 25px;
}

.email-input :deep(.el-input__wrapper) {
  height: 50px;
  border-radius: 4px;
}

.email-input :deep(.el-input__inner) {
  font-size: 16px;
}

.subscribe-btn {
  background-color: #7CB342;
  color: #fff;
  border: none;
  padding: 20px;
  font-size: 18px;
  font-weight: 600;
}

.subscribe-btn:hover {
  background-color: #7CB342;
}

.no-thanks-link {
  text-align: center;
  margin-top: 25px;
  font-size: 15px;
  color: #1976D2;
  text-decoration: underline;
}

.error-message {
  color: #D32F2F;
  font-size: 13px;
  margin-top: -15px;
  margin-bottom: 15px;
}
:global(.subscribe-dialog.el-dialog) {
  background-color: transparent;
  box-shadow: none;
  width: auto !important;
}
:global(.subscribe-dialog .el-dialog__body) {
  padding: 0;
}

.subscribe-dialog h2:lang(zh),
.subscribe-dialog h2:lang(ja),
.subscribe-dialog h2:lang(ko),
.subscribe-dialog h2:lang(th),
.subscribe-dialog p:lang(zh),
.subscribe-dialog p:lang(ja),
.subscribe-dialog p:lang(ko),
.subscribe-dialog p:lang(th) {
  line-height: 1.4;
}

/* ▼▼▼ 【新增】媒体查询，适配平板和手机 ▼▼▼ */
@media (max-width: 999px) { /* 970px + padding */
  .popup-container {
    flex-direction: column;
    width: 90vw;
    max-width: 480px; /* 接近 popup-content 的宽度 */
    height: auto;
  }
  .popup-image {
    width: 100%;
    height: 250px; /* 调整一个合适的高度 */
  }
  .popup-content {
    width: 100%;
    height: auto;
    padding: 40px 30px;
  }
  h2 {
    font-size: 32px;
    margin-bottom: 10px;
  }
  p {
    font-size: 16px;
    margin-bottom: 25px;
  }
}

@media (max-width: 767px) {
  h2 {
    font-size: 28px;
  }
  p {
    font-size: 15px;
  }
}
</style>