#!/usr/bin/env sh
set -eu
DIR="$(cd "$(dirname "$0")" && pwd)"
URL="https://etno.metafori.com/api/etno/translations"

curl --fail --show-error --silent --location --retry 3 --connect-timeout 10 --max-time 15 \
  --header "Accept: application/json" \
  --header "Accept-Language: sk" \
  --output "$DIR/sk.json" \
  "$URL"
curl --fail --show-error --silent --location --retry 3 --connect-timeout 10 --max-time 15 \
  --header "Accept: application/json" \
  --header "Accept-Language: en" \
  --output "$DIR/en.json" \
  "$URL"
