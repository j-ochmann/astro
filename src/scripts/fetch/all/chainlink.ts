import fs from 'node:fs';
import path from 'node:path';
import { createPublicClient, http, fallback, parseAbi } from 'viem';
import { mainnet } from 'viem/chains';
import { PATHS } from '../fetch.config.ts';
import { getAllCurrencies } from '../../../content/config/i18n.ts';

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
  feedCategory?: string;
  feedType?: string;
  [key: string]: any; // Zachování veškerých dalších polí z JSON adresáře
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
  console.log('   🔍 Step 1: Downloading directory...');
  const url = 'https://reference-data-directory.vercel.app/feeds-mainnet.json';
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Directory fetch failed: ${response.status}`);

  const allFeeds: FeedMetadata[] = await response.json();
  const currencies = await getAllCurrencies();

  const filtered = allFeeds.filter((feed: FeedMetadata) => {
    if (!feed.name) return false;
    const clean = feed.name.replace(/\s+/g, '').toUpperCase();
    if (clean.includes('(') || clean.includes('CALCULATED') || clean.includes('EXCHANGERATE')) return false;

    const parts = clean.split('/');
    if (parts.length !== 2) return false;

    const [base, quote] = parts;
    return currencies.includes(base) && currencies.includes(quote);
  });

  console.log(`   ✅ Step 1: Found ${filtered.length} currency pairs.`);
  return filtered;
}

function convertToUSDBase(pairs: Record<string, number>): Record<string, number> {
  const rates: Record<string, number> = {};
  for (const [symbol, price] of Object.entries(pairs)) {
    const [base, quote] = symbol.split('/');
    if (quote === 'USD') rates[base] = price;
    else if (base === 'USD') rates[quote] = 1 / price;
  }
  for (const [symbol, price] of Object.entries(pairs)) {
    const [base, quote] = symbol.split('/');
    if (rates[base] && !rates[quote]) rates[quote] = rates[base] / price;
    else if (rates[quote] && !rates[base]) rates[base] = rates[quote] * price;
  }
  return rates;
}

export async function fetchChainlink(): Promise<boolean | null> {
  console.log('⏳ Fetching [Web3] Chainlink (Enriched Mode)...');

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

    const BATCH_SIZE = 5;

    for (let i = 0; i < feeds.length; i += BATCH_SIZE) {
      const currentBatch = feeds.slice(i, i + BATCH_SIZE);
      console.log(`   📦 Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(feeds.length / BATCH_SIZE)}`);

      const batchResults = await Promise.all(
        currentBatch.map(async (feed) => {
          const address = (feed.proxyAddress || feed.contractAddress) as `0x${string}`;
          if (!address) return { ...feed, liveData: null };

          try {
            const [roundData, decimals] = await Promise.all([
              client.readContract({ address, abi: AGGREGATOR_ABI, functionName: 'latestRoundData' }),
              client.readContract({ address, abi: AGGREGATOR_ABI, functionName: 'decimals' })
            ]);

            const rawAnswer = roundData[1];
            if (rawAnswer <= 0n) return { ...feed, liveData: null };

            const realPrice = Number(rawAnswer) / Math.pow(10, Number(decimals));

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
            return { ...feed, liveData: null };
          }
        })
      );

      enrichedFeeds.push(...batchResults);
    }

    // --- ULOŽENÍ RAW DAT (Kompletní obohacená metadata) ---
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(RAW_DIR, `chainlink_full_${timestamp}.json`),
      JSON.stringify(enrichedFeeds, null, 2)
    );

    // --- NORMALIZACE ---
    const pairs: Record<string, number> = {};
    for (const feed of enrichedFeeds) {
      if (feed.liveData) {
        const cleanName = feed.name.replace(/\s+/g, '');
        pairs[cleanName] = feed.liveData.realPrice;
      }
    }

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });

    // 1️⃣ Všechny páry
    fs.writeFileSync(
      path.join(NORMALIZED_DIR, `fx_pairs_${timestamp}.json`),
      JSON.stringify({ source: 'Chainlink (Currency Pairs)', fetchedAt: new Date().toISOString(), pairs }, null, 2)
    );

    // 2️⃣ Base USD feed
    const baseUSD = convertToUSDBase(pairs);
    fs.writeFileSync(
      path.join(NORMALIZED_DIR, PATHS.CHAINLINK_ALL + `_${timestamp}.json`),
      JSON.stringify({ 
        source: 'Chainlink (USD)', 
        base: 'USD', 
        date: new Date().toISOString().split('T')[0], 
        fetchedAt: new Date().toISOString(), 
        rates: baseUSD 
      }, null, 2)
    );

    console.log(`✅ Chainlink complete. Enriched: ${enrichedFeeds.length}, USD Rates: ${Object.keys(baseUSD).length}`);
    return true;
  } catch (error: any) {
    console.error('❌ Chainlink fatal error:', error.message);
    return null;
  }
}
