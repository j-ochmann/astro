import { fetchCNB } from './cnb.mjs';
import { fetchECB } from './ecb.mjs';
import { fetchFED } from './fed.mjs';

/**
 * Orchestrates the fetching of all exchange rate data.
 * Runs all fetchers in parallel for better performance.
 */
async function runAll() {
  console.log('🚀 Starting data synchronization...');
  const startTime = Date.now();

  try {
    const results = await Promise.allSettled([
      fetchCNB(),
      fetchECB(),
      fetchFED()
    ]);

    // Check results of individual fetches
    results.forEach((result, index) => {
      const names = ['CNB', 'ECB', 'FED'];
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
