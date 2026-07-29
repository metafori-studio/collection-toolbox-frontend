# Collection Toolbox Frontend

Monorepo for Metafori collection frontends. Built with Vue 3, Vite, and TypeScript, using npm workspaces.

## Structure

### Apps

| App | Path | Package |
| --- | --- | --- |
| **Etnoskop** | `apps/etno` | `@metafori/etno-frontend` |
| **Archeomap** | `apps/archeo` | `@metafori/archeo-frontend` |
| **Lidice Memorial** | `apps/lidice-memorial` | `@metafori/lidice-memorial` |
| **Lidice Art Collection** | `apps/lidice-art` | `@metafori/lidice-art` |

Each app is a standalone Vite project. Apps share UI and utilities from the packages below.

### Packages

| Package | Path | Description |
| --- | --- | --- |
| `@metafori/components` | `packages/components` | Shared Vue components (Storybook available) |
| `@metafori/shared` | `packages/shared` | Shared utilities (analytics, routing helpers, etc.) |
| `@metafori/i18n` | `packages/i18n` | i18n tooling and shared translations |

## Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`

## Setup

Install dependencies from the repo root:

```bash
npm i
```

## Environment variables

Each app has its own `.env` file under `apps/<app-name>/`. Copy or edit values there, or create a `.env.local` in the same folder for machine-specific overrides (`.env.local` is gitignored).

Common variables:

| Variable | Description |
| --- | --- |
| `VITE_API_REMOTE_URL` | Collection Toolbox backend URL (used by the Vite dev proxy in `etno` and `archeo`) |
| `VITE_API_BASE` | API path prefix (usually `/api`) |
| `VITE_USE_MOCK` | Set to `true` to use mock data instead of the API |
| `VITE_MAPBOX_TOKEN` | Mapbox access token (`etno`, `archeo`) |
| `VITE_GTM_ID` | Google Tag Manager container ID |
| `VITE_MATOMO_HOST` | Matomo analytics host |
| `VITE_MATOMO_SITEID` | Matomo site ID |

Example local override (`apps/etno/.env.local`):

```env
VITE_API_REMOTE_URL=http://127.0.0.1:8000/
VITE_API_BASE=/api
VITE_MAPBOX_TOKEN=your-token-here
```

Restart the dev server after changing env files.

## Development

Run the dev server for a specific app from the repo root:

```bash
npm run dev -w @metafori/etno-frontend
npm run dev -w @metafori/archeo-frontend
npm run dev -w @metafori/lidice-memorial
npm run dev -w @metafori/lidice-art
```

Or `cd` into an app and run `npm run dev` directly.

To work on the shared component library:

```bash
npm run storybook -w @metafori/components
```

## Other scripts

From the repo root:

```bash
npm run lint        # lint all workspaces
npm run type-check  # type-check all workspaces
npm run test:run    # run tests in workspaces that define them
npm run check       # lint + type-check + test
```

Build a specific app:

```bash
npm run build -w @metafori/etno-frontend
```
