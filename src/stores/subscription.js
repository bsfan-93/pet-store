// src/stores/subscription.js

import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useSubscriptionStore = defineStore('subscription', () => {
  // 1. 從 localStorage 讀取初始狀態，確保鍵名是小寫的 'hasSubscribed'
  const isSubscribed = ref(localStorage.getItem('hasSubscribed') === 'true');

  // 2. 定義一個動作 (action)
  function subscribe() {
    isSubscribed.value = true;
    // 將狀態保存到 localStorage，也使用小寫的 'hasSubscribed'
    localStorage.setItem('hasSubscribed', 'true');
  }

  return { isSubscribed, subscribe };
});