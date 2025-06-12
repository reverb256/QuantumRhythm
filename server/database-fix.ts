/**
 * Database UUID Fix - Emergency fix for UUID parsing errors
 */

import { db } from './db';

export async function fixDatabaseUUIDs() {
  try {
    console.log('🔧 Applying emergency database UUID fix...');
    
    // Drop and recreate wallet_activity table with proper UUID handling
    await db.execute(`
      DROP TABLE IF EXISTS wallet_activity CASCADE;
      
      CREATE TABLE wallet_activity (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        wallet_address TEXT NOT NULL,
        activity_type VARCHAR(50) NOT NULL,
        amount DECIMAL(18, 9),
        token_address TEXT,
        transaction_hash TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        metadata JSONB DEFAULT '{}',
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
    
    console.log('✅ Database UUID structure fixed');
    return true;
    
  } catch (error) {
    console.error('❌ Database fix failed:', error);
    return false;
  }
}

// Silent wallet activity logger that won't crash the system
export async function logWalletActivitySafe(
  walletAddress: string,
  activityType: string,
  amount?: number,
  tokenAddress?: string,
  transactionHash?: string,
  status: string = 'pending'
): Promise<void> {
  try {
    await db.execute(`
      INSERT INTO wallet_activity (wallet_address, activity_type, amount, token_address, transaction_hash, status)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [walletAddress, activityType, amount || null, tokenAddress || null, transactionHash || null, status]);
  } catch (error) {
    // Silent fail - just log to console instead of crashing
    console.log('📝 Wallet activity (fallback):', {
      activity: activityType,
      wallet: walletAddress.substring(0, 8) + '...',
      amount,
      status
    });
  }
}