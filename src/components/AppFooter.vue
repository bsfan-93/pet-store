<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-column brand">
        <img src="/images/logo.png" alt="Logo" class="footer-logo">
        <p>{{ $t('footer.tagline') }}</p>
        <div class="social-icons">
          <el-icon><Ship /></el-icon>
          <el-icon><Pointer /></el-icon>
          <el-icon><Promotion /></el-icon>
          <el-icon><Star /></el-icon>
        </div>
      </div>
      <div class="footer-column links">
        <h4>{{ $t('footer.about_title') }}</h4>
        <a href="#">{{ $t('footer.links.company') }}</a>
        <a href="#">{{ $t('footer.links.careers') }}</a>
        <a href="#">{{ $t('footer.links.press') }}</a>
      </div>
      <div class="footer-column links">
        <h4>{{ $t('footer.support_title') }}</h4>
        <a href="#">{{ $t('footer.links.contact_us') }}</a>
        <a href="#">{{ $t('footer.links.faq') }}</a>
        <a href="#">{{ $t('footer.links.shipping') }}</a>
      </div>
      <div class="footer-column subscribe">
        <h4>{{ $t('footer.join_title') }}</h4>
        <p>{{ $t('footer.join_desc') }}</p>
        <el-input placeholder="$t('footer.placeholder_email')">
          <template #append>
            <el-button>{{ $t('footer.signup_button') }}</el-button>
          </template>
        </el-input>
      </div>
    </div>
    <div class="footer-bottom">
      <p>{{ $t('footer.copyright') }}</p>
      <div class="app-store-links">
        <span>{{ $t('footer.app_store') }}</span>
        <span>{{ $t('footer.google_play') }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: var(--primary-color);
  color: #a0a0a0; /* 页脚文字通常不是纯白，而是灰色 */
  font-size: var(--font-size-footer);
  padding: 60px 20px 20px;
}

.footer-container {
  max-width: var(--container-width);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 30px;
  padding-bottom: 40px;
  border-bottom: 1px solid #444;
}

.footer-column {
  flex: 1;
  min-width: 220px;
}

.footer-column h4 {
  color: var(--secondary-color);
  font-size: 16px;
  margin-bottom: 20px;
}

.footer-column a, .footer-column p {
  display: block;
  margin-bottom: 12px;
  color: #a0a0a0;
}

.footer-column a:hover {
  color: var(--secondary-color);
}

.footer-logo {
  width: 100px; /* 页脚logo小一点 */
  margin-bottom: 20px;
  filter: brightness(0) invert(1); /* 如果是黑色logo，这行代码可以把它变白 */
}

.social-icons {
  display: flex;
  gap: 15px;
  font-size: 20px;
  cursor: pointer;
}

.subscribe .el-input {
  --el-input-border-color: #666;
  --el-input-bg-color: #333;
  --el-input-text-color: var(--secondary-color);
}

.footer-bottom {
  max-width: var(--container-width);
  margin: 20px auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.app-store-links {
  display: flex;
  gap: 20px;
}
</style>