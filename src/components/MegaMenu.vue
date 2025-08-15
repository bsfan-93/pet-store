<!-- 下拉菜单组件，当鼠标悬停在“Shop”导航上时出现。 -->

<template>
  <div class="mega-menu" v-show="visible" v-if="menuData" @mouseenter="clearCloseTimer()" @mouseleave="$emit('close')">
    <ul class="menu-list">
      <li>
        <router-link to="/" @click="$emit('close')">All</router-link>
      </li>
      <li class="divider"></li>
      
      <li v-for="link in menuData.links" :key="link.id">
        <router-link :to="`/product/${link.goodId}`" @click="$emit('close')">
          {{ t('mega_menu.' + link.name.toLowerCase()) }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { getPhotoDetails } from '../api';

const { t } = useI18n();
const props = defineProps({
  visible: Boolean
});
const emit = defineEmits(['close']);

const menuData = ref(null);

const fetchMegaMenuData = async () => {
  if (menuData.value) return;
  try {
    const rawData = await getPhotoDetails(0);
    menuData.value = {
      links: rawData.map(item => ({ id: item.id, name: item.name, goodId: item.goodId })),
    };
  } catch (error) {
    console.error("在 MegaMenu 中获取数据失败:", error);
  }
};

const clearCloseTimer = inject('clearCloseTimer', () => {});

watch(() => props.visible, (newValue) => {
  if (newValue) {
    fetchMegaMenuData();
  }
});
</script>

<style scoped>
.mega-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 200px;
  background-color: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1001; /* 关键改动：确保z-index高于页眉的1000 */
  animation: fadeIn 0.3s ease-out;
  padding: 10px 0;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  padding: 0 20px;
}

.menu-list li a {
  display: block;
  padding: 12px 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.2s;
}

.menu-list li a:hover {
  color: var(--accent-color);
}

.divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 5px 0;
  padding: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 767px) {
  .mega-menu {
    display: none !important;
  }
}
</style>