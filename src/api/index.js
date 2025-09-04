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

// 基础 URL 和图片 URL (保持不变)
export const BASE_URL = import.meta.env.PROD ? import.meta.env.VITE_API_BASE_URL_PROD : '';
export const IMAGE_BASE_URL = import.meta.env.PROD ? import.meta.env.VITE_IMAGE_BASE_URL_PROD : import.meta.env.VITE_IMAGE_BASE_URL;

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
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.msg || `网络响应错误: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    
    const result = await response.json();

    if (result.success) {
      const imageBaseUrl = IMAGE_BASE_URL;
      const processData = (data) => {
        const dataToProcess = data && data.records ? data.records : data;

        if (!dataToProcess) return dataToProcess;
        if (Array.isArray(dataToProcess)) {
          return dataToProcess.map(item => processData(item));
        }
        if (typeof dataToProcess === 'object' && dataToProcess !== null) {
          const newData = {};
          for (const key in dataToProcess) {
            const value = dataToProcess[key];
            if ((key === 'url' || key === 'coverImageUrl') && typeof value === 'string' && !value.startsWith('http')) {
              newData[key] = imageBaseUrl + value;
            } else {
              newData[key] = processData(value);
            }
          }
          return newData;
        }
        return dataToProcess;
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

// 【最终确认版】根据您提供的最新接口截图，使用正确的参数名
export const getGoodsByPage = (categoryId = 0, isAsc = true) => {
  // 根据接口文档，必需的参数有 categoryId, orders, 和 asc
  const url = `/api/standalones/good/page?categoryId=${categoryId}&orders=price&asc=${isAsc}`;
  
  return apiFetch(url, {
    method: 'GET',
  });
};

export const getAllCategories = () => {
  return apiFetch('/api/standalones/category/all');
};

export const searchGoods = (name) => {
  return apiFetch('/api/standalones/good/search', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
};

export const getGoodDetail = (goodId) => {
  return apiFetch(`/api/standalones/good/detail/${goodId}`);
};

// --- 静态内容 API ---
export const getPhotoDetails = (type) => {
  return apiFetch(`/api/standalones/photo/details?type=${type}`);
};

export const getShowcaseData = () => {
  return apiFetch(`/api/standalones/photo/details?type=10`);
};

// --- 用户认证和账户 API ---
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
    formBody.push(`${encodedKey}=${encodedValue}`);
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
      throw new Error(errorData?.msg || `登录失败: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`登录API请求失败:`, error);
    throw error;
  }
};

export const registerUser = (userData) => {
  return apiFetch('/api/standalones/register/email', {
    method: 'POST',
    body: JSON.stringify({
      nickname: userData.name,
      email: userData.email,
      password: userData.password
    })
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

export const getUserInfo = () => {
  return apiFetch('/api/admin/user/info');
};

// --- 购物车 API ---
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

// --- 订单和支付 API ---
export const createCheckoutSession = (checkoutData) => {
  return apiFetch('/api/order/stripe/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify(checkoutData)
  });
};

export const createCartCheckoutSession = (checkoutItemsArray) => {
  return apiFetch('/api/order/stripe/create-cart-checkout-session', {
    method: 'POST',
    body: JSON.stringify(checkoutItemsArray)
  });
};

export const getUserOrders = () => {
  return new Promise(resolve => setTimeout(() => resolve([]), 100));
};

export const trackOrder = (trackingNumber) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (trackingNumber === '123456') {
        resolve([{
          timestamp: '08-04 11:11',
          title: '已揽件',
          description: '顺丰速运已收取快递...',
        }, {
          timestamp: '08-04 11:11',
          title: '运输中',
          description: '快递在[南京转运中心]...',
        }]);
      } else {
        reject(new Error('Order not found.'));
      }
    }, 1500);
  });
};

// --- 其他 API ---
export const subscribeMail = (email) => {
  return apiFetch('/api/standalones/mail/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const sendContactMessage = (email, message) => {
  return apiFetch('/api/standalones/mail/question', {
    method: 'POST',
    body: JSON.stringify({ email, message })
  });
};