// src/stores/cart.js

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';
import { getCartItems, addToCart, updateCartItem, deleteCartItems, IMAGE_BASE_URL, getGoodDetail } from '../api';
import { ElMessage } from 'element-plus';

const LOCAL_STORAGE_KEY = 'pet-store-cart';

export const useCartStore = defineStore('cart', () => {
  const items = ref([]); 
  const isCartVisible = ref(false);
  
  const authStore = useAuthStore();

  const selectedItems = computed(() => items.value.filter(item => item.selected));

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const subtotal = computed(() => {
    return selectedItems.value.reduce((total, item) => {
      const price = Number(item.price) || 0;
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  });

  function toggleItemSelection(itemId) {
    const item = items.value.find(i => i.id === itemId);
    if (item) {
      item.selected = !item.selected;
      saveLocalCart();
    }
  }

  async function addItem(product) {
    openCart();
    
    const selectedSpecId = product.specId;
    const selectedColorId = product.colorId;

    if (authStore.isLoggedIn) {
      try {
        let finalSpecId = selectedSpecId;
        let finalColorId = selectedColorId;

        // 如果 specId 或 colorId 为 null，说明是从列表页添加的，需要获取默认值
        if (finalSpecId === null || finalColorId === null) {
          const productDetails = await getGoodDetail(product.goodId);
          const sizeSpec = productDetails.specifications?.find(s => s.name === 'size')?.values;
          const colorSpec = productDetails.specifications?.find(s => s.name === 'color')?.values;
          
          if (sizeSpec && sizeSpec.length > 0) {
            finalSpecId = sizeSpec[0].id;
          }
          if (colorSpec && colorSpec.length > 0) {
            finalColorId = colorSpec[0].id;
          }
        }

        const apiPayload = {
          goodId: product.goodId || product.id,
          spec: finalSpecId,
          color: finalColorId,
          quantity: product.quantity || 1
        };
            
        if (apiPayload.spec === undefined || apiPayload.color === undefined || apiPayload.spec === null || apiPayload.color === null) {
          ElMessage.error("添加到购物车失败，缺少产品规格。");
          closeCart();
          return;
        }

        await addToCart(apiPayload);
        await syncCart();
      } catch (error) {
        console.error("Cart Store: Failed to add item to server cart:", error);
        ElMessage.error("添加到购物车失败，请重试。");
      }
    } else {
      const existingItem = items.value.find(item => 
        item.goodId === (product.goodId || product.id) &&
        item.specId === selectedSpecId &&
        item.colorId === selectedColorId
      );

      if (existingItem) {
        existingItem.quantity += (product.quantity || 1);
      } else {
        const newLocalItemId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        items.value.push({
          id: newLocalItemId,
          goodId: product.goodId || product.id,
          name: product.name,
          url: product.url,
          price: product.price || 0,
          quantity: product.quantity || 1,
          specId: selectedSpecId,
          specName: product.specName,
          colorId: selectedColorId,
          colorName: product.colorName,
          selected: true
        });
      }
      saveLocalCart();
    }
  }

  async function updateQuantity(cartItemId, newQuantity) {
    const item = items.value.find(i => i.id === cartItemId);
    if (!item) return;

    if (newQuantity < 1) {
      await removeItems(cartItemId);
      return;
    }

    if (authStore.isLoggedIn) {
      try {
        await updateCartItem({ id: cartItemId, quantity: newQuantity });
        await syncCart();
      } catch (error) {
        console.error("Failed to update cart on server:", error);
        ElMessage.error("更新数量失败。");
      }
    } else {
      item.quantity = newQuantity;
      saveLocalCart();
    }
  }

  async function removeItems(ids) {
    const idArray = Array.isArray(ids) ? ids : [ids];

    if (authStore.isLoggedIn) {
      try {
        await deleteCartItems(idArray);
        await syncCart();
      } catch (error) {
        console.error("Cart Store: Failed to remove item from server cart:", error);
        ElMessage.error("删除商品失败，请重试。");
      }
    } else {
      items.value = items.value.filter(item => !idArray.includes(item.id));
      saveLocalCart();
    }
  }
  
  async function syncCart() {
    try {
      const serverCart = await getCartItems();
      if (!Array.isArray(serverCart)) {
        items.value = [];
        return;
      }
      
      const formattedCart = serverCart.map(item => ({
        id: item.id,
        goodId: item.goodId,
        name: item.goodName,
        url: item.goodImage.startsWith('http://') || item.goodImage.startsWith('https://')
          ? item.goodImage
          : IMAGE_BASE_URL + item.goodImage,
        price: item.price || 0,
        quantity: item.quantity,
        specId: item.spec,
        specName: item.specName,
        colorId: item.color,
        colorName: item.colorName,
        selected: true
      }));

      items.value = formattedCart.filter(item => item.price > 0);
    } catch (error) {
      console.error("Cart Store: Failed to sync cart:", error);
      items.value = [];
    }
  }
  
  function saveLocalCart() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items.value));
  }
  
  function loadLocalCart() {
    const localCart = localStorage.getItem(LOCAL_STORAGE_KEY);
    items.value = localCart ? JSON.parse(localCart) : [];
  }

  function openCart() {
    isCartVisible.value = true;
    if (authStore.isLoggedIn) {
      syncCart();
    }
  }

  function closeCart() { isCartVisible.value = false; }
  
  async function clearSelectedItems() {
    const idsToRemove = selectedItems.value.map(item => item.id);
    if (idsToRemove.length > 0) {
      await removeItems(idsToRemove);
    }
  }

  loadLocalCart();
  if (authStore.isLoggedIn) {
    syncCart();
  }

  return {
    items, isCartVisible, totalItems, subtotal,
    addItem, updateQuantity, removeItems,
    syncCart, loadLocalCart,
    openCart, closeCart,
    selectedItems,
    toggleItemSelection,
    clearSelectedItems
  };
});