import fs from 'node:fs';
import path from 'node:path';

const RAW_DIR = './data/raw/ca';
const NORMALIZED_DIR = './data/normalized';
const URL = 'https://www.bankofcanada.ca/valet/observations/group/FX_RATES_DAILY/json';

export async function fetchCA() {
  console.log('⏳ Fetching [CA] Bank of Canada...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`BoC fetch failed: ${response.statusText}`);

    const data = await response.json();
    // RAW SAVE
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    const rawFile = path.join(RAW_DIR, `boc_${timestamp}.json`);

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
          parseFloat(value.v)
        ])
        .sort((a, b) => a[0].localeCompare(b[0]))
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
      `boc_CAD_${timestamp}.json`
    );

    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✅ Normalized saved (base CAD): ${normalizedFile}`);

    return {
      raw: rawFile,
      normalized: normalizedFile
    };

  } catch (error) {
    console.error('❌ Error processing BoC data:', error.message);
    throw error;
  }
}
