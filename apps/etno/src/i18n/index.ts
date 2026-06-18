import { createI18n } from 'vue-i18n';

import { sk as skCommon, en as enCommon } from '@metafori/i18n';
import skBackend from './backend-defined/sk.json';
import enBackend from './backend-defined/en.json';
import sk from './sk.json';
import en from './en.json';

const SUPPORTED_LANGS = ['sk', 'en'] as const;
type SupportedLang = typeof SUPPORTED_LANGS[number];
const isSupportedLang = (lang: string): lang is SupportedLang =>
  (SUPPORTED_LANGS as readonly string[]).includes(lang);

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'sk',
  fallbackLocale: 'sk',
  messages: {
    sk: {
      ...skBackend,
      ...skCommon,
      ...sk,
    },
    en: {
      ...enBackend,
      ...enCommon,
      ...en,
    },
  },
});

export default i18n;

export { SUPPORTED_LANGS, isSupportedLang };
