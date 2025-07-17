import { createRouter, createWebHistory } from 'vue-router';

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
    component: MyAccountPage 
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
    // 定义带有动态参数 'id' 的路由
    path: '/product/:id', 
    name: 'ProductDetail', 
    component: ProductDetailPage,
    // 将路由参数作为 props 传递给组件，简化 ProductDetailPage 的逻辑
    props: true 
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

export default router;