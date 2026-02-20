import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from '../fetch.config.ts';

const RAW_DIR = path.join(PATHS.RAW, PATHS.UZ);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.UZ);
const URL = 'https://cbu.uz/en/arkhiv-kursov-valyut/json/';

export async function fetchUZ() {
  console.log('⏳ Fetching [UZ] Central Bank of Uzbekistan...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`CBU fetch failed: ${response.status}`);

    const data = await response.json();
    
    // --- 1. SAVE RAW ---
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    fs.writeFileSync(path.join(RAW_DIR, PATHS.UZ+`_${timestamp}.json`), JSON.stringify(data, null, 2));

    // --- 2. NORMALIZE ---
    const rates: Record<string, number> = {};
    let latestDate: string | null = null;

    data.forEach((item: any) => {
      // CBU vrací: "Rate" (kurz), "Ccy" (kód), "Date" (datum)
      const code = item.Ccy;
      const rate = parseFloat(item.Rate);
      
      if (code && !isNaN(rate)) {
        rates[code] = rate;
        if (!latestDate) latestDate = item.Date;
      }
    });

    // Základní měna je Uzbecký sum (UZS)
    rates['UZS'] = 1;

    const normalized = {
      source: 'Central Bank of Uzbekistan',
      base: 'UZS',
      date: latestDate,
      fetchedAt: new Date().toISOString(),
      rates: rates
    };

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    const normalizedFile = path.join(NORMALIZED_DIR, PATHS.UZ+`_${timestamp}.json`);
    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✅ CBU sync complete. Fetched ${Object.keys(rates).length} currencies.`);
    return { normalized: normalizedFile };

  } catch (error) {
    console.error('❌ CBU error:', error instanceof Error ? error.message : String(error));
    return null;
  }
}
