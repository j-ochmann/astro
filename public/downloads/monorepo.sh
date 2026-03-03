#!/bin/bash
# Zajištění interaktivity, pokud by bylo potřeba
exec < /dev/tty

PROJECT_NAME="fasnextro"
mkdir -p $PROJECT_NAME && cd $PROJECT_NAME

# 1. Root package.json
cat <<EOF > package.json
{
  "name": "fasnextro",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "biome check .",
    "lint:apply": "biome check --apply .",
    "format": "biome format --write .",
    "db:generate": "turbo run db:generate --filter=@repo/database",
    "db:push": "turbo run db:push --filter=@repo/database",
    "db:up": "docker compose up -d postgres-db-prod postgres-db-test inngest",
    "db:studio": "npx prisma studio --schema=packages/database/prisma/schema.prisma"
  },
  "devDependencies": {
    "turbo": "latest",
    "@biomejs/biome": "latest",
    "typescript": "latest"
  }
}
EOF

# 2. Biome Config
cat <<EOF > biome.json
{
  "\$schema": "https://biomejs.dev/schemas/1.5.3/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "lineWidth": 100
  }
}
EOF

# 3. Struktura složek
mkdir -p apps/fastify-api/src apps/astro-web apps/next-app
mkdir -p packages/database/prisma packages/trpc/src packages/config-typescript
mkdir -p docker/postgres

# 4. Database Package (@repo/database)
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
  "dependencies": {
    "@prisma/client": "latest"
  },
  "devDependencies": {
    "prisma": "latest",
    "zod": "latest",
    "zod-prisma-types": "latest"
  }
}
EOF

cat <<EOF > packages/database/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

generator zod {
  provider = "zod-prisma-types"
  output   = "./generated/zod"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
EOF

mkdir -p packages/database/src
cat <<EOF > packages/database/src/index.ts
import { PrismaClient } from '@prisma/client';
export * from '@prisma/client';
export * from '../prisma/generated/zod';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
EOF

# 5. tRPC Package (@repo/trpc)
cat <<EOF > packages/trpc/package.json
{
  "name": "@repo/trpc",
  "version": "0.0.0",
  "main": "./src/index.ts",
  "dependencies": {
    "@trpc/server": "latest",
    "@repo/database": "*",
    "zod": "latest"
  }
}
EOF

# 6. Docker Compose (Opraveno: přidána Test DB)
cat <<EOF > compose.yml
services:
  postgres-db-prod:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: main_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - ./docker/postgres/prod_data:/var/lib/postgresql/data

  postgres-db-test:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: test_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5433:5432"

  inngest:
    image: inngest/inngest
    ports:
      - "8288:8288"
    command: ["inngest", "dev", "-u", "http://fastify-api:3000/api/inngest"]

  fastify-api:
    build: 
      context: .
      dockerfile: apps/fastify-api/Dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:password@postgres-db-prod:5432/main_db
    depends_on:
      - postgres-db-prod
EOF

# 7. Turbo Config
cat <<EOF > turbo.json
{
  "\$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "db:generate": { "cache": false },
    "db:push": { "cache": false },
    "build": {
      "dependsOn": ["^build", "db:generate"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
EOF

# 8. Dockerfile (Fastify)
cat <<EOF > apps/fastify-api/Dockerfile
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune fastify-api --docker

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install
COPY --from=builder /app/out/full/ .
RUN npx turbo run db:generate
RUN npx turbo run build --filter=fastify-api
EXPOSE 3000
CMD ["node", "apps/fastify-api/dist/index.js"]
EOF

# 9. Instalace a start
npm install

# Vytvoření lokálního .env pro Prismu (aby npx prisma db push fungovalo hned)
echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/main_db\"" > packages/database/.env

echo "Spouštím Docker kontejnery..."
docker compose up -d postgres-db-prod postgres-db-test inngest

# Počkáme chvíli, než se Postgres probere
echo "Čekám na inicializaci databáze..."
sleep 5
echo "Provádím Prisma DB Push..."
npm run db:push
npm create astro@latest apps/astro-web -- --template starlight
npx create-next-app@latest apps/next-app --ts --tailwind --eslint --app --src-dir=false

cat <<EOF > apps/fastify-api/src/index.ts
import Fastify from 'fastify';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { db } from '@repo/database'; 

const fastify = Fastify({ logger: true });

async function start() {
  try {
    const userCount = await db.user.count();
    fastify.log.info(`V databázi je currently \${userCount} uživatelů.`);

    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
start();
EOF

rm apps/next-app/.eslintrc.json
npx @biomejs/biome check --apply .

cat <<EOF > apps/fastify-api/src/context.ts
import { db } from '@repo/database';
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export function createContext({ req, res }: CreateFastifyContextOptions) {
  // Zde lze přidat logiku pro JWT tokeny nebo Session
  return {
    db,
    req,
    res,
  };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
EOF

cat <<EOF > apps/fastify-api/src/index.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from '@repo/trpc';
import { createContext } from './context';

const server = Fastify({
  logger: true,
});

// Povolení CORS pro komunikaci mezi porty 3000 (API) a 3001 (Next) / 4321 (Astro)
server.register(cors, {
  origin: true, 
});

server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext,
  },
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Fastify API s tRPC běží na portu 3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
EOF

echo "---------------------------------------------------"
echo "Hotovo! Projekt $PROJECT_NAME je připraven."
echo "Pro spuštění vývoje: npm run dev"
echo "Pro Prisma Studio: npm run db:studio"
echo "---------------------------------------------------"
