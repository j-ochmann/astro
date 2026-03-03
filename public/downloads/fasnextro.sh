#!/bin/bash
exec < /dev/tty

PROJECT_NAME="fasnextro"
mkdir -p $PROJECT_NAME && cd $PROJECT_NAME

# 1. pnpm Workspace & Safety Config
cat <<EOF > pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# Automatické schválení build skriptů pro Prismu a Esbuild
cat <<EOF > .npmrc
side-effects-cache=true
only-built-dependencies[]=@prisma/engines
only-built-dependencies[]=esbuild
only-built-dependencies[]=prisma
EOF

# 2. Root package.json
cat <<EOF > package.json
{
  "name": "fasnextro",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "biome check .",
    "lint:apply": "biome check --write --unsafe .",    "db:generate": "turbo run db:generate --filter=@repo/database",
    "db:push": "turbo run db:push --filter=@repo/database",
    "db:up": "docker compose up -d postgres-db-prod postgres-db-test inngest",
    "db:studio": "pnpm --filter @repo/database exec prisma studio"
  },
  "devDependencies": {
    "turbo": "latest",
    "@biomejs/biome": "latest",
    "typescript": "latest"
  }
}
EOF

# 3. Biome Config
cat <<EOF > biome.json
{
  "\$schema": "https://biomejs.dev/schemas/1.5.3/schema.json",
  "organizeImports": { "enabled": true },
  "linter": { "enabled": true, "rules": { "recommended": true } },
  "formatter": { "enabled": true, "indentStyle": "space", "lineWidth": 100 }
}
EOF
# 3.1 Turbo Config
cat <<EOF > turbo.json
{
  "\$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "db:generate": { "cache": false },
    "db:push": { "cache": false },
    "build": {
      "dependsOn": ["^build", "db:generate"],
      "outputs": ["dist/**", ".next/**", "out/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
EOF
# 4. Struktura složek
mkdir -p apps/fastify-api/src apps/astro-web
mkdir -p packages/database/prisma packages/database/src
mkdir -p packages/trpc/src
mkdir -p docker/postgres
# 5. Database Package (@repo/database) - PRISMA 7 READY
cat <<EOF > packages/database/package.json
{
  "name": "@repo/database",
  "version": "0.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push"
  },
  "dependencies": { "@prisma/client": "7.4.2" },
  "devDependencies": { "prisma": "7.4.2", "zod": "latest", "zod-prisma-types": "latest", "ts-node": "latest" }
}
EOF

# NOVINKA: Prisma 7 vyžaduje tento soubor místo url v schema.prisma
cat <<EOF > packages/database/prisma.config.mjs
import { defineConfig } from 'prisma'

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
EOF

cat <<EOF > packages/database/prisma/schema.prisma
datasource db {
  provider = "postgresql"
}

generator client {
  provider = "prisma-client-js"
}

generator zod {
  provider = "zod-prisma-types"
  output   = "../src/generated/zod"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
EOF

cat <<EOF > packages/database/src/index.ts
import { PrismaClient } from '@prisma/client';
export * from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
export const db = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
EOF

# 6. tRPC Package (@repo/trpc)
cat <<EOF > packages/trpc/package.json
{
  "name": "@repo/trpc",
  "version": "0.0.0",
  "main": "./src/index.ts",
  "dependencies": {
    "@trpc/server": "latest",
    "@repo/database": "workspace:*",
    "zod": "latest"
  }
}
EOF

cat <<EOF > packages/trpc/src/index.ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { db } from '@repo/database';

const t = initTRPC.create();
export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  getUsers: publicProcedure.query(async () => {
    return await db.user.findMany();
  }),
});
export type AppRouter = typeof appRouter;
EOF

# 7. Docker Compose
cat <<EOF > compose.yml
services:
  postgres-db-prod:
    image: postgres:16-alpine
    container_name: postgres-db-prod
    environment:
      POSTGRES_DB: main_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports: ["5432:5432"]
    volumes: ["./docker/postgres/prod_data:/var/lib/postgresql/data"]
  postgres-db-test:
    image: postgres:16-alpine
    container_name: postgres-db-test
    environment:
      POSTGRES_DB: test_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports: ["5433:5432"]
  inngest:
    image: inngest/inngest
    ports: ["8288:8288"]
    command: ["inngest", "dev", "-u", "http://fastify-api:3000/api/inngest"]
  fastify-api:
    build: { context: ., dockerfile: apps/fastify-api/Dockerfile }
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgresql://user:password@postgres-db-prod:5432/main_db
    depends_on: [postgres-db-prod]
EOF

# 8. Fastify App Files
cat <<EOF > apps/fastify-api/package.json
{
  "name": "fastify-api",
  "version": "0.0.0",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsup src/index.ts"
  },
  "dependencies": {
    "fastify": "latest",
    "@fastify/cors": "latest",
    "@trpc/server": "latest",
    "@repo/trpc": "workspace:*",
    "@repo/database": "workspace:*"
  },
  "devDependencies": { "tsx": "latest", "tsup": "latest" }
}
EOF

cat <<EOF > apps/fastify-api/src/index.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from '@repo/trpc';
import { db } from '@repo/database';

const server = Fastify({ logger: true });
server.register(cors, { origin: true });
server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: { 
    router: appRouter,
    createContext: () => ({ db })
  },
});
server.listen({ port: 3000, host: '0.0.0.0' }).catch(err => {
  server.log.error(err);
  process.exit(1);
});
EOF

# Inicializace Next.js
npx create-next-app@latest apps/next-app --ts --tailwind --no-eslint --app --src-dir --import-alias "@/*" --use-pnpm --skip-install
rm -rf apps/next-app/.git apps/next-app/.eslintrc.json
mkdir -p apps/next-app/src/lib

cat <<EOF > apps/next-app/src/lib/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@repo/trpc';

export const trpc = createTRPCReact<AppRouter>();
EOF

# 8.1 Dockerfile (Fastify)
cat <<EOF > apps/fastify-api/Dockerfile
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .
RUN turbo prune fastify-api --docker

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install
COPY --from=builder /app/out/full/ .
RUN npx turbo run db:generate
RUN npx turbo run build --filter=fastify-api
EXPOSE 3000
CMD ["node", "apps/fastify-api/dist/index.js"]
EOF

# 9. Spuštění a Instalace
pnpm install

# Start DB a inicializace
docker compose up -d postgres-db-prod postgres-db-test inngest
echo "Čekám na DB..." && sleep 5

# Lokální .env pro Prismu
echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/main_db\"" > packages/database/.env

# Prisma Push (nyní s prisma.config.ts)
pnpm --filter @repo/database run db:push

# Inicializace Astro (Starlight)
pnpm create astro@latest apps/astro-web --template starlight --no-install --no-git --typescript strict --skip-houston

# Finální propojení a úklid
pnpm install
npx @biomejs/biome check --write --unsafe .

echo "---------------------------------------------------"
echo "Fasnextro (Prisma 7 & pnpm 10) READY!"
echo "---------------------------------------------------"
