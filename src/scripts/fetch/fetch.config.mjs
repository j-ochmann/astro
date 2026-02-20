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

export const PYTH = {
  AUD: {
    base: 'AUD',
    rates: {
      CAD: '0x95330ad1bcac1bd79179fe59000bfe199ba3fe7f03254220548ef2d034bdf4d6',
      CHF: '0x56e94c0381e42a81a15a46daf35f59f391c074ef1770ef33829475c9b797b420',
      JPY: '0x8dbbb66dff44114f0bfc34a1d19f0fe6fc3906dcc72f7668d3ea936e1d6544ce',
    }
  }
};

