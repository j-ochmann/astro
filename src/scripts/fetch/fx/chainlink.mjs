import fs from 'node:fs';
import path from 'node:path';
import { createPublicClient, http, parseAbi } from 'viem';
import { mainnet } from 'viem/chains';
import { PATHS } from '../fetch.config.mjs';

const RAW_DIR = path.join(PATHS.RAW, PATHS.CHAINLINK);
const NORMALIZED_DIR = path.join(PATHS.NORMALIZED, PATHS.CHAINLINK);

// Minimální ABI pro získání dat z Chainlink Aggregatoru
const AGGREGATOR_ABI = parseAbi([
  'function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function decimals() view returns (uint8)'
]);

/**
 * Adresy Chainlink Price Feedů na Ethereum Mainnet
 */
const FEEDS = {
  'JPY': '0xBcE21216a695A68E27f54710C1C79247B6201633', // JPY / USD
  'GBP': '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419', // GBP / USD
  'EUR': '0xb49f677943BC039E98335899501C84491F059496', // EUR / USD
  'CHF': '0x4495B395163A301050e2763f73657A427B66D341', // CHF / USD
  'SGD': '0x1A091560965359b3D802c1f3A715694c92A95240', // SGD / USD
  'ILS': '0x221389D3416F6aE33A867160395D829B72F75069', // ILS / USD
  'CNY': '0xEF645D00E2660dE9771E2D4A5964894318357039', // CNY / USD
  'CZK': '0x323485E46244128f09E007f35A88D8b76D684E0B'  // CZK / USD
};

export async function fetchChainlink() {
  console.log('⏳ Fetching [Web3] Chainlink Data Feeds...');

  // Použijeme veřejný RPC uzel (Cloudflare nebo LlamaNodes)
  const client = createPublicClient({
    chain: mainnet,
    transport: http('https://cloudflare-eth.com')
  });

  try {
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    const rates = { "USD": 1 };
    const rawData = {};

    for (const [iso, address] of Object.entries(FEEDS)) {
      try {
        // Paralelní volání ceny a počtu desetin
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

        const price = Number(roundData[1]);
        const realPrice = price / Math.pow(10, decimals);

        // Chainlink FX feedy jsou většinou "Currency / USD"
        // Např. JPY/USD vrací 0.0066 -> chceme USD/JPY = 151
        if (realPrice > 0) {
          rates[iso] = 1 / realPrice;
        }

        rawData[iso] = { price: realPrice, updatedAt: Number(roundData[3]) };
      } catch (feedError) {
        console.warn(`⚠️  Chainlink: Feed for ${iso} failed.`);
      }
    }

    if (Object.keys(rates).length <= 1) throw new Error('No Chainlink feeds were reachable.');

    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
    fs.writeFileSync(path.join(RAW_DIR, `chainlink_${timestamp}.json`), JSON.stringify(rawData, null, 2));

    const normalized = {
      source: 'Chainlink Data Feeds (Ethereum)',
      base: 'USD',
      date: new Date().toISOString().split('T')[0],
      fetchedAt: new Date().toISOString(),
      rates: Object.fromEntries(Object.entries(rates).sort((a, b) => a[0].localeCompare(b[0])))
    };

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });
    fs.writeFileSync(path.join(NORMALIZED_DIR, `${PATHS.CHAINLINK}_${timestamp}.json`), JSON.stringify(normalized, null, 2));

    console.log(`✅ Chainlink sync complete. Currencies: ${Object.keys(rates).length - 1}`);
    return true;

  } catch (error) {
    console.error('❌ Chainlink error:', error.message);
    return null;
  }
}
