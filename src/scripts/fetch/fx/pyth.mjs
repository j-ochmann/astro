import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from '../fetch.config.mjs';

const RAW_DIR = path.join(PATHS.RAW, PATHS.PYTH);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.PYTH);

const PRICE_IDS = {
  JPY: '098293994e63f53835e58129e9273c5240217ec827d09559e355743b1c67d710',
  GBP: '17743d540243415174092b772c5b966964a78401311029e2f97ec7509d375371',
  EUR: 'a995d00bb36a63cef7899683d2bd365dc94537fa794739413ca2c76cd9709d75',
  CHF: '37852e9894380eb9716e9f90656a4cf882772584cf227311ed525f6174a72671',
  CAD: '7918a598c92a99d9be8535032a829f0e1371191ec4c49d870e2f5b5c92c813be',
  AUD: '34d57c23f2f041217e946e6a3928424a1347071f008f515d487f54c935492e85',
  SGD: '99e525a74e2d338944d1ed3f1738779c17f6920f7190013898c117b9b777a873',
  CNY: '008e310069f598685e135cf570220d3674d8253164a275218d84422e17e3073f',
  ILS: '956637e69f0697e889d1d1b54b1f480373e3a4799015e5ec08c90538f7a93466',
  CZK: '80352e855018654c6984e9c70014a9386b40529d77e4860d5c07b46d0458b387'
};

export async function fetchPyth() {
  console.log('⏳ Fetching [Web3] Pyth Network (Hermes REST API)...');

  try {
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');

    // Oprava endpointu na /api/latest_price_feeds dle tvého výpisu
    const query = Object.values(PRICE_IDS)
      .map(id => `ids[]=${id}`)
      .join('&');

    const url = `https://hermes.pyth.network/api/latest_price_feeds?${query}`;

    const response = await fetch(url, {
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Pyth API failed: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Unexpected Pyth response format: expected an array.');
    }

    if (!fs.existsSync(RAW_DIR))
      fs.mkdirSync(RAW_DIR, { recursive: true });

    const rawFile = path.join(RAW_DIR, `pyth_${timestamp}.json`);
    fs.writeFileSync(rawFile, JSON.stringify(data, null, 2));

    const rates = { USD: 1 };

    for (const item of data) {
      // ID v odpovědi může mít nebo nemít 0x prefix, raději ošetříme
      const id = item.id.startsWith('0x') ? item.id.toLowerCase() : `0x${item.id.toLowerCase()}`;

      const iso = Object.keys(PRICE_IDS).find(
        key => PRICE_IDS[key].toLowerCase() === id
      );

      if (!iso || !item.price) continue;

      const price = Number(item.price.price);
      const expo = Number(item.price.expo);

      if (!Number.isFinite(price) || !Number.isFinite(expo)) continue;

      const realPrice = price * Math.pow(10, expo);

      if (!Number.isFinite(realPrice) || realPrice === 0) continue;

      /*
        DŮLEŽITÉ: Pyth FX feedy jsou obvykle "Cena cizí měny v USD".
        Např. u JPY/USD dostaneš 0.0066. 
        My ale pro base USD chceme: 1 USD = X JPY (tedy 1 / 0.0066 = 151).
        Výjimkou jsou páry, kde je realPrice vysoká (jako CZK/USD nebo JPY/USD v jiném režimu), 
        ale Hermes standardně vrací cenu assetu v USD.
      */
      if (['EUR', 'GBP', 'AUD'].includes(iso)) {
        // Zde realPrice dává např. 1.08 (USD za 1 EUR), což sedí do naší logiky 1 USD = 0.92 EUR
        rates[iso] = 1 / realPrice;
      } else {
        // Pro JPY (0.006) chceme 150. Pokud Pyth vrací už 150 (USD/JPY), necháme to.
        rates[iso] = realPrice < 1 ? 1 / realPrice : realPrice;
      }
    }

    if (Object.keys(rates).length <= 1) {
      throw new Error('No FX rates parsed from Pyth.');
    }

    const normalized = {
      source: 'Pyth Network (Hermes)',
      base: 'USD',
      date: new Date().toISOString().split('T')[0],
      fetchedAt: new Date().toISOString(),
      rates: Object.fromEntries(
        Object.entries(rates).sort((a, b) =>
          a[0].localeCompare(b[0])
        )
      )
    };

    if (!fs.existsSync(NORMALIZED_DIR))
      fs.mkdirSync(NORMALIZED_DIR, { recursive: true });

    const normalizedFile = path.join(
      NORMALIZED_DIR,
      `pyth_${timestamp}.json`
    );

    fs.writeFileSync(
      normalizedFile,
      JSON.stringify(normalized, null, 2)
    );

    console.log(`✅ Pyth sync complete. Currencies: ${Object.keys(rates).length - 1}`);

    return { raw: rawFile, normalized: normalizedFile };

  } catch (error) {
    console.error('❌ Pyth error:', error.message);
    return null;
  }
}
