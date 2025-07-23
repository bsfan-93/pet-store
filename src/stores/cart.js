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
  console.log("Cart Store: Attempting to add item:", product);
  const existingItem = items.value.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += product.quantity || 1;
  } else {
    // 确保添加商品时，从 product 对象中捕获正确的价格
    items.value.push({
      ...product,
      quantity: product.quantity || 1,
      price: product.price || 0 // 确保 price 被正确捕获，如果 product.price 不存在，可以考虑给 0 或其他默认值
    });
  }
  openCart(); // 立即打开购物车侧边栏

  const authStore = useAuthStore();
  if (authStore.isLoggedIn) {
    try {
      const apiPayload = {
        goodId: product.goodId || product.id,
        spec: product.specId || null, // 确保从 ProductDetailPage 正确传递了这些 ID
        color: product.colorId || null, // 确保从 ProductDetailPage 正确传递了这些 ID
        quantity: product.quantity || 1
      };
      console.log("Cart Store: Adding to server cart with payload:", apiPayload);
      await addToCart(apiPayload); // 向后端发送添加请求

      // 【临时修改】移除立即同步，等待后端修复 getCartItems
      // 这样做意味着在添加商品后，购物车侧边栏不会立即显示从后端拉取的错误/重复数据
      // 购物车内容将不会自动更新，直到页面刷新或执行下一次 syncCart (例如：删除操作)
      // await syncCart(); // - 移除或注释掉这一行，取消在添加后立即同步

      console.log("Cart Store: Item added to server. Cart will sync on next load/action (e.g., refresh/delete)."); // + 打印提示信息
    } catch (error) {
      console.error("Cart Store: Failed to add item to server cart:", error);
      // 可选：如果服务器添加失败，考虑从本地购物车回滚该项
      // items.value = items.value.filter(item => item.id !== product.id);
    }
  } else {
    saveLocalCart(); // 访客模式下仍然保存到本地存储
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
  console.log("Cart Store: Starting cart sync...");
  try {
    const serverCart = await getCartItems();
    console.log("Cart Store: Server cart raw response:", serverCart); // 打印原始后端响应

    // 处理后端返回空对象 {} 或非数组的情况 (这部分逻辑已在您代码中修正过，保持不变)
    if (!Array.isArray(serverCart) && typeof serverCart === 'object' && Object.keys(serverCart).length === 0) {
      console.warn("Cart Store: Server cart response is an empty object, treating as empty array.");
      items.value = [];
      return;
    }
    if (!Array.isArray(serverCart)) {
        console.error("Cart Store: Server cart response is not a valid array, clearing cart.");
        items.value = [];
        return;
    }

    // 【新增】处理后端返回重复条目的问题：按 goodId, spec, color 进行去重和数量汇总
    const processedItems = new Map(); // 使用 Map 进行去重和汇总

    serverCart.forEach(item => {
      // 创建一个唯一的键来标识商品的 SKU (Stock Keeping Unit)
      // 假设 goodId, spec, color 组合唯一标识一个商品 SKU
      const itemKey = `${item.goodId}-${item.spec}-${item.color}`;

      if (processedItems.has(itemKey)) {
        // 如果 Map 中已存在该 SKU，则累加数量
        const existingItem = processedItems.get(itemKey);
        existingItem.quantity += item.quantity;
        // 如果后端价格在不同条目中可能不一致，这里需要一个策略。
        // 假设后端价格现在是正确的，且相同 goodId+spec+color 的 price 是一致的。
      } else {
        // 如果是新的 SKU，则添加到 Map
        processedItems.set(itemKey, {
          // 保留后端提供的 id。注意：如果后端继续为相同 SKU 创建新 id，
          // 这里的 id 将始终是该 SKU 的“第一个”或“最后一个”条目的 id。
          // 对于更新或删除操作，可能需要后端支持按 goodId+spec+color 或更灵活的删除方式。
          id: item.id, 
          goodId: item.goodId,
          name: item.goodName,
          url: item.goodImage,
          price: item.price || 0, // 价格现在是正确的了，但依然保留 || 0 作为保险
          quantity: item.quantity,
          specName: item.specName,
          colorName: item.colorName,
        });
      }
    });

    let syncedItems = Array.from(processedItems.values()); // 将 Map 的值转换为数组

    // 【核心修正】重新添加过滤逻辑：不显示价格 <= 0 的商品
    // 只有当 item.price 大于 0 时才显示该商品
    syncedItems = syncedItems.filter(item => item.price > 0); // + 重新添加这行

    items.value = Array.from(processedItems.values()); // 将 Map 的值转换为数组
    console.log("Cart Store: Cart synced. Current items (deduplicated):", items.value);

    // 如果仍然有价格 <= 0 的商品被过滤掉（这表明后端仍有此问题），可以保留警告
    // 这里我们再次使用 syncedItems 变量，因为它包含了过滤前的所有商品信息，用于日志
    const zeroOrMissingPriceItems = Array.from(processedItems.values()).filter(item => item.price <= 0);
    if (zeroOrMissingPriceItems.length > 0) {
      console.warn("Cart Store: Items with zero or missing price were found and filtered out:", zeroOrMissingPriceItems);
      // 可选：使用 ElMessage 给用户一个提示，告知部分商品因价格问题被隐藏
      // 例如：ElMessage.warning(t('cart.zero_price_items_hidden_message')); // 需要在语言文件中添加此键
    }

  } catch (error) {
    console.error("Cart Store: Failed to sync cart:", error);
    items.value = []; // 同步失败则清空
    console.log("Cart Store: Cart sync failed. Items cleared:", items.value);
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