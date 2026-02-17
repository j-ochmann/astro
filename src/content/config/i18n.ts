import { locales } from './i18n/locales';
import { iso_3166_1 } from './i18n/iso_3166_1';
import { countryTranslations } from './i18n/country_translations';
import { iso_4217 } from './i18n/iso_4217';
import { iso_639_1 } from './i18n/iso_639_1';
import { iso_639_3 } from './i18n/iso_639_3';
import { uiStrings } from './i18n/ui';
import countries from './i18n/countries.json';

// --- SEKCE: MLEDOZE DATA (countries.json) ---

/** Rozhraní pro data z externího JSONu (mledoze) */
interface MledozeCountry {
  cca2: string; 
  cca3: string; 
  name: {
    common: string;
    // Použijeme any pro native, protože struktura jazyků je extrémně variabilní
    native: Record<string, any>; 
  };
  translations: Record<string, { common: string }>;
  borders?: string[];
}

// Oprava TypeScript chyby pomocí "as unknown as MledozeCountry[]"
const countryList = (countries as unknown) as MledozeCountry[];

// Indexy pro O(1) vyhledávání
const cca2ToCca3Map = new Map(countryList.map(c => [c.cca2.toUpperCase(), c.cca3.toUpperCase()]));
const cca3ToCca2Map = new Map(countryList.map(c => [c.cca3.toUpperCase(), c.cca2.toUpperCase()]));

/** Převede 2-místný kód na 3-místný */
export function cca2ToCca3(cca2: string): string | undefined {
  return cca2ToCca3Map.get(cca2.toUpperCase());
}

/** Převede 3-místný kód na 2-místný */
export function cca3ToCca2(cca3: string): string | undefined {
  return cca3ToCca2Map.get(cca3.toUpperCase());
}

/** Najde surová mledoze data podle jakéhokoliv ISO kódu */
export function getMledozeData(code: string): MledozeCountry | undefined {
  const c = code.toUpperCase();
  return countryList.find(curr => curr.cca2 === c || curr.cca3 === c);
}

/** Vrátí název země v aktuálním jazyce webu */
export function getCountryName(code: string, lang: string): string {
  const country = getMledozeData(code);
  if (!country) return code;

  const langMap: Record<string, string> = {
    cs: 'ces',
    en: 'eng',
    de: 'deu',
    fr: 'fra',
    pl: 'pol',
    sk: 'slk'
  };

  const translationKey = langMap[lang];
  
  if (lang === 'en') return country.name.common;
  return country.translations[translationKey]?.common || country.name.common;
}

/** Vrátí seznam sousedů s informacemi pro UI */
export function getNeighbors(code: string, lang: string) {
  const country = getMledozeData(code);
  if (!country || !country.borders) return [];

  return country.borders.map(borderCca3 => {
    return {
      cca3: borderCca3,
      cca2: cca3ToCca2(borderCca3) || '??',
      name: getCountryName(borderCca3, lang)
    };
  });
}

// --- SEKCE: VALIDACE A STÁVAJÍCÍ I18N LOGIKA ---

if (!locales) throw new Error("Chybí export 'locales'. Zkontrolujte src/content/config/i18n/locales.ts");
if (!iso_3166_1) throw new Error("Chybí export 'iso_3166_1'. Zkontrolujte src/content/config/i18n/iso_3166_1.ts");
if (!iso_4217) throw new Error("Chybí export 'iso_4217'. Zkontrolujte src/content/config/i18n/iso_4217.ts");
if (!iso_639_1) throw new Error("Chybí export 'iso_639_1'. Zkontrolujte src/content/config/i18n/iso_639_1.ts");
if (!uiStrings) throw new Error("Chybí export 'uiStrings'. Zkontrolujte src/content/config/i18n/ui.ts");

export function getI18nPaths() {
  return Object.keys(locales).map((lang) => ({
    params: { lang },
  }));
}

export function getFlagCode(lang_id: string) {
  return Object.values(locales).find(
    (item) => item.lang.toLowerCase() === lang_id.toLowerCase())?.flag.toLowerCase();
}

export const getLanguageLabel = (code: string, lang: string) => {
  let l = (iso_639_1 as any)?.[code]; 
  if (!l) {
    l = (iso_639_3 as any)?.[code];
  }
  if (!l) return code.toLowerCase();
  const name = l.en || l.label || code;
  return `${name} (${code.toLowerCase()})`;
};

export const getCurrencyLabel = (code: string, lang: string) => {
  const curr = iso_4217?.[code];
  if (!curr) return code;
  return `${curr.name} (${code})`;
};

export function useTranslations(lang: string) {
  const translations = uiStrings?.[lang as keyof typeof uiStrings] || uiStrings?.en || {};
  const countryNames = countryTranslations?.[lang as keyof typeof countryTranslations] || countryTranslations?.en || {};
  return (key: string) => (translations as any)[key] || (countryNames as any)[key] || key;
}

/** Původní rozhraní pro iso_3166_1.ts */
export interface Country {
  code: string;
  name: string;
  native: string;
  continent: string;
  population: number;
  phone: number[];
  capital?: string;
  currency?: string[];
  language?: string[];
}

export const countriesData = iso_3166_1 as Record<string, Country>;

export const getAllLanguages = (): string[] => {
  return [
    ...new Set(
      Object.values(countriesData)
        .flatMap(c => c.language ?? [])
    )
  ].sort();
};

export const getAllCurrencies = (): string[] => {
  return [
    ...new Set(
      Object.values(countriesData)
        .flatMap(c => c.currency ?? [])
    )
  ].sort();
};

export const getAllContinents = (): string[] => {
  return [
    ...new Set(
      Object.values(countriesData)
        .map(c => c.continent)
    )
  ].sort();
};

export const getAllCapitals = (): string[] => {
  return Object.values(countriesData)
    .map(c => c.capital)
    .filter((cap): cap is string => !!cap)
    .sort();
};

function getLangInfo(code: string) {
  const c = code.toLowerCase();
  const meta = (iso_639_1 as any)?.[c] || (iso_639_3 as any)?.[c];
  
  if (!meta) {
    return {
      code: c,
      nameEn: 'Unknown',
      namelabel: '—',
      type: '—',
      isKnown: false
    };
  }

  return {
    code: c,
    nameEn: meta.en || 'Unknown',
    namelabel: meta.label || '—',
    type: meta.type || '—',
    isKnown: true
  };
}

export function getUsedLanguagesData() {
  const usedCodes = new Set<string>();
  Object.values(countriesData).forEach(c => {
    c.language?.forEach(l => usedCodes.add(l));
  });

  return Array.from(usedCodes).map(code => {
    const info = getLangInfo(code);
    const usageCount = Object.values(countriesData)
      .filter(c => c.language?.includes(code)).length;

    return {
      ...info,
      usageCount
    };
  });
}

export function getUnusedLanguagesData() {
  const usedCodes = new Set<string>();
  Object.values(countriesData).forEach(c => {
    c.language?.forEach(l => usedCodes.add(l));
  });

  const allAvailableCodes = new Set([
    ...Object.keys(iso_639_1),
    ...Object.keys(iso_639_3)
  ]);

  return Array.from(allAvailableCodes)
    .filter(code => !usedCodes.has(code))
    .map(code => getLangInfo(code))
    .sort((a, b) => a.nameEn.localeCompare(b.nameEn));
}
