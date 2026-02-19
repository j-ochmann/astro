// boj.js
import fs from 'node:fs';
import path from 'node:path';

const URL = 'https://www.stat-search.boj.or.jp/ssi/cgi-bin/famecgi2?cgi=$nme_a000_en&lstSelection=FM08';
const OUTPUT_FILE = './public/boj.json';

export async function fetchBOJ() {
  console.log('⏳ Fetching Bank of Japan rates...');

  const response = await fetch(URL);
  if (!response.ok) throw new Error('BOJ fetch failed');

  const csv = await response.text();
  const lines = csv.split('\n').slice(1);

  const rates = { JPY: 1 };

  for (const line of lines) {
    const cols = line.split(',');
    if (cols.length < 2) continue;

    const currency = cols[0]?.trim();
    const rate = parseFloat(cols[1]);

    if (currency && rate) {
      rates[currency] = rate;
    }
  }

  const sortedRates = Object.fromEntries(
    Object.entries(rates).sort(([a], [b]) => a.localeCompare(b))
  );

  const result = {
    source: 'Bank of Japan',
    base: 'JPY',
    date: new Date().toISOString().split('T')[0],
    fetchedAt: new Date().toISOString(),
    rates: sortedRates
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));

  return result;
}
