import fs from 'node:fs';
import path from 'node:path';

const RAW_DIR = './data/raw/boj';
const NORMALIZED_DIR = './data/normalized';
const URL = 'https://www.stat-search.boj.or.jp/ssi/cgi-bin/famecgi2?cgi=$nme_a000_en&lstSelection=FM08';

export async function fetchBOJ() {
  console.log('⏳ Fetching data from Bank of Japan...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`BOJ fetch failed: ${response.statusText}`);

    const rawText = await response.text();

    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });

    const rawFile = path.join(RAW_DIR, `boj_${timestamp}.csv`);
    fs.writeFileSync(rawFile, rawText);
    console.log(`✅ Raw saved: ${rawFile}`);

    // NORMALIZED
    const lines = rawText.split('\n').slice(1);
    const rates = { JPY: 1 };

    for (const line of lines) {
      const cols = line.split(',');
      if (cols.length < 2) continue;

      const currency = cols[0]?.trim();
      const rate = parseFloat(cols[1]);

      if (currency && rate) rates[currency] = rate;
    }

    const sortedRates = Object.fromEntries(
      Object.entries(rates).sort((a, b) => a[0].localeCompare(b[0]))
    );

    const normalized = {
      source: 'Bank of Japan',
      base: 'JPY',
      date: new Date().toISOString().split('T')[0],
      fetchedAt: new Date().toISOString(),
      rates: sortedRates
    };

    if (!fs.existsSync(NORMALIZED_DIR))
      fs.mkdirSync(NORMALIZED_DIR, { recursive: true });

    const normalizedFile = path.join(
      NORMALIZED_DIR,
      `boj_JPY_${timestamp}.json`
    );

    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✅ Normalized saved (base JPY): ${normalizedFile}`);

    return { raw: rawFile, normalized: normalizedFile };

  } catch (error) {
    console.error('❌ Error processing BOJ data:', error.message);
    throw error;
  }
}
