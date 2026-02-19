import fs from 'node:fs';
import path from 'node:path';

const RAW_DIR = './data/raw/pboc';
const NORMALIZED_DIR = './data/normalized';
const URL = 'https://www.pbc.gov.cn/english/130721/index.html';

export async function fetchPBC() {
  console.log('⏳ Fetching data from People’s Bank of China...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`PBOC fetch failed: ${response.statusText}`);

    const rawText = await response.text();

    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });

    const rawFile = path.join(RAW_DIR, `pboc_${timestamp}.html`);
    fs.writeFileSync(rawFile, rawText);
    console.log(`✅ Raw saved: ${rawFile}`);

    const regex = /<td>([A-Z]{3})<\/td>\s*<td>([\d.]+)<\/td>/g;

    const rates = { CNY: 1 };
    let match;

    while ((match = regex.exec(rawText)) !== null) {
      const currency = match[1];
      const rate = parseFloat(match[2]);

      if (currency && rate) {
        rates[currency] = rate;
      }
    }

    const sortedRates = Object.fromEntries(
      Object.entries(rates).sort((a, b) => a[0].localeCompare(b[0]))
    );

    const normalized = {
      source: 'People’s Bank of China',
      base: 'CNY',
      date: new Date().toISOString().split('T')[0],
      fetchedAt: new Date().toISOString(),
      rates: sortedRates
    };

    if (!fs.existsSync(NORMALIZED_DIR))
      fs.mkdirSync(NORMALIZED_DIR, { recursive: true });

    const normalizedFile = path.join(
      NORMALIZED_DIR,
      `pboc_CNY_${timestamp}.json`
    );

    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✅ Normalized saved (base CNY): ${normalizedFile}`);

    return { raw: rawFile, normalized: normalizedFile };

  } catch (error) {
    console.error('❌ Error processing PBOC data:', error.message);
    throw error;
  }
}
