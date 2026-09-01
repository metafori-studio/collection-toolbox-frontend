/// <reference types="vite/client" />

// Declared surface of this app's build-time config.
//
// Every value below is inlined into the shipped bundle and is publicly
// readable. Nothing here is confidential -- see README.md.
interface ImportMetaEnv {
  /** API prefix, same-origin (e.g. "/api"). */
  readonly VITE_API_BASE: string;
  /** "true" serves fixtures from src/api/mock instead of the real API. */
  readonly VITE_USE_MOCK: string;
  /** Matomo host. Empty disables Matomo. */
  readonly VITE_MATOMO_HOST: string;
  /** Matomo site ID. Empty or non-positive disables Matomo. */
  readonly VITE_MATOMO_SITEID: string;
  /** Google Tag Manager container ID. Empty disables GTM. */
  readonly VITE_GTM_ID: string;
  /** URL-restricted public Mapbox token (pk.*). */
  readonly VITE_MAPBOX_TOKEN: string;
  /** Dev-server proxy target. Read by vite.config.ts only; never bundled. */
  readonly VITE_API_REMOTE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
