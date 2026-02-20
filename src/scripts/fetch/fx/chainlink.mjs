import fs from 'node:fs';
import path from 'node:path';
import { createPublicClient, http, fallback, parseAbi } from 'viem';
import { mainnet } from 'viem/chains';
import { PATHS } from '../fetch.config.mjs';

const RAW_DIR = path.join(PATHS.RAW, PATHS.CHAINLINK);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.CHAINLINK);

const AGGREGATOR_ABI = parseAbi([
  'function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function decimals() view returns (uint8)'
]);

async function getChainlinkFeeds() {
  console.log('   🔍 Step 1: Downloading directory and filtering FX...');

  const url = 'https://reference-data-directory.vercel.app/feeds-mainnet.json';
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Directory fetch failed: ${response.status}`);

  const allFeeds = await response.json();

  // Filtrujeme pouze čistý Forex
  const filtered = allFeeds.filter(feed => {
    // 1. Musí mít jméno
    if (!feed.name) return false;
    
    // 2. Chainlink explicitně označuje Forex v assetClass nebo feedType
    const isForex = feed.assetClass === 'Forex' || feed.feedType === 'Rate';
    
    // 3. Odfiltrujeme krypto "narušitele" a stablecoiny, které se občas do Forexu vloudí
    const name = feed.name.toUpperCase();
    const isCrypto = ['ETH', 'BTC', 'USDf', 'STETH', 'BUSD', 'DAI', 'USDC', 'USDT'].some(token => 
      name.startsWith(token)
    );

    // Chceme páry končící na / USD nebo obsahující měny, které nás zajímají
    return isForex && !isCrypto && name.includes('/');
  });

  console.log(`   ✅ Step 1: Found ${filtered.length} Forex pairs.`);
  return filtered;
}

export async function fetchChainlink() {
  console.log('⏳ Fetching [Web3] Chainlink (FX Optimized)...');

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
    const pairs = {};

    // Menší dávky pro stabilitu
    const BATCH_SIZE = 10;
    for (let i = 0; i < feeds.length; i += BATCH_SIZE) {
      const currentBatch = feeds.slice(i, i + BATCH_SIZE);
      
      const results = await Promise.all(
        currentBatch.map(async (feed) => {
          const address = feed.proxyAddress || feed.contractAddress;
          if (!address) return null;

          try {
            const [roundData, decimals] = await Promise.all([
              client.readContract({ address, abi: AGGREGATOR_ABI, functionName: 'latestRoundData' }),
              client.readContract({ address, abi: AGGREGATOR_ABI, functionName: 'decimals' })
            ]);

            const price = Number(roundData[1]) / Math.pow(10, Number(decimals));
            return {
              // Vyčistíme jméno (např. "EUR / USD" -> "EUR/USD")
              symbol: feed.name.replace(/\s+/g, ''),
              price
            };
          } catch (e) {
            return null;
          }
        })
      );

      for (const res of results) {
        if (res) pairs[res.symbol] = res.price;
      }
    }

    const result = {
      source: 'Chainlink (Forex)',
      fetchedAt: new Date().toISOString(),
      pairs: Object.fromEntries(
        Object.entries(pairs).sort((a, b) => a[0].localeCompare(b[0]))
      )
    };

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    
    fs.writeFileSync(
      path.join(NORMALIZED_DIR, `chainlink_${timestamp}.json`), 
      JSON.stringify(result, null, 2)
    );

    console.log(`✅ Chainlink complete. Stored ${Object.keys(pairs).length} FX pairs.`);
    return true;
  } catch (error) {
    console.error('❌ Chainlink fatal error:', error.message);
    return null;
  }
}
