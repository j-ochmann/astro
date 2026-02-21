import fs from 'node:fs';
import path from 'node:path';
import { createPublicClient, http, fallback, parseAbi } from 'viem';
import { mainnet } from 'viem/chains';
import { PATHS } from '../fetch.config.ts';

const RAW_DIR = path.join(PATHS.RAW, PATHS.CHAINLINK_ALL);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.CHAINLINK_ALL);

const AGGREGATOR_ABI = parseAbi([
  'function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function decimals() view returns (uint8)'
]);

interface FeedMetadata {
  name: string;
  proxyAddress?: string;
  contractAddress?: string;
  assetName?: string;
  assetClass?: string;
  feedCategory?: string;
  feedType?: string;
  docs?: any;
  transmissionsAccount?: string;
  [key: string]: any; 
}

interface ChainlinkEnrichedFeed extends FeedMetadata {
  liveData?: {
    roundId: string;
    answer: string;
    updatedAt: string;
    decimals: number;
    realPrice: number;
  } | null;
}

async function getChainlinkFeeds(): Promise<FeedMetadata[]> {
  console.log('   🔍 Step 1: Downloading complete directory...');
  const url = 'https://reference-data-directory.vercel.app/feeds-mainnet.json';
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Directory fetch failed: ${response.status}`);

  const allFeeds: FeedMetadata[] = await response.json();
  
  // Odstraněn filtr na i18n měny - bereme vše, co má název a adresu
  const validFeeds = allFeeds.filter(f => f.name && (f.proxyAddress || f.contractAddress));

  console.log(`   ✅ Step 1: Found ${validFeeds.length} total feeds (Crypto, FX, Commodities, etc.).`);
  return validFeeds;
}

export async function fetchChainlinkAll(): Promise<boolean | null> {
  console.log('⏳ Fetching [Web3] Chainlink (Full Directory Mode)...');

  const client = createPublicClient({
    chain: mainnet,
    transport: fallback([
      http('https://ethereum.publicnode.com', { timeout: 15_000 }),
      http('https://rpc.ankr.com/eth', { timeout: 15_000 })
    ])
  });

  try {
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    const feeds = await getChainlinkFeeds();
    const enrichedFeeds: ChainlinkEnrichedFeed[] = [];

    // Zvětšená dávka pro rychlejší zpracování velkého množství feedů
    const BATCH_SIZE = 10;

    for (let i = 0; i < feeds.length; i += BATCH_SIZE) {
      const currentBatch = feeds.slice(i, i + BATCH_SIZE);
      console.log(`   📦 Progress: ${i + currentBatch.length}/${feeds.length}`);

      const batchResults = await Promise.all(
        currentBatch.map(async (feed) => {
          const address = (feed.proxyAddress || feed.contractAddress) as `0x${string}`;

          try {
            const [roundData, decimals] = await Promise.all([
              client.readContract({ address, abi: AGGREGATOR_ABI, functionName: 'latestRoundData' }),
              client.readContract({ address, abi: AGGREGATOR_ABI, functionName: 'decimals' })
            ]);

            const rawAnswer = roundData[1];
            // I u neplatné ceny (<=0) chceme metadata zachovat
            const realPrice = rawAnswer > 0n ? Number(rawAnswer) / Math.pow(10, Number(decimals)) : 0;

            return {
              ...feed,
              liveData: {
                roundId: roundData[0].toString(),
                answer: rawAnswer.toString(),
                updatedAt: new Date(Number(roundData[3]) * 1000).toISOString(),
                decimals: Number(decimals),
                realPrice
              }
            };
          } catch (err) {
            // Při chybě RPC (např. deprecated feedy) uložíme aspoň metadata bez live dat
            return { ...feed, liveData: null };
          }
        })
      );

      enrichedFeeds.push(...batchResults);
    }

    // --- ULOŽENÍ RAW DAT (Všechny Quotes + Metadata) ---
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(RAW_DIR, `chainlink_full_${timestamp}.json`),
      JSON.stringify(enrichedFeeds, null, 2)
    );

    // --- NORMALIZACE (Všechny Quotes s platnou cenou) ---
    const allQuotes: Record<string, number> = {};
    for (const feed of enrichedFeeds) {
      if (feed.liveData && feed.liveData.realPrice > 0) {
        const cleanName = feed.name.replace(/\s+/g, '');
        allQuotes[cleanName] = feed.liveData.realPrice;
      }
    }

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });

    const normalizedResult = {
      source: 'Chainlink (All Quotes)',
      fetchedAt: new Date().toISOString(),
      count: Object.keys(allQuotes).length,
      quotes: Object.fromEntries(
        Object.entries(allQuotes).sort((a, b) => a[0].localeCompare(b[0]))
      )
    };

    fs.writeFileSync(
      path.join(NORMALIZED_DIR, `chainlink_normalized_${timestamp}.json`),
      JSON.stringify(normalizedResult, null, 2)
    );

    console.log(`✅ Chainlink complete. Enriched total: ${enrichedFeeds.length}`);
    console.log(`✅ Normalized quotes: ${Object.keys(allQuotes).length}`);

    return true;
  } catch (error: any) {
    console.error('❌ Chainlink fatal error:', error.message);
    return null;
  }
}
