export const locales = {
  gb: { lang: 'en-GB', flag: 'GB', native: 'English (UK)' },
  en: { lang: 'en-US', flag: 'US', native: 'English (US)' },
  cs: { lang: 'cs', flag: 'CZ', native: 'Čeština' },
  sk: { lang: 'sk', flag: 'SK', native: 'Slovenčina' },
  pl: { lang: 'pl', flag: 'PL', native: 'Polski' },
  uk: { lang: 'uk', flag: 'UA', native: 'Українська' },
  ru: { lang: 'ru', flag: 'RU', native: 'Русский' },
  de: { lang: 'de', flag: 'DE', native: 'Deutsch' },
  fr: { lang: 'fr', flag: 'FR', native: 'Français' },
  it: { lang: 'it', flag: 'IT', native: 'Italiano' },
  nl: { lang: 'nl', flag: 'NL', native: 'Nederlands' },
  fi: { lang: 'fi', flag: 'FI', native: 'Suomi' },
  no: { lang: 'no', flag: 'NO', native: 'Norsk' },
  sv: { lang: 'sv', flag: 'SE', native: 'Svenska' },
  es: { lang: 'es', flag: 'ES', native: 'Español' },
  pt: { lang: 'pt', flag: 'PT', native: 'Português' },
  tr: { lang: 'tr', flag: 'TR', native: 'Türkçe' },
  el: { lang: 'el', flag: 'GR', native: 'Ελληνικά' },
  zh: { lang: 'zh', flag: 'CN', native: '简体中文' },
  ja: { lang: 'ja', flag: 'JP', native: '日本語' },
  ko: { lang: 'ko', flag: 'KR', native: '한국어' },
  hi: { lang: 'hi', flag: 'IN', native: 'हिन्दी' },
  ar: { lang: 'ar', flag: 'SA', native: 'العربية' },
  he: { lang: 'he', flag: 'IL', native: 'עברית' },
};

export function getI18nPaths() {
  return Object.keys(locales).map((lang) => ({
    params: { lang },
  }));
}

export function getFlagCode(lang_id: string) {
  return Object.values(locales).find(
    (item) => item.lang.toLowerCase() === lang_id.toLowerCase())?.flag.toLowerCase();
}

export const languages = {
  aa: { order:   1, iso_639_1: 'aa', name: 'Afar',        native: 'Qafár af' },
  ab: { order:   2, iso_639_1: 'ab', name: 'Abkhazian',   native: 'Аҧсуа' },
  ae: { order:   3, iso_639_1: 'ae', name: 'Avestan',     native: 'Avesta', type: 'H' },
  af: { order:   4, iso_639_1: 'af', name: 'Afrikaans',   native: 'Afrikaans' },
  ak: { order:   5, iso_639_1: 'ak', name: 'Akan',        native: 'Akana' },
  am: { order:   6, iso_639_1: 'am', name: 'Amharic',     native: 'አማርኛ' },
  an: { order:   7, iso_639_1: 'an', name: 'Aragonese',   native: 'Aragonés' },
  ar: { order:   8, iso_639_1: 'ar', name: 'Arabic',      native: 'العربية' },
  as: { order:   9, iso_639_1: 'as', name: 'Assamese',    native: 'অসমীয়া' },
  av: { order:  10, iso_639_1: 'av', name: 'Avaric',      native: 'Авар' },
  ay: { order:  11, iso_639_1: 'ay', name: 'Aymara',      native: 'Aymar' },
  az: { order:  12, iso_639_1: 'az', name: 'Azerbaijani', native: 'Azərbaycanca' },
  ba: { order:  13, iso_639_1: 'ba', name: 'Bashkir',     native: 'Bashkort' },
  be: { order:  14, iso_639_1: 'be', name: 'Belarusian',  native: 'Беларуская' },
  bg: { order:  15, iso_639_1: 'bg', name: 'Bulgarian',   native: 'Български' },
  bi: { order:  16, iso_639_1: 'bi', name: 'Bislama',     native: 'Bislama' },
  bm: { order:  17, iso_639_1: 'bm', name: 'Bambara',     native: 'Bamanankan' },
  bn: { order:  18, iso_639_1: 'bn', name: 'Bengali',     native: 'বাংলা' },
  bo: { order:  19, iso_639_1: 'bo', name: 'Tibetan',     native: 'བོད་ཡིག' },
  br: { order:  20, iso_639_1: 'br', name: 'Breton',      native: 'Brezhoneg' },
  bs: { order:  21, iso_639_1: 'bs', name: 'Bosnian',     native: 'Bosanski' },
  ca: { order:  22, iso_639_1: 'ca', name: 'Catalan',     native: 'Català' },
  ce: { order:  23, iso_639_1: 'ce', name: 'Chechen',     native: 'Нохчийн' },
  ch: { order:  24, iso_639_1: 'ch', name: 'Chamorro',    native: 'Chamoru' },
  co: { order:  25, iso_639_1: 'co', name: 'Corsican',    native: 'Corsu' },
  cr: { order:  26, iso_639_1: 'cr', name: 'Cree',        native: 'Nehiyawewin' },
  cs: { order:  27, iso_639_1: 'cs', name: 'Czech',       native: 'Čeština' },
  cu: { order:  28, iso_639_1: 'cu', name: 'Church Slavic',    native: 'Словѣньскъ', type: 'H' },
  cv: { order:  29, iso_639_1: 'cv', name: 'Chuvash',     native: 'Чӑваш' },
  cy: { order:  30, iso_639_1: 'cy', name: 'Welsh',       native: 'Cymraeg' },
  da: { order:  31, iso_639_1: 'da', name: 'Danish',      native: 'Dansk' },
  de: { order:  32, iso_639_1: 'de', name: 'German',      native: 'Deutsch' },
  dv: { order:  33, iso_639_1: 'dv', name: 'Divehi',      native: 'ދިވެހިބަސް' },
  dz: { order:  34, iso_639_1: 'dz', name: 'Dzongkha',    native: 'རྫོང་ཁ' },
  ee: { order:  35, iso_639_1: 'ee', name: 'Ewe',         native: 'Eʋegbe' },
  el: { order:  36, iso_639_1: 'el', name: 'Greek',       native: 'Ελληνικά' },
  en: { order:  37, iso_639_1: 'en', name: 'English',     native: 'English' },
  eo: { order:  38, iso_639_1: 'eo', name: 'Esperanto',   native: 'Esperanto', type: 'C' },
  es: { order:  39, iso_639_1: 'es', name: 'Spanish',     native: 'Español' },
  et: { order:  40, iso_639_1: 'et', name: 'Estonian',    native: 'Eesti' },
  eu: { order:  41, iso_639_1: 'eu', name: 'Basque',      native: 'Euskara' },
  fa: { order:  42, iso_639_1: 'fa', name: 'Persian',     native: 'فارسی' },
  ff: { order:  43, iso_639_1: 'ff', name: 'Fulah',       native: 'Fulfulde' },
  fi: { order:  44, iso_639_1: 'fi', name: 'Finnish',     native: 'Suomi' },
  fj: { order:  45, iso_639_1: 'fj', name: 'Fijian',      native: 'Na Vosa Vakaviti' },
  fo: { order:  46, iso_639_1: 'fo', name: 'Faroese',     native: 'Føroyskt' },
  fr: { order:  47, iso_639_1: 'fr', name: 'French',      native: 'Français' },
  fy: { order:  48, iso_639_1: 'fy', name: 'Western Frisian',  native: 'Frysk' },
  ga: { order:  49, iso_639_1: 'ga', name: 'Irish',       native: 'Gaeilge' },
  gd: { order:  50, iso_639_1: 'gd', name: 'Gaelic',      native: 'Gàidhlig' },
  gl: { order:  51, iso_639_1: 'gl', name: 'Galician',    native: 'Galego' },
  gn: { order:  52, iso_639_1: 'gn', name: 'Guarani',     native: 'Avañe\'ẽ' },
  gu: { order:  53, iso_639_1: 'gu', name: 'Gujarati',    native: 'ગુજરાતી' },
  gv: { order:  54, iso_639_1: 'gv', name: 'Manx',        native: 'Gaelg' },
  ha: { order:  55, iso_639_1: 'ha', name: 'Hausa',       native: 'هَوُسَ' },
  he: { order:  56, iso_639_1: 'he', name: 'Hebrew',      native: 'עברית' },
  hi: { order:  57, iso_639_1: 'hi', name: 'Hindi',       native: 'हिन्दी' },
  ho: { order:  58, iso_639_1: 'ho', name: 'Hiri Motu',   native: 'Hiri Motu' },
  hr: { order:  59, iso_639_1: 'hr', name: 'Croatian',    native: 'Hrvatski' },
  ht: { order:  60, iso_639_1: 'ht', name: 'Haitian',     native: 'Kreyòl ayisyen' },
  hu: { order:  61, iso_639_1: 'hu', name: 'Hungarian',   native: 'Magyar' },
  hy: { order:  62, iso_639_1: 'hy', name: 'Armenian',    native: 'Հայերեն' },
  hz: { order:  63, iso_639_1: 'hz', name: 'Herero',      native: 'Otjiherero' },
  ia: { order:  64, iso_639_1: 'ia', name: 'Interlingua', native: 'Interlingua', type: 'C' },
  id: { order:  65, iso_639_1: 'id', name: 'Indonesian',  native: 'Bahasa Indonesia' },
  ie: { order:  66, iso_639_1: 'ie', name: 'Interlingue', native: 'Interlingue', type: 'C' },
  ig: { order:  67, iso_639_1: 'ig', name: 'Igbo',        native: 'Asụsụ Igbo' },
  ii: { order:  68, iso_639_1: 'ii', name: 'Sichuan Yi',  native: 'ꆈꌠ꒿' },
  ik: { order:  69, iso_639_1: 'ik', name: 'Inupiaq',     native: 'Iñupiaq' },
  io: { order:  70, iso_639_1: 'io', name: 'Ido',         native: 'Ido', type: 'C' },
  is: { order:  71, iso_639_1: 'is', name: 'Icelandic',   native: 'Íslenska' },
  it: { order:  72, iso_639_1: 'it', name: 'Italian',     native: 'Italiano' },
  iu: { order:  73, iso_639_1: 'iu', name: 'Inuktitut',   native: 'ᐃᓄᒃᑎᑐᑦ' },
  ja: { order:  74, iso_639_1: 'ja', name: 'Japanese',    native: '日本語' },
  jv: { order:  75, iso_639_1: 'jv', name: 'Javanese',    native: 'Basa Jawa' },
  ka: { order:  76, iso_639_1: 'ka', name: 'Georgian',    native: 'ქართული' },
  kg: { order:  77, iso_639_1: 'kg', name: 'Kongo',       native: 'Kikongo' },
  ki: { order:  78, iso_639_1: 'ki', name: 'Kikuyu',      native: 'Gĩkũyũ' },
  kj: { order:  79, iso_639_1: 'kj', name: 'Kuanyama',    native: 'Kuanyama' },
  kk: { order:  80, iso_639_1: 'kk', name: 'Kazakh',      native: 'Қазақша' },
  kl: { order:  81, iso_639_1: 'kl', name: 'Kalaallisut', native: 'Kalaallisut' },
  km: { order:  82, iso_639_1: 'km', name: 'Khmer',       native: 'ភាសាខ្មဲរ' },
  kn: { order:  83, iso_639_1: 'kn', name: 'Kannada',     native: 'ಕನ್ನಡ' },
  ko: { order:  84, iso_639_1: 'ko', name: 'Korean',      native: '한국어' },
  kr: { order:  85, iso_639_1: 'kr', name: 'Kanuri',      native: 'Kanuri' },
  ks: { order:  86, iso_639_1: 'ks', name: 'Kashmiri',    native: 'कश्मीरी' },
  ku: { order:  87, iso_639_1: 'ku', name: 'Kurdish',     native: 'Kurdî' },
  kv: { order:  88, iso_639_1: 'kv', name: 'Komi',        native: 'Коми' },
  kw: { order:  89, iso_639_1: 'kw', name: 'Cornish',     native: 'Kernewek' },
  ky: { order:  90, iso_639_1: 'ky', name: 'Kirghiz',     native: 'Кыргызча' },
  la: { order:  91, iso_639_1: 'la', name: 'Latin',       native: 'Latina', type: 'H' },
  lb: { order:  92, iso_639_1: 'lb', name: 'Luxembourgish', native: 'Lëtzebuergesch' },
  lg: { order:  93, iso_639_1: 'lg', name: 'Ganda',         native: 'Luganda' },
  li: { order:  94, iso_639_1: 'li', name: 'Limburgish',    native: 'Limburgs' },
  ln: { order:  95, iso_639_1: 'ln', name: 'Lingala',       native: 'Lingála' },
  lo: { order:  96, iso_639_1: 'lo', name: 'Lao',           native: 'ພາສາລາວ' },
  lt: { order:  97, iso_639_1: 'lt', name: 'Lithuanian',    native: 'Lietuvių' },
  lu: { order:  98, iso_639_1: 'lu', name: 'Luba-Katanga',  native: 'Tshiluba' },
  lv: { order:  99, iso_639_1: 'lv', name: 'Latvian',       native: 'Latviešu' },
  mg: { order: 100, iso_639_1: 'mg', name: 'Malagasy',     native: 'Malagasy' },
  mh: { order: 101, iso_639_1: 'mh', name: 'Marshallese',  native: 'Kajin M̧ajeļ' },
  mi: { order: 102, iso_639_1: 'mi', name: 'Maori',        native: 'Te Reo Māori' },
  mk: { order: 103, iso_639_1: 'mk', name: 'Macedonian',   native: 'Македонски' },
  ml: { order: 104, iso_639_1: 'ml', name: 'Malayalam',    native: 'മലയാളം' },
  mn: { order: 105, iso_639_1: 'mn', name: 'Mongolian',    native: 'Монгол' },
  mr: { order: 106, iso_639_1: 'mr', name: 'Marathi',      native: 'मराठी' },
  ms: { order: 107, iso_639_1: 'ms', name: 'Malay',        native: 'Bahasa Melayu' },
  mt: { order: 108, iso_639_1: 'mt', name: 'Maltese',      native: 'Malti' },
  my: { order: 109, iso_639_1: 'my', name: 'Burmese',      native: 'ဗမာစာ' },
  na: { order: 110, iso_639_1: 'na', name: 'Nauru',        native: 'Ekakairũ Naoero' },
  nb: { order: 111, iso_639_1: 'nb', name: 'Bokmål, Norwegian',  native: 'Norsk bokmål' },
  nd: { order: 112, iso_639_1: 'nd', name: 'North Ndebele',      native: 'isiNdebele' },
  ne: { order: 113, iso_639_1: 'ne', name: 'Nepali',       native: 'नेपाली' },
  ng: { order: 114, iso_639_1: 'ng', name: 'Ndonga',       native: 'Owambo' },
  nl: { order: 115, iso_639_1: 'nl', name: 'Dutch',        native: 'Nederlands' },
  nn: { order: 116, iso_639_1: 'nn', name: 'Norwegian Nynorsk',  native: 'Norsk nynorsk' },
  no: { order: 117, iso_639_1: 'no', name: 'Norwegian',    native: 'Norsk' },
  nr: { order: 118, iso_639_1: 'nr', name: 'South Ndebele',      native: 'isiNdebele' },
  nv: { order: 119, iso_639_1: 'nv', name: 'Navajo',       native: 'Diné bizaad' },
  ny: { order: 120, iso_639_1: 'ny', name: 'Chichewa',     native: 'Chi-Chewa' },
  oc: { order: 121, iso_639_1: 'oc', name: 'Occitan',      native: 'Occitan' },
  oj: { order: 122, iso_639_1: 'oj', name: 'Ojibwa',       native: 'ᐊᓂᔑᓈᐯᒧ win' },
  om: { order: 123, iso_639_1: 'om', name: 'Oromo',        native: 'Afaan Oromoo' },
  or: { order: 124, iso_639_1: 'or', name: 'Oriya',        native: 'ଓଡ଼ିଆ' },
  os: { order: 125, iso_639_1: 'os', name: 'Ossetian',     native: 'Ирон' },
  pa: { order: 126, iso_639_1: 'pa', name: 'Panjabi',      native: 'ਪੰਜਾਬੀ' },
  pi: { order: 127, iso_639_1: 'pi', name: 'Pali',         native: 'पाळि', type: 'H' },
  pl: { order: 128, iso_639_1: 'pl', name: 'Polish',       native: 'Polski' },
  ps: { order: 129, iso_639_1: 'ps', name: 'Pashto',       native: 'پښتو' },
  pt: { order: 130, iso_639_1: 'pt', name: 'Portuguese',   native: 'Português' },
  qu: { order: 131, iso_639_1: 'qu', name: 'Quechua',      native: 'Runa Simi' },
  rm: { order: 132, iso_639_1: 'rm', name: 'Romansh',      native: 'Rumantsch' },
  rn: { order: 133, iso_639_1: 'rn', name: 'Rundi',        native: 'Kirundi' },
  ro: { order: 134, iso_639_1: 'ro', name: 'Romanian',     native: 'Română' },
  ru: { order: 135, iso_639_1: 'ru', name: 'Russian',      native: 'Русский' },
  rw: { order: 136, iso_639_1: 'rw', name: 'Kinyarwanda',  native: 'Ikinyarwanda' },
  sa: { order: 137, iso_639_1: 'sa', name: 'Sanskrit',     native: 'संस्कृतम्', type: 'H' },
  sc: { order: 138, iso_639_1: 'sc', name: 'Sardinian',    native: 'Sardu' },
  sd: { order: 139, iso_639_1: 'sd', name: 'Sindhi',       native: 'سنڌي' },
  se: { order: 140, iso_639_1: 'se', name: 'Northern Sami',   native: 'Davvisámegiella' },
  sg: { order: 141, iso_639_1: 'sg', name: 'Sango',        native: 'Yângâ tî Sängö' },
  si: { order: 142, iso_639_1: 'si', name: 'Sinhala',      native: 'සිංහල' },
  sk: { order: 143, iso_639_1: 'sk', name: 'Slovak',       native: 'Slovenčina' },
  sl: { order: 144, iso_639_1: 'sl', name: 'Slovenian',    native: 'Slovenščina' },
  sm: { order: 145, iso_639_1: 'sm', name: 'Samoan',       native: 'Gagana fa\'a Samoa' },
  sn: { order: 146, iso_639_1: 'sn', name: 'Shona',        native: 'chiShona' },
  so: { order: 147, iso_639_1: 'so', name: 'Somali',       native: 'Soomaaliga' },
  sq: { order: 148, iso_639_1: 'sq', name: 'Albanian',     native: 'Shqip' },
  sr: { order: 149, iso_639_1: 'sr', name: 'Serbian',      native: 'Српски' },
  ss: { order: 150, iso_639_1: 'ss', name: 'Swati',        native: 'SiSwati' },
  st: { order: 151, iso_639_1: 'st', name: 'Southern Sotho',  native: 'Sesotho' },
  su: { order: 152, iso_639_1: 'su', name: 'Sundanese',    native: 'Basa Sunda' },
  sv: { order: 153, iso_639_1: 'sv', name: 'Swedish',      native: 'Svenska' },
  sw: { order: 154, iso_639_1: 'sw', name: 'Swahili',      native: 'Kiswahili' },
  ta: { order: 155, iso_639_1: 'ta', name: 'Tamil',        native: 'தமிழ்' },
  te: { order: 156, iso_639_1: 'te', name: 'Telugu',       native: 'తెలుగు' },
  tg: { order: 157, iso_639_1: 'tg', name: 'Tajik',        native: 'Тоҷикӣ' },
  th: { order: 158, iso_639_1: 'th', name: 'Thai',         native: 'ไทย' },
  ti: { order: 159, iso_639_1: 'ti', name: 'Tigrinya',     native: 'ትግርኛ' },
  tk: { order: 160, iso_639_1: 'tk', name: 'Turkmen',      native: 'Türkmençe' },
  tl: { order: 161, iso_639_1: 'tl', name: 'Tagalog',      native: 'Tagalog' },
  tn: { order: 162, iso_639_1: 'tn', name: 'Tswana',       native: 'Setswana' },
  to: { order: 163, iso_639_1: 'to', name: 'Tonga',        native: 'Faka Tonga' },
  tr: { order: 164, iso_639_1: 'tr', name: 'Turkish',      native: 'Türkçe' },
  ts: { order: 165, iso_639_1: 'ts', name: 'Tsonga',       native: 'Xitsonga' },
  tt: { order: 166, iso_639_1: 'tt', name: 'Tatar',        native: 'Татарча' },
  tw: { order: 167, iso_639_1: 'tw', name: 'Twi',          native: 'Twi' },
  ty: { order: 168, iso_639_1: 'ty', name: 'Tahitian',     native: 'Reo Māohi' },
  ug: { order: 169, iso_639_1: 'ug', name: 'Uighur',       native: 'ئۇيغۇرچە' },
  uk: { order: 170, iso_639_1: 'uk', name: 'Ukrainian',    native: 'Українська' },
  ur: { order: 171, iso_639_1: 'ur', name: 'Urdu',         native: 'اردو' },
  uz: { order: 172, iso_639_1: 'uz', name: 'Uzbek',        native: 'Oʻzbekcha' },
  ve: { order: 173, iso_639_1: 've', name: 'Venda',        native: 'Tshivenda' },
  vi: { order: 174, iso_639_1: 'vi', name: 'Vietnamese',   native: 'Tiếng Việt' },
  vo: { order: 175, iso_639_1: 'vo', name: 'Volapük',      native: 'Volapük', type: 'C' },
  wa: { order: 176, iso_639_1: 'wa', name: 'Walloon',      native: 'Walon' },
  wo: { order: 177, iso_639_1: 'wo', name: 'Wolof',        native: 'Wollof' },
  xh: { order: 178, iso_639_1: 'xh', name: 'Xhosa',        native: 'isiXhosa' },
  yi: { order: 179, iso_639_1: 'yi', name: 'Yiddish',      native: 'ייִדיש' },
  yo: { order: 180, iso_639_1: 'yo', name: 'Yoruba',       native: 'Yorùbá' },
  za: { order: 181, iso_639_1: 'za', name: 'Zhuang',       native: 'Saɯ cueŋƅ' },
  zh: { order: 182, iso_639_1: 'zh', name: 'Chinese',      native: '中文' },
  zu: { order: 183, iso_639_1: 'zu', name: 'Zulu',         native: 'isiZulu' }
};

export const iso_639_3 = {
acf:{order:1,iso_639_3:"acf",name:"Saint Lucian Creole French",native:"Kwéyòl"},
aig:{order:2,iso_639_3:"aig",name:"Antigua and Barbuda Creole English",native:"Creole English"},
arz:{order:3,iso_639_3:"arz",name:"Egyptian Arabic",native:"مصرى"},
ast:{order:4,iso_639_3:"ast",name:"Asturian",native:"Asturianu"},
bci:{order:5,iso_639_3:"bci",name:"Baoulé",native:"Baule"},
bal:{order:6,iso_639_3:"bal",name:"Baluchi",native:"بلوچی"},
bem:{order:7,iso_639_3:"bem",name:"Bemba",native:"ChiBemba"},
bfa:{order:8,iso_639_3:"bfa",name:"Bari",native:"Bari"},
bgc:{order:9,iso_639_3:"bgc",name:"Haryanvi",native:"हरियाणवी"},
bho:{order:10,iso_639_3:"bho",name:"Bhojpuri",native:"भोजपुरी"},
cal:{order:11,iso_639_3:"cal",name:"Carolinian",native:"Refaluwasch"},
chk:{order:12,iso_639_3:"chk",name:"Chuukese",native:"Fosun Chuuk"},
cjy:{order:13,iso_639_3:"cjy",name:"Jinyu Chinese",native:"晋语"},
cpe:{order:14,iso_639_3:"cpe",name:"English-based creoles and pidgins",native:"English-based creoles"},
crs:{order:15,iso_639_3:"crs",name:"Seselwa Creole French",native:"Seselwa"},
cse:{order:16,iso_639_3:"cse",name:"Czech Sign Language",native:"Český znakový jazyk"},
ctg:{order:17,iso_639_3:"ctg",name:"Chittagonian",native:"চাটগাঁইয়া"},
dhv:{order:18,iso_639_3:"dhv",name:"Dehu",native:"Drehu"},
din:{order:19,iso_639_3:"din",name:"Dinka",native:"Thuɔŋjäŋ"},
dje:{order:20,iso_639_3:"dje",name:"Zarma",native:"Zarmaciine"},
dsb:{order:21,iso_639_3:"dsb",name:"Lower Sorbian",native:"Dolnoserbski"},
dua:{order:22,iso_639_3:"dua",name:"Duala",native:"Dualá"},
dyu:{order:23,iso_639_3:"dyu",name:"Dyula",native:"Julakan"},
ewo:{order:24,iso_639_3:"ewo",name:"Ewondo",native:"Kolo"},
fng:{order:25,iso_639_3:"fng",name:"Fanagalo",native:"Fanagalo"},
fon:{order:26,iso_639_3:"fon",name:"Fon",native:"Fongbe"},
fud:{order:27,iso_639_3:"fud",name:"Futunan",native:"Faka futuna"},
fuf:{order:28,iso_639_3:"fuf",name:"Pular",native:"Pular"},
gag:{order:29,iso_639_3:"gag",name:"Gagauz",native:"Gagauz dili"},
gan:{order:30,iso_639_3:"gan",name:"Gan Chinese",native:"贛語"},
gcf:{order:31,iso_639_3:"gcf",name:"Guadeloupean Creole French",native:"Kréyòl gwadloupéyen"},
gcl:{order:32,iso_639_3:"gcl",name:"Grenadian Creole English",native:"Grenadian Creole"},
gcr:{order:33,iso_639_3:"gcr",name:"Guianese Creole French",native:"Kréyòl gwiyanyé"},
gil:{order:34,iso_639_3:"gil",name:"Kiribati",native:"Taetae ni Kiribati"},
grn:{order:35,iso_639_3:"grn",name:"Guarani",native:"Avañe'ẽ"},
gsw:{order:36,iso_639_3:"gsw",name:"Swiss German",native:"Schwiizertüütsch"},
guc:{order:37,iso_639_3:"guc",name:"Wayuu",native:"Wayuunaiki"},
gun:{order:38,iso_639_3:"gun",name:"Mbyá Guaraní",native:"Mbyá"},
gyn:{order:39,iso_639_3:"gyn",name:"Guyanese Creole English",native:"Guyanese Creole"},
hak:{order:40,iso_639_3:"hak",name:"Hakka Chinese",native:"客家語"},
haw:{order:41,iso_639_3:"haw",name:"Hawaiian",native:"ʻŌlelo Hawaiʻi"},
hne:{order:42,iso_639_3:"hne",name:"Chhattisgarhi",native:"छत्तीसगढ़ी"},
hsn:{order:43,iso_639_3:"hsn",name:"Xiang Chinese",native:"湘語"},
jam:{order:44,iso_639_3:"jam",name:"Jamaican Patois",native:"Patois"},
jax:{order:45,iso_639_3:"jax",name:"Malay (individual language)",native:"Bahasa Melayu Jambi"},
jer:{order:46,iso_639_3:"jer",name:"Jere",native:"Jere"},
jiv:{order:47,iso_639_3:"jiv",name:"Shuar",native:"Shuar chicham"},
kar:{order:48,iso_639_3:"kar",name:"Karen languages",native:"Pwo Karen"},
kbp:{order:49,iso_639_3:"kbp",name:"Kabiyè",native:"Kabiyɛ"},
kea:{order:50,iso_639_3:"kea",name:"Kabuverdianu",native:"Kabuverdianu"},
kek:{order:51,iso_639_3:"kek",name:"Q'eqchi'",native:"Q'eqchi'"},
kgp:{order:52,iso_639_3:"kgp",name:"Kaingang",native:"Kanhgág"},
kna:{order:53,iso_639_3:"kna",name:"Dera",native:"Dera"},
kri:{order:54,iso_639_3:"kri",name:"Krio",native:"Krio"},
kxd:{order:55,iso_639_3:"kxd",name:"Brunei Malay",native:"Bahasa Melayu Brunei"},
lir:{order:56,iso_639_3:"lir",name:"Liberian English",native:"Liberian English"},
loz:{order:57,iso_639_3:"loz",name:"Lozi",native:"Silozi"},
mai:{order:58,iso_639_3:"mai",name:"Maithili",native:"मैथिली"},
man:{order:59,iso_639_3:"man",name:"Mandingo",native:"Mandinka"},
mcf:{order:60,iso_639_3:"mcf",name:"Matsés",native:"Matsés"},
mey:{order:61,iso_639_3:"mey",name:"Hassaniya Arabic",native:"Hassaniya"},
mfe:{order:62,iso_639_3:"mfe",name:"Mauritian Creole",native:"Morisyen"},
mkw:{order:63,iso_639_3:"mkw",name:"Kituba (Congo)",native:"Kituba"},
mnk:{order:64,iso_639_3:"mnk",name:"Mandinka",native:"Mandinka"},
mny:{order:65,iso_639_3:"mny",name:"Magahi",native:"मगही"},
mwl:{order:66,iso_639_3:"mwl",name:"Mirandese",native:"Mirandés"},
mzn:{order:67,iso_639_3:"mzn",name:"Mazanderani",native:"مازِرونی"},
nah:{order:68,iso_639_3:"nah",name:"Nahuatl languages",native:"Nāhuatl"},
nan:{order:69,iso_639_3:"nan",name:"Min Nan Chinese",native:"閩南語"},
nep:{order:70,iso_639_3:"nep",name:"Nepali",native:"नेपाली"},
niu:{order:71,iso_639_3:"niu",name:"Niuean",native:"ko e vagahau Niuē"},
nrf:{order:72,iso_639_3:"nrf",name:"Jèrriais",native:"Jèrriais"},
nus:{order:73,iso_639_3:"nus",name:"Nuer",native:"Thok Naath"},
pan:{order:74,iso_639_3:"pan",name:"Punjabi",native:"ਪੰਜਾਬੀ"},
pap:{order:75,iso_639_3:"pap",name:"Papiamento",native:"Papiamentu"},
pau:{order:76,iso_639_3:"pau",name:"Palauan",native:"Belauan"},
pbb:{order:77,iso_639_3:"pbb",name:"Páez",native:"Nasa Yuwe"},
pih:{order:78,iso_639_3:"pih",name:"Norfolk",native:"Norf'k"},
pis:{order:79,iso_639_3:"pis",name:"Pijin",native:"Pijin"},
pnb:{order:80,iso_639_3:"pnb",name:"Western Panjabi",native:"پنجابی"},
pon:{order:81,iso_639_3:"pon",name:"Pohnpeian",native:"Mahsen en Pohnpei"},
pov:{order:82,iso_639_3:"pov",name:"Upper Guinea Crioulo",native:"Kriol"},
quc:{order:83,iso_639_3:"quc",name:"K'iche'",native:"K'iche'"},
rar:{order:84,iso_639_3:"rar",name:"Rarotongan",native:"Māori Kūki 'Āirani"},
rcf:{order:85,iso_639_3:"rcf",name:"Réunion Creole French",native:"Kréol réyoné"},
rmy:{order:86,iso_639_3:"rmy",name:"Vlax Romani",native:"Rrromani chib"},
rom:{order:87,iso_639_3:"rom",name:"Romany",native:"Romani čhib"},
shn:{order:88,iso_639_3:"shn",name:"Shan",native:"လိၵ်ႈတႆး"},
shu:{order:89,iso_639_3:"shu",name:"Chadian Arabic",native:"Chadian Arabic"},
smo:{order:90,iso_639_3:"smo",name:"Samoan",native:"Gagana Samoa"},
srn:{order:91,iso_639_3:"srn",name:"Sranan Tongo",native:"Sranan Tongo"},
svc:{order:92,iso_639_3:"svc",name:"Vincentian Creole English",native:"Vincentian Creole"},
swb:{order:93,iso_639_3:"swb",name:"Comorian",native:"Shimaore"},
syl:{order:94,iso_639_3:"syl",name:"Sylheti",native:"ছিলটী"},
szl:{order:95,iso_639_3:"szl",name:"Silesian",native:"Ślōnskŏ gŏdka"},
tet:{order:96,iso_639_3:"tet",name:"Tetum",native:"Tetun"},
tkl:{order:97,iso_639_3:"tkl",name:"Tokelauan",native:"Gagana Tokelau"},
tpi:{order:98,iso_639_3:"tpi",name:"Tok Pisin",native:"Tok Pisin"},
tsj:{order:99,iso_639_3:"tsj",name:"Tshangla",native:"Tshangla"},
tso:{order:100,iso_639_3:"tso",name:"Tsonga",native:"Xitsonga"},
tto:{order:101,iso_639_3:"tto",name:"Tobagonian Creole English",native:"Tobagonian Creole"},
tvl:{order:102,iso_639_3:"tvl",name:"Tuvaluan",native:"Te Ggana Tuvalu"},
vmw:{order:103,iso_639_3:"vmw",name:"Makhuwa",native:"Emakhuwa"},
wls:{order:104,iso_639_3:"wls",name:"Wallisian",native:"Faka'uvea"},
wuu:{order:105,iso_639_3:"wuu",name:"Wu Chinese",native:"吳語"},
yap:{order:106,iso_639_3:"yap",name:"Yapese",native:"Thin nu Wa'ab"},
yor:{order:107,iso_639_3:"yor",name:"Yoruba",native:"Yorùbá"},
yua:{order:108,iso_639_3:"yua",name:"Yucatec Maya",native:"Maaya t'aan"},
yue:{order:109,iso_639_3:"yue",name:"Cantonese",native:"粵語"},
zdj:{order:110,iso_639_3:"zdj",name:"Ngazidja Comorian",native:"Shingazidja"},
zgh:{order:111,iso_639_3:"zgh",name:"Standard Moroccan Tamazight",native:"ⵜⴰⵎⴰⵣⵉⵖⵜ ⵜⴰⵏⴰⵡⴰⵢⵜ"}
}

export const iso_639_3166 = {
"en-AU":{order:0,"key":"en-AU",name:"English",native:"English"},
"en-CA":{order:0,"key":"en-",name:"English",native:"English"},
"en-IN":{order:0,"key":"en-",name:"English",native:"English"},
"en-GB":{order:0,"key":"en-",name:"English",native:"English"},
"en-US":{order:0,"key":"en-",name:"English",native:"English"},
}

export const getLanguageLabel = (code: string, lang: string) => {
  let l = (languages as any)[code]; // 1. Zkusí ISO 639-1 (2-písmenné kódy) 
  if (!l) { // 2. Zkusí ISO 639-3 (3-písmenné kódy)
    l = (iso_639_3 as any)[code];
  }
  if (!l) return code.toLowerCase(); // 3. Fallback kód
  const name = l.en || l.label || code; // 4. Výběr názvu může rozšířit o češtinu
  // Vrací formát: "Afar (AA)" nebo "Egyptian Arabic (ARZ)"
  return `${name} (${code.toLowerCase()})`;
};

// číselník měn
export const currencies: Record<string, { en: string, cs: string }> = {
  "USD": { en: "US Dollar", cs: "Americký dolar" },
  "EUR": { en: "Euro", cs: "Euro" },
  "CZK": { en: "Czech Koruna", cs: "Česká koruna" },
  "GBP": { en: "British Pound", cs: "Britská libra" },
  "ZMW": { en: "Zambian Kwacha", cs: "Zambijská kwacha" },
  "ZAR": { en: "South African Rand", cs: "Jihoafrický rand" },
  // ... dopisovat podle potřeby
};

export const getCurrencyLabel = (code: string, lang: string) => {
  const curr = currencies[code];
  if (!curr) return code;
  return lang === 'cs' ? `${curr.cs} (${code})` : `${curr.en} (${code})`;
};

const countryTranslations = {
en: {}, gb: {}, // Pro angličtinu necháme prázdné, použijeme fallback na country.name
cs: {
"AF": "Afghánistán", "AX": "Ålandy", "AL": "Albánie", "DZ": "Alžírsko", "AS": "Americká Samoa", 
"AD": "Andorra", "AO": "Angola", "AI": "Anguilla", "AQ": "Antarktida", "AG": "Antigua a Barbuda", 
"AR": "Argentina", "AM": "Arménie", "AW": "Aruba", "AU": "Austrálie", "AT": "Rakousko", 
"AZ": "Ázerbájdžán", "BS": "Bahamy", "BH": "Bahrajn", "BD": "Bangladéš", "BB": "Barbados", 
"BY": "Bělorusko", "BE": "Belgie", "BZ": "Belize", "BJ": "Benin", "BM": "Bermudy", 
"BT": "Bhútán", "BO": "Bolívie", "BA": "Bosna a Hercegovina", "BW": "Botswana", "BR": "Brazílie", 
"VG": "Britské Panenské ostrovy", "BN": "Brunej", "BG": "Bulharsko", "BF": "Burkina Faso", "BI": "Burundi", 
"KH": "Kambodža", "CM": "Kamerun", "CA": "Kanada", "CV": "Kapverdy", "KY": "Kajmanské ostrovy", 
"CF": "Středoafrická republika", "TD": "Čad", "CL": "Chile", "CN": "Čína", "CX": "Vánoční ostrov", 
"CO": "Kolumbie", "KM": "Komory", "CG": "Kongo", "CD": "Kongo (DRK)", "CK": "Cookovy ostrovy", 
"CR": "Kostarika", "CI": "Pobřeží slonoviny", "HR": "Chorvatsko", "CU": "Kuba", "CY": "Kypr", 
"CZ": "Česko", "DK": "Dánsko", "DJ": "Džibutsko", "DM": "Dominika", "DO": "Dominikánská republika", 
"EC": "Ekvádor", "EG": "Egypt", "SV": "Salvador", "GQ": "Rovníková Guinea", "ER": "Eritrea", 
"EE": "Estonsko", "ET": "Etiopie", "FK": "Falklandy", "FO": "Faerské ostrovy", "FJ": "Fidži", 
"FI": "Finsko", "FR": "Francie", "GF": "Francouzská Guyana", "PF": "Francouzská Polynésie", "GA": "Gabon", 
"GM": "Gambie", "GE": "Gruzie", "DE": "Německo", "GH": "Ghana", "GI": "Gibraltar", 
"GR": "Řecko", "GL": "Grónsko", "GD": "Grenada", "GP": "Guadeloupe", "GU": "Guam", 
"GT": "Guatemala", "GG": "Guernsey", "GN": "Guinea", "GW": "Guinea-Bissau", "GY": "Guyana", 
"HT": "Haiti", "VA": "Vatikán", "HN": "Honduras", "HK": "Hongkong", "HU": "Maďarsko", 
"IS": "Island", "IN": "Indie", "ID": "Indonésie", "IR": "Írán", "IQ": "Irák", 
"IE": "Irsko", "IM": "Ostrov Man", "IL": "Izrael", "IT": "Itálie", "JM": "Jamajka", 
"JP": "Japonsko", "JE": "Jersey", "JO": "Jordánsko", "KZ": "Kazachstán", "KE": "Keňa", 
"KI": "Kiribati", "KP": "Severní Korea", "KR": "Jižní Korea", "KW": "Kuvajt", "KG": "Kyrgyzstán", 
"LA": "Laos", "LV": "Lotyšsko", "LB": "Libanon", "LS": "Lesotho", "LR": "Libérie", 
"LY": "Libye", "LI": "Lichtenštejnsko", "LT": "Litva", "LU": "Lucembursko", "MO": "Macao", 
"MK": "Severní Makedonie", "MG": "Madagaskar", "MW": "Malawi", "MY": "Malajsie", "MV": "Maledivy", 
"ML": "Mali", "MT": "Malta", "MH": "Marshallovy ostrovy", "MQ": "Martinik", "MR": "Mauritánie", 
"MU": "Mauricius", "YT": "Mayotte", "MX": "Mexiko", "FM": "Mikronésie", "MD": "Moldavsko", 
"MC": "Monako", "MN": "Mongolsko", "ME": "Černá Hora", "MS": "Montserrat", "MA": "Maroko", 
"MZ": "Mosambik", "MM": "Myanmar", "NA": "Namibie", "NR": "Nauru", "NP": "Nepál", 
"NL": "Nizozemsko", "NC": "Nová Kaledonie", "NZ": "Nový Zéland", "NI": "Nikaragua", "NE": "Niger", 
"NG": "Nigérie", "NU": "Niue", "NF": "Norfolk", "MP": "Severní Mariany", "NO": "Norsko", 
"OM": "Omán", "PK": "Pákistán", "PW": "Palau", "PS": "Palestina", "PA": "Panama", 
"PG": "Papua-Nová Guinea", "PY": "Paraguay", "PE": "Peru", "PH": "Filipíny", "PN": "Pitcairnovy ostrovy", 
"PL": "Polsko", "PT": "Portugalsko", "PR": "Portoriko", "QA": "Katar", "RE": "Réunion", 
"RO": "Rumunsko", "RU": "Rusko", "RW": "Rwanda", "KN": "Svatý Kryštof a Nevis", "LC": "Svatá Lucie", 
"PM": "Saint-Pierre a Miquelon", "VC": "Svatý Vincenc a Grenadiny", "WS": "Samoa", "SM": "San Marino", "ST": "Svatý Tomáš a Princův ostrov", 
"SA": "Saúdská Arábie", "SN": "Senegal", "RS": "Srbsko", "SC": "Seychely", "SL": "Sierra Leone", 
"SG": "Singapur", "SK": "Slovensko", "SI": "Slovinsko", "SB": "Šalomounovy ostrovy", "SO": "Somálsko", 
"ZA": "Jihoafrická republika", "GS": "Jižní Georgie a Jižní Sandwichovy ostrovy", "ES": "Španělsko", "LK": "Šrí Lanka", "SD": "Súdán", 
"SR": "Surinam", "SJ": "Špicberky a Jan Mayen", "SZ": "Svazijsko", "SE": "Švédsko", "CH": "Švýcarsko", 
"SY": "Sýrie", "TW": "Tchaj-wan", "TJ": "Tádžikistán", "TZ": "Tanzanie", "TH": "Thajsko", 
"TL": "Východní Timor", "TG": "Togo", "TK": "Tokelau", "TO": "Tonga", "TT": "Trinidad a Tobago", 
"TN": "Tunisko", "TR": "Turecko", "TM": "Turkmenistán", "TC": "Turks a Caicos", "TV": "Tuvalu", 
"UG": "Uganda", "UA": "Ukrajina", "AE": "Spojené arabské emiráty", "GB": "Velká Británie", "US": "USA", 
"UY": "Uruguay", "UZ": "Uzbekistán", "VU": "Vanuatu", "VE": "Venezuela", "VN": "Vietnam", 
"WF": "Wallis a Futuna", "EH": "Západní Sahara", "YE": "Jemen", "ZM": "Zambie", "ZW": "Zimbabwe"
}, sk: { 
"AF": "Afganistan", "AX": "Ålandy", "AL": "Albánsko", "DZ": "Alžírsko", "AS": "Americká Samoa", 
"AD": "Andorra", "AO": "Angola", "AI": "Anguilla", "AQ": "Antarktída", "AG": "Antigua a Barbuda", 
"AR": "Argentína", "AM": "Arménsko", "AW": "Aruba", "AU": "Austrália", "AT": "Rakúsko", 
"AZ": "Azerbajdžan", "BS": "Bahamy", "BH": "Bahrajn", "BD": "Bangladéš", "BB": "Barbados", 
"BY": "Bielorusko", "BE": "Belgicko", "BZ": "Belice", "BJ": "Benin", "BM": "Bermudy", 
"BT": "Bhután", "BO": "Bolívia", "BA": "Bosna a Hercegovina", "BW": "Botswana", "BR": "Brazília", 
"VG": "Britské Panenské ostrovy", "BN": "Brunej", "BG": "Bulharsko", "BF": "Burkina Faso", "BI": "Burundi", 
"KH": "Kambodža", "CM": "Kamerún", "CA": "Kanada", "CV": "Kapverdy", "KY": "Kajmanie ostrovy", 
"CF": "Stredoafrická republika", "TD": "Čad", "CL": "Čile", "CN": "Čína", "CX": "Vianočný ostrov", 
"CO": "Kolumbia", "KM": "Komory", "CG": "Kongo", "CD": "Kongo (DRK)", "CK": "Cookove ostrovy", 
"CR": "Kostarika", "CI": "Pobrežie slonoviny", "HR": "Chorvátsko", "CU": "Kuba", "CY": "Cyprus", 
"CZ": "Česko", "DK": "Dánsko", "DJ": "Džibutsko", "DM": "Dominika", "DO": "Dominikánska republika", 
"EC": "Ekvádor", "EG": "Egypt", "SV": "Salvador", "GQ": "Rovníková Guinea", "ER": "Eritrea", 
"EE": "Estónsko", "ET": "Etiópia", "FK": "Falklandy", "FO": "Faerské ostrovy", "FJ": "Fidži", 
"FI": "Fínsko", "FR": "Francúzsko", "GF": "Francúzska Guyana", "PF": "Francúzska Polynézia","GA": "Gabon", 
"GM": "Gambia", "GE": "Gruzie", "DE": "Nemecko", "GH": "Ghana", "GI": "Gibraltár", 
"GR": "Grécko", "GL": "Grónsko", "GD": "Grenada", "GP": "Guadeloupe", "GU": "Guam", 
"GT": "Guatemala", "GG": "Guernsey", "GN": "Guinea", "GW": "Guinea-Bissau", "GY": "Guyana", 
"HT": "Haiti", "VA": "Vatikán", "HN": "Honduras", "HK": "Hongkong", "HU": "Maďarsko", 
"IS": "Island", "IN": "India", "ID": "Indonézia","IR": "Irán", "IQ": "Irak", 
"IE": "Írsko", "IM": "Ostrov Man", "IL": "Izrael", "IT": "Taliansko", "JM": "Jamajka", 
"JP": "Japonsko", "JE": "Jersey", "JO": "Jordánsko", "KZ": "Kazachstan", "KE": "Keňa", 
"KI": "Kiribati", "KP": "Severná Kórea", "KR": "Južná Kórea", "KW": "Kuvajt", "KG": "Kirgizsko", 
"LA": "Laos", "LV": "Lotyšsko", "LB": "Libanon", "LS": "Lesotho", "LR": "Libéria", 
"LY": "Líbya", "LI": "Lichtenštajnsko", "LT": "Litva", "LU": "Luxembursko", "MO": "Macao", 
"MK": "Severná Macedónsko", "MG": "Madagaskar", "MW": "Malawi", "MY": "Malajzia","MV": "Maledivy", 
"ML": "Mali", "MT": "Malta", "MH": "Marshallove ostrovy", "MQ": "Martinik", "MR": "Mauritánia", 
"MU": "Maurícius", "YT": "Mayotte", "MX": "Mexiko", "FM": "Mikronézia", "MD": "Moldavsko", 
"MC": "Monako", "MN": "Mongolsko", "ME": "Čierna Hora", "MS": "Montserrat", "MA": "Maroko", 
"MZ": "Mozambik", "MM": "Mjanmarsko", "NA": "Namíbia", "NR": "Nauru", "NP": "Nepál", 
"NL": "Holandsko", "NC": "Nová Kaledónia", "NZ": "Nový Zéland", "NI": "Nikaragua", "NIE": "Niger", 
"NG": "Nigéria", "NU": "Niue", "NF": "Norfolk", "MP": "Severné Mariany", "NO": "Nórsko", 
"OM": "Omán", "PK": "Pakistan", "PW": "Palau", "PS": "Palestína", "PA": "Panama", 
"PG": "Papua-Nová Guinea", "PY": "Paraguaj", "PE": "Peru", "PH": "Filipíny", "PN": "Pitcairnove ostrovy", 
"PL": "Poľsko", "PT": "Portugalsko", "PR": "Portoriko", "QA": "Katar", "RE": "Réunion", 
"RO": "Rumunsko", "RU": "Rusko", "RW": "Rwanda", "KN": "Svätý Krištof a Nevis", "LC": "Svätá Lucia", 
"PM": "Saint-Pierre a Miquelon", "VC": "Svätý Vincent a Grenadíny", "WS": "Samoa", "SM": "San Maríno", "ST": "Svätý Tomáš a Princov ostrov", 
"SA": "Saudská Arábia", "SN": "Senegal", "RS": "Srbsko", "SC": "Seychely", "SL": "Sierra Leone", 
"SG": "Singapur", "SK": "Slovensko", "SI": "Slovinsko", "SB": "Šalamúnove ostrovy", "SO": "Somálsko", 
"ZA": "Juhoafrická republika", "GS": "Južná Georgia a Južné Sandwichove ostrovy", "ES": "Španielsko", "LK": "Šrí Lanka", "SD": "Sudán", 
"SR": "Surinam", "SJ": "Špicbergy a Jan Mayen", "SZ": "Svazijsko", "SE": "Švédsko", "CH": "Švajčiarsko", 
"SY": "Sýria", "TW": "Tchaj-wan", "TJ": "Tádžikistan", "TZ": "Tanzania", "TH": "Thajsko", 
"TL": "Východný Timor", "TG": "Togo", "TK": "Tokelau", "TO": "Tonga", "TT": "Trinidad a Tobago", 
"TN": "Tunisko", "TR": "Turecko", "TM": "Turkménsko", "TC": "Turks a Caicos", "TV": "Tuvalu", 
"UG": "Uganda", "UA": "Ukrajina", "AE": "Spojené arabské emiráty", "GB": "Veľká Británia", "US": "USA", 
"UY": "Uruguaj", "UZ": "Uzbekistan", "VU": "Vanuatu", "VO": "Venezuela", "VN": "Vietnam", 
"WF": "Wallis a Futuna", "EH": "Západná Sahara", "YE": "Jemen", "ZM": "Zambia", "ZW": "Zimbabwe" 
}, pl: {
"AF": "Afganistan", "AX": "Wyspy Alandzkie", "AL": "Albania", "DZ": "Algieria", "AS": "Samoa Amerykańskie",
"AD": "Andora", "AO": "Angola", "AI": "Anguilla", "AQ": "Antarktyda", "AG": "Antigua i Barbuda",
"AR": "Argentyna", "AM": "Armenia", "AW": "Aruba", "AU": "Australia", "AT": "Austria",
"AZ": "Azerbejdżan", "BS": "Bahamy", "BH": "Bahrajn", "BD": "Bangladesz", "BB": "Barbados",
"BY": "Białoruś", "BE": "Belgia", "BZ": "Belize", "BJ": "Benin", "BM": "Bermudy",
"BT": "Bhutan", "BO": "Boliwia", "BA": "Bośnia i Hercegowina", "BW": "Botswana", "BR": "Brazylia",
"VG": "Brytyjskie Wyspy Dziewicze", "BN": "Brunei", "BG": "Bułgaria", "BF": "Burkina Faso", "BI": "Burundi",
"KH": "Kambodża", "CM": "Kamerun", "CA": "Kanada", "CV": "Republika Zielonego Przylądka", "KY": "Kajmany",
"CF": "Republika Środkowoafrykańska", "TD": "Czad", "CL": "Chile", "CN": "Chiny", "CX": "Wyspa Bożego Narodzenia",
"CO": "Kolumbia", "KM": "Komory", "CG": "Kongo", "CD": "Kongo (DRK)", "CK": "Wyspy Cooka",
"CR": "Kostaryka", "CI": "Wybrzeże Kości Słoniowej", "HR": "Chorwacja", "CU": "Kuba", "CY": "Cypr",
"CZ": "Czechy", "DK": "Dania", "DJ": "Dżibuti", "DM": "Dominika", "DO": "Dominikana",
"EC": "Ekwador", "EG": "Egipt", "SV": "Salwador", "GQ": "Gwinea Równikowa", "ER": "Erytrea",
"EE": "Estonia", "ET": "Etiopia", "FK": "Falklandy", "FO": "Wyspy Owcze", "FJ": "Fidżi",
"FI": "Finlandia", "FR": "Francja", "GF": "Gujana Francuska", "PF": "Polinezja Francuska", "GA": "Gabon",
"GM": "Gambia", "GE": "Gruzja", "DE": "Niemcy", "GH": "Ghana", "GI": "Gibraltar",
"GR": "Grecja", "GL": "Grenlandia", "GD": "Grenada", "GP": "Gwadelupa", "GU": "Guam",
"GT": "Gwatemala", "GG": "Guernsey", "GN": "Gwinea", "GW": "Gwinea Bissau", "GY": "Gujana",
"HT": "Haiti", "VA": "Watykan", "HN": "Honduras", "HK": "Hongkong", "HU": "Węgry",
"IS": "Islandia", "IN": "Indie", "ID": "Indonezja", "IR": "Iran", "IQ": "Irak",
"IE": "Irlandia", "IM": "Wyspa Man", "IL": "Izrael", "IT": "Włochy", "JM": "Jamajka",
"JP": "Japonia", "JE": "Jersey", "JO": "Jordan", "KZ": "Kazachstan", "KE": "Kenia",
"KI": "Kiribati", "KP": "Korea Północna", "KR": "Korea Południowa", "KW": "Kuwejt", "KG": "Kirgistan",
"LA": "Laos", "LV": "Łotwa", "LB": "Liban", "LS": "Lesoto", "LR": "Liberia",
"LY": "Libia", "LI": "Liechtenstein", "LT": "Litwa", "LU": "Luksemburg", "MO": "Makau",
"MK": "Macedonia Północna", "MG": "Madagaskar", "MW": "Malawi", "MY": "Malezja", "MV": "Malediwy",
"ML": "Mali", "MT": "Malta", "MH": "Wyspy Marshalla", "MQ": "Martynika", "MR": "Mauretania",
"MU": "Mauritius", "YT": "Majotta", "MX": "Meksyk", "FM": "Mikronezja", "MD": "Mołdawia",
"MC": "Monako", "MN": "Mongolia", "ME": "Czarnogóra", "MS": "Montserrat", "MA": "Maroko",
"MZ": "Mozambik", "MM": "Birma", "NA": "Namibia", "NR": "Nauru", "NP": "Nepal",
"NL": "Holandia", "NC": "Nowa Kaledonia", "NZ": "Nowa Zelandia", "NI": "Nikaragua", "NE": "Niger",
"NG": "Nigeria", "NU": "Niue", "NF": "Norfolk", "MP": "Mariany Północne", "NO": "Norwegia",
"OM": "Oman", "PK": "Pakistan", "PW": "Palau", "PS": "Palestyna", "PA": "Panama",
"PG": "Papua Nowa Gwinea", "PY": "Paragwaj", "PE": "Peru", "PH": "Filipiny", "PN": "Wyspy Pitcairn",
"PL": "Polska", "PT": "Portugalia", "PR": "Puerto Rico", "QA": "Katar", "RE": "Réunion",
"RO": "Rumunia", "RU": "Rosja", "RW": "Rwanda", "KN": "Saint Kitts i Nevis", "LC": "Saint Lucia",
"PM": "Saint-Pierre i Miquelon", "VC": "Saint Vincent i Grenadyny", "WS": "Samoa", "SM": "San Marino", "ST": "Wyspy Świętego Tomasza i Książęca",
"SA": "Arabia Saudyjska", "SN": "Senegal", "RS": "Serbia", "SC": "Seszele", "SL": "Sierra Leone",
"SG": "Singapur", "SK": "Słowacja", "SI": "Słowenia", "SB": "Wyspy Salomona", "SO": "Somalia",
"ZA": "Republika Południowej Afryki", "GS": "Georgia Południowa i Sandwich Południowy", "ES": "Hiszpania", "LK": "Sri Lanka", "SD": "Sudan",
"SR": "Surinam", "SJ": "Svalbard i Jan Mayen", "SZ": "Suazi", "SE": "Szwecja", "CH": "Szwajcaria",
"SY": "Syria", "TW": "Tajwan", "TJ": "Tadżykistan", "TZ": "Tanzania", "TH": "Tajlandia",
"TL": "Timor Wschodni", "TG": "Togo", "TK": "Tokelau", "TO": "Tonga", "TT": "Trynidad i Tobago",
"TN": "Tunezja", "TR": "Turcja", "TM": "Turkmenistan", "TC": "Turks i Caicos", "TV": "Tuvalu",
"UG": "Uganda", "UA": "Ukraina", "AE": "Zjednoczone Emiraty Arabskie", "GB": "Wielka Brytania", "USA": "USA",
"UY": "Urugwaj", "UZ": "Uzbekistan", "VU": "Vanuatu", "VE": "Wenezuela", "VN": "Wietnam",
"WF": "Wallis i Futuna", "EH": "Sahara Zachodnia", "YE": "Jemen", "ZM": "Zambia", "ZW": "Zimbabwe"
}, uk: {
"AF": "Афганістан", "AX": "Аландські острови", "AL": "Албанія", "DZ": "Алжир", "AS": "Американське Самоа",
"AD": "Андорра", "AO": "Ангола", "AI": "Ангілья", "AQ": "Антарктида", "AG": "Антигуа Барбуда",
"AR": "Аргентина", "AM": "Вірменія", "AW": "a", "AU": "Австралія", "AT": "Австрія",
"AZ": "Азербайджан", "BS": "Багами", "BH": "Бахрейн", "BD": "Бангладеш", "BB": "Барбадос",
"BY": "Білорусь", "BE": "Бельгія", "BZ": "Беліз", "BJ": "Бенін", "BM": "Бермудські острови",
"БТ": "Бутан", "BO": "Болівія", "BA": "Боснія Герцеговина", "BW": "Ботсвана", "BR": "Бразилія",
"VG": "Британські Віргінські острови", "BN": "Бруней", "BG": "Болгарія", "BF": "Буркіна-Фасо", "BI": "Бурунді",
"KH": "Камбоджа", "CM": "Камерун", "CA": "Канада", "CV": "КабВерде", "KY": "Кайманові острови",
"CF": "Центральноафриканська Республіка", "TD": "Чад", "CL": "Чилі", "CN": "Китай", "CX": "Острів Різдва",
"CO": "Колумбія", "KM": "Коморські острови", "CG": "Конго", "CD": "Конго (ДРК)", "CK": "Острови Кука",
"CR": "Коста-Рика", "CI": "Кот д'Івуар", "HR": "Хорватія", "CU": "", "CY": "Кіпр",
"CZ": "Чехія", "DK": "Данія", "DJ": "Джибуті", "DM": "Домініка", "DO": "Домініканська Республіка",
"EC": "Еквадор", "EG": "Єгипет", "SV": "Сальвадор", "GQ": "Екваторіальна Гвінея", "ER": "Еритрея",
"EE": "Естонія", "ET": "Ефіопія", "FK": "Фолклендські острови", "FO": "Фарерські острови", "FJ": "Фіджі",
"FI": "Фінляндія", "FR": "Франція", "GF": "Французька Гвіана", "PF": "Французька Полінезія", "GA": "Габон",
"GM": "Гамбія", "GE": "Грузія", "DE": "Німеччина", "GH": "Гана", "GI": "Гібралтар",
"GR": "Греція", "GL": "Гренландія", "GD": "Гренада", "GP": "Гваделупа", "GU": "Гуам",
"GT": "Гватемала", "GG": "Гернсі", "GN": "Гвінея", "GW": "Гвінея-Бісау", "GY": "Гаяна",
"HT": "Гаїті", "VA": "Ватикан", "HN": "Гондурас", "HK": "Гонконг", "HU": "Угорщина",
"IS": "Ісландія", "IN": "Індія", "ID": "Індонезія", "IR": "Іран", "IQ": "Ірак",
"IE": "Ірландія", "IM": "Острів Мен", "IL": "Ізраїль", "IT": "Італія", "JM": "Ямайка",
"JP": "Японія", "JE": "Джерсі", "JO": "Йорданія", "KZ": "Казахстан", "KE": "Кенія",
"KI": "Кірібаті", "KP": "Північна Корея", "KR": "Південна Корея", "KW": "Кувейт", "KG": "Киргизстан",
"LA": "Лаос", "LV": "Латвія", "LB": "Ліван", "LS": "Лесото", "LR": "Ліберія",
"LY": "Лівія", "LI": "Ліхтенштейн", "LT": "Литва", "LU": "Люксембург", "MO": "Макао",
"MK": "Північна Македонія", "MG": "Мадагаскар", "MW": "Малаві", "MY": "Малайзія", "MV": "Мальдіви",
"ML": "Малі", "MT": "Мальта", "MH": "Маршаллові острови", "MQ": "Мартиніка", "MR": "Мавританія",
"MU": "Маврикій", "YT": "Майотта", "MX": "Мексика", "FM": "Мікронезія", "MD": "Молдова",
"MC": "Монако", "MN": "Монголія", "ME": "Чорногорія", "MS": "Монсеррат", "MA": "Марокко",
"MZ": "Мозамбік", "MM": "М'янма", "NA": "Намібія", "NR": "Науру", "NP": "Непал",
"NL": "Нідерланди", "NC": "Нова Каледонія", "NZ": "Нова Зеландія", "NI": "Нікарагуа", "NE": "Нігер",
"NG": "Нігерія", "NU": "Ніуе", "NF": "Норфолк", "MP": "Північні Маріанські острови", "NO": "Норвегія",
"OM": "Оман", "PK": "Пакистан", "PW": "Палау", "PS": "Палестина", "PA": "Панама",
"PG": "Папуа-Нова Гвінея", "PY": "Парагвай", "PE": "Перу", "PH": "Філіппіни", "PN": "Острови Піткерн",
"PL": "Польща", "PT": "Португалія", "PR": "Пуерто-Рико", "QA": "Катар", "RE": "Реюньйон",
"RO": "Румунія", "RU": "Росія", "RW": "Руанда", "KN": "Сент-Кітс і Невіс", "LC": "Сент-Люсія",
"PM": "Сен-П'єр і Мікелон", "VC": "Сент-Вінсент і Гренадини", "WS": "Самоа", "SM": "Сан-Марино", "ST": "Сан-Томе і Принсіпі",
"SA": "Саудівська Аравія", "SN": "Сенегал", "RS": "Сербія", "SC": "Сейшельські острови", "SL": "Сьєрра-Леоне",
"SG": "Сінгапур", "SK": "Словаччина", "SI": "Словенія", "SB": "Соломонові острови", "SO": "Сомалі",
"ZA": "Південна Африка", "GS": "Південна Джорджія та Південні Сандвічеві острови", "ES": "Іспанія", "LK": "Шрі-Ланка", "SD": "Судан",
"SR": "Суринам", "SJ": "Свальбард і Ян-Маєн", "SZ": "Свазіленд", "SE": "Швеція", "CH": "Швейцарія",
"SY": "Сирія", "TW": "Тайвань", "TJ": "Таджикистан", "TZ": "Танзанія", "TH": "Таїланд",
"TL": "Східний Тимор", "TG": "Того", "TK": "Токелау", "TO": "Тонга", "TT": "Тринідад і Тобаго",
"TN": "Туніс", "TR": "Туреччина", "TM": "Туркменістан", "TC": "Теркс і Кайкос", "TV": "Тувалу",
"UG": "Уганда", "UA": "Україна", "AE": "Об'єднані Арабські Емірати", "GB": "Велика Британія", "US": "США",
"UY": "Уругвай", "UZ": "Узбекистан", "VU": "Вануату", "VE": "Венесуела", "VN": "В'єтнам",
"WF": "Уолліс і Футуна", "EH": "Західна Сахара", "YE": "Ємен", "ZM": "Замбія", "ZW": "Зімбабве"
}, ru: {

}, de: {

}, fr: {

}, it: {

}, nl: {

}, fi: {

}, no: {

}, sv: {

}, es: {

}, pt: {

}, tr: {

}, el: {

}, zh: {

}, ja: {

}, ko: {

}, hi: {

}, ar: {

}, he: {

}};
//gb;en;cs;sk;pl;uk;ru;de;fr;it;nl;fi;no;sv;es;pt;tr;el;zh;ja;ko;hi;ar;he
export const uiStrings = {
  en: {
   // Continents
   "geo.continent.africa": "Africa",
   "geo.continent.asia": "Asia",
   "geo.continent.europe": "Europe",
   "geo.continent.north-america": "North America",
   "geo.continent.south-america": "South America",
   "geo.continent.oceania": "Oceania",
   "geo.continent.antarctica": "Antarctica",
   // Stats and Details
   "geo.stats.population": "Population",
   "geo.stats.capital": "Capital",
   "geo.stats.currency": "Currency",
   "geo.stats.languages": "Languages",
   "geo.stats.continent": "Continent",
   "geo.stats.native": "Native Name",
   // Navigation and Titles
   "geo.detail.basicInfo": "Basic Information",
   "geo.detail.local": "Local",
   "geo.detail.back": "Back to atlas",
   "atlas.title": "World Atlas",
   "atlas.description": "Detailed statistics and information about world countries.",
   // Geo Section - Navigation
   "geo.nav.languages": "Languages",
   "geo.nav.currencies": "Currencies",
   "geo.nav.atlas": "World Atlas",
   "geo.nav.notes": "Notes & Articles",
   // Tables and Overviews
   "geo.table.code": "Code",
   "geo.table.countries": "Countries",
   "geo.table.count": "Country count",

   "atlas.table.title": "Countries Table Overview",
   "atlas.table.search": "Search country, capital, code...",
   "geo.stats.code": "ISO Code",
   "geo.stats.name": "Name",
   "geo.stats.phone": "Calling Code",
}, cs: {
   // Kontinenty
   "geo.continent.africa": "Afrika",
   "geo.continent.asia": "Asie",
   "geo.continent.europe": "Evropa",
   "geo.continent.north-america": "Severní Amerika",
   "geo.continent.south-america": "Jižní Amerika",
   "geo.continent.oceania": "Oceánie",
   "geo.continent.antarctica": "Antarktida",
   // Statistiky a detaily
   "geo.stats.population": "Populace",
   "geo.stats.capital": "Hlavní město",
   "geo.stats.currency": "Měna",
   "geo.stats.languages": "Jazyky",
   "geo.stats.continent": "Kontinent",
   "geo.stats.native": "Nativní název",
   // Navigace a titulky
   "geo.detail.back": "Zpět na atlas",
   "geo.detail.basicInfo": "Přehled",
   "geo.detail.local": "Místní",
   "atlas.title": "Atlas zemí",
   "atlas.description": "Podrobné statistiky a informace o zemích světa.",
   // Sekce Geo - Rozcestníky
   "geo.nav.languages": "Jazyky",
   "geo.nav.currencies": "Měny",
   "geo.nav.atlas": "Atlas světa",
   "geo.nav.notes": "Poznámky a články",
   // Tabulky a přehledy
   "geo.table.code": "Kód",
   "geo.table.countries": "Země",
   "geo.table.count": "Počet zemí",

   "atlas.table.title": "Tabulkový přehled zemí",
   "atlas.table.search": "Hledat zemi, hlavní město, kód...",
   "geo.stats.code": "ISO Kód",
   "geo.stats.name": "Název",
   "geo.stats.phone": "Předvolba",
}, sk: {
   // Kontinenty
   "geo.continent.africa": "Afrika",
   "geo.continent.asia": "Ázia",
   "geo.continent.europe": "Európa",
   "geo.continent.north-america": "Severná Amerika",
   "geo.continent.south-america": "Južná Amerika",
   "geo.continent.oceania": "Oceánia",
   "geo.continent.antarctica": "Antarktída",
   // Štatistiky a podrobnosti
   "geo.stats.population": "Počet obyvateľov",
   "geo.stats.capital": "Hlavné mesto",
   "geo.stats.currency": "Mena",
   "geo.stats.languages": "Jazyky",
   "geo.stats.continent": "Kontinent",
   "geo.stats.native": "Národný názov",
   // Navigácia a názvy
   "geo.detail.back": "Späť na atlas",
   "atlas.title": "Svetový atlas",
   "atlas.description": "Podrobné štatistiky a informácie o krajinách sveta.",
   // Geografická sekcia - Navigácia
   "geo.nav.languages": "Jazyky",
   "geo.nav.currencies": "Meny",
   "geo.nav.atlas": "Svetový atlas",
   "geo.nav.notes": "Poznámky a články",
   // Tabuľky a prehľady
   "geo.table.code": "Kód",
   "geo.table.countries": "Krajiny",
   "geo.table.count": "Počet krajín",
}, pl: {
// Kontynenty
"geo.continent.africa": "Afryka",
"geo.continent.asia": "Azja",
"geo.continent.europe": "Europa",
"geo.continent.north-america": "Ameryka Północna",
"geo.continent.south-america": "Ameryka Południowa",
"geo.continent.oceania": "Oceania",
"geo.continent.antarctica": "Antarktyda",
// Statystyki i szczegóły
"geo.stats.population": "Populacja",
"geo.stats.capital": "Stolica",
"geo.stats.currency": "Waluta",
"geo.stats.languages": "Języki",
"geo.stats.continent": "Kontynent",
"geo.stats.native": "Język ojczysty Nazwa",
// Nawigacja i tytuły
"geo.detail.back": "Powrót do atlasu",
"atlas.title": "Atlas świata",
"atlas.description": "Szczegółowe statystyki i informacje o krajach świata.",
// Sekcja Geo - Nawigacja
"geo.nav.languages": "Języki",
"geo.nav.currencies": "Waluty",
"geo.nav.atlas": "Atlas świata",
"geo.nav.notes": "Notatki i artykuły",
// Tabele i przeglądy
"geo.table.code": "Kod",
"geo.table.countries": "Kraje",
"geo.table.count": "Liczba krajów",
}, uk: {
// Континенти
"geo.continent.africa": "Африка",
"geo.continent.asia": "Азія",
"geo.continent.europe": "Європа",
"geo.continent.north-america": "Північна Америка",
"geo.continent.south-america": "Південна Америка",
"geo.continent.oceania": "Океанія",
"geo.continent.antarctica": "Антарктида",
// Статистика та деталі
"geo.stats.population": "Населення",
"geo.stats.capital": "Столиця",
"geo.stats.currency": "Валюта",
"geo.stats.languages": "Мови",
"geo.stats.continent": "Континент",
"geo.stats.native": "Місна назва",
// Навігація та заголовки
"geo.detail.back": "Назад до атласу",
"atlas.title": "Світовий атлас",
"atlas.description": "Детальна статистика та інформація про країни світу.",
// Розділ Гео - Навігація
"geo.nav.languages": "Мови",
"geo.nav.currencies": "Валюти",
"geo.nav.atlas": "Світовий атлас",
"geo.nav.notes": "Нотатки та статті",
// Таблиці та огляди
"geo.table.code": "Код",
"geo.table.countries": "Країни",
"geo.table.count": "Кількість країн",
}, ru: {
// Континенты
"geo.continent.africa": "Африка",
"geo.continent.asia": "Азия",
"geo.continent.europe": "Европа",
"geo.continent.north-america": "Северная Америка",
"geo.continent.south-america": "Южная Америка",
"geo.continent.oceania": "Океания",
"geo.continent.antarctica": "Антарктида",
// Статистика и подробности
"geo.stats.population": "Население",
"geo.stats.capital": "Столица",
"geo.stats.currency": "Валюта",
"geo.stats.languages": "Языки",
"geo.stats.continent": "Континент",
"geo.stats.native": "Название на родном языке",
// Навигация и заголовки
"geo.detail.back": "Назад к атласу",
"atlas.title": "Мировой атлас",
"atlas.description": "Подробная статистика и информация о странах мира.",
// Раздел «География» - Навигация
"geo.nav.languages": "Языки",
"geo.nav.currencies": "Валюты",
"geo.nav.atlas": "Мировой атлас",
"geo.nav.notes": "Примечания и статьи",
// Таблицы и обзоры
"geo.table.code": "Код",
"geo.table.countries": "Страны",
"geo.table.count": "Количество стран",
}, de: {
// Kontinente
"geo.continent.africa": "Afrika",
"geo.continent.asia": "Asien",
"geo.continent.europe": "Europa",
"geo.continent.north-america": "Nordamerika",
"geo.continent.south-america": "Südamerika",
"geo.continent.oceania": "Ozeanien",
"geo.continent.antarctica": "Antarktis",
// Statistiken und Details
"geo.stats.population": "Bevölkerung",
"geo.stats.capital": "Hauptstadt",
"geo.stats.currency": "Währung",
"geo.stats.languages": "Sprachen",
"geo.stats.continent": "Kontinent",
"geo.stats.native": "Heimatname",
// Navigation und Titel
"geo.detail.back": "Zurück zum Atlas",
"atlas.title": "Weltatlas",
"atlas.description": "Detaillierte Statistiken und Informationen zu den Ländern der Welt.",
// Geo-Bereich – Navigation
"geo.nav.languages": "Sprachen",
"geo.nav.currencies": "Währungen",
"geo.nav.atlas": "Weltatlas",
"geo.nav.notes": "Anmerkungen & Artikel",
// Tabellen und Übersichten
"geo.table.code": "Code",
"geo.table.countries": "Länder",
"geo.table.count": "Anzahl der Länder",
}, fr: {
// Continents
"geo.continent.africa": "Afrique",
"geo.continent.asia": "Asie",
"geo.continent.europe": "Europe",
"geo.continent.north-america": "Amérique du Nord",
"geo.continent.south-america": "Amérique du Sud",
"geo.continent.oceania": "Océanie",
"geo.continent.antarctica": "Antarctique",
// Statistiques et détails
"geo.stats.population": "Population",
"geo.stats.capital": "Capitale",
"geo.stats.currency": "Monnaie",
"geo.stats.languages": "Langues",
"geo.stats.continent": "Continent",
"geo.stats.native": "Nom autochtone",
// Navigation et titres
"geo.detail.back": "Retour à l'atlas",
"atlas.title": "Atlas mondial",
"atlas.description": "Statistiques et informations détaillées sur les pays du monde.",
// Section Géo - Navigation
"geo.nav.languages": "Langues",
"geo.nav.currencies": "Devises",
"geo.nav.atlas": "Atlas mondial",
"geo.nav.notes": "Notes et articles",
// Tableaux et aperçus
"geo.table.code": "Code",
"geo.table.countries": "Pays",
"geo.table.count": "Nombre de pays",
}, it: {
// Continenti
"geo.continent.africa": "Africa",
"geo.continent.asia": "Asia",
"geo.continent.europe": "Europa",
"geo.continent.north-america": "Nord America",
"geo.continent.south-america": "Sud America",
"geo.continent.oceania": "Oceania",
"geo.continent.antarctica": "Antartide",
// Statistiche e dettagli
"geo.stats.population": "Popolazione",
"geo.stats.capital": "Capitale",
"geo.stats.currency": "Valuta",
"geo.stats.languages": "Lingue",
"geo.stats.continent": "Continente",
"geo.stats.native": "Nome nativo",
// Navigazione e titoli
"geo.detail.back": "Torna all'atlante",
"atlas.title": "Atlante mondiale",
"atlas.description": "Statistiche e informazioni dettagliate sul mondo Paesi.",
// Sezione Geo - Navigazione
"geo.nav.languages": "Lingue",
"geo.nav.currencies": "Valute",
"geo.nav.atlas": "Atlante mondiale",
"geo.nav.notes": "Note e articoli",
// Tabelle e panoramiche
"geo.table.code": "Codice",
"geo.table.countries": "Paesi",
"geo.table.count": "Conteggio paesi",
}, nl: {
}, fi: {
}, no: {
}, sv: {
}, es: {
// Continentes
"geo.continent.africa": "África",
"geo.continent.asia": "Asia",
"geo.continent.europe": "Europa",
"geo.continent.north-america": "Norteamérica",
"geo.continent.south-america": "Sudamérica",
"geo.continent.oceania": "Oceanía",
"geo.continent.antarctica": "Antártida",
// Estadísticas y detalles
"geo.stats.population": "Población",
"geo.stats.capital": "Capital",
"geo.stats.currency": "Moneda",
"geo.stats.languages": "Idiomas",
"geo.stats.continent": "Continente",
"geo.stats.native": "Nombre nativo",
// Navegación y títulos
"geo.detail.back": "Volver al atlas",
"atlas.title": "Atlas mundial",
"atlas.description": "Estadísticas detalladas e información sobre los países del mundo.",
// Sección Geo - Navegación
"geo.nav.languages": "Idiomas",
"geo.nav.currencies": "Monedas",
"geo.nav.atlas": "Atlas mundial",
"geo.nav.notes": "Notas y artículos",
// Tablas y resúmenes
"geo.table.code": "Código",
"geo.table.countries": "Países",
"geo.table.count": "Recuento de países",
}, pt: {
// Continentes
"geo.continent.africa": "África",
"geo.continent.asia": "Ásia",
"geo.continent.europe": "Europa",
"geo.continent.north-america": "América do Norte",
"geo.continent.south-america": "América do Sul",
"geo.continent.oceania": "Oceania",
"geo.continent.antarctica": "Antártida",
// Estatísticas e Detalhes
"geo.stats.population": "População",
"geo.stats.capital": "Capital",
"geo.stats.currency": "Moeda",
"geo.stats.languages": "Línguas",
"geo.stats.continent": "Continente",
"geo.stats.native": "Nome Nativo",
// Navegação e Títulos
"geo.detail.back": "Voltar ao atlas",
"atlas.title": "Atlas Mundial",
"atlas.description": "Estatísticas e informações detalhadas sobre os países do mundo.",
// Secção Geográfica - Navegação
"geo.nav.languages": "Línguas",
"geo.nav.currencies": "Moedas",
"geo.nav.atlas": "Atlas Mundial",
"geo.nav.notes": "Notas e Artigos",
// Tabelas e Visão Geral
"geo.table.code": "Código",
"geo.table.countries": "Países",
"geo.table.count": "Contagem de países",
}, tr: {
// Kıtalar
"geo.continent.africa": "Afrika",
"geo.continent.asia": "Asya",
"geo.continent.europe": "Avrupa",
"geo.continent.north-america": "Kuzey Amerika",
"geo.continent.south-america": "Güney Amerika",
"geo.continent.oceania": "Okyanusya",
"geo.continent.antarctica": "Antarktika",
// İstatistikler ve Ayrıntılar
"geo.stats.population": "Nüfus",
"geo.stats.capital": "Başkent",
"geo.stats.currency": "Para Birimi",
"geo.stats.languages": "Diller",
"geo.stats.continent": "Kıta",
"geo.stats.native": "Yerel Ad",
// Gezinme ve Başlıklar
"geo.detail.back": "Atlasa Geri Dön",
"atlas.title": "Dünya Atlası",
"atlas.description": "Dünya ülkeleri hakkında detaylı istatistikler ve bilgiler.",
// Coğrafi Bölüm - Gezinme
"geo.nav.languages": "Diller",
"geo.nav.currencies": "Para Birimleri",
"geo.nav.atlas": "Dünya Atlası",
"geo.nav.notes": "Notlar ve Makaleler",
// Tablolar ve Genel Bakışlar
"geo.table.code": "Kod",
"geo.table.countries": "Ülkeler",
"geo.table.count": "Ülke sayısı",
}, el: {
}, zh: {
}, ja: {
}, ko: {
}, hi: {
}, ar: {
}, he: {

}
} as const;

export function useTranslations(lang: string) {
  const translations = uiStrings[lang as keyof typeof uiStrings] || uiStrings.en;
  const countryNames = countryTranslations[lang as keyof typeof countryTranslations] || countryTranslations.en;
  // Pokud klíč neexistuje v UI strings ani v Country strings, vrátí klíč samotný
  return (key: string) => (translations as any)[key] || (countryNames as any)[key] || key;
}

export const countries = {
   "AD": {
      "code": "AD",
      "name": "Andorra",
      "native": "Andorra",
      "continent": "Europe",
      "capital": "Andorra la Vella",
      "population": 81000,
      "phone": [376],
      "currency": ["EUR"],
      "language": ["ca"]
   },
   "AE": {
      "code": "AE",
      "name": "United Arab Emirates",
      "native": "دولة الإمارات العربية المتحدة",
      "continent": "Asia",
      "capital": "Abu Dhabi",
      "population": 9600000,
      "phone": [971],
      "currency": ["AED"],
      "language": ["ar"]
   },
   "AF": {
      "code": "AF",
      "name": "Afghanistan",
      "native": "افغانستان",
      "continent": "Asia",
      "capital": "Kabul",
      "population": 44400000,
      "phone": [93],
      "currency": ["AFN"],
      "language": ["ps","fa","uz","tk"]
   },
   "AG": {
      "code": "AG",
      "name": "Antigua and Barbuda",
      "native": "Antigua and Barbuda",
      "continent": "North America",
      "capital": "Saint John's",
      "population": 95000,
      "phone": [1268],
      "currency": ["XCD"],
      "language": ["aig","en-GB"]
   },
   "AI": {
      "code": "AI",
      "name": "Anguilla",
      "native": "Anguilla",
      "continent": "North America",
      "capital": "The Valley",
      "population": 16000,
      "phone": [1264],
      "currency": ["XCD"],
      "language": ["en-GB"]
   },
   "AL": {
      "code": "AL",
      "name": "Albania",
      "native": "Shqipëria",
      "continent": "Europe",
      "capital": "Tirana",
      "population": 2800000,
      "phone": [355],
      "currency": ["ALL"],
      "language": ["sq"]
   },
   "AM": {
      "code": "AM",
      "name": "Armenia",
      "native": "Հայաստան",
      "continent": "Asia",
      "capital": "Yerevan",
      "population": 2770000,
      "phone": [374],
      "currency": ["AMD"],
      "language": ["hy"]
   },
   "AO": {
      "code": "AO",
      "name": "Angola",
      "native": "Angola",
      "continent": "Africa",
      "capital": "Luanda",
      "population": 38100000,
      "phone": [244],
      "currency": ["AOA"],
      "language": ["pt"]
   },
   "AQ": {
      "code": "AQ",
      "name": "Antarctica",
      "native": "Antarctica",
      "continent": "Antarctica",
      "population": 1000,
      "phone": [672]
   },
   "AR": {
      "code": "AR",
      "name": "Argentina",
      "native": "Argentina",
      "continent": "South America",
      "capital": "Buenos Aires",
      "population": 46100000,
      "phone": [54],
      "currency": ["ARS"],
      "language": ["es","gn"]
   },
   "AS": {
      "code": "AS",
      "name": "American Samoa",
      "native": "American Samoa",
      "continent": "Oceania",
      "capital": "Pago Pago",
      "population": 43000,
      "phone": [1684],
      "currency": ["USD"],
      "language": ["en-US","sm"]
   },
   "AT": {
      "code": "AT",
      "name": "Austria",
      "native": "Österreich",
      "continent": "Europe",
      "capital": "Vienna",
      "population": 9020000,
      "phone": [43],
      "currency": ["EUR"],
      "language": ["de"]
   },
   "AU": {
      "code": "AU",
      "name": "Australia",
      "native": "Australia",
      "continent": "Oceania",
      "capital": "Canberra",
      "population": 27000000,
      "phone": [61],
      "currency": ["AUD"],
      "language": ["en-AU"]
   },
   "AW": {
      "code": "AW",
      "name": "Aruba",
      "native": "Aruba",
      "continent": "North America",
      "capital": "Oranjestad",
      "population": 106000,
      "phone": [297],
      "currency": ["AWG"],
      "language": ["nl","pap"]
   },
   "AX": {
      "code": "AX",
      "name": "Aland",
      "native": "Åland",
      "continent": "Europe",
      "capital": "Mariehamn",
      "population": 30600,
      "phone": [358],
      "currency": ["EUR"],
      "language": ["sv"]
   },
   "AZ": {
      "code": "AZ",
      "name": "Azerbaijan",
      "native": "Azərbaycan",
      "continent": "Asia",
      "capital": "Baku",
      "population": 10500000,
      "phone": [994],
      "currency": ["AZN"],
      "language": ["az"]
   },
   "BA": {
      "code": "BA",
      "name": "Bosnia and Herzegovina",
      "native": "Bosna i Hercegovina",
      "continent": "Europe",
      "capital": "Sarajevo",
      "population": 3150000,
      "phone": [387],
      "currency": ["BAM"],
      "language": ["bs","hr","sr"]
   },
   "BB": {
      "code": "BB",
      "name": "Barbados",
      "native": "Barbados",
      "continent": "North America",
      "capital": "Bridgetown",
      "population": 282000,
      "phone": [1246],
      "currency": ["BBD"],
      "language": ["en-GB"]
   },
   "BD": {
      "code": "BD",
      "name": "Bangladesh",
      "native": "Bangladesh",
      "continent": "Asia",
      "capital": "Dhaka",
      "population": 176800000,
      "phone": [880],
      "currency": ["BDT"],
      "language": ["bn","ctg","syl"]
   },
   "BE": {
      "code": "BE",
      "name": "Belgium",
      "native": "België",
      "continent": "Europe",
      "capital": "Brussels",
      "population": 11750000,
      "phone": [32],
      "currency": ["EUR"],
      "language": ["nl","fr","de","wa"]
   },
   "BF": {
      "code": "BF",
      "name": "Burkina Faso",
      "native": "Burkina Faso",
      "continent": "Africa",
      "capital": "Ouagadougou",
      "population": 24300000,
      "phone": [226],
      "currency": ["XOF"],
      "language": ["fr","ff"]
   },
   "BG": {
      "code": "BG",
      "name": "Bulgaria",
      "native": "България",
      "continent": "Europe",
      "capital": "Sofia",
      "population": 6580000,
      "phone": [359],
      "currency": ["BGN"],
      "language": ["bg"]
   },
   "BH": {
      "code": "BH",
      "name": "Bahrain",
      "native": "البحرين",
      "continent": "Asia",
      "capital": "Manama",
      "population": 1510000,
      "phone": [973],
      "currency": ["BHD"],
      "language": ["ar"]
   },
   "BI": {
      "code": "BI",
      "name": "Burundi",
      "native": "Burundi",
      "continent": "Africa",
      "capital": "Gitega",
      "population": 14000000,
      "phone": [257],
      "currency": ["BIF"],
      "language": ["fr","rn","sw"]
   },
   "BJ": {
      "code": "BJ",
      "name": "Benin",
      "native": "Bénin",
      "continent": "Africa",
      "capital": "Porto-Novo",
      "population": 14500000,
      "phone": [229],
      "currency": ["XOF"],
      "language": ["fr","fon","yor"]
   },
   "BL": {
      "code": "BL",
      "name": "Saint Barthelemy",
      "native": "Saint-Barthélemy",
      "continent": "North America",
      "capital": "Gustavia",
      "population": 11000,
      "phone": [590],
      "currency": ["EUR"],
      "language": ["fr"]
   },
   "BM": {
      "code": "BM",
      "name": "Bermuda",
      "native": "Bermuda",
      "continent": "North America",
      "capital": "Hamilton",
      "population": 63500,
      "phone": [1441],
      "currency": ["BMD"],
      "language": ["en-GB"]
   },
   "BN": {
      "code": "BN",
      "name": "Brunei",
      "native": "Negara Brunei Darussalam",
      "continent": "Asia",
      "capital": "Bandar Seri Begawan",
      "population": 460000,
      "phone": [673],
      "currency": ["BND"],
      "language": ["ms","kxd"]
   },
   "BO": {
      "code": "BO",
      "name": "Bolivia",
      "native": "Bolivia",
      "continent": "South America",
      "capital": "Sucre",
      "population": 12600000,
      "phone": [591],
      "currency": ["BOB","BOV"],
      "language": ["es","ay","qu","grn"]
   },
   "BQ": {
      "code": "BQ",
      "name": "Bonaire",
      "native": "Bonaire",
      "continent": "North America",
      "capital": "Kralendijk",
      "population": 30000,
      "phone": [5997],
      "currency": ["USD"],
      "language": ["nl","pap"]
   },
   "BR": {
      "code": "BR",
      "name": "Brazil",
      "native": "Brasil",
      "continent": "South America",
      "capital": "Brasília",
      "population": 213200000,
      "phone": [55],
      "currency": ["BRL"],
      "language": ["pt","gun","kgp"]
   },
   "BS": {
      "code": "BS",
      "name": "Bahamas",
      "native": "Bahamas",
      "continent": "North America",
      "capital": "Nassau",
      "population": 415000,
      "phone": [1242],
      "currency": ["BSD"],
      "language": ["en-GB","crp"]
   },
   "BT": {
      "code": "BT",
      "name": "Bhutan",
      "native": "ʼbrug-yul",
      "continent": "Asia",
      "capital": "Thimphu",
      "population": 795000,
      "phone": [975],
      "currency": ["BTN","INR"],
      "language": ["dz","tsj","nep"]
   },
   "BV": {
      "code": "BV",
      "name": "Bouvet Island",
      "native": "Bouvetøya",
      "continent": "Antarctica",
      "population": 0,
      "phone": [47],
      "currency": ["NOK"],
      "language": ["no","nb","nn"]
   },
   "BW": {
      "code": "BW",
      "name": "Botswana",
      "native": "Botswana",
      "continent": "Africa",
      "capital": "Gaborone",
      "population": 2750000,
      "phone": [267],
      "currency": ["BWP"],
      "language": ["en-GB","tn","kna"]
   },
   "BY": {
      "code": "BY",
      "name": "Belarus",
      "native": "Беларусь",
      "continent": "Europe",
      "capital": "Minsk",
      "population": 9050000,
      "phone": [375],
      "currency": ["BYN"],
      "language": ["be","ru"]
   },
   "BZ": {
      "code": "BZ",
      "name": "Belize",
      "native": "Belize",
      "continent": "North America",
      "capital": "Belmopan",
      "population": 420000,
      "phone": [501],
      "currency": ["BZD"],
      "language": ["en-GB","es","cpe","kek"]
   },
   "CA": {
      "code": "CA",
      "name": "Canada",
      "native": "Canada",
      "continent": "North America",
      "capital": "Ottawa",
      "population": 41200000,
      "phone": [1],
      "currency": ["CAD"],
      "language": ["en-CA","fr","iu","cr","oj"]
   },
   "CC": {
      "code": "CC",
      "name": "Cocos (Keeling) Islands",
      "native": "Cocos (Keeling) Islands",
      "continent": "Asia",
      "capital": "West Island",
      "population": 600,
      "phone": [61],
      "currency": ["AUD"],
      "language": ["en-AU","ms"]
   },
   "CD": {
      "code": "CD",
      "name": "Democratic Republic of the Congo",
      "native": "République démocratique du Congo",
      "continent": "Africa",
      "capital": "Kinshasa",
      "population": 114800000,
      "phone": [243],
      "currency": ["CDF"],
      "language": ["fr","ln","kg","sw","lu"]
   },
   "CF": {
      "code": "CF",
      "name": "Central African Republic",
      "native": "Ködörösêse tî Bêafrîka",
      "continent": "Africa",
      "capital": "Bangui",
      "population": 5950000,
      "phone": [236],
      "currency": ["XAF"],
      "language": ["fr","sg"]
   },
   "CG": {
      "code": "CG",
      "name": "Republic of the Congo",
      "native": "République du Congo",
      "continent": "Africa",
      "capital": "Brazzaville",
      "population": 6350000,
      "phone": [242],
      "currency": ["XAF"],
      "language": ["fr","ln","mkw"]
   },
   "CH": {
      "code": "CH",
      "name": "Switzerland",
      "native": "Schweiz",
      "continent": "Europe",
      "capital": "Bern",
      "population": 8980000,
      "phone": [41],
      "currency": ["CHF","CHE","CHW"],
      "language": ["de","fr","it","rm","gsw"]
   },
   "CI": {
      "code": "CI",
      "name": "Ivory Coast",
      "native": "Côte d'Ivoire",
      "continent": "Africa",
      "capital": "Yamoussoukro",
      "population": 33800000,
      "phone": [225],
      "currency": ["XOF"],
      "language": ["fr","dyu","bci"]
   },
   "CK": {
      "code": "CK",
      "name": "Cook Islands",
      "native": "Cook Islands",
      "continent": "Oceania",
      "capital": "Avarua",
      "population": 17000,
      "phone": [682],
      "currency": ["NZD"],
      "language": ["en-NZ","rar"]
   },
   "CL": {
      "code": "CL",
      "name": "Chile",
      "native": "Chile",
      "continent": "South America",
      "capital": "Santiago",
      "population": 19700000,
      "phone": [56],
      "currency": ["CLF","CLP"],
      "language": ["es"]
   },
   "CM": {
      "code": "CM",
      "name": "Cameroon",
      "native": "Cameroon",
      "continent": "Africa",
      "capital": "Yaoundé",
      "population": 30200000,
      "phone": [237],
      "currency": ["XAF"],
      "language": ["en-GB","fr","ewo","dua","jax"]
   },
   "CN": {
      "code": "CN",
      "name": "China",
      "native": "中国",
      "continent": "Asia",
      "capital": "Beijing",
      "population": 1409000000,
      "phone": [86],
      "currency": ["CNY"],
      "language": ["zh","bo","ug","za","ii","yue","wuu","nan","hak","cjy","gan","hsn"]
   },
   "CO": {
      "code": "CO",
      "name": "Colombia",
      "native": "Colombia",
      "continent": "South America",
      "capital": "Bogotá",
      "population": 52800000,
      "phone": [57],
      "currency": ["COP"],
      "language": ["es","guc","pbb"]
   },
   "CR": {
      "code": "CR",
      "name": "Costa Rica",
      "native": "Costa Rica",
      "continent": "North America",
      "capital": "San José",
      "population": 5250000,
      "phone": [506],
      "currency": ["CRC"],
      "language": ["es"]
   },
   "CU": {
      "code": "CU",
      "name": "Cuba",
      "native": "Cuba",
      "continent": "North America",
      "capital": "Havana",
      "population": 10950000,
      "phone": [53],
      "currency": ["CUP"],
      "language": ["es"]
   },
   "CV": {
      "code": "CV",
      "name": "Cape Verde",
      "native": "Cabo Verde",
      "continent": "Africa",
      "capital": "Praia",
      "population": 610000,
      "phone": [238],
      "currency": ["CVE"],
      "language": ["pt","kea"]
   },
   "CW": {
      "code": "CW",
      "name": "Curacao",
      "native": "Curaçao",
      "continent": "North America",
      "capital": "Willemstad",
      "population": 192000,
      "phone": [5999],
      "currency": ["ANG"],
      "language": ["nl","pap","en-GB"]
   },
   "CX": {
      "code": "CX",
      "name": "Christmas Island",
      "native": "Christmas Island",
      "continent": "Asia",
      "capital": "Flying Fish Cove",
      "population": 2000,
      "phone": [61],
      "currency": ["AUD"],
      "language": ["en-AU","zh","ms"]
   },
   "CY": {
      "code": "CY",
      "name": "Cyprus",
      "native": "Κύπρος",
      "continent": "Europe",
      "capital": "Nicosia",
      "population": 1270000,
      "phone": [357],
      "currency": ["EUR"],
      "language": ["el","tr","hy"]
   },
   "CZ": {
      "code": "CZ",
      "name": "Czechia",
      "native": "Česko",
      "continent": "Europe",
      "capital": "Prague",
      "population": 10870000,
      "phone": [420],
      "currency": ["CZK"],
      "language": ["cs","sk","szl","cse","rom","rmy"]
   },
   "DE": {
      "code": "DE",
      "name": "Germany",
      "native": "Deutschland",
      "continent": "Europe",
      "capital": "Berlin",
      "population": 83800000,
      "phone": [49],
      "currency": ["EUR"],
      "language": ["de","dsb"]
   },
   "DJ": {
      "code": "DJ",
      "name": "Djibouti",
      "native": "Djibouti",
      "continent": "Africa",
      "capital": "Djibouti",
      "population": 1150000,
      "phone": [253],
      "currency": ["DJF"],
      "language": ["fr","ar"]
   },
   "DK": {
      "code": "DK",
      "name": "Denmark",
      "native": "Danmark",
      "continent": "Europe",
      "capital": "Copenhagen",
      "population": 6050000,
      "phone": [45],
      "currency": ["DKK"],
      "language": ["da"]
   },
   "DM": {
      "code": "DM",
      "name": "Dominica",
      "native": "Dominica",
      "continent": "North America",
      "capital": "Roseau",
      "population": 73000,
      "phone": [1767],
      "currency": ["XCD"],
      "language": ["en-GB","gcf"]
   },
   "DO": {
      "code": "DO",
      "name": "Dominican Republic",
      "native": "República Dominicana",
      "continent": "North America",
      "capital": "Santo Domingo",
      "population": 11500000,
      "phone": [1809,
         1829,
         1849],
      "currency": ["DOP"],
      "language": ["es"]
   },
   "DZ": {
      "code": "DZ",
      "name": "Algeria",
      "native": "الجزائر",
      "continent": "Africa",
      "capital": "Algiers",
      "population": 47500000,
      "phone": [213],
      "currency": ["DZD"],
      "language": ["ar","zgh"]
   },
   "EC": {
      "code": "EC",
      "name": "Ecuador",
      "native": "Ecuador",
      "continent": "South America",
      "capital": "Quito",
      "population": 18500000,
      "phone": [593],
      "currency": ["USD"],
      "language": ["es","qu","jiv"]
   },
   "EE": {
      "code": "EE",
      "name": "Estonia",
      "native": "Eesti",
      "continent": "Europe",
      "capital": "Tallinn",
      "population": 1360000,
      "phone": [372],
      "currency": ["EUR"],
      "language": ["et"]
   },
   "EG": {
      "code": "EG",
      "name": "Egypt",
      "native": "مصر",
      "continent": "Africa",
      "capital": "Cairo",
      "population": 119300000,
      "phone": [20],
      "currency": ["EGP"],
      "language": ["arz"]
   },
   "EH": {
      "code": "EH",
      "name": "Western Sahara",
      "native": "الصحراء الغربية",
      "continent": "Africa",
      "capital": "El Aaiún",
      "population": 610000,
      "phone": [212],
      "currency": ["MAD","DZD","MRU"],
      "language": ["ar","es"]
   },
   "ER": {
      "code": "ER",
      "name": "Eritrea",
      "native": "ኤርትራ",
      "continent": "Africa",
      "capital": "Asmara",
      "population": 3850000,
      "phone": [291],
      "currency": ["ERN"],
      "language": ["ti","ar","en-GB","aa"]
   },
   "ES": {
      "code": "ES",
      "name": "Spain",
      "native": "España",
      "continent": "Europe",
      "capital": "Madrid",
      "population": 47600000,
      "phone": [34],
      "currency": ["EUR"],
      "language": ["es","eu","ca","gl","oc","an","ast"]
   },
   "ET": {
      "code": "ET",
      "name": "Ethiopia",
      "native": "ኢትዮጵያ",
      "continent": "Africa",
      "capital": "Addis Ababa",
      "population": 137300000,
      "phone": [251],
      "currency": ["ETB"],
      "language": ["am","om","ti","so"]
   },
   "FI": {
      "code": "FI",
      "name": "Finland",
      "native": "Suomi",
      "continent": "Europe",
      "capital": "Helsinki",
      "population": 5620000,
      "phone": [358],
      "currency": ["EUR"],
      "language": ["fi","sv","se"]
   },
   "FJ": {
      "code": "FJ",
      "name": "Fiji",
      "native": "Fiji",
      "continent": "Oceania",
      "capital": "Suva",
      "population": 940000,
      "phone": [679],
      "currency": ["FJD"],
      "language": ["en-GB","fj","hi","ur"]
   },
   "FK": {
      "code": "FK",
      "name": "Falkland Islands",
      "native": "Falkland Islands",
      "continent": "South America",
      "capital": "Stanley",
      "population": 3700,
      "phone": [500],
      "currency": ["FKP"],
      "language": ["en-GB"]
   },
   "FM": {
      "code": "FM",
      "name": "Micronesia",
      "native": "Micronesia",
      "continent": "Oceania",
      "capital": "Palikir",
      "population": 116000,
      "phone": [691],
      "currency": ["USD"],
      "language": ["en-US","chk","pon","yap"]
   },
   "FO": {
      "code": "FO",
      "name": "Faroe Islands",
      "native": "Føroyar",
      "continent": "Europe",
      "capital": "Tórshavn",
      "population": 54000,
      "phone": [298],
      "currency": ["DKK"],
      "language": ["fo","da"]
   },
   "FR": {
      "code": "FR",
      "name": "France",
      "native": "France",
      "continent": "Europe",
      "capital": "Paris",
      "population": 65000000,
      "phone": [33],
      "currency": ["EUR"],
      "language": ["fr","br","oc","co"]
   },
   "GA": {
      "code": "GA",
      "name": "Gabon",
      "native": "Gabon",
      "continent": "Africa",
      "capital": "Libreville",
      "population": 2550000,
      "phone": [241],
      "currency": ["XAF"],
      "language": ["fr","fng"]
   },
   "GB": {
      "code": "GB",
      "name": "United Kingdom",
      "native": "United Kingdom",
      "continent": "Europe",
      "capital": "London",
      "population": 68300000,
      "phone": [44],
      "currency": ["GBP"],
      "language": ["en-GB","cy","gd","kw"]
   },
   "GD": {
      "code": "GD",
      "name": "Grenada",
      "native": "Grenada",
      "continent": "North America",
      "capital": "St. George's",
      "population": 127000,
      "phone": [1473],
      "currency": ["XCD"],
      "language": ["en-GB","gcl"]
   },
   "GE": {
      "code": "GE",
      "name": "Georgia",
      "native": "საქართველო",
      "continent": "Asia",
      "capital": "Tbilisi",
      "population": 3720000,
      "phone": [995],
      "currency": ["GEL"],
      "language": ["ka","ab"]
   },
   "GF": {
      "code": "GF",
      "name": "French Guiana",
      "native": "Guyane française",
      "continent": "South America",
      "capital": "Cayenne",
      "population": 320000,
      "phone": [594],
      "currency": ["EUR"],
      "language": ["fr","gcr"]
   },
   "GG": {
      "code": "GG",
      "name": "Guernsey",
      "native": "Guernsey",
      "continent": "Europe",
      "capital": "St. Peter Port",
      "population": 64000,
      "phone": [44],
      "currency": ["GBP"],
      "language": ["en-GB","fr","nrf"]
   },
   "GH": {
      "code": "GH",
      "name": "Ghana",
      "native": "Ghana",
      "continent": "Africa",
      "capital": "Accra",
      "population": 35700000,
      "phone": [233],
      "currency": ["GHS"],
      "language": ["en-GB","ak","ee","tw"]
   },
   "GI": {
      "code": "GI",
      "name": "Gibraltar",
      "native": "Gibraltar",
      "continent": "Europe",
      "capital": "Gibraltar",
      "population": 33000,
      "phone": [350],
      "currency": ["GIP"],
      "language": ["en-GB","es"]
   },
   "GL": {
      "code": "GL",
      "name": "Greenland",
      "native": "Kalaallit Nunaat",
      "continent": "North America",
      "capital": "Nuuk",
      "population": 56700,
      "phone": [299],
      "currency": ["DKK"],
      "language": ["kl"]
   },
   "GM": {
      "code": "GM",
      "name": "Gambia",
      "native": "Gambia",
      "continent": "Africa",
      "capital": "Banjul",
      "population": 2890000,
      "phone": [220],
      "currency": ["GMD"],
      "language": ["en-GB","wo","mnk"]
   },
   "GN": {
      "code": "GN",
      "name": "Guinea",
      "native": "Guinée",
      "continent": "Africa",
      "capital": "Conakry",
      "population": 14700000,
      "phone": [224],
      "currency": ["GNF"],
      "language": ["fr","fuf","man"]
   },
   "GP": {
      "code": "GP",
      "name": "Guadeloupe",
      "native": "Guadeloupe",
      "continent": "North America",
      "capital": "Basse-Terre",
      "population": 396000,
      "phone": [590],
      "currency": ["EUR"],
      "language": ["fr","gcf"]
   },
   "GQ": {
      "code": "GQ",
      "name": "Equatorial Guinea",
      "native": "Guinea Ecuatorial",
      "continent": "Africa",
      "capital": "Malabo",
      "population": 1750000,
      "phone": [240],
      "currency": ["XAF"],
      "language": ["es","fr","pt"]
   },
   "GR": {
      "code": "GR",
      "name": "Greece",
      "native": "Ελλάδα",
      "continent": "Europe",
      "capital": "Athens",
      "population": 10300000,
      "phone": [30],
      "currency": ["EUR"],
      "language": ["el"]
   },
   "GS": {
      "code": "GS",
      "name": "South Georgia and the South Sandwich Islands",
      "native": "South Georgia",
      "continent": "Antarctica",
      "capital": "King Edward Point",
      "population": 30,
      "phone": [500],
      "currency": ["GBP"],
      "language": ["en-GB"]
   },
   "GT": {
      "code": "GT",
      "name": "Guatemala",
      "native": "Guatemala",
      "continent": "North America",
      "capital": "Guatemala City",
      "population": 18900000,
      "phone": [502],
      "currency": ["GTQ"],
      "language": ["es","quc","kek"]
   },
   "GU": {
      "code": "GU",
      "name": "Guam",
      "native": "Guam",
      "continent": "Oceania",
      "capital": "Hagåtña",
      "population": 175000,
      "phone": [1671],
      "currency": ["USD"],
      "language": ["en-US","ch","es"]
   },
   "GW": {
      "code": "GW",
      "name": "Guinea-Bissau",
      "native": "Guiné-Bissau",
      "continent": "Africa",
      "capital": "Bissau",
      "population": 2200000,
      "phone": [245],
      "currency": ["XOF"],
      "language": ["pt","pov"]
   },
   "GY": {
      "code": "GY",
      "name": "Guyana",
      "native": "Guyana",
      "continent": "South America",
      "capital": "Georgetown",
      "population": 820000,
      "phone": [592],
      "currency": ["GYD"],
      "language": ["en-GB","gyn"]
   },
   "HK": {
      "code": "HK",
      "name": "Hong Kong",
      "native": "香港",
      "continent": "Asia",
      "capital": "City of Victoria",
      "population": 7500000,
      "phone": [852],
      "currency": ["HKD"],
      "language": ["en-GB","zh-HK","yue"]
   },
   "HM": {
      "code": "HM",
      "name": "Heard Island and McDonald Islands",
      "native": "Heard Island and McDonald Islands",
      "continent": "Antarctica",
      "population": 0,
      "phone": [61],
      "currency": ["AUD"],
      "language": ["en-AU"]
   },
   "HN": {
      "code": "HN",
      "name": "Honduras",
      "native": "Honduras",
      "continent": "North America",
      "capital": "Tegucigalpa",
      "population": 10900000,
      "phone": [504],
      "currency": ["HNL"],
      "language": ["es"]
   },
   "HR": {
      "code": "HR",
      "name": "Croatia",
      "native": "Hrvatska",
      "continent": "Europe",
      "capital": "Zagreb",
      "population": 3850000,
      "phone": [385],
      "currency": ["EUR"],
      "language": ["hr"]
   },
   "HT": {
      "code": "HT",
      "name": "Haiti",
      "native": "Haïti",
      "continent": "North America",
      "capital": "Port-au-Prince",
      "population": 12700000,
      "phone": [509],
      "currency": ["HTG","USD"],
      "language": ["fr","ht"]
   },
   "HU": {
      "code": "HU",
      "name": "Hungary",
      "native": "Magyarország",
      "continent": "Europe",
      "capital": "Budapest",
      "population": 9550000,
      "phone": [36],
      "currency": ["HUF"],
      "language": ["hu"]
   },
   "ID": {
      "code": "ID",
      "name": "Indonesia",
      "native": "Indonesia",
      "continent": "Asia",
      "capital": "Jakarta",
      "population": 286900000,
      "phone": [62],
      "currency": ["IDR"],
      "language": ["id","jv","su"]
   },
   "IE": {
      "code": "IE",
      "name": "Ireland",
      "native": "Éire",
      "continent": "Europe",
      "capital": "Dublin",
      "population": 5350000,
      "phone": [353],
      "currency": ["EUR"],
      "language": ["en-IE","ga"]
   },
   "IL": {
      "code": "IL",
      "name": "Israel",
      "native": "יִשְׂרָאֵל",
      "continent": "Asia",
      "capital": "Jerusalem",
      "population": 10300000,
      "phone": [972],
      "currency": ["ILS"],
      "language": ["he","ar","yi"]
   },
   "IM": {
      "code": "IM",
      "name": "Isle of Man",
      "native": "Isle of Man",
      "continent": "Europe",
      "capital": "Douglas",
      "population": 85000,
      "phone": [44],
      "currency": ["GBP"],
      "language": ["en-GB","gv"]
   },
   "IN": {
      "code": "IN",
      "name": "India",
      "native": "भारत",
      "continent": "Asia",
      "capital": "New Delhi",
      "population": 1471000000,
      "phone": [91],
      "currency": ["INR"],
      "language": ["hi","en-IN","bn","ta","te","mr","pa","gu","ml","kn","ks","or","as","bgc","bho","mai","mny","hne"]
   },
   "IO": {
      "code": "IO",
      "name": "British Indian Ocean Territory",
      "native": "British Indian Ocean Territory",
      "continent": "Asia",
      "capital": "Diego Garcia",
      "population": 3000,
      "phone": [246],
      "currency": ["USD"],
      "language": ["en-GB"]
   },
   "IQ": {
      "code": "IQ",
      "name": "Iraq",
      "native": "العراق",
      "continent": "Asia",
      "capital": "Baghdad",
      "population": 46600000,
      "phone": [964],
      "currency": ["IQD"],
      "language": ["ar","ku"]
   },
   "IR": {
      "code": "IR",
      "name": "Iran",
      "native": "ایران",
      "continent": "Asia",
      "capital": "Tehran",
      "population": 92800000,
      "phone": [98],
      "currency": ["IRR"],
      "language": ["fa","mzn"]
   },
   "IS": {
      "code": "IS",
      "name": "Iceland",
      "native": "Ísland",
      "continent": "Europe",
      "capital": "Reykjavik",
      "population": 385000,
      "phone": [354],
      "currency": ["ISK"],
      "language": ["is"]
   },
   "IT": {
      "code": "IT",
      "name": "Italy",
      "native": "Italia",
      "continent": "Europe",
      "capital": "Rome",
      "population": 58700000,
      "phone": [39],
      "currency": ["EUR"],
      "language": ["it","sc"]
   },
   "JE": {
      "code": "JE",
      "name": "Jersey",
      "native": "Jersey",
      "continent": "Europe",
      "capital": "Saint Helier",
      "population": 104000,
      "phone": [44],
      "currency": ["GBP"],
      "language": ["en-GB","fr","jer"]
   },
   "JM": {
      "code": "JM",
      "name": "Jamaica",
      "native": "Jamaica",
      "continent": "North America",
      "capital": "Kingston",
      "population": 2830000,
      "phone": [1876],
      "currency": ["JMD"],
      "language": ["en-GB","jam"]
   },
   "JO": {
      "code": "JO",
      "name": "Jordan",
      "native": "الأردن",
      "continent": "Asia",
      "capital": "Amman",
      "population": 11500000,
      "phone": [962],
      "currency": ["JOD"],
      "language": ["ar"]
   },
   "JP": {
      "code": "JP",
      "name": "Japan",
      "native": "日本",
      "continent": "Asia",
      "capital": "Tokyo",
      "population": 122700000,
      "phone": [81],
      "currency": ["JPY"],
      "language": ["ja"]
   },
   "KE": {
      "code": "KE",
      "name": "Kenya",
      "native": "Kenya",
      "continent": "Africa",
      "capital": "Nairobi",
      "population": 57200000,
      "phone": [254],
      "currency": ["KES"],
      "language": ["en-GB","sw","ki"]
   },
   "KG": {
      "code": "KG",
      "name": "Kyrgyzstan",
      "native": "Кыргызстан",
      "continent": "Asia",
      "capital": "Bishkek",
      "population": 7150000,
      "phone": [996],
      "currency": ["KGS"],
      "language": ["ky","ru"]
   },
   "KH": {
      "code": "KH",
      "name": "Cambodia",
      "native": "កម្ពុជា",
      "continent": "Asia",
      "capital": "Phnom Penh",
      "population": 17600000,
      "phone": [855],
      "currency": ["KHR"],
      "language": ["km"]
   },
   "KI": {
      "code": "KI",
      "name": "Kiribati",
      "native": "Kiribati",
      "continent": "Oceania",
      "capital": "South Tarawa",
      "population": 137000,
      "phone": [686],
      "currency": ["AUD"],
      "language": ["en-GB","gil"]
   },
   "KM": {
      "code": "KM",
      "name": "Comoros",
      "native": "Komori",
      "continent": "Africa",
      "capital": "Moroni",
      "population": 880000,
      "phone": [269],
      "currency": ["KMF"],
      "language": ["ar","fr","zdj"]
   },
   "KN": {
      "code": "KN",
      "name": "Saint Kitts and Nevis",
      "native": "Saint Kitts and Nevis",
      "continent": "North America",
      "capital": "Basseterre",
      "population": 48000,
      "phone": [1869],
      "currency": ["XCD"],
      "language": ["en-GB"]
   },
   "KP": {
      "code": "KP",
      "name": "North Korea",
      "native": "북한",
      "continent": "Asia",
      "capital": "Pyongyang",
      "population": 26500000,
      "phone": [850],
      "currency": ["KPW"],
      "language": ["ko"]
   },
   "KR": {
      "code": "KR",
      "name": "South Korea",
      "native": "대한민국",
      "continent": "Asia",
      "capital": "Seoul",
      "population": 51600000,
      "phone": [82],
      "currency": ["KRW"],
      "language": ["ko"]
   },
   "KW": {
      "code": "KW",
      "name": "Kuwait",
      "native": "الكويت",
      "continent": "Asia",
      "capital": "Kuwait City",
      "population": 4400000,
      "phone": [965],
      "currency": ["KWD"],
      "language": ["ar"]
   },
   "KY": {
      "code": "KY",
      "name": "Cayman Islands",
      "native": "Cayman Islands",
      "continent": "North America",
      "capital": "George Town",
      "population": 70000,
      "phone": [1345],
      "currency": ["KYD"],
      "language": ["en-GB"]
   },
   "KZ": {
      "code": "KZ",
      "name": "Kazakhstan",
      "native": "Қазақстан",
      "continent": "Asia",
      "capital": "Astana",
      "population": 20600000,
      "phone": [7],
      "currency": ["KZT"],
      "language": ["kk","ru"]
   },
   "LA": {
      "code": "LA",
      "name": "Laos",
      "native": "ສປປລາວ",
      "continent": "Asia",
      "capital": "Vientiane",
      "population": 7800000,
      "phone": [856],
      "currency": ["LAK"],
      "language": ["lo"]
   },
   "LB": {
      "code": "LB",
      "name": "Lebanon",
      "native": "لبنان",
      "continent": "Asia",
      "capital": "Beirut",
      "population": 5250000,
      "phone": [961],
      "currency": ["LBP"],
      "language": ["ar","fr","en-GB"]
   },
   "LC": {
      "code": "LC",
      "name": "Saint Lucia",
      "native": "Saint Lucia",
      "continent": "North America",
      "capital": "Castries",
      "population": 181000,
      "phone": [1758],
      "currency": ["XCD"],
      "language": ["en-GB","acf"]
   },
   "LI": {
      "code": "LI",
      "name": "Liechtenstein",
      "native": "Liechtenstein",
      "continent": "Europe",
      "capital": "Vaduz",
      "population": 40000,
      "phone": [423],
      "currency": ["CHF"],
      "language": ["de"]
   },
   "LK": {
      "code": "LK",
      "name": "Sri Lanka",
      "native": "śrī laṃkāva",
      "continent": "Asia",
      "capital": "Colombo",
      "population": 21900000,
      "phone": [94],
      "currency": ["LKR"],
      "language": ["si","ta"]
   },
   "LR": {
      "code": "LR",
      "name": "Liberia",
      "native": "Liberia",
      "continent": "Africa",
      "capital": "Monrovia",
      "population": 5800000,
      "phone": [231],
      "currency": ["LRD"],
      "language": ["en-US","lir"]
   },
   "LS": {
      "code": "LS",
      "name": "Lesotho",
      "native": "Lesotho",
      "continent": "Africa",
      "capital": "Maseru",
      "population": 2380000,
      "phone": [266],
      "currency": ["LSL","ZAR"],
      "language": ["en-GB","st","zu"]
   },
   "LT": {
      "code": "LT",
      "name": "Lithuania",
      "native": "Lietuva",
      "continent": "Europe",
      "capital": "Vilnius",
      "population": 2700000,
      "phone": [370],
      "currency": ["EUR"],
      "language": ["lt"]
   },
   "LU": {
      "code": "LU",
      "name": "Luxembourg",
      "native": "Luxembourg",
      "continent": "Europe",
      "capital": "Luxembourg",
      "population": 670000,
      "phone": [352],
      "currency": ["EUR"],
      "language": ["fr","de","lb"]
   },
   "LV": {
      "code": "LV",
      "name": "Latvia",
      "native": "Latvija",
      "continent": "Europe",
      "capital": "Riga",
      "population": 1800000,
      "phone": [371],
      "currency": ["EUR"],
      "language": ["lv"]
   },
   "LY": {
      "code": "LY",
      "name": "Libya",
      "native": "ليبيا",
      "continent": "Africa",
      "capital": "Tripoli",
      "population": 7100000,
      "phone": [218],
      "currency": ["LYD"],
      "language": ["ar"]
   },
   "MA": {
      "code": "MA",
      "name": "Morocco",
      "native": "المغرب",
      "continent": "Africa",
      "capital": "Rabat",
      "population": 38100000,
      "phone": [212],
      "currency": ["MAD"],
      "language": ["ar","zgh"]
   },
   "MC": {
      "code": "MC",
      "name": "Monaco",
      "native": "Monaco",
      "continent": "Europe",
      "capital": "Monaco",
      "population": 37000,
      "phone": [377],
      "currency": ["EUR"],
      "language": ["fr","mcf"]
   },
   "MD": {
      "code": "MD",
      "name": "Moldova",
      "native": "Moldova",
      "continent": "Europe",
      "capital": "Chișinău",
      "population": 2500000,
      "phone": [373],
      "currency": ["MDL"],
      "language": ["ro","ru","gag"]
   },
   "ME": {
      "code": "ME",
      "name": "Montenegro",
      "native": "Црна Гора",
      "continent": "Europe",
      "capital": "Podgorica",
      "population": 610000,
      "phone": [382],
      "currency": ["EUR"],
      "language": ["sr","bs","sq","hr"]
   },
   "MF": {
      "code": "MF",
      "name": "Saint Martin",
      "native": "Saint-Martin",
      "continent": "North America",
      "capital": "Marigot",
      "population": 32000,
      "phone": [590],
      "currency": ["EUR"],
      "language": ["en-GB","fr","nl"]
   },
   "MG": {
      "code": "MG",
      "name": "Madagascar",
      "native": "Madagasikara",
      "continent": "Africa",
      "capital": "Antananarivo",
      "population": 32300000,
      "phone": [261],
      "currency": ["MGA"],
      "language": ["fr","mg"]
   },
   "MH": {
      "code": "MH",
      "name": "Marshall Islands",
      "native": "M̧ajeļ",
      "continent": "Oceania",
      "capital": "Majuro",
      "population": 42000,
      "phone": [692],
      "currency": ["USD"],
      "language": ["en-US","mh"]
   },
   "MK": {
      "code": "MK",
      "name": "North Macedonia",
      "native": "Северна Македонија",
      "continent": "Europe",
      "capital": "Skopje",
      "population": 2080000,
      "phone": [389],
      "currency": ["MKD"],
      "language": ["mk","sq"]
   },
   "ML": {
      "code": "ML",
      "name": "Mali",
      "native": "Mali",
      "continent": "Africa",
      "capital": "Bamako",
      "population": 24500000,
      "phone": [223],
      "currency": ["XOF"],
      "language": ["fr","bm"]
   },
   "MM": {
      "code": "MM",
      "name": "Myanmar (Burma)",
      "native": "မြန်မာ",
      "continent": "Asia",
      "capital": "Naypyidaw",
      "population": 55400000,
      "phone": [95],
      "currency": ["MMK"],
      "language": ["my","kar","shn"]
   },
   "MN": {
      "code": "MN",
      "name": "Mongolia",
      "native": "Монгол улс",
      "continent": "Asia",
      "capital": "Ulan Bator",
      "population": 3550000,
      "phone": [976],
      "currency": ["MNT"],
      "language": ["mn"]
   },
   "MO": {
      "code": "MO",
      "name": "Macao",
      "native": "澳門",
      "continent": "Asia",
      "population": 715000,
      "phone": [853],
      "currency": ["MOP"],
      "language": ["zh","pt"]
   },
   "MP": {
      "code": "MP",
      "name": "Northern Mariana Islands",
      "native": "Northern Mariana Islands",
      "continent": "Oceania",
      "capital": "Saipan",
      "population": 50000,
      "phone": [1670],
      "currency": ["USD"],
      "language": ["en-US","ch","cal"]
   },
   "MQ": {
      "code": "MQ",
      "name": "Martinique",
      "native": "Martinique",
      "continent": "North America",
      "capital": "Fort-de-France",
      "population": 365000,
      "phone": [596],
      "currency": ["EUR"],
      "language": ["fr","gcf"]
   },
   "MR": {
      "code": "MR",
      "name": "Mauritania",
      "native": "موريتانيا",
      "continent": "Africa",
      "capital": "Nouakchott",
      "population": 5200000,
      "phone": [222],
      "currency": ["MRU"],
      "language": ["wo","mey"]
   },
   "MS": {
      "code": "MS",
      "name": "Montserrat",
      "native": "Montserrat",
      "continent": "North America",
      "capital": "Plymouth",
      "population": 4400,
      "phone": [1664],
      "currency": ["XCD"],
      "language": ["en-GB"]
   },
   "MT": {
      "code": "MT",
      "name": "Malta",
      "native": "Malta",
      "continent": "Europe",
      "capital": "Valletta",
      "population": 540000,
      "phone": [356],
      "currency": ["EUR"],
      "language": ["mt","en-GB"]
   },
   "MU": {
      "code": "MU",
      "name": "Mauritius",
      "native": "Maurice",
      "continent": "Africa",
      "capital": "Port Louis",
      "population": 1300000,
      "phone": [230],
      "currency": ["MUR"],
      "language": ["en-GB","fr","mfe"]
   },
   "MV": {
      "code": "MV",
      "name": "Maldives",
      "native": "Maldives",
      "continent": "Asia",
      "capital": "Malé",
      "population": 525000,
      "phone": [960],
      "currency": ["MVR"],
      "language": ["dv"]
   },
   "MW": {
      "code": "MW",
      "name": "Malawi",
      "native": "Malawi",
      "continent": "Africa",
      "capital": "Lilongwe",
      "population": 22500000,
      "phone": [265],
      "currency": ["MWK"],
      "language": ["en-GB","ny"]
   },
   "MX": {
      "code": "MX",
      "name": "Mexico",
      "native": "México",
      "continent": "North America",
      "capital": "Mexico City",
      "population": 132500000,
      "phone": [52],
      "currency": ["MXN"],
      "language": ["es","nah","yua"]
   },
   "MY": {
      "code": "MY",
      "name": "Malaysia",
      "native": "Malaysia",
      "continent": "Asia",
      "capital": "Kuala Lumpur",
      "population": 35800000,
      "phone": [60],
      "currency": ["MYR"],
      "language": ["ms","zh","ta"]
   },
   "MZ": {
      "code": "MZ",
      "name": "Mozambique",
      "native": "Moçambique",
      "continent": "Africa",
      "capital": "Maputo",
      "population": 36300000,
      "phone": [258],
      "currency": ["MZN"],
      "language": ["pt","vmw","tso"]
   },
   "NA": {
      "code": "NA",
      "name": "Namibia",
      "native": "Namibia",
      "continent": "Africa",
      "capital": "Windhoek",
      "population": 3150000,
      "phone": [264],
      "currency": ["NAD","ZAR"],
      "language": ["en-GB","af","hz","kj","ng"]
   },
   "NC": {
      "code": "NC",
      "name": "New Caledonia",
      "native": "Nouvelle-Calédonie",
      "continent": "Oceania",
      "capital": "Nouméa",
      "population": 295000,
      "phone": [687],
      "currency": ["XPF"],
      "language": ["fr","dhv"]
   },
   "NE": {
      "code": "NE",
      "name": "Niger",
      "native": "Niger",
      "continent": "Africa",
      "capital": "Niamey",
      "population": 28400000,
      "phone": [227],
      "currency": ["XOF"],
      "language": ["fr","ha","kr","dje"]
   },
   "NF": {
      "code": "NF",
      "name": "Norfolk Island",
      "native": "Norfolk Island",
      "continent": "Oceania",
      "capital": "Kingston",
      "population": 1750,
      "phone": [672],
      "currency": ["AUD"],
      "language": ["en-AU","pih"]
   },
   "NG": {
      "code": "NG",
      "name": "Nigeria",
      "native": "Nigeria",
      "continent": "Africa",
      "capital": "Abuja",
      "population": 240200000,
      "phone": [234],
      "currency": ["NGN"],
      "language": ["en-NG","ha","yo","ig","kr"]
   },
   "NI": {
      "code": "NI",
      "name": "Nicaragua",
      "native": "Nicaragua",
      "continent": "North America",
      "capital": "Managua",
      "population": 7200000,
      "phone": [505],
      "currency": ["NIO"],
      "language": ["es"]
   },
   "NL": {
      "code": "NL",
      "name": "Netherlands",
      "native": "Nederland",
      "continent": "Europe",
      "capital": "Amsterdam",
      "population": 18100000,
      "phone": [31],
      "currency": ["EUR"],
      "language": ["nl","fy","li"]
   },
   "NO": {
      "code": "NO",
      "name": "Norway",
      "native": "Norge",
      "continent": "Europe",
      "capital": "Oslo",
      "population": 5600000,
      "phone": [47],
      "currency": ["NOK"],
      "language": ["no","nb","nn","se"]
   },
   "NP": {
      "code": "NP",
      "name": "Nepal",
      "native": "नेपाल",
      "continent": "Asia",
      "capital": "Kathmandu",
      "population": 31600000,
      "phone": [977],
      "currency": ["NPR"],
      "language": ["ne","mai"]
   },
   "NR": {
      "code": "NR",
      "name": "Nauru",
      "native": "Nauru",
      "continent": "Oceania",
      "capital": "Yaren",
      "population": 13000,
      "phone": [674],
      "currency": ["AUD"],
      "language": ["en-GB","na"]
   },
   "NU": {
      "code": "NU",
      "name": "Niue",
      "native": "Niuē",
      "continent": "Oceania",
      "capital": "Alofi",
      "population": 1900,
      "phone": [683],
      "currency": ["NZD"],
      "language": ["en-NZ","niu"]
   },
   "NZ": {
      "code": "NZ",
      "name": "New Zealand",
      "native": "New Zealand",
      "continent": "Oceania",
      "capital": "Wellington",
      "population": 5350000,
      "phone": [64],
      "currency": ["NZD"],
      "language": ["en-NZ","mi"]
   },
   "OM": {
      "code": "OM",
      "name": "Oman",
      "native": "عمان",
      "continent": "Asia",
      "capital": "Muscat",
      "population": 5400000,
      "phone": [968],
      "currency": ["OMR"],
      "language": ["ar"]
   },
   "PA": {
      "code": "PA",
      "name": "Panama",
      "native": "Panamá",
      "continent": "North America",
      "capital": "Panama City",
      "population": 4600000,
      "phone": [507],
      "currency": ["PAB","USD"],
      "language": ["es"]
   },
   "PE": {
      "code": "PE",
      "name": "Peru",
      "native": "Perú",
      "continent": "South America",
      "capital": "Lima",
      "population": 35100000,
      "phone": [51],
      "currency": ["PEN"],
      "language": ["es","qu","ay"]
   },
   "PF": {
      "code": "PF",
      "name": "French Polynesia",
      "native": "Polynésie française",
      "continent": "Oceania",
      "capital": "Papeetē",
      "population": 311000,
      "phone": [689],
      "currency": ["XPF"],
      "language": ["fr","ty"]
   },
   "PG": {
      "code": "PG",
      "name": "Papua New Guinea",
      "native": "Papua Niugini",
      "continent": "Oceania",
      "capital": "Port Moresby",
      "population": 11000000,
      "phone": [675],
      "currency": ["PGK"],
      "language": ["en-GB","tpi","ho"]
   },
   "PH": {
      "code": "PH",
      "name": "Philippines",
      "native": "Pilipinas",
      "continent": "Asia",
      "capital": "Manila",
      "population": 117300000,
      "phone": [63],
      "currency": ["PHP"],
      "language": ["en-US","tl"]
   },
   "PK": {
      "code": "PK",
      "name": "Pakistan",
      "native": "Pakistan",
      "continent": "Asia",
      "capital": "Islamabad",
      "population": 257400000,
      "phone": [92],
      "currency": ["PKR"],
      "language": ["en-GB","ur","pa","sd","pan","pnb","bal"]
   },
   "PL": {
      "code": "PL",
      "name": "Poland",
      "native": "Polska",
      "continent": "Europe",
      "capital": "Warsaw",
      "population": 40100000,
      "phone": [48],
      "currency": ["PLN"],
      "language": ["pl","szl"]
   },
   "PM": {
      "code": "PM",
      "name": "Saint Pierre and Miquelon",
      "native": "Saint-Pierre-et-Miquelon",
      "continent": "North America",
      "capital": "Saint-Pierre",
      "population": 5800,
      "phone": [508],
      "currency": ["EUR"],
      "language": ["fr"]
   },
   "PN": {
      "code": "PN",
      "name": "Pitcairn Islands",
      "native": "Pitcairn Islands",
      "continent": "Oceania",
      "capital": "Adamstown",
      "population": 50,
      "phone": [64],
      "currency": ["NZD"],
      "language": ["en-GB","pih"]
   },
   "PR": {
      "code": "PR",
      "name": "Puerto Rico",
      "native": "Puerto Rico",
      "continent": "North America",
      "capital": "San Juan",
      "population": 3200000,
      "phone": [1787,
         1939],
      "currency": ["USD"],
      "language": ["es","en-US"]
   },
   "PS": {
      "code": "PS",
      "name": "Palestine",
      "native": "فلسطين",
      "continent": "Asia",
      "capital": "Ramallah",
      "population": 5600000,
      "phone": [970],
      "currency": ["ILS"],
      "language": ["ar"]
   },
   "PT": {
      "code": "PT",
      "name": "Portugal",
      "native": "Portugal",
      "continent": "Europe",
      "capital": "Lisbon",
      "population": 10200000,
      "phone": [351],
      "currency": ["EUR"],
      "language": ["pt","mwl"]
   },
   "PW": {
      "code": "PW",
      "name": "Palau",
      "native": "Palau",
      "continent": "Oceania",
      "capital": "Ngerulmud",
      "population": 18000,
      "phone": [680],
      "currency": ["USD"],
      "language": ["en-US","pau"]
   },
   "PY": {
      "code": "PY",
      "name": "Paraguay",
      "native": "Paraguay",
      "continent": "South America",
      "capital": "Asunción",
      "population": 6950000,
      "phone": [595],
      "currency": ["PYG"],
      "language": ["es","gn"]
   },
   "QA": {
      "code": "QA",
      "name": "Qatar",
      "native": "قطر",
      "continent": "Asia",
      "capital": "Doha",
      "population": 2750000,
      "phone": [974],
      "currency": ["QAR"],
      "language": ["ar"]
   },
   "RE": {
      "code": "RE",
      "name": "Reunion",
      "native": "La Réunion",
      "continent": "Africa",
      "capital": "Saint-Denis",
      "population": 990000,
      "phone": [262],
      "currency": ["EUR"],
      "language": ["fr","rcf"]
   },
   "RO": {
      "code": "RO",
      "name": "Romania",
      "native": "România",
      "continent": "Europe",
      "capital": "Bucharest",
      "population": 18900000,
      "phone": [40],
      "currency": ["RON"],
      "language": ["ro"]
   },
   "RS": {
      "code": "RS",
      "name": "Serbia",
      "native": "Србија",
      "continent": "Europe",
      "capital": "Belgrade",
      "population": 7100000,
      "phone": [381],
      "currency": ["RSD"],
      "language": ["sr"]
   },
   "RU": {
      "code": "RU",
      "name": "Russia",
      "native": "Россия",
      "continent": "Asia",
      "capital": "Moscow",
      "population": 143500000,
      "phone": [7],
      "currency": ["RUB"],
      "language": ["ru","tt","ce","ba","cv","os","av","kv"]
   },
   "RW": {
      "code": "RW",
      "name": "Rwanda",
      "native": "Rwanda",
      "continent": "Africa",
      "capital": "Kigali",
      "population": 14800000,
      "phone": [250],
      "currency": ["RWF"],
      "language": ["rw","en-GB","fr","sw"]
   },
   "SA": {
      "code": "SA",
      "name": "Saudi Arabia",
      "native": "المملكة العربية السعودية",
      "continent": "Asia",
      "capital": "Riyadh",
      "population": 38400000,
      "phone": [966],
      "currency": ["SAR"],
      "language": ["ar"]
   },
   "SB": {
      "code": "SB",
      "name": "Solomon Islands",
      "native": "Solomon Islands",
      "continent": "Oceania",
      "capital": "Honiara",
      "population": 770000,
      "phone": [677],
      "currency": ["SBD"],
      "language": ["en-GB","pis"]
   },
   "SC": {
      "code": "SC",
      "name": "Seychelles",
      "native": "Seychelles",
      "continent": "Africa",
      "capital": "Victoria",
      "population": 108000,
      "phone": [248],
      "currency": ["SCR"],
      "language": ["fr","en-GB","crs"]
   },
   "SD": {
      "code": "SD",
      "name": "Sudan",
      "native": "السودان",
      "continent": "Africa",
      "capital": "Khartoum",
      "population": 50200000,
      "phone": [249],
      "currency": ["SDG"],
      "language": ["ar","en-GB"]
   },
   "SE": {
      "code": "SE",
      "name": "Sweden",
      "native": "Sverige",
      "continent": "Europe",
      "capital": "Stockholm",
      "population": 10650000,
      "phone": [46],
      "currency": ["SEK"],
      "language": ["sv"]
   },
   "SG": {
      "code": "SG",
      "name": "Singapore",
      "native": "Singapore",
      "continent": "Asia",
      "capital": "Singapore",
      "population": 6050000,
      "phone": [65],
      "currency": ["SGD"],
      "language": ["en-GB","ms","ta","zh"]
   },
   "SH": {
      "code": "SH",
      "name": "Saint Helena",
      "native": "Saint Helena",
      "continent": "Africa",
      "capital": "Jamestown",
      "population": 4400,
      "phone": [290],
      "currency": ["SHP"],
      "language": ["en-GB"]
   },
   "SI": {
      "code": "SI",
      "name": "Slovenia",
      "native": "Slovenija",
      "continent": "Europe",
      "capital": "Ljubljana",
      "population": 2120000,
      "phone": [386],
      "currency": ["EUR"],
      "language": ["sl"]
   },
   "SJ": {
      "code": "SJ",
      "name": "Svalbard and Jan Mayen",
      "native": "Svalbard og Jan Mayen",
      "continent": "Europe",
      "capital": "Longyearbyen",
      "population": 2500,
      "phone": [4779],
      "currency": ["NOK"],
      "language": ["no"]
   },
   "SK": {
      "code": "SK",
      "name": "Slovakia",
      "native": "Slovensko",
      "continent": "Europe",
      "capital": "Bratislava",
      "population": 5420000,
      "phone": [421],
      "currency": ["EUR"],
      "language": ["sk","cs"]
   },
   "SL": {
      "code": "SL",
      "name": "Sierra Leone",
      "native": "Sierra Leone",
      "continent": "Africa",
      "capital": "Freetown",
      "population": 9200000,
      "phone": [232],
      "currency": ["SLL"],
      "language": ["en-GB","kri"]
   },
   "SM": {
      "code": "SM",
      "name": "San Marino",
      "native": "San Marino",
      "continent": "Europe",
      "capital": "City of San Marino",
      "population": 34000,
      "phone": [378],
      "currency": ["EUR"],
      "language": ["it"]
   },
   "SN": {
      "code": "SN",
      "name": "Senegal",
      "native": "Sénégal",
      "continent": "Africa",
      "capital": "Dakar",
      "population": 18800000,
      "phone": [221],
      "currency": ["XOF"],
      "language": ["fr","wo"]
   },
   "SO": {
      "code": "SO",
      "name": "Somalia",
      "native": "Soomaaliya",
      "continent": "Africa",
      "capital": "Mogadishu",
      "population": 19100000,
      "phone": [252],
      "currency": ["SOS"],
      "language": ["so","ar"]
   },
   "SR": {
      "code": "SR",
      "name": "Suriname",
      "native": "Suriname",
      "continent": "South America",
      "capital": "Paramaribo",
      "population": 630000,
      "phone": [597],
      "currency": ["SRD"],
      "language": ["nl","srn"]
   },
   "SS": {
      "code": "SS",
      "name": "South Sudan",
      "native": "South Sudan",
      "continent": "Africa",
      "capital": "Juba",
      "population": 12100000,
      "phone": [211],
      "currency": ["SSP"],
      "language": ["en-GB","din","nus","bfa"]
   },
   "ST": {
      "code": "ST",
      "name": "Sao Tome and Principe",
      "native": "São Tomé e Príncipe",
      "continent": "Africa",
      "capital": "São Tomé",
      "population": 239000,
      "phone": [239],
      "currency": ["STN"],
      "language": ["pt"]
   },
   "SV": {
      "code": "SV",
      "name": "El Salvador",
      "native": "El Salvador",
      "continent": "North America",
      "capital": "San Salvador",
      "population": 6400000,
      "phone": [503],
      "currency": ["SVC","USD"],
      "language": ["es"]
   },
   "SX": {
      "code": "SX",
      "name": "Sint Maarten",
      "native": "Sint Maarten",
      "continent": "North America",
      "capital": "Philipsburg",
      "population": 44000,
      "phone": [1721],
      "currency": ["ANG"],
      "language": ["nl","en-US"]
   },
   "SY": {
      "code": "SY",
      "name": "Syria",
      "native": "سوريا",
      "continent": "Asia",
      "capital": "Damascus",
      "population": 24500000,
      "phone": [963],
      "currency": ["SYP"],
      "language": ["ar"]
   },
   "SZ": {
      "code": "SZ",
      "name": "Eswatini",
      "native": "Eswatini",
      "continent": "Africa",
      "capital": "Lobamba",
      "population": 1230000,
      "phone": [268],
      "currency": ["SZL"],
      "language": ["en-GB","ss"]
   },
   "TC": {
      "code": "TC",
      "name": "Turks and Caicos Islands",
      "native": "Turks and Caicos Islands",
      "continent": "North America",
      "capital": "Cockburn Town",
      "population": 46000,
      "phone": [1649],
      "currency": ["USD"],
      "language": ["en-GB"]
   },
   "TD": {
      "code": "TD",
      "name": "Chad",
      "native": "Tchad",
      "continent": "Africa",
      "capital": "N'Djamena",
      "population": 19600000,
      "phone": [235],
      "currency": ["XAF"],
      "language": ["fr","shu"]
   },
   "TF": {
      "code": "TF",
      "name": "French Southern Territories",
      "native": "Territoire des Terres australes et antarctiques fr",
      "continent": "Antarctica",
      "capital": "Port-aux-Français",
      "population": 140,
      "phone": [262],
      "currency": ["EUR"],
      "language": ["fr"]
   },
   "TG": {
      "code": "TG",
      "name": "Togo",
      "native": "Togo",
      "continent": "Africa",
      "capital": "Lomé",
      "population": 9500000,
      "phone": [228],
      "currency": ["XOF"],
      "language": ["fr","ee","kbp"]
   },
   "TH": {
      "code": "TH",
      "name": "Thailand",
      "native": "ประเทศไทย",
      "continent": "Asia",
      "capital": "Bangkok",
      "population": 71600000,
      "phone": [66],
      "currency": ["THB"],
      "language": ["th"]
   },
   "TJ": {
      "code": "TJ",
      "name": "Tajikistan",
      "native": "Тоҷикистон",
      "continent": "Asia",
      "capital": "Dushanbe",
      "population": 10700000,
      "phone": [992],
      "currency": ["TJS"],
      "language": ["tg","ru"]
   },
   "TK": {
      "code": "TK",
      "name": "Tokelau",
      "native": "Tokelau",
      "continent": "Oceania",
      "capital": "Fakaofo",
      "population": 1500,
      "phone": [690],
      "currency": ["NZD"],
      "language": ["en-NZ","tkl","smo"]
   },
   "TL": {
      "code": "TL",
      "name": "East Timor",
      "native": "Timor-Leste",
      "continent": "Oceania",
      "capital": "Dili",
      "population": 1400000,
      "phone": [670],
      "currency": ["USD"],
      "language": ["pt","tet"]
   },
   "TM": {
      "code": "TM",
      "name": "Turkmenistan",
      "native": "Türkmenistan",
      "continent": "Asia",
      "capital": "Ashgabat",
      "population": 6600000,
      "phone": [993],
      "currency": ["TMT"],
      "language": ["tk","ru"]
   },
   "TN": {
      "code": "TN",
      "name": "Tunisia",
      "native": "تونس",
      "continent": "Africa",
      "capital": "Tunis",
      "population": 12600000,
      "phone": [216],
      "currency": ["TND"],
      "language": ["ar"]
   },
   "TO": {
      "code": "TO",
      "name": "Tonga",
      "native": "Tonga",
      "continent": "Oceania",
      "capital": "Nuku'alofa",
      "population": 108000,
      "phone": [676],
      "currency": ["TOP"],
      "language": ["en-GB","to"]
   },
   "TR": {
      "code": "TR",
      "name": "Turkey",
      "native": "Türkiye",
      "continent": "Asia",
      "capital": "Ankara",
      "population": 87800000,
      "phone": [90],
      "currency": ["TRY"],
      "language": ["tr","ku"]
   },
   "TT": {
      "code": "TT",
      "name": "Trinidad and Tobago",
      "native": "Trinidad and Tobago",
      "continent": "North America",
      "capital": "Port of Spain",
      "population": 1540000,
      "phone": [1868],
      "currency": ["TTD"],
      "language": ["en-GB","tto"]
   },
   "TV": {
      "code": "TV",
      "name": "Tuvalu",
      "native": "Tuvalu",
      "continent": "Oceania",
      "capital": "Funafuti",
      "population": 11500,
      "phone": [688],
      "currency": ["AUD"],
      "language": ["en-GB","tvl"]
   },
   "TW": {
      "code": "TW",
      "name": "Taiwan",
      "native": "臺灣",
      "continent": "Asia",
      "capital": "Taipei",
      "population": 23900000,
      "phone": [886],
      "currency": ["TWD"],
      "language": ["zh","nan","hak"]
   },
   "TZ": {
      "code": "TZ",
      "name": "Tanzania",
      "native": "Tanzania",
      "continent": "Africa",
      "capital": "Dodoma",
      "population": 71400000,
      "phone": [255],
      "currency": ["TZS"],
      "language": ["sw","en-GB"]
   },
   "UA": {
      "code": "UA",
      "name": "Ukraine",
      "native": "Україна",
      "continent": "Europe",
      "capital": "Kyiv",
      "population": 37000000,
      "phone": [380],
      "currency": ["UAH"],
      "language": ["uk","ru"]
   },
   "UG": {
      "code": "UG",
      "name": "Uganda",
      "native": "Uganda",
      "continent": "Africa",
      "capital": "Kampala",
      "population": 51000000,
      "phone": [256],
      "currency": ["UGX"],
      "language": ["en-GB","sw","lg"]
   },
   "UM": {
      "code": "UM",
      "name": "U.S. Minor Outlying Islands",
      "native": "United States Minor Outlying Islands",
      "continent": "Oceania",
      "population": 190,
      "phone": [1],
      "currency": ["USD"],
      "language": ["en-US"]
   },
   "US": {
      "code": "US",
      "name": "United States",
      "native": "United States",
      "continent": "North America",
      "capital": "Washington D.C.",
      "population": 348300000,
      "phone": [1],
      "currency": ["USD","USN","USS"],
      "language": ["en-US","es-US","nv","yi","ik","haw"]
   },
   "UY": {
      "code": "UY",
      "name": "Uruguay",
      "native": "Uruguay",
      "continent": "South America",
      "capital": "Montevideo",
      "population": 3420000,
      "phone": [598],
      "currency": ["UYI","UYU"],
      "language": ["es"]
   },
   "UZ": {
      "code": "UZ",
      "name": "Uzbekistan",
      "native": "O'zbekiston",
      "continent": "Asia",
      "capital": "Tashkent",
      "population": 37300000,
      "phone": [998],
      "currency": ["UZS"],
      "language": ["uz","ru","tg"]
   },
   "VA": {
      "code": "VA",
      "name": "Vatican City",
      "native": "Vaticano",
      "continent": "Europe",
      "capital": "Vatican City",
      "population": 800,
      "phone": [379],
      "currency": ["EUR"],
      "language": ["it","la"]
   },
   "VC": {
      "code": "VC",
      "name": "Saint Vincent and the Grenadines",
      "native": "Saint Vincent and the Grenadines",
      "continent": "North America",
      "capital": "Kingstown",
      "population": 104000,
      "phone": [1784],
      "currency": ["XCD"],
      "language": ["en-GB","svc"]
   },
   "VE": {
      "code": "VE",
      "name": "Venezuela",
      "native": "Venezuela",
      "continent": "South America",
      "capital": "Caracas",
      "population": 29800000,
      "phone": [58],
      "currency": ["VES"],
      "language": ["es"]
   },
   "VG": {
      "code": "VG",
      "name": "British Virgin Islands",
      "native": "British Virgin Islands",
      "continent": "North America",
      "capital": "Road Town",
      "population": 32000,
      "phone": [1284],
      "currency": ["USD"],
      "language": ["en-GB"]
   },
   "VI": {
      "code": "VI",
      "name": "U.S. Virgin Islands",
      "native": "United States Virgin Islands",
      "continent": "North America",
      "capital": "Charlotte Amalie",
      "population": 103000,
      "phone": [1340],
      "currency": ["USD"],
      "language": ["en-US"]
   },
   "VN": {
      "code": "VN",
      "name": "Vietnam",
      "native": "Việt Nam",
      "continent": "Asia",
      "capital": "Hanoi",
      "population": 101900000,
      "phone": [84],
      "currency": ["VND"],
      "language": ["vi"]
   },
   "VU": {
      "code": "VU",
      "name": "Vanuatu",
      "native": "Vanuatu",
      "continent": "Oceania",
      "capital": "Port Vila",
      "population": 345000,
      "phone": [678],
      "currency": ["VUV"],
      "language": ["bi","en-GB","fr"]
   },
   "WF": {
      "code": "WF",
      "name": "Wallis and Futuna",
      "native": "Wallis et Futuna",
      "continent": "Oceania",
      "capital": "Mata-Utu",
      "population": 11400,
      "phone": [681],
      "currency": ["XPF"],
      "language": ["fr","wls","fud"]
   },
   "WS": {
      "code": "WS",
      "name": "Samoa",
      "native": "Samoa",
      "continent": "Oceania",
      "capital": "Apia",
      "population": 228000,
      "phone": [685],
      "currency": ["WST"],
      "language": ["sm","en-GB"]
   },
   "XK": {
      "code": "XK",
      "name": "Kosovo",
      "native": "Republika e Kosovës",
      "continent": "Europe",
      "capital": "Pristina",
      "population": 1570000,
      "phone": [377,381,383,386],
      "currency": ["EUR"],
      "language": ["sq","sr"]
   },
   "YE": {
      "code": "YE",
      "name": "Yemen",
      "native": "اليَمَن",
      "continent": "Asia",
      "capital": "Sana'a",
      "population": 36200000,
      "phone": [967],
      "currency": ["YER"],
      "language": ["ar"]
   },
   "YT": {
      "code": "YT",
      "name": "Mayotte",
      "native": "Mayotte",
      "continent": "Africa",
      "capital": "Mamoudzou",
      "population": 345000,
      "phone": [262],
      "currency": ["EUR"],
      "language": ["fr","swb"]
   },
   "ZA": {
      "code": "ZA",
      "name": "South Africa",
      "native": "South Africa",
      "continent": "Africa",
      "capital": "Pretoria",
      "population": 61500000,
      "phone": [27],
      "currency": ["ZAR"],
      "language": ["af","en-ZA","nr","st","ss","tn","ts","ve","xh","zu"]
   },
   "ZM": {
      "code": "ZM",
      "name": "Zambia",
      "native": "Zambia",
      "continent": "Africa",
      "capital": "Lusaka",
      "population": 22200000,
      "phone": [260],
      "currency": ["ZMW"],
      "language": ["en-GB","ny","bem","loz"]
   },
   "ZW": {
      "code": "ZW",
      "name": "Zimbabwe",
      "native": "Zimbabwe",
      "continent": "Africa",
      "capital": "Harare",
      "population": 17500000,
      "phone": [263],
      "currency": ["USD","ZAR","BWP","GBP","AUD","CNY","INR","JPY"],
      "language": ["en-GB","sn","nd"]
   }
};

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

export const countriesData = countries as Record<string, Country>;

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

// Pomocná funkce pro získání dat o jazyku z obou zdrojů
// v src/content/config/i18n.ts
// src/content/config/i18n.ts

function getLangInfo(code: string) {
  const c = code.toLowerCase();
    const meta = (languages as any)[c] || (iso_639_3 as any)[c];
  
  if (!meta) {
    return {
      code: c,
      nameEn: 'Unknown',
      nameNative: '—',
      type: '—',
      isKnown: false
    };
  }

  return {
    code: c,
    nameEn: meta.en || 'Unknown',
    nameNative: meta.label || '—',
    type: meta.type || '—',
    isKnown: true
  };
}

// Upravená funkce pro použité jazyky
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

// Upravená funkce pro nepoužité jazyky
export function getUnusedLanguagesData() {
  const usedCodes = new Set<string>();
  Object.values(countriesData).forEach(c => {
    c.language?.forEach(l => usedCodes.add(l));
  });

  // Sloučíme klíče z obou slovníků a odfiltrujeme ty použité
  const allAvailableCodes = new Set([
    ...Object.keys(languages),
    ...Object.keys(iso_639_3)
  ]);

  return Array.from(allAvailableCodes)
    .filter(code => !usedCodes.has(code))
    .map(code => getLangInfo(code))
    .sort((a, b) => a.nameEn.localeCompare(b.nameEn));
}
