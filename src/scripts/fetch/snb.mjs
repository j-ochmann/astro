import fs from 'node:fs';
import path from 'node:path';

const RAW_DIR = './data/raw/snb';
const NORMALIZED_DIR = './data/normalized';
const BASE_URL = 'https://data.snb.ch/api/data/devkox';

// měny, které SNB oficiálně publikuje denně
const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CAD',
  'AUD', 'NZD', 'SEK', 'NOK', 'DKK'
];

export async function fetchSNB() {
  console.log('⏳ Fetching data from Swiss National Bank...');

  try {
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');

    if (!fs.existsSync(RAW_DIR)) {
      fs.mkdirSync(RAW_DIR, { recursive: true });
    }

    if (!fs.existsSync(NORMALIZED_DIR)) {
      fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    }

    const rates = {};
    let latestDate = null;

    for (const currency of CURRENCIES) {
      const url = `${BASE_URL}/D.${currency}.CHF.SP00.A`;

      const response = await fetch(url, {
        headers: { 'Accept': 'application/vnd.sdmx.data+xml;version=2.1' }
      });

      if (!response.ok) continue;

      const xml = await response.text();

      // RAW save per currency
      const rawFile = path.join(
        RAW_DIR,
        `snb_${currency}_${timestamp}.xml`
      );

      fs.writeFileSync(rawFile, xml);

      // jednoduché parsování poslední <Obs>
      const matches = [...xml.matchAll(
        /<Obs>\s*<ObsDimension value="([^"]+)"\/>\s*<ObsValue value="([^"]+)"\/>\s*<\/Obs>/g
      )];

      if (!matches.length) continue;

      const last = matches[matches.length - 1];
      const date = last[1];
      const rate = parseFloat(last[2]);

      if (!latestDate) latestDate = date;

      rates[currency] = rate;
    }

    rates['CHF'] = 1;

    const sortedRates = Object.fromEntries(
      Object.entries(rates)
        .sort((a, b) => a[0].localeCompare(b[0]))
    );

    const normalized = {
      source: 'Swiss National Bank',
      base: 'CHF',
      date: latestDate,
      fetchedAt: new Date().toISOString(),
      rates: sortedRates
    };

    const normalizedFile = path.join(
      NORMALIZED_DIR,
      `snb_CHF_${timestamp}.json`
    );

    fs.writeFileSync(
      normalizedFile,
      JSON.stringify(normalized, null, 2)
    );

    console.log(`✅ SNB normalized saved (base CHF): ${normalizedFile}`);

    return {
      normalized: normalizedFile
    };

  } catch (error) {
    console.error('❌ Error processing SNB data:', error.message);
    throw error;
  }
}
