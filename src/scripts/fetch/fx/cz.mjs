import fs from 'node:fs';
import path from 'node:path';

const URL = 'https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt';

const RAW_DIR = './data/raw/cz';
const NORMALIZED_DIR = './data/normalized';

export async function fetchCZ() {
  console.log('⏳ Fetching [CZ] Czech National Bank...');

  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`CNB fetch failed: ${response.statusText}`);
    }

    const text = await response.text();

    // --------------------------------------------------
    // 1️⃣ RAW SAVE
    // --------------------------------------------------

    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    const rawFile = path.join(RAW_DIR, `cnb_${timestamp}.txt`);

    if (!fs.existsSync(RAW_DIR)) {
      fs.mkdirSync(RAW_DIR, { recursive: true });
    }

    fs.writeFileSync(rawFile, text);
    console.log(`✅ Raw saved: ${rawFile}`);

    // --------------------------------------------------
    // 2️⃣ PARSE + NORMALIZE (NO CONVERSION!)
    // --------------------------------------------------

    const lines = text.split('\n');

    const rawDate = lines[0].split(' #')[0].trim(); // např. 18.02.2026
    const [day, month, year] = rawDate.split('.');
    const dateISO = `${year}-${month}-${day}`;

    const dataLines = lines
      .slice(2)
      .filter(line => line.trim() !== '');

    const tempRates = [];

    for (const line of dataLines) {
      const [country, currency, amount, code, rate] = line.split('|');

      const amountNum = parseInt(amount, 10);
      const rateNum = parseFloat(rate.replace(',', '.'));

      // CNB někdy uvádí např. 100 JPY = 15.23 CZK
      // Chceme 1 JPY = X CZK
      const normalizedRate = rateNum / amountNum;

      tempRates.push([code.trim(), parseFloat(normalizedRate.toFixed(6))]);
    }

    // abecedně seřadit podle kódu
    tempRates.sort((a, b) => a[0].localeCompare(b[0]));

    const rates = Object.fromEntries(tempRates);

    const normalized = {
      source: 'Czech National Bank',
      base: 'CZK',
      date: dateISO,
      fetchedAt: new Date().toISOString(),
      rates
    };

    if (!fs.existsSync(NORMALIZED_DIR)) {
      fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    }

    const normalizedFile = path.join(
      NORMALIZED_DIR,
      `cnb_CZK_${timestamp}.json`
    );

    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✅ Normalized saved (base CZK): ${normalizedFile}`);

    return {
      raw: rawFile,
      normalized: normalizedFile
    };

  } catch (error) {
    console.error('❌ Error processing CNB data:', error.message);
    throw error;
  }
}
