import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_FILE = './public/boc.json';
const URL = 'https://www.bankofcanada.ca/valet/observations/group/FX_RATES_DAILY/json';

/**
 * Fetches comprehensive exchange rate data from the Bank of Canada.
 * Covers many currencies not present in FED or ECB datasets.
 */
export async function fetchBOC() {
  console.log('⏳ Fetching data from Bank of Canada (Valet API)...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`BoC fetch failed: ${response.statusText}`);

    const data = await response.json();
    
    // The Bank of Canada provides a 'seriesDetail' object 
    // where we can find currency names and codes.
    const details = data.seriesDetail;
    const observations = data.observations;
    
    // Get the latest observation (last element in the array)
    const latestObs = observations[observations.length - 1];
    const date = latestObs.d; // Observation date (YYYY-MM-DD)

    // We need the USD/CAD rate to normalize other currencies to USD base
    // BoC code for USD to CAD is FXUSDCAD
    const usdToCad = parseFloat(latestObs.FXUSDCAD.v);

    const rates = [];

    // Iterate through all series in the observation
    for (const [key, value] of Object.entries(latestObs)) {
      if (key === 'd') continue; // Skip the date field

      const seriesInfo = details[key];
      // Extract currency code from "FX[CODE]CAD" format
      const currencyCode = key.replace('FX', '').replace('CAD', '');
      
      let rateToCad = parseFloat(value.v);
      
      // Calculate rate relative to USD:
      // If 1 USD = 1.35 CAD and 1 EUR = 1.45 CAD, 
      // then 1 USD = (1.35 / 1.45) EUR? No.
      // Most BoC rates are "CAD per 1 Unit".
      // We want "Unit per 1 USD".
      const ratePerUsd = usdToCad / rateToCad;

      rates.push({
        currency: seriesInfo.label.replace(' to Canadian dollar', ''),
        code: currencyCode,
        rate: parseFloat(ratePerUsd.toFixed(4)),
        originalRateCad: rateToCad
      });
    }

    const result = {
      source: 'Bank of Canada',
      url: 'https://www.bankofcanada.ca/valet/',
      base: 'USD',
      date: date,
      fetchedAt: new Date().toISOString(),
      rates: rates
    };

    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`✅ Bank of Canada data saved (${rates.length} currencies)`);

    return result;
  } catch (error) {
    console.error('❌ Error processing BoC data:', error.message);
    throw error;
  }
}
