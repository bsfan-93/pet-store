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
                <el-button class="feedback-btn no-btn" round>
                    <img src="/images/sad.png" alt="Sad face" class="feedback-icon"/> {{ $t('faq.feedback.no') }}
                </el-button>
                <el-button class="feedback-btn yes-btn" round>
                    <img src="/images/happy.png" alt="Happy face" class="feedback-icon"/> {{ $t('faq.feedback.yes') }}
                </el-button>
            </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElCollapse, ElCollapseItem, ElButton } from 'element-plus';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

const activeNames = ref(0); 

const faqData = ref([
    {
    question: 'Where is your company located?',
    answer: 'Our office is located at 1135 Walsh Ave, Santa Clara, California.'
  },
  {
    question: 'Where do you ship from?',
    answer: 'We ship from our partnered warehouses across the State. Please expect your items to be shipped separately (if you order more than one item) as different warehouses specialize in different areas of manufacturing.'
  },
  {
    question: 'How long will it take for my items to arrive?',
    answer: 'Ships from the shop within 2 business days. Transit time for standard shipping is 3-4 business days. Estimated arrival time is within 8 business days of the customer\'s order. In peak periods like holidays, Black Friday and Cyber Monday, please allow up to 5 business days for dispatch'
  },
   {
    question: 'How long will it take for my items to arrive?',
    answer: 'Ships from the shop within 2 business days. Transit time for standard shipping is 3-4 business days. Estimated arrival time is within 8 business days of the customer\'s order. In peak periods like holidays, Black Friday and Cyber Monday, please allow up to 5 business days for dispatch'
  },
]);
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
</style>