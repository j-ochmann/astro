import fs from 'node:fs';
import path from 'node:path';
import { PATHS } from '../fetch.config.ts';
// Cesty k adresářům (z fetch.config.ts)
const CHAINLINK_DIR = path.join(PATHS.RAW, PATHS.CHAINLINK_ALL);
const PYTH_DIR = path.join(PATHS.RAW, PATHS.PYTH_ALL);
// Cesty pro výstupní soubory
const EDGES_DATA_PATH = path.join(PATHS.RAW, 'edges.json');
const INVERTED_EDGES_DATA_PATH = path.join(PATHS.RAW, 'inverted_edges.json');
/* NORMALIZAČNÍ TABULKA */
const SYMBOL_MAPPING: Record<string, string> = {
    // "WETH": "ETH",
    // "WBTC": "BTC",
    // "FBTC": "BTC",
    // "STETH": "ETH",
    // "RETH": "ETH",
    // "USDC": "USD",
    // "USDT": "USD"
};
/* Pomocná funkce pro získání cesty k nejnovějšímu souboru v adresáři */
const getLatestFile = (dirPath: string): string => {
    const files = fs.readdirSync(dirPath);
    if (files.length === 0) throw new Error(`Adresář je prázdný: ${dirPath}`);

    const latest = files
        .map(file => ({
            name: file,
            time: fs.statSync(path.join(dirPath, file)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time)[0];

    return path.join(dirPath, latest.name);
};

const normalize = (sym: string | undefined | null): string => {
    if (!sym) return "";
    const s = sym.toUpperCase().trim();
    return SYMBOL_MAPPING[s] || s;
};

interface ChainlinkFeed {
    name: string;
    proxyAddress: string;
    docs: {
        baseAsset?: string;
        quoteAsset?: string;
    };
}

interface PythFeed {
    id: string;
    attributes: {
        base: string;
        quote_currency: string;
        description: string;
    };
}

interface EdgeResult {
    pair: string;
    matchFoundAs?: string;
    chainlink: {
        name: string;
        proxy: string;
        base: string;
        quote: string;
    };
    pyth: {
        id: string;
        description: string;
    };
}
// LOGIKA
function generateEdges(): void {
    try {
        // Načtení nejnovějších souborů
        const latestChainlinkPath = getLatestFile(CHAINLINK_DIR);
        const latestPythPath = getLatestFile(PYTH_DIR);

        console.log(`Reading Chainlink from: ${path.basename(latestChainlinkPath)}`);
        console.log(`Reading Pyth from: ${path.basename(latestPythPath)}`);

        const chainlink: ChainlinkFeed[] = JSON.parse(fs.readFileSync(latestChainlinkPath, 'utf8'));
        const pyth: PythFeed[] = JSON.parse(fs.readFileSync(latestPythPath, 'utf8'));

        const directEdges: EdgeResult[] = [];
        const invertedEdges: EdgeResult[] = [];

        // 1. Indexace Pythu (Base-Quote)
        const pythMap = new Map<string, PythFeed>();
        pyth.forEach(item => {
            const base = normalize(item.attributes.base);
            const quote = normalize(item.attributes.quote_currency);
            pythMap.set(`${base}-${quote}`, item);
        });

        // 2. Porovnání s Chainlinkem
        chainlink.forEach(cl => {
            const clBase = normalize(cl.docs.baseAsset);
            const clQuote = normalize(cl.docs.quoteAsset || "USD");

            const directKey = `${clBase}-${clQuote}`;
            const invertedKey = `${clQuote}-${clBase}`;

            const baseEdgeInfo = {
                chainlink: {
                    name: cl.name,
                    proxy: cl.proxyAddress,
                    base: cl.docs.baseAsset || "",
                    quote: cl.docs.quoteAsset || "USD"
                }
            };

            // A) Přímá shoda
            if (pythMap.has(directKey)) {
                const p = pythMap.get(directKey)!;
                directEdges.push({
                    ...baseEdgeInfo,
                    pair: directKey,
                    pyth: { id: p.id, description: p.attributes.description }
                });
            } 
            // B) Invertovaná shoda
            else if (pythMap.has(invertedKey)) {
                const p = pythMap.get(invertedKey)!;
                invertedEdges.push({
                    ...baseEdgeInfo,
                    pair: directKey, // Původně hledaný pár (např. ETH-BTC)
                    matchFoundAs: invertedKey, // Skutečný klíč v Pyth (např. BTC-ETH)
                    pyth: { id: p.id, description: p.attributes.description }
                });
            }
        });

        // 3. Zápis
        fs.writeFileSync(EDGES_DATA_PATH, JSON.stringify(directEdges, null, 2));
        fs.writeFileSync(INVERTED_EDGES_DATA_PATH, JSON.stringify(invertedEdges, null, 2));

        console.log(`✅ Done (TypeScript)`);
        console.log(`🔗 Direct: ${directEdges.length} | 🔄 Inverted: ${invertedEdges.length}`);

    } catch (error: any) {
        console.error("Error:", error.message);
    }
}

generateEdges();
