import { createI18n } from 'vue-i18n';
import { sk as skCommon } from '@metafori/i18n';
import sk from './sk.json';

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'sk',
  fallbackLocale: 'sk',
  messages: {
    sk: {
      ...sk,
      ...skCommon,
    },
  },
  pluralRules: {
    sk: (choice) => {
      if (choice === 1) return 0;
      if (choice >= 2 && choice <= 4) return 1;
      return 2;
    },
  },
});

export default i18n;
