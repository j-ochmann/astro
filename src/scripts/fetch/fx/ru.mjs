import fs from 'node:fs';
import path from 'node:path';

const RAW_DIR = './data/raw/ru';
const NORMALIZED_DIR = './data/normalized';
const URL = 'https://www.cbr.ru/scripts/XML_daily.asp';

export async function fetchRU() {
  console.log('⏳ Fetching [RU] Central Bank of Russia...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`CBR fetch failed: ${response.statusText}`);

    const rawText = await response.text();

    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });

    const rawFile = path.join(RAW_DIR, `ru_${timestamp}.xml`);
    fs.writeFileSync(rawFile, rawText);
    console.log(`✅ Raw saved: ${rawFile}`);

    // Extract date from XML attribute Date="DD.MM.YYYY"
    const dateMatch = rawText.match(/Date="([^"]+)"/);
    const date = dateMatch
      ? dateMatch[1].split('.').reverse().join('-')
      : new Date().toISOString().split('T')[0];

    const regex = /<CharCode>([^<]+)<\/CharCode>[\s\S]*?<Nominal>([^<]+)<\/Nominal>[\s\S]*?<Value>([^<]+)<\/Value>/g;

    const rates = { RUB: 1 };
    let match;

    while ((match = regex.exec(rawText)) !== null) {
      const currency = match[1];
      const nominal = parseFloat(match[2].replace(',', '.'));
      const value = parseFloat(match[3].replace(',', '.'));

      if (currency && nominal && value) {
        // CBR publishes value for nominal units (e.g. 10 CNY)
        rates[currency] = value / nominal;
      }
    }

    const sortedRates = Object.fromEntries(
      Object.entries(rates).sort((a, b) => a[0].localeCompare(b[0]))
    );

    const normalized = {
      source: 'Central Bank of Russia',
      base: 'RUB',
      date,
      fetchedAt: new Date().toISOString(),
      rates: sortedRates
    };

    if (!fs.existsSync(NORMALIZED_DIR))
      fs.mkdirSync(NORMALIZED_DIR, { recursive: true });

    const normalizedFile = path.join(
      NORMALIZED_DIR,
      `ru_${timestamp}.json`
    );

    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✅ Normalized saved (base RUB): ${normalizedFile}`);

    return { raw: rawFile, normalized: normalizedFile };

  } catch (error) {
    console.error('❌ Error processing CBR data:', error.message);
    throw error;
  }
}
