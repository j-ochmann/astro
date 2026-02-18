import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_FILE = './public/boe.json';

export async function fetchBOE() {
  console.log('⏳ Fetching data from Bank of England...');

  try {
    const SERIES = [
      'XUDLERS', 'XUDLUSS', 'XUDLJYS',
      'XUDLDKS', 'XUDLNOS', 'XUDLSES',
      'XUDLCHF', 'XUDLADS', 'XUDLCDS',
      'XUDLHKD', 'XUDLNZD', 'XUDLSGD',
      'XUDLZAR', 'XUDLBK7'
    ];

    const url =
      `https://www.bankofengland.co.uk/boeapps/database/Download.aspx?` +
      `SeriesCodes=${SERIES.join(',')}&CSVF=TN&UsingCodes=Y&VPD=Y&VFD=N`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`BoE rejected (Status ${response.status})`);
    }

    const csv = await response.text();

    if (!csv || csv.length < 200) {
      throw new Error('BoE returned empty CSV.');
    }

    const rows = csv.split('\n').map(r => r.trim()).filter(Boolean);

    // první řádek = header
    const header = rows[0].split(',');
    const lastRow = rows[rows.length - 1].split(',');

    const codeMap = {
      XUDLERS: 'EUR',
      XUDLUSS: 'USD',
      XUDLJYS: 'JPY',
      XUDLDKS: 'DKK',
      XUDLNOS: 'NOK',
      XUDLSES: 'SEK',
      XUDLCHF: 'CHF',
      XUDLADS: 'AUD',
      XUDLCDS: 'CAD',
      XUDLHKD: 'HKD',
      XUDLNZD: 'NZD',
      XUDLSGD: 'SGD',
      XUDLZAR: 'ZAR',
      XUDLBK7: 'CZK'
    };

    const rates = [];

    header.forEach((col, index) => {
      if (codeMap[col] && lastRow[index] && lastRow[index] !== '') {
        rates.push({
          code: codeMap[col],
          rate: parseFloat(lastRow[index])
        });
      }
    });

    const result = {
      source: 'Bank of England',
      base: 'GBP',
      date: lastRow[0], // první sloupec bývá datum
      fetchedAt: new Date().toISOString(),
      rates
    };

    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));

    console.log(`✅ Bank of England data saved (${rates.length} currencies)`);

    return result;

  } catch (error) {
    console.error('❌ BoE failure:', error.message);
    return null;
  }
}
