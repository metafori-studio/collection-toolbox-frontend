import { createI18n } from 'vue-i18n';

import { en as componentsEn, sk as componentsSk } from '@metafori/components';

import backendDefinedTranslations from './backend-defined-translations.json';
import sk from './sk.json';
import en from './en.json';

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'sk',
  fallbackLocale: 'sk',
  messages: {},
});

i18n.global.mergeLocaleMessage('sk', backendDefinedTranslations);
i18n.global.mergeLocaleMessage('sk', componentsSk);
i18n.global.mergeLocaleMessage('sk', sk);

i18n.global.mergeLocaleMessage('en', backendDefinedTranslations);
i18n.global.mergeLocaleMessage('en', componentsEn);
i18n.global.mergeLocaleMessage('en', en);

export default i18n;
