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
echo "### Jazyky a frameworky ###
node_modules/            # Závislosti pro JavaScript/Node.js
__pycache__/             # Kompilovaný Python kód
*.py[cod]                # Python soubory
.venv/                   # Virtuální prostředí Pythonu
venv/
target/                  # Buildy pro Rust/Java

### Bezpečnost (NEPUSHLOVAT!) ###
.env                     # API klíče, hesla a tajné proměnné
*.env
*.pem                    # Soukromé klíče
auth.json                # Autentizační tokeny

### Operační systém a IDE ###
.DS_Store                # MacOS smetí
Thumbs.db                # Windows smetí
.vscode/                 # Nastavení VS Code (pokud ho nechcete sdílet)
.idea/                   # Nastavení JetBrains (PyCharm, IntelliJ)
*.swp                    # Dočasné soubory editoru Vim
dist/                    # Výsledné buildy
build/
*.log                    # Logy aplikací
npm-debug.log*
yarn-error.log*
.DS_Store

# Prisma (vygenerované soubory, které se tvoří při buildu)
/prisma/migrations/" > .gitignore
cat .gitignore
ls -la
```

> **Tip:** Zkontrolujte, že se `.gitignore` vytvořil.

```bash
npm init -y          #vytvoří package.json
# Nastavení jednotlivých skriptů
npm pkg set scripts.build="tsc"
npm pkg set scripts.start="node dist/index.js"
npm pkg set scripts.dev="nodemon src/index.ts"

# Instalace TypeScriptu a vývojových nástrojů
npm install typescript ts-node nodemon @types/node fastify prisma --save-dev
npm audit fix --force
npx tsc --init       #vytvoří tsconfig.json
# npx prisma init    #vytvoří schema.prisma
npx prisma init --datasource-provider postgresql
git init             # Inicializuje Git v projektu
git add .            # Přidá všechny soubory do "staging" oblasti
git commit -m "init" # Počáteční commit projektu
```

## Dockerfile & compose.yml

```bash
echo "
# 1. Build fáze (zkompiluje TS do JS)
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# 2. Produkční fáze (lehký obraz pro běh)
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "run", "start"]" > Dockerfile
echo "services:
  # Tvé TypeScript API
  api:
    build: .
    container_name: dockerized-ts-api
    restart: always
    environment:
      # 'db' je název služby níže, Docker si to přeloží na správnou IP
      - DATABASE_URL=postgresql://user:password@db:5432/mydb?schema=public
    ports:
      - "3000:3000"
    depends_on:
      - db

  # PostgreSQL Databáze
  db:
    image: postgres:16-alpine
    container_name: dockerized-ts-db
    restart: always
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      # Persistentní úložiště pro data (jinak by se při smazání kontejneru smazala i data)
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
" > compose.yml
cat Dockerfile
cat compose.yml
code .
```

## Dockerfile

```dockerfile
# 1. Build fáze (zkompiluje TS do JS)
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# 2. Produkční fáze (lehký obraz pro běh)
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "run", "start"]
```

## Docker compose.yml

```yaml
services:
  # Tvé TypeScript API
  api:
    build: .
    container_name: dockerized-ts-api
    restart: always
    environment:
      # 'db' je název služby níže, Docker si to přeloží na správnou IP
      - DATABASE_URL=postgresql://user:password@db:5432/mydb?schema=public
    ports:
      - "3000:3000"
    depends_on:
      - db

  # PostgreSQL Databáze
  db:
    image: postgres:16-alpine
    container_name: dockerized-ts-db
    restart: always
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      # Persistentní úložiště pro data (jinak by se při smazání kontejneru smazala i data)
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

## Poslední kontrola před spuštěním

Aby docker-compose up neselhal, ujistěte se, že v package.json máte definované tyto skripty, které Dockerfile volá:

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "nodemon src/index.ts"
}
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
