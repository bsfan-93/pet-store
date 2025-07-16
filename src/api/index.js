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

// 封装的 fetch 函数 (保持不变)
const apiFetch = async (url, options = {}) => {
  const fullUrl = `${BASE_URL}${url}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: defaultHeaders,
    });

    if (!response.ok) {
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


// ---【修改】更新所有 API 函数，在 URL 前面统一加上 /api 前缀 ---

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
  // 对于未使用 apiFetch 的原始 fetch 请求，同样需要加上 /api 前缀
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

// ---【修改】购物车相关的 API 函数 ---

export const getCartItems = () => {
  return apiFetch('/api/order/cart-item/');
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

// ---【修改】用户注册 API 函数 ---

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