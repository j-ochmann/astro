import fs from 'node:fs';
import path from 'node:path';

const RAW_DIR = './data/raw/boc';
const OUTPUT_FILE = './public/boc.json';
const URL = 'https://www.bankofcanada.ca/valet/observations/group/FX_RATES_DAILY/json';

export async function fetchBOC() {
  console.log('⏳ Fetching data from Bank of Canada (Valet API)...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`BoC fetch failed: ${response.statusText}`);

    const data = await response.json();
    const details = data.seriesDetail;
    const observations = data.observations;

    // --- 1️⃣ Uložíme raw data ---
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const rawFile = path.join(RAW_DIR, `boc-raw-${timestamp}.json`);
    fs.writeFileSync(rawFile, JSON.stringify(data, null, 2));
    console.log(`📦 Raw BoC data saved: ${rawFile}`);

    // --- 2️⃣ Normalizace na jednotný formát ---
    const latestObs = observations[observations.length - 1];
    const date = latestObs.d; // Observation date YYYY-MM-DD

    const usdToCad = parseFloat(latestObs.FXUSDCAD.v);

    const rates = [];

    for (const [key, value] of Object.entries(latestObs)) {
      if (key === 'd') continue; // skip date

      const seriesInfo = details[key];
      const currencyCode = key.replace('FX', '').replace('CAD', '');

      const rateToCad = parseFloat(value.v);
      if (isNaN(rateToCad) || rateToCad === 0) continue;

      const ratePerUsd = usdToCad / rateToCad;

      rates.push({
        currency: seriesInfo.label.replace(' to Canadian dollar', ''),
        code: currencyCode,
        rate: parseFloat(ratePerUsd.toFixed(6)), // normalize precision
        originalRateCad: rateToCad
      });
    }

    const result = {
      source: 'Bank of Canada',
      url: 'https://www.bankofcanada.ca/valet/',
      base: 'USD',
      date,
      fetchedAt: new Date().toISOString(),
      rates
    };

    // Uložíme normalizované data
    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`✅ Normalized BoC data saved (${rates.length} currencies) -> ${OUTPUT_FILE}`);

    return result;

  } catch (error) {
    console.error('❌ Error processing BoC data:', error.message);
    throw error;
  }
}
