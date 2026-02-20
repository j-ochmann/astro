import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

async function test() {
  console.log('🚀 Testing viem connection...');
  
  const client = createPublicClient({
    chain: mainnet,
    transport: http('https://ethereum.publicnode.com')
  });

  try {
    const blockNumber = await client.getBlockNumber();
    console.log(`✅ Success! Current Ethereum block: ${blockNumber}`);
    
    const gasPrice = await client.getGasPrice();
    console.log(`⛽ Current Gas Price: ${gasPrice.toString()} wei`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Viem connection failed!');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    process.exit(1);
  }
}

test();
