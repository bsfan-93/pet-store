<!-- 搜索 -->
<template>
  <div class="search-overlay" @click.self="close">
    <div class="search-content">
      <el-icon class="close-icon" @click="close"><Close /></el-icon>

      <div class="search-input-wrapper">
        <input 
          type="text" 
          class="search-input" 
          :placeholder="t('search.placeholder')"
          :value="searchQuery"
          @input="onInput"
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

      <div class="status-text" v-if="statusText">{{ statusText }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElIcon } from 'element-plus';
import { Close, Search } from '@element-plus/icons-vue';
import { searchGoods } from '../api';

const { t } = useI18n();
const emit = defineEmits(['close']);

const searchQuery = ref('');
const searchResults = ref([]);
const isLoading = ref(false);
const searchInputRef = ref(null);

// ▼▼▼【修改2】将状态文本统一管理 ▼▼▼
const statusText = computed(() => {
  if (isLoading.value) {
    return t('search.loading');
  }
  if (searchQuery.value && searchResults.value.length === 0) {
    return t('search.no_results');
  }
  return ''; // 默认无文本
});

const close = () => {
  emit('close');
};

// ▼▼▼【修改3】创建独立的 performSearch 函数 ▼▼▼
const performSearch = async (query) => {
  if (!query) {
    searchResults.value = [];
    isLoading.value = false;
    return;
  }
  
  isLoading.value = true;
  try {
    const results = await searchGoods(query);
    searchResults.value = results;
  } catch (error) {
    console.error("在SearchOverlay中捕获到错误:", error);
    searchResults.value = [];
  } finally {
    isLoading.value = false;
  }
};

// ▼▼▼【修改4】创建防抖函数 ▼▼▼
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

// 使用防抖包装我们的搜索函数
const debouncedSearch = debounce(performSearch, 500);

// ▼▼▼【修改5】创建输入事件处理器 ▼▼▼
const onInput = (event) => {
  const query = event.target.value;
  searchQuery.value = query; // 更新 ref 以便 :value 生效
  debouncedSearch(query.trim());
};


onMounted(() => {
  searchInputRef.value?.focus();
});
</script>

<style scoped>
/* 您的样式无需任何修改 */
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
  color: #000;
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
  color: #968C82;
}
.search-icon {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 28px;
  color: #000;
}
.search-results-list {
  margin-top: 30px;
  max-height: calc(80vh - 200px);
  overflow-y: auto;
  border: 1px solid #968C82;
  border-radius: 8px;
}
.result-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #968C82;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s;
}
.result-item:last-child {
  border-bottom: none;
}
.result-item:hover {
  background-color: #fff;
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
  color: #000;
  font-weight: bold;
}
.status-text {
  margin-top: 30px;
  text-align: center;
  color: #968C82;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 767px) {
  .search-content {
    margin-top: 15vh;
    padding: 0 20px;
  }
  .search-input {
    font-size: 24px; /* 縮小輸入框字體 */
  }
  .close-icon {
    top: 20px;
    right: 20px;
  }
}
</style>