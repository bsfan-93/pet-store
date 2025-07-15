import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';
import { getCartItems, addToCart, updateCartItem, deleteCartItems } from '../api';

const LOCAL_STORAGE_KEY = 'pet-store-cart';

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([]); 
  const isCartVisible = ref(false);

  // Getter
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });
  const subtotal = computed(() => {
    return items.value.reduce((total, item) => {
      const price = item.price || 0; // 确保价格存在
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  });

  // --- 核心 Actions ---

  // 1. 添加商品
  async function addItem(product) { // 它接收一个 product 对象
    const existingItem = items.value.find(item => item.id === product.id);
    if (existingItem) {
      // 如果商品已存在，则累加数量
      existingItem.quantity += product.quantity || 1;
    } else {
      // 如果是新商品，则将包含数量的整个对象添加进去
      items.value.push({ ...product, quantity: product.quantity || 1 });
    }
    openCart();
  }

  // 2. 更新数量
  async function updateQuantity(cartItemId, newQuantity) {
    const authStore = useAuthStore();
    if (authStore.isLoggedIn) {
      await updateCartItem({ id: cartItemId, quantity: newQuantity });
      await syncCart();
    } else {
      const item = items.value.find(item => item.id === cartItemId);
      if (item) item.quantity = newQuantity;
      saveLocalCart();
    }
  }

  // 3. 删除商品 (支持单个或多个)
  async function removeItems(ids) {
    const authStore = useAuthStore();
    const idArray = Array.isArray(ids) ? ids : [ids];
    if (authStore.isLoggedIn) {
      await deleteCartItems(idArray);
      await syncCart();
    } else {
      items.value = items.value.filter(item => !idArray.includes(item.id));
      saveLocalCart();
    }
  }
  
  // 4. 同步/查询购物车 (核心)
  async function syncCart() {
    try {
      const serverCart = await getCartItems();
      items.value = serverCart.map(item => ({
        id: item.id, // 这是购物项的唯一ID
        goodId: item.goodId,
        name: item.goodName,
        url: item.goodImage,
        price: item.price, // 注意：API返参中没有price，这里需要您确认
        quantity: item.quantity,
        specName: item.specName,
        colorName: item.colorName,
      }));
    } catch (error) {
      console.error("同步购物车失败:", error);
      items.value = []; // 同步失败则清空
    }
  }
  
  // --- 本地缓存 Actions ---
  function saveLocalCart() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items.value));
  }
  
  function loadLocalCart() {
    const localCart = localStorage.getItem(LOCAL_STORAGE_KEY);
    items.value = localCart ? JSON.parse(localCart) : [];
  }

  // --- UI Actions ---
  function openCart() { isCartVisible.value = true; }
  function closeCart() { isCartVisible.value = false; }
  
  // 初始化时加载本地购物车
  loadLocalCart();

  return {
    items, isCartVisible, totalItems, subtotal,
    addItem, updateQuantity, removeItems,
    syncCart, loadLocalCart,
    openCart, closeCart,
  };
});