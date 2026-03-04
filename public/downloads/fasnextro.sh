#!/bin/bash
set -e
export PROJECT_NAME="fasnextro"
export DB_USER="johndoe"
export DB_PASS="secretpassword"
export DB_MAIN="main_db"
export DB_TEST="test_db"
export DB_URL_LOCAL="postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_MAIN}?schema=public"
export DB_MAIN_URL="postgresql://${DB_USER}:${DB_PASS}@postgres-db-main:5432/${DB_MAIN}?schema=public"
export DB_TEST_URL="postgresql://${DB_USER}:${DB_PASS}@postgres-db-main:5433/${DB_TEST}?schema=public"
export DB_MAIN_YML="postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_MAIN}?schema=public"
export DB_TEST_YML="postgresql://${DB_USER}:${DB_PASS}@localhost:5433/${DB_TEST}?schema=public"
export NEXT_PUBLIC_API_URL="http://localhost:3005"

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE}")" &>/dev/null && pwd -P)
TEMP_DIR="$SCRIPT_DIR/templates"

if [ ! -d "$TEMP_DIR" ]; then
    echo "Chyba: Složka '$TEMP_DIR' neexistuje!"
    exit 1
fi

mkdir -p "$PROJECT_NAME" && cd "$PROJECT_NAME"
mkdir -p \
  apps/fastify-api/src \
  apps/astro-web/src/lib \
  apps/astro-web/src/content/docs \
  apps/next-app/src/app \
  apps/next-app/src/lib/trpc \
  packages/database/prisma \
  packages/database/src \
  packages/trpc/src \
  docker/postgres
# --- DYNAMICKÉ SOUBORY (envsubst) ---
# Soubory, které obsahují $PROMĚNNÉ (šablony musí mít příponu .tmpl)
dyn_files=(
    ".env"
    "compose.yml"
    "apps/fastify-api/Dockerfile"
)

echo "Generuji dynamické konfigurace..."
for file in "${dyn_files[@]}"; do
    if [ -f "$TEMP_DIR/$file.tmpl" ]; then
        mkdir -p "$(dirname "$file")"
        envsubst < "$TEMP_DIR/$file.tmpl" > "$file"
    else
        echo "Varování: Šablona $file.tmpl nenalezena."
    fi
done
# --- STATICKÉ SOUBORY (cp) ---
static_files=(
    ".npmrc" ".gitignore" "pnpm-workspace.yaml" "biome.json" "package.json" "turbo.json"
    "packages/database/package.json" "packages/database/prisma.config.mjs"
    "packages/database/prisma/schema.prisma" "packages/database/src/index.ts"
    "packages/database/src/seed.ts" "packages/trpc/package.json"
    "packages/trpc/src/index.ts" "apps/astro-web/package.json"
    "apps/astro-web/src/lib/trpc.ts" "apps/astro-web/src/content/docs/index.mdx"
    "apps/next-app/package.json" "apps/next-app/src/app/layout.tsx"
    "apps/next-app/src/lib/trpc/client.ts" "apps/next-app/src/lib/trpc/Provider.tsx"
    "apps/fastify-api/package.json" "apps/fastify-api/src/index.ts"
)

echo "Kopíruji statické soubory..."
for file in "${static_files[@]}"; do
    if [ -f "$TEMP_DIR/$file" ]; then
        mkdir -p "$(dirname "$file")"
        cp "$TEMP_DIR/$file" "$file"
    else
        echo "Varování: Statický soubor $file nenalezen."
    fi
done

echo "Struktura pro $PROJECT_NAME připravena."

pnpm approve-builds @prisma/engines esbuild prisma sharp
npx create-next-app@latest apps/next-app --ts --tailwind --no-eslint --app --src-dir --import-alias "@/*" --use-pnpm --skip-install --no-git
pnpm create astro@latest apps/astro-web --template starlight --no-install --no-git --typescript strict --skip-houston
pnpm add -D dotenv-cli -w
pnpm add -D @types/react @types/react-dom @types/node -w
pnpm install
docker compose up -d postgres-db-main postgres-db-test inngest
sudo chown -R $USER:$USER .

echo "Čekám, až se DB proberou..."
until docker exec postgres-db-main pg_isready -U ${DB_USER}; do
  echo "postgres-db-main se ještě protahuje..."
  sleep 2
done

until docker exec postgres-db-test pg_isready -U ${DB_USER}; do
  echo "postgres-db-test se ještě protahuje..."
  sleep 2
done

pnpm --filter @repo/database add -D tsx
pnpm --filter @repo/database db:push
pnpm --filter @repo/database exec prisma db push --accept-data-loss
pnpm --filter @repo/database exec prisma generate

npx dotenv-cli -e .env -- pnpm --filter @repo/database exec prisma db push
npx dotenv-cli -e .env -- pnpm --filter @repo/database db:seed
cd packages/database
npx prisma db push --accept-data-loss
npx prisma generate
cd ../..

npx @biomejs/biome check --write --unsafe . || true
sudo chown -R $USER:$USER .
rm apps/next-app/pnpm-lock.yaml 2>/dev/null
pnpm add -D babel-plugin-react-compiler --filter next-app
pnpm --filter next-app add -D tailwindcss postcss autoprefixer @tailwindcss/forms @tailwindcss/typography
pnpm add -D @tailwindcss/postcss postcss tailwindcss --filter next-app
pnpm add -D @tailwindcss/postcss postcss tailwindcss -w
pnpm install
pnpm dev
npx dotenv-cli -e .env -- pnpm --filter @repo/database db:seed
npx dotenv-cli -e .env -- pnpm --filter @repo/database exec prisma studio --port 5555
rm -rf apps/next-app/.git
rm -rf apps/astro-web/.git
rm -rf apps/fastify-api/.git
git init
git add .
git commit -m "InitialSetup"
code .

echo "---------------------------------------------------"
echo "Fasnextro (Full Monorepo) READY!"
echo "Fastify: http://localhost:3005"
echo "Next.js: http://localhost:3001"
echo "Astro:   http://localhost:4322"
echo "---------------------------------------------------"