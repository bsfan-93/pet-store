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
      // 对于登录用户，不再手动修改本地 state
      // 直接调用 API，然后用 syncCart 来获取最新、最准确的数据
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
      // 对于游客，逻辑保持不变，在本地进行操作
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
  const authStore = useAuthStore();
    const item = items.value.find(i => i.id === cartItemId);
    if (!item) return;

  if (authStore.isLoggedIn) {
      // 对于登录用户，直接调用 API 并重新同步
   try {
    await updateCartItem({ id: cartItemId, quantity: newQuantity });
        await syncCart();
   } catch (error) {
    console.error("Failed to update cart on server:", error);
        ElMessage.error("更新数量失败。");
   }
  } else {
      // 对于游客，在本地更新
      item.quantity = newQuantity;
   saveLocalCart();
  }
 }

  // 3. 删除商品 (支持单个或多个)
  
 async function removeItems(ids) {
  const authStore = useAuthStore();
  const idArray = Array.isArray(ids) ? ids : [ids];
  
  if (authStore.isLoggedIn) {
      try {
        await deleteCartItems(idArray);
        await syncCart();
      } catch(error) {
        console.error("Cart Store: Failed to remove item from server cart:", error);
        ElMessage.error("删除商品失败，请重试。");
      }
  } else {
   // 游客模式下的删除需要用 cartId
      const cartIdToDelete = items.value.find(item => item.id === idArray[0])?.cartId;
      if (cartIdToDelete) {
        items.value = items.value.filter(item => item.cartId !== cartIdToDelete);
      }
   saveLocalCart();
  }
  }
  
  // 4. 同步/查询购物车 (核心)
// ▼▼▼ 【核心修改】更新 syncCart 函數以生成唯一的客戶端 ID ▼▼▼
 async function syncCart() {
    try {
      const serverCart = await getCartItems();
      if (!Array.isArray(serverCart)) {
        items.value = [];
        return;
      }
      
      const imageBaseUrl = 'http://192.168.2.9:9999';

      const formattedCart = serverCart.map(item => ({
        id: item.id, 
        goodId: item.goodId,
        name: item.goodName,
        url: imageBaseUrl + item.goodImage,
        price: item.price || 0,
        quantity: item.quantity,
        specId: item.spec,
        specName: item.specName,
        colorId: item.color,
        colorName: item.colorName,
        cartId: `${item.goodId}_${item.spec || 'default'}_${item.color || 'default'}`
      }));
      
      // 使用 Map 来合并后端可能返回的重复项
      const mergedItems = new Map();
      formattedCart.forEach(item => {
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