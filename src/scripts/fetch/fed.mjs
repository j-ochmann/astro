import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_FILE = './public/fed.json';
const FRED_API_KEY = process.env.FRED_API_KEY;

if (!FRED_API_KEY) {
  throw new Error('Missing FRED_API_KEY in environment variables');
}

const SERIES = [
  { id: 'DEXUSEU', name: 'Euro', code: 'EUR', inverse: true },
  { id: 'DEXCHUS', name: 'Chinese Yuan', code: 'CNY', inverse: false },
  { id: 'DEXJPUS', name: 'Japanese Yen', code: 'JPY', inverse: false },
  { id: 'DEXCAUS', name: 'Canadian Dollar', code: 'CAD', inverse: false },
  { id: 'DEXBZUS', name: 'Brazilian Real', code: 'BRL', inverse: false }
];

export async function fetchFED() {
  console.log('⏳ Fetching data from FRED (Federal Reserve Economic Data)...');

  try {
    const rates = [];
    let lastDate = '';
    // Fetch each series individually as FRED's simple API works per series
    for (const item of SERIES) {
      const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${item.id}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=1`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`FRED fetch failed for ${item.id}`);

      const data = await response.json();
      const observation = data.observations[0];

      if (observation) {
        let val = parseFloat(observation.value);
        
        // Some rates are quoted as USD/Unit (like EUR), others as Unit/USD. 
        // We normalize them to Unit/USD if needed, or keep as is.
        if (item.inverse && val !== 0) {
          val = 1 / val;
        }

        rates.push({
          currency: item.name,
          code: item.code,
          rate: parseFloat(val.toFixed(4))
        });
        lastDate = observation.date;
      }
    }

    const result = {
      source: 'Federal Reserve (via FRED)',
      url: 'https://fred.stlouisfed.org',
      base: 'USD',
      date: lastDate,
      rates: rates
    };

    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`✅ FED data successfully saved to: ${OUTPUT_FILE}`);

    return result;
  } catch (error) {
    console.error('❌ Error processing FED data:', error.message);
    throw error;
  }
}
