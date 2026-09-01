# Collection Toolbox frontend

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
- [`just`](https://github.com/casey/just) — used for encrypted local builds
- [`sops`](https://github.com/getsops/sops) — only needed to read or edit encrypted
  config, or to build `staging`/`production` locally. Not required for `npm run dev`.
- [`rage`](https://github.com/str4d/rage) — only needed to generate or inspect keys.
  SOPS does its own encryption, so day-to-day work does not need it.

## Setup

Install dependencies from the repo root:

```bash
npm i
```

## Environment variables

Config is split into three layers, per app and per environment
(`development`, `staging`, `production`):

```
apps/<app>/
  .env                     # shared defaults for every mode   (committed)
  .env.development         # per-mode public overrides         (committed)
  .env.staging
  .env.production
  secrets.development.env  # SOPS+age encrypted                (committed)
  secrets.staging.env
  secrets.production.env
  .env.local               # your machine only                 (gitignored)
```

Vite resolves them in this order, last wins:
`.env` → `.env.local` → `.env.<mode>` → `.env.<mode>.local` → `process.env.VITE_*`.
The build writes decrypted values to `.env.<mode>.local`. Vite loads this file
last. The build removes it when it finishes.

### These are not runtime secrets

Every app here is a **static SPA**. Vite inlines each `VITE_*` value into the
shipped JS bundle as a string literal, so **anything in this config is publicly
readable by anyone who loads the site**. Encryption keeps credentials out of a
public git repo; it does not hide them from users.

Consequences:

- Never put a value here that needs actual confidentiality. It belongs behind
  the backend API.
- `VITE_MAPBOX_TOKEN` must be a **URL-restricted public token** (`pk.*`).
  The URL restriction, not the encryption, is what protects the billing account.

| Variable | Layer | Description |
| --- | --- | --- |
| `VITE_API_BASE` | public | API path prefix (usually `/api`) |
| `VITE_API_REMOTE_URL` | public | Dev-proxy target for `etno`/`archeo`. Read by `vite.config.ts` only — never bundled |
| `VITE_USE_MOCK` | public | `true` serves fixtures instead of the API |
| `VITE_MATOMO_HOST` | public | Matomo host; empty disables Matomo |
| `VITE_MAPBOX_TOKEN` | encrypted | Mapbox token (`etno`, `archeo`) |
| `VITE_GTM_ID` | encrypted | GTM container ID; empty disables GTM |
| `VITE_MATOMO_SITEID` | encrypted | Matomo site ID |


### Build an app

Build an app with the matching age key:

```bash
just build archeo staging
```

The recipe decrypts `secrets.<mode>.env` to `.env.<mode>.local`, type-checks
the app and runs Vite. It removes the decrypted file when the command ends.

Every staging or production build needs the encrypted file and the matching age key.

### Working with secrets

Set your key once:

```bash
export SOPS_AGE_KEY_FILE=~/.config/sops/age/collection-toolbox-dev.agekey
```

Then edit encrypted files in place — SOPS opens `$EDITOR` and re-encrypts on save:

```bash
just edit archeo staging
just decrypt archeo staging
```

SOPS uses the `dotenv` type, so keys stay in plaintext and only values are
encrypted; diffs show *which* variable changed without revealing it.

### Keys

One keypair per environment, generated with `rage-keygen`, so a staging key
cannot decrypt production. These are age-format keys — [rage](https://github.com/str4d/rage)
is an implementation of the same format, so SOPS reads them natively and no rage
binary is needed at build time. Public keys live in [`.sops.yaml`](.sops.yaml). Private keys live in the infra
Ansible Vault (`ansible/vars/secrets.yml`, as
`frontend_age_key_{development,staging,production}`) and are mirrored into the
`SOPS_AGE_KEY` in the matching GitHub Environment on
`collection-toolbox-backend`.

First-time setup for the repo (run once, by one person):

```bash
../infra/scripts/bootstrap-frontend-secrets.sh
```

It generates the three keypairs, fills in `.sops.yaml`, creates the initial
encrypted files, and prints the steps for distributing the keys.

Local development only needs the `development` key, whose values are throwaway.

See the [frontend secrets runbook](https://github.com/metafori/infra/blob/main/runbooks/ansible/frontend-secrets.md) for setup, changes, rotation and deployment checks.

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

Build a specific app after you have set the matching age key:

```bash
just build etno development
```
