import { fetchAU } from './fx/au.ts'; // Reserve Bank of Australia
import { fetchCA } from './fx/ca.ts'; // Bank of Canada
import { fetchCH } from './fx/ch.ts'; // Swiss National Bank 
import { fetchCZ } from './fx/cz.ts'; // Czech National Bank
import { fetchEU } from './fx/eu.ts'; // European Central Bank
import { fetchGB } from './fx/gb.ts'; // Bank of England
import { fetchHK } from './fx/hk.ts'; // Hong Kong Monetary Authority
import { fetchIL } from './fx/il.ts'; // Bank of Israel
import { fetchRO } from './fx/ro.ts'; // Central Bank of Romania 
import { fetchRU } from './fx/ru.ts'; // Central Bank of Russia
import { fetchUZ } from './fx/uz.ts'; // Central Bank of Uzbekistan
import { fetchUS } from './fx/us.ts'; // Federal Reserve Bank of St. Louis (FRED)
import { fetchUNORE } from './fx/unore.ts'; // United Nations Treasury 
// import { fetchNASDAQ } from './fx/nasdaq.ts'; // NASDAQ 
import { fetchPyth } from './fx/pyth.ts'; // Pyth Network - Hermes API (Web3)
import { fetchPythAll } from './all/pyth.ts'; // Pyth Network - Hermes API (Web3)
import { fetchChainlink } from './fx/chainlink.ts'; // Chainlink (Web3)
import { fetchChainlinkAll } from './all/chainlink.ts'; // Chainlink (Web3)
/* invalid: CN,JP,SE,SG,International Monetary Fund */
// import { fetchCN } from './fx/cn.ts'; // People's Bank of China
// import { fetchJP } from './fx/jp.ts'; // Bank of Japan
// import { fetchSE } from './fx/se.ts'; // Sveriges Riksbank
// import { fetchSG } from './fx/sg.ts'; // Monetary Authority of Singapore
// import { fetchIMF } from './fx/imf.ts'; // International Monetary Fund
// import {  } from './fx/.ts'; // 

async function runAll() {
  console.log('🚀 Starting data synchronization...');
  const startTime = Date.now();

  try {
    const results = await Promise.allSettled([
      fetchAU(),fetchCA(),fetchCH(),fetchCZ(),fetchEU(),fetchGB(),
      fetchHK(),fetchIL(),fetchRO(),fetchRU(),fetchUZ(),fetchUS(),
      fetchUNORE(),
      // // fetchNASDAQ(),
      // fetchPyth(),
      fetchPythAll(),
      fetchChainlinkAll(),
      // fetchChainlink(),
      // fetchIMF(),fetchCN(),fetchJP(),fetchSG(),
      // fetchSE()
    ]);
    // Check results of individual fetches
    results.forEach((result, index) => {
      const names = ['AU','CA','CZ','EU','HK','IL','RO','RU','UZ','US'];
      if (result.status === 'rejected') {
        console.error(`❌ ${names[index]} task failed:`, result.reason?.message || result.reason);
      }
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✨ Synchronization finished in ${duration}s.`);
    // Check if at least one fetch succeeded to consider the run successful
    const anySuccess = results.some(r => r.status === 'fulfilled');
    if (!anySuccess) {
      console.error('💀 All fetch tasks failed.');
      process.exit(1);
    }

  } catch (error) {
    console.error('💀 Critical error during synchronization:', error);
    process.exit(1);
  }
}

runAll();
