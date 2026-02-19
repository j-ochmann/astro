import fs from 'node:fs';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import { PATHS } from '../fetch.config.mjs';

const RAW_DIR = path.join(PATHS.RAW, PATHS.JP);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.JP);

/**
 * Bank of Japan (BoJ) - Spot Exchange Rates
 * Toto je přímý link na XML generátor BoJ.
 */
const URL = 'https://www.boj.or.jp/en/statistics/stat_list/exrate/index.htm/exrate_all_d_en.xml';

export async function fetchJP() {
  console.log('⏳ Fetching [JP] Bank of Japan (Official XML)...');

  try {
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    
    // BoJ vyžaduje Referer a User-Agent, jinak hází 404
    const response = await fetch(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/xml, text/xml, */*',
        'Referer': 'https://www.boj.or.jp/en/statistics/stat_list/exrate/index.htm/'
      }
    });

    if (!response.ok) throw new Error(`BoJ API failed: ${response.status}`);

    const xmlText = await response.text();
    if (xmlText.trim().startsWith('<!DOCTYPE html')) throw new Error('BoJ returned HTML instead of XML.');

    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    fs.writeFileSync(path.join(RAW_DIR, PATHS.JP + `_${timestamp}.xml`), xmlText);

    const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });
    const jsonObj = parser.parse(xmlText);

    // BoJ RDF struktura
    const items = jsonObj.RDF?.item;
    if (!items) throw new Error('BoJ XML: No items found.');

    const rates = { "JPY": 1 };
    let latestDate = null;

    const itemsArray = Array.isArray(items) ? items : [items];
    
    const mapping = {
      'US Dollar': 'USD',
      'Euro': 'EUR',
      'Pound Sterling': 'GBP',
      'Swiss Franc': 'CHF',
      'Canadian Dollar': 'CAD',
      'Australian Dollar': 'AUD'
    };

    itemsArray.forEach(item => {
      // Titulek: "US Dollar/Yen (17:00 JST): 150.25"
      const title = item.title;
      const date = item.date || item.pubDate;

      if (title) {
        const match = title.match(/^(.*?)\/Yen.*:\s*([\d.]+)/);
        if (match) {
          const name = match[1].trim();
          const val = parseFloat(match[2]);
          const iso = mapping[name];

          if (iso && !isNaN(val)) {
            // 1 USD = 150 JPY -> 1 JPY = 1/150 USD
            rates[iso] = 1 / val;
            if (!latestDate && date) latestDate = date.split('T')[0];
          }
        }
      }
    });

    const normalized = {
      source: 'Bank of Japan',
      base: 'JPY',
      date: latestDate || new Date().toISOString().split('T')[0],
      fetchedAt: new Date().toISOString(),
      rates: Object.fromEntries(Object.entries(rates).sort((a, b) => a[0].localeCompare(b[0])))
    };

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    fs.writeFileSync(path.join(NORMALIZED_DIR, PATHS.JP + `_${timestamp}.json`), JSON.stringify(normalized, null, 2));

    console.log(`✅ BoJ sync complete.`);
    return true;

  } catch (error) {
    console.error('❌ BoJ error:', error.message);
    return null;
  }
}
