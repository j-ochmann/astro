import fs from 'node:fs';
import path from 'node:path';
// @ts-ignore - Pokud by TS hlásil problém s mjs importem v ts souboru
import { PATHS } from '../fetch.config.js';
import { XMLParser } from 'fast-xml-parser';

const RAW_DIR = path.join(PATHS.RAW, PATHS.UNORE);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.UNORE);
const URL = 'https://treasury.un.org/operationalrates/xsql2XML.php';

// Definice rozhraní pro XML data
interface UNRateItem {
  f_curr_code: string;
  rate: string;
  eff_date?: string;
  [key: string]: any;
}

interface UNDataSet {
  UN_OPERATIONAL_RATES_DATASET: {
    UN_OPERATIONAL_RATES: UNRateItem[];
  };
}

export async function fetchUNORE() {
  console.log('⏳ Fetching data from United Nations Treasury...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`UN fetch failed: ${response.status}`);

    const xmlText = await response.text();
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');

    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    const rawFile = path.join(RAW_DIR, `${PATHS.UNORE}_${timestamp}.xml`);
    fs.writeFileSync(rawFile, xmlText);

    const parser = new XMLParser({
      ignoreAttributes: true,
      trimValues: true,
      // Důležité: název elementu v XML je obvykle bez množného čísla pro jednotlivé řádky
      isArray: (name) => name === 'UN_OPERATIONAL_RATES'
    });

    const jsonObj = parser.parse(xmlText) as UNDataSet;
    
    const dataSet = jsonObj.UN_OPERATIONAL_RATES_DATASET;
    if (!dataSet || !dataSet.UN_OPERATIONAL_RATES) {
      throw new Error('UN Treasury: Invalid XML structure (missing dataset).');
    }

    const rates: Record<string, number> = { "USD": 1 };
    let latestDate: string | null = null;

    dataSet.UN_OPERATIONAL_RATES.forEach((item: UNRateItem) => {
      const code = item.f_curr_code;
      const rate = parseFloat(item.rate);
      
      if (code && !isNaN(rate)) {
        rates[code] = rate;
        
        if (!latestDate && item.eff_date) {
          try {
            // Formát data v UN bývá obvykle DD/MMM/YYYY, new Date() to může zvládnout, 
            // ale raději to balíme do try/catch
            latestDate = new Date(item.eff_date).toISOString().split('T')[0];
          } catch (e) {
            latestDate = item.eff_date;
          }
        }
      }
    });

    const normalized = {
      source: 'United Nations Treasury',
      base: 'USD',
      date: latestDate,
      fetchedAt: new Date().toISOString(),
      rates: Object.fromEntries(
        Object.entries(rates).sort((a, b) => a[0].localeCompare(b[0]))
      )
    };

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    const normalizedFile = path.join(NORMALIZED_DIR, `${PATHS.UNORE}_${timestamp}.json`);
    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✨ UN Treasury sync complete. Total currencies: ${Object.keys(rates).length}`);
    return { raw: rawFile, normalized: normalizedFile };

  } catch (error: any) {
    console.error('❌ UN Treasury error:', error.message);
    return null;
  }
}
