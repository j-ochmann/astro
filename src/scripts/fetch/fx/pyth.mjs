import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from '../fetch.config.mjs';

const RAW_DIR = path.join(PATHS.RAW, PATHS.PYTH);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.PYTH);

const PRICE_IDS = {
  JPY: '0xef2c98c804ba503c6a707e38be4dfbb16683775f195b091252bf24693042fd52',
  CAD: '0x3112b03a41c910ed446852aacf67118cb1bec67b2cd0b9a214c58cc0eaa2ecca',
};

export async function fetchPyth() {
  console.log('⏳ Fetching [Web3] Pyth Network (Hermes V2 Parsed)...');

  try {
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    
    // Pro V2 endpoint se používá ids[]=0x... a musí se přidat parsed=true
    const query = Object.values(PRICE_IDS)
      .map(id => `ids[]=${id}`)
      .join('&');

    const url = `https://hermes.pyth.network/v2/updates/price/latest?${query}&parsed=true`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Pyth V2 failed: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();

    // V2 struktura má data v poli 'parsed'
    if (!data.parsed || !Array.isArray(data.parsed)) {
      throw new Error('Unexpected Pyth V2 response format (missing parsed array).');
    }

    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    fs.writeFileSync(path.join(RAW_DIR, `pyth_${timestamp}.json`), JSON.stringify(data, null, 2));

    const rates = { USD: 1 };

    for (const item of data.parsed) {
      const id = item.id.startsWith('0x') ? item.id.toLowerCase() : `0x${item.id.toLowerCase()}`;
      const iso = Object.keys(PRICE_IDS).find(key => PRICE_IDS[key].toLowerCase() === id);

      if (iso && item.price) {
        const price = Number(item.price.price);
        const expo = Number(item.price.expo);
        const realPrice = price * Math.pow(10, expo);

        if (realPrice !== 0) {
          // Normalizace: Většina Pyth FX je "cena měny v USD"
          rates[iso] = 1 / realPrice;
        }
      }
    }

    const normalized = {
      source: 'Pyth Network (Hermes V2)',
      base: 'USD',
      date: new Date().toISOString().split('T')[0],
      fetchedAt: new Date().toISOString(),
      rates: Object.fromEntries(Object.entries(rates).sort((a, b) => a[0].localeCompare(b[0])))
    };

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    fs.writeFileSync(path.join(NORMALIZED_DIR, `pyth_${timestamp}.json`), JSON.stringify(normalized, null, 2));

    console.log(`✅ Pyth sync complete. Currencies: ${Object.keys(rates).length - 1}`);
    return true;
  } catch (error) {
    console.error('❌ Pyth error:', error.message);
    return null;
  }
}
