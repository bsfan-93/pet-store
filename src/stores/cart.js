import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';
import { getCartItems, addToCart, updateCartItem, deleteCartItems, IMAGE_BASE_URL } from '../api';
import { ElMessage } from 'element-plus';

const LOCAL_STORAGE_KEY = 'pet-store-cart';

export const useCartStore = defineStore('cart', () => {
  const items = ref([]); 
  const isCartVisible = ref(false);

  // --- Getters ---
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

  // --- Actions ---
  function toggleItemSelection(itemId) {
    const item = items.value.find(i => i.id === itemId);
    if (item) {
      item.selected = !item.selected;
      saveLocalCart();
    }
  }

  async function addItem(product) {
    openCart();
    const authStore = useAuthStore();
    
    const selectedSpecId = product.specId;
    const selectedColorId = product.colorId;

    if (authStore.isLoggedIn) {
      try {
        const apiPayload = {
          goodId: product.goodId || product.id,
          spec: selectedSpecId,
          color: selectedColorId,
          quantity: product.quantity || 1
        };
            
        if (apiPayload.spec === undefined || apiPayload.color === undefined) {
          ElMessage.error("请选择商品规格和颜色。");
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
        selected: true // 默认为未选中
      });
      saveLocalCart();
    }
  }

  async function updateQuantity(cartItemId, newQuantity) {
    const authStore = useAuthStore();
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
    const authStore = useAuthStore();
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
        selected: true // 默认为未选中
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
    const authStore = useAuthStore();
    if (authStore.isLoggedIn) {
      syncCart();
    }
  }

  function closeCart() { isCartVisible.value = false; }
  
  loadLocalCart();
  const authStore = useAuthStore();
  if (authStore.isLoggedIn) {
    syncCart();
  }

  return {
    items, isCartVisible, totalItems, subtotal,
    addItem, updateQuantity, removeItems,
    syncCart, loadLocalCart,
    openCart, closeCart,
    selectedItems,
    toggleItemSelection
  };
});