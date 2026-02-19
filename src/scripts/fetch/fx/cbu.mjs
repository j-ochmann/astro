import fs from 'node:fs';
import path from 'node:path';

const RAW_DIR = './data/raw/cbu';
const NORMALIZED_DIR = './data/normalized';
// API vrací všechny dostupné měny pro aktuální den
const URL = 'https://cbu.uz/en/arkhiv-kursov-valyut/json/';

export async function fetchCBU() {
  console.log('⏳ Fetching data from Central Bank of Uzbekistan...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`CBU fetch failed: ${response.status}`);

    const data = await response.json();
    
    // --- 1. SAVE RAW ---
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    fs.writeFileSync(path.join(RAW_DIR, `cbu_${timestamp}.json`), JSON.stringify(data, null, 2));

    // --- 2. NORMALIZE ---
    const rates = {};
    let latestDate = null;

    data.forEach(item => {
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
    const normalizedFile = path.join(NORMALIZED_DIR, `cbu_UZS_${timestamp}.json`);
    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✅ CBU sync complete. Fetched ${Object.keys(rates).length} currencies.`);
    return { normalized: normalizedFile };

  } catch (error) {
    console.error('❌ CBU error:', error.message);
    return null;
  }
}
