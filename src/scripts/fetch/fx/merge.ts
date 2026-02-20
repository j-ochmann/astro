// scripts/merge-data.ts
import fs from 'fs';
import path from 'path';

// Konfigurace cest k tvým JSONům
const DATA_DIR = './src/data/fx'; 
const OUTPUT_FILE = './src/data/master-currencies.json';

// Příklad mapování Pyth ID (toto by bylo ideálně v samostatném konfigu)
const WEB3_CONFIG: Record<string, { pyth: string }> = {
  'CZK': { pyth: '0x15359a35368a41757f5c5b9680373df89953a99285090f48f4306cfc42b03623' },
  'USD': { pyth: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace' },
  'EUR': { pyth: '0xa995d00bb36a63cef7892e9ad36111507751a9fa8707ef21369d61685f6ce2cf' }
};

async function mergeData() {
  const master: Record<string, any> = {};

  // 1. Načtení všech FX souborů, které už tvoje fetchery stáhly
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json') || f.endsWith('.mjs'));
  
  for (const file of files) {
    const source = file.split('.')[0].toUpperCase(); // např. "CZ"
    const rawData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
    
    // Předpokládám, že tvá normalizovaná data vypadají takto: { rates: { "USD": 23.5, ... }, date: "..." }
    Object.entries(rawData.rates).forEach(([code, value]) => {
      if (!master[code]) master[code] = { code, sources: {}, web3: WEB3_CONFIG[code as keyof typeof WEB3_CONFIG] || {} };
      
      master[code].sources[source] = {
        rate: value,
        base: rawData.base,
        date: rawData.date
      };
    });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(master, null, 2));
  console.log(`✅ Master data vytvořena v ${OUTPUT_FILE}`);
}

mergeData();