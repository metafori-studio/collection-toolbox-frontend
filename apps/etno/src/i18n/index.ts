import { createI18n } from 'vue-i18n';

import backendDefinedTranslations from './backend-defined-translations.json';

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'sk',
  fallbackLocale: 'sk',
  messages: {
    sk: {
      ...backendDefinedTranslations,
    },
    en: {
      ...backendDefinedTranslations,
    },
  },
});

export default i18n;
