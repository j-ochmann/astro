/* Bank of England (BoE) */
import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_FILE = './public/boe.json';
// BoE daily exchange rates in XML format (Spot rates against GBP)
const URL = 'https://www.bankofengland.co.uk/boeapps/database/_exportdata.asp?xml=yes&DocumentType=All&SeriesCodes=XUDLERS,XUDLUSS,XUDLJYS,XUDLDKS,XUDLNOS,XUDLSES,XUDLCHF,XUDLADS,XUDLCDS,XUDLHKD,XUDLNZD,XUDLSGD,XUDLZAR,XUDLBK7,XUDLBK8,XUDLBK9&DateFrom=18/Feb/2026&DateTo=18/Feb/2026';
/**
 * Fetches exchange rates from the Bank of England (BoE).
 * Note: BoE rates are quoted against the British Pound (GBP).
 */
export async function fetchBoE() {
  console.log('⏳ Fetching data from Bank of England...');

  try {
    // We use a broader date range or dynamic URL in practice, but BoE often 
    // requires specific series codes. Here we target the most common ones.
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`BoE fetch failed: ${response.statusText}`);

    const xml = await response.text();
    
    // Regex to parse BoE XML format: <Series SeriesCode="XUDLUSS" ...> <Obs OBS_VALUE="1.2543" TIME="2026-02-18" />
    const seriesRegex = /<Series SeriesCode="([^"]+)"[^>]*>[\s\S]*?<Obs OBS_VALUE="([^"]+)" TIME="([^"]+)"/g;
    
    const rates = [];
    let match;

    // Mapping of BoE codes to Currency Codes
    const codeMap = {
      'XUDLERS': 'EUR',
      'XUDLUSS': 'USD',
      'XUDLJYS': 'JPY',
      'XUDLDKS': 'DKK',
      'XUDLNOS': 'NOK',
      'XUDLSES': 'SEK',
      'XUDLCHF': 'CHF',
      'XUDLADS': 'AUD',
      'XUDLCDS': 'CAD',
      'XUDLHKD': 'HKD',
      'XUDLNZD': 'NZD',
      'XUDLSGD': 'SGD',
      'XUDLZAR': 'ZAR',
      'XUDLBK7': 'CZK', // BoE also tracks Czech Koruna!
      'XUDLBK8': 'PLN',
      'XUDLBK9': 'HUF'
    };

    while ((match = seriesRegex.exec(xml)) !== null) {
      const boeCode = match[1];
      const rate = parseFloat(match[2]);
      const date = match[3];

      if (codeMap[boeCode]) {
        rates.push({
          code: codeMap[boeCode],
          rate: rate,
          observedAt: date
        });
      }
    }

    const result = {
      source: 'Bank of England',
      url: 'https://www.bankofengland.co.uk/statistics/exchange-rates',
      base: 'GBP',
      fetchedAt: new Date().toISOString(),
      rates: rates
    };

    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`✅ Bank of England data saved (${rates.length} currencies)`);

    return result;
  } catch (error) {
    console.error('❌ Error processing BoE data:', error.message);
    throw error;
  }
}
