import axios from 'axios';
import { PublicKey, Transaction } from '@solana/web3.js';
import { connection, wallet, config, TOKENS } from './config.js';
import { logger } from './logger.js';

export class JupiterTrader {
  constructor() {
    this.baseUrl = 'https://quote-api.jup.ag/v6';
    this.connection = connection;
    this.wallet = wallet;
  }

  async getQuote(inputMint, outputMint, amount, slippageBps = 50) {
    try {
      const params = new URLSearchParams({
        inputMint,
        outputMint,
        amount: Math.floor(amount).toString(),
        slippageBps: slippageBps.toString(),
        onlyDirectRoutes: 'false',
        asLegacyTransaction: 'false'
      });

      const response = await axios.get(`${this.baseUrl}/quote?${params}`);
      
      if (!response.data) {
        throw new Error('No quote received from Jupiter');
      }

      const quote = response.data;
      
      logger.debug('Jupiter quote received', {
        inputAmount: amount,
        outputAmount: quote.outAmount,
        priceImpact: quote.priceImpactPct,
        route: quote.routePlan?.length || 0
      });

      return quote;
    } catch (error) {
      logger.error('Failed to get Jupiter quote', error);
      throw error;
    }
  }

  async executeSwap(inputMint, outputMint, amount, maxSlippage = 1) {
    try {
      logger.info(`Executing swap: ${amount} tokens`);
      
      // Get quote
      const slippageBps = Math.floor(maxSlippage * 100);
      const quote = await this.getQuote(inputMint, outputMint, amount, slippageBps);
      
      // Check price impact
      const priceImpact = parseFloat(quote.priceImpactPct || '0');
      if (priceImpact > 5) {
        throw new Error(`Price impact too high: ${priceImpact}%`);
      }

      // Get swap transaction
      const response = await axios.post(`${this.baseUrl}/swap`, {
        quoteResponse: quote,
        userPublicKey: this.wallet.publicKey.toString(),
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: 'auto'
      });

      if (!response.data?.swapTransaction) {
        throw new Error('No swap transaction received from Jupiter');
      }

      // Deserialize the transaction
      const transactionBuf = Buffer.from(response.data.swapTransaction, 'base64');
      const transaction = Transaction.from(transactionBuf);
      
      // Add recent blockhash and fee payer
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = this.wallet.publicKey;

      // Sign and send transaction
      transaction.sign(this.wallet);
      
      const signature = await this.connection.sendRawTransaction(
        transaction.serialize(),
        {
          skipPreflight: false,
          preflightCommitment: 'confirmed',
          maxRetries: 3
        }
      );

      // Wait for confirmation
      const confirmation = await this.connection.confirmTransaction(
        signature,
        'confirmed'
      );

      if (confirmation.value.err) {
        throw new Error(`Swap transaction failed: ${confirmation.value.err}`);
      }

      logger.trade('SWAP', 'Jupiter', amount, quote.outAmount);
      logger.info(`Swap successful: ${signature}`);

      return {
        signature,
        inputAmount: amount,
        outputAmount: quote.outAmount,
        priceImpact
      };
    } catch (error) {
      logger.error('Jupiter swap failed', error);
      throw error;
    }
  }

  async findArbitrageOpportunities() {
    try {
      const opportunities = [];
      const tokens = Object.entries(TOKENS);
      
      for (let i = 0; i < tokens.length; i++) {
        for (let j = i + 1; j < tokens.length; j++) {
          const [tokenA, mintA] = tokens[i];
          const [tokenB, mintB] = tokens[j];
          
          if (tokenA === 'SOL' || tokenB === 'SOL') continue;
          
          try {
            // Check A->B->A arbitrage
            const quote1 = await this.getQuote(mintA, mintB, 1000000);
            const quote2 = await this.getQuote(mintB, mintA, quote1.outAmount);
            
            const profit = (parseFloat(quote2.outAmount) - 1000000) / 1000000;
            
            if (profit > config.minProfitThreshold) {
              opportunities.push({
                path: `${tokenA} -> ${tokenB} -> ${tokenA}`,
                profit: profit * 100,
                inputAmount: 1000000,
                outputAmount: quote2.outAmount
              });
            }
          } catch (error) {
            // Skip this pair if quotes fail
            continue;
          }
        }
      }
      
      return opportunities.sort((a, b) => b.profit - a.profit);
    } catch (error) {
      logger.error('Failed to find arbitrage opportunities', error);
      return [];
    }
  }
}

export default JupiterTrader;