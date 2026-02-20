export const locales = {
  gb: { lang: 'en-GB', flag: 'GB', label: 'English (UK)' },
  en: { lang: 'en-US', flag: 'US', label: 'English (US)' },
  cs: { lang: 'cs', flag: 'CZ', label: 'Čeština' },
  sk: { lang: 'sk', flag: 'SK', label: 'Slovenčina' },
  pl: { lang: 'pl', flag: 'PL', label: 'Polski' },
  uk: { lang: 'uk', flag: 'UA', label: 'Українська' },
  ru: { lang: 'ru', flag: 'RU', label: 'Русский' },
  de: { lang: 'de', flag: 'DE', label: 'Deutsch' },
  fr: { lang: 'fr', flag: 'FR', label: 'Français' },
  it: { lang: 'it', flag: 'IT', label: 'Italiano' },
  nl: { lang: 'nl', flag: 'NL', label: 'Nederlands' },
  fi: { lang: 'fi', flag: 'FI', label: 'Suomi' },
  no: { lang: 'no', flag: 'NO', label: 'Norsk' },
  sv: { lang: 'sv', flag: 'SE', label: 'Svenska' },
  es: { lang: 'es', flag: 'ES', label: 'Español' },
  pt: { lang: 'pt', flag: 'PT', label: 'Português' },
  tr: { lang: 'tr', flag: 'TR', label: 'Türkçe' },
  el: { lang: 'el', flag: 'GR', label: 'Ελληνικά' },
  zh: { lang: 'zh', flag: 'CN', label: '简体中文' },
  ja: { lang: 'ja', flag: 'JP', label: '日本語' },
  ko: { lang: 'ko', flag: 'KR', label: '한국어' },
  hi: { lang: 'hi', flag: 'IN', label: 'हिन्दी' },
  ar: { lang: 'ar', flag: 'SA', label: 'العربية' },
  he: { lang: 'he', flag: 'IL', label: 'עברית' },
};
/**
 * Převede lang (např. 'en-US') na klíč (např. 'en').
 * Pokud klíč nenajde, vrátí původní hodnotu jako fallback.
 */
export function getLocaleKey(lang: string | undefined): string {
  if (!lang) return 'en';
  // Najdeme klíč, jehož lang vlastnost odpovídá hledanému lang
  const entry = Object.entries(locales).find(([key, val]) => val.lang === lang);
  // Pokud najdeme shodu, vrátíme klíč (např. 'en'), jinak lang.
  return entry ? entry[0] : lang;
}
/**
 * Vygeneruje správnou lokalizovanou cestu.
 * Použití: getPath(Astro.currentLocale, '/settings')
 */
export function getPath(lang: string | undefined, path: string): string {
  const key = getLocaleKey(lang);
  const cleanPath = path.replace(/^\/|\/$/g, '');
  // Ošetření pro domovskou stránku daného jazyka
  if (cleanPath === '') return `/${key}/`;
  
  return `/${key}/${cleanPath}/`;
}