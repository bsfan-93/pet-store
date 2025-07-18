import { createI18n } from 'vue-i18n';

// 动态导入所有locales/*.json文件
const messages = Object.fromEntries(
  Object.entries(
    import.meta.glob('./locales/*.json', { eager: true }))
    .map(([key, value]) => {
      const jsonKey = key.substring(key.lastIndexOf('/') + 1, key.lastIndexOf('.'));
      return [jsonKey, value.default];
    })
);

const supportedLocales = Object.keys(messages);

// ▼▼▼ 【使用这个更严谨的函数】 ▼▼▼
const getStartingLocale = () => {
  // 1. 优先从用户上次的选择中读取
  const savedLocale = localStorage.getItem('user-language');
  if (savedLocale && supportedLocales.includes(savedLocale)) {
    return savedLocale;
  }
  
  const browserLang = navigator.language;

  // 2. 为中文地区做特别的、精确的映射
  const lowerBrowserLang = browserLang.toLowerCase();
  if (lowerBrowserLang === 'zh-cn' || lowerBrowserLang === 'zh') {
    return 'zh-Hans'; // 简体中文
  }
  if (lowerBrowserLang === 'zh-tw' || lowerBrowserLang === 'zh-hk') {
    return 'zh-Hant'; // 繁体中文
  }

  // 3. 为其他语言做通用匹配 (例如: 'en-US' -> 'en')
  const shortLang = browserLang.split('-')[0];
  if (supportedLocales.includes(shortLang)) {
      return shortLang;
  }

  // 4. 如果以上都失败，则使用默认的英语
  return 'en';
}
// ▲▲▲ 函数结束 ▲▲▲

const i18n = createI18n({
  legacy: false,
  locale: getStartingLocale(), // 使用新函数来设置初始语言
  fallbackLocale: 'en', 
  messages,
});

export default i18n;