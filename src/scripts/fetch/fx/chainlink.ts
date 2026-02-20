import fs from 'node:fs';
import path from 'node:path';
import { createPublicClient, http, fallback, parseAbi } from 'viem';
import { mainnet } from 'viem/chains';
import { PATHS } from '../fetch.config.ts';
import { getAllCurrencies } from '../../../content/config/i18n.ts';

const RAW_DIR = path.join(PATHS.RAW, PATHS.CHAINLINK);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.CHAINLINK);

const AGGREGATOR_ABI = parseAbi([
  'function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function decimals() view returns (uint8)'
]);

interface Feed {
  name: string;
  proxyAddress?: string;
  contractAddress?: string;
}

async function getChainlinkFeeds(): Promise<Feed[]> {
  console.log('   🔍 Step 1: Downloading directory...');

  const url = 'https://reference-data-directory.vercel.app/feeds-mainnet.json';
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Directory fetch failed: ${response.status}`);
  }

  const allFeeds: Feed[] = await response.json();

  const currencies = await getAllCurrencies();
  console.log('   🌎 Available currencies from i18n.ts:', currencies.join(', '));

  const filtered = allFeeds.filter((feed: Feed) => {
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

// Přepočítá všechny měny na base USD
function convertToUSDBase(pairs: Record<string, number>): Record<string, number> {
  const rates: Record<string, number> = {};

  // nejdřív vezmeme všechny přímo USD páry
  for (const [symbol, price] of Object.entries(pairs)) {
    const [base, quote] = symbol.split('/');
    if (quote === 'USD') {
      rates[base] = price;
    } else if (base === 'USD') {
      rates[quote] = 1 / price;
    }
  }

  // pokusíme se přepočítat ostatní páry přes existující USD páry
  for (const [symbol, price] of Object.entries(pairs)) {
    const [base, quote] = symbol.split('/');
    if (rates[base] && !rates[quote]) {
      rates[quote] = rates[base] / price;
    } else if (rates[quote] && !rates[base]) {
      rates[base] = rates[quote] * price;
    }
  }

  return rates;
}

export async function fetchChainlink(): Promise<boolean | null> {
  console.log('⏳ Fetching [Web3] Chainlink (All Currency Pairs Mode)...');

  const client = createPublicClient({
    chain: mainnet,
    transport: fallback([
      http('https://ethereum.publicnode.com', { timeout: 10_000 }),
      http('https://rpc.ankr.com/eth', { timeout: 10_000 })
    ])
  });

  try {
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    const feeds = await getChainlinkFeeds();

    const BATCH_SIZE = 5;
    const pairs: Record<string, number> = {};

    for (let i = 0; i < feeds.length; i += BATCH_SIZE) {
      const currentBatch = feeds.slice(i, i + BATCH_SIZE);
      const batchId = Math.floor(i / BATCH_SIZE) + 1;

      console.log(`   📦 Batch ${batchId}/${Math.ceil(feeds.length / BATCH_SIZE)}`);

      const results = await Promise.all(
        currentBatch.map(async (feed: Feed) => {
          if (!feed.proxyAddress && !feed.contractAddress) {
            console.log(`      ⚠️  ${feed.name} skipped (no address)`);
            return null;
          }

          const address = (feed.proxyAddress || feed.contractAddress) as `0x${string}`;

          try {
            const [roundData, decimals] = await Promise.all([
              client.readContract({
                address,
                abi: AGGREGATOR_ABI,
                functionName: 'latestRoundData'
              }),
              client.readContract({
                address,
                abi: AGGREGATOR_ABI,
                functionName: 'decimals'
              })
            ]);

            const rawAnswer = roundData[1];

            if (rawAnswer <= 0n) {
              console.log(`      ⚠️  ${feed.name} invalid price`);
              return null;
            }

            const price = Number(rawAnswer) / Math.pow(10, Number(decimals));
            return { symbol: feed.name.replace(/\s+/g, ''), price };
          } catch (err: unknown) {
            const e = err as Error;
            console.log(`      ❌ ${feed.name} failed: ${e.message}`);
            return null;
          }
        })
      );

      for (const res of results) {
        if (res) pairs[res.symbol] = res.price;
      }
    }

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });

    // 1️⃣ Původní feed se všemi páry
    const allPairsFile = path.join(NORMALIZED_DIR, `fx_pairs_${timestamp}.json`);
    fs.writeFileSync(
      allPairsFile,
      JSON.stringify(
        { source: 'Chainlink (Currency Pairs)', fetchedAt: new Date().toISOString(), pairs },
        null,
        2
      )
    );

    // 2️⃣ Base USD feed
    const baseUSD = convertToUSDBase(pairs);
    const baseUSDFile = path.join(NORMALIZED_DIR, PATHS.CHAINLINK+`_${timestamp}.json`);
    fs.writeFileSync(
      baseUSDFile,
      JSON.stringify(
        { source: 'Chainlink (USD)', base: 'USD', date: new Date().toISOString().split('T')[0], fetchedAt: new Date().toISOString(), rates: baseUSD },
        null,
        2
      )
    );

    console.log(`✅ Chainlink complete. Total pairs stored: ${Object.keys(pairs).length}`);
    console.log(`✅ Base USD rates stored: ${Object.keys(baseUSD).length}`);

    return true;
  } catch (error: unknown) {
    const e = error as Error;
    console.error('❌ Chainlink fatal error:', e.message);
    return null;
  }
}
