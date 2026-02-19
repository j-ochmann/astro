import fs from 'node:fs';
import path from 'node:path';

const URL =
  'https://api.riksbank.se/swea/v1/Observations?seriesId=SEKEURPMI&last=1';

const OUTPUT_FILE = './public/riksbank.json';

export async function fetchSRB() {
  console.log('⏳ Fetching Sveriges Riksbank...');

  const response = await fetch(URL);
  if (!response.ok) throw new Error('Riksbank fetch failed');

  const data = await response.json();

  const rates = { SEK: 1 };

  for (const obs of data.observations || []) {
    const currency = obs.seriesId?.replace('SEK', '').replace('PMI', '');
    const rate = parseFloat(obs.value);

    if (currency && rate) {
      rates[currency] = rate;
    }
  }

  const sortedRates = Object.fromEntries(
    Object.entries(rates).sort(([a], [b]) => a.localeCompare(b))
  );

  const result = {
    source: 'Sveriges Riksbank',
    base: 'SEK',
    date: new Date().toISOString().split('T')[0],
    fetchedAt: new Date().toISOString(),
    rates: sortedRates
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));

  return result;
}
