// scripts/merge-data.ts
import fs from 'fs';
import path from 'path';
import { PATHS } from '../fetch.config.ts';

const DATA_DIR = PATHS.NORMALIZED; 
const OUTPUT_FILE = path.join(PATHS.NORMALIZED, 'merged-currencies.json');

// Rozšířené mapování Web3 (zde můžeš doplňovat další kódy)
const WEB3_CONFIG: Record<string, { pyth: string }> = {
  'CZK': { pyth: '0x15359a35368a41757f5c5b9680373df89953a99285090f48f4306cfc42b03623' },
  'USD': { pyth: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace' },
  'EUR': { pyth: '0xa995d00bb36a63cef7892e9ad36111507751a9fa8707ef21369d61685f6ce2cf' },
  'BTC': { pyth: '0xe62df6c8b4a85fe1a67d0f2464ed116228197a69f22fd0daccd500fd7855a61a' }
};

/**
 * Funkce pro rekurzivní získání všech JSON souborů v adresáři
 */
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (file.endsWith('.json') && file !== 'merged-currencies.json') {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

async function mergeData() {
  const master: Record<string, any> = {};

  if (!fs.existsSync(DATA_DIR)) {
    console.error(`❌ Adresář ${DATA_DIR} neexistuje.`);
    return;
  }

  const allJsonFiles = getAllFiles(DATA_DIR);
  console.log(`🔍 Nalezeno ${allJsonFiles.length} souborů k merge.`);

  for (const filePath of allJsonFiles) {
    try {
      const fileName = path.basename(filePath);
      const source = fileName.split('.')[0].toUpperCase(); // např. "CZ", "US"
      const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      // Ověření struktury (rates musí existovat)
      if (rawData.rates) {
        Object.entries(rawData.rates).forEach(([code, value]) => {
          const upperCode = code.toUpperCase();
          
          if (!master[upperCode]) {
            master[upperCode] = { 
              code: upperCode, 
              sources: {}, 
              web3: WEB3_CONFIG[upperCode] || {} 
            };
          }

          master[upperCode].sources[source] = {
            rate: value,
            base: rawData.base || source, // Pokud chybí base, použijeme název zdroje
            date: rawData.date || new Date().toISOString()
          };
        });
      }
    } catch (err) {
      console.warn(`⚠️ Chyba při zpracování souboru ${filePath}:`, err instanceof Error ? err.message : err);
    }
  }

  // Uložení výsledného souboru
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(master, null, 2));
  console.log(`✅ Master data úspěšně vytvořena v: ${OUTPUT_FILE}`);
}

mergeData();
