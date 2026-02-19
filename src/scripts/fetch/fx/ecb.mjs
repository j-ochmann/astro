import fs from 'node:fs';
import path from 'node:path';

const URL = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';

const RAW_DIR = './data/raw/ecb';
const NORMALIZED_DIR = './data/normalized';

export async function fetchECB() {
  console.log('⏳ Fetching data from ECB...');

  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`ECB fetch failed: ${response.statusText}`);
    }

    const xml = await response.text();

    // --------------------------------------------------
    // 1️⃣ RAW SAVE
    // --------------------------------------------------

    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    const rawFile = path.join(RAW_DIR, `ecb_${timestamp}.xml`);

    if (!fs.existsSync(RAW_DIR)) {
      fs.mkdirSync(RAW_DIR, { recursive: true });
    }

    fs.writeFileSync(rawFile, xml);
    console.log(`✅ Raw saved: ${rawFile}`);

    // --------------------------------------------------
    // 2️⃣ PARSE + NORMALIZE (NO CONVERSION!)
    // --------------------------------------------------

    // Extract date: <Cube time='2026-02-18'>
    const dateMatch = xml.match(/<Cube time='([^']+)'/);
    const date = dateMatch
      ? dateMatch[1]
      : new Date().toISOString().split('T')[0];

    // Extract rates
    const regex = /<Cube currency='([^']+)' rate='([^']+)'\/>/g;

    const tempRates = [];
    let match;

    while ((match = regex.exec(xml)) !== null) {
      const code = match[1];
      const rate = parseFloat(match[2]);

      tempRates.push([code, rate]);
    }

    // ECB nevrací EUR → přidáme 1
    tempRates.push(['EUR', 1]);

    // Abecední řazení
    tempRates.sort((a, b) => a[0].localeCompare(b[0]));

    const rates = Object.fromEntries(tempRates);

    const normalized = {
      source: 'European Central Bank',
      base: 'EUR',
      date,
      fetchedAt: new Date().toISOString(),
      rates
    };

    if (!fs.existsSync(NORMALIZED_DIR)) {
      fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    }

    const normalizedFile = path.join(
      NORMALIZED_DIR,
      `ecb_EUR_${timestamp}.json`
    );

    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✅ Normalized saved (base EUR): ${normalizedFile}`);

    return {
      raw: rawFile,
      normalized: normalizedFile
    };

  } catch (error) {
    console.error('❌ Error processing ECB data:', error.message);
    throw error;
  }
}
