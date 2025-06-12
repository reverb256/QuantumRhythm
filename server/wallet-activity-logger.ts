/**
 * Fixed Wallet Activity Logger
 * Resolves UUID parsing errors in database operations
 */

import { db } from './db';
import { walletActivity } from '@shared/schema';
import { v4 as uuidv4, validate as isValidUUID } from 'uuid';

interface WalletActivityData {
  walletAddress: string;
  activityType: string;
  amount?: string | number;
  tokenAddress?: string;
  transactionHash?: string;
  status?: string;
  metadata?: Record<string, any>;
}

class WalletActivityLogger {
  private static instance: WalletActivityLogger;
  
  public static getInstance(): WalletActivityLogger {
    if (!WalletActivityLogger.instance) {
      WalletActivityLogger.instance = new WalletActivityLogger();
    }
    return WalletActivityLogger.instance;
  }

  async logActivity(data: WalletActivityData): Promise<boolean> {
    try {
      // Generate a proper UUID for the record
      const recordId = uuidv4();
      
      // Validate UUID generation
      if (!isValidUUID(recordId)) {
        throw new Error('Failed to generate valid UUID');
      }

      // Sanitize and validate input data
      const sanitizedData = {
        id: recordId,
        walletAddress: this.sanitizeString(data.walletAddress),
        activityType: this.sanitizeString(data.activityType),
        amount: data.amount ? this.sanitizeAmount(data.amount) : null,
        tokenAddress: data.tokenAddress ? this.sanitizeString(data.tokenAddress) : null,
        transactionHash: data.transactionHash ? this.sanitizeString(data.transactionHash) : null,
        status: data.status || 'pending',
        metadata: data.metadata || {},
        timestamp: new Date()
      };

      // Insert with explicit UUID
      await db.insert(walletActivity).values(sanitizedData);
      
      return true;
      
    } catch (error) {
      // Silent fallback - don't crash the system
      this.logToConsole(data, error);
      return false;
    }
  }

  private sanitizeString(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    // Remove null bytes and limit length
    return input.replace(/\0/g, '').trim().substring(0, 255);
  }

  private sanitizeAmount(input: string | number): string {
    if (typeof input === 'number') {
      return input.toFixed(9);
    }
    
    if (!input) return '0';
    
    // Clean and validate decimal format
    const cleaned = String(input).replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    
    if (isNaN(parsed)) return '0';
    
    // Limit to 9 decimal places for SOL amounts
    return parsed.toFixed(9);
  }

  private logToConsole(data: WalletActivityData, error?: any): void {
    console.log('📝 Wallet activity (console fallback):', {
      timestamp: new Date().toISOString(),
      activity: data.activityType,
      wallet: data.walletAddress.substring(0, 8) + '...',
      amount: data.amount,
      status: data.status || 'pending'
    });
    
    if (error) {
      console.error('Database logging error details:', error instanceof Error ? error.message : String(error));
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      // Test database connectivity
      await db.select().from(walletActivity).limit(1);
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const walletActivityLogger = WalletActivityLogger.getInstance();

// Simple logging function for easy import
export async function logWalletActivity(
  walletAddress: string,
  activityType: string,
  amount?: string | number,
  tokenAddress?: string,
  transactionHash?: string,
  status: string = 'pending',
  metadata: Record<string, any> = {}
): Promise<boolean> {
  return walletActivityLogger.logActivity({
    walletAddress,
    activityType,
    amount,
    tokenAddress,
    transactionHash,
    status,
    metadata
  });
}