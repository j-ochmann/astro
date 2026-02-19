import fs from 'node:fs';
import path from 'node:path';

const URL = 'https://www.pbc.gov.cn/english/130721/index.html';
const OUTPUT_FILE = './public/pboc.json';

export async function fetchPBC() {
  console.log('⏳ Fetching People’s Bank of China...');

  const response = await fetch(URL);
  if (!response.ok) throw new Error('PBOC fetch failed');

  const html = await response.text();

  const regex = /([A-Z]{3})<\/td>\s*<td>([\d.]+)<\/td>/g;

  const rates = { CNY: 1 };
  let match;

  while ((match = regex.exec(html)) !== null) {
    const currency = match[1];
    const rate = parseFloat(match[2]);

    if (currency && rate) {
      rates[currency] = rate;
    }
  }

  const sortedRates = Object.fromEntries(
    Object.entries(rates).sort(([a], [b]) => a.localeCompare(b))
  );

  const result = {
    source: 'People’s Bank of China',
    base: 'CNY',
    date: new Date().toISOString().split('T')[0],
    fetchedAt: new Date().toISOString(),
    rates: sortedRates
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));

  return result;
}
