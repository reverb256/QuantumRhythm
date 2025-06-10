/**
 * Live Trading Controller
 * Manages transition between simulation and live trading modes
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { IntelligentWalletGuardian } from './intelligent-wallet-guardian';

interface TradingMode {
  mode: 'simulation' | 'live';
  walletAddress: string;
  balance: number;
  lastUpdate: number;
  guardianActive: boolean;
}

export class LiveTradingController {
  private connection: Connection;
  private walletAddress: string;
  private tradingMode: 'simulation' | 'live' = 'simulation';
  private walletGuardian: IntelligentWalletGuardian | null = null;

  constructor() {
    this.connection = new Connection('https://api.mainnet-beta.solana.com');
    this.walletAddress = process.env.WALLET_PUBLIC_KEY || '4jTtAYiHP3tHqXcmi5T1riS1AcGmxNNhLZTw65vrKpkA';
    
    console.log(`🎮 Trading Controller initialized for wallet: ${this.walletAddress.slice(0, 8)}...${this.walletAddress.slice(-8)}`);
  }

  async initializeWalletGuardian() {
    if (!this.walletGuardian) {
      this.walletGuardian = new IntelligentWalletGuardian(this.connection, this.walletAddress);
      await this.walletGuardian.startMonitoring();
      console.log('🛡️ Wallet Guardian activated for incoming token monitoring');
    }
  }

  async getCurrentStatus(): Promise<TradingMode> {
    try {
      const publicKey = new PublicKey(this.walletAddress);
      const balance = await this.connection.getBalance(publicKey);
      const solBalance = balance / 1000000000;

      return {
        mode: this.tradingMode,
        walletAddress: this.walletAddress,
        balance: solBalance,
        lastUpdate: Date.now(),
        guardianActive: this.walletGuardian !== null
      };
    } catch (error) {
      console.error('Error getting trading status:', error);
      return {
        mode: this.tradingMode,
        walletAddress: this.walletAddress,
        balance: 0,
        lastUpdate: Date.now(),
        guardianActive: false
      };
    }
  }

  async enableLiveTrading(): Promise<{ success: boolean; message: string }> {
    try {
      // Verify wallet access and balance
      const status = await this.getCurrentStatus();
      
      if (status.balance < 0.1) {
        return {
          success: false,
          message: `Insufficient balance for live trading: ${status.balance.toFixed(6)} SOL`
        };
      }

      // Initialize wallet guardian for incoming token monitoring
      await this.initializeWalletGuardian();

      this.tradingMode = 'live';
      
      console.log('🚀 LIVE TRADING ENABLED');
      console.log(`💰 Wallet: ${this.walletAddress.slice(0, 8)}...${this.walletAddress.slice(-8)}`);
      console.log(`💎 Balance: ${status.balance.toFixed(6)} SOL`);
      console.log('🛡️ Guardian: Active for incoming token security');

      return {
        success: true,
        message: `Live trading enabled with ${status.balance.toFixed(6)} SOL balance`
      };
    } catch (error) {
      console.error('Error enabling live trading:', error);
      return {
        success: false,
        message: 'Failed to enable live trading - wallet verification failed'
      };
    }
  }

  async disableLiveTrading(): Promise<{ success: boolean; message: string }> {
    this.tradingMode = 'simulation';
    
    if (this.walletGuardian) {
      await this.walletGuardian.stopMonitoring();
    }

    console.log('🛑 Live trading disabled - returning to simulation mode');
    
    return {
      success: true,
      message: 'Live trading disabled - simulation mode active'
    };
  }

  async getWalletGuardianReport() {
    if (!this.walletGuardian) {
      return {
        active: false,
        message: 'Wallet Guardian not initialized'
      };
    }

    const report = await this.walletGuardian.getSecurityReport();
    return {
      active: true,
      ...report
    };
  }

  isLiveTrading(): boolean {
    return this.tradingMode === 'live';
  }

  getWalletAddress(): string {
    return this.walletAddress;
  }

  async executeTradeValidation(tradeDetails: any): Promise<{
    approved: boolean;
    reason: string;
    gasEstimate?: number;
  }> {
    if (this.tradingMode === 'simulation') {
      return {
        approved: true,
        reason: 'Simulation mode - no validation required'
      };
    }

    // Live trading validation
    const status = await this.getCurrentStatus();
    
    if (status.balance < 0.01) {
      return {
        approved: false,
        reason: 'Insufficient SOL balance for transaction fees'
      };
    }

    // Estimate gas fees (simplified)
    const gasEstimate = 0.000015; // Typical SOL transaction fee
    
    if (status.balance < gasEstimate + 0.005) { // Keep 0.005 SOL reserve
      return {
        approved: false,
        reason: 'Insufficient balance after accounting for gas fees and reserves'
      };
    }

    return {
      approved: true,
      reason: 'Trade approved for live execution',
      gasEstimate
    };
  }
}

export default LiveTradingController;