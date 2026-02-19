import fs from 'node:fs';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser'; // Předpokládám, že máš nebo doinstaluješ
import { PATHS } from '../fetch.config.mjs';

const RAW_DIR = path.join(PATHS.RAW, PATHS.RO);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.RO);
const URL = 'https://www.bnr.ro/nbrfxrates.xml';

export async function fetchRO() {
  console.log('⏳ Fetching [RO] National Bank of Romania...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`BNR fetch failed: ${response.status}`);

    const xmlData = await response.text();
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    fs.writeFileSync(path.join(RAW_DIR, PATHS.RO+`_${timestamp}.xml`), xmlData);

    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
    const jsonObj = parser.parse(xmlData);
    
    const rates = { "RON": 1 };
    const cube = jsonObj.DataSet.Body.Cube;
    const date = cube['@_date'];
    const rateEntries = cube.Rate;

    rateEntries.forEach(item => {
      const currency = item['@_currency'];
      const value = parseFloat(item['#text']);
      const multiplier = item['@_multiplier'] ? parseInt(item['@_multiplier']) : 1;
      
      // Přepočet na jednotkovou hodnotu (některé měny jako JPY mají multiplier 100)
      rates[currency] = value / multiplier;
    });

    const normalized = {
      source: 'National Bank of Romania',
      base: 'RON',
      date: date,
      fetchedAt: new Date().toISOString(),
      rates: Object.fromEntries(Object.entries(rates).sort((a, b) => a[0].localeCompare(b[0])))
    };

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    const normalizedFile = path.join(NORMALIZED_DIR, PATHS.RO+`_${timestamp}.json`);
    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✅ BNR sync complete. Fetched ${Object.keys(rates).length} currencies.`);
    return { normalized: normalizedFile };

  } catch (error) {
    console.error('❌ BNR error:', error.message);
    return null;
  }
}
