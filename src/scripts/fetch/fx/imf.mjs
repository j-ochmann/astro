import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from '../fetch.config.mjs';
import { XMLParser } from 'fast-xml-parser';

const RAW_DIR = path.join(PATHS.RAW, PATHS.IMF);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.IMF);

/**
 * International Monetary Fund (IMF)
 * Poskytuje kurzy měn vůči SDR (XDR - Special Drawing Rights).
 * URL vrací data za posledních 5 dní v TSV/XML formátu.
 */
const URL = 'https://www.imf.org/external/np/fin/data/rms_five.aspx?tsvflag=Y';

export async function fetchIMF() {
  console.log('⏳ Fetching data from International Monetary Fund (IMF)...');

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`IMF fetch failed: ${response.status}`);

    const textData = await response.text();
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');

    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    // IMF vrací TSV (tab-separated values), proto přípona .tsv
    const rawFile = path.join(RAW_DIR, PATHS.IMF + `_${timestamp}.tsv`);
    fs.writeFileSync(rawFile, textData);

    // --- PARSOVÁNÍ IMF TSV FORMÁTU ---
    const lines = textData.split('\n');
    const rates = { "XDR": 1 };
    let latestDate = null;

    /**
     * IMF TSV je specifický: 
     * První řádky jsou metadata, pak následuje tabulka, 
     * kde měny jsou v prvním sloupci a data v dalších.
     */
    let parsingStarted = false;
    
    for (const line of lines) {
      const columns = line.split('\t').map(c => c.trim());
      
      // Hledáme řádek s daty (záhlaví tabulky)
      if (columns[0] === 'Currency') {
        latestDate = columns[1]; // První sloupec s datem (nejnovější)
        parsingStarted = true;
        continue;
      }

      if (parsingStarted && columns[0] && columns[1]) {
        // Pokud narazíme na prázdný řádek nebo patičku, končíme
        if (columns[0].toLowerCase().includes('memorandum')) break;

        const currencyName = columns[0];
        const rateValue = parseFloat(columns[1].replace(/,/g, ''));

        // Extrakce ISO kódu z názvu (např. "Euro" -> EUR, "U.S. Dollar" -> USD)
        // IMF TSV bohužel někdy neobsahuje ISO kódy, jen názvy.
        // Pro klíčové měny provedeme mapování:
        const mapping = {
          'Euro': 'EUR',
          'Japanese Yen': 'JPY',
          'U.K. Pound Sterling': 'GBP',
          'U.S. Dollar': 'USD',
          'Chinese Yuan': 'CNY',
          'Algerian Dinar': 'DZD',
          'Australian Dollar': 'AUD',
          'Botswana Pula': 'BWP',
          'Brazilian Real': 'BRL',
          'Brunei Dollar': 'BND',
          'Canadian Dollar': 'CAD',
          'Chilean Peso': 'CLP',
          'Colombian Peso': 'COP',
          'Czech Koruna': 'CZK',
          'Danish Krone': 'DKK',
          'Hungarian Forint': 'HUF',
          'Icelandic Krona': 'ISK',
          'Indian Rupee': 'INR',
          'Indonesian Rupiah': 'IDR',
          'Iranian Rial': 'IRR',
          'Israeli New Shekel': 'ILS',
          'Kazakhstani Tenge': 'KZT',
          'Korean Won': 'KRW',
          'Kuwaiti Dinar': 'KWD',
          'Libyan Dinar': 'LYD',
          'Malaysian Ringgit': 'MYR',
          'Mauritian Rupee': 'MUR',
          'Mexican Peso': 'MXN',
          'Moroccan Dirham': 'MAD',
          'New Zealand Dollar': 'NZD',
          'Norwegian Krone': 'NOK',
          'Omani Rial': 'OMR',
          'Pakistan Rupee': 'PKR',
          'Philippine Peso': 'PHP',
          'Polish Zloty': 'PLN',
          'Qatar Riyal': 'QAR',
          'Russian Ruble': 'RUB',
          'Saudi Arabian Riyal': 'SAR',
          'Singapore Dollar': 'SGD',
          'South African Rand': 'ZAR',
          'Sri Lanka Rupee': 'LKR',
          'Swedish Krona': 'SEK',
          'Swiss Franc': 'CHF',
          'Thai Baht': 'THB',
          'Trinidad & Tobago Dollar': 'TTD',
          'Tunisian Dinar': 'TND',
          'U.A.E. Dirham': 'AED',
          'Uruguayan Peso': 'UYU'
        };

        const code = mapping[currencyName];
        if (code && !isNaN(rateValue)) {
          rates[code] = rateValue;
        }
      }
    }

    if (Object.keys(rates).length <= 1) {
      throw new Error('IMF: No rates parsed. Check TSV structure.');
    }

    const normalized = {
      source: 'International Monetary Fund',
      base: 'XDR',
      date: latestDate ? new Date(latestDate).toISOString().split('T')[0] : null,
      fetchedAt: new Date().toISOString(),
      rates: Object.fromEntries(
        Object.entries(rates).sort((a, b) => a[0].localeCompare(b[0]))
      )
    };

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    const normalizedFile = path.join(NORMALIZED_DIR, PATHS.IMF + `_${timestamp}.json`);
    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✨ IMF sync complete. Total currencies: ${Object.keys(rates).length}`);
    return { raw: rawFile, normalized: normalizedFile };

  } catch (error) {
    console.error('❌ IMF error:', error.message);
    return null;
  }
}
