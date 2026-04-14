import { createGtm } from '@gtm-support/vue-gtm';
import { initMatomo } from '@certible/use-matomo';
import router from '@/router';

const {
  PROD,
  VITE_GTM_ID,
  VITE_MATOMO_HOST,
  VITE_MATOMO_SITEID,
} = import.meta.env;

// GTM
const setupGtm = () => {
  const enabled = PROD && VITE_GTM_ID;
  if (!enabled) {
    return;
  }
  return createGtm({
    enabled: PROD && VITE_GTM_ID,
    id: VITE_GTM_ID as string,
    vueRouter: router,
  });
};

// Matomo
const setupMatomo = () => {
  const siteId = Number(VITE_MATOMO_SITEID);
  const enabled = PROD
    && VITE_MATOMO_HOST
    && Number.isInteger(siteId)
    && siteId > 0;

  if (!enabled) {
    return;
  }
  return initMatomo({
    host: VITE_MATOMO_HOST as string,
    siteId,
    trackRouter: true,
  });
};

export {
  setupGtm,
  setupMatomo,
};
