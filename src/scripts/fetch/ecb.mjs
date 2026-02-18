import fs from 'node:fs';
import path from 'node:path';

const URL = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';
const OUTPUT_FILE = './public/ecb.json';

/**
 * Fetches the daily exchange rates from the European Central Bank (ECB).
 */
export async function fetchECB() {
  console.log('⏳ Fetching data from ECB...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`ECB fetch failed: ${response.statusText}`);

    const xml = await response.text();
    
    // Simple regex to extract data from ECB XML format: <Cube currency='USD' rate='1.0821'/>
    const regex = /<Cube currency='([^']+)' rate='([^']+)'\/>/g;
    const rates = [];
    let match;

    while ((match = regex.exec(xml)) !== null) {
      rates.push({
        currency: match[1],
        rate: parseFloat(match[2])
      });
    }

    // Extracting date: <Cube time='2026-02-18'>
    const dateMatch = xml.match(/<Cube time='([^']+)'/);
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

    const result = {
      source: 'European Central Bank',
      url: 'https://www.ecb.europa.eu',
      base: 'EUR',
      date: date,
      rates: rates
    };

    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`✅ ECB data saved to: ${OUTPUT_FILE}`);

    return result;
  } catch (error) {
    console.error('❌ Error processing ECB data:', error.message);
    throw error;
  }
}
