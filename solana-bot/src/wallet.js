import { 
  PublicKey, 
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction
} from '@solana/web3.js';
import { 
  getAssociatedTokenAddress,
  getAccount,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { connection, wallet, config, TOKENS } from './config.js';
import { logger } from './logger.js';
import SecurityManager from './security.js';

export class WalletManager {
  constructor() {
    this.wallet = wallet;
    this.connection = connection;
    this.balances = new Map();
    this.lastBalanceUpdate = 0;
    this.security = new SecurityManager();
    this.transactionHistory = [];
  }

  async getSOLBalance() {
    try {
      if (!this.wallet) {
        logger.warn('No wallet configured - returning demo balance');
        return 0;
      }

      const balance = await this.connection.getBalance(this.wallet.publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      logger.error('Failed to get SOL balance', error);
      return 0;
    }
  }

  async getTokenBalance(tokenMint) {
    try {
      if (!this.wallet) {
        return 0;
      }

      const tokenPublicKey = new PublicKey(tokenMint);
      const associatedTokenAddress = await getAssociatedTokenAddress(
        tokenPublicKey,
        this.wallet.publicKey
      );

      const account = await getAccount(
        this.connection,
        associatedTokenAddress
      );

      return Number(account.amount) / Math.pow(10, account.decimals || 6);
    } catch (error) {
      // Account might not exist or have zero balance
      return 0;
    }
  }

  async updateAllBalances() {
    try {
      const now = Date.now();
      
      // Cache balances for 30 seconds to avoid excessive RPC calls
      if (now - this.lastBalanceUpdate < 30000) {
        return this.balances;
      }

      logger.debug('Updating wallet balances...');

      // Get SOL balance
      const solBalance = await this.getSOLBalance();
      this.balances.set('SOL', solBalance);

      // Get token balances for tracked tokens
      if (TOKENS) {
        for (const [symbol, mint] of Object.entries(TOKENS)) {
          if (symbol !== 'SOL') {
            const balance = await this.getTokenBalance(mint);
            if (balance > 0) {
              this.balances.set(symbol, balance);
            }
          }
        }
      }

      this.lastBalanceUpdate = now;
      this.logBalances();
      
      return this.balances;
    } catch (error) {
      logger.error('Failed to update balances', error);
      return this.balances;
    }
  }

  logBalances() {
    logger.info('=== WALLET BALANCES ===');
    for (const [token, balance] of this.balances) {
      logger.balance(token, balance.toFixed(6));
    }
    logger.info('=====================');
  }

  async validateTransaction(transaction) {
    try {
      if (!this.wallet) {
        throw new Error('No wallet configured');
      }

      // Security validation
      const securityCheck = this.security.validateTransaction(
        transaction,
        transaction.amount,
        transaction.token
      );

      if (!securityCheck.valid) {
        logger.security('Transaction failed security validation', securityCheck.errors);
        return false;
      }

      // Simulate transaction to check if it will succeed
      const simulation = await this.connection.simulateTransaction(transaction.rawTransaction);
      
      if (simulation.value.err) {
        logger.error('Transaction simulation failed', simulation.value.err);
        return false;
      }

      logger.debug('Transaction validation successful');
      return true;
    } catch (error) {
      logger.error('Failed to validate transaction', error);
      return false;
    }
  }

  async sendTransaction(transaction) {
    try {
      if (!this.wallet) {
        throw new Error('No wallet configured - running in demo mode');
      }

      // Generate secure transaction ID
      const txnId = this.security.generateSecureTransactionId(transaction);
      
      // Add recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = this.wallet.publicKey;

      // Validate before sending
      if (!await this.validateTransaction(transaction)) {
        throw new Error('Transaction validation failed');
      }

      // Check system locks
      const lockStatus = this.security.isSystemLocked();
      if (lockStatus.locked) {
        throw new Error(`System locked: ${lockStatus.reason}`);
      }

      // Sign and send
      transaction.sign(this.wallet);
      
      const signature = await this.connection.sendRawTransaction(
        transaction.serialize(),
        {
          skipPreflight: false,
          preflightCommitment: 'confirmed'
        }
      );

      // Wait for confirmation
      const confirmation = await this.connection.confirmTransaction(
        signature,
        'confirmed'
      );

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`);
      }

      // Log successful transaction
      this.transactionHistory.push({
        txnId,
        signature,
        timestamp: Date.now(),
        amount: transaction.amount,
        token: transaction.token,
        status: 'confirmed'
      });

      logger.info(`Transaction successful: ${signature}`);
      return signature;
    } catch (error) {
      logger.error('Failed to send transaction', error);
      
      // Log security event for failed transaction
      this.security.logSecurityEvent('transaction_failed', {
        error: error.message,
        timestamp: Date.now()
      });
      
      throw error;
    }
  }

  // Safety checks with VibeCoding methodology
  async checkSafetyLimits(tradeAmount, tokenSymbol) {
    // Pizza kitchen reliability check - conservative approach
    const balance = this.balances.get(tokenSymbol) || 0;
    
    // Check if we have enough balance
    if (tradeAmount > balance) {
      logger.safety(`Insufficient ${tokenSymbol} balance`, {
        requested: tradeAmount,
        available: balance
      });
      return false;
    }

    // Check against maximum trade amount (small-town prudence)
    if (tradeAmount > config.maxTradeAmount) {
      logger.safety(`Trade amount exceeds maximum`, {
        requested: tradeAmount,
        maximum: config.maxTradeAmount
      });
      return false;
    }

    // Reserve minimum SOL for fees (reliability principle)
    if (tokenSymbol === 'SOL' && (balance - tradeAmount) < 0.01) {
      logger.safety('Insufficient SOL for transaction fees', {
        balance,
        tradeAmount,
        minimumReserve: 0.01
      });
      return false;
    }

    // Rhythm gaming timing check - don't trade too frequently
    const recentTrades = this.transactionHistory.filter(
      tx => Date.now() - tx.timestamp < 60000 // Last minute
    );

    if (recentTrades.length > 5) {
      logger.safety('Trading frequency too high - rhythm gaming patience required', {
        recentTradeCount: recentTrades.length
      });
      return false;
    }

    return true;
  }

  async getTransactionCost() {
    try {
      // Estimate transaction fee
      const { feeCalculator } = await this.connection.getRecentBlockhash();
      return feeCalculator.lamportsPerSignature / LAMPORTS_PER_SOL;
    } catch (error) {
      logger.error('Failed to get transaction cost', error);
      return 0.00025; // Conservative default estimate
    }
  }

  // Demo mode operations for GitHub Pages deployment
  getDemoBalances() {
    return new Map([
      ['SOL', 1.5],
      ['USDC', 100.0],
      ['RAY', 25.0]
    ]);
  }

  async simulateTradeForDemo(amount, tokenSymbol, action) {
    logger.info(`DEMO MODE: Simulating ${action} of ${amount} ${tokenSymbol}`);
    
    // Simulate realistic delays
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const mockTxnId = this.security.generateSecureTransactionId({
      amount,
      tokenSymbol,
      action,
      demo: true
    });

    logger.info(`DEMO MODE: Transaction simulated - ID: ${mockTxnId}`);
    
    return {
      signature: `demo_${mockTxnId}`,
      amount,
      tokenSymbol,
      demo: true,
      timestamp: Date.now()
    };
  }

  // Performance monitoring for VibeCoding methodology
  getWalletPerformanceStats() {
    const now = Date.now();
    const last24h = this.transactionHistory.filter(tx => now - tx.timestamp < 86400000);
    
    const totalTrades = last24h.length;
    const successfulTrades = last24h.filter(tx => tx.status === 'confirmed').length;
    const successRate = totalTrades > 0 ? (successfulTrades / totalTrades) * 100 : 0;
    
    return {
      totalTrades,
      successfulTrades,
      successRate: successRate.toFixed(2),
      averageTradeValue: totalTrades > 0 ? 
        (last24h.reduce((sum, tx) => sum + (tx.amount || 0), 0) / totalTrades).toFixed(6) : 0,
      lastTransaction: last24h.length > 0 ? last24h[last24h.length - 1].timestamp : null,
      balanceUpdateFrequency: this.lastBalanceUpdate > 0 ? 
        ((now - this.lastBalanceUpdate) / 1000).toFixed(1) + 's ago' : 'Never'
    };
  }
}

export default WalletManager;