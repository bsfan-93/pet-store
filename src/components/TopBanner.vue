<template>
  <div class="top-banner">
    <p>{{ $t('top_banner.promo') }}</p>
  </div>
</template>

<style scoped>
/* 优惠栏 */
.top-banner {
  background-color: var(--primary-color);
  color: var(--secondary-color);
  text-align: center;
  padding: 9px 0;           /* <-- 修改这里的第一个值来调整高度 */
  /* 使用CSS变量 */
  font-size: var(--font-size-top-banner);
}

.top-banner p {
  margin: 0;
}
</style>