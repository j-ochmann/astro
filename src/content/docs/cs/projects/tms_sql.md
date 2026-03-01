---
title: 'TMS - PostgreSQL DB'
sidebar:
  label: TMS - SQL
  order: 4
translation_status: original  
---

## Toto schéma nyní umí

**Hlídat změny:** Pokud editor upraví odstavec v Markdownu, parser narazí na nový hash. Starý překlad zůstane v DB (může se označit jako `is_outdated`), ale dokument v `document_segments` se přepne na nové `segment_id`.

**Deduplikovat:** Stejná věta v deseti souborech zabírá v tabulce segments jen jeden řádek a překládá se jednou.

**Řešit srozumitelnost:** Díky languages.fallbacks můžete v aplikaci implementovat logiku: „Chybí slovenský překlad pro tento blok? Podívej se do pole fallbacků, najdi 'cs' a zobraz českou verzi.“

**Lokalizovat Front Matter:** Metadata jako slug nebo SEO title jsou v samostatné tabulce, což umožňuje jejich rychlou indexaci bez čtení celých textů.

```sql
-- ============================================================================
-- TRANSLATION MANAGEMENT SYSTEM (TMS) - CORE SCHEMA
-- Navrženo pro parsování a lokalizaci Markdown dokumentů
-- ============================================================================

-- 1. STAVOVÝ ŽIVOTNÍ CYKLUS PŘEKLADU
-- ENUM zajišťuje datovou integritu a efektivní filtrování progresu.
CREATE TYPE translation_status AS ENUM (
    'draft',              -- Rozpracováno, nepublikovat
    'machine_translated', -- Automatický výstup (např. DeepL, Google)
    'human_reviewed',     -- Po korektuře člověkem
    'approved'            -- Finální verze, "Source of Truth"
);

-- 2. EVIDENCE JAZYKŮ A FALLBACKŮ
-- code: IETF BCP 47 (např. 'sr-Cyrl-RS', 'en-US')
-- fallbacks: Prioritní seznam náhrad v JSONB, např. ["cs", "en"]
CREATE TABLE languages (
    code VARCHAR(15) PRIMARY KEY,
    iso_639_3 CHAR(3) NOT NULL,        -- Technický kód pro ISO standardy
    name_local VARCHAR(100),           -- Název pro zobrazení v UI
    fallbacks JSONB DEFAULT '[]',      -- Klíč k vyřešení srozumitelnosti (sk -> cs)
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 100,      -- Pořadí v přepínači jazyků
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. DOKUMENTY (LOGICKÉ CELKY)
-- Reprezentuje jeden Markdown soubor v určité cestě.
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    file_path TEXT UNIQUE NOT NULL,    -- Cesta k souboru (např. 'blog/tms-system.md')
    source_language VARCHAR(15) REFERENCES languages(code),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. METADATA (FRONT MATTER)
-- Klíčované parametry (YAML), které vyžadují jiný přístup než tělo textu.
CREATE TABLE document_metadata (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    language_code VARCHAR(15) REFERENCES languages(code),
    meta_key TEXT NOT NULL,           -- Např. 'title', 'slug', 'description'
    meta_value TEXT NOT NULL,         -- Lokalizovaná hodnota
    status translation_status DEFAULT 'draft',
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT unique_meta_per_doc UNIQUE(document_id, language_code, meta_key)
);

-- 5. ATOMICKÉ SEGMENTY (OBSAH)
-- Hash (SHA-256) slouží k deduplikaci a hlídání změn ve zdroji pravdy.
CREATE TABLE segments (
    id SERIAL PRIMARY KEY,
    source_hash VARCHAR(64) UNIQUE NOT NULL, -- Identifikátor verze obsahu
    raw_content TEXT NOT NULL,               -- Původní znění bloku (Markdown)
    created_at TIMESTAMP DEFAULT NOW()
);

-- 6. PŘEKLADY SEGMENTŮ
-- Vazba mezi konkrétní verzí obsahu (hash) a cílovým jazykem.
CREATE TABLE translations (
    id SERIAL PRIMARY KEY,
    segment_id INTEGER REFERENCES segments(id) ON DELETE CASCADE,
    language_code VARCHAR(15) REFERENCES languages(code),
    content TEXT NOT NULL,                   -- Přeložený Markdown blok
    status translation_status DEFAULT 'draft',
    is_outdated BOOLEAN DEFAULT false,       -- Příznak, pokud se změnil originál
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT unique_trans_per_lang_version UNIQUE(segment_id, language_code)
);

-- 7. STRUKTURA DOKUMENTU (M:N)
-- Definuje, z jakých segmentů se skládá soubor a v jakém pořadí.
CREATE TABLE document_segments (
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    segment_id INTEGER REFERENCES segments(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,               -- Pořadí bloku v MD souboru
    PRIMARY KEY (document_id, segment_id, position)
);

-- ============================================================================
-- INDEXY PRO VÝKON
-- ============================================================================

-- Rychlé prohledávání fallbacků v JSONB (např. kdo všechno má 'en' jako fallback)
CREATE INDEX idx_languages_fallbacks ON languages USING GIN (fallbacks);

-- Rychlé sestavení dokumentu pro konkrétní jazyk
CREATE INDEX idx_doc_meta_lookup ON document_metadata (document_id, language_code);
CREATE INDEX idx_doc_segments_lookup ON document_segments (document_id);

-- ============================================================================
-- POHLED (VIEW) PRO MONITORING PROGRESU
-- ============================================================================

CREATE VIEW document_translation_progress AS
SELECT 
    d.id AS document_id,
    d.file_path,
    l.code AS target_language,
    COUNT(ds.segment_id) AS total_segments,
    COUNT(t.id) FILTER (WHERE t.status = 'approved') AS approved_count,
    ROUND(
        (COUNT(t.id) FILTER (WHERE t.status = 'approved')::NUMERIC / 
        NULLIF(COUNT(ds.segment_id), 0)) * 100, 2
    ) AS progress_percentage
FROM documents d
CROSS JOIN languages l
JOIN document_segments ds ON d.id = ds.document_id
LEFT JOIN translations t ON ds.segment_id = t.segment_id AND t.language_code = l.code
GROUP BY d.id, d.file_path, l.code;

-- ============================================================================
-- UKÁZKA DAT (INIT)
-- ============================================================================

INSERT INTO languages (code, iso_639_3, name_local, fallbacks, priority) VALUES 
('en', 'eng', 'English', '[]', 1),
('cs', 'ces', 'Čeština', '["sk", "en"]', 2),
('sk', 'slk', 'Slovenčina', '["cs", "en"]', 3);

WITH target_fallback_config AS (
    -- 1. Připravíme si seznam prioritních jazyků pro cílový jazyk 'sk'
    -- Výsledek bude: 1. 'sk', 2. 'cs', 3. 'en' (podle dat v tabulce languages)
    SELECT 'sk' AS lang_code, 0 AS priority
    UNION ALL
    SELECT f.val, f.ordinality
    FROM languages l, jsonb_array_elements_text(l.fallbacks) WITH ORDINALITY f(val, ordinality)
    WHERE l.code = 'sk'
),
available_translations AS (
    -- 2. Najdeme všechny existující překlady pro daný dokument a seřadíme je dle priority
    SELECT 
        ds.position,
        t.content,
        t.status,
        t.language_code,
        tf.priority,
        ROW_NUMBER() OVER (PARTITION BY ds.position ORDER BY tf.priority ASC) as rank
    FROM document_segments ds
    JOIN target_fallback_config tf ON true
    JOIN translations t ON ds.segment_id = t.segment_id AND t.language_code = tf.lang_code
    WHERE ds.document_id = 1  -- ID vašeho dokumentu
)
-- 3. Vybereme pro každou pozici v Markdownu tu s nejvyšší prioritou (rank = 1)
SELECT position, content, status, language_code
FROM available_translations
WHERE rank = 1
ORDER BY position ASC;

```

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Číselník jazyků a jejich priorit
model Language {
  code         String         @id @db.VarChar(10)
  priority     Int            @default(100)
  isActive     Boolean        @default(true)
  translations Translation[]
  documents    Document[]     @relation("SourceLanguage")
}

// Unikátní kousky textu identifikované hashem
model Segment {
  hash             String            @id @db.VarChar(64)
  createdAt        DateTime          @default(now())
  translations     Translation[]
  documentSegments DocumentSegment[]
}

// Jádro systému: konkrétní překlady a originály
model Translation {
  id             Int          @id @default(autoincrement())
  segmentHash    String       @db.VarChar(64)
  languageCode   String       @db.VarChar(10)
  content        String       @db.Text
  
  isOriginal     Boolean      @default(false)
  isLocked       Boolean      @default(false)
  qualityLevel   Int          @default(0) // 0: Raw, 1: Premium, 2: Human
  authorType     AuthorType   @default(PARSER)
  
  updatedAt      DateTime     @updatedAt
  
  segment        Segment      @relation(fields: [segmentHash], references: [hash], onDelete: Cascade)
  language       Language     @relation(fields: [languageCode], references: [code])

  @@unique([segmentHash, languageCode])
}

// Zastřešující dokument
model Document {
  id                 Int               @id @default(autoincrement())
  filePath           String            @unique
  sourceLanguageCode String            @db.VarChar(10)
  fullHash           String?           @db.VarChar(64)
  createdAt          DateTime          @default(now())
  
  sourceLanguage     Language          @relation("SourceLanguage", fields: [sourceLanguageCode], references: [code])
  segments           DocumentSegment[]
}

// Vazební tabulka pro pořadí segmentů v dokumentu
model DocumentSegment {
  documentId  Int
  segmentHash String @db.VarChar(64)
  position    Int

  document    Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  segment     Segment  @relation(fields: [segmentHash], references: [hash])

  @@id([documentId, position])
}

enum AuthorType {
  PARSER
  INTERNAL_MT
  EXTERNAL_API
  HUMAN
}
```

```yaml
networks:
  default:
    external:
      name: nginx-proxy-manager-network # Název sítě, kde běží váš NPM
```
