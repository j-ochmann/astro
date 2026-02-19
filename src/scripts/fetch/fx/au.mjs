import fs from 'node:fs';
import path from 'node:path';

const URL = 'https://www.rba.gov.au/rss/rss-cb-exchange-rates.xml';

const RAW_DIR = './data/raw/au';
const NORMALIZED_DIR = './data/normalized';

export async function fetchAU() {
  console.log('⏳ Fetching [AU] Reserve Bank of Australia...');

  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`RBA fetch failed: ${response.statusText}`);
    }

    const xml = await response.text();

    // --------------------------------------------------
    // 1️⃣ RAW SAVE
    // --------------------------------------------------

    const timestamp = new Date().toISOString().replace(/[:]/g, '-');

    if (!fs.existsSync(RAW_DIR)) {
      fs.mkdirSync(RAW_DIR, { recursive: true });
    }

    const rawFile = path.join(RAW_DIR, `au_${timestamp}.xml`);
    fs.writeFileSync(rawFile, xml);
    console.log(`✅ Raw saved: ${rawFile}`);

    // --------------------------------------------------
    // 2️⃣ PARSE + NORMALIZE (NO CONVERSION!)
    // --------------------------------------------------

    const itemRegex =
      /<item[^>]*>[\s\S]*?<cb:targetCurrency>([^<]+)<\/cb:targetCurrency>[\s\S]*?<cb:value[^>]*>([\d.]+)<\/cb:value>[\s\S]*?<dc:date>([^<]+)<\/dc:date>/g;

    const tempRates = [];
    let match;
    let globalDate = '';

    while ((match = itemRegex.exec(xml)) !== null) {
      const code = match[1].trim();
      const rate = parseFloat(match[2]);
      const date = match[3].split('T')[0];

      tempRates.push([code, parseFloat(rate.toFixed(6))]);

      if (!globalDate || date > globalDate) {
        globalDate = date;
      }
    }

    // RBA většinou nevrací AUD → přidáme
    tempRates.push(['AUD', 1]);

    // Abecední řazení
    tempRates.sort((a, b) => a[0].localeCompare(b[0]));

    const rates = Object.fromEntries(tempRates);

    const normalized = {
      source: 'Reserve Bank of Australia',
      base: 'AUD',
      date: globalDate || new Date().toISOString().split('T')[0],
      fetchedAt: new Date().toISOString(),
      rates
    };

    if (!fs.existsSync(NORMALIZED_DIR)) {
      fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    }

    const normalizedFile = path.join(
      NORMALIZED_DIR,
      `au_${timestamp}.json`
    );

    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✅ Normalized saved (base AUD): ${normalizedFile}`);

    return {
      raw: rawFile,
      normalized: normalizedFile
    };

  } catch (error) {
    console.error('❌ RBA failure:', error.message);
    throw error;
  }
}
