import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_FILE = './public/fed.json';
const FRED_API_KEY = process.env.FRED_API_KEY;

if (!FRED_API_KEY) {
  throw new Error('Missing FRED_API_KEY in environment variables');
}

// Comprehensive list of H.10 series exchange rates
const SERIES = [
  { id: 'DEXUSEU', name: 'Euro', code: 'EUR', inverse: true },
  { id: 'DEXCHUS', name: 'Chinese Yuan', code: 'CNY', inverse: false },
  { id: 'DEXJPUS', name: 'Japanese Yen', code: 'JPY', inverse: false },
  { id: 'DEXCAUS', name: 'Canadian Dollar', code: 'CAD', inverse: false },
  { id: 'DEXBZUS', name: 'Brazilian Real', code: 'BRL', inverse: false },
  { id: 'DEXUSUK', name: 'British Pound', code: 'GBP', inverse: true },
  { id: 'DEXSZUS', name: 'Swiss Franc', code: 'CHF', inverse: false },
  { id: 'DEXUSAL', name: 'Australian Dollar', code: 'AUD', inverse: true },
  { id: 'DEXUSNZ', name: 'New Zealand Dollar', code: 'NZD', inverse: true },
  { id: 'DEXHKUS', name: 'Hong Kong Dollar', code: 'HKD', inverse: false },
  { id: 'DEXMAUS', name: 'Malaysian Ringgit', code: 'MYR', inverse: false },
  { id: 'DEXMXUS', name: 'Mexican Peso', code: 'MXN', inverse: false },
  { id: 'DEXNOUS', name: 'Norwegian Krone', code: 'NOK', inverse: false },
  { id: 'DEXSIUS', name: 'Singapore Dollar', code: 'SGD', inverse: false },
  { id: 'DEXKOUS', name: 'South Korean Won', code: 'KRW', inverse: false },
  { id: 'DEXSDUS', name: 'Swedish Krona', code: 'SEK', inverse: false },
  { id: 'DEXTAUS', name: 'Taiwan Dollar', code: 'TWD', inverse: false },
  { id: 'DEXTHUS', name: 'Thai Baht', code: 'THB', inverse: false },
  { id: 'DEXINUS', name: 'Indian Rupee', code: 'INR', inverse: false },
  { id: 'DEXDNUS', name: 'Danish Krone', code: 'DKK', inverse: false },
  { id: 'DEXSFUS', name: 'South African Rand', code: 'ZAR', inverse: false }
];

export async function fetchFED() {
  console.log('⏳ Fetching maximized data from FRED...');

  try {
    const rates = [];
    let lastUpdate = '';

    // Fetching 2 observations per series to calculate daily change
    for (const item of SERIES) {
      const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${item.id}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=2`;
      
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`⚠️ Could not fetch ${item.id}, skipping.`);
        continue;
      }

      const data = await response.json();
      const currentObs = data.observations[0];
      const previousObs = data.observations[1];

      if (currentObs && currentObs.value !== '.') {
        let currentVal = parseFloat(currentObs.value);
        let previousVal = previousObs && previousObs.value !== '.' ? parseFloat(previousObs.value) : null;
        
        // Normalization (to Unit/USD)
        if (item.inverse && currentVal !== 0) {
          currentVal = 1 / currentVal;
          if (previousVal) previousVal = 1 / previousVal;
        }

        const change = previousVal ? ((currentVal - previousVal) / previousVal) * 100 : null;

        rates.push({
          currency: item.name,
          code: item.code,
          rate: parseFloat(currentVal.toFixed(4)),
          changePct: change ? parseFloat(change.toFixed(3)) : null,
          observedAt: currentObs.date
        });

        // Set the global date to the newest observation found
        if (!lastUpdate || currentObs.date > lastUpdate) {
          lastUpdate = currentObs.date;
        }
      }
    }

    const result = {
      source: 'Federal Reserve Economic Data (FRED)',
      attribution: 'Data provided by St. Louis Fed',
      base: 'USD',
      date: lastUpdate,
      fetchedAt: new Date().toISOString(),
      count: rates.length,
      rates: rates
    };

    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`✅ Maximized FED data saved (${rates.length} currencies)`);

    return result;
  } catch (error) {
    console.error('❌ Error processing FRED data:', error.message);
    throw error;
  }
}
