import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';
import { getCartItems, addToCart, updateCartItem, deleteCartItems } from '../api';
import { ElMessage } from 'element-plus'; // 确保导入 ElMessage

const LOCAL_STORAGE_KEY = 'pet-store-cart';

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([]); 
  const isCartVisible = ref(false);

  // Getter
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  // ▼▼▼【修改】▼▼▼
  // 1. 新增一个用于内部计算的、纯数字的总价 (以美元为单位)
  const subtotalRaw = computed(() => {
    return items.value.reduce((total, item) => {
      const price = Number(item.price) || 0; // 确保价格是数字
      return total + (price * item.quantity);
    }, 0);
  });

  // const subtotal = computed(() => {
  //   return items.value.reduce((total, item) => {
  //     const price = item.price || 0; // 确保价格存在
  //     return total + (price * item.quantity);
  //   }, 0).toFixed(2);
  // });
  const subtotal = computed(() => {
    return subtotalRaw.value.toFixed(2);
  });

  // --- 核心 Actions ---

  // 1. 添加商品
 async function addItem(product) {
  openCart();
  const authStore = useAuthStore();

  if (authStore.isLoggedIn) {
   try {
    const apiPayload = {
     goodId: product.goodId || product.id,
     spec: product.specId,
     color: product.colorId,
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
      const cartId = `${product.id}_${product.specId || 'default'}_${product.colorId || 'default'}`;
   const existingItem = items.value.find(item => item.cartId === cartId);
   if (existingItem) {
    existingItem.quantity += product.quantity || 1;
   } else {
    items.value.push({
     ...product,
          cartId: cartId,
     quantity: product.quantity || 1,
    });
   }
   saveLocalCart();
  }
 }

  // 2. 更新数量
  async function updateQuantity(cartItemId, newQuantity) {
    // Find the item in the local cart first
    const item = items.value.find(item => item.id === cartItemId);
    if (!item) return;

    // Store the old quantity in case we need to revert
    const oldQuantity = item.quantity;
    
    // Optimistically update the local state immediately
    item.quantity = newQuantity;

    // Now, update the backend
    const authStore = useAuthStore();
    if (authStore.isLoggedIn) {
      try {
        // Send the update to the server in the background
        await updateCartItem({ id: cartItemId, quantity: newQuantity });
        // No need to call syncCart(), our local state is already correct!
      } catch (error) {
        console.error("Failed to update cart on server:", error);
        // If the server update fails, revert the local change and notify the user
        item.quantity = oldQuantity;
        // You can add an error message here, e.g., using ElMessage
      }
    } else {
      // For guest users, just save to local storage
      saveLocalCart();
    }
  }

  // 3. 删除商品 (支持单个或多个)
  async function removeItems(itemToRemove) { // 參數從 ids 改為 itemToRemove
  const authStore = useAuthStore();
  
  if (authStore.isLoggedIn) {
    // 對於已登入用戶，我們使用後端返回的、唯一的購物車項目 ID (itemToRemove.id)
    await deleteCartItems([itemToRemove.id]);
    await syncCart(); // 完成後與後端同步
  } else {
    // 對於未登入的訪客，我們使用客戶端生成的、唯一的 cartId 來精準刪除
    items.value = items.value.filter(item => item.cartId !== itemToRemove.cartId);
    saveLocalCart();
  }
}
  
  // 4. 同步/查询购物车 (核心)
// ▼▼▼ 【核心修改】更新 syncCart 函數以生成唯一的客戶端 ID ▼▼▼
  async function syncCart() {
    console.log("Cart Store: Starting cart sync...");
    try {
      const serverCart = await getCartItems();
      if (!Array.isArray(serverCart)) {
       // 如果返回的不是数组 (可能是空对象等)，视为空购物车
        items.value = [];
        return;
      }
      const imageBaseUrl = 'http://192.168.2.9:9999';
      // 將後端返回的商品列表轉換為我們需要的、帶有唯一 cartId 的格式
      const processedItems = serverCart
        .filter(item => item.price > 0) // 過濾掉價格無效的商品
        .map(item => ({
          id: item.id, // 這是後端購物車項目的 ID
          cartId: `${item.goodId}_${item.spec || 'default'}_${item.color || 'default'}`, // 這是客戶端唯一的 ID
          goodId: item.goodId,
          name: item.goodName,
          // url: item.goodImage,
          url: imageBaseUrl + item.goodImage,
          price: item.price,
          quantity: item.quantity,
          specId: item.spec,
          specName: item.specName,
          colorId: item.color,
          colorName: item.colorName,
        }));
      
      // 合併數量 (處理後端可能返回重複規格商品的情況)
      const mergedItems = new Map();
      processedItems.forEach(item => {
        if (mergedItems.has(item.cartId)) {
          mergedItems.get(item.cartId).quantity += item.quantity;
        } else {
          mergedItems.set(item.cartId, item);
        }
      });

      items.value = Array.from(mergedItems.values());
    } catch (error) {
      console.error("Cart Store: Failed to sync cart:", error);
      items.value = [];
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
  const authStore = useAuthStore();
  if (authStore.isLoggedIn) {
      console.log("Cart Store: User logged in on init, syncing cart from server.");
      syncCart(); // 确保登录时进行一次同步
  }

  return {
    items, isCartVisible, totalItems, subtotal,
    addItem, updateQuantity, removeItems,
    syncCart, loadLocalCart,
    openCart, closeCart,
  };
});