// src/api/index.js

import CryptoJS from 'crypto-js';

// 加密函数 (保持不变)
const encryptPassword = (password) => {
  const keyWord = import.meta.env.VITE_PWD_ENC_KEY;
  if (!keyWord) {
    console.error("加密密钥 VITE_PWD_ENC_KEY 未在 .env 文件中设置!");
    return password;
  }
  const key = CryptoJS.enc.Utf8.parse(keyWord);
  
  const encrypted = CryptoJS.AES.encrypt(password, key, {
    iv: key,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding,
  });
  
  return encrypted.toString();
};

// 基础 URL (保持不变)
const BASE_URL = import.meta.env.PROD ? 'http://your-production-api-server.com' : '';

// ▼▼▼【修改 1/2】对 apiFetch 函数进行增强 ▼▼▼
const apiFetch = async (url, options = {}) => {
  const fullUrl = `${BASE_URL}${url}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 【新增】自动从 localStorage 获取 token
  const token = localStorage.getItem('access_token');
  if (token) {
    // 【新增】如果 token 存在，就添加到请求头中
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: defaultHeaders,
    });

    // ▼▼▼【新增这个代码块来处理401错误】▼▼▼
    if (response.status === 401) {
      console.error("认证失败 (401). 强制登出。");
      // 在这里我们不能使用 Pinia 的 store，最稳妥的方式是直接清理存储并刷新页面
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('login_timestamp');
      window.location.href = '/login'; // 强制跳转到登录页
      throw new Error('Unauthorized');
    }
    // ▲▲▲ 新增代码块结束 ▲▲▲

    if (!response.ok) {
      // 如果是401错误，可以在这里进行统一处理，比如跳转到登录页
      if (response.status === 401) {
          console.error("认证失败或Token已过期。");
      }
      throw new Error(`网络响应错误: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success) {
      const imageBaseUrl = 'http://192.168.2.9:9999';
      
      const processData = (data) => {
        if (!data) return data;
        if (Array.isArray(data)) {
          return data.map(item => processData(item));
        }
        if (typeof data === 'object') {
          const newData = {};
          for (const key in data) {
            const value = data[key];
            if (key === 'url' && typeof value === 'string') {
              newData[key] = imageBaseUrl + value;
            } else {
              newData[key] = processData(value);
            }
          }
          return newData;
        }
        return data;
      };

      return processData(result.data);

    } else {
      throw new Error(result.msg || 'API请求失败');
    }
  } catch (error) {
    console.error(`API请求失败: ${url}`, error);
    throw error;
  }
};


// --- 您原有的 API 函数 (保持不变) ---

export const getPhotoDetails = (type) => {
  return apiFetch(`/api/standalones/photo/details?type=${type}`);
};

export const searchGoods = (name) => {
  return apiFetch('/api/standalones/good/search', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
};

export const subscribeMail = (email) => {
  return apiFetch('/api/standalones/mail/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const getGoodDetail = (goodId) => {
  return apiFetch(`/api/standalones/good/detail/${goodId}`);
};

export const login = async (username, password) => {
  const fullUrl = `${BASE_URL}/api/auth/oauth2/token`;
  const encryptedPassword = encryptPassword(password);

  const details = {
    'grant_type': 'password',
    'scope': 'server',
    'username': username,
    'password': encryptedPassword 
  };

  let formBody = [];
  for (const property in details) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': 'Basic dGVzdDp0ZXN0' 
      },
      body: formBody
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMsg = errorData?.msg || `登录失败: ${response.statusText}`;
      throw new Error(errorMsg);
    }

    return await response.json();

  } catch (error) {
    console.error(`登录API请求失败:`, error);
    throw error;
  }
};

export const getCartItems = () => {
  return apiFetch('/api/order/cart-item/myGoods');
};

export const addToCart = (cartItem) => {
  return apiFetch('/api/order/cart-item/', {
    method: 'POST',
    body: JSON.stringify(cartItem)
  });
};

export const updateCartItem = (cartItem) => {
  return apiFetch('/api/order/cart-item/', {
    method: 'PUT',
    body: JSON.stringify(cartItem)
  });
};

export const deleteCartItems = (ids) => {
  return apiFetch('/api/order/cart-item/', {
    method: 'DELETE',
    body: JSON.stringify(ids)
  });
};

export const registerUser = (userData) => {
  const { name, email, password } = userData;
  
  const payload = {
    nickname: name,
    email: email,
    password: password
  };

  return apiFetch('/api/standalones/register/email', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

// ▼▼▼【新增】登出接口 ▼▼▼
export const logoutApi = () => {
  return apiFetch('/api/auth/token/logout', { // 使用 /api 前缀以匹配 vite.config.js 中的代理规则
    method: 'DELETE',
  });
};

export const createCheckoutSession = (checkoutData) => { // 接收一个对象，不是数组
  return apiFetch('/api/order/stripe/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify(checkoutData) 
  });
};

// ▼▼▼【新增】获取用户信息接口 ▼▼▼
export const getUserInfo = () => {
  return apiFetch('/api/admin/user/info'); // 使用 /api 前缀以匹配 vite.config.js 中的代理规则
};