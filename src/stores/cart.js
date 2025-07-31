import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';
import { getCartItems, addToCart, updateCartItem, deleteCartItems, IMAGE_BASE_URL } from '../api';
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
  
   // 从 ProductDetailPage 获取的规格和颜色 ID
   // 这里的 selectedSpecId 和 selectedColorId 应该直接来自 product 对象，因为 ProductDetailPage 已经计算并传递了它们
  const selectedSpecId = product.specId;
  const selectedColorId = product.colorId;

  if (authStore.isLoggedIn) {
      // 对于登录用户，不再手动修改本地 state
      // 直接调用 API，然后用 syncCart 来获取最新、最准确的数据
   try {
    const apiPayload = {
     goodId: product.goodId || product.id,
     spec: selectedSpecId, // 【修正点】确保使用传入的 selectedSpecId
     color: selectedColorId, // 【修正点】确保使用传入的 selectedColorId
     quantity: product.quantity || 1
    };
        
    if (apiPayload.spec === undefined || apiPayload.color === undefined) {
      ElMessage.error("请选择商品规格和颜色。");
      closeCart();
      return;
    }
    console.log("Cart Store: Attempting to add item via API (addToCart). Payload:", apiPayload); // 【新增调试】
    await addToCart(apiPayload);
    console.log("Cart Store: Item added via API. Now syncing cart."); // 【新增调试】
    await syncCart();     // 确保从服务器获取最新数据

   } catch (error) {
     console.error("Cart Store: Failed to add item to server cart:", error);
     ElMessage.error("添加到购物车失败，请重试。");
   }
  } else {
    // 【修改点】游客模式下，模拟后端为每次“加入购物车”创建独立条目
    // 生成一个客户端唯一 ID，用于在本地区分不同的行
    const newLocalItemId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    items.value.push({
      id: newLocalItemId, // 使用新的唯一 ID
      goodId: product.goodId || product.id,
      name: product.name,
      url: product.url,
      price: product.price || 0,
      quantity: product.quantity || 1,
      specId: selectedSpecId, // 【修正点】使用传入的 selectedSpecId
      specName: product.specName,
      colorId: selectedColorId, // 【修正点】使用传入的 selectedColorId
      colorName: product.colorName,
      // 在游客模式下，我们不需要 cartId 用于合并，但可以保留以防万一
      cartId: `${product.goodId || product.id}_${selectedSpecId || 'default'}_${selectedColorId || 'default'}`
   });
   saveLocalCart();
  }
 }

  // 2. 更新数量
  async function updateQuantity(cartItemId, newQuantity) {
  const authStore = useAuthStore();
  const item = items.value.find(i => i.id === cartItemId);    // 找到要更新的行
  if (!item) return;

  // 如果新数量小于1，则删除该商品
  if (newQuantity < 1) {
      await removeItems(cartItemId);
      return;
  }

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
    // 【修改点】对于游客，在本地更新指定行的数量
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
        await deleteCartItems(idArray); // 调用后端删除指定 ID 的行
        await syncCart(); // 删除后同步最新购物车数据
      } catch (error) { // <-- 修正：移除了外部多余的 catch 块
        console.error("Cart Store: Failed to remove item from server cart:", error);
        ElMessage.error("删除商品失败，请重试。");
      }
    } else {
      // 【修改点】游客模式下，直接从本地数组中过滤掉指定 ID 的商品
      // 因为现在 addItem 会生成新的独立 ID，所以直接通过 ID 删除即可
      items.value = items.value.filter(item => !idArray.includes(item.id));
      saveLocalCart();
    }
  }
  
  // 4. 同步/查询购物车 (核心)
// ▼▼▼ 【核心修改】更新 syncCart 函數以生成唯一的客戶端 ID ▼▼▼
 async function syncCart() {
    console.log("Cart Store: Calling getCartItems for sync."); // 【新增调试】
    try {
      const serverCart = await getCartItems();
      console.log("Cart Store: getCartItems returned:", serverCart); // 【新增调试】
      if (!Array.isArray(serverCart)) {
        items.value = [];
        return;
      }
      
      // 【核心修改点】移除后端数据的去重合并逻辑
      // 直接格式化服务器返回的每个条目，不做前端合并，
      // 期望后端为每次"加入购物车"提供独立ID
      const formattedCart = serverCart.map(item => ({
        id: item.id, // 后端提供的唯一ID，用于区分每行
        goodId: item.goodId,
        name: item.goodName,
        url: item.goodImage.startsWith('http://') || item.goodImage.startsWith('https://')
        ? item.goodImage
        : IMAGE_BASE_URL + item.goodImage, // 确保图片URL正确拼接
        price: item.price || 0,
        quantity: item.quantity,
        specId: item.spec,
        specName: item.specName,
        colorId: item.color,
        colorName: item.colorName,
        // cartId 仍然可以保留用于内部逻辑，但不再用于UI展示的去重key
        cartId: `${item.goodId}_${item.spec || 'default'}_${item.color || 'default'}`
      }));

      // 【修改点】过滤掉价格不合法的商品，但不再进行基于cartId的合并
      items.value = formattedCart.filter(item => item.price > 0);

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
  function openCart() {
    isCartVisible.value = true; // 首先显示购物车面板

    // 【修改点】获取 auth store 实例并检查登录状态
    const authStore = useAuthStore();
    if (authStore.isLoggedIn) {
      console.log("Cart Store: User logged in, syncing cart on cart open.");
      // 如果用户已登录，则调用 syncCart 来从后端获取最新购物车数据
      syncCart();
    }
  }

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