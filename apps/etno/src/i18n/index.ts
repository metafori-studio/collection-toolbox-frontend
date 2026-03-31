import { createI18n } from 'vue-i18n';

import backendDefinedTranslations from './backend-defined-translations.json';
import sk from './sk.json';
import en from './en.json';

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'sk',
  fallbackLocale: 'sk',
  messages: {
    sk: {
      ...backendDefinedTranslations,
      ...sk,
    },
    en: {
      ...backendDefinedTranslations,
      ...en,
    },
  },
});

export default i18n;
