import { createI18n } from 'vue-i18n';

import backendSk from './backend-defined/sk.json';
import backendEn from './backend-defined/en.json';
import sk from './sk.json';
import en from './en.json';

const SUPPORTED_LANGS = ['sk', 'en'];

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'sk',
  fallbackLocale: 'sk',
  messages: {
    sk: {
      ...backendSk,
      ...sk,
    },
    en: {
      ...backendEn,
      ...en,
    },
  },
});

export default i18n;

export { SUPPORTED_LANGS };
