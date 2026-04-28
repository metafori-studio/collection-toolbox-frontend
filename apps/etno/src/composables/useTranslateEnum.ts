import { useI18n } from 'vue-i18n';

export function useTranslateEnum() {
  const { t } = useI18n();

  const translateEnum = (namespace: string, key?: string | null) => {
    if (!key) {
      return null;
    }
    return t(`enums.${namespace}.${key}`);
  };

  return {
    translateEnum,
  };
}
