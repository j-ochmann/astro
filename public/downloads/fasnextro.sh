#!/bin/bash
export CI=true

PROJECT_NAME="fasnextro"
DB_USER="johndoe"
DB_PASS="secretpassword"
DB_MAIN="main_db"
DB_TEST="test_db"
DB_URL_LOCAL="postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_MAIN}?schema=public"

mkdir -p $PROJECT_NAME && cd $PROJECT_NAME

cat <<EOF > .env
PROJECT_NAME=${PROJECT_NAME}
DB_USER=${DB_USER}
DB_PASS=${DB_PASS}
DB_MAIN=${DB_MAIN}
DB_TEST=${DB_TEST}
DB_MAIN_URL=postgresql://${DB_USER}:${DB_PASS}@postgres-db-main:5432/${DB_MAIN}?schema=public
DB_TEST_URL=postgresql://${DB_USER}:${DB_PASS}@postgres-db-main:5433/${DB_TEST}?schema=public
DB_MAIN_YML=postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_MAIN}?schema=public
DB_TEST_YML=postgresql://${DB_USER}:${DB_PASS}@localhost:5433/${DB_TEST}?schema=public
DATABASE_URL="${DB_URL_LOCAL}"
NEXT_PUBLIC_API_URL=http://localhost:3005
EOF

export PROJECT_NAME DB_USER DB_PASS DB_MAIN DB_TEST DB_MAIN_URL DB_TEST_URL DB_MAIN_YML DB_TEST_YML NEXT_PUBLIC_API_URL
# export DATABASE_URL=$DB_MAIN_YML

cat <<'EOF' > pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
EOF

cat <<'EOF' > .npmrc
side-effects-cache=true
only-built-dependencies[]=@prisma/engines
only-built-dependencies[]=esbuild
only-built-dependencies[]=prisma
only-built-dependencies[]=sharp
EOF

pnpm approve-builds @prisma/engines esbuild prisma sharp

# --- 2. ROOT PACKAGE.JSON ---
cat <<'EOF' > package.json
{
  "name": "fasnextro",
  "private": true,
  "packageManager": "pnpm@10.30.3",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "biome check .",
    "lint:apply": "biome check --write --unsafe .",
    "db:generate": "turbo run db:generate --filter=@repo/database",
    "db:push": "turbo run db:push --filter=@repo/database",
    "db:up": "docker compose up -d postgres-db-main postgres-db-test inngest",
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
cat <<'EOF' > biome.json
{
  "$schema": "https://biomejs.dev/schemas/2.4.5/schema.json",
  "files": {
    "ignoreUnknown": true,
    "includes": [
      "**",
      "!!**/node_modules/**",
      "!!**/.next/**",
      "!!**/dist/**",
      "!!**/generated/**",
      "!!**/docker/**"
    ]
  },
  "linter": { "enabled": true, "rules": { "recommended": true } },
  "formatter": { "enabled": true, "indentStyle": "space", "lineWidth": 100, "formatWithErrors": true },
  "css": {
    "parser": { 
      "allowWrongLineComments": true,
      "tailwindDirectives": true 
    },
    "linter": { "enabled": false }
  },
  "overrides": [
    {
      "includes": ["*.css"],
      "linter": { "enabled": false }
    }
  ]
}
EOF

cat <<'EOF' > turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
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
cat <<'EOF' > packages/database/package.json
{
  "name": "@repo/database",
  "version": "0.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "db:push": "dotenv -e ../../.env -- prisma db push",
    "db:generate": "dotenv -e ../../.env -- prisma generate",
    "db:seed": "dotenv -e ../../.env -- tsx src/seed.ts"  },
  "dependencies": { "@prisma/client": "6.4.1", "dotenv": "latest", "zod": "latest" },
  "devDependencies": { "prisma": "6.4.1", "zod-prisma-types": "latest" }
}
EOF

cat <<'EOF' > packages/database/prisma.config.mjs
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export default {
  datasource: {
    url: process.env.DB_MAIN_URL
  }
};
EOF

cat <<'EOF' > packages/database/prisma/schema.prisma
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

cat <<'EOF' > packages/database/src/index.ts
import { PrismaClient } from '@prisma/client';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export * from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const dbUrl = process.env.DATABASE_URL || 
              process.env.DB_MAIN_YML || 
              `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:5432/${process.env.DB_MAIN}?schema=public`;
export const db = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
EOF

# --- 6. TRPC PACKAGE (@repo/trpc) ---
cat <<'EOF' > packages/trpc/package.json
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

cat <<'EOF' > packages/trpc/src/index.ts
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
cat <<'EOF' > compose.yml
services:
  postgres-db-main:
    image: postgres:16-alpine
    container_name: postgres-db-main
    environment:
      POSTGRES_DB: ${DB_MAIN}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASS}
    ports:
      - "5432:5432"
    volumes:
      - postgres_main_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_MAIN}"]
      interval: 5s
      timeout: 5s
      retries: 5

  postgres-db-test:
    image: postgres:16-alpine
    container_name: postgres-db-test
    environment:
      POSTGRES_DB: ${DB_TEST}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASS}
    ports:
      - "5433:5432"
    volumes:
      - postgres_test_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_TEST}"]
      interval: 5s
      timeout: 5s
      retries: 5

  fastify-api:
    container_name: ${PROJECT_NAME}-fastify-api
    build: 
      context: .
      dockerfile: apps/fastify-api/Dockerfile
    command: npx tsx watch apps/fastify-api/src/index.ts
    restart: on-failure
    ports:
      - "3005:3005"
    environment:
      DATABASE_URL: ${DB_MAIN_URL}
      
      INNGEST_EVENT_KEY: v1_your_key
    depends_on:
      postgres-db-main:
        condition: service_healthy
    volumes:
      - .:/app

  inngest:
    image: inngest/inngest
    container_name: ${PROJECT_NAME}-inngest
    restart: unless-stopped
    ports:
      - "8288:8288"
    command: ["inngest", "dev", "-u", "http://fastify-api:3005/api/inngest"]
    depends_on:
      - fastify-api

volumes:
  postgres_main_data: {}
  postgres_test_data: {}
EOF

# --- 8. FASTIFY APP ---
cat <<'EOF' > apps/fastify-api/package.json
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

cat <<'EOF' > apps/fastify-api/src/index.ts
import path from "node:path";
import cors from "@fastify/cors";
import { appRouter } from "@repo/trpc";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import dotenv from "dotenv";
import Fastify from "fastify";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const server = Fastify({ logger: true });

server.get('/', async () => {
  return { status: 'OK', message: 'Fasnextro API is running' };
});

async function start() {
  await server.register(cors, { origin: true });

  await server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      createContext: () => ({}),
    },
  });

  try {
    const port = Number(process.env.PORT) || 3005;
    await server.listen({ port, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
  if (err && typeof err === 'object' && 'code' in err && err.code === 'EADDRINUSE') {
      console.log('Port 3005 obsazen, zkouším 3006...');
      await server.listen({ port: 3006, host: '0.0.0.0' });
    } else {
      process.exit(1);
    }
  }
}
start();
EOF

cat <<'EOF' > apps/fastify-api/Dockerfile
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .
RUN turbo prune fastify-api --docker
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
COPY --from=builder /app/out/full/ .
RUN npx turbo run db:generate
RUN npx turbo run build --filter=fastify-api
EXPOSE 3005
CMD ["node", "apps/fastify-api/dist/index.js"]
EOF

# --- 9. NEXT.JS SETUP ---
echo "Instaluji Next.js..."
npx create-next-app@latest apps/next-app --ts --tailwind --no-eslint --app --src-dir --import-alias "@/*" --use-pnpm --skip-install --no-git

cat <<'EOF' > apps/next-app/package.json
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
cat <<'EOF' > apps/next-app/src/lib/trpc/client.ts
'use client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@repo/trpc';
export const trpc = createTRPCReact<AppRouter>();
EOF

# --- 10. ASTRO SETUP ---
echo "Instaluji Astro..."
pnpm create astro@latest apps/astro-web --template starlight --no-install --no-git --typescript strict --skip-houston

cat <<'EOF' > apps/astro-web/package.json
{
  "name": "astro-web",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev -p 4322",
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

cat <<'EOF' > apps/next-app/src/lib/trpc/Provider.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';
import { trpc } from './client';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: process.env.NEXT_PUBLIC_API_URL + '/trpc'
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
EOF

cat <<'EOF' > apps/next-app/src/app/layout.tsx
import { TRPCProvider } from '@/lib/trpc/Provider';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
EOF

# --- 11. FINAL INSTALL & INIT ---
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

# Důležité: Prisma potřebuje vidět URL přímo při pushi
npx dotenv-cli -e .env -- pnpm --filter @repo/database exec prisma db push
npx dotenv-cli -e .env -- pnpm --filter @repo/database db:seed
cd packages/database
npx prisma db push --accept-data-loss
npx prisma generate
cd ../..

# Biome check - s ignorováním chyb v CSS (aby skript pokračoval)
npx @biomejs/biome check --write --unsafe . || true

# Finální fix práv před startem devu
sudo chown -R $USER:$USER .

echo "---------------------------------------------------"
echo "Fasnextro (Full Monorepo) READY!"
echo "Fastify: http://localhost:3005"
echo "Next.js: http://localhost:3001"
echo "Astro:   http://localhost:4322"
echo "---------------------------------------------------"

# Smažeme lokální lockfile v aplikaci (pokud se tam vytvořil)
rm apps/next-app/pnpm-lock.yaml 2>/dev/null

# Instalace kompilátoru přes filtr z rootu
pnpm add -D babel-plugin-react-compiler --filter next-app

# A pak celková instalace a linkování
# pnpm approve-builds @prisma/engines esbuild prisma sharp
pnpm --filter next-app add -D tailwindcss postcss autoprefixer @tailwindcss/forms @tailwindcss/typography
pnpm add -D @tailwindcss/postcss postcss tailwindcss --filter next-app
pnpm add -D @tailwindcss/postcss postcss tailwindcss -w

pnpm install
pnpm dev

mkdir -p apps/astro-web/src/lib
cat <<'EOF' > apps/astro-web/src/lib/trpc.ts
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@repo/trpc';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3005/trpc',
    }),
  ],
});
EOF

mkdir -p apps/astro-web/src/content/docs
cat <<'EOF' > apps/astro-web/src/content/docs/index.mdx
---
title: Fasnextro Dokumentace
description: Moje tRPC data v Astru.
template: splash
---

import { trpc } from "../../../lib/trpc";
# import { trpc } from '../../lib/trpc';

## Data z API (tRPC)

{ /* Toto poběží na serveru při buildu nebo v SSR mode */ }
export const users = await trpc.getUsers.query()

<ul>
  {users.map(user => (
    <li key={user.id}>{user.name} ({user.email})</li>
  ))}
</ul>
EOF

mkdir -p packages/database/src
cat <<'EOF' > packages/database/src/seed.ts
import { db } from "./index";

async function main() {
  console.log("🌱 Startuji seedování databáze...");

  // Vyčistíme stávající data (volitelné)
  await db.user.deleteMany();

  const users = [
    { name: "Jindřich", email: "jindrich@example.com" },
    { name: "Jan", email: "jan@example.com" },
    { name: "Gemini", email: "gemini@ai.local" },
  ];

  for (const u of users) {
    const user = await db.user.create({
      data: u,
    });
    console.log(`✅ Vytvořen uživatel: ${user.name} (${user.id})`);
  }

  console.log("🏁 Seedování dokončeno!");
}

main()
  .catch((e) => {
    console.error("❌ Chyba při seedování:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
EOF

npx dotenv-cli -e .env -- pnpm --filter @repo/database db:seed

npx dotenv-cli -e .env -- pnpm --filter @repo/database exec prisma studio --port 5555