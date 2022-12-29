import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import i18nEn from './i18nEn.json';
import i18nEs from './i18Es.json';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: ['en'],
    debug: true,
    resources: {
      en: i18nEn,
      es: i18nEs,
    },
    interpolation: {
      escapeValue: true,
    },
  });

export default i18n;
