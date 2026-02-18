import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_FILE = './public/imf.json';
// IMF API endpoint for Representative Rates (SDR based, but contains USD/others)
const URL = 'http://dataservices.imf.org/REST/SeriesPS.svc/getSeries/Exchange%20Rates';

/**
 * Fetches exchange rates from the International Monetary Fund (IMF).
 * IMF data is highly authoritative for international settlements.
 */
export async function fetchIMF() {
  console.log('⏳ Fetching data from IMF (SDMX-JSON)...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`IMF fetch failed: ${response.statusText}`);

    const data = await response.json();
    
    // IMF structure is deeply nested: SeriesPS -> Series -> Obs
    const seriesList = data.SeriesPS?.Series;
    if (!seriesList || !Array.isArray(seriesList)) {
      throw new Error('Invalid IMF data structure received');
    }

    const rates = [];
    let lastDate = '';

    for (const s of seriesList) {
      // We are looking for currency-related series
      // Usually format is "Exchange Rate, Representative Rates, [Currency] per USD"
      const label = s['@Unit_Mult'] || s['@Title'] || '';
      const observations = s.Obs;
      
      if (!observations) continue;

      // Get the most recent observation (can be an object or the last item in array)
      const latest = Array.isArray(observations) ? observations[observations.length - 1] : observations;
      
      const rateValue = parseFloat(latest['@Obs_Value']);
      const obsDate = latest['@Time_Period'];

      if (!isNaN(rateValue)) {
        rates.push({
          description: s['@Title'],
          code: s['@SeriesCode'], // IMF internal codes
          rate: rateValue,
          date: obsDate
        });
        
        if (obsDate > lastDate) lastDate = obsDate;
      }
    }

    const result = {
      source: 'International Monetary Fund',
      url: 'https://www.imf.org/external/np/fin/data/param_rms_mth.aspx',
      base: 'USD/SDR (Mixed)',
      date: lastDate,
      fetchedAt: new Date().toISOString(),
      count: rates.length,
      rates: rates
    };

    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`✅ IMF data saved (${rates.length} series)`);

    return result;
  } catch (error) {
    // IMF API can be flaky, so we log warning but don't necessarily want to kill the build
    console.error('⚠️ IMF fetch skipped or failed:', error.message);
    return null; 
  }
}
