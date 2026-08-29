#!/usr/bin/env bash
# Migraciones y tipos de Supabase.
#
# La base de datos de este proyecto solo publica una dirección IPv6, y el CLI de
# Supabase resuelve únicamente IPv4. Por eso todo pasa por el pooler de sesión,
# que sí tiene IPv4. Sin este rodeo, `supabase db push` falla con ENOTFOUND.
set -euo pipefail

cd "$(dirname "$0")/.."
[ -f .env.local ] || { echo "Falta .env.local"; exit 1; }
set -a; . ./.env.local; set +a

PASS=$(node -e 'process.stdout.write(encodeURIComponent(process.env.SUPABASE_DB_PASSWORD))')
URL="postgresql://postgres.${SUPABASE_PROJECT_REF}:${PASS}@${SUPABASE_POOLER_HOST}:5432/postgres"

case "${1:-}" in
  push)  supabase db push --db-url "$URL" --yes ;;
  tipos) supabase gen types typescript --db-url "$URL" --schema public > src/lib/supabase/tipos.ts
         echo "Tipos regenerados en src/lib/supabase/tipos.ts" ;;
  *)     echo "Uso: pnpm db:push | pnpm db:tipos"; exit 1 ;;
esac
