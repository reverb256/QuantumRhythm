/**
 * Wallet Manager - Dynamic wallet detection and configuration
 */

import { Connection, PublicKey } from '@solana/web3.js';

interface WalletConfig {
  publicKey: string;
  isConnected: boolean;
  source: 'environment' | 'web3auth' | 'phantom' | 'solflare' | 'user_input';
  lastUpdated: number;
}

export class WalletManager {
  private connection: Connection;
  private currentWallet: WalletConfig | null = null;
  private subscribers: Set<(wallet: WalletConfig | null) => void> = new Set();

  constructor() {
    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
    );
    this.initializeWallet();
  }

  private async initializeWallet() {
    // Try to detect wallet from various sources
    let detectedWallet: WalletConfig | null = null;

    // 1. Check environment variables (for demo/testing)
    if (process.env.WALLET_PUBLIC_KEY && !process.env.WALLET_PUBLIC_KEY.startsWith('$')) {
      try {
        new PublicKey(process.env.WALLET_PUBLIC_KEY);
        detectedWallet = {
          publicKey: process.env.WALLET_PUBLIC_KEY,
          isConnected: true,
          source: 'environment',
          lastUpdated: Date.now()
        };
        console.log('🔧 Using environment wallet:', process.env.WALLET_PUBLIC_KEY.substring(0, 8) + '...');
      } catch (error) {
        console.log('❌ Invalid environment wallet address');
      }
    }

    // 2. Check for user-provided wallet (priority over environment)
    const userWallet = await this.getUserWallet();
    if (userWallet) {
      detectedWallet = userWallet;
    }

    this.setCurrentWallet(detectedWallet);
  }

  private async getUserWallet(): Promise<WalletConfig | null> {
    // This would integrate with the frontend wallet connection
    // For now, return null to use environment wallet
    return null;
  }

  public setUserWallet(publicKey: string, source: WalletConfig['source'] = 'user_input'): boolean {
    try {
      // Validate the public key
      new PublicKey(publicKey);
      
      const walletConfig: WalletConfig = {
        publicKey,
        isConnected: true,
        source,
        lastUpdated: Date.now()
      };

      this.setCurrentWallet(walletConfig);
      console.log(`✅ Wallet updated: ${publicKey.substring(0, 8)}... (${source})`);
      return true;
    } catch (error) {
      console.log(`❌ Invalid wallet address: ${publicKey}`);
      return false;
    }
  }

  private setCurrentWallet(wallet: WalletConfig | null) {
    this.currentWallet = wallet;
    this.notifySubscribers();
  }

  public getCurrentWallet(): WalletConfig | null {
    return this.currentWallet;
  }

  public getCurrentPublicKey(): PublicKey | null {
    if (!this.currentWallet) return null;
    try {
      return new PublicKey(this.currentWallet.publicKey);
    } catch {
      return null;
    }
  }

  public async getWalletBalance(): Promise<number> {
    const publicKey = this.getCurrentPublicKey();
    if (!publicKey) return 0;

    try {
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.log('Error fetching wallet balance:', error);
      return 0;
    }
  }

  public subscribe(callback: (wallet: WalletConfig | null) => void) {
    this.subscribers.add(callback);
    // Immediately call with current state
    callback(this.currentWallet);
    
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback(this.currentWallet);
      } catch (error) {
        console.log('Error notifying wallet subscriber:', error);
      }
    });
  }

  public isWalletConnected(): boolean {
    return this.currentWallet?.isConnected || false;
  }

  public getWalletSource(): string {
    return this.currentWallet?.source || 'none';
  }

  public async validateWallet(publicKey?: string): Promise<{
    valid: boolean;
    balance: number;
    address: string;
    source: string;
  }> {
    const targetKey = publicKey || this.currentWallet?.publicKey;
    
    if (!targetKey) {
      return {
        valid: false,
        balance: 0,
        address: 'none',
        source: 'none'
      };
    }

    try {
      const pubKey = new PublicKey(targetKey);
      const balance = await this.connection.getBalance(pubKey);
      
      return {
        valid: true,
        balance: balance / 1e9,
        address: targetKey,
        source: this.currentWallet?.source || 'unknown'
      };
    } catch (error) {
      return {
        valid: false,
        balance: 0,
        address: targetKey,
        source: 'invalid'
      };
    }
  }

  public disconnectWallet() {
    this.setCurrentWallet(null);
    console.log('🔌 Wallet disconnected');
  }
}

// Singleton instance
export const walletManager = new WalletManager();