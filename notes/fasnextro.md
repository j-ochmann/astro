# 🚀 Fasnextro Stack

**Fasnextro** full-stack boilerplate kombinuje **Fastify**, **Next.js (T3)** a **Astro**. Navržen pro rychlost, typovou bezpečnost a škálovatelnost.

## 🏗️ Architektura

Stack se skládá ze čtyř hlavních kontejnerizovaných služeb:

- **`api-server`** (Fastify): Vysoce výkonné REST/gRPC API.
- **`next-app`** (T3 Stack): Interaktivní klientská aplikace a dashboard.
- **`astro-web`** (Astro): Rychlý, obsahově zaměřený frontend/web.
- **`postgres-db`** (PostgreSQL): Perzistentní datové úložiště.

## 🛠️ Rychlý start

### Prerekvizity

- Docker & Docker Compose
- Node.js (pro lokální vývoj)

### Spuštění celého stacku

```bash
# Sestavení a spuštění kontejnerů
docker-compose up --build
```

Po spuštění budou služby dostupné na těchto adresách:

- **Astro Web:** [http://localhost:4321](http://localhost:4321)
- **Next.js App:** [http://localhost:3001](http://localhost:3001)
- **Fastify API:** [http://localhost:3000](http://localhost:3000)
- **PostgreSQL:** [http://localhost:5432](localhost:5432)

### 📡 Komunikace v síti

Uvnitř Docker sítě (bridge) na sebe služby vidí pomocí svých názvů:

- API endpoint pro SSR: `http://api-server:3000`
- Database host: `postgres-db`

### ⚙️ Environmentální proměnné

- Každá služba obsahuje svůj vlastní `.env` soubor.
- Pro správné propojení v Dockeru se ujistěte, že `api-server` naslouchá na hostiteli `0.0.0.0.`

## Performant npm `pnpm`

- Zvládá v monorepu nejlépe sdílení balíčků
- Šetří gigabajty místa na disku (díky sdílené store).
- Je mnohem rychlejší při instalaci závislostí pro Docker.

```bash
sudo npm install -g pnpm
```

### 1. Inicializace Monorepa

  ```bash
  npx create-turbo@latest
  # Vyberte pnpm jako package manager
  ```

### 2. Srdce dat: **packages/db**

Zde bude žít vaše Prisma. Aby ji ostatní viděli:

1. V `packages/db/package.json` nastavte jméno na `"@repo/db"`.
2. V `schema.prisma` definujte modely.
3. Exportujte klient v `index.ts`

```typescript
export * from '@prisma/client'
export const db = new PrismaClient()
```
