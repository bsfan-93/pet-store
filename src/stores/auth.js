import { ref } from 'vue'
import { defineStore } from 'pinia'
import { login } from '../api'
import { useCartStore } from './cart' // [!code focus]

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
    
    // [!code focus:start]
    // 登录成功后，立即同步购物车
    const cartStore = useCartStore()
    await cartStore.syncCart()
    // [!code focus:end]
  }

  function handleLogout() {
    token.value = null
    userInfo.value = null
    isLoggedIn.value = false
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_info')

    // [!code focus:start]
    // 登出后，清空并重新加载本地购物车
    const cartStore = useCartStore()
    cartStore.loadLocalCart()
    // [!code focus:end]
  }

  return { token, userInfo, isLoggedIn, handleLogin, handleLogout }
})