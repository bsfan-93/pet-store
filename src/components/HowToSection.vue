<template>
  <section class="how-to-section">
    <div class="content-overlay">
      <h2>{{ $t('how_to.title') }} </h2>
      </div>
  </section>
</template>

<style scoped>
.how-to-section {
  height: 60vh;
  background-image: url('/images/how-to-bg.jpg'); /* 这是那张大图 */
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* 创建视差滚动效果 */
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--secondary-color); /* 假设背景图是暗色，用白色文字 */
}

.content-overlay {
  text-align: center;
}

.content-overlay h2 {
  font-size: var(--font-size-title);
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5); /* 给文字添加阴影使其更清晰 */
}
</style>