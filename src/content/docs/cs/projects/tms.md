---
title: 'TMS - Translation Management System'
sidebar:
  label: TMS - Úvod
  order: 1
translation_status: original  
---

Existují tisíce jazyků, ale některé jsou si vzájemně podobné nebo pouhé dialekty a mluvčí bývají bilingvidní. Z pohledu webu a ekonomičnosti se liší v počtu mluvčích a podpoře API třetích stran (např. Google text-to-speech).

Standardizace je překvapivě bídná a záludná.

[**ISO 639-1 (set 1)**](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes#jv)
obsahuje 183 „dvoupísmenných zkratek“ včetně typů `Constructed` a `Historical`. Latinu a esperanto pro e-shop nejspíše nepotřebujete. Severní sámština (kód `se`) má okolo 20 tisíc mluvčích. Inuitský jazyk (kód `ik`) na Aljašce s přibližně 2000 mluvčích.

Kód `zh` není dostatečný pro Čínu. Standardní čínština je pro stovky milionů lidí druhým jazykem a jejich dialekty jsou pro Číňana z Pekingu nesrozumitelné.

Sloupec `Scope` aspoň dává informaci o tom, že je `Macrolanguage`. Jenže co taková americká, kanadská a australská angličtina? Nemluvě o různých „english-based“ kreolštinách. **Angličtina `en` se jako makrojazyk překvapivě neuvádí.**

[**IETF BCP 47**](https://en.wikipedia.org/wiki/IETF_language_tag)
(Best Current Practice 47) definuje standardní formát pro jazykové tagy na internetu. Skládá se z RFC 5646 (tagy) a RFC 4647 (přiřazování). Tagy zahrnují primární jazyk, písmo, region a varianty (např. `en-US` `zh-Hant-TW`).

**obsahuje:** jazyk (ISO 639), písmo (ISO 15924), region (ISO 3166-1/UN M.49) a rozšíření.

**příklady:**

- **en:** English
- **es-419:** Spanish (Latin America)
- **sr-Cyrl-RS:** Serbian (Cyrillic, Serbia)
- **de-CH-1901:** German (Switzerland, 1901 orthography)

Nepoznáte z něj, že jsou čeština a slovenština vzájemně srozumitelné jazyky.

Z `en-AU`, `en-CA`, `en-GB`, `en-US` lze příbuznosti dovodit.

**ISO 639-2** se dělí na:

- **T** „terminological“ založeném na původních „domorodých“ názvech
- **B** „bibliographic“ vycházející z anglických názvů, ale jen u dvaceti jazyků vč. češtiny (`cze` místo `ces`). U ostatních jazyků se neliší od **T**.

**ISO 639-3** je rozsáhlejší. Obsahuje přes **7000** kódů. **ISO 639-2/T** jich má pouze kolem **480**. Ty se často shodují, ale **ISO 639-2/T** často používá jeden kód pro celou skupinu, zatímco **ISO 639-3** ji rozděluje na konkrétní jazyky.

**Příklad:** V **ISO 639-2/T** je kód `ara` pro arabštinu jako celek. V **ISO 639-3** existuje také (jako makrojazyk), ale k němu přibývá dalších 30 specifických kódů pro jednotlivé varianty, jako je `arb` pro standardní arabštinu.

**Kolektivní kódy: ISO 639-2/T** obsahuje kódy pro skupiny jazyků (např. afa pro afroasijské jazyky), které v **ISO 639-3** zcela chybí, protože ta se zaměřuje výhradně na jednotlivé jazyky. Skupiny jazyků řeší až norma **ISO 639-5**.

Klíč jazyka bych interně skládal z **ISO 639-3**, regionu (ISO 3166-1/UN M.49) a písma, ale uživatelům se snažil zobrazovat kratší a povědomější set 1. Státy s jazyky mají vztah **M:N**. Britská `en-GB` angličtina se používá v cca 65 států. Ale Google TTS rozlišuje AU, NZ, GB, atd. Těžko odhadnout fallbacky pro kreolštiny z ISO set 3. Standartdy jsou ovlivněny politicky (Čína/Taiwan), historickými změnami a lingvistikou, která má jiné priority než velikost trhu.

[**ISO639-3.sil.org**](https://iso639-3.sil.org/code_tables/639/data/all) **/**
[**ISO 639:2023**](https://www.iso.org/obp/ui/en/#iso:std:iso:639:ed-2:v1:en) pokrývá více než 7000 jazyků a dialektů. Tisíce lokalizací webu ovšem nejsou praktické, udržitelné a v TMS systému nebudu logiku prioritizace jazyků pro konkrétní web/projekt řešit, ale snažil bych se použít, co tvořili jiní.

[**Unicode CLDR (Common Locale Data Repository)**](https://cldr.unicode.org/) na [**GitHub**](https://github.com/unicode-org/cldr) má být údajně spolehlivý průmyslový standard pro lokalizaci.

Soubor [**territoryInfo.json**](https://github.com/unicode-cldr/cldr-core/blob/master/supplemental/territoryInfo.json) obsahuje „trochu zvláštní“ hodnoty`"16"` a `"47"`. Pokud bych z něj vycházel, tak by systém nabízel čechovi jako náhradu angličtinu, Slovákovi češtinu, ale naopak ne.  

Odráží realitu jazykové vybavenosti, nikoliv vzájemné srozumitelnosti.

```json
  ...
},
"CZ": {
  "_gdp": "375900000000",
  "_literacyPercent": "99",
  "_population": "10686300",
  "languagePopulation": {
    "cs": {
      "_populationPercent": "98",
      "_officialStatus": "official"
    },
    "de": {
      "_populationPercent": "15"
    },
    "en": {
      "_populationPercent": "27"
    },
    "pl": {
      "_populationPercent": "0.49"
    },
    "sk": {
      "_populationPercent": "16"
    }
  }
},
  ...
},
"SK": {
  "_gdp": "179700000000",
  "_literacyPercent": "99.6",
  "_population": "5445040",
  "languagePopulation": {
    "cs": {
      "_populationPercent": "47"
    },
    "de": {
      "_populationPercent": "22"
    },
    "en": {
      "_populationPercent": "26"
    },
    "hu": {
      "_populationPercent": "11"
    },
    "pl": {
      "_populationPercent": "0.93"
    },
    "sk": {
      "_populationPercent": "90",
      "_officialStatus": "official"
    },
    "uk": {
      "_populationPercent": "1.9"
    }
  }
}, ...
```

Soubor [**likelySubtags.json**](https://github.com/unicode-org/cldr-core/blob/master/supplemental/likelySubtags.json) obsahuje např. pro češtinu a slovenštinu tyto náhrady:

- `"cs": "cs-Latn-CZ",` zpřesní
- `"und-CZ": "cs-Latn-CZ",` Undefined jazyk v ČR nastaví češtinu.
- `"czk": "czk-Hebr-CZ",` Kód `czk` v ISO 639-3 patří kenaanskému jazyku, což je vymřelý středověký žido-slovanský jazyk. Pro e-shop nepoužitelné, pro historiky svatý grál.

- `"sk": "sk-Latn-SK",` zpřesní
- `"und-SK": "sk-Latn-SK",` Undefined jazyk na Slovensku nastaví slovenštinu.
- `"rmc": "rmc-Latn-SK",` severocentrální romština (ang.*Carpathian Romani*)
- `"und-Cyrl-SK": "uk-Cyrl-SK",` Kdokoliv čte cyrilici na Slovensku musí být ukrajinec?

Romštinu v ČR zcela ignoruje a olašskou nebo obecnou neřeší. Slovákovi češtinu nenabídne ani naopak. Pár tisíc romů nebude velká byznys ztráta, ale různá regionální etnika v Indii a Číně mívají desítky milionů mluvčích. To už by se projevit mohlo.

## Vlastní mapování náhrad

- kombinace technických dat z CLDR s vaší byznys logikou

```json
{
  "fallbacks": {
    "sk": ["cs", "en"],
    "cs": ["sk", "en"],
    "sr": ["hr", "bs", "en"],
    "nn": ["nb", "da", "en"],
    "de-CH": ["de-DE", "en"]
  }
}
```

Standardy se bojí definovat, že „Slovák rozumí Čechovi“, protože je to politicky ošemetné a asymetrické (mladší Slováci rozumí češtině lépe než mladí Češi slovenštině).

**Pro TMS můžete mapu rozšířit o "Business Context".**

- Pokud prodáváte luxusní módu, může být fallbackem pro všechny evropské jazyky angličtina.
- Pokud prodáváte náhradní díly pro traktory na venkově, je fallback sk -> cs kritický.

Tento přístup využívá například **i18next**, kde můžete definovat pole fallbacků pro každý klíč.

## Data o podílech návštěvnosti jsou např. na

- [**W3Techs**](https://w3techs.com/technologies/overview/content_language)
- [**Wikimedia Statistics**](https://stats.wikimedia.org/#/all-projects/reading/page-views-by-country/normal|table|last-month|(access)~desktop*mobile-app*mobile-web|monthly)

Pro zákazníka/firmu z EU a ČR bude Slovenština a Maďarština důležitější než jazyky s více mluvčími na druhém konci světa. Pro mezinárodní organizaci bude cíl maximalizovat pokrytí, atd.

## Text-to-speech

- **Google Chrome** na **Androidu** má krásné srozumitelné hlasy pro desítky jazyků.
- **Google Chrome** na **PC** (Windows, Mac, Linux) jich nabízí výrazně méně.
- **Microsoft** má slušné použitelné hlasy, ale asi je poskytuje pouze v primárním jazyce instalace.
- **Firefox** na **Linuxu** generuje desetitisíce syntetyckých „plechových“ hlasů, kterým je stěží rozumět.

Vzhledem k popularitě mobilních Android telefonů bych se soustředil na jazyky, které podporují.

## Návrh DB schéma (PostgreSQL)

Cíl je oddělit segment (identitu textu) od verze (zdroje pravdy) a překladu (výstupu).
Pro vyřešení priorit, kvality a ochrany před přepsáním musíme zavést koncept „zdroje pravdy“ a úrovně kvality.

```sql
-- 1. ENUM pro úrovně kvality/stavy
-- Pevně daný životní cyklus překladu
CREATE TYPE translation_status AS ENUM (
    'draft',              -- pracovní verze, nepublikovat
    'needs_update'        -- změnil se original
    'original',           -- originální publikovatelný text
    'machine_translated', -- Automatický výstup (DeepL/Google/Lingva/LibreTranslate)
    -- 'DeepL',              -- výstup z DeepL
    -- 'GoogleTranslate',    -- výstup z Google
    -- 'Lingva',             -- výstup z Lingva
    -- 'LibreTranslate',     -- výstup z LibreTranslate
    'human_reviewed',     -- Zkontrolováno člověkem (korektura)
    'approved'            -- Finální verze, "Source of Truth"
);

-- 2. Evidence jazyků s podporou fallbacků v JSONB
CREATE TABLE languages (
    code VARCHAR(15) PRIMARY KEY,      -- BCP 47 (např. 'sr-Cyrl-RS')
    -- BCP 47 jako PK dovolí mít en-US i en-GB jako samostatné řádky, 
    -- které mohou mít iso_639_3 nastaveno na eng.
    iso_639_1 CHAR(2) NOT NULL,        -- interní technický kód (mapování)
    iso_639_2T CHAR(3) NOT NULL,       -- interní technický kód (mapování)
    -- iso_639_2B CHAR(3) NOT NULL,       -- pro 20 jazyků zbytečný soupec
    iso_639_3 CHAR(3) NOT NULL,        -- interní technický kód
    name_en VARCHAR(100),              -- anglický název
    name_native VARCHAR(100),           -- Název v daném jazyce
    fallbacks JSONB DEFAULT '[]',      -- Např. ["cs", "en"]
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 100       -- Nižší číslo = vyšší priorita překladu
);

-- Index pro rychlé vyhledávání fallbacků v JSONB
CREATE INDEX idx_languages_fallbacks ON languages USING GIN (fallbacks);

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

### Strategie pro Workera a logika systému

✅ **Ochrana originálu a zablokovaných textů**

Při ukládání (upsertu) z parseru nebo workeru musí SQL dotaz obsahovat podmínku:
`WHERE is_locked = false AND is_original = false`. Ta zajistí, že lidská práce nebo zdrojový text nebudou nikdy přepsána strojem.

🚀 **Prioritní fronta pro Workery**

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

🔄 **Zamezení kruhovým překladům**

Systém vždy ví, co je originál (`is_original = true`). Překlady by se měly vždy generovat **pouze ze zdrojového jazyka daného segmentu**, nikoliv z jiného překladu (např. z CS do EN a pak z EN do ZH), aby se předešlo kumulativní chybě.

#### Úrovně kvality (Workflow)

**Level 0 (Internal MT):** Parser vloží řádky pro všechny jazyky. Interní worker (např. běžící lokálně přes LibreTranslate nebo menší LLM) bleskově naplní content a nastaví `quality_level = 0`.

**Level 1 (Premium):** Placený worker vybere segmenty s `quality_level = 0` u prioritních jazyků, přepíše je kvalitnějším textem a nastaví `quality_level = 1`.

**Level 2 (Human):** Rodilý mluvčí v UI editoru upraví text, systém nastaví `is_locked = true` a `quality_level = 2`.

```sql
-- v2
-- 1. Definice ENUM pro úrovně kvality/stavy
-- Výhoda: Pevně daný životní cyklus překladu
CREATE TYPE translation_status AS ENUM (
    'draft',              -- Pracovní verze, nepublikovat
    'machine_translated', -- Automatický výstup (např. DeepL/Google)
    'human_reviewed',     -- Zkontrolováno člověkem (korektura)
    'approved'            -- Finální verze, "Source of Truth"
);

-- 2. Evidence jazyků s podporou fallbacků v JSONB
CREATE TABLE languages (
    code VARCHAR(15) PRIMARY KEY,      -- BCP 47 (např. 'sr-Cyrl-RS')
    iso_639_3 CHAR(3) NOT NULL,        -- Interní technický kód
    name_local VARCHAR(100),           -- Název v daném jazyce
    fallbacks JSONB DEFAULT '[]',      -- Např. ["cs", "en"]
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 100       -- Pořadí v UI
);

-- 3. Unikátní identita textu (Segment)
-- Odděluje "co" říkáme od toho "v jakém jazyce"
CREATE TABLE segments (
    id SERIAL PRIMARY KEY,
    key_name TEXT UNIQUE NOT NULL,      -- Např. 'button.checkout.label'
    source_context TEXT,               -- Popis pro překladatele
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Samotné překlady (Výstupy)
CREATE TABLE translations (
    id SERIAL PRIMARY KEY,
    segment_id INTEGER REFERENCES segments(id) ON DELETE CASCADE,
    language_code VARCHAR(15) REFERENCES languages(code),
    content TEXT NOT NULL,
    status translation_status DEFAULT 'draft',
    is_source_of_truth BOOLEAN DEFAULT false, -- Označení originálu
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Prevence duplicit: jeden segment může mít v daném jazyce jen jeden aktivní překlad
    CONSTRAINT unique_translation_per_lang UNIQUE(segment_id, language_code)
);

-- Index pro rychlé vyhledávání fallbacků v JSONB
CREATE INDEX idx_languages_fallbacks ON languages USING GIN (fallbacks);
```

## Proč to takto dává smysl

**JSONB Fallbacks:** Umožňuje do databáze uložit mapu {"sk": ["cs", "en"]}. Při dotazu, kdy chybí slovenština, se jedním JOINem podíváte do pole fallbacks a sáhnete pro první dostupnou alternativu.

**BCP 47 jako PK:** Tabulka languages používá jako primární klíč flexibilní tag. To vám dovolí mít **en-US** i **en-GB** jako samostatné řádky, které ale oba mohou mít **iso_639_3** nastaveno na **eng**.

**Source of Truth:** Příznak `is_source_of_truth` v tabulce translations jasně definuje, ze kterého textu se vycházelo. Pokud se změní "source" text, systém může automaticky degradovat statusy ostatních překladů zpět na `draft` nebo `needs_update`.

**Auditabilita:** Díky `updated_at` a ENUMu můžete snadno reportovat: *„Máme 80% webu v 'approved' kvalitě, 20% je zatím 'machine_translated'.“*

```sql
--- v3
CREATE TYPE translation_status AS ENUM ('draft', 'machine_translated', 'human_reviewed', 'approved');

-- 1. Evidence jazyků (beze změny, s JSONB fallbacky)
CREATE TABLE languages (
    code VARCHAR(15) PRIMARY KEY,
    iso_639_3 CHAR(3) NOT NULL,
    fallbacks JSONB DEFAULT '[]', -- Např. ["cs", "en"]
    is_active BOOLEAN DEFAULT true
);

-- 2. Segmenty jako verze zdrojového textu
CREATE TABLE segments (
    id SERIAL PRIMARY KEY,
    source_hash VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 originálního MD bloku
    raw_content TEXT NOT NULL,               -- Původní znění (zdroj pravdy)
    file_path TEXT,                          -- Kde se v MD souboru nachází (pro kontext)
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Překlady vázané na konkrétní verzi (hash) segmentu
CREATE TABLE translations (
    id SERIAL PRIMARY KEY,
    segment_id INTEGER REFERENCES segments(id) ON DELETE CASCADE,
    language_code VARCHAR(15) REFERENCES languages(code),
    content TEXT NOT NULL,                   -- Přeložený Markdown blok
    status translation_status DEFAULT 'draft',
    is_outdated BOOLEAN DEFAULT false,       -- Příznak, pokud se změnil zdrojový hash
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT unique_trans_per_hash UNIQUE(segment_id, language_code)
);

-- 1. Evidence dokumentů (souborů)
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    file_path TEXT UNIQUE NOT NULL,    -- Cesta k souboru (např. 'blog/tms-system.md')
    title TEXT,                        -- Meta název dokumentu
    source_language VARCHAR(15) REFERENCES languages(code),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Vazební tabulka (M:N) mezi dokumenty a segmenty
-- Dokument se skládá z mnoha segmentů, segment může být v mnoha dokumentech.
CREATE TABLE document_segments (
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    segment_id INTEGER REFERENCES segments(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,          -- Pořadí odstavce v daném souboru
    PRIMARY KEY (document_id, segment_id, position)
);

-- 3. Pomocný pohled (VIEW) pro sledování progresu
-- Spočítá, kolik % segmentů v dokumentu má schválený překlad pro daný jazyk.
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
