#!/bin/bash

# Ukončí skript při jakékoli chybě
set -e

# Barvy pro přehlednost
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Startuji přípravu projektu dockerized-ts-pg...${NC}"

# 1. Vytvoření struktury
mkdir -p dockerized-ts-pg/src dockerized-ts-pg/prisma
cd dockerized-ts-pg

# 2. Inicializace Git a environment souborů
git init

cat << 'EOF' > .gitignore
node_modules/
dist/
build/
/prisma/migrations/
.env
*.log
.DS_Store
EOF

cat << 'EOF' > .dockerignore
node_modules/
dist
.git
.env
EOF

cat << 'EOF' > .env
POSTGRES_USER=johndoe
POSTGRES_PASSWORD=top-secret-pwd
POSTGRES_DB=dockerized_db
COMPOSE_URL=postgresql://johndoe:top-secret-pwd@db:5432/dockerized_db?schema=public
DATABASE_URL=postgresql://johndoe:top-secret-pwd@localhost:5432/dockerized_db?schema=public
EOF

# 3. Instalace Node závislostí
echo -e "${GREEN}📦 Instaluji npm balíčky...${NC}"
npm init -y
npm pkg set type="module"
npm pkg set scripts.build="tsc"
npm pkg set scripts.start="node dist/index.js"
npm pkg set scripts.dev="nodemon src/index.ts"

npm install typescript ts-node nodemon @types/node --save-dev
npm install fastify @prisma/client@6
npm install prisma@6 --save-dev

# 4. Konfigurace TypeScriptu a Prismy
cat << 'EOF' > tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "sourceMap": true
  },
  "include": ["src/**/*"]
}
EOF

cat << 'EOF' > prisma/schema.prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql", url = env("DATABASE_URL") }

model Todo {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
}
EOF

# 5. Docker soubory
cat << 'EOF' > Dockerfile
FROM node:20-slim AS builder
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl ca-certificates
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl ca-certificates
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["npm", "run", "start"]
EOF

cat << 'EOF' > compose.yml
services:
  api:
    build: .
    container_name: dockerized-ts-api
    restart: always
    environment:
      - DATABASE_URL=${COMPOSE_URL}
    ports:
      - "3000:3000"
    depends_on:
      - db
  db:
    image: postgres:16-alpine
    container_name: dockerized-ts-db
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
EOF

# 6. Zdrojový kód aplikace
cat << 'EOF' > src/index.ts
import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

fastify.get('/todos', async () => {
  return await prisma.todo.findMany({ orderBy: { createdAt: 'desc' } });
});

fastify.post('/todos', async (request, reply) => {
  const { title } = request.body as { title: string };
  if (!title) return reply.status(400).send({ error: 'Title is required' });
  return await prisma.todo.create({ data: { title } });
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log("🚀 API běží na portu 3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
EOF

# 7. Spuštění infrastruktury
echo -e "${GREEN}🐳 Spouštím Docker kontejnery...${NC}"
docker compose up -d db

echo "Čekám na databázi (port 5432)..."
while ! nc -z localhost 5432; do   
  sleep 0.5
done

echo -e "${GREEN}💎 Spouštím Prisma migrace...${NC}"
npx prisma migrate dev --name init

echo -e "${GREEN}🏗️ Stavím a spouštím API...${NC}"
docker compose up -d --build api

# 8. Finální commit
git add .
git commit -m "Initial commit: Dockerized TS + Fastify + Prisma"

echo -e "${BLUE}✅ Hotovo! Projekt je připraven.${NC}"
echo -e "Zkuste: ${GREEN}curl http://localhost:3000/todos${NC}"
