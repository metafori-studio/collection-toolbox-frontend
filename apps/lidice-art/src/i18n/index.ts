import { createI18n } from 'vue-i18n';

import { cs as csCommon, en as enCommon } from '@metafori/i18n';
import cs from './cs.json';
import en from './en.json';

const SUPPORTED_LANGS = ['cs', 'en'];

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: SUPPORTED_LANGS[0],
  fallbackLocale: SUPPORTED_LANGS[0],
  messages: {
    cs: {
      ...csCommon,
      ...cs,
    },
    en: {
      ...enCommon,
      ...en,
    },
  },
});

export default i18n;

export {
  SUPPORTED_LANGS,
};
