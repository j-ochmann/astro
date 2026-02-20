import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from '../fetch.config.ts';

const RAW_DIR = path.join(PATHS.RAW, PATHS.US);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.US);
const FRED_API_KEY = process.env.FRED_API_KEY;

if (!FRED_API_KEY) {
  throw new Error('Missing FRED_API_KEY in environment variables');
}

const SERIES = [
  { id: 'DEXUSEU', code: 'EUR', inverse: true },
  { id: 'DEXCHUS', code: 'CNY', inverse: false },
  { id: 'DEXJPUS', code: 'JPY', inverse: false },
  { id: 'DEXCAUS', code: 'CAD', inverse: false },
  { id: 'DEXBZUS', code: 'BRL', inverse: false },
  { id: 'DEXUSUK', code: 'GBP', inverse: true },
  { id: 'DEXSZUS', code: 'CHF', inverse: false },
  { id: 'DEXUSAL', code: 'AUD', inverse: true },
  { id: 'DEXUSNZ', code: 'NZD', inverse: true },
  { id: 'DEXHKUS', code: 'HKD', inverse: false },
  { id: 'DEXMAUS', code: 'MYR', inverse: false },
  { id: 'DEXMXUS', code: 'MXN', inverse: false },
  { id: 'DEXNOUS', code: 'NOK', inverse: false },
  { id: 'DEXSIUS', code: 'SGD', inverse: false },
  { id: 'DEXKOUS', code: 'KRW', inverse: false },
  { id: 'DEXSDUS', code: 'SEK', inverse: false },
  { id: 'DEXTAUS', code: 'TWD', inverse: false },
  { id: 'DEXTHUS', code: 'THB', inverse: false },
  { id: 'DEXINUS', code: 'INR', inverse: false },
  { id: 'DEXDNUS', code: 'DKK', inverse: false },
  { id: 'DEXSFUS', code: 'ZAR', inverse: false }
];

export async function fetchUS() {
  console.log('⏳ Fetching [US] Federal Reserve Bank of St. Louis (FRED)...');

  try {
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    const rawSnapshot: Record<string, unknown> = {};
    const tempRates = [];

    let globalDate = '';

    for (const item of SERIES) {
      const url =
        `https://api.stlouisfed.org/fred/series/observations` +
        `?series_id=${item.id}` +
        `&api_key=${FRED_API_KEY}` +
        `&file_type=json` +
        `&sort_order=desc` +
        `&limit=1`;

      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`⚠️ Skipping ${item.id}`);
        continue;
      }

      const data = await response.json();
      rawSnapshot[item.id] = data; // ukládáme celé raw JSON

      const obs = data.observations?.[0];
      if (!obs || obs.value === '.') continue;

      let value = parseFloat(obs.value);

      // pouze sjednocení směru → 1 USD = X měna
      if (item.inverse && value !== 0) {
        value = 1 / value;
      }

      tempRates.push([item.code, parseFloat(value.toFixed(6))]);

      if (!globalDate || obs.date > globalDate) {
        globalDate = obs.date;
      }
    }

    // --------------------------------------------------
    // 1️⃣ RAW SAVE
    // --------------------------------------------------

    if (!fs.existsSync(RAW_DIR)) {
      fs.mkdirSync(RAW_DIR, { recursive: true });
    }

    const rawFile = path.join(RAW_DIR, PATHS.US+`_${timestamp}.json`);
    fs.writeFileSync(rawFile, JSON.stringify(rawSnapshot, null, 2));
    console.log(`✅ Raw saved: ${rawFile}`);

    // --------------------------------------------------
    // 2️⃣ NORMALIZED (NO BUSINESS LOGIC)
    // --------------------------------------------------

    tempRates.push(['USD', 1]);

    tempRates.sort((a, b) => String(a[0]).localeCompare(String(b[0])));

    const rates = Object.fromEntries(tempRates);

    const normalized = {
      source: 'FRED (St. Louis Fed)',
      base: 'USD',
      date: globalDate,
      fetchedAt: new Date().toISOString(),
      rates
    };

    if (!fs.existsSync(NORMALIZED_DIR)) {
      fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    }

    const normalizedFile = path.join(
      NORMALIZED_DIR,
      PATHS.US+`_${timestamp}.json`
    );

    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✅ Normalized saved (base USD): ${normalizedFile}`);

    return {
      raw: rawFile,
      normalized: normalizedFile
    };

  } catch (error) {
    console.error('❌ Error processing FRED data:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}
