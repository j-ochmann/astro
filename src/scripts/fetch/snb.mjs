import fs from 'node:fs';
import path from 'node:path';

const URL = 'https://data.snb.ch/api/cube/devkot/data';
const OUTPUT_FILE = './public/snb.json';

export async function fetchSNB() {
  console.log('⏳ Fetching Swiss National Bank...');

  const response = await fetch(URL);
  if (!response.ok) throw new Error('SNB fetch failed');

  const xml = await response.text();

  const regex = /<Obs[^>]*TIME_PERIOD="([^"]+)"[^>]*OBS_VALUE="([^"]+)"[^>]*CURRENCY="([^"]+)"/g;

  const rates = { CHF: 1 };
  let match;

  while ((match = regex.exec(xml)) !== null) {
    const currency = match[3];
    const rate = parseFloat(match[2]);

    if (currency && rate) {
      rates[currency] = rate;
    }
  }

  const sortedRates = Object.fromEntries(
    Object.entries(rates).sort(([a], [b]) => a.localeCompare(b))
  );

  const result = {
    source: 'Swiss National Bank',
    base: 'CHF',
    date: new Date().toISOString().split('T')[0],
    fetchedAt: new Date().toISOString(),
    rates: sortedRates
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));

  return result;
}
