---
layout: default
title: 'Translation Management System'
translation_status: original
---

Cíl je oddělit segment (identitu textu) od verze (zdroje pravdy) a překladu (výstupu).
Pro vyřešení priorit, kvality a ochrany před přepsáním musíme zavést koncept „Source of Truth“ a úrovně kvality.

## Návrh DB schéma (PostgreSQL)

```sql
-- 1. Evidence jazyků s prioritou
CREATE TABLE languages (
    code VARCHAR(10) PRIMARY KEY, -- 'cs', 'en', 'zh'
    priority INTEGER DEFAULT 100,  -- Nižší číslo = vyšší priorita
    is_active BOOLEAN DEFAULT true
);

-- 2. Unikátní textové bloky (napříč všemi jazyky)
CREATE TABLE segments (
    hash VARCHAR(64) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Překlady a originály (jádro systému)
CREATE TABLE translations (
    id SERIAL PRIMARY KEY,
    segment_hash VARCHAR(64) REFERENCES segments(hash) ON DELETE CASCADE,
    language_code VARCHAR(10) REFERENCES languages(code),
    content TEXT NOT NULL,
    
    -- Metadata kvality
    is_original BOOLEAN DEFAULT false, -- True, pokud je tento jazyk zdrojem pro tento hash
    quality_level INTEGER DEFAULT 0,    -- 0: Raw (vlastní), 1: Premium (DeepL/OpenAI), 2: Human (Verified)
    is_locked BOOLEAN DEFAULT false,    -- Pokud true, worker nesmí sahat na obsah (po lidské kontrole)
    
    author_type VARCHAR(20),            -- 'parser', 'internal_mt', 'external_api', 'human'
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(segment_hash, language_code)
);

-- 4. Vazba na dokumenty (zachování kontextu originálu)
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    file_path TEXT UNIQUE,
    source_language_code VARCHAR(10) REFERENCES languages(code),
    full_hash VARCHAR(64),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Pořadí segmentů v dokumentu
CREATE TABLE document_segments (
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    segment_hash VARCHAR(64) REFERENCES segments(hash),
    position INTEGER,
    PRIMARY KEY (document_id, position)
);
```

Strategie pro Workera a logiku systému
✅ Ochrana originálu a zablokovaných textů
Při ukládání (upsertu) z parseru nebo workeru musí SQL dotaz obsahovat podmínku:
WHERE is_locked = false AND is_original = false. Tím zajistíte, že lidská práce nebo zdrojový text nebudou nikdy přepsány strojem.
🚀 Prioritní fronta pro Workery
Worker si vybírá práci na základě priority jazyka a aktuální kvality:

```sql
SELECT t.*, s.hash 
FROM translations t
JOIN languages l ON t.language_code = l.code
JOIN segments s ON t.segment_hash = s.hash
WHERE t.is_locked = false 
  AND t.is_original = false
  AND t.quality_level < 2 -- Chceme se dostat na vyšší level
ORDER BY l.priority ASC, t.quality_level ASC
LIMIT 50;
```

## 🔄 Zamezení kruhovým překladům

Systém vždy ví, co je originál (is_original = true). Překlady by se měly vždy generovat pouze ze zdrojového jazyka daného segmentu, nikoliv z jiného překladu (např. z CS do EN a pak z EN do ZH), aby se předešlo kumulativní chybě.
Úrovně kvality (Workflow)
Level 0 (Internal MT): Parser vloží řádky pro všechny jazyky. Interní worker (např. běžící lokálně přes LibreTranslate nebo menší LLM) bleskově naplní content a nastaví quality_level = 0.
Level 1 (Premium): Placený worker vybere segmenty s quality_level = 0 u prioritních jazyků, přepíše je kvalitnějším textem a nastaví quality_level = 1.
Level 2 (Human): Rodilý mluvčí v UI editoru upraví text, systém nastaví is_locked = true a quality_level = 2.

```sql
```

```sql
```

```sql
```

```sql
```

```sql
```

```sql
```

```sql
```

```sql
```
