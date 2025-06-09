import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// VibeCoding Quantum Trading Wallet
const WALLET_DATA = {
  address: 'JA63CrEdqjK6cyEkGquuYmk4xyTVgTXSFABZDNW3Qnfj',
  privateKeyBase64: 'v5GMZ+noFlOubSXS4kadPa3px5+D0kTyx9zx/1MH4vb+6pn9OKcxgQByvygYFidGw/DXCUYMPXANAWFLFEGIMg==',
  privateKeyArray: [191,145,140,103,233,232,22,83,174,109,37,210,226,70,157,61,173,233,199,159,131,210,68,242,199,220,241,255,83,7,226,246,254,234,153,253,56,167,49,129,0,114,191,40,24,22,39,70,195,240,215,9,70,12,61,112,13,1,97,75,20,65,136,50]
};

console.log('🔐 VibeCoding Wallet Import Guide');
console.log('=================================');
console.log('');

// Method 1: Base58 encoding (most common for Solana wallets)
try {
  const secretKeyBuffer = Buffer.from(WALLET_DATA.privateKeyBase64, 'base64');
  const privateKeyBase58 = bs58.encode(secretKeyBuffer);
  
  console.log('📋 Method 1: Base58 Private Key (for Phantom, Solflare, etc.)');
  console.log('Private Key (Base58):', privateKeyBase58);
  console.log('');
  
  // Verify it works
  const keypair = Keypair.fromSecretKey(secretKeyBuffer);
  console.log('✅ Verification - Address matches:', keypair.publicKey.toString() === WALLET_DATA.address);
  console.log('');
} catch (error) {
  console.log('❌ Base58 conversion failed:', error.message);
}

// Method 2: Array format (for programmatic use)
console.log('📋 Method 2: Array Format (for code/CLI)');
console.log('Private Key Array:', JSON.stringify(WALLET_DATA.privateKeyArray));
console.log('');

// Method 3: Hex format (alternative)
try {
  const secretKeyBuffer = Buffer.from(WALLET_DATA.privateKeyBase64, 'base64');
  const privateKeyHex = secretKeyBuffer.toString('hex');
  
  console.log('📋 Method 3: Hex Format');
  console.log('Private Key (Hex):', privateKeyHex);
  console.log('');
} catch (error) {
  console.log('❌ Hex conversion failed:', error.message);
}

// Method 4: Create JSON keyfile
try {
  console.log('📋 Method 4: JSON Keyfile (for Solana CLI)');
  const keyfileContent = JSON.stringify(WALLET_DATA.privateKeyArray);
  console.log('Save this as wallet.json:');
  console.log(keyfileContent);
  console.log('');
  console.log('Then use: solana config set --keypair wallet.json');
  console.log('');
} catch (error) {
  console.log('❌ JSON keyfile creation failed:', error.message);
}

console.log('🔍 Import Instructions by Wallet:');
console.log('');
console.log('Phantom Wallet:');
console.log('1. Click "Add / Connect Wallet"');
console.log('2. Select "Import Private Key"');
console.log('3. Paste the Base58 private key');
console.log('');
console.log('Solflare:');
console.log('1. Click "Access Wallet"');
console.log('2. Select "Private Key"');
console.log('3. Paste the Base58 private key');
console.log('');
console.log('Solana CLI:');
console.log('1. Save the JSON array to wallet.json');
console.log('2. Run: solana config set --keypair wallet.json');
console.log('');
console.log('Backpack:');
console.log('1. Click "Import Wallet"');
console.log('2. Select "Private Key"');
console.log('3. Paste the Base58 private key');