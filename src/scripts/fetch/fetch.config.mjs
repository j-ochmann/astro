import path from 'node:path';

const BASE_DIR = './src/content/feed';

export const PATHS = {
  RAW: path.join(BASE_DIR, 'raw'),
  NORMALIZED: path.join(BASE_DIR, 'normalized'),
  AU: 'au',
  CA: 'ca',
  CH: 'ch',
  CZ: 'cz',
  EU: 'eu',
  GB: 'gb',
  HK: 'hk',
  IL: 'il',
  RO: 'ro',
  RU: 'ru',
  UZ: 'uz',
  US: 'us',
  UNORE: 'unore',
  NASDAQ: 'nasdaq',
  PYTH: 'pyth',
  CHAINLINK: 'chainlink',
  /* invalid: CH,CN,GB,JP,SE,International Monetary Fund */
  CN: 'cn',
  JP: 'jp',
  SE: 'se',
  SG: 'sg',
  IMF: 'imf'
};
