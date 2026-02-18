import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_FILE = './public/imf.json';

export async function fetchIMF() {
  console.log('⏳ Fetching data from IMF (SDMX endpoint)...');

  try {
    // IFS dataset – USD exchange rates
    const url =
      'https://dataservices.imf.org/REST/SDMX_JSON.svc/CompactData/IFS/M..ENDA_XDC_USD_RATE';

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`IMF Error ${response.status}`);
    }

    const json = await response.json();

    const series = json?.CompactData?.DataSet?.Series;
    if (!series) {
      throw new Error('IMF returned unexpected JSON structure.');
    }

    const seriesArray = Array.isArray(series) ? series : [series];

    const rates = [];
    let lastDate = '';

    for (const s of seriesArray) {
      const currency = s['@REF_AREA']; // country code
      const obs = s.Obs;
      if (!obs) continue;

      const obsArray = Array.isArray(obs) ? obs : [obs];
      const latest = obsArray[obsArray.length - 1];

      const value = parseFloat(latest['@OBS_VALUE']);
      const date = latest['@TIME_PERIOD'];

      if (!isNaN(value)) {
        rates.push({
          code: currency,
          rate: value,
          date
        });

        if (date > lastDate) lastDate = date;
      }
    }

    const result = {
      source: 'International Monetary Fund (IFS)',
      base: 'USD',
      date: lastDate,
      fetchedAt: new Date().toISOString(),
      rates
    };

    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));

    console.log(`✅ IMF data saved (${rates.length} entries)`);

    return result;

  } catch (error) {
    console.error('⚠️ IMF failure:', error.message);
    return null;
  }
}
