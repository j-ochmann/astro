import path from 'node:path';

const BASE_DIR = './src/content/feed';

export const PATHS = {
  RAW: path.join(BASE_DIR, 'raw'),
  NORMALIZED: path.join(BASE_DIR, 'normalized'),
  AU: 'au',
  CA: 'ca',
  CZ: 'cz',
  EU: 'eu',
  HK: 'hk',
  IL: 'il',
  RO: 'ro',
  RU: 'ru',
  UZ: 'uz',
  US: 'us',
  UNORE: 'unore',
  NASDAQ: 'nasdaq',
};
