/* Reserve Bank of Australia (RBA)
Důležité pro asijsko-pacifický region. */
import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_FILE = './public/rba.json';
// RBA Daily Exchange Rates (XML/SDMX)
const URL = 'https://www.rba.gov.au/rss/rss-cb-exchange-rates.xml';

/**
 * Fetches exchange rates from the Reserve Bank of Australia (RBA).
 * Base currency is AUD.
 */
export async function fetchRBA() {
  console.log('⏳ Fetching data from Reserve Bank of Australia...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`RBA fetch failed: ${response.statusText}`);

    const xml = await response.text();
    
    // RBA uses a standard RSS/CB structure
    // We look for <cb:targetCurrency>CODE</cb:targetCurrency> and <cb:value>RATE</cb:value>
    const rates = [];
    const itemRegex = /<item>[\s\S]*?<cb:targetCurrency>([^<]+)<\/cb:targetCurrency>[\s\S]*?<cb:value[^>]*>([^<]+)<\/cb:value>[\s\S]*?<dc:date>([^<]+)<\/dc:date>/g;
    
    let match;
    let lastUpdate = '';

    while ((match = itemRegex.exec(xml)) !== null) {
      const code = match[1];
      const rate = parseFloat(match[2]);
      const date = match[3].split('T')[0]; // Get YYYY-MM-DD

      rates.push({
        code: code,
        rate: rate,
        observedAt: date
      });

      if (!lastUpdate || date > lastUpdate) lastUpdate = date;
    }

    const result = {
      source: 'Reserve Bank of Australia',
      url: 'https://www.rba.gov.au/statistics/frequency/exchange-rates.html',
      base: 'AUD',
      date: lastUpdate,
      fetchedAt: new Date().toISOString(),
      count: rates.length,
      rates: rates
    };

    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`✅ RBA data saved (${rates.length} currencies)`);

    return result;
  } catch (error) {
    console.error('❌ Error processing RBA data:', error.message);
    throw error;
  }
}
