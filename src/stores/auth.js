import { ref } from 'vue'
import { defineStore } from 'pinia'
import { login, logoutApi, getUserInfo } from '../api' // 【修改】导入 logoutApi
import { useCartStore } from './cart' // 确保 useCartStore 正确导入

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('access_token') || null)
  const userInfo = ref(JSON.parse(localStorage.getItem('user_info')) || null)
  const isLoggedIn = ref(!!token.value)

  async function handleLogin(username, password) {
    const response = await login(username, password)
    token.value = response.access_token
    userInfo.value = response.user_info
    isLoggedIn.value = true
    localStorage.setItem('access_token', token.value)
    localStorage.setItem('user_info', JSON.stringify(userInfo.value))
    localStorage.setItem('login_timestamp', Date.now()); // 保存当前时间戳

    // 登录成功后，立即同步购物车
    const cartStore = useCartStore()
    await cartStore.syncCart()
  }

  // ▼▼▼【修改】handleLogout 函数为异步，并调用后端登出接口 ▼▼▼
  async function handleLogout() { 
    try {
      if (token.value) { // 只有当本地有 token 时才尝试调用后端登出接口
        await logoutApi(); // 调用后端登出 API
        console.log("Successfully logged out from backend.");
      }
    } catch (error) {
      console.error("Backend logout failed:", error);
      // 即使后端登出失败，也要清除本地状态，以确保前端登出行为一致
      // 您可以在这里添加一个 ElMessage 提示用户后端登出失败
      // ElMessage.error("登出失败。请稍后重试。");
    } finally {
      // 无论后端 API 成功与否，都清除本地状态和存储
      token.value = null
      userInfo.value = null
      isLoggedIn.value = false
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_info')
      localStorage.removeItem('login_timestamp'); // 移除时间戳
      
      // 登出后，清空并重新加载本地购物车
      const cartStore = useCartStore()
      cartStore.loadLocalCart()
    }
  }

   // ▼▼▼【新增】获取用户信息 action ▼▼▼
  async function fetchUserInfo() {
    if (!isLoggedIn.value || userInfo.value?.userId) { // 如果未登录或已存在用户ID，则不重复获取
      return;
    }
    try {
      const data = await getUserInfo(); // 调用接口
      userInfo.value = data; // 更新用户信息
      localStorage.setItem('user_info', JSON.stringify(data)); // 同时更新 localStorage
      console.log("User info fetched:", data);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      // 如果获取失败，可以清空用户信息或标记为未登录
      userInfo.value = null; 
      // authStore.handleLogout(); // 极端情况下，如果获取用户信息失败，可以强制登出
    }
  }

  return { token, userInfo, isLoggedIn, handleLogin, handleLogout }
})