import fs from 'node:fs';
import path from 'node:path';

const URL = 'https://www.cbr.ru/scripts/XML_daily.asp';
const OUTPUT_FILE = './public/cbr.json';

export async function fetchCBR() {
  console.log('⏳ Fetching Central Bank of Russia...');

  const response = await fetch(URL);
  if (!response.ok) throw new Error('CBR fetch failed');

  const xml = await response.text();

  const regex = /<CharCode>([^<]+)<\/CharCode>[\s\S]*?<Value>([^<]+)<\/Value>/g;

  const rates = { RUB: 1 };
  let match;

  while ((match = regex.exec(xml)) !== null) {
    const currency = match[1];
    const rate = parseFloat(match[2].replace(',', '.'));

    if (currency && rate) {
      rates[currency] = rate;
    }
  }

  const sortedRates = Object.fromEntries(
    Object.entries(rates).sort(([a], [b]) => a.localeCompare(b))
  );

  const result = {
    source: 'Central Bank of Russia',
    base: 'RUB',
    date: new Date().toISOString().split('T')[0],
    fetchedAt: new Date().toISOString(),
    rates: sortedRates
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));

  return result;
}
