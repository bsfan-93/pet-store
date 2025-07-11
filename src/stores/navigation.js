import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNavigationStore = defineStore('navigation', () => {
  // State: 定义当前页面和产品ID
  const currentPage = ref('home')
  const currentProductId = ref(null)

  // Action: 定义一个可以被任何组件调用的、全局的导航函数
  function navigateTo(page, productId = null) {
    currentPage.value = page
    currentProductId.value = productId
    window.scrollTo(0, 0); // 切换页面时自动滚到顶部
  }

  // 将状态和方法暴露出去
  return { currentPage, currentProductId, navigateTo }
})