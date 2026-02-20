import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from '../fetch.config.js';

const RAW_DIR = path.join(PATHS.RAW, PATHS.GB);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.GB);

const URL = 'https://www.bankofengland.co.uk/boeapps/database/Rates.asp?Travel=NIxRSx&into=GBP';

const NAME_TO_ISO: Record<string, string> = {
  'Australian Dollar': 'AUD',
  'Bulgarian Lev': 'BGN',
  'Canadian Dollar': 'CAD',
  'Chinese Yuan': 'CNY',
  'Czech Koruna': 'CZK',
  'Danish Krone': 'DKK',
  'Euro': 'EUR',
  'Hong Kong Dollar': 'HKD',
  'Hungarian Forint': 'HUF',
  'Indian Rupee': 'INR',
  'Israeli Shekel': 'ILS',
  'Japanese Yen': 'JPY',
  'Malaysian ringgit': 'MYR',
  'New Zealand Dollar': 'NZD',
  'Norwegian Krone': 'NOK',
  'Polish Zloty': 'PLN',
  'Romanian Leu': 'RON',
  'Saudi Riyal': 'SAR',
  'Singapore Dollar': 'SGD',
  'South African Rand': 'ZAR',
  'South Korean Won': 'KRW',
  'Swedish Krona': 'SEK',
  'Swiss Franc': 'CHF',
  'Taiwan Dollar': 'TWD',
  'Thai Baht': 'THB',
  'Turkish Lira': 'TRY',
  'US $': 'USD',
  'US Dollar': 'USD'
};

export async function fetchGB() {
  console.log('⏳ Fetching [GB] Bank of England...');

  try {
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');

    const response = await fetch(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) throw new Error(`BoE fetch failed: ${response.status}`);

    const html = await response.text();

    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    fs.writeFileSync(path.join(RAW_DIR, PATHS.GB + `_${timestamp}.html`), html);

    const rates: Record<string, number> = { "GBP": 1 };
    
    // Regulární výraz pro hledání řádků v tabulce:
    // 1. Skupina: Název měny uvnitř <a> tagu
    // 2. Skupina: Hodnota v prvním <td align="right">
    const rowRegex = /<a [^>]*>(.*?)<\/a><\/td>\s*<td align="right">\s*([\d.]+)/g;
    
    let match;
    while ((match = rowRegex.exec(html)) !== null) {
      const name = match[1].trim();
      const rate = parseFloat(match[2]);
      const iso = NAME_TO_ISO[name];

      if (iso && !isNaN(rate)) {
        rates[iso] = rate;
      }
    }

    if (Object.keys(rates).length <= 1) {
      throw new Error('Scraper failed: No rates found in HTML. Structural change?');
    }

    const normalized = {
      source: 'Bank of England',
      base: 'GBP',
      date: new Date().toISOString().split('T')[0], // BoE HTML nemá datum snadno v meta, bereme dnešek
      fetchedAt: new Date().toISOString(),
      rates: Object.fromEntries(
        Object.entries(rates).sort((a, b) => a[0].localeCompare(b[0]))
      )
    };

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    const normalizedFile = path.join(NORMALIZED_DIR, PATHS.GB + `_${timestamp}.json`);
    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✨ BoE sync complete. Scraped ${Object.keys(rates).length - 1} currencies.`);
    return { raw: null, normalized: normalizedFile };

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ BoE Scraper error:', message);
    return null;
  }
}
