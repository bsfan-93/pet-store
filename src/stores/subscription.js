// src/stores/subscription.js

import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useSubscriptionStore = defineStore('subscription', () => {
  // 1. 从 localStorage 读取初始状态，这样刷新页面也能保持
  const isSubscribed = ref(localStorage.getItem('userHasSubscribed') === 'true');

  // 2. 定义一个动作（action）
  function subscribe() {
    isSubscribed.value = true;
    // 将状态保存到 localStorage
    localStorage.setItem('userHasSubscribed', 'true');
  }

  return { isSubscribed, subscribe };
});