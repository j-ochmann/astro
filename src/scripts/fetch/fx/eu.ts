import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from '../fetch.config.js';

const RAW_DIR = path.join(PATHS.RAW, PATHS.EU);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.EU);
const URL = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';

export async function fetchEU() {
  console.log('⏳ Fetching [EU] European Central Bank...');

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
    const rawFile = path.join(RAW_DIR, PATHS.EU+`_${timestamp}.xml`);

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
    tempRates.sort((a, b) => (a[0] as string).localeCompare(b[0] as string));

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
      PATHS.EU+`_${timestamp}.json`
    );

    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✅ Normalized saved (base EUR): ${normalizedFile}`);

    return {
      raw: rawFile,
      normalized: normalizedFile
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error processing ECB data:', errorMessage);
    throw error;
  }
}
