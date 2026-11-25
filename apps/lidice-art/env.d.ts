/// <reference types="vite/client" />

// Declared surface of this app's build-time config.
//
// This is a static site with no API client; analytics is the only config it
// reads. Every value below is inlined into the shipped bundle.
interface ImportMetaEnv {
  /** Matomo host. Empty disables Matomo. */
  readonly VITE_MATOMO_HOST: string;
  /** Matomo site ID. Empty or non-positive disables Matomo. */
  readonly VITE_MATOMO_SITEID: string;
  /** Google Tag Manager container ID. Empty disables GTM. */
  readonly VITE_GTM_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
