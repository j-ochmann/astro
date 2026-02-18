/*
UN Treasury (Organizace spojených národů)
OSN publikuje své operační kurzy (UNOP), které se používají pro veškeré jejich mise po světě. Je to nejautoritativnější zdroj pro "exotiku".

URL: https://treasury.un.org/operationalrates/OperationalRates.php

Formát: Nabízejí XML a CSV, které se snadno stahuje.
*/

import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_FILE = './public/unt.json';
const URL = 'https://treasury.un.org/operationalrates/OperationalRates.php?Type=C';

/**
 * Fetches the UN Operational Rates of Exchange.
 * This is the most authoritative source for "exotic" and less common currencies.
 */
export async function fetchUN() {
  console.log('⏳ Fetching data from UN Treasury...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`UN fetch failed: ${response.statusText}`);

    const text = await response.text();
    const lines = text.split('\n');

    // UN CSV format:
    // Country or Territory,Currency Name,Currency Code,Operational Rate,Effective Date
    // The first line is usually the header.
    const dataLines = lines.slice(1).filter(line => line.trim() !== '' && line.includes(','));

    const rates = dataLines.map(line => {
      // Simple CSV split (handling potential quotes if necessary)
      const parts = line.split(',').map(p => p.trim().replace(/"/g, ''));
      
      if (parts.length < 5) return null;

      const [country, currencyName, code, rate, effectiveDate] = parts;

      return {
        country,
        currency: currencyName,
        code: code,
        // UN rates are always "Units per 1 USD"
        rate: parseFloat(rate),
        effectiveDate: effectiveDate
      };
    }).filter(item => item !== null && !isNaN(item.rate));

    const result = {
      source: 'United Nations Treasury',
      url: 'https://treasury.un.org/operationalrates/',
      base: 'USD',
      fetchedAt: new Date().toISOString(),
      count: rates.length,
      rates: rates
    };

    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`✅ UN Treasury data saved (${rates.length} currencies)`);

    return result;
  } catch (error) {
    console.error('❌ Error processing UN data:', error.message);
    throw error;
  }
}
