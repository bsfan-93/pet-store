import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login, logoutApi } from '../api' // 【修改】导入 logoutApi
import { useCartStore } from './cart' // 确保 useCartStore 正确导入

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('access_token') || null)
  const userInfo = ref(JSON.parse(localStorage.getItem('user_info')) || null)
  const isLoggedIn = computed(() => !!token.value)

  async function handleLogin(username, password) {
    const response = await login(username, password)
    token.value = response.access_token       // 更新 token 会自动让 isLoggedIn 变为 true
    userInfo.value = response.user_info
    localStorage.setItem('access_token', token.value)
    localStorage.setItem('user_info', JSON.stringify(userInfo.value))
    localStorage.setItem('login_timestamp', Date.now()); // 保存当前时间戳

    // 登录成功后，立即同步购物车
    const cartStore = useCartStore()
    await cartStore.syncCart()
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


  // async function fetchUserInfo() {
  //   if (!isLoggedIn.value || userInfo.value?.userId) {
  //     return;
  //   }
  //   try {
  //     const data = await getUserInfo();
  //     userInfo.value = data;
  //     localStorage.setItem('user_info', JSON.stringify(data));
  //     console.log("User info fetched:", data);
  //   } catch (error) {
  //     console.error("Failed to fetch user info:", error);
  //   }
  // }

  return { token, userInfo, isLoggedIn, handleLogin, handleLogout }
})