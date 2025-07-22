import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth'; // 引入 auth store

// 导入所有页面组件
import HomePage from '../views/HomePage.vue';
import ProductDetailPage from '../views/ProductDetailPage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import AboutUsPage from '../views/AboutUsPage.vue';
import MyAccountPage from '../views/MyAccountPage.vue';
import FAQPage from '../views/FAQPage.vue';
import OrderTrackingPage from '../views/OrderTrackingPage.vue';
import ContactUsPage from '../views/ContactUsPage.vue';
import ReturnRefundPolicyPage from '../views/ReturnRefundPolicyPage.vue';
import AppPage from '../views/AppPage.vue';
import PlaceholderPage from '../views/PlaceholderPage.vue';

// 定义路由规则
const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: HomePage 
  },
  { 
    path: '/about', 
    name: 'About', 
    component: AboutUsPage 
  },
  { 
    path: '/faq', 
    name: 'FAQ', 
    component: FAQPage 
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: LoginPage 
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: RegisterPage 
  },
  { 
    path: '/account', 
    name: 'MyAccount', 
    component: MyAccountPage ,
    meta: { requiresAuth: true } // 将此路由标记为需要登录
  },
  { 
    path: '/tracking', 
    name: 'OrderTracking', 
    component: OrderTrackingPage 
  },
  // 2. 添加新的路由规则
  {
    path: '/contact',
    name: 'ContactUs',
    component: ContactUsPage
  },
  {
    path: '/order-tracking',
    name: 'OrderTracking',
    component: OrderTrackingPage
  },
  {
    path: '/return-policy',
    name: 'ReturnRefundPolicy',
    component: ReturnRefundPolicyPage
  },
  {
    path: '/app',
    name: 'App',
    component: AppPage
  },
  
  {
    path: '/product/:productId', // 使用动态路由匹配 :productId
    name: 'ProductDetail',
    component: ProductDetailPage,
    props: true // 这会将 URL 中的 :productId 作为 prop 传递给页面组件，非常方便
  },
  { 
    // 定义带有动态参数 'id' 的路由
    path: '/product/:id', 
    name: 'ProductDetail', 
    component: ProductDetailPage,
    // 将路由参数作为 props 传递给组件，简化 ProductDetailPage 的逻辑
    props: true 
  },
  {
    path: '/placeholder/:topic', // e.g., /placeholder/Blog
    name: 'Placeholder',
    component: PlaceholderPage,
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用 H5 History 模式
  routes,
  // 确保每次切换页面时都返回顶部
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

// ▼▼▼【新增这个导航守卫】▼▼▼
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // 检查目标路由是否需要认证，以及用户当前是否未登录
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // 如果是，则重定向到登录页
    next({ name: 'Login' });
  } else {
    // 否则，允许正常跳转
    next();
  }
});
// ▲▲▲ 导航守卫结束 ▲▲▲

export default router;