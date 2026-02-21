import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from '../fetch.config.ts';

const METADATA_DIR = path.join(PATHS.RAW, 'pyth_metadata');
const RAW_DIR = path.join(PATHS.RAW, PATHS.PYTH_ALL);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.PYTH_ALL);

interface PythMetadata {
  id: string;
  attributes: Record<string, any>;
  [key: string]: any; // Zachování všech ostatních polí z externího zdroje
}

interface PythPriceParsed {
  id: string;
  price: {
    price: string;
    conf: string;
    expo: number;
    publish_time: number;
  };
  ema_price: {
    price: string;
    conf: string;
    expo: number;
    publish_time: number;
  };
  metadata: {
    slot: number;
    proof_available_time: number;
    prev_publish_time: number;
  };
}

async function getAllMetadata(): Promise<PythMetadata[]> {
  const response = await fetch('https://hermes.pyth.network/v2/price_feeds');
  if (!response.ok) throw new Error(`Metadata fetch failed: ${response.status}`);
  return await response.json() as PythMetadata[];
}

export async function fetchPythAll() {
  console.log('⏳ Fetching [Web3] Pyth Network (Enriched Data)...');

  try {
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    const metadataList = await getAllMetadata();

    // Mapování pro rychlé vyhledávání cen podle ID
    const priceMap = new Map<string, PythPriceParsed>();
    
    // Normalizace ID pro metadata (zajištění 0x a lowercase)
    const ids = metadataList.map(m => {
      const fullId = m.id.startsWith('0x') ? m.id.toLowerCase() : `0x${m.id.toLowerCase()}`;
      return fullId;
    });

    const BATCH_SIZE = 30;
    
    // 1. FETCH CENOVÝCH DAT V DÁVKÁCH
    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      const batch = ids.slice(i, i + BATCH_SIZE);
      const query = batch.map(id => `ids[]=${id}`).join('&');
      const url = `https://hermes.pyth.network/v2/updates/price/latest?${query}&parsed=true`;

      const response = await fetch(url);
      if (!response.ok) continue;

      const json = await response.json();
      if (json.parsed) {
        json.parsed.forEach((item: PythPriceParsed) => {
          const normId = item.id.startsWith('0x') ? item.id.toLowerCase() : `0x${item.id.toLowerCase()}`;
          priceMap.set(normId, item);
        });
      }
    }

    // 2. PROPOJENÍ: Obohatíme metadata o cenová data
    const enrichedData = metadataList.map(meta => {
      const normId = meta.id.startsWith('0x') ? meta.id.toLowerCase() : `0x${meta.id.toLowerCase()}`;
      const priceData = priceMap.get(normId);

      return {
        ...meta, // Zachováme vše z price_feeds (attributes, id, atd.)
        live_data: priceData ? {
          price: priceData.price,
          ema_price: priceData.ema_price,
          update_metadata: priceData.metadata
        } : null
      };
    });

    // 3. PŘÍPRAVA NORMALIZOVANÝCH PÁRŮ (Zjednodušený výstup)
    const pairs: Record<string, number> = {};
    for (const item of enrichedData) {
      const symbol = item.attributes?.display_symbol;
      const p = item.live_data?.price;

      if (symbol && p && p.price) {
        const val = Number(p.price);
        const expo = Number(p.expo);
        const realPrice = val * Math.pow(10, expo);

        if (realPrice > 0) {
          pairs[symbol] = realPrice;
        }
      }
    }

    // --- ULOŽENÍ SOUBORŮ ---

    // RAW: Kompletní obohacená metadata
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(RAW_DIR, `pyth_full_${timestamp}.json`), 
      JSON.stringify(enrichedData, null, 2)
    );

    // NORMALIZED: Čistý seznam symbol: cena
    const result = {
      source: 'Pyth Network (Enriched)',
      fetchedAt: new Date().toISOString(),
      pairs: Object.fromEntries(
        Object.entries(pairs).sort((a, b) => a[0].localeCompare(b[0]))
      )
    };

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(NORMALIZED_DIR, `pyth_${timestamp}.json`), 
      JSON.stringify(result, null, 2)
    );

    console.log(`✅ Pyth sync complete. Total enriched feeds: ${enrichedData.length}`);
    return true;

  } catch (error) {
    console.error('❌ Pyth error:', error instanceof Error ? error.message : String(error));
    return null;
  }
}
