import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_FILE = './public/unt.json';

export async function fetchUNT() {
  console.log('⏳ Fetching data from UN Treasury...');

  try {
    const url =
      'https://treasury.un.org/operationalrates/OperationalRates.php?Type=C&Download=CSV';

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`UN Server Error: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text') && !contentType.includes('csv')) {
      throw new Error('UN did not return CSV content.');
    }

    const text = await response.text();

    if (!text || text.length < 200) {
      throw new Error('UN Treasury returned empty CSV data.');
    }

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    // první řádek je header
    const header = lines[0].split(',');

    const rates = lines.slice(1)
      .map(line => line.split(','))
      .filter(cols => cols.length >= 4)
      .map(cols => ({
        country: cols[0]?.replace(/"/g, '').trim(),
        currency: cols[1]?.replace(/"/g, '').trim(),
        code: cols[2]?.replace(/"/g, '').trim(),
        rate: parseFloat(cols[3]?.replace(/"/g, '').trim())
      }))
      .filter(item =>
        item.code &&
        /^[A-Z]{3}$/.test(item.code) &&
        !isNaN(item.rate) &&
        item.rate > 0
      );

    if (rates.length === 0) {
      throw new Error('UN CSV parsed but no valid rates found.');
    }

    const result = {
      source: 'United Nations Treasury (Operational Rates)',
      base: 'USD',
      fetchedAt: new Date().toISOString(),
      count: rates.length,
      rates
    };

    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));

    console.log(`✅ UN Treasury data saved (${rates.length} currencies)`);

    return result;

  } catch (error) {
    console.error('❌ UN failure:', error.message);
    return null;
  }
}
