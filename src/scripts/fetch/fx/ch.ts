import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from '../fetch.config.ts';

const RAW_DIR = path.join(PATHS.RAW, PATHS.CH);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.CH);

/**
 * Swiss National Bank (SNB) - Cube 'devkum'
 * Obsahuje měsíční průměry kurzů včetně CNY a XDR.
 * https://data.snb.ch/api/cube/devkum/data/json/en?selection=D0(0),D1(0)&fromDate=2026-01&toDate=2026-02
 */
const URL = 'https://data.snb.ch/api/cube/devkum/data/json/en';

export async function fetchCH() {
  console.log('⏳ Fetching [CH] Swiss National Bank (devkum cube)...');

  try {
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');

    const response = await fetch(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`SNB API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    const rawFile = path.join(RAW_DIR, PATHS.CH + `_${timestamp}.json`);
    fs.writeFileSync(rawFile, JSON.stringify(data, null, 2));

    const rates: Record<string, number> = { "CHF": 1 };
    let latestDate: string | null = null;

    if (!data.timeseries || !Array.isArray(data.timeseries)) {
      throw new Error('SNB API: Unexpected JSON structure (missing timeseries).');
    }

    data.timeseries.forEach((serie: any) => {
      // Extrakce kódu měny a jednotek z "dimItem" (např. "Europe - EUR 1" nebo "Asia - CNY 100")
      const dimItem = serie.header?.[1]?.dimItem;
      const lastValueObj = serie.values?.[serie.values.length - 1]; // Bereme nejnovější dostupný měsíc

      if (dimItem && lastValueObj) {
        // Regulární výraz pro získání kódu a jednotek (hledá např. "EUR 1" nebo "CNY 100")
        const match = dimItem.match(/([A-Z]{3})\s+(\d+)/);
        
        if (match) {
          const code = match[1];
          const unit = parseInt(match[2]);
          const value = parseFloat(lastValueObj.value);

          if (!isNaN(value) && value !== 0) {
            // SNB udává: kolik CHF za 'unit' jednotek cizí měny.
            // My chceme: kolik cizí měny za 1 CHF.
            // Vzorec: rates[code] = unit / value
            rates[code] = unit / value;
            
            if (!latestDate || lastValueObj.date > latestDate) {
              latestDate = lastValueObj.date;
            }
          }
        }
      }
    });

    const normalized = {
      source: 'Swiss National Bank (Monthly Average)',
      base: 'CHF',
      date: latestDate,
      fetchedAt: new Date().toISOString(),
      rates: Object.fromEntries(
        Object.entries(rates).sort((a, b) => a[0].localeCompare(b[0]))
      )
    };

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    const normalizedFile = path.join(NORMALIZED_DIR, PATHS.CH + `_${timestamp}.json`);
    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));

    console.log(`✨ SNB sync complete. Currencies: ${Object.keys(rates).length - 1} (including CNY and XDR)`);
    return { raw: rawFile, normalized: normalizedFile };

  } catch (error) {
    console.error('❌ SNB error:', error instanceof Error ? error.message : String(error));
    return null;
  }
}
