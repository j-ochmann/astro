---
layout: default
title: 'Translation Management System'
translation_status: original
---

Existují tisíce jazyků, ale některé jsou si vzájemně podobné nebo pouhé dialekty a mluvčí bývají bilingvidní. Z pohledu webu a ekonomičnosti se liší v počtu mluvčích a podpoře API třetích stran (např. Google text-to-speech).

Standardizace je překvapivě bídná a záludná.

[**ISO 639-1 set 1**](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes#jv)
(183) „dvoupísmenných zkratek“ obsahuje i typy `Constructed` a `Historical`. Latinu a esperanto pro e-shop nejspíše nepotřebujete. Severní sámština (kód `se`) má okolo 20 tisíc mluvčích. Inuitský jazyk (kód `ik`) na Aljašce s přibližně 2000 mluvčích.

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

**ISO 639-1 set 2** se dělí na:

- **T** „terminological“ založeném na původních „domorodých“ názvech
- **B** „bibliographic“ vycházející z anglických názvů, ale jen u dvaceti jazyků vč. češtiny (`cze` místo `ces`). U ostatních jazyků se neliší od **T**.

Klíč jazyka bych interně skládal z **ISO 639-1 set 3**, regionu (ISO 3166-1/UN M.49) a písma, ale uživatelům se snažil zobrazovat kratší a povědomější set 1. Státy s jazyky mají vztah M:N. Britská `en-GB` angličtina se používá v cca 65 států. Ale Google TTS rozlišuje AU, NZ, GB, atd. Těžko odhadnout fallbacky pro kreolštiny z ISO set 3. Standartdy jsou ovlivněny politicky (Čína/Taiwan), historickými změnami a lingvistikou, která má jiné priority než velikost trhu.

**ISO 639-1 set 3** pokrývá více než 7000 jazyků a dialektů. Tisíce lokalizací webu ovšem nejsou praktické, udržitelné a v TMS systému nebudu logiku prioritizace jazyků pro konkrétní web/projekt řešit, ale snažil bych se použít, co tvořili jiní. [Unicode CLDR Project](https://cldr.unicode.org/) a [github.com/unicode-org/cldr](https://github.com/unicode-org/cldr)

Pro zákazníka/firmu z EU a ČR bude Slovenština a Maďarština důležitější než jazyky s více mluvčími na druhém konci světa. Pro mezinárodní organizaci bude cíl maximalizovat pokrytí, atd.

Cíl je oddělit segment (identitu textu) od verze (zdroje pravdy) a překladu (výstupu).
Pro vyřešení priorit, kvality a ochrany před přepsáním musíme zavést koncept „zdroje pravdy“ a úrovně kvality.

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
