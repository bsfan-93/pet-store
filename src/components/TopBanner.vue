<!-- 网站最顶部的优惠信息横幅。 -->

<template>
  <div class="top-banner">
    <p>{{ $t('top_banner.promo') }}</p>
  </div>
</template>

<script setup>
// 引入 useI18n
import { useI18n } from 'vue-i18n';
// 获取 t 函数
const { t } = useI18n();
</script>

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