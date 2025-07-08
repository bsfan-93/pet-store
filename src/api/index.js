// src/api/index.js

/**
 * 基础URL，所有API请求的前缀。
 * 在开发环境中，我们使用一个空字符串，因为Vite的代理会处理转发。
 * 在生产环境中，这里应该替换成你部署的后端服务的真实地址。
 */
const BASE_URL = import.meta.env.PROD ? 'http://your-production-api-server.com' : '';

/**
 * 封装的fetch函数，用于处理API请求。
 * @param {string} url - 请求的相对路径。
 * @param {object} options - fetch函数的配置选项 (例如 method, headers, body)。
 * @returns {Promise<any>} - 返回从API获取的数据。
 */
const apiFetch = async (url, options = {}) => {
  const fullUrl = `${BASE_URL}${url}`;
  
  // 统一设置请求头，如果需要的话
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
      // 如果服务器响应了非2xx的状态码，我们抛出一个错误
      throw new Error(`网络响应错误: ${response.statusText}`);
    }

    const result = await response.json();

    // 假设所有成功的请求都遵循 { success: boolean, data: any, msg: string } 的格式
    if (result.success) {
      // 为使用更方便，我们直接返回data部分
      // 同时，我们将图片的URL在这里拼接好
      if (Array.isArray(result.data)) {
        const imageBaseUrl = 'http://192.168.2.9:9999'; // 这个IP地址只在这里出现一次
        return result.data.map(item => ({
          ...item,
          // 检查item是否有url属性，如果有，则拼接
          ...(item.url && { url: imageBaseUrl + item.url })
        }));
      }
      return result.data;
    } else {
      // 如果API返回 { success: false }，我们也将其视为一个错误
      throw new Error(result.msg || 'API请求失败');
    }
  } catch (error) {
    console.error(`API请求失败: ${url}`, error);
    // 向上抛出错误，以便调用它的组件可以捕获并处理
    throw error;
  }
};

// --- 导出具体的API请求函数 ---

// 获取照片详情 (用于MegaMenu, Banner, Collection, Gallery, HowTo)
export const getPhotoDetails = (type) => {
  return apiFetch(`/standalones/photo/details?type=${type}`);
};

// 搜索商品
export const searchGoods = (name) => {
  return apiFetch('/standalones/good/search', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
};

// 邮件订阅
export const subscribeMail = (email) => {
  return apiFetch('/standalones/mail/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};