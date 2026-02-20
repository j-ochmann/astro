import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from '../fetch.config.ts';

const RAW_DIR = path.join(PATHS.RAW, PATHS.PYTH);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.PYTH);

interface PythMetadata {
  id: string;
  attributes: {
    display_symbol: string;
  };
}

interface PythPriceParsed {
  id: string;
  price: {
    price: string;
    expo: number;
  };
}

async function getAllFxMetadata(): Promise<PythMetadata[]> {
  const response = await fetch('https://hermes.pyth.network/v2/price_feeds?asset_type=fx');
  if (!response.ok) throw new Error(`Metadata fetch failed: ${response.status}`);
  return await response.json() as PythMetadata[];
}

export async function fetchPyth() {
  console.log('⏳ Fetching [Web3] Pyth Network (Active FX Pairs Only)...');

  try {
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    const metadata = await getAllFxMetadata();
    
    const idToSymbol: Record<string, string> = {};
    const ids = metadata.map(item => {
      const fullId = item.id.startsWith('0x') ? item.id : `0x${item.id}`;
      idToSymbol[fullId.toLowerCase()] = item.attributes.display_symbol;
      return fullId;
    });

    const BATCH_SIZE = 30;
    const allParsedData: PythPriceParsed[] = [];

    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      const batch = ids.slice(i, i + BATCH_SIZE);
      const query = batch.map(id => `ids[]=${id}`).join('&');
      // Přidáváme parsed=true pro získání čitelných cen
      const url = `https://hermes.pyth.network/v2/updates/price/latest?${query}&parsed=true`;

      const response = await fetch(url);
      if (!response.ok) continue;

      const json = await response.json();
      if (json.parsed) allParsedData.push(...(json.parsed as PythPriceParsed[]));
    }

    const pairs: Record<string, number> = {};
    for (const item of allParsedData) {
      const id = item.id.startsWith('0x') ? item.id.toLowerCase() : `0x${item.id.toLowerCase()}`;
      const symbol = idToSymbol[id];

      // KLÍČOVÁ ZMĚNA: Kontrola, zda cena existuje a není nula
      if (symbol && item.price && item.price.price) {
        const price = Number(item.price.price);
        const expo = Number(item.price.expo);
        const realPrice = price * Math.pow(10, expo);

        // Uložíme pouze pokud je cena kladné číslo
        if (realPrice > 0) {
          pairs[symbol] = realPrice;
        }
      }
    }

    if (Object.keys(pairs).length === 0) throw new Error('No active FX prices found.');

    const result = {
      source: 'Pyth Network (Hermes V2 All FX)',
      fetchedAt: new Date().toISOString(),
      pairs: Object.fromEntries(
        Object.entries(pairs).sort((a, b) => a[0].localeCompare(b[0]))
      )
    };

    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    fs.writeFileSync(path.join(RAW_DIR, `pyth_${timestamp}.json`), JSON.stringify(allParsedData, null, 2));

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    fs.writeFileSync(path.join(NORMALIZED_DIR, `pyth_${timestamp}.json`), JSON.stringify(result, null, 2));

    console.log(`✅ Pyth sync complete. Active FX pairs: ${Object.keys(pairs).length}`);
    return true;

  } catch (error) {
    console.error('❌ Pyth error:', error instanceof Error ? error.message : String(error));
    return null;
  }
}
