import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from '../fetch.config.mjs';

const RAW_DIR = path.join(PATHS.RAW, PATHS.CN);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.CN);

/**
 * People's Bank of China (CFETS) - API v2
 * Tento endpoint je používán pro dynamické načítání kurzů Central Parity Rate.
 */
const URL = 'https://www.chinamoney.com.cn/ags/ms/cm-u-bk-fx/CpQuotationAmbY?lang=en';

export async function fetchCN() {
  console.log('⏳ Fetching [CN] People\'s Bank of China (Official API)...');

  try {
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');

    // CFETS API často vyžaduje POST s prázdným tělem nebo specifické hlavičky, aby nehodilo 404
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.chinamoney.com.cn/english/options/exchange-rate/central-parity-rate/',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) {
      throw new Error(`PBoC API failed: ${response.status} ${response.statusText}`);
    }

    const jsonData = await response.json();

    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    const rawFile = path.join(RAW_DIR, PATHS.CN + `_${timestamp}.json`);
    fs.writeFileSync(rawFile, JSON.stringify(jsonData, null, 2));

    // --- PARSE PBoC JSON ---
    // Struktura: { data: { datum: "...", records: [...] } }
    const records = jsonData.data?.records;
    if (!records || !Array.isArray(records)) {
      throw new Error('PBoC API: No records found in JSON response.');
    }

    const rates = { "CNY": 1 };
    let latestDate = jsonData.data?.date || null;

    records.forEach(item => {
      // V API jsou pole 'cpk' (USD/CNY) a 'price'
      const pair = item.cpk; 
      const rate = parseFloat(item.price);
      
      if (pair && !isNaN(rate)) {
        let [source, target] = pair.split('/');
        let unit = 1;

        // Ošetření 100JPY apod.
        const unitMatch = source.match(/^(\d+)([A-Z]+)$/);
        if (unitMatch) {
          unit = parseInt(unitMatch[1]);
          source = unitMatch[2];
        }

        // PBoC udává cenu cizí měny v CNY
        // Převod na: 1 CNY = X cizí měny
        rates[source] = unit / rate;
      }
    });

    // --- NORMALIZE ---
    const sortedRates = Object.fromEntries(
      Object.entries(rates).sort((a, b) => a[0].localeCompare(b[0]))
    );

    const normalized = {
      source: 'People\'s Bank of China (CFETS)',
      base: 'CNY',
      date: latestDate,
      fetchedAt: new Date().toISOString(),
      rates: sortedRates
    };

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    const normalizedFile = path.join(NORMALIZED_DIR, PATHS.CN + `_${timestamp}.json`);
    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));
    
    console.log(`✅ PBoC sync complete. Currencies: ${Object.keys(sortedRates).length - 1}`);

    return { raw: rawFile, normalized: normalizedFile };

  } catch (error) {
    console.error('❌ PBoC error:', error.message);
    return null;
  }
}
