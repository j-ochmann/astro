#!/bin/bash
export CI=true

PROJECT_NAME="fasnextro"
mkdir -p $PROJECT_NAME && cd $PROJECT_NAME

# --- 1. PNPM & WORKSPACE CONFIG ---
cat <<EOF > pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
EOF

cat <<EOF > .npmrc
side-effects-cache=true
only-built-dependencies[]=@prisma/engines
only-built-dependencies[]=esbuild
only-built-dependencies[]=prisma
EOF

# --- 2. ROOT PACKAGE.JSON ---
cat <<EOF > package.json
{
  "name": "fasnextro",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "biome check .",
    "lint:apply": "biome check --write --unsafe .",
    "db:generate": "turbo run db:generate --filter=@repo/database",
    "db:push": "turbo run db:push --filter=@repo/database",
    "db:up": "docker compose up -d postgres-db-prod inngest",
    "db:studio": "pnpm --filter @repo/database exec prisma studio"
  },
  "devDependencies": {
    "turbo": "latest",
    "@biomejs/biome": "latest",
    "typescript": "latest"
  }
}
EOF

# --- 3. TOOLS CONFIG (BIOME & TURBO) ---
cat <<EOF > biome.json
{
  "\$schema": "https://biomejs.dev/schemas/2.4.5/schema.json",
  "linter": { "enabled": true, "rules": { "recommended": true } },
  "formatter": { "enabled": true, "indentStyle": "space", "lineWidth": 100 },
  "assist": { "actions": { "source": { "organizeImports": "on" } } }
}
EOF

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
    "dev": { "cache": false, "persistent": true }
  }
}
EOF

# --- 4. DIRECTORY STRUCTURE ---
mkdir -p apps/fastify-api/src packages/database/prisma packages/database/src packages/trpc/src docker/postgres

# --- 5. DATABASE PACKAGE (@repo/database) ---
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
  "dependencies": { "@prisma/client": "7.4.2", "dotenv": "latest" },
  "devDependencies": { "prisma": "7.4.2", "zod": "latest", "zod-prisma-types": "latest" }
}
EOF

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
  "devDependencies": { "prisma": "7.4.2", "zod": "latest", "zod-prisma-types": "latest" }
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

# --- 6. TRPC PACKAGE (@repo/trpc) ---
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

# --- 7. DOCKER COMPOSE ---
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

# --- 8. FASTIFY APP ---
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

# --- 9. NEXT.JS SETUP ---
echo "Instaluji Next.js..."
npx create-next-app@latest apps/next-app --ts --tailwind --no-eslint --app --src-dir --import-alias "@/*" --use-pnpm --skip-install --no-git

cat <<EOF > apps/next-app/package.json
{
  "name": "next-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "@repo/trpc": "workspace:*",
    "@repo/database": "workspace:*",
    "@trpc/client": "latest",
    "@trpc/server": "latest",
    "@trpc/react-query": "latest",
    "@tanstack/react-query": "latest"
  }
}
EOF

# Vytvoření tRPC klienta pro Next.js
mkdir -p apps/next-app/src/lib/trpc
cat <<EOF > apps/next-app/src/lib/trpc/client.ts
'use client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@repo/trpc';
export const trpc = createTRPCReact<AppRouter>();
EOF

# --- 10. ASTRO SETUP ---
echo "Instaluji Astro..."
pnpm create astro@latest apps/astro-web --template starlight --no-install --no-git --typescript strict --skip-houston

cat <<EOF > apps/astro-web/package.json
{
  "name": "astro-web",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev -p 3002",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "latest",
    "@astrojs/starlight": "latest",
    "sharp": "latest",
    "@repo/trpc": "workspace:*",
    "@repo/database": "workspace:*",
    "@trpc/client": "latest"
  }
}
EOF

# --- 11. FINAL INSTALL & INIT ---
pnpm install

docker compose up -d postgres-db-prod inngest
echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/main_db\"" > .env
echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/main_db\"" > packages/database/.env
echo "Čekám na DB..." && sleep 5
pnpm --filter @repo/database run db:generate
pnpm --filter @repo/database run db:push
npx @biomejs/biome check --write --unsafe .

echo "---------------------------------------------------"
echo "Fasnextro (Full Monorepo) READY!"
echo "Next.js: http://localhost:3001"
echo "Astro:   http://localhost:3002"
echo "Fastify: http://localhost:3000"
echo "---------------------------------------------------"
