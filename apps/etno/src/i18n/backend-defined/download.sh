DIR="$(cd "$(dirname "$0")" && pwd)"

curl https://etno.metafori.com/api/etno/translations \
  --header "Accept: application/json" \
  --header "Accept-Language: sk" \
  --output "$DIR/sk.json"

curl https://etno.metafori.com/api/etno/translations \
  --header "Accept: application/json" \
  --header "Accept-Language: en" \
  --output "$DIR/en.json"
