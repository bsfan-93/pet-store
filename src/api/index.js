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

  // 在这里对密码进行加密
  const encryptedPassword = encryptPassword(password);

  const details = {
    'grant_type': 'password',
    'scope': 'password',
    'username': username,
    'password': encryptedPassword // 使用加密后的密码
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
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    });

    if (!response.ok) {
      throw new Error(`登录失败: ${response.statusText}`);
    }

    return await response.json();

  } catch (error) {
    console.error(`登录API请求失败:`, error);
    throw error;
  }
};