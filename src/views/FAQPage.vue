<template>
  <div class="faq-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="faq-container">
        <h1>FAQs</h1>
        
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
            <h3>Is this page helpful to you?</h3>
            <div class="feedback-buttons">
                <el-button class="feedback-btn no-btn" round>
                    <img src="/images/sad.png" alt="Sad face" class="feedback-icon"/> NO
                </el-button>
                <el-button class="feedback-btn yes-btn" round>
                    <img src="/images/happy.png" alt="Happy face" class="feedback-icon"/> YES
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
import { ElCollapse, ElCollapseItem, ElButton } from 'element-plus'; // 移除了 ElIcon，因为它不再直接使用
// import { QuestionFilled } from '@element-plus/icons-vue'; // 移除了，因为你使用了图片
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

/* ▼▼▼ 【优化】折叠面板样式 ▼▼▼ */
.faq-collapse {
  border: none;
}

/* 统一 el-collapse-item 的基础样式 */
:deep(.el-collapse-item) {
  background-color: #fff;
  border-radius: 8px; /* 统一圆角值 */
  margin-bottom: 20px;
  border: 1.5px solid #e0e0e0;
  box-shadow: none;
  overflow: hidden; /* 防止子元素内容溢出圆角 */
}

/* 统一 el-collapse-item__header 的样式 */
:deep(.el-collapse-item__header) {
  padding: 25px 60px 25px 25px; /* 顶部25px，右侧60px（留给+/-图标），底部25px，左侧25px */
  font-size: 16px;
  font-weight: 600;
  border-bottom: none; /* 移除 Element Plus 默认的下边框 */
  height: auto; /* 让高度自适应内容 */
  line-height: 1.4;
  background-color: #fff; /* 确保标题背景色一致 */
  position: relative; /* 为 .collapse-title 的绝对定位提供上下文 */
  /* 圆角与父级 el-collapse-item 保持一致，仅顶部 */
  border-top-left-radius: 8px; 
  border-top-right-radius: 8px;
}

/* 隐藏 Element Plus 默认的箭头图标 */
:deep(.el-collapse-item__arrow) {
  display: none !important; 
}

/* 修正回答框容器 el-collapse-item__wrap 的样式 */
:deep(.el-collapse-item__wrap) {
  border-bottom: none; /* 移除默认下边框 */
  background-color: #fff; /* 背景改为白色 */
  /* 圆角与父级 el-collapse-item 保持一致，仅底部 */
  border-bottom-left-radius: 8px; 
  border-bottom-right-radius: 8px;
}

/* 修正回答框内容 el-collapse-item__content 的内边距 */
:deep(.el-collapse-item__content) {
  padding: 0; /* 移除默认内边距，由内部的 p 标签控制 */
}

/* 回答内容的 p 标签样式，使其与问题框左右对齐 */
.collapse-content p {
  padding: 0 25px 25px 25px; /* 上0，右25px，下25px，左25px */
  margin: 0;
  font-size: 15px;
  color: #555;
  line-height: 1.8;
}

/* 问题标题区域的 flex 布局和相对定位 */
.collapse-title {
  display: flex;
  align-items: center;
  gap: 15px; /* 图标和文字的间距 */
  width: 100%; /* 确保占据所有可用宽度 */
  position: relative; /* 为其子元素（伪元素）提供定位上下文 */
  /* padding-right: 40px; 这个 padding-right 放在这里是多余的，因为父级 el-collapse-item__header 已经有 padding-right 了 */
  /* 如果保留，它会再次压缩文字空间。建议移除或设置为0 */
  padding-right: 0; /* 恢复默认或设置为0，让父级的padding-right生效 */
}

/* 自定义 +/- 图标的样式 (附加到 .collapse-title::after) */
.collapse-title::after { 
  content: '+'; /* 默认显示 + */
  position: absolute;
  right: -35px; /* 调整此值，使图标位于问题框的右侧边缘外一点，具体值可能需要微调 */
                /* 25px (header padding) + 10px (图标一半宽度) = 35px，所以-35px可能正好 */
  top: 50%;
  transform: translateY(-50%); 
  
  width: 28px; 
  height: 28px;
  border-radius: 50%; 
  background-color: #000; 
  color: #fff; 
  
  display: flex; 
  justify-content: center;
  align-items: center;
  
  font-size: 20px; 
  font-weight: bold; 
  cursor: pointer; 
  transition: transform 0.3s ease; 
  z-index: 2; /* 确保它在文字上层，防止被覆盖 */
}

/* 展开时，改为 - 符号 */
:deep(.el-collapse-item__header.is-active) .collapse-title::after {
  content: '-';
  transform: translateY(-50%) rotate(180deg);
}

/* 自定义问号图标的样式 */
.custom-question-icon {
  width: 24px; /* 根据实际需要调整大小 */
  height: 24px;
}

/* ▼▼▼ 页面反馈部分的样式 ▼▼▼ */
.page-feedback {
  margin-top: 80px;
  margin-bottom: 40px; /* 调整与AppFooter的间距，如需更大可增加 */
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
  border-radius: 6px; /* 胶囊形状 */
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
  width: 20px; /* 图标大小 */
  height: 20px;
  margin-right: 8px;
}
</style>