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

// 基础 URL
// 根据 PROD 环境变量决定使用哪个 BASE_URL
export const BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : ''; // 开发环境使用 Vite Proxy，所以这里为空字符串

// 图片基础 URL
// 开发环境和生产环境的图片URL也通过环境变量控制
export const IMAGE_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_IMAGE_BASE_URL_PROD
  : import.meta.env.VITE_IMAGE_BASE_URL; // 开发环境

const apiFetch = async (url, options = {}) => {
  const fullUrl = `${BASE_URL}${url}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem('access_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: defaultHeaders,
    });

    if (response.status === 401) {
      console.error("认证失败 (401). 强制登出。");
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('login_timestamp');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      if (response.status === 401) {
          console.error("认证失败或Token已过期。");
      }
      throw new Error(`网络响应错误: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success) {
      // 使用动态的 IMAGE_BASE_URL
      const imageBaseUrl = IMAGE_BASE_URL; // 【修改点】

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
              // 确保在拼接图片URL时，如果URL已经是完整的，则不再次拼接
              if (value.startsWith('http://') || value.startsWith('https://')) {
                newData[key] = value;
              } else {
                newData[key] = imageBaseUrl + value;
              }
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

export const logoutApi = () => {
  return apiFetch('/api/auth/token/logout', {
    method: 'DELETE',
  });
};

export const requestPasswordReset = (email) => {
  return apiFetch('/api/standalones/mail/reset', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
};

export const getUserOrders = () => {
  // 在API接口准备好之前，返回一个空的订单列表
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([]); // 直接返回空数组
    }, 100); // 模拟少量延迟
  });
};

// ▼▼▼ 【新增】聯繫我們頁面發送問題的 API 函數 ▼▼▼
export const sendContactMessage = (email, message) => {
  return apiFetch('/api/standalones/mail/question', {
    method: 'POST',
    body: JSON.stringify({ email, message })
  });
};

export const createCheckoutSession = (checkoutData) => {
  return apiFetch('/api/order/stripe/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify(checkoutData)
  });
};

export const getUserInfo = () => {
  return apiFetch('/api/admin/user/info');
};

// ▼▼▼ 【新增】用於處理整個購物車（商品陣列）的支付函數 ▼▼▼
export const createCartCheckoutSession = (checkoutItemsArray) => {
  // 注意：這裡我們呼叫一個新的後端接口，例如 'create-cart-checkout-session'
  return apiFetch('/api/order/stripe/create-cart-checkout-session', {
    method: 'POST',
    body: JSON.stringify(checkoutItemsArray) // 直接發送整個商品陣列
  });
};

// ▼▼▼ 请用这段代码替换您文件里现有的 trackOrder 函数 ▼▼▼
export const trackOrder = (trackingNumber) => {
  // 模拟 API 延迟和逻辑
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 为了演示，我们假设只有 '123456' 是正确的订单号
      if (trackingNumber === '123456') {
        resolve([
          {
            timestamp: '08-04 11:11',
            title: '已揽件',
            description: '顺丰速运已收取快递，您的期待，我们定竭诚守护，不负所托',
          },
          {
            timestamp: '08-04 11:11',
            title: '运输中',
            description: '快递在[南京转运中心]完成分拣，准备发往下一站',
          }
        ]);
      } else {
        // 如果订单号不正确，则返回错误
        reject(new Error('Order not found. Please check the tracking number.'));
      }
    }, 1500); // 模拟 1.5 秒的网络延迟
  });
};

// 【新增】获取 InteractiveShowcase 数据
export const getShowcaseData = () => {
  return apiFetch(`/api/standalones/photo/details?type=10`);
};

// ▼▼▼ START: 在文件末尾追加此函数 ▼▼▼
export const getAllGoods = () => {
  // 我们复用 searchGoods 接口，传入一个空字符串通常会返回所有商品
  return searchGoods('');
};
// ▲▲▲ END: 追加函数 ▲▲▲