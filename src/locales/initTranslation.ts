import i18n, { TFunction } from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import * as yup from 'yup';

import en from './en.json';
// import ru from './ru.json';
import th from './th.json';

const langs = {
  en,
  // ru,
  th,
};

export const langsKeys = Object.keys(langs);

// https://github.com/jquense/yup/blob/b940eef48eb7456622ae384d0ffa7363d4fbad25/src/locale.ts#L94
export function buildYupLocale(_: unknown, t: TFunction): void {
  yup.setLocale({
    mixed: {
      required: t('required').toString(),
    },
    number: {
      moreThan: t('moreThan').toString(),
      lessThan: t('lessThan').toString(),
    },
    string: { max: t('max').toString(), length: t('length').toString() },
  });
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: ['en'],
    resources: langs,
    interpolation: {
      escapeValue: true,
    },
  }, buildYupLocale);

if (!langsKeys.includes(i18n.language)) {
  i18n.changeLanguage('en');
}

export default i18n;
