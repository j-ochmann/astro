---
title: 'Dockerized REST API & PostgreSQL'
sidebar:
  label: REST & SQL
  order: 1
translation_status: original
---

## 1. Lokální vývojové prostředí

Než to pošlete na server, musíte to rozběhat u sebe:

- **Node.js (LTS verze):** Nainstalujte si Node.js (ideálně verzi 20+).
- **Editor:** Visual Studio Code je průmyslový standard pro TypeScript.
- **Postman nebo Insomnia:** Nástroje pro testování vašich API endpointů (posílání GET/POST požadavků).

## 2. Technologie pro API (Knihovny)

V TypeScriptu nepište vše od nuly. Doporučuji „stack“:

- **Fastify:** Extrémně rychlý a moderní framework pro Node.js (nástupce Express.js).
- **Prisma (ORM):** To je ten nejdůležitější kousek. Prisma vám vygeneruje TypeScriptové typy přímo z vaší databáze. Už nikdy nebudete muset hádat, jaké sloupce máte v tabulce.
- **Zod:** Knihovna pro validaci dat, která přicházejí od uživatele (např. kontrola, zda je e-mail skutečně e-mail).

## 3. Struktura projektu (Co vytvořit v PC)

Vytvořte si složku pro svůj projekt a v ní tyto soubory:

1. **`package.json`** seznam knihoven
2. **`tsconfig.json`** nastavení TypeScriptu
3. **`schema.prisma`** Zde definujete své tabulky (např. User, Post).
4. **`Dockerfile`** Recept na zabalení tohoto API.
5. **`docker-compose.yml`** Spojí vaše API s Postgres kontejnerem.

## 4. Propojení s Nginx Proxy Managerem

Aby bylo API vidět na vaší doméně (např. api.moje-domena.cz):

V Nginx Proxy Manageru vytvoříte nový Proxy Host.

- **Domain Names:** api.moje-domena.cz
- **Forward IP:** Název vašeho API kontejneru (pokud jsou ve stejné Docker síti) nebo lokální IP serveru.
- **Forward Port:** Port, na kterém poběží vaše API (např. 3000).

## Inicializace projektu

Otevřete terminál a zadejte: `cd /cesta/k/vasemu/workspace`

## Instalace Gitu, Node.js a npm

```bash
sudo apt update
sudo apt upgrade
sudo apt install git nodejs npm
git --version
```

## Git Repozitář

- s univerzálním `.gitignore` pro bezpečnost

Tam, kde chcete složku projektu, zadejte:

```bash
mkdir dockerized-ts-pg   # Vytvoří složku projektu
cd dockerized-ts-pg      # Přesunete se do složky projektu

cat << 'EOF' > .gitignore 
# Jazyky a frameworky
node_modules/            # Závislosti pro JavaScript/Node.js
__pycache__/             # Kompilovaný Python kód
*.py[cod]                # Python soubory
.venv/                   # Virtuální prostředí Pythonu
venv/
target/                  # Buildy pro Rust/Java

# Bezpečnost (NEPUSHLOVAT!)
.env                     # API klíče, hesla a tajné proměnné
*.env
.env.*
!.env.example
*.pem                    # Soukromé klíče
auth.json                # Autentizační tokeny

# Operační systém a IDE
.DS_Store                # MacOS smetí
Thumbs.db                # Windows smetí
.vscode/                 # Nastavení VS Code (pokud ho nechcete sdílet)
.idea/                   # Nastavení JetBrains (PyCharm, IntelliJ)
*.swp                    # Dočasné soubory editoru Vim
.astro/
dist/                    # Výsledné buildy
build/
*.log                    # Logy aplikací
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store

# Prisma (vygenerované soubory, které se tvoří při buildu)
/prisma/migrations/
EOF

cat << 'EOF' >  'node_modules
dist
.git
.env' > .dockerignore
cat .gitignore
ls -la
git rm -r --cached .
git init             # Inicializuje Git v projektu
```

> **Tip:** Zkontrolujte, že se `.gitignore` vytvořil.

```bash
npm init -y # Nastavení package.json
npm pkg set type="module"
npm pkg set scripts.build="tsc"
npm pkg set scripts.start="node dist/index.js"
npm pkg set scripts.dev="nodemon src/index.ts"
# Instalace TypeScriptu a vývojových nástrojů
npm install typescript ts-node nodemon @types/node --save-dev
npm install fastify @prisma/client@latest
npm install prisma@latest --save-dev
npm audit fix --force
npx tsc --init       #vytvoří tsconfig.json
npx prisma init --datasource-provider postgresql
```

## Oprava `tsconfig.json`

```bash
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

<!-- ```bash
cat << 'EOF' > tsconfig.json
{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
    "rootDir": "./src",
    "outDir": "./dist",

    // Environment Settings
    // See also https://aka.ms/tsconfig/module
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "target": "esnext",
    "types": [],
    // For nodejs:
    // "lib": ["esnext"],
    // "types": ["node"],
    // and npm install -D @types/node

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Style Options
    // "noImplicitReturns": true,
    // "noImplicitOverride": true,
    // "noUnusedLocals": true,
    // "noUnusedParameters": true,
    // "noFallthroughCasesInSwitch": true,
    // "noPropertyAccessFromIndexSignature": true,

    // Recommended Options
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
EOF
``` -->

## Kontrola

Aby `docker-compose up` neselhal, ujistěte se, že v package.json máte definované tyto skripty, které Dockerfile volá:

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "nodemon src/index.ts"
}
```

## Heslo

⚠️ Změňte uživatelské jméno a heslo!

**.env** již máte v **.gitignore**.

```bash
cat << 'EOF' > .env
POSTGRES_USER=johndoe
POSTGRES_PASSWORD=top-secret-pwd
POSTGRES_DB=dockerized_db
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?schema=public
EOF
```
<!-- ```bash
cat << 'EOF' > .env
POSTGRES_USER=johndoe
POSTGRES_PASSWORD=top-secret-pwd
POSTGRES_DB=dockerized_db
DATABASE_URL=postgresql://johndoe:top-secret-pwd@db:5432/dockerized_db?schema=public
EOF
``` -->

## Dockerfile & compose.yml

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
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

// 1. Získání všech úkolů (GET)
fastify.get('/todos', async () => {
  return await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' }
  });
});

// 2. Vytvoření nového úkolu (POST)
fastify.post('/todos', async (request, reply) => {
  const { title } = request.body as { title: string };
  
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
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log("API běží 🏃‍♂️ na portu 3000");
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

cat << 'EOF' > prisma.config.ts
mport { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
EOF

cat Dockerfile
cat compose.yml
cat src/index.ts
cat prisma/schema.prisma
cat prisma.config.ts

npx prisma migrate dev --name init

git add .            # Přidá všechny soubory do "staging" oblasti
git commit -m "init" # Počáteční commit projektu

code .
```

## Dockerfile

```dockerfile

```

## Docker compose.yml

```yaml

```

## Jak to propojit s Nginx Proxy Managerem (NPM)

V NPM vytvořte nový Proxy Host s domain name např. `api.moje-domena.cz`

**Forward IP:** Zadejte buď lokální IP svého serveru (např. 192.168.1.50), nebo pokud máte NPM ve stejné Docker síti jako projekt, stačí název služby api.

**Forward Port:** 3000

V záložce SSL vygenerujte certifikát přes Let's Encrypt.

## Spuštění

V terminálu ve složce projektu stačí zadat:

```bash
# Sestaví obraz a spustí vše na pozadí
docker compose up -d --build
```

Pokud se objeví hláška:

```bash
unable to get image 'dockerized-ts-pg-api': permission denied while trying to connect to the docker API at unix:///var/run/docker.sock
```

Znamená, že Docker **daemon** běží pod **rootem** a nemáte přístup k **docker.sock**.

```bash
# rychlá oprava (přidání sudo)
sudo docker compose up -d --build
```

```bash
# trvalá oprava (přidání uživatele do skupiny)
sudo groupadd docker          # Vytvoří docker skupinu.
sudo usermod -aG docker $USER # Přidá uževatele.
newgrp docker                 # Aktivuje okamžitě.
docker ps                     # Otestuje.
```

## Co dále? (The Real Fun Begins)

Teď, když „trubky“ fungují, je čas jimi prohnat data. Další logický krok je:

1. **Definice modelu:** Upravit prisma/schema.prisma (např. přidat tabulku Note nebo User).
2. **Migrace:** Spustit npx prisma migrate dev, aby se tabulky fyzicky vytvořily v tom běžícím Postgres kontejneru.
3. **CRUD operace:** Přepsat src/index.ts tak, aby uměl data ukládat (POST) a číst (GET).

### 1. Definice modelu

Upravte soubor prisma/schema.prisma takto:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Tady definujeme naši tabulku
model Todo {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

V terminálu (mimo kontejner) spusťte příkaz, který vytvoří tabulku v databázi:

```bash
npx prisma migrate dev --name init_todos
```

````markdown #README.md
# Dockerized REST API & PostgreSQL

- Node.js (LTS version)
- TypeScript
- Fastify
- Prisma (ORM)

## Structure

Creates a project folder and the following files in it:

1. **`package.json`**
2. **`tsconfig.json`**
3. **`schema.prisma`**
4. **`Dockerfile`**
5. **`docker-compose.yml`**

## Git, Node.js & npm Inicialization

Open a terminal and type: `cd /path/to/your/workspace`

```bash
...
cat << 'EOF' > Dockerfile
EOF
cat << 'EOF' > compose.yml
EOF
...
cat Dockerfile
cat compose.yml
...
docker compose up -d --build
code .
```
````
