import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
 
import enTranslation from './en.json';
import zhTranslation from './zh.json';

// 资源对象
const resources = {
  en: {
    translation: enTranslation
  },
  zh: {
    translation: zhTranslation
  }
};

i18n
  .use(LanguageDetector) // 自动检测浏览器语言
  .use(initReactI18next) // 将 i18n 实例传递给 react-i18next
  .init({
    resources,
    fallbackLng: 'en', // 如果当前语言没有对应的翻译，则使用该后备语言
    interpolation: {
      escapeValue: false // React 本身已具备 XSS 防护
    }
  });

export default i18n;