import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from '../fetch.config.js';

const RAW_DIR = path.join(PATHS.RAW, PATHS.HK);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.HK);
const URL = 'https://api.hkma.gov.hk/public/market-data-and-statistics/monthly-statistical-bulletin/er-ir/er-eeri-daily';

export async function fetchHK() {
  console.log('⏳ Fetching [HK] Hong Kong Monetary Authority...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`HKMA fetch failed: ${response.status}`);

    const data = await response.json();
    
    // --- 1. SAVE RAW ---
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    fs.writeFileSync(path.join(RAW_DIR, PATHS.HK+`_${timestamp}.json`), JSON.stringify(data, null, 2));

    // --- 2. NORMALIZE ---
    if (!data.result || data.result.records.length === 0) {
      throw new Error('HKMA returned no records.');
    }

    const latest = data.result.records[0];
    const date = latest.end_of_day;
    
    // HKMA vrací kurzy jako 1 jednotka cizí měny = X HKD
    // Např. usd: 7.8212 (znamená 1 USD = 7.8212 HKD)
    const rawRates = {
      USD: latest.usd,
      GBP: latest.gbp,
      JPY: latest.jpy,
      CAD: latest.cad,
      AUD: latest.aud,
      SGD: latest.sgd,
      TWD: latest.twd,
      CHF: latest.chf,
      CNY: latest.cny,
      KRW: latest.krw,
      THB: latest.thb,
      MYR: latest.myr,
      EUR: latest.eur,
      PHP: latest.php, // Ta, kterou získáš navíc
      INR: latest.inr,
      IDR: latest.idr,
      ZAR: latest.zar
    };

    // Očistíme o null hodnoty (svátky)
    const cleanRates: Record<string, number> = {};
    Object.keys(rawRates).forEach(k => {
      if (rawRates[k as keyof typeof rawRates]) cleanRates[k] = rawRates[k as keyof typeof rawRates];
    });

    const normalized = {
      source: 'Hong Kong Monetary Authority',
      base: 'HKD',
      date: date,
      fetchedAt: new Date().toISOString(),
      rates: { ...cleanRates, HKD: 1 }
    };

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    const normalizedFile = path.join(NORMALIZED_DIR, PATHS.HK+`_${timestamp}.json`);
    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✅ HKMA sync complete. Added ${Object.keys(cleanRates).length} currencies (Base: HKD).`);
    return { normalized: normalizedFile };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ HKMA error:', errorMessage);
    return null;
  }
}
