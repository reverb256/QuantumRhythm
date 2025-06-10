import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { db } from './db';
import { agentPerformanceLogs } from '../shared/schema';

export class SecureWalletManager {
  private connection: Connection;
  private authorizedWallet: string;

  constructor() {
    // Use mainnet for real balance checking
    this.connection = new Connection('https://api.mainnet-beta.solana.com');
    this.authorizedWallet = process.env.WALLET_PUBLIC_KEY || '';
    
    if (!this.authorizedWallet) {
      throw new Error('WALLET_PUBLIC_KEY not configured - wallet operations disabled');
    }
  }

  async getWalletBalance(): Promise<{
    address: string;
    solBalance: number;
    lamports: number;
    isValid: boolean;
  }> {
    try {
      // Validate wallet address format
      const publicKey = new PublicKey(this.authorizedWallet);
      
      // Get actual balance from Solana mainnet
      const lamports = await this.connection.getBalance(publicKey);
      const solBalance = lamports / LAMPORTS_PER_SOL;
      
      console.log(`💳 Wallet Balance Check: [PROTECTED]`);
      console.log(`💰 Balance: ${solBalance.toFixed(6)} SOL (${lamports} lamports)`);
      
      // Log balance check for audit
      await this.logWalletActivity('balance_check', {
        wallet: '[PROTECTED]',
        balance: solBalance,
        lamports,
        timestamp: Date.now()
      });
      
      return {
        address: this.authorizedWallet,
        solBalance,
        lamports,
        isValid: true
      };
      
    } catch (error) {
      console.error('❌ Wallet balance check failed:', error);
      
      await this.logWalletActivity('balance_check_failed', {
        wallet: this.authorizedWallet,
        error: (error as Error).message,
        timestamp: Date.now()
      });
      
      return {
        address: this.authorizedWallet,
        solBalance: 0,
        lamports: 0,
        isValid: false
      };
    }
  }

  async validatePayoutAddress(requestedAddress: string): Promise<boolean> {
    // SECURITY: Only allow payouts to the authorized wallet
    const isAuthorized = requestedAddress === this.authorizedWallet;
    
    if (!isAuthorized) {
      console.log(`🚨 SECURITY ALERT: Unauthorized payout attempt to [REDACTED]`);
      console.log(`🔒 Only authorized wallet: [PROTECTED]`);
      
      await this.logWalletActivity('unauthorized_payout_attempt', {
        requestedAddress: '[REDACTED]',
        authorizedWallet: '[PROTECTED]',
        timestamp: Date.now()
      });
    }
    
    return isAuthorized;
  }

  async getAuthorizedWallet(): Promise<string> {
    return this.authorizedWallet;
  }

  async getWalletInfo(): Promise<{
    address: string;
    balance: number;
    network: string;
    security: {
      payoutRestricted: boolean;
      authorizedOnly: boolean;
    }
  }> {
    const balanceInfo = await this.getWalletBalance();
    
    return {
      address: `${this.authorizedWallet.substring(0, 4)}***${this.authorizedWallet.substring(this.authorizedWallet.length - 4)}`,
      balance: balanceInfo.solBalance,
      network: 'mainnet-beta',
      security: {
        payoutRestricted: true,
        authorizedOnly: true
      }
    };
  }

  private async logWalletActivity(activityType: string, details: any) {
    try {
      await db.insert(agentPerformanceLogs).values({
        agentId: 'secure-wallet-manager',
        metricType: activityType,
        metricValue: details.balance?.toString() || '0',
        context: details
      });
    } catch (error) {
      console.error('Failed to log wallet activity:', error);
    }
  }

  async validateSecurityCompliance(): Promise<{
    compliant: boolean;
    checks: Array<{
      check: string;
      passed: boolean;
      details: string;
    }>
  }> {
    const checks = [];
    
    // Check 1: Authorized wallet configured
    const walletConfigured = !!this.authorizedWallet;
    checks.push({
      check: 'Authorized Wallet Configured',
      passed: walletConfigured,
      details: walletConfigured ? 'PAYOUT_TOKEN properly set' : 'PAYOUT_TOKEN missing'
    });
    
    // Check 2: Valid wallet address format
    let validFormat = false;
    try {
      new PublicKey(this.authorizedWallet);
      validFormat = true;
    } catch {
      validFormat = false;
    }
    
    checks.push({
      check: 'Valid Wallet Address Format',
      passed: validFormat,
      details: validFormat ? 'Address format valid' : 'Invalid Solana address format'
    });
    
    // Check 3: Network connectivity
    let networkConnected = false;
    try {
      await this.connection.getSlot();
      networkConnected = true;
    } catch {
      networkConnected = false;
    }
    
    checks.push({
      check: 'Solana Network Connectivity',
      passed: networkConnected,
      details: networkConnected ? 'Connected to mainnet' : 'Network connection failed'
    });
    
    const allPassed = checks.every(check => check.passed);
    
    return {
      compliant: allPassed,
      checks
    };
  }
}

export const secureWallet = new SecureWalletManager();