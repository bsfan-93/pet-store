import CryptoJS from 'crypto-js'; // 1. 在文件顶部导入 crypto-js

// 2. 封装的加密函数
const encryptPassword = (password) => {
  // 从环境变量中读取密钥
  const keyWord = import.meta.env.VITE_PWD_ENC_KEY; 
  if (!keyWord) {
    console.error("加密密钥 VITE_PWD_ENC_KEY 未在 .env 文件中设置!");
    return password; // 如果没有密钥，返回原始密码以避免崩溃
  }
  const key = CryptoJS.enc.Utf8.parse(keyWord);
  
  // 加密过程
  const encrypted = CryptoJS.AES.encrypt(password, key, {
    iv: key,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding,
  });
  
  return encrypted.toString();
};


const BASE_URL = import.meta.env.PROD ? 'http://your-production-api-server.com' : '';

// 您现有的 apiFetch 函数 (保持不变)
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


// --- 您现有的其他API函数 (保持不变) ---

export const getPhotoDetails = (type) => {
  return apiFetch(`/standalones/photo/details?type=${type}`);
};

export const searchGoods = (name) => {
  return apiFetch('/standalones/good/search', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
};

export const subscribeMail = (email) => {
  return apiFetch('/standalones/mail/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const getGoodDetail = (goodId) => {
  return apiFetch(`/standalones/good/detail/${goodId}`);
};


// --- 3. 替换为您新的、包含加密逻辑的 login 函数 ---

export const login = async (username, password) => {
  const fullUrl = `${BASE_URL}/auth/oauth2/token`;
  const encryptedPassword = encryptPassword(password);

  const details = {
    'grant_type': 'password',
    'scope': 'server', // 根据您的截图，scope 应该是 'server'
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
        // ▼▼▼ 【新增】添加 Basic Auth 认证头 ▼▼▼
        'Authorization': 'Basic dGVzdDp0ZXN0' 
      },
      body: formBody
    });

    if (!response.ok) {
      // 尝试解析错误响应体
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

// =======================================================
// ▼▼▼ 【新增】购物车相关的API函数 ▼▼▼
// =======================================================

// 5. 查询购物车
export const getCartItems = () => {
  return apiFetch('/order/cart-item/');
};

// 2. 添加商品到购物车
export const addToCart = (cartItem) => {
  return apiFetch('/order/cart-item/', {
    method: 'POST',
    body: JSON.stringify(cartItem)
  });
};

// 3. 修改购物车商品数量
export const updateCartItem = (cartItem) => {
  return apiFetch('/order/cart-item/', {
    method: 'PUT',
    body: JSON.stringify(cartItem)
  });
};

// 4. 删除购物车商品 (支持批量删除)
export const deleteCartItems = (ids) => {
  return apiFetch('/order/cart-item/', {
    method: 'DELETE',
    body: JSON.stringify(ids)
  });
};

// ▼▼▼ 【新增】用户注册API函数 ▼▼▼
export const registerUser = (userData) => {
  // 从传入的 userData 中解构出需要发送的字段
  const { name, email, password } = userData;
  
  // 构造符合 API 要求的传参对象
  const payload = {
    nickname: name, // 将前端的 name 映射到后端的 nickname
    email: email,
    password: password
  };

  return apiFetch('/standalones/register/email', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};