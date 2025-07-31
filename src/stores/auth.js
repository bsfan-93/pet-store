import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login, logoutApi, getUserInfo } from '../api' // 【修改】导入 logoutApi
import { useCartStore } from './cart' // 确保 useCartStore 正确导入

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('access_token') || null)
  const userInfo = ref(JSON.parse(localStorage.getItem('user_info')) || null)
  const isLoggedIn = computed(() => !!token.value)

  async function handleLogin(username, password) {
    const response = await login(username, password)
    token.value = response.access_token       // 更新 token 会自动让 isLoggedIn 变为 true
    userInfo.value = response.user_info // 首次登录时从响应中获取用户信息，但后续我们会强制刷新
    localStorage.setItem('access_token', token.value)
    localStorage.setItem('user_info', JSON.stringify(userInfo.value))
    localStorage.setItem('login_timestamp', Date.now()); // 保存当前时间戳

    // 登录成功后，立即同步购物车
    const cartStore = useCartStore()
    await cartStore.syncCart()
  

    // 【新增】登录成功后，强制从后端拉取最新、最完整的用户信息
    await fetchUserInfo();
  }

// 3. 重寫 handleLogout 函數，使其更健壯
  async function handleLogout() { 
    const currentToken = token.value; // 保存當前token

    // 立即清除前端状态，UI会立刻响应
    token.value = null // 清除 token 会自动让 isLoggedIn 变为 false
    userInfo.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_info')
    localStorage.removeItem('login_timestamp');
    
    // 重置购物车为游客状态
    const cartStore = useCartStore()
    cartStore.loadLocalCart()


    // 在后台使用舊token嘗試調用后端登出接口
    if (currentToken) {
        try {
            // 我們需要手動構造一個臨時的 apiFetch 來調用，因為全局的 fetch 已經沒有 token 了
            const tempApiFetch = async () => {
                const fullUrl = `/api/auth/token/logout`;
                const headers = { 'Authorization': `Bearer ${currentToken}` };
                await fetch(fullUrl, { method: 'DELETE', headers });
            };
            await tempApiFetch();
            console.log("Successfully logged out from backend.");
        } catch (error) {
            console.error("Backend logout failed:", error);
        }
    }
  }


    // 【修改】解注释并完善 fetchUserInfo 函数
  async function fetchUserInfo() {
    // 只有在登录状态下且当前 store 中没有完整的 userId 时才尝试获取
    // 这里的 `userInfo.value?.userId` 可以根据实际后端返回的用户信息结构调整
    // 例如，如果后端返回的不是 `userId` 而是 `id` 或 `uuid` 等，请相应调整
    if (!isLoggedIn.value) {
      console.log("User not logged in, skipping fetchUserInfo.");
      return;
    }
    // // 如果已经有用户完整信息，且未强制刷新，可以跳过
    // if (userInfo.value && userInfo.value.userId) { // 假设 userId 是判断用户信息完整的标志
    //   console.log("User info already available, skipping fetchUserInfo.");
    //   return;
    // }

    try {
      console.log("Attempting to fetch user info...");
      const data = await getUserInfo(); // 调用 API 获取用户信息
      userInfo.value = data; // 更新 store
      localStorage.setItem('user_info', JSON.stringify(data)); // 更新本地存储
      console.log("User info fetched and updated:", data);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      // 如果获取失败（例如 token 过期，但 401 拦截器未及时触发），可以在这里额外处理
      // 鉴于 api/index.js 中已经有 401 拦截器，通常不需要在这里额外强制登出
    }
  }

  // 【新增】在 store 初始化时调用 fetchUserInfo
  // 这确保了当应用启动且用户已登录（通过持久化的 token）时，用户信息能够被同步
  // 使用 `isLoggedIn.value` 而不是 `token.value` 可以利用计算属性的响应性
  if (isLoggedIn.value && !userInfo.value?.userId) {
    console.log("Auth Store initialized. User is logged in, attempting to fetch user info.");
    fetchUserInfo();
  }

  return { token, userInfo, isLoggedIn, handleLogin, handleLogout, fetchUserInfo }    // 导出 fetchUserInfo
})