import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources, type AppLanguages } from './resources';

const defaultLanguage: AppLanguages = 'zh';

const storedLanguage = (typeof window !== 'undefined'
  ? (localStorage.getItem('app-language') as AppLanguages | null)
  : null) ?? defaultLanguage;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: storedLanguage,
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('app-language', lng);
  }
});

export default i18n;
