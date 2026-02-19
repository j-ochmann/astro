import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from '../fetch.config.mjs';

const RAW_DIR = path.join(PATHS.RAW, PATHS.NASDAQ);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.NASDAQ);

// Seznam měn, které chceš z Nasdaqu prioritně (vůči USD)
const CURRENCIES = ['JPY', 'SGD', 'CNY', 'CHF', 'GBP', 'ILS', 'CZK', 'EUR'];
const API_KEY = process.env.NASDAQ_API_KEY; // Předpokládám uložení v prostředí

/**
 * Nasdaq Data Link API
 * Stahuje denní spotové kurzy pro vybrané měny.
 */
export async function fetchNASDAQ() {
  if (!API_KEY) {
    console.error('❌ Nasdaq error: Missing NASDAQ_API_KEY in environment.');
    return null;
  }

  console.log('⏳ Fetching [NASDAQ] Data Link...');
  const timestamp = new Date().toISOString().replace(/[:]/g, '-');
  const rates = { "USD": 1 };
  let latestDate = null;

  try {
    // Nasdaq vyžaduje dotaz pro každou měnu zvlášť v datasetu CURRFX
    // Formát: CURRFX/ISOISO (např. CURRFX/USDJPY)
    for (const code of CURRENCIES) {
      if (code === 'USD') continue;

      const url = `https://data.nasdaq.com/api/v3/datasets/CURRFX/USD${code}.json?api_key=${API_KEY}&limit=1`;
      
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`⚠️  Nasdaq: Could not fetch ${code} (${response.status})`);
        continue;
      }

      const data = await response.json();
      const dataset = data.dataset;

      if (dataset && dataset.data.length > 0) {
        // dataset.data[0] vypadá jako ["2026-02-18", 150.25, 150.30, 150.10]
        // Index 1 je obvykle "Rate" (střed)
        const rate = parseFloat(dataset.data[0][1]);
        const date = dataset.data[0][0];

        if (!isNaN(rate)) {
          rates[code] = rate;
          if (!latestDate || date > latestDate) latestDate = date;
        }
      }
    }

    if (Object.keys(rates).length <= 1) {
      throw new Error('Nasdaq: No rates were successfully fetched.');
    }

    // --- SAVE RAW (pro poslední měnu jako ukázku) ---
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    fs.writeFileSync(path.join(RAW_DIR, `nasdaq_${timestamp}.json`), JSON.stringify(rates, null, 2));

    // --- NORMALIZE ---
    const normalized = {
      source: 'Nasdaq Data Link (CURRFX)',
      base: 'USD',
      date: latestDate,
      fetchedAt: new Date().toISOString(),
      rates: Object.fromEntries(Object.entries(rates).sort((a, b) => a[0].localeCompare(b[0])))
    };

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    fs.writeFileSync(path.join(NORMALIZED_DIR, `nasdaq_${timestamp}.json`), JSON.stringify(normalized, null, 2));

    console.log(`✨ Nasdaq sync complete. Currencies: ${Object.keys(rates).length - 1}`);
    return true;

  } catch (error) {
    console.error('❌ Nasdaq error:', error.message);
    return null;
  }
}
