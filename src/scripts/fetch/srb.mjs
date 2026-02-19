import fs from 'node:fs';
import path from 'node:path';

const RAW_DIR = './data/raw/riksbank';
const NORMALIZED_DIR = './data/normalized';
const URL = 'https://api.riksbank.se/swea/v1/Observations?last=1';

export async function fetchSRB() {
  console.log('⏳ Fetching data from Sveriges Riksbank...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`Riksbank fetch failed: ${response.statusText}`);

    const data = await response.json();

    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });

    const rawFile = path.join(RAW_DIR, `riksbank_${timestamp}.json`);
    fs.writeFileSync(rawFile, JSON.stringify(data, null, 2));
    console.log(`✅ Raw saved: ${rawFile}`);

    const rates = { SEK: 1 };

    for (const obs of data.observations || []) {
      const currency = obs.seriesId?.replace('SEK', '');
      const rate = parseFloat(obs.value);
      if (currency && rate) rates[currency] = rate;
    }

    const sortedRates = Object.fromEntries(
      Object.entries(rates).sort((a, b) => a[0].localeCompare(b[0]))
    );

    const normalized = {
      source: 'Sveriges Riksbank',
      base: 'SEK',
      date: new Date().toISOString().split('T')[0],
      fetchedAt: new Date().toISOString(),
      rates: sortedRates
    };

    if (!fs.existsSync(NORMALIZED_DIR))
      fs.mkdirSync(NORMALIZED_DIR, { recursive: true });

    const normalizedFile = path.join(
      NORMALIZED_DIR,
      `riksbank_SEK_${timestamp}.json`
    );

    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✅ Normalized saved (base SEK): ${normalizedFile}`);

    return { raw: rawFile, normalized: normalizedFile };

  } catch (error) {
    console.error('❌ Error processing Riksbank data:', error.message);
    throw error;
  }
}
