<template>
  <div class="contact-us-page">
    <div class="header-wrapper">
      <TopBanner />
      <AppHeader />
    </div>

    <main class="main-content">
      <div class="contact-us-container">
        <h1>CONTACT US</h1>
        
        <div class="info-text">
          <p>Our media team works closely with the media and social partners to solve issues regarding pets' life conditions. We aim to support with high-tech and healthy living styles for both humans and pets.</p>
          <p>Customer Service:15380822206@163.com (We will reply to your email within 24 hours.)</p>
          <p>Customer Service Phone: (86) 15380822206 (9:00am-12:00pm & 1:00pm-18:00pm Mon.-Sun.)</p>
        </div>

        <div class="retail-service">
          <h2>RETAIL SERVICE</h2>
          <p>In addition to ensuring neat, clean, compliant and safe basic goods display requirements, we will try our best to comprehensively enrich product types and ensure sufficient quantity to meet customers' purchasing needs.</p>
        </div>

        <div class="form-section">
          <h2>Do you have any question?</h2>
          <div class="form-box">
            <form @submit.prevent="sendMessage">
              <el-input v-model="form.email" placeholder="Email" size="large"></el-input>
              <el-input
                v-model="form.message"
                type="textarea"
                :rows="6"
                placeholder="Message"
                size="large"
              ></el-input>
              <el-button native-type="submit" class="send-button" size="large">Send Message</el-button>
            </form>
          </div>
        </div>

      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { ElInput, ElButton } from 'element-plus';
import TopBanner from '../components/TopBanner.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

// 【修改】简化表单数据
const form = reactive({
  email: '',
  message: ''
});

const sendMessage = () => {
  console.log('Form submitted:', form);
  // 在这里可以添加实际的 API 调用逻辑来发送消息
};
</script>

<style scoped>
.contact-us-page {
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
  padding: 40px 20px;
}

.contact-us-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  font-family: 'Outfit', sans-serif;
  color: #555;
  /* 【关键修改】将文本对齐方式从 center 改为 left */
  text-align: left; 
}

h1 {
  font-size: 32px;
  font-weight: 600;
  color: #000;
  margin-bottom: 40px;
  /* 【关键修改】将大标题居中对齐 */
  text-align: center;
}

.info-text {
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 60px;
}
.info-text p {
  margin: 0 0 1em 0;
}

.retail-service {
  margin-bottom: 60px;
}

.retail-service h2 {
  font-size: 24px;
  font-weight: 600;
  color: #000;
  margin-bottom: 20px;
}
.retail-service p {
  font-size: 14px;
  line-height: 1.8;
}

.form-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: #000;
  margin-bottom: 20px;
}

.form-box {
  background-color: #f7f7f7;
  padding: 40px;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
}

.form-box form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-box :deep(.el-input__wrapper),
.form-box :deep(.el-textarea__inner) {
  box-shadow: none !important;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-box :deep(.el-input__wrapper) {
  height: 50px;
}

.send-button {
  background-color: #7CB342; /* 蓝色按钮 */
  color: #fff;
  border-radius: 5px;
  height: 50px;
  border: none;
  font-weight: 500;
}
.send-button:hover {
  background-color: #7CB342;
}
</style>