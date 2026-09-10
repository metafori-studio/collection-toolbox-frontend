set shell := ["sh", "-eu", "-c"]

default:
    @just --list

list:
    ls -1d apps/*/

edit app env:
    sops apps/{{app}}/secrets.{{env}}.env

decrypt app env:
    sops --decrypt apps/{{app}}/secrets.{{env}}.env

build app env:
    secrets_file="apps/{{app}}/secrets.{{env}}.env"; local_file="apps/{{app}}/.env.{{env}}.local"; trap 'rm -f "$local_file"' EXIT; sops --decrypt "$secrets_file" > "$local_file"; npm run type-check --workspace="apps/{{app}}"; npx vite build "apps/{{app}}" --mode "{{env}}"
