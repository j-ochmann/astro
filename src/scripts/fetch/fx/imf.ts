import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from '../fetch.config.ts';

const RAW_DIR = path.join(PATHS.RAW, PATHS.IMF);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.IMF);

const URL = 'https://dataservices.imf.org/REST/SDMX_JSON.svc/CompactData/IFS/D..XDR';

export async function fetchIMF() {
  console.log('⏳ Fetching data from IMF (SDMX JSON)...');

  try {
    const response = await fetch(URL, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      throw new Error(`IMF API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');

    if (!fs.existsSync(RAW_DIR))
      fs.mkdirSync(RAW_DIR, { recursive: true });

    const rawFile = path.join(
      RAW_DIR,
      PATHS.IMF + `_${timestamp}.json`
    );

    fs.writeFileSync(rawFile, JSON.stringify(data, null, 2));

    const series = data?.CompactData?.DataSet?.Series;

    if (!series) {
      throw new Error('IMF API: Unexpected JSON structure.');
    }

    const rates: { [key: string]: number } = { XDR: 1 };
    let latestDate: string | null = null;

    const seriesArray = Array.isArray(series) ? series : [series];

    for (const s of seriesArray) {
      const currency = s['@CURRENCY'];
      const obs = s.Obs;

      if (!currency || !obs) continue;

      const obsArray = Array.isArray(obs) ? obs : [obs];
      const last = obsArray[obsArray.length - 1];

      const rate = parseFloat(last['@OBS_VALUE']);
      const date = last['@TIME_PERIOD'];

      if (!isNaN(rate)) {
        rates[currency] = rate;
        if (!latestDate) latestDate = date;
      }
    }

    const normalized = {
      source: 'International Monetary Fund',
      base: 'XDR',
      date: latestDate,
      fetchedAt: new Date().toISOString(),
      rates: Object.fromEntries(
        Object.entries(rates).sort((a, b) =>
          a[0].localeCompare(b[0])
        )
      )
    };

    if (!fs.existsSync(NORMALIZED_DIR))
      fs.mkdirSync(NORMALIZED_DIR, { recursive: true });

    const normalizedFile = path.join(
      NORMALIZED_DIR,
      PATHS.IMF + `_${timestamp}.json`
    );

    fs.writeFileSync(
      normalizedFile,
      JSON.stringify(normalized, null, 2)
    );

    console.log(
      `✨ IMF sync complete. Total currencies vs XDR: ${
        Object.keys(rates).length - 1
      }`
    );

    return { raw: rawFile, normalized: normalizedFile };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ IMF error:', errorMessage);
    return null;
  }
}
