/// <reference types="vite/client" />

// analytics.ts reads these. Each consuming app declares the same names in its
// own env.d.ts; they are repeated here so this package type-checks standalone.
interface ImportMetaEnv {
  readonly VITE_MATOMO_HOST: string;
  readonly VITE_MATOMO_SITEID: string;
  readonly VITE_GTM_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
