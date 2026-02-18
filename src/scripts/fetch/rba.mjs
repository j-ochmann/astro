import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_FILE = './public/rba.json';

export async function fetchRBA() {
  console.log('⏳ Fetching data from Reserve Bank of Australia...');
  try {
    const response = await fetch('https://www.rba.gov.au/rss/rss-cb-exchange-rates.xml');
    const xml = await response.text();
    
    // Agresivnější regex pro zachycení měny a hodnoty bez ohledu na namespaces
    const itemRegex = /<item[^>]*>[\s\S]*?<cb:targetCurrency>([^<]+)<\/cb:targetCurrency>[\s\S]*?<cb:value[^>]*>([\d.]+)<\/cb:value>([\s\S]*?<dc:date>([^<]+)<\/dc:date>)?/g;
    
    const rates = [];
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const datePart = match[4] ? match[4].split('T')[0] : new Date().toISOString().split('T')[0];
      rates.push({
        code: match[1],
        rate: parseFloat(match[2]),
        observedAt: datePart
      });
    }

    const result = { source: 'Reserve Bank of Australia', base: 'AUD', rates };
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`✅ RBA data saved (${rates.length} currencies)`);
    return result;
  } catch (error) {
    console.error('❌ RBA failure:', error.message);
    return null;
  }
}
