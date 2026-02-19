import { fetchBOC } from './boc.mjs'; // Bank of Canada
//import { fetchBOE } from './boe.mjs'; // Bank of England
import { fetchBOJ } from './boj.mjs'; // Bank of Japan
import { fetchCBR } from './cbr.mjs'; // Central Bank of Russia
import { fetchCNB } from './cnb.mjs'; // Czech National Bank
import { fetchECB } from './ecb.mjs'; // European Central Bank
import { fetchFED } from './fed.mjs'; // Federal Reserve Bank of St. Louis (FRED)
//import { fetchIMF } from './imf.mjs'; // International Monetary Fund
import { fetchPBC } from './pbc.mjs'; // People's Bank of China
import { fetchRBA } from './rba.mjs'; // Reserve Bank of Australia
import { fetchSNB } from './snb.mjs'; // Swiss National Bank
import { fetchSRB } from './srb.mjs'; // Sveriges Riksbank 
//!!!import { fetchUNT } from './unt.mjs'; // United Nations Treasury 

async function runAll() {
  console.log('🚀 Starting data synchronization...');
  const startTime = Date.now();

  try {
    const results = await Promise.allSettled([
      fetchBOC(),
      fetchBOJ(),
      fetchCBR(),
      fetchCNB(),
      fetchECB(),
      fetchFED(),
      fetchPBC(),
      fetchRBA(),
      fetchSNB(),
      fetchSRB(),
    ]);
    // Check results of individual fetches
    results.forEach((result, index) => {
      const names = ['BOC','BOJ','CBR','CNB','ECB','FED','PBC','RBA','SNB','SRB',];
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
