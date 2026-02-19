import fs from 'node:fs';
import path from 'node:path';

const RAW_DIR = './data/raw/boj';
const NORMALIZED_DIR = './data/normalized';

// URL pro denní FX report (obsahuje hlavní asijské páry vůči JPY)
const URL = 'https://www.boj.or.jp/en/statistics/market/forex/f01.htm';

/**
 * Fetches Asian and global exchange rates from Bank of Japan.
 * Focuses on extracting as many Asian currency pairs as possible from the daily report.
 * * Logic:
 * 1. Saves raw HTML for audit.
 * 2. Extracts rates as quoted (e.g., USD/JPY, EUR/JPY) without base conversion.
 */
export async function fetchBOJ() {
  console.log('⏳ Fetching Asian currency data from Bank of Japan...');

  try {
    const response = await fetch(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0.0.0',
        'Accept': 'text/html,application/xhtml+xml'
      }
    });

    if (!response.ok) throw new Error(`BOJ fetch failed: ${response.status}`);

    const rawText = await response.text();

    // --- 1. SAVE RAW DATA ---
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });

    const rawFile = path.join(RAW_DIR, `boj_${timestamp}.html`);
    fs.writeFileSync(rawFile, rawText);
    console.log(`✅ Raw data saved: ${rawFile}`);

    // --- 2. EXTRACT RATES (NORMALIZED) ---
    const rates = {};

    /**
     * BoJ report contains specific pairs. We look for the most common ones 
     * appearing in their statistical tables.
     */
    const patterns = [
      { pair: 'USD/JPY', regex: /USD\/JPY[\s\S]*?(\d{2,3}\.\d{2})/ },
      { pair: 'EUR/JPY', regex: /EUR\/JPY[\s\S]*?(\d{2,3}\.\d{2})/ },
      { pair: 'EUR/USD', regex: /EUR\/USD[\s\S]*?(\d{1}\.\d{4})/ },
      { pair: 'GBP/JPY', regex: /GBP\/JPY[\s\S]*?(\d{2,3}\.\d{2})/ },
      { pair: 'AUD/JPY', regex: /AUD\/JPY[\s\S]*?(\d{2,3}\.\d{2})/ }
    ];

    patterns.forEach(p => {
      const match = rawText.match(p.regex);
      if (match) {
        rates[p.pair] = parseFloat(match[1]);
      }
    });

    // BoJ v HTML reportu často schovává asijské měny do tabulek "Others"
    // Hledáme patterny jako CNY/JPY, KRW/JPY atd.
    const asianPatterns = [
      { code: 'CNY', name: 'Chinese Yuan' },
      { code: 'KRW', name: 'Korean Won' },
      { code: 'THB', name: 'Thai Baht' },
      { code: 'IDR', name: 'Indonesian Rupiah' },
      { code: 'TWD', name: 'Taiwan Dollar' }
    ];

    asianPatterns.forEach(item => {
      // Hledáme kód měny následovaný číslem v tabulce
      const regex = new RegExp(`${item.code}[\\s\\S]*?(\\d+\\.\\d+)`, 'i');
      const match = rawText.match(regex);
      if (match) {
        rates[`${item.code}/JPY`] = parseFloat(match[1]);
      }
    });

    const normalized = {
      source: 'Bank of Japan',
      url: URL,
      base: 'AS_QUOTED',
      date: new Date().toISOString().split('T')[0],
      fetchedAt: new Date().toISOString(),
      rates: rates
    };

    if (!fs.existsSync(NORMALIZED_DIR)) fs.mkdirSync(NORMALIZED_DIR, { recursive: true });

    const normalizedFile = path.join(
      NORMALIZED_DIR,
      `boj_normalized_${timestamp}.json`
    );

    fs.writeFileSync(normalizedFile, JSON.stringify(normalized, null, 2));
    console.log(`✅ Normalized saved (${Object.keys(rates).length} pairs): ${normalizedFile}`);

    return { raw: rawFile, normalized: normalizedFile };

  } catch (error) {
    console.error('❌ Error processing BOJ data:', error.message);
    return null;
  }
}
