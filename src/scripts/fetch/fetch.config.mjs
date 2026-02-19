import path from 'node:path';

const BASE_DIR = './src/content/feed';

export const PATHS = {
  RAW: path.join(BASE_DIR, 'raw'),
  NORMALIZED: path.join(BASE_DIR, 'normalized'),
};
