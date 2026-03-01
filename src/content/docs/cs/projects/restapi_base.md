---
title: 'REST API & PostgreSQL'
sidebar:
  label: BASE
  order: 0
translation_status: original
---
```bash
mkdir dockerized-ts-pg   # Vytvoří složku projektu
cd dockerized-ts-pg      # Přesunete se do složky projektu

git init

cat << 'EOF' > .gitignore
node_modules/
dist/
build/
/prisma/migrations/
target/
venv/
.venv/
__pycache__/
*.py[cod]
*.env
.env
.env.*
!.env.example
*.pem
auth.json
Thumbs.db
.DS_Store
.vscode/
.idea/
.astro/
*.swp
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
EOF

cat << 'EOF' > .dockerignore
node_modules/
dist
.git
.env
EOF

cat .gitignore
cat .dockerignore
ls -la
npm init -y # Nastavení package.json
npm pkg set type="module"
npm pkg set scripts.build="tsc"
npm pkg set scripts.start="node dist/index.js"
npm pkg set scripts.dev="nodemon src/index.ts"
# Instalace TypeScriptu a vývojových nástrojů
npm install typescript ts-node nodemon @types/node --save-dev
npm install fastify @prisma/client@6
npm install prisma@6 --save-dev #6 nevyžaduje prisma.config.ts
npm audit fix --force
npx tsc --init #vytvoří tsconfig.json
npx prisma init --datasource-provider postgresql

cat << 'EOF' > tsconfig.json
{ /* laděno pro Node 20+ */
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "sourceMap": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
EOF
```

```bash
cat << 'EOF' > .env
POSTGRES_USER=johndoe
POSTGRES_PASSWORD=top-secret-pwd
POSTGRES_DB=dockerized_db
DATABASE_URL=postgresql://johndoe:top-secret-pwd@localhost:5432/dockerized_db?schema=public
EOF
```

```bash
cat << 'EOF' > Dockerfile
# Build fáze
FROM node:20-slim AS builder
WORKDIR /app
# Instalace systémových závislostí pro Prismu
RUN apt-get update -y && apt-get install -y openssl ca-certificates
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate
COPY . .
RUN npm run build
# Produkční fáze
FROM node:20-slim
WORKDIR /app
# I v produkci je potřeba openssl pro běh binárky Prismy
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
      - DATABASE_URL=${DATABASE_URL}
    ports:
      - "3000:3000"
    depends_on:
      - db
  db:
    image: postgres:16-alpine
    container_name: dockerized-ts-db
    restart: always
    ports:
      - "5432:5432" # V produkci zavřete!!!
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes: # Persistentní úložiště
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
EOF

mkdir -p src

cat << 'EOF' > src/index.ts
import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient(); // URL si bere automaticky z env DATABASE_URL

interface TodoBody {
  title: string;
}

// 1. Získání všech úkolů (GET)
fastify.get('/todos', async () => {
  return await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' }
  });
});

// 2. Vytvoření nového úkolu (POST)
fastify.post('/todos', async (request, reply) => {
  // Safe cast díky interface
  const { title } = request.body as TodoBody;

  if (!title) {
    return reply.status(400).send({ error: 'Title is required' });
  }

  const newTodo = await prisma.todo.create({
    data: { title }
  });

  return newTodo;
});

const start = async () => {
  try {
    // Fastify v3/4 vyžaduje objekt v listen
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log("API běží na portu 3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
EOF

cat << 'EOF' > prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Todo {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
}
EOF

cat Dockerfile
cat compose.yml
cat src/index.ts
cat prisma/schema.prisma

code .

# docker compose up -d --build
docker compose up -d db

echo "Čekám na dostupnost DB portu..."
while ! nc -z localhost 5432; do   
  sleep 0.5
done
echo "DB je online!"
npx prisma migrate dev --name init
docker compose up -d --build api
xdg-open http://localhost:3000/todos

git add .            # Přidá všechny soubory do "staging" oblasti
git commit -m "init" # Počáteční commit projektu
```

```bash
DATABASE_URL="postgresql://johndoe:top-secret-pwd@localhost:5432/dockerized_db?schema=public" npx prisma migrate dev --name init
```

```bash
EOF i po git rm -r --cached .

git add .

git commit --amend -m "fix gitignore"
```
