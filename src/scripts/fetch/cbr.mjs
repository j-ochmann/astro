import fs from 'node:fs';
import path from 'node:path';

const RAW_DIR = './data/raw/snb';
const NORMALIZED_DIR = './data/normalized';
const URL = 'https://data.snb.ch/api/cube/devkot/data';

export async function fetchSNB() {
  console.log('⏳ Fetching data from Swiss National Bank...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`SNB fetch failed: ${response.statusText}`);

    const rawText = await response.text();

    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });

    const rawFile = path.join(RAW_DIR, `snb_${timestamp}.xml`);
    fs.writeFileSync(rawFile, rawText);
    console.log(`✅ Raw saved: ${rawFile}`);

    const regex = /CURRENCY="([^"]+)"[^>]*OBS_VALUE="([^"]+)"/g;

    const rates = { CHF: 1 };
    let match;

    while ((match = regex.exec(rawText)) !== null) {
      const currency = match[1];
      const rate = parseFloat(match[2]);
      if (currency && rate) rates[currency] = rate;
    }

    const sortedRates = Object.fromEntries(
      Object.entries(rates).sort((a, b) => a[0].localeCompare(b[0]))
    );

    const normalized = {
      source: 'Swiss National Bank',
      base: 'CHF',
      date: new Date().toISOString().split('T')[0],
      fetchedAt: new Date().toISOString(),
      rates: sortedRates
    };

    if (!fs.existsSync(NORMALIZED_DIR))
      fs.mkdirSync(NORMALIZED_DIR, { recursive: true });

    const normalizedFile = path.join(
      NORMALIZED_DIR,
      `snb_CHF_${timestamp}.json`
    );

    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✅ Normalized saved (base CHF): ${normalizedFile}`);

    return { raw: rawFile, normalized: normalizedFile };

  } catch (error) {
    console.error('❌ Error processing SNB data:', error.message);
    throw error;
  }
}
