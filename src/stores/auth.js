import { ref } from 'vue'
import { defineStore } from 'pinia'
import { login } from '../api' // 我们稍后会创建这个API函数

export const useAuthStore = defineStore('auth', () => {
  // State: 存储用户的token和信息
  const token = ref(localStorage.getItem('access_token') || null)
  const userInfo = ref(JSON.parse(localStorage.getItem('user_info')) || null)

  // Getter: 判断用户是否已登录
  const isLoggedIn = ref(!!token.value)

  // Action: 登录
  async function handleLogin(username, password) {
    const response = await login(username, password)
    
    // 从返参中获取关键信息
    token.value = response.access_token
    userInfo.value = response.user_info
    isLoggedIn.value = true

    // 将 token 和用户信息存入 localStorage，以便刷新页面后状态不丢失
    localStorage.setItem('access_token', token.value)
    localStorage.setItem('user_info', JSON.stringify(userInfo.value))
  }

  // Action: 登出
  function handleLogout() {
    token.value = null
    userInfo.value = null
    isLoggedIn.value = false
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_info')
  }

  return { token, userInfo, isLoggedIn, handleLogin, handleLogout }
})