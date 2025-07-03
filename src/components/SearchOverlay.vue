<template>
  <div class="search-overlay" @click.self="close">
    <div class="search-content">
      <el-icon class="close-icon" @click="close"><Close /></el-icon>

      <div class="search-input-wrapper">
        <input 
          type="text" 
          class="search-input" 
          :placeholder="$t('search.placeholder')"
          v-model="searchQuery"
          ref="searchInputRef"
          autocomplete="off"
        >
        <el-icon class="search-icon"><Search /></el-icon>
      </div>

      <div class="search-results-list" v-if="searchResults.length > 0">
        <a v-for="item in searchResults" :key="item.id" :href="`/goods/${item.id}`" class="result-item">
          <img :src="item.url" :alt="item.name" class="result-image">
          <div class="result-info">
            <span class="result-name">{{ item.name }}</span>
            <span class="result-price">$ {{ item.price }}</span>
          </div>
        </a>
      </div>

      <div class="status-text" v-if="searchQuery && isLoading">{{ $t('search.loading') }}</div>
      <div class="status-text" v-if="searchQuery && !isLoading && searchResults.length === 0">{{ $t('search.no_results') }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const emit = defineEmits(['close']);

const searchQuery = ref('');
const searchResults = ref([]);
const isLoading = ref(false);
let debounceTimer = null;

const searchInputRef = ref(null);

// 组件挂载时，自动聚焦到输入框
onMounted(() => {
  searchInputRef.value?.focus();
});

const close = () => {
  emit('close');
};

// 使用 watch 监听搜索词的变化
watch(searchQuery, (newQuery) => {
  console.log(`1. Watcher 触发，新的搜索词是: "${newQuery}"`);

  clearTimeout(debounceTimer);

  if (!newQuery.trim()) {
    searchResults.value = [];
    return;
  }

  isLoading.value = true;

  // 在 watch 函数的 setTimeout 回调中
debounceTimer = setTimeout(async () => {
    console.log("2. SetTimeout 回调触发，准备执行fetch");

    // ▼▼▼ 用下面的 try...catch 代码块替换你现有的 ▼▼▼
    try {
      // POST请求的URL通常不带参数
      const searchUrl = `/standalones/good/search`;
      console.log("3. 即将请求的URL是:", searchUrl);

      const response = await fetch(searchUrl, {
        method: 'POST', // 1. 指定请求方法为 POST
        headers: {
          'Content-Type': 'application/json' // 2. 告诉服务器我们发送的是JSON格式的数据
        },
        // 3. 将搜索词作为JSON字符串放在请求体(body)中
        body: JSON.stringify({ name: newQuery }) 
      });

      console.log("4. Fetch 执行完毕，准备处理响应");

      if (!response.ok) throw new Error(`网络响应错误: ${response.statusText}`);

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const baseUrl = 'http://192.168.2.9:9999';
        searchResults.value = result.data.map(item => ({
          ...item,
          url: baseUrl + item.url
        }));
         console.log("5. 数据处理成功，结果已更新:", searchResults.value);
      } else {
        searchResults.value = [];
      }

    } catch (error) {
      console.error("在try-catch块中捕获到错误:", error);
      searchResults.value = [];
    } finally {
      isLoading.value = false;
    }
    // ▲▲▲ 替换结束 ▲▲▲

  }, 500); // 500毫秒延迟
});
</script>

<style scoped>
/* 样式完全按照你的截图设计 */
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.search-content {
  width: 100%;
  max-width: 600px;
  margin-top: 20vh;
}

.close-icon {
  position: absolute;
  top: 40px;
  right: 40px;
  font-size: 28px;
  color: #333;
  cursor: pointer;
}

.search-input-wrapper {
  position: relative;
  border-bottom: 2px solid #000;
}

.search-input {
  width: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 32px;
  line-height: 1.5;
  padding: 10px 0;
  padding-right: 50px;
}

.search-input::placeholder {
  color: #aaa;
}

.search-icon {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28px;
  color: #333;
}

.search-results-list {
  margin-top: 30px;
  max-height: calc(80vh - 200px); /* 限制最大高度，超出则滚动 */
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s;
}
.result-item:last-child {
  border-bottom: none;
}
.result-item:hover {
  background-color: #f7f7f7;
}

.result-image {
  width: 70px;
  height: 70px;
  object-fit: contain;
  margin-right: 20px;
  border-radius: 4px;
  flex-shrink: 0;
}

.result-info {
  display: flex;
  flex-direction: column;
}

.result-name {
  font-size: 16px;
  margin-bottom: 4px;
  font-weight: 500;
}

.result-price {
  font-size: 14px;
  color: #555;
  font-weight: bold;
}

.status-text {
  margin-top: 30px;
  text-align: center;
  color: #999;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>