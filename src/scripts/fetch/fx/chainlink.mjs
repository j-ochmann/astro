import fs from 'node:fs';
import path from 'node:path';
import { createPublicClient, http, fallback, parseAbi } from 'viem';
import { mainnet } from 'viem/chains';
import { PATHS } from '../fetch.config.mjs';
import { getAllCurrencies } from '../i18n.ts';

const RAW_DIR = path.join(PATHS.RAW, PATHS.CHAINLINK);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.CHAINLINK);

const AGGREGATOR_ABI = parseAbi([
  'function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function decimals() view returns (uint8)'
]);

async function getChainlinkFeeds() {
  console.log('   🔍 Step 1: Downloading directory...');

  const url = 'https://reference-data-directory.vercel.app/feeds-mainnet.json';
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Directory fetch failed: ${response.status}`);
  }

  const allFeeds = await response.json();

  const currencies = await getAllCurrencies();
  console.log('   🌎 Available currencies from i18n.ts:', currencies.join(', '));

  const filtered = allFeeds.filter(feed => {
    if (!feed.name) return false;

    const clean = feed.name.replace(/\s+/g, '').toUpperCase();

    // Odstranit wrappery, calculated feedy, exchangeRate atd.
    if (clean.includes('(')) return false;
    if (clean.includes('CALCULATED')) return false;
    if (clean.includes('EXCHANGERATE')) return false;

    // Base a quote z feedu
    const parts = clean.split('/');
    if (parts.length !== 2) return false;

    const [base, quote] = parts;
    // Pouze měnové páry, které odpovídají ISO kódům z getAllCurrencies
    return currencies.includes(base) && currencies.includes(quote);
  });

  console.log(`   ✅ Step 1: Found ${filtered.length} currency pairs.`);
  return filtered;
}

export async function fetchChainlink() {
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
    const pairs = {};

    for (let i = 0; i < feeds.length; i += BATCH_SIZE) {
      const currentBatch = feeds.slice(i, i + BATCH_SIZE);
      const batchId = Math.floor(i / BATCH_SIZE) + 1;

      console.log(
        `   📦 Batch ${batchId}/${Math.ceil(feeds.length / BATCH_SIZE)}`
      );

      const results = await Promise.all(
        currentBatch.map(async (feed) => {
          const address = feed.proxyAddress || feed.contractAddress;

          if (!address) {
            console.log(`      ⚠️  ${feed.name} skipped (no address)`);
            return null;
          }

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

            const price =
              Number(rawAnswer) / Math.pow(10, Number(decimals));

            return {
              symbol: feed.name.replace(/\s+/g, ''),
              price
            };
          } catch (e) {
            console.log(
              `      ❌ ${feed.name} failed: ${e.shortMessage || e.message}`
            );
            return null;
          }
        })
      );

      for (const res of results) {
        if (res) pairs[res.symbol] = res.price;
      }
    }

    const result = {
      source: 'Chainlink (All Currency Pairs Mode)',
      fetchedAt: new Date().toISOString(),
      pairs: Object.fromEntries(
        Object.entries(pairs).sort(([a], [b]) => a.localeCompare(b))
      )
    };

    if (!fs.existsSync(NORMALIZED_DIR)) {
      fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    }

    const filePath = path.join(
      NORMALIZED_DIR,
      `chainlink_${timestamp}.json`
    );

    fs.writeFileSync(filePath, JSON.stringify(result, null, 2));

    console.log(
      `✅ Chainlink complete. Total pairs stored: ${Object.keys(pairs).length}`
    );

    return true;
  } catch (error) {
    console.error('❌ Chainlink fatal error:', error.message);
    return null;
  }
}
