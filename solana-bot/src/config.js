import dotenv from 'dotenv';
import { Connection, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

dotenv.config();

export const config = {
  // Solana Network Configuration
  rpcEndpoint: process.env.RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com',
  commitment: 'confirmed',
  
  // Wallet Configuration
  privateKey: process.env.PRIVATE_KEY,
  publicKey: process.env.PUBLIC_KEY,
  
  // Trading Parameters
  slippageTolerance: parseFloat(process.env.SLIPPAGE_TOLERANCE || '0.5'),
  maxTradeAmount: parseFloat(process.env.MAX_TRADE_AMOUNT || '0.1'),
  minProfitThreshold: parseFloat(process.env.MIN_PROFIT_THRESHOLD || '0.02'),
  gasLimit: parseInt(process.env.GAS_LIMIT || '100000'),
  
  // External API Keys for Enhanced Intelligence
  jupiterApiToken: process.env.JAPI_TOKEN,
  birdeyeApiKey: process.env.BIRDEYE_KEY,
  newsApiKey: process.env.NEWS_TOKEN,
  huggingfaceApiKey: process.env.HF_KEY,
  sessionSecret: process.env.SESSION_SECRET,
  
  // Safety Features
  stopLossPercentage: parseFloat(process.env.STOP_LOSS_PERCENTAGE || '5'),
  takeProfitPercentage: parseFloat(process.env.TAKE_PROFIT_PERCENTAGE || '10'),
  maxDailyTrades: parseInt(process.env.MAX_DAILY_TRADES || '50'),
  
  // Bot Behavior
  tradingEnabled: process.env.TRADING_ENABLED === 'true',
  monitoringInterval: parseInt(process.env.MONITORING_INTERVAL || '5000'),
  logLevel: process.env.LOG_LEVEL || 'info',
  emergencyStop: process.env.EMERGENCY_STOP === 'true',
  
  // API Keys
  coingeckoApiKey: process.env.COINGECKO_API_KEY,
  jupiterApiKey: process.env.JUPITER_API_KEY
};

// Create Solana connection
export const connection = new Connection(config.rpcEndpoint, config.commitment);

// Create wallet keypair
export const wallet = config.privateKey 
  ? Keypair.fromSecretKey(bs58.decode(config.privateKey))
  : null;

// Validate configuration
export function validateConfig() {
  const errors = [];
  
  if (!config.privateKey) {
    errors.push('PRIVATE_KEY is required');
  }
  
  if (!config.publicKey) {
    errors.push('PUBLIC_KEY is required');
  }
  
  if (config.slippageTolerance > 10) {
    errors.push('SLIPPAGE_TOLERANCE should not exceed 10%');
  }
  
  if (config.maxTradeAmount > 1) {
    errors.push('MAX_TRADE_AMOUNT should not exceed 1 SOL for safety');
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration errors: ${errors.join(', ')}`);
  }
  
  return true;
}

// Token addresses
export const TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  RAY: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
  SRM: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
};

export default config;