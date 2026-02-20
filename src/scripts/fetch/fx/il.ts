import fs from 'node:fs';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import { PATHS } from '../fetch.config.ts';

const RAW_DIR = path.join(PATHS.RAW, PATHS.IL);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.IL);
/**
 * Bank of Israel - Public API (XML version)
 * Tento endpoint vrací ExchangeRatesResponseCollectioDTO
 */
const URL = 'https://boi.org.il/PublicApi/GetExchangeRates?asXml=true';

export async function fetchIL() {
  console.log('⏳ Fetching [IL] Bank of Israel (Public API)...');

  try {
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });

    const response = await fetch(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/xml'
      }
    });

    if (!response.ok) {
      throw new Error(`BOI fetch failed: ${response.status} ${response.statusText}`);
    }

    const xmlData = await response.text();

    // --- 1. SAVE RAW DATA ---
    const rawFile = path.join(RAW_DIR, PATHS.IL+`_${timestamp}.xml`);
    fs.writeFileSync(rawFile, xmlData);
    console.log(`✅ Raw saved: ${rawFile}`);

    // --- 2. PARSE XML ---
    const parser = new XMLParser({
      ignoreAttributes: false,
      trimValues: true
    });
    
    const jsonObj = parser.parse(xmlData);
    
    // Cesta v novém XML: ExchangeRatesResponseCollectioDTO -> ExchangeRates -> ExchangeRateResponseDTO
    const root = jsonObj.ExchangeRatesResponseCollectioDTO || jsonObj.ExchangeRatesResponseCollectionDTO;
    if (!root || !root.ExchangeRates || !root.ExchangeRates.ExchangeRateResponseDTO) {
      throw new Error('BOI XML structure is invalid or empty. Check the RAW file.');
    }

    const currencies = Array.isArray(root.ExchangeRates.ExchangeRateResponseDTO) 
      ? root.ExchangeRates.ExchangeRateResponseDTO 
      : [root.ExchangeRates.ExchangeRateResponseDTO];

    const rates: { [key: string]: number } = { "ILS": 1 };
    let latestDate: string | null = null;

    currencies.forEach((item: any) => {
      const code = item.Key; // V novém API je to 'Key'
      const rate = parseFloat(item.CurrentExchangeRate); // V novém API je to 'CurrentExchangeRate'
      const unit = parseInt(item.Unit) || 1;

      if (code && !isNaN(rate)) {
        // Normalizace na 1 jednotku (např. JPY má Unit 100)
        rates[code] = rate / unit;
        
        // Uložíme datum z prvního záznamu (formát 2026-02-18T13:23:03...)
        if (!latestDate && item.LastUpdate) {
          latestDate = item.LastUpdate.split('T')[0];
        }
      }
    });

    // --- 3. NORMALIZE ---
    const sortedRates = Object.fromEntries(
      Object.entries(rates).sort((a, b) => a[0].localeCompare(b[0]))
    );

    const normalized = {
      source: 'Bank of Israel',
      base: 'ILS',
      date: latestDate || new Date().toISOString().split('T')[0],
      fetchedAt: new Date().toISOString(),
      rates: sortedRates
    };

    const normalizedFile = path.join(NORMALIZED_DIR, PATHS.IL+`_${timestamp}.json`);
    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));
    
    console.log(`✅ Normalized saved (${Object.keys(sortedRates).length} currencies): ${normalizedFile}`);

    return { raw: rawFile, normalized: normalizedFile };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error processing BOI data:', errorMessage);
    return null;
  }
}
