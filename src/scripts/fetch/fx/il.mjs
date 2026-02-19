import fs from 'node:fs';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';

const RAW_DIR = './data/raw/il';
const NORMALIZED_DIR = './data/normalized';

/**
 * Bank of Israel API - XML Feed
 * URL provides exchange rates against the Israeli Shekel (ILS).
 */
const URL = 'https://www.boi.org.il/en/InterBankExchangeRates.xml';

export async function fetchIL() {
  console.log('⏳ Fetching [IL] Bank of Israel...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`BOI fetch failed: ${response.status}`);

    const xmlData = await response.text();
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');

    // --- 1. SAVE RAW DATA ---
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    const rawFile = path.join(RAW_DIR, `boi_${timestamp}.xml`);
    fs.writeFileSync(rawFile, xmlData);
    console.log(`✅ Raw saved: ${rawFile}`);

    // --- 2. PARSE XML ---
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });
    
    const jsonObj = parser.parse(xmlData);
    
    // Struktura BoI: <CURRENCIES><CURRENCY>...
    const currencies = jsonObj.CURRENCIES.CURRENCY;
    const lastUpdate = jsonObj.CURRENCIES.LAST_UPDATE; // Formát YYYY-MM-DD

    const rates = { "ILS": 1 };

    if (Array.isArray(currencies)) {
      currencies.forEach(item => {
        const code = item.CURRENCYCODE;
        const rate = parseFloat(item.RATE);
        const unit = parseInt(item.UNIT) || 1;

        if (code && !isNaN(rate)) {
          // Kurzy jsou uváděny jako X ILS za Y jednotek cizí měny
          // Normalizujeme na 1 jednotku
          rates[code] = rate / unit;
        }
      });
    }

    // --- 3. NORMALIZE ---
    const sortedRates = Object.fromEntries(
      Object.entries(rates).sort((a, b) => a[0].localeCompare(b[0]))
    );

    const normalized = {
      source: 'Bank of Israel',
      base: 'ILS',
      date: lastUpdate,
      fetchedAt: new Date().toISOString(),
      rates: sortedRates
    };

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    
    const normalizedFile = path.join(
      NORMALIZED_DIR,
      `boi_ILS_${timestamp}.json`
    );

    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));
    console.log(`✅ Normalized saved (base ILS): ${normalizedFile}`);

    return { raw: rawFile, normalized: normalizedFile };

  } catch (error) {
    console.error('❌ Error processing BOI data:', error.message);
    return null;
  }
}
