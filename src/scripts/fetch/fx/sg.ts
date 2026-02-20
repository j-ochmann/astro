import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from '../fetch.config.ts';

const RAW_DIR = path.join(PATHS.RAW, PATHS.SG);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.SG);

// Toto je aktuální endpoint pro "Exchange Rates (Daily)"
const URL = 'https://eservices.mas.gov.sg/api/action/datastore/search.json?resource_id=95158934-ad92-4731-80a9-acc500bc6be7&limit=5&sort=end_of_day%20desc';

export async function fetchSG() {
  console.log('⏳ Fetching [SG] Monetary Authority of Singapore (via API)...');

  try {
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    
    // Klíčové: Musíme se tvářit jako prohlížeč z jejich domény
    const response = await fetch(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://eservices.mas.gov.sg/statistics/msb/ExchangeRates.aspx'
      }
    });

    if (!response.ok) throw new Error(`MAS API failed: ${response.status}`);

    const jsonData = await response.json();
    const records = jsonData.result?.records;
    if (!records || records.length === 0) throw new Error('No records found in MAS response.');

    const latest = records[0];
    const rates: { [key: string]: number } = { "SGD": 1 };
    
    // MAS vrací kurzy v divných formátech (někdy za 100 jednotek)
    const mapping = {
      'usd_sgd': { code: 'USD', unit: 1 },
      'gbp_sgd_100': { code: 'GBP', unit: 100 },
      'eur_sgd': { code: 'EUR', unit: 1 },
      'jpy_sgd_100': { code: 'JPY', unit: 100 },
      'cny_sgd_100': { code: 'CNY', unit: 100 }
    };

    Object.entries(mapping).forEach(([key, info]) => {
      if (latest[key]) {
        const val = parseFloat(latest[key]);
        // Převod: 1 SGD = (Jednotka / Hodnota_v_SGD)
        rates[info.code] = info.unit / val;
      }
    });

    const normalized = {
      source: 'Monetary Authority of Singapore',
      base: 'SGD',
      date: latest.end_of_day,
      fetchedAt: new Date().toISOString(),
      rates: Object.fromEntries(Object.entries(rates).sort((a, b) => a[0].localeCompare(b[0])))
    };

    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    fs.writeFileSync(path.join(RAW_DIR, PATHS.SG + `_${timestamp}.json`), JSON.stringify(jsonData, null, 2));

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    fs.writeFileSync(path.join(NORMALIZED_DIR, PATHS.SG + `_${timestamp}.json`), JSON.stringify(normalized, null, 2));

    console.log(`✅ MAS sync complete.`);
    return true;
  } catch (error) {
    console.error('❌ MAS error:', error instanceof Error ? error.message : String(error));
    return null;
  }
}
