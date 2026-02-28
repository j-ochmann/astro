---
layout: default
title: 'Market Aggregator'
translation_status: original
---
Cíl je propojit informaci o ceně/kurzu aktiva na různých trzích a z různých zdrojů.

- uživatel uvidí kurz/cenu aktiva z Pyth, Chainlink, burz, fintechů, centrálních a komerčních bank, IMF, UN Treasury na jednom místě (filtr v tab.) nebo stránce s detailem kurzu/aktiva/páru.

- možnost hlídat příležitosti pro arbitráže

## 1️⃣ Hlavní DB entity

- **PostgreSQL / TimescaleDB**

1. `assets` (páry)

    - Každý obchodní/měnový pár jako asset.

    ```sql
    CREATE TYPE asset_type AS ENUM ('fx', 'commodity');

    ALTER TYPE asset_type ADD VALUE 'crypto';

    CREATE TABLE assets (
        id SERIAL PRIMARY KEY,
        base VARCHAR(32) NOT NULL,
        quote VARCHAR(32) NOT NULL,
        type asset_type NOT NULL,
        -- type VARCHAR(16) CHECK(type IN ('fx','crypto')) NOT NULL,
        symbol VARCHAR(65) GENERATED ALWAYS AS (base || '/' || quote) STORED,
        UNIQUE(base, quote, type)
    );
    ```

    - symbol se vždy generuje → konzistence napříč institucemi
    - `type` umožní odlišit FX od equity/crypto/derivatives
    - možnost přidat sloupce jako `expiry_date` pro deriváty nebo `contract_size`

2. `institutions`

    - Kdo poskytuje cenu: Pyth, Chainlink, ČNB, FED, IMF, UN burza, banka, fintech.

    ```sql
    CREATE TYPE institution_type AS ENUM ('oracle', 'bank', 'exchange');

    CREATE TABLE institutions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(64) NOT NULL,
        type institution_type NOT NULL,
        website VARCHAR(128),
        affiliate_url TEXT
    );

    ALTER TYPE institution_type ADD VALUE 'fintech';
    ```

3. `quotes` (historická data)

    - TimescaleDB / Postgres partitioned: jeden řádek = jeden snapshot
    - Historie všech institucí je přímo porovnatelná → arbitrage

    ```sql
    CREATE TABLE quotes (
        id BIGSERIAL PRIMARY KEY,
        asset_id INT NOT NULL REFERENCES assets(id),
        institution_id INT NOT NULL REFERENCES institutions(id),
        bid NUMERIC(18,8),
        ask NUMERIC(18,8),
        timestamp BIGINT NOT NULL,
        UNIQUE(asset_id, institution_id, timestamp)
    );

    -- Partitioning podle měsíce
    SELECT create_hypertable('quotes', 'timestamp', chunk_time_interval => interval '1 month');

    -- indexy pro rychlé hledání aktuálních dat
    CREATE INDEX idx_asset_institution ON quotes(asset_id, institution_id DESC);
    CREATE INDEX idx_timestamp ON quotes(timestamp DESC);

    -- Zapnutí komprese pro tabulku quotes
    ALTER TABLE quotes SET (
      timescaledb.compress,
      timescaledb.compress_segmentby = 'asset_id, institution_id'
    );

    -- Automatická komprese dat starších než 7 dní
    SELECT add_compression_policy('quotes', INTERVAL '7 days');
    ```

    - Optimalizace TimescaleDB: Pro finanční data je kritické používat kompresi, která v TimescaleDB dokáže ušetřit 90 %+ místa.

4. `arbitrage_opportunity` (volitelná cache výsledků)

    - Pro rychlý frontend a historickou statistiku

    ```sql
    CREATE TABLE arbitrage_opportunity (
      id BIGSERIAL PRIMARY KEY,
      asset_id INT NOT NULL REFERENCES assets(id),
      best_bid NUMERIC(18,8),
      best_bid_institution INT REFERENCES institutions(id),
      best_ask NUMERIC(18,8),
      best_ask_institution INT REFERENCES institutions(id),
      spread_percent NUMERIC(10,5),
      timestamp BIGINT NOT NULL
    );
    ```

    **Poznámky k architektuře**
    - **TimescaleDB** pracuje při časových agregacích (time_bucket) lépe s **TIMESTAMPTZ**. V TypeScript/API převod na Unix milisekundy/sekundy.
    - **Continuous Aggregates:** TimescaleDB umožňuje vytvořit **"Materialized Views"**, které se samy aktualizují. To je ideální pro endpoint /api/history (např. automatické předpočítání 5m, 1h svíček).

5. Finální verze

```sql
-- v1
-- ===============================
-- 1.Typy
-- ===============================

CREATE TYPE asset_type AS ENUM ('fx', 'crypto', 'equity', 'commodity', 'derivative');
CREATE TYPE institution_type AS ENUM ('oracle', 'bank', 'exchange', 'fintech');

-- ===============================
-- 2.Assets
-- ===============================

CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    base VARCHAR(32) NOT NULL,       -- BTC, GOLD, AAPL
    quote VARCHAR(32) NOT NULL,      -- USD, EUR
    type asset_type NOT NULL,
    symbol VARCHAR(65) GENERATED ALWAYS AS (base || '/' || quote) STORED,
    UNIQUE(base, quote, type)
);

-- ===============================
-- 3.Institutions
-- ===============================

CREATE TABLE institutions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    type institution_type NOT NULL,
    website VARCHAR(128),
    affiliate_url TEXT
);

-- ===============================
-- 4.Quotes (historická data)
-- ===============================

CREATE TABLE quotes (
    id BIGSERIAL PRIMARY KEY,
    asset_id INT NOT NULL REFERENCES assets(id),
    institution_id INT NOT NULL REFERENCES institutions(id),
    bid NUMERIC(18,8) NOT NULL,
    ask NUMERIC(18,8) NOT NULL,
    timestamp BIGINT NOT NULL,
    UNIQUE(asset_id, institution_id, timestamp)
);

-- TimescaleDB hypertable
SELECT create_hypertable('quotes', 'timestamp', chunk_time_interval => interval '1 month');

-- Indexy
CREATE INDEX idx_asset_institution ON quotes(asset_id, institution_id DESC);
CREATE INDEX idx_timestamp ON quotes(timestamp DESC);

-- Zapnutí komprese pro tabulku quotes
ALTER TABLE quotes SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'asset_id, institution_id'
);

-- Automatická komprese dat starších než 7 dní
SELECT add_compression_policy('quotes', INTERVAL '7 days');

-- ===============================
-- 5.Arbitrage Opportunities (cache)
-- ===============================

CREATE TABLE arbitrage_opportunity (
    id BIGSERIAL PRIMARY KEY,
    asset_id INT NOT NULL REFERENCES assets(id),
    best_bid NUMERIC(18,8),
    best_bid_institution INT REFERENCES institutions(id),
    best_ask NUMERIC(18,8),
    best_ask_institution INT REFERENCES institutions(id),
    spread_percent NUMERIC(10,5),
    timestamp BIGINT NOT NULL,
    UNIQUE(asset_id, timestamp)
);
```

```sql
-- v2
-- ===============================
-- 1.Enums
-- ===============================

CREATE TYPE asset_type AS ENUM ('fx', 'crypto', 'equity', 'commodity', 'derivative');
CREATE TYPE institution_type AS ENUM ('oracle', 'bank', 'exchange', 'fintech');

-- ===============================
-- 2.Assets
-- ===============================

CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    base VARCHAR(32) NOT NULL,
    quote VARCHAR(32) NOT NULL,
    type asset_type NOT NULL,
    symbol VARCHAR(65) GENERATED ALWAYS AS (base || '/' || quote) STORED,
    UNIQUE(base, quote, type)
);

-- ===============================
-- 3.Institutions
-- ===============================

CREATE TABLE institutions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    type institution_type NOT NULL,
    website VARCHAR(128),
    affiliate_url TEXT
);

-- ===============================
-- 4.Quotes (Time-series data)
-- ===============================

CREATE TABLE quotes (
    asset_id INT NOT NULL REFERENCES assets(id),
    institution_id INT NOT NULL REFERENCES institutions(id),
    bid NUMERIC(18,8) NOT NULL,
    ask NUMERIC(18,8) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL
);

-- Vytvoření hypertabulky (Doporučuji TIMESTAMPTZ místo BIGINT pro nativní funkce TimescaleDB)
SELECT create_hypertable('quotes', 'timestamp', chunk_time_interval => interval '1 month');

-- Indexy pro efektivní dotazování
CREATE INDEX idx_quotes_lookup ON quotes (asset_id, timestamp DESC);
CREATE INDEX idx_quotes_institution ON quotes (institution_id, timestamp DESC);

-- ===============================
-- 5.Arbitrage Opportunities
-- ===============================

CREATE TABLE arbitrage_opportunity (
    id BIGSERIAL PRIMARY KEY,
    asset_id INT NOT NULL REFERENCES assets(id),
    best_bid NUMERIC(18,8) NOT NULL,
    best_bid_institution INT NOT NULL REFERENCES institutions(id),
    best_ask NUMERIC(18,8) NOT NULL,
    best_ask_institution INT NOT NULL REFERENCES institutions(id),
    spread_percent NUMERIC(10,5) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL
);

SELECT create_hypertable('arbitrage_opportunity', 'timestamp', chunk_time_interval => interval '1 month');
```

## 2️⃣ Cache / live layer

- Redis / Memcached:

  - `latest_price:{pair_id}:{institution_id} → JSON {bid, ask, timestamp}`
  - TTL = 5–10s pro live feed
  - API endpointy používají cache, DB jen pro historická data

## 3️⃣ REST API

### Endpointy pro frontend

- `/api/latest?pair=ETH/USD` → vrátí poslední snapshot pro všechny instituce
- `/api/history?pair=ETH/USD&from=timestamp&to=timestamp&interval=5m` → agregovaná data
- `/api/arbitrage?pair=ETH/USD` → aktuální příležitosti
- `/api/pairs` → seznam všech párů
- `/api/institutions` → seznam všech institucí + affiliate linků

### Node.js stack

- Express / Fastify
- Middleware pro cache (Redis)
- ORM: Prisma / TypeORM / Sequelize
- Deployment: Docker + reverse proxy (Nginx / Caddy / Traefik) + SSL

## 4️⃣ Frontend (Astro / statický web)

- Statická stránka:
  - Live table → fetch /api/latest každých 3–5s
  - Historie → fetch /api/history při navigaci
  - Arbitrage → fetch /api/arbitrage
- Nepotřebuje plnou databázi na GitHub Pages, jen API endpointy
- Affiliate monetizace → přímo v institution.affiliate_url

## 5️⃣ Výhody architektury

|Vrstva|Výhody|
|------|------|
|PostgreSQL + TimescaleDB|Miliardy řádků, partitioning, agregace historie|
|Redis cache|Live feed, nízká latence, minimal load na DB|
|REST API (Node)|Jednotný interface pro frontend i 3rd-party integrace|
|Frontend (Astro)|Statický, škálovatelný, bezpečný (API přes rate limit)|

## 6️⃣ FrontendDomain model (TypeScript)

```typescript
export type AssetType = 'fx' | 'crypto' | 'equity' | 'commodity' | 'derivative';
export type InstitutionType = 'oracle' | 'bank' | 'exchange' | 'fintech';
export type Interval = '1m' | '5m' | '1h' | '1d';

export interface Asset {
  id: number;
  base: string;       // BTC, GOLD, AAPL
  quote: string;      // USD, EUR
  type: AssetType;
  symbol: string;     // base/quote
}

export interface Institution {
  id: number;
  name: string;
  type: InstitutionType;
  website?: string;
  affiliateUrl?: string;
}

export interface Quote {
  asset: Asset;
  institution: Institution;
  bid: number;
  ask: number;
  timestamp: number; // unix ts
}

export interface HistoricalPoint {
  bid: number;
  ask: number;
  timestamp: number;
}

export interface HistoricalQuote {
  asset: Asset;
  institution: Institution;
  interval: Interval;
  points: HistoricalPoint[];
}

export interface ArbitrageOpportunity {
  asset: Asset;
  bestBid: { institution: Institution; price: number };
  bestAsk: { institution: Institution; price: number };
  spreadPercent: number;
  timestamp: number;
}
```

### ER diagram (Entities + vztahy)

```txt
+------------------+           +--------------------+
|      assets      |           |    institutions     |
+------------------+           +--------------------+
| id (PK)          |           | id (PK)            |
| base             |           | name               |
| quote            |           | type               |
| type             |           | website            |
| symbol           |           | affiliate_url      |
+------------------+           +--------------------+
        | 1                          | 1
        |                            |
        |                            |
        |                            |
        |                            |
        v                            v
+------------------+
|      quotes      |
+------------------+
| id (PK)          |
| asset_id (FK) ---+
| institution_id(FK)---+
| bid              |
| ask              |
| timestamp        |
+------------------+
        |
        |
        v
+---------------------------+
| arbitrage_opportunity     |
+---------------------------+
| id (PK)                   |
| asset_id (FK)             |
| best_bid                  |
| best_bid_institution (FK) |
| best_ask                  |
| best_ask_institution(FK)  |
| spread_percent            |
| timestamp                 |
+---------------------------+
```

### Vysvětlení vztahů

1. Assets ↔ Quotes → 1:N
    - Jeden asset (BTC/USD) má mnoho quotes napříč institucemi a časem.
2. Institutions ↔ Quotes → 1:N
    - Jedna instituce (např. Pyth) poskytuje mnoho quotes pro různé assets.
3. Quotes ↔ Arbitrage → N:1 (logická)
    - Arbitrage snapshot agreguje nejlepší bid/ask z quotes v daném čase.
    - Záznamy z arbitrage_opportunity lze znovu generovat z quotes.

```txt
   +-------------------+      fetch /api/latest
   |   Frontend Astro  | <-------------------+
   +-------------------+                      |
             | fetch /api/history             |
             v                                |
   +-------------------+                      |
   |    REST API Node   | -------------------+
   |  Express / Fastify |
   +-------------------+
        | cache TTL 5–10s
        v
   +-------------------+
   |      Redis         | <-- live feed cache
   +-------------------+
        |
        v
   +-------------------+
   | PostgreSQL/TimescaleDB | <-- historical data
   +-------------------+
```

- Live feed → Redis cache s TTL 5–10s → API vrací velmi rychle.
- Historie / agregace → Postgres + Timescale partitioning → masivní data (miliardy řádků).
- Arbitrage → vypočteno na backendu, lze cacheovat v Redis nebo uložit do arbitrage_opportunity.

## Praktický, minimalistický setup

- Docker (API + Postgres + Redis)
- REST API (Node + Fastify)
- Připojení z GitHub Pages (CORS + HTTPS)

### 1️⃣ Struktura projektu

```txt
project-root/
│
├── compose.yaml
├── .env
│
├── api/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── index.ts
```

### 2️⃣ Docker compose.yaml

```yaml
version: "3.9"

services:
  postgres:
    image: timescale/timescaledb:latest-pg15
    container_name: arb_postgres
    environment:
      POSTGRES_USER: arb
      POSTGRES_PASSWORD: arbpass
      POSTGRES_DB: arbdb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7
    container_name: arb_redis
    ports:
      - "6379:6379"

  api:
    build: ./api
    container_name: arb_api
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: postgres://arb:arbpass@postgres:5432/arbdb
      REDIS_URL: redis://redis:6379
      PORT: 3000

volumes:
  pgdata:
```

### 3️⃣ API Dockerfile

`api/Dockerfile`

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

### 4️⃣ package.json

```json
{
  "name": "arb-api",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc"
  },
  "dependencies": {
    "fastify": "^4.25.0",
    "@fastify/cors": "^8.0.0",
    "pg": "^8.11.0",
    "ioredis": "^5.3.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "ts-node": "^10.9.0"
  }
}
```

### 5️⃣ Minimal REST API (Fastify)

`api/src/index.ts`

```typescript
import Fastify from "fastify";
import cors from "@fastify/cors";
import { Pool } from "pg";
import Redis from "ioredis";

const app = Fastify();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const redis = new Redis(process.env.REDIS_URL!);

app.register(cors, {
  origin: "*" // později omez na svou GitHub Pages doménu
});

app.get("/api/latest", async (request, reply) => {
  const { pair } = request.query as any;

  if (!pair) {
    return reply.status(400).send({ error: "pair required" });
  }

  const cacheKey = `latest:${pair}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const result = await pool.query(
    `
    SELECT a.symbol, q.bid, q.ask, q.timestamp, i.name
    FROM quotes q
    JOIN assets a ON a.id = q.asset_id
    JOIN institutions i ON i.id = q.institution_id
    WHERE a.symbol = $1
    ORDER BY q.timestamp DESC
    LIMIT 20
    `,
    [pair]
  );

  await redis.set(cacheKey, JSON.stringify(result.rows), "EX", 5);

  return result.rows;
});

app.listen({ port: Number(process.env.PORT), host: "0.0.0.0" });
```

### 6️⃣ Spuštění

V rootu projektu:

```txt
docker compose up --build
```

API poběží na:

```txt
http://localhost:3000/api/latest?pair=BTC/USD
```

### 7️⃣ Nasazení na server

GitHub Pages je čistě statická. VPS možnosti (Hetzner, DigitalOcean, Fly.io, Railway, Render,...)

API bude na:

```txt
https://api.ochmann.cz/api/latest?pair=BTC/USD
```

### 8️⃣ Volání z GitHub Pages (Astro / čistý JS)

```javascript
fetch("https://api.ochmann.cz/api/latest?pair=BTC/USD")
  .then(res => res.json())
  .then(data => console.log(data));
```

⚠ Důležité:

- správně nastavený CORS.
- API musí běžet přes HTTPS (Let's Encrypt + Nginx/Caddy).

### 9️⃣ Produkční architektura

```txt
Internet
   ↓
Nginx / Caddy (SSL)
   ↓
Docker Compose
   ├── API (Node)
   ├── Postgres (Timescale)
   └── Redis
```

🔥 Další kroky

1. Migrace DB (Prisma nebo čisté SQL migrace)
2. Healthcheck endpoint /health
3. Rate limiting
4. Environment separation (dev/prod)
5. CI/CD z GitHubu (auto deploy na VPS)

## Finální SQL Schema

Používá TIMESTAMPTZ a obsahuje optimalizace pro TimescaleDB.

```sql
-- ===============================
-- 1️⃣ Enums & Extensions
-- ===============================
CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TYPE asset_type AS ENUM ('fx', 'crypto', 'equity', 'commodity', 'derivative');
CREATE TYPE institution_type AS ENUM ('oracle', 'bank', 'exchange', 'fintech');

-- ===============================
-- 2️⃣ Assets
-- ===============================
CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    base VARCHAR(32) NOT NULL,
    quote VARCHAR(32) NOT NULL,
    type asset_type NOT NULL,
    symbol VARCHAR(65) GENERATED ALWAYS AS (base || '/' || quote) STORED,
    UNIQUE(base, quote, type)
);

-- ===============================
-- 3️⃣ Institutions
-- ===============================
CREATE TABLE institutions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    type institution_type NOT NULL,
    website VARCHAR(128),
    affiliate_url TEXT
);

-- ===============================
-- 4️⃣ Quotes (Hypertable)
-- ===============================
CREATE TABLE quotes (
    asset_id INT NOT NULL REFERENCES assets(id),
    institution_id INT NOT NULL REFERENCES institutions(id),
    bid NUMERIC(18,8) NOT NULL,
    ask NUMERIC(18,8) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL
);

SELECT create_hypertable('quotes', 'timestamp', chunk_time_interval => interval '1 month');

-- Compression
ALTER TABLE quotes SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'asset_id, institution_id'
);
SELECT add_compression_policy('quotes', INTERVAL '7 days');

CREATE INDEX idx_quotes_asset_ts ON quotes (asset_id, timestamp DESC);

-- ===============================
-- 5️⃣ Arbitrage Opportunities
-- ===============================
CREATE TABLE arbitrage_opportunity (
    asset_id INT NOT NULL REFERENCES assets(id),
    best_bid NUMERIC(18,8) NOT NULL,
    best_bid_institution INT NOT NULL REFERENCES institutions(id),
    best_ask NUMERIC(18,8) NOT NULL,
    best_ask_institution INT NOT NULL REFERENCES institutions(id),
    spread_percent NUMERIC(10,5) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL
);

SELECT create_hypertable('arbitrage_opportunity', 'timestamp', chunk_time_interval => interval '1 month');
```

### Produkční Fastify API (TypeScript)

Vylepšený `api/src/index.ts` počítá s produkčním prostředím a typovou bezpečností.

```typescript
import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { Pool } from "pg";
import Redis from "ioredis";

// Types for query parameters
interface LatestQuery {
  pair: string;
}

const app: FastifyInstance = Fastify({ logger: true });

// Environment variables validation
const {
  DATABASE_URL = "postgres://arb:arbpass@postgres:5432/arbdb",
  REDIS_URL = "redis://redis:6379",
  PORT = "3000"
} = process.env;

const pool = new Pool({ connectionString: DATABASE_URL });
const redis = new Redis(REDIS_URL);

// Register CORS for GitHub Pages
app.register(cors, {
  origin: "*" // In production, replace with your specific GitHub Pages domain
});

// Health check
app.get("/health", async () => ({ status: "ok" }));

/**
 * Get latest quotes for a pair
 */
app.get<{ Querystring: LatestQuery }>("/api/latest", async (request, reply) => {
  const { pair } = request.query;

  if (!pair) {
    return reply.status(400).send({ error: "Query parameter 'pair' is required (e.g. BTC/USD)" });
  }

  const cacheKey = `latest:${pair}`;
  
  try {
    // 1. Try Cache
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // 2. Query DB
    const result = await pool.query(
      `
      SELECT 
        a.symbol, 
        q.bid, 
        q.ask, 
        q.timestamp, 
        i.name as institution_name,
        i.type as institution_type
      FROM quotes q
      JOIN assets a ON a.id = q.asset_id
      JOIN institutions i ON i.id = q.institution_id
      WHERE a.symbol = $1
      ORDER BY q.timestamp DESC
      LIMIT 50
      `,
      [pair]
    );

    const data = result.rows;

    // 3. Save to Redis (TTL 5s)
    if (data.length > 0) {
      await redis.set(cacheKey, JSON.stringify(data), "EX", 5);
    }

    return data;
  } catch (error) {
    app.log.error(error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
});

// Start server
const start = async () => {
  try {
    await app.listen({ port: Number(PORT), host: "0.0.0.0" });
    console.log(`API is running on port ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
```

**SWR/Query:** Pro fetchování dat na frontendu doporučuji použít knihovnu jako TanStack Query (pokud používáte React/Svelte komponenty v Astro). Vyřeší za vás caching na straně klienta a automatický refresh.
