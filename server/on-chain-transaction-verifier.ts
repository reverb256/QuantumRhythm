/**
 * On-Chain Transaction Verifier
 * Confirms actual blockchain transactions and integrates with wallet guardian
 */

import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';
import { LiveTradingController } from './live-trading-controller';

interface TransactionDetail {
  signature: string;
  blockTime: number;
  slot: number;
  status: 'success' | 'failed';
  type: 'transfer' | 'swap' | 'unknown';
  amount?: number;
  token?: string;
  confirmed: boolean;
}

export class OnChainTransactionVerifier {
  private connection: Connection;
  private walletAddress: string;
  private tradingController: LiveTradingController;
  private knownTransactions: Set<string> = new Set();

  constructor() {
    this.connection = new Connection('https://api.mainnet-beta.solana.com');
    this.walletAddress = process.env.WALLET_PUBLIC_KEY || '4jTtAYiHP3tHqXcmi5T1riS1AcGmxNNhLZTw65vrKpkA';
    this.tradingController = new LiveTradingController();
    
    console.log(`🔍 Transaction Verifier monitoring: ${this.walletAddress.slice(0, 8)}...${this.walletAddress.slice(-8)}`);
  }

  async initializeVerification(): Promise<void> {
    // Initialize wallet guardian for incoming token monitoring
    await this.tradingController.initializeWalletGuardian();
    
    // Scan existing transactions
    await this.scanRecentTransactions();
    
    console.log('✅ On-chain verification system active');
  }

  async scanRecentTransactions(): Promise<TransactionDetail[]> {
    try {
      const publicKey = new PublicKey(this.walletAddress);
      
      // Get recent transaction signatures
      const signatures = await this.connection.getSignaturesForAddress(publicKey, { limit: 20 });
      
      const transactions: TransactionDetail[] = [];
      
      for (const sigInfo of signatures) {
        const txDetail: TransactionDetail = {
          signature: sigInfo.signature,
          blockTime: sigInfo.blockTime || 0,
          slot: sigInfo.slot,
          status: sigInfo.err ? 'failed' : 'success',
          type: 'unknown',
          confirmed: sigInfo.confirmationStatus === 'finalized'
        };

        // Get detailed transaction info
        try {
          const transaction = await this.connection.getParsedTransaction(sigInfo.signature, {
            maxSupportedTransactionVersion: 0
          });

          if (transaction) {
            const parsedTx = this.parseTransactionDetails(transaction);
            txDetail.type = parsedTx.type;
            txDetail.amount = parsedTx.amount;
            txDetail.token = parsedTx.token;
          }
        } catch (error) {
          console.log(`Could not parse transaction ${sigInfo.signature}: ${error}`);
        }

        transactions.push(txDetail);
        this.knownTransactions.add(sigInfo.signature);
      }

      console.log(`📊 Found ${transactions.length} on-chain transactions`);
      console.log(`✅ ${transactions.filter(tx => tx.status === 'success').length} successful transactions`);
      console.log(`❌ ${transactions.filter(tx => tx.status === 'failed').length} failed transactions`);

      return transactions;
    } catch (error) {
      console.error('Error scanning transactions:', error);
      return [];
    }
  }

  private parseTransactionDetails(transaction: ParsedTransactionWithMeta): {
    type: 'transfer' | 'swap' | 'unknown';
    amount?: number;
    token?: string;
  } {
    if (!transaction.meta || !transaction.transaction.message.instructions) {
      return { type: 'unknown' };
    }

    // Look for SOL transfers
    const preBalances = transaction.meta.preBalances;
    const postBalances = transaction.meta.postBalances;
    
    if (preBalances && postBalances && preBalances.length === postBalances.length) {
      for (let i = 0; i < preBalances.length; i++) {
        const balanceChange = (postBalances[i] - preBalances[i]) / 1000000000; // Convert lamports to SOL
        if (Math.abs(balanceChange) > 0.000001) { // Ignore dust amounts
          return {
            type: 'transfer',
            amount: Math.abs(balanceChange),
            token: 'SOL'
          };
        }
      }
    }

    // Check for token transfers
    if (transaction.meta.preTokenBalances && transaction.meta.postTokenBalances) {
      // This would require more detailed parsing for SPL tokens
      return { type: 'swap' };
    }

    return { type: 'unknown' };
  }

  async verifyLiveTrading(): Promise<{
    isLive: boolean;
    recentActivity: boolean;
    transactionCount: number;
    lastTransaction?: TransactionDetail;
    walletBalance: number;
  }> {
    const transactions = await this.scanRecentTransactions();
    const status = await this.tradingController.getCurrentStatus();
    
    // Check for recent activity (last 24 hours)
    const dayAgo = Date.now() / 1000 - 86400;
    const recentTransactions = transactions.filter(tx => tx.blockTime > dayAgo);
    
    const result = {
      isLive: status.mode === 'live',
      recentActivity: recentTransactions.length > 0,
      transactionCount: transactions.length,
      lastTransaction: transactions[0],
      walletBalance: status.balance
    };

    console.log(`🎯 Trading Status: ${result.isLive ? 'LIVE' : 'SIMULATION'}`);
    console.log(`📊 Total Transactions: ${result.transactionCount}`);
    console.log(`⚡ Recent Activity: ${result.recentActivity ? 'YES' : 'NO'}`);
    console.log(`💰 Wallet Balance: ${result.walletBalance.toFixed(6)} SOL`);

    return result;
  }

  async monitorNewTransactions(): Promise<void> {
    setInterval(async () => {
      try {
        const publicKey = new PublicKey(this.walletAddress);
        const signatures = await this.connection.getSignaturesForAddress(publicKey, { limit: 5 });
        
        for (const sigInfo of signatures) {
          if (!this.knownTransactions.has(sigInfo.signature)) {
            console.log(`🆕 NEW TRANSACTION DETECTED: ${sigInfo.signature}`);
            console.log(`   Block Time: ${new Date(sigInfo.blockTime! * 1000).toISOString()}`);
            console.log(`   Status: ${sigInfo.err ? 'FAILED' : 'SUCCESS'}`);
            
            this.knownTransactions.add(sigInfo.signature);
            
            // Trigger wallet guardian to analyze any new tokens
            const guardianReport = await this.tradingController.getWalletGuardianReport();
            console.log(`🛡️ Guardian Status: ${guardianReport.active ? 'ACTIVE' : 'INACTIVE'}`);
          }
        }
      } catch (error) {
        console.error('Error monitoring new transactions:', error);
      }
    }, 30000); // Check every 30 seconds
  }

  async getDetailedTransactionHistory(): Promise<{
    totalTransactions: number;
    successfulTrades: number;
    failedTrades: number;
    totalVolume: number;
    lastActivity: number;
    guardianReport: any;
  }> {
    const transactions = await this.scanRecentTransactions();
    const guardianReport = await this.tradingController.getWalletGuardianReport();
    
    const successful = transactions.filter(tx => tx.status === 'success');
    const failed = transactions.filter(tx => tx.status === 'failed');
    const totalVolume = transactions
      .filter(tx => tx.amount)
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
    
    return {
      totalTransactions: transactions.length,
      successfulTrades: successful.length,
      failedTrades: failed.length,
      totalVolume,
      lastActivity: transactions[0]?.blockTime || 0,
      guardianReport
    };
  }
}

export default OnChainTransactionVerifier;