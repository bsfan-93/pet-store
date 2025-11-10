<!-- “常见问题” 页面，解答用户的常见疑问。 -->

<template>
  <div class="faq-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="faq-container">
        <h1>{{ $t('faq.title') }}</h1>
        
        <el-collapse v-model="activeNames" class="faq-collapse" accordion>
          <el-collapse-item 
            v-for="(item, index) in faqData" 
            :key="index" 
            :name="index"
          >
            <template #title>
              <div class="collapse-title">
                <img src="/images/1.png" alt="Question Icon" class="custom-question-icon"/> 
                <span>{{ item.question }}</span>
              </div>
            </template>
            <div class="collapse-content">
              <p>{{ item.answer }}</p>
            </div>
          </el-collapse-item>
        </el-collapse>

        <div class="page-feedback">
            <h3>{{ $t('faq.feedback.title') }}</h3>
            <div class="feedback-buttons">
                <el-button class="feedback-btn no-btn" round @click="showFeedbackForm">
                    <img src="/images/sad.png" alt="Sad face" class="feedback-icon"/> {{ $t('faq.feedback.no') }}
                </el-button>
                <el-button class="feedback-btn yes-btn" round @click="showSubscribeForm">
                    <img src="/images/happy.png" alt="Happy face" class="feedback-icon"/> {{ $t('faq.feedback.yes') }}
                </el-button>
            </div>
        </div>

        <div v-if="isFeedbackFormVisible" class="feedback-form-container">
            <h4>{{ $t('faq.feedback.yes_form_title') }}</h4>
            <el-input
              v-model="feedbackQuestion"
              :placeholder="$t('faq.feedback.no_form_placeholder')"
              size="large"
              class="feedback-input"
            />
            <el-button class="submit-feedback-btn" @click="submitFeedback">
              {{ $t('faq.feedback.no_form_button') }}
            </el-button>
        </div>

        <div v-if="isSubscribeFormVisible" class="feedback-form-container">
            <h4>{{ $t('faq.feedback.yes_form_title') }}</h4>
            <el-input
              v-model="subscribeEmail"
              :placeholder="$t('faq.feedback.yes_form_placeholder')"
              size="large"
              class="feedback-input"
            />
            <el-button class="submit-feedback-btn" @click="submitSubscription">
              {{ $t('faq.feedback.yes_form_button') }}
            </el-button>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n'; // 2. 引入 useI18n
import { ElCollapse, ElCollapseItem, ElButton, ElInput, ElMessage } from 'element-plus';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
// ▼▼▼ START: 核心修改点 3 - 引入 API 函数 ▼▼▼
import { subscribeMail } from '../api';
// ▲▲▲ END: 核心修改点 3 ▲▲▲

const activeNames = ref(0); 
const { tm } = useI18n(); // 3. 获取 tm 函数以加载翻译模块

// 4. 将写死的数据替换为从 i18n 文件中获取的计算属性
const faqData = computed(() => tm('faq.items'));

// ▼▼▼ START: 核心修改点 3 - 添加新的 script 逻辑 ▼▼▼
const isFeedbackFormVisible = ref(false);
const feedbackQuestion = ref('');

// “YES”按钮表单的状态
const isSubscribeFormVisible = ref(false);
const subscribeEmail = ref('');

// ▼▼▼ START: 核心修改区域 ▼▼▼
// 点击 "NO" 按钮时调用的函数
const showFeedbackForm = () => {
  isSubscribeFormVisible.value = false; // 隐藏 "YES" 表单
  isFeedbackFormVisible.value = true;   // 显示 "NO" 表单
};

// 点击 "YES" 按钮时调用的函数
const showSubscribeForm = () => {
  isFeedbackFormVisible.value = false;   // 隐藏 "NO" 表单
  isSubscribeFormVisible.value = true;    // 显示 "YES" 表单
};
// ▲▲▲ END: 核心修改区域 ▲▲▲

// 点击 "NO" 按钮时调用的函数
const submitFeedback = () => {
  if (!feedbackQuestion.value) {
    ElMessage.warning('Please enter your question before submitting.');
    return;
  }
  
  // 在这里可以将来可以添加调用API的逻辑
  console.log('Feedback submitted:', feedbackQuestion.value);
  
  ElMessage.success('Thank you for your feedback!');
  
  // 提交后清空并隐藏表单
  isFeedbackFormVisible.value = false;
  feedbackQuestion.value = '';
};
// ▲▲▲ END: 核心修改点 3 ▲▲▲

// 提交 "YES" 表单 (Email) 的函数
const submitSubscription = async () => {
  // 简单的邮箱格式验证
  if (!subscribeEmail.value || !/^\S+@\S+\.\S+$/.test(subscribeEmail.value)) {
    ElMessage.warning('Please enter a valid email address.');
    return;
  }
  
  try {
    // 调用订阅 API
    await subscribeMail(subscribeEmail.value);
    ElMessage.success('Subscription successful! Thank you.');
    
    // 成功后清空并隐藏表单
    isSubscribeFormVisible.value = false;
    subscribeEmail.value = '';
  } catch (error) {
    ElMessage.error(error.message || 'An error occurred. Please try again.');
  }
};
// ▲▲▲ END: 核心修改点 4 ▲▲▲
</script>

<style scoped>
.faq-page {
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
  padding: 20px 10px;
}
.faq-container {
  max-width: 800px;
  margin: 0 auto;
}
h1 {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 50px;
  text-align: left;
}

.faq-collapse {
  border: none;
}

:deep(.el-collapse-item) {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1.5px solid #e0e0e0;
  box-shadow: none;
  overflow: hidden; /* 这个 overflow:hidden 就是“罪魁祸首” */
}

/* 【关键修改】将伪元素直接附加到 header 上，并确保 header 是定位参照物 */
:deep(.el-collapse-item__header) {
  padding: 25px 60px 25px 25px; /* 右侧的 60px 就是为图标留出的空间 */
  font-size: 16px;
  font-weight: 600;
  border-bottom: none;
  height: auto;
  line-height: 1.4;
  background-color: #fff;
  position: relative; /* <--- 确保 header 是定位的参照物 */
  border-top-left-radius: 8px; 
  border-top-right-radius: 8px;
}

/* 【关键修改】新的伪元素样式，现在它相对于 header 定位 */
:deep(.el-collapse-item__header)::after {
  content: '+';
  position: absolute;
  right: 25px; /* 定位在右侧内边距的中间 */
  top: 20%;
  right: 90px; /* <-- 关键：这一行告诉图标从右边数 25px 的地方开始 */
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  background-color: #000;
  border-radius: 50%;
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  line-height: 1;
  transition: all 0.3s ease;
}

/* 【关键修改】当 header 激活时，改变伪元素的样式 */
:deep(.el-collapse-item__header.is-active)::after {
  content: '−';
  transform: translateY(-50%) rotate(180deg);
  background-color: #000;
  color: #fff;
}


:deep(.el-collapse-item__arrow) {
  display: none !important; 
}

:deep(.el-collapse-item__wrap) {
  border-bottom: none;
  background-color: #fff;
  border-bottom-left-radius: 8px; 
  border-bottom-right-radius: 8px;
}

:deep(.el-collapse-item__content) {
  padding: 0;
}

.collapse-content p {
  padding: 0 25px 25px 25px;
  margin: 0;
  font-size: 15px;
  color: #555;
  line-height: 1.8;
}

.collapse-title {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  /* 不再需要 position: relative */
}

.custom-question-icon {
  width: 24px;
  height: 24px;
}

.page-feedback {
  margin-top: 80px;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
.page-feedback h3 {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
}
.feedback-buttons {
  display: flex;
  gap: 15px;
}
.feedback-btn {
  border-radius: 6px;
  padding: 8px 20px;
  height: auto;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #ccc;
  background-color: #fff;
  display: flex;
  align-items: center;
}
.feedback-btn:hover {
  border-color: #888;
  background-color: #f7f7f7;
}
.feedback-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

/* ▼▼▼ START: 核心修改区域 ▼▼▼ */
.feedback-form-container {
  background-color: #ececec;
  border-radius: 0px;
  /* 【高低差】调整 padding 可以控制灰色框内部的整体间距 */
  padding: 40px; 
  max-width: 600px;
  margin: 20px auto 0;
  text-align: center;
}
.feedback-form-container h4 {
  /* 【字体大小粗细】调整这里的 font-size 和 font-weight */
  font-size: 32px;
  font-weight: 600; /* 700是粗体，500是正常 */
  /* 【高低差】调整 margin-bottom 可以控制标题和输入框的距离 */
  margin: 0 0 35px 0; 
}
.feedback-input {
  /* 【高低差】调整 margin-bottom 可以控制输入框和按钮的距离 */
  margin-bottom: 35px; 
}
/* 【长短】通过 :deep() 选择器可以调整输入框的宽度 */
.feedback-input :deep(.el-input__wrapper) {
  /* 【高度可调】调整这个 height 值来改变输入框的高度 */
  height: 65px; 
  border-radius: 8px;
  /*
    【宽度相等】
    移除具体的 width 属性，让输入框默认撑满父容器宽度 (100%)
  */
}

/* ▼▼▼ START: 核心修改点 ▼▼▼ */
/* 使用 :deep() 和 .el-input__inner 来选中真正的 input 元素 */
.feedback-input :deep(.el-input__inner) {
  /* 在这里调整字体大小 */
  font-size: 20px; 
}
/* ▲▲▲ END: 核心修改点 ▲▲▲ */

.submit-feedback-btn {
  /*
    【宽度相等】
    让按钮也撑满父容器宽度 (100%)，这样就和上面的输入框等宽了
  */
  width: 100%;
  /* 【高度可调】调整这个 height 值来改变按钮的高度 */
  height: 65px;

  background-color: #7CB342;
  color: #fff;
  border-color: #7CB342;
  font-size: 24px;
  font-weight: 600; /* 700是粗体，500是正常 */
  padding: 12px 50px;
}
.submit-feedback-btn:hover {
  background-color: #8bc34a;
  border-color: #8bc34a;
}
/* ▲▲▲ END: 核心修改区域 ▲▲▲ */

/* 样式部分无需修改，新的表单可以复用之前的样式 */
.faq-page {
  background-color: #fff;
}

/* ▼▼▼ 【新增】針對手機的響應式樣式 ▼▼▼ */
@media (max-width: 767px) {
    .main-content {
        padding: 40px 15px;
    }

    h1 {
        font-size: 28px;
        margin-bottom: 30px;
    }

    :deep(.el-collapse-item__header) {
        padding: 20px 50px 20px 20px; /* 調整手風琴標題的內邊距 */
        font-size: 15px;
    }

    .page-feedback {
        flex-direction: column; /* 讓反饋區垂直排列 */
        gap: 15px;
        margin-top: 50px;
    }
}
</style>