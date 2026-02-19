import { fetchAU } from './fx/au.mjs'; // Reserve Bank of Australia
import { fetchCA } from './fx/ca.mjs'; // Bank of Canada
import { fetchCZ } from './fx/cz.mjs'; // Czech National Bank
import { fetchEU } from './fx/eu.mjs'; // European Central Bank
import { fetchHK } from './fx/hk.mjs'; // Hong Kong Monetary Authority
import { fetchIL } from './fx/il.mjs'; // Bank of Israel
import { fetchRO } from './fx/ro.mjs'; // Central Bank of Romania 
import { fetchRU } from './fx/ru.mjs'; // Central Bank of Russia
import { fetchUZ } from './fx/uz.mjs'; // Central Bank of Uzbekistan
import { fetchUS } from './fx/us.mjs'; // Federal Reserve Bank of St. Louis (FRED)
import { fetchUNORE } from './fx/unore.mjs'; // United Nations Treasury 
/* invalid: CH,CN,GB,JP,SE,International Monetary Fund */
import { fetchCH } from './fx/ch.mjs'; // Swiss National Bank 
import { fetchCN } from './fx/cn.mjs'; // People's Bank of China
import { fetchGB } from './fx/gb.mjs'; // Bank of England
import { fetchJP } from './fx/jp.mjs'; // Bank of Japan
import { fetchSE } from './fx/se.mjs'; // Sveriges Riksbank
import { fetchIMF } from './fx/imf.mjs'; // International Monetary Fund
//import {  } from './fx/.mjs'; // 

async function runAll() {
  console.log('🚀 Starting data synchronization...');
  const startTime = Date.now();

  try {
    const results = await Promise.allSettled([
      // fetchAU(),fetchCA(),fetchCZ(),fetchEU(),fetchHK(),
      // fetchIL(),fetchRO(),fetchRU(),fetchUZ(),fetchUS(),
      // fetchUNORE(),
      // fetchNASDAQ(),
      fetchIMF()
      // fetchCH(),
      // fetchCN(),
      // fetchGB(),
      // fetchJP(),
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
