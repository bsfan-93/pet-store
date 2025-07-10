const BASE_URL = import.meta.env.PROD ? 'http://your-production-api-server.com' : '';

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


// --- 具体的API请求函数 ---

export const getPhotoDetails = (type) => {
  return apiFetch(`/standalones/photo/details?type=${type}`);
};

export const searchGoods = (name) => {
  return apiFetch('/standalones/good/search', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
};

// 【修正】确保 subscribeMail 函数只在这里定义一次
export const subscribeMail = (email) => {
  return apiFetch('/standalones/mail/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const getGoodDetail = (goodId) => {
  return apiFetch(`/standalones/good/detail/${goodId}`);
};