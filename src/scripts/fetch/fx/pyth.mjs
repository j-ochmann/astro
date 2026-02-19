import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from '../fetch.config.mjs';

const RAW_DIR = path.join(PATHS.RAW, PATHS.PYTH);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.PYTH);

const PRICE_IDS = {
  JPY: '0x098293994e63f53835e58129e9273c5240217ec827d09559e355743b1c67d710',
  GBP: '0x17743d540243415174092b772c5b966964a78401311029e2f97ec7509d375371',
  EUR: '0xa995d00bb36a63cef7899683d2bd365dc94537fa794739413ca2c76cd9709d75',
  CHF: '0x37852e9894380eb9716e9f90656a4cf882772584cf227311ed525f6174a72671',
  CAD: '0x7918a598c92a99d9be8535032a829f0e1371191ec4c49d870e2f5b5c92c813be',
  AUD: '0x34d57c23f2f041217e946e6a3928424a1347071f008f515d487f54c935492e85',
  SGD: '0x99e525a74e2d338944d1ed3f1738779c17f6920f7190013898c117b9b777a873',
  CNY: '0x008e310069f598685e135cf570220d3674d8253164a275218d84422e17e3073f',
  ILS: '0x956637e69f0697e889d1d1b54b1f480373e3a4799015e5ec08c90538f7a93466',
  CZK: '0x80352e855018654c6984e9c70014a9386b40529d77e4860d5c07b46d0458b387'
};

export async function fetchPyth() {
  console.log('⏳ Fetching [Web3] Pyth Network (Hermes REST)...');

  try {
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');

    const query = Object.values(PRICE_IDS)
      .map(id => `ids[]=${id}`)
      .join('&');

    const url = `https://hermes.pyth.network/v2/price_feeds/latest?${query}`;

    const response = await fetch(url, {
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Pyth API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Unexpected Pyth response format.');
    }

    if (!fs.existsSync(RAW_DIR))
      fs.mkdirSync(RAW_DIR, { recursive: true });

    const rawFile = path.join(RAW_DIR, `pyth_${timestamp}.json`);
    fs.writeFileSync(rawFile, JSON.stringify(data, null, 2));

    const rates = { USD: 1 };

    for (const item of data) {
      if (!item?.id || !item?.price) continue;

      const id = item.id.toLowerCase();

      const iso = Object.keys(PRICE_IDS).find(
        key => PRICE_IDS[key].toLowerCase() === id
      );

      if (!iso) continue;

      const price = Number(item.price.price);
      const expo = Number(item.price.expo);

      if (!Number.isFinite(price) || !Number.isFinite(expo)) continue;

      const realPrice = price * Math.pow(10, expo);

      if (!Number.isFinite(realPrice) || realPrice === 0) continue;

      /*
        Pyth FX feeds jsou většinou USD/XXX.
        To znamená:
        1 USD = X XXX
      */
      rates[iso] = realPrice;
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

    console.log(
      `✅ Pyth sync complete. Currencies: ${
        Object.keys(rates).length - 1
      }`
    );

    return { raw: rawFile, normalized: normalizedFile };

  } catch (error) {
    console.error('❌ Pyth error:', error.message);
    return null;
  }
}
