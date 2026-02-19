import { fetchBOC } from './fx/boc.mjs'; // Bank of Canada
import { fetchCBR } from './fx/cbr.mjs'; // Central Bank of Russia
import { fetchCBU } from './fx/cbu.mjs'; // Central Bank of Uzbekistan
import { fetchCNB } from './fx/cnb.mjs'; // Czech National Bank
import { fetchECB } from './fx/ecb.mjs'; // European Central Bank
import { fetchFED } from './fx/fed.mjs'; // Federal Reserve Bank of St. Louis (FRED)
import { fetchHKM } from './fx/hkm.mjs'; // Hong Kong Monetary Authority
import { fetchRBA } from './fx/rba.mjs'; // Reserve Bank of Australia
/*
Bank of England
Bank of Japan
International Monetary Fund
People's Bank of China
Sveriges Riksbank
Swiss National Bank
United Nations Treasury
*/

async function runAll() {
  console.log('🚀 Starting data synchronization...');
  const startTime = Date.now();

  try {
    const results = await Promise.allSettled([
      // fetchBOC(),
      // fetchCBR(),
      fetchCBU(),
      // fetchCNB(),
      // fetchECB(),
      // fetchFED(),
      // fetchHKM(),
      // fetchRBA(),
    ]);
    // Check results of individual fetches
    results.forEach((result, index) => {
      const names = ['BOC','CBR','CNB','ECB','FED','RBA'];
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
