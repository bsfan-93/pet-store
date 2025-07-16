// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';

// 导入所有需要作为页面的组件
// 这些之前都在 App.vue 中被导入
import HomePage from '../views/HomePage.vue';
import ProductDetailPage from '../views/ProductDetailPage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import AboutUsPage from '../views/AboutUsPage.vue';
import MyAccountPage from '../views/MyAccountPage.vue';
import FAQPage from '../views/FAQPage.vue';
import OrderTrackingPage from '../views/OrderTrackingPage.vue'; 

// 定义路由规则数组
// 这里的规则完全对应您之前在 App.vue 中的逻辑
const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/about', name: 'About', component: AboutUsPage },
  { path: '/faq', name: 'FAQ', component: FAQPage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/register', name: 'Register', component: RegisterPage },
  { path: '/account', name: 'MyAccount', component: MyAccountPage },
  { 
    path: '/product/:id', // 使用 :id 来定义动态路由参数
    name: 'ProductDetail', 
    component: ProductDetailPage,
    props: true // 这会将路由参数（如 id）作为 props 传递给组件
  },
  {
    path: '/tracking',
    name: 'OrderTracking',
    component: OrderTrackingPage
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 History 模式，URL 更美观
  routes, // 应用我们定义的路由规则
  // 每次切换路由时，都自动滚动到页面顶部
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
});

export default router;