import { locales } from './i18n/locales.ts';
import { iso_3166_1 } from './i18n/iso_3166_1.ts';
import { countryTranslations } from './i18n/country_translations.ts';
import { iso_4217 } from './i18n/iso_4217.ts';
import { iso_639_1 } from './i18n/iso_639_1.ts';
import { iso_639_3 } from './i18n/iso_639_3.ts';
import { iso_639_3166 } from './i18n/iso_639_3166.ts';
import { uiStrings } from './i18n/ui.ts';
import currencies from './i18n/currencies.json' with { type: 'json' };
import countries from './i18n/countries.json' with { type: 'json' };

export interface CurrencyDetail {
  name: string;
  demonym: string;
  majorSingle: string;
  majorPlural: string;
  ISOnum: number | null;
  symbol: string;
  symbolNative: string;
  minorSingle: string;
  minorPlural: string;
  ISOdigits: number;
  decimals: number;
  numToBasic: number | null;
}

export const currencyData = currencies as unknown as Record<string, CurrencyDetail>;

export interface MledozeCountry {
  cca2: string; 
  cca3: string; 
  name: {
    common: string;
    native: Record<string, any>; 
  };
  translations: Record<string, { common: string }>;
  currencies?: Record<string, { name: string; symbol: string }>;
  borders?: string[];
  tld?: string[];
  latlng?: [number, number];
  area?: number;
  region?: string;
  subregion?: string;
  timezones?: string[];
  maps?: {
    googleMaps: string;
    openStreetMaps: string;
  };
  flags?: {
    png: string;
    svg: string;
    alt?: string;
  };
}

// Přetypování JSONu
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
  return countryList.find(curr => 
    curr.cca2 === c || 
    curr.cca3 === c || 
    curr.name.common.toUpperCase() === c
  );
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

/** Vrátí seznam zemí, které používají danou měnu */
export function getCountriesByCurrency(currencyCode: string) {
  return countryList.filter(c => c.currencies && Object.keys(c.currencies).includes(currencyCode));
}

// --- SEKCE: VALIDACE A STÁVAJÍCÍ I18N LOGIKA ---

if (!locales) throw new Error("Chybí export 'locales'.");
if (!iso_3166_1) throw new Error("Chybí export 'iso_3166_1'.");

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
  if (!code) return '—';
  const c = code.toLowerCase();
  
  // Pomocná funkce pro prohledání všech zdrojů
  const findMeta = (cd: string) => {
    const key = cd.toLowerCase();
    // Musíme zkontrolovat, zda přistupujeme k objektu přímo, nebo přes jeho pojmenovaný export
    const table639_1 = (iso_639_1 as any)?.iso_639_1 || iso_639_1;
    const table639_3 = (iso_639_3 as any)?.iso_639_3 || iso_639_3;
    const tableHybrid = (iso_639_3166 as any)?.iso_639_3166 || iso_639_3166;

    return tableHybrid?.[cd] || tableHybrid?.[key] || table639_1?.[key] || table639_3?.[key];
  };

  let meta = findMeta(code);

  if (!meta) return code;

  // Získání jména (podpora pro různé formáty tvých souborů)
  const name = meta.en || meta.label || meta.name || code;
  return `${name} (${code.toLowerCase()})`;
};

function getLangInfo(code: string) {
  if (!code) return { code: '??', nameEn: 'Unknown', namelabel: '—', type: '—', isKnown: false };
  const c = code.toLowerCase();

  const table639_1 = (iso_639_1 as any)?.iso_639_1 || iso_639_1;
  const table639_3 = (iso_639_3 as any)?.iso_639_3 || iso_639_3;
  const tableHybrid = (iso_639_3166 as any)?.iso_639_3166 || iso_639_3166;

  const meta = tableHybrid?.[code] || tableHybrid?.[c] || table639_1?.[c] || table639_3?.[c];

  if (!meta) {
    if (c.includes('-')) {
      const base = c.split('-')[0];
      const baseMeta = table639_1?.[base] || table639_3?.[base];
      if (baseMeta) {
        return {
          code: c,
          nameEn: `${baseMeta.en || baseMeta.label || baseMeta.name} (${c.split('-')[1].toUpperCase()})`,
          namelabel: baseMeta.label || '—',
          type: 'hybrid',
          isKnown: true
        };
      }
    }
    return { code: c, nameEn: 'Unknown', namelabel: '—', type: '—', isKnown: false };
  }

  return {
    code: c,
    nameEn: meta.en || meta.name || meta.label || 'Unknown',
    native: meta.label || meta.native || meta.name || '—',
    type: meta.type || 'standard',
    isKnown: true
  };
}

export const getCurrencyLabel = (code: string, lang: string) => {
//const curr = iso_4217?.[code];
  const curr = currencyData?.[code];
  if (!curr) return code;
  return `${curr.name} (${code})`;
};

export function useTranslations(lang: string) {
  const translations = uiStrings?.[lang as keyof typeof uiStrings] || uiStrings?.en || {};
  const countryNames = countryTranslations?.[lang as keyof typeof countryTranslations] || countryTranslations?.en || {};
  return (key: string) => (translations as any)[key] || (countryNames as any)[key] || key;
}

/** Původní rozhraní pro iso_3166_1.ts rozšířené o nepovinná pole pro bezchybný TypeScript */
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
  // Přidáme timezone sem, abychom ho v [code].astro nemuseli složitě hledat
  timezone?: string;
}

export const countriesData = iso_3166_1 as Record<string, Country>;

// Helper funkce pro jazyky, měny, kontinenty...
export const getAllLanguages = (): string[] => {
  return [...new Set(Object.values(countriesData).flatMap(c => c.language ?? []))].sort();
};

export const getAllCurrencies = (): string[] => {
  return [...new Set(Object.values(countriesData).flatMap(c => c.currency ?? []))].sort();
};

export const getAllContinents = (): string[] => {
  return [...new Set(Object.values(countriesData).map(c => c.continent))].sort();
};

export const getAllCapitals = (): string[] => {
  return Object.values(countriesData).map(c => c.capital).filter((cap): cap is string => !!cap).sort();
};

export function getUsedLanguagesData() {
  const usedCodes = new Set<string>();
  Object.values(countriesData).forEach(c => { c.language?.forEach(l => usedCodes.add(l)); });
  return Array.from(usedCodes).map(code => {
    const info = getLangInfo(code);
    const usageCount = Object.values(countriesData).filter(c => c.language?.includes(code)).length;
    return { ...info, usageCount };
  });
}

export function getUnusedLanguagesData() {
  const usedCodes = new Set<string>();
  Object.values(countriesData).forEach(c => { c.language?.forEach(l => usedCodes.add(l)); });
  const allAvailableCodes = new Set([...Object.keys(iso_639_1), ...Object.keys(iso_639_3)]);
  return Array.from(allAvailableCodes).filter(code => !usedCodes.has(code)).map(code => getLangInfo(code)).sort((a, b) => a.nameEn.localeCompare(b.nameEn));
}
