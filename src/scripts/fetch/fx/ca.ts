import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from '../fetch.config.js';

const RAW_DIR = path.join(PATHS.RAW, PATHS.CA);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.CA);
const URL = 'https://www.bankofcanada.ca/valet/observations/group/FX_RATES_DAILY/json';

export async function fetchCA() {
  console.log('⏳ Fetching [CA] Bank of Canada...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`Bank of Canada fetch failed: ${response.statusText}`);

    const data = await response.json();
    // RAW SAVE
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    const rawFile = path.join(RAW_DIR, PATHS.CA+`_${timestamp}.json`);

    if (!fs.existsSync(RAW_DIR)) {
      fs.mkdirSync(RAW_DIR, { recursive: true });
    }

    fs.writeFileSync(rawFile, JSON.stringify(data, null, 2));
    console.log(`✅ Raw saved: ${rawFile}`);
    // NORMALIZED WITHOUT CONVERSION
    const observations = data.observations;
    const latestObs = observations[observations.length - 1];
    const date = latestObs.d;

    const rates = Object.fromEntries(
      Object.entries(latestObs)
        .filter(([key]) => key !== 'd')
        .map(([key, value]) => [
          key.replace('FX', '').replace('CAD', ''),
          parseFloat((value as { v: string }).v)
        ])
        .sort((a, b) => String(a[0]).localeCompare(String(b[0])))
    );

    const normalized = {
      source: 'Bank of Canada',
      base: 'CAD',
      date,
      fetchedAt: new Date().toISOString(),
      rates
    };

    if (!fs.existsSync(NORMALIZED_DIR)) {
      fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    }

    const normalizedFile = path.join(
      NORMALIZED_DIR,
      PATHS.CA+`_${timestamp}.json`
    );

    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✅ Normalized saved (base CAD): ${normalizedFile}`);

    return {
      raw: rawFile,
      normalized: normalizedFile
    };

  } catch (error) {
    console.error('❌ Error processing BoC data:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}
