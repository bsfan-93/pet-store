// src/stores/cart.js

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// 使用 defineStore 定义一个 store
// 第一个参数是 store 的唯一 ID，Pinia 用它来连接 devtools
// 第二个参数是一个函数，定义了 store 的 state, getters, 和 actions
export const useCartStore = defineStore('cart', () => {
  // --- State ---
  // 使用 ref() 来定义 state 属性，等同于组件中的 data
  const items = ref([]); // 存放购物车中的商品
  const isCartVisible = ref(false); // 控制购物车面板是否显示

  // --- Getters ---
  // 使用 computed() 来定义 getters，等同于组件中的 computed properties
  
  // 计算购物车商品总数
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  // 计算购物车总价
  const subtotal = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0).toFixed(2); // toFixed(2) 保留两位小数
  });
  
  // --- Actions ---
  // 使用 function() 来定义 actions，等同于组件中的 methods

  // 添加商品到购物车
  function addItem(product) {
    const existingItem = items.value.find(item => item.id === product.id);

    if (existingItem) {
      // 如果商品已存在，则数量加一
      existingItem.quantity++;
    } else {
      // 如果是新商品，则添加到数组中，并设置数量为1
      items.value.push({ ...product, quantity: 1 });
    }
    // 添加商品后自动打开购物车面板
    openCart();
  }

  // ▼▼▼ 【新增】从购物车移除指定商品 ▼▼▼
  function removeItem(productId) {
    items.value = items.value.filter(item => item.id !== productId);
  }

  // ▼▼▼ 【新增】更新指定商品的数量 ▼▼▼
  function updateItemQuantity(productId, newQuantity) {
    const item = items.value.find(item => item.id === productId);
    if (item) {
      if (newQuantity > 0) {
        item.quantity = newQuantity;
      } else {
        // 如果数量小于等于0，则直接移除该商品
        removeItem(productId);
      }
    }
  }

  // 从购物车移除商品（这里我们先简单实现一个清空购物车的函数作为示例）
  function clearCart() {
    items.value = [];
  }
  
  // 打开购物车面板
  function openCart() {
    isCartVisible.value = true;
  }
  
  // 关闭购物车面板
  function closeCart() {
    isCartVisible.value = false;
  }

  // --- Return ---
  // 必须返回所有你想暴露给其他组件使用的 state, getters, 和 actions
  return {
    items,
    isCartVisible,
    totalItems,
    subtotal,
    addItem,
    clearCart,
    openCart,
    closeCart,
    removeItem, // <-- 导出新函数
    updateItemQuantity, // <-- 导出新函数
  };
});