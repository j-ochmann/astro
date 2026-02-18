import fs from 'node:fs';
import path from 'node:path';

const URL = 'https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt';
const OUTPUT_FILE = './public/cnb.json';

/**
 * Fetches the current exchange rate list from CNB (Czech National Bank),
 * parses the custom text format, and saves it as a JSON file.
 */
export async function fetchCNB() {
  console.log('⏳ Fetching data from CNB...');
  
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`CNB fetch failed: ${response.statusText}`);
    }
    
    const text = await response.text();
    const lines = text.split('\n');

    // CNB format: 
    // Line 0: Date and sequence number (e.g., 18.02.2026 #35)
    // Line 1: Table headers (Country|Currency|Amount|Code|Rate)
    // Remaining lines: Data
    const dataLines = lines.slice(2).filter(line => line.trim() !== '');

    const rates = dataLines.map(line => {
      const [country, currency, amount, code, rate] = line.split('|');
      return {
        country: country.trim(),
        currency: currency.trim(),
        amount: parseInt(amount, 10),
        code: code.trim(),
        // Convert Czech decimal comma to dot for valid float parsing
        rate: parseFloat(rate.replace(',', '.'))
      };
    });

    const result = {
      source: 'Czech National Bank',
      url: 'https://www.cnb.cz',
      date: lines[0].split(' #')[0].trim(),
      rates: rates
    };

    // Ensure target directory exists
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`✅ CNB data successfully saved to: ${OUTPUT_FILE}`);
    
    return result;
  } catch (error) {
    console.error('❌ Error processing CNB data:', error.message);
    throw error;
  }
}
