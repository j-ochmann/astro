import { locales } from './i18n/locales';
import { iso_3166_1 } from './i18n/iso_3166_1';
import { countryTranslations } from './i18n/country_translations';
import { iso_4217 } from './i18n/iso_4217';
import { iso_639_1 } from './i18n/iso_639_1';
import { iso_639_3 } from './i18n/iso_639_3';
import { uiStrings } from './i18n/ui';

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
  let l = (iso_639_1 as any)[code]; // 1. Zkusí ISO 639-1 (2-písmenné kódy) 
  if (!l) { // 2. Zkusí ISO 639-3 (3-písmenné kódy)
    l = (iso_639_3 as any)[code];
  }
  if (!l) return code.toLowerCase(); // 3. Fallback kód
  const name = l.en || l.label || code; // 4. Výběr názvu může rozšířit o češtinu
  // Vrací formát: "Afar (AA)" nebo "Egyptian Arabic (ARZ)"
  return `${name} (${code.toLowerCase()})`;
};

export const getCurrencyLabel = (code: string, lang: string) => {
  const curr = iso_4217[code];
  if (!curr) return code;
  return `${curr.name} (${code})`;
};

export function useTranslations(lang: string) {
  const translations = uiStrings[lang as keyof typeof uiStrings] || uiStrings.en;
  const countryNames = countryTranslations[lang as keyof typeof countryTranslations] || countryTranslations.en;
  // Pokud klíč neexistuje v UI strings ani v Country strings, vrátí klíč samotný
  return (key: string) => (translations as any)[key] || (countryNames as any)[key] || key;
}

export interface Country {
  code: string;
  name: string;
  native: string;
  continent: string;
  population: number;
  phone: number[];
  capital?: string;      // Otazník znamená: může být undefined
  currency?: string[];   // Otazník znamená: může být undefined
  language?: string[];   // Otazník znamená: může být undefined
}

export const countriesData = iso_3166_1 as Record<string, Country>;
/** Unikátní jazyky (Antarktidu s undefined přeskočí) */
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
    const meta = (iso_639_1 as any)[c] || (iso_639_3 as any)[c];
  
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
