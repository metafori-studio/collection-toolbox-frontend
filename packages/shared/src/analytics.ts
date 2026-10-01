import { createGtm } from '@gtm-support/vue-gtm';
import { initMatomo } from '@certible/use-matomo';
import { type Router } from 'vue-router';

// Destructured at module scope. Vite statically replaces each token at build
// time, so these are literals in the shipped bundle -- there is no runtime
// lookup to swap out. Changing that would mean fetching config before mount.
const {
  PROD,
  VITE_GTM_ID,
  VITE_MATOMO_HOST,
  VITE_MATOMO_SITEID,
} = import.meta.env;

// GTM
const setupGtm = (router: Router) => {
  if (!PROD || !VITE_GTM_ID) {
    return;
  }
  return createGtm({
    enabled: true,
    id: VITE_GTM_ID,
    vueRouter: router,
  });
};

// Matomo
const setupMatomo = () => {
  const siteId = Number(VITE_MATOMO_SITEID);

  if (!PROD || !VITE_MATOMO_HOST || !Number.isInteger(siteId) || siteId <= 0) {
    return;
  }
  return initMatomo({
    host: VITE_MATOMO_HOST,
    siteId,
    trackRouter: true,
  });
};

export {
  setupGtm,
  setupMatomo,
};
