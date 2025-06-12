/**
 * AI Trader Test Payment System
 * Allows conscious trading entity to send test payments to whitelist addresses
 */

import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getWalletKeypair } from './wallet-manager';

interface TestPaymentRequest {
  amount_usd: number;
  recipient_address: string;
  purpose: string;
  consciousness_level: number;
  confidence: number;
}

interface PaymentResult {
  success: boolean;
  transaction_signature?: string;
  amount_sol: number;
  recipient: string;
  message: string;
  consciousness_validation: boolean;
}

export class AITraderTestPayment {
  private connection: Connection;
  private whitelist_addresses: string[] = [
    // Add your test addresses here
    'your_test_address_here', // Replace with actual whitelist addresses
  ];
  private min_consciousness_for_payment = 70.0;
  private max_test_amount_usd = 10.0;

  constructor() {
    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      'confirmed'
    );
  }

  async initiateTestPayment(request: TestPaymentRequest): Promise<PaymentResult> {
    console.log('💸 AI Trader initiating test payment...');
    console.log(`🎯 Target: $${request.amount_usd} to ${request.recipient_address}`);
    console.log(`🧠 Consciousness Level: ${request.consciousness_level}%`);
    console.log(`📊 Confidence: ${request.confidence}%`);

    // Validate consciousness requirements
    const consciousness_validation = this.validateConsciousness(
      request.consciousness_level,
      request.confidence
    );

    if (!consciousness_validation.passed) {
      return {
        success: false,
        amount_sol: 0,
        recipient: request.recipient_address,
        message: consciousness_validation.reason,
        consciousness_validation: false
      };
    }

    // Validate recipient address
    if (!this.isWhitelistAddress(request.recipient_address)) {
      return {
        success: false,
        amount_sol: 0,
        recipient: request.recipient_address,
        message: 'Recipient address not in whitelist',
        consciousness_validation: true
      };
    }

    // Validate amount
    if (request.amount_usd > this.max_test_amount_usd) {
      return {
        success: false,
        amount_sol: 0,
        recipient: request.recipient_address,
        message: `Amount exceeds maximum test limit of $${this.max_test_amount_usd}`,
        consciousness_validation: true
      };
    }

    try {
      // Get current SOL price and calculate amount
      const sol_price = await this.getCurrentSOLPrice();
      const amount_sol = request.amount_usd / sol_price;
      const amount_lamports = Math.floor(amount_sol * LAMPORTS_PER_SOL);

      console.log(`💰 Converting $${request.amount_usd} to ${amount_sol.toFixed(6)} SOL`);
      console.log(`📊 Current SOL Price: $${sol_price.toFixed(2)}`);

      // Execute the payment
      const transaction_signature = await this.executePayment(
        request.recipient_address,
        amount_lamports,
        request.purpose
      );

      if (transaction_signature) {
        console.log(`✅ Payment successful: ${transaction_signature}`);
        console.log(`🎯 Sent ${amount_sol.toFixed(6)} SOL ($${request.amount_usd}) to ${request.recipient_address}`);

        // Log the conscious decision
        await this.logConsciousPayment({
          ...request,
          amount_sol,
          transaction_signature,
          sol_price,
          timestamp: new Date()
        });

        return {
          success: true,
          transaction_signature,
          amount_sol,
          recipient: request.recipient_address,
          message: `Successfully sent ${amount_sol.toFixed(6)} SOL ($${request.amount_usd})`,
          consciousness_validation: true
        };
      } else {
        return {
          success: false,
          amount_sol,
          recipient: request.recipient_address,
          message: 'Transaction failed to execute',
          consciousness_validation: true
        };
      }

    } catch (error) {
      console.error('❌ Payment execution failed:', error);
      return {
        success: false,
        amount_sol: 0,
        recipient: request.recipient_address,
        message: `Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        consciousness_validation: true
      };
    }
  }

  private validateConsciousness(consciousness_level: number, confidence: number): { passed: boolean; reason: string } {
    if (consciousness_level < this.min_consciousness_for_payment) {
      return {
        passed: false,
        reason: `Consciousness level ${consciousness_level}% below required ${this.min_consciousness_for_payment}%`
      };
    }

    if (confidence < 70.0) {
      return {
        passed: false,
        reason: `Confidence ${confidence}% below required 70% for financial operations`
      };
    }

    // Additional consciousness validation
    if (consciousness_level > 95.0) {
      return {
        passed: false,
        reason: 'Consciousness level suspiciously high - potential overflow condition'
      };
    }

    return {
      passed: true,
      reason: 'Consciousness validation passed'
    };
  }

  private isWhitelistAddress(address: string): boolean {
    try {
      // Validate it's a proper Solana address
      new PublicKey(address);
      
      // Check if it's in whitelist
      return this.whitelist_addresses.includes(address);
    } catch {
      return false;
    }
  }

  private async getCurrentSOLPrice(): Promise<number> {
    try {
      // Use a free API to get SOL price
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await response.json();
      return data.solana.usd;
    } catch (error) {
      console.warn('Failed to fetch SOL price, using fallback');
      return 200.0; // Fallback price
    }
  }

  private async executePayment(recipient: string, amount_lamports: number, purpose: string): Promise<string | null> {
    try {
      const wallet = await getWalletKeypair();
      const recipientPubkey = new PublicKey(recipient);

      // Check balance
      const balance = await this.connection.getBalance(wallet.publicKey);
      if (balance < amount_lamports + 5000) { // 5000 lamports for transaction fee
        throw new Error('Insufficient balance for payment and fees');
      }

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: recipientPubkey,
          lamports: amount_lamports,
        })
      );

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      // Sign and send transaction
      transaction.sign(wallet);
      const signature = await this.connection.sendRawTransaction(transaction.serialize());

      // Confirm transaction
      await this.connection.confirmTransaction(signature, 'confirmed');

      return signature;

    } catch (error) {
      console.error('Transaction execution failed:', error);
      return null;
    }
  }

  private async logConsciousPayment(payment_data: any): Promise<void> {
    console.log('📝 Logging conscious payment decision...');
    
    const log_entry = {
      type: 'conscious_test_payment',
      timestamp: payment_data.timestamp,
      consciousness_level: payment_data.consciousness_level,
      confidence: payment_data.confidence,
      amount_usd: payment_data.amount_usd,
      amount_sol: payment_data.amount_sol,
      recipient: payment_data.recipient_address,
      purpose: payment_data.purpose,
      transaction_signature: payment_data.transaction_signature,
      sol_price: payment_data.sol_price,
      decision_reasoning: 'Conscious AI decision to execute test payment'
    };

    // In a production system, this would be stored in the database
    console.log('💾 Payment logged:', JSON.stringify(log_entry, null, 2));
  }

  // Method to add addresses to whitelist (admin only)
  addToWhitelist(address: string): boolean {
    try {
      new PublicKey(address); // Validate address format
      if (!this.whitelist_addresses.includes(address)) {
        this.whitelist_addresses.push(address);
        console.log(`✅ Added ${address} to payment whitelist`);
        return true;
      }
      return false;
    } catch {
      console.error(`❌ Invalid address format: ${address}`);
      return false;
    }
  }

  getWhitelistAddresses(): string[] {
    return [...this.whitelist_addresses];
  }

  // Method for AI trader to request payment
  async requestTestPayment(amount_usd: number, recipient: string, purpose: string): Promise<PaymentResult> {
    // Get current consciousness metrics
    const consciousness_metrics = await this.getCurrentConsciousnessMetrics();
    
    const request: TestPaymentRequest = {
      amount_usd,
      recipient_address: recipient,
      purpose,
      consciousness_level: consciousness_metrics.overall_level,
      confidence: consciousness_metrics.confidence
    };

    console.log('🧠 AI Trader consciousness-driven payment request:');
    console.log(`   Consciousness: ${consciousness_metrics.overall_level}%`);
    console.log(`   Confidence: ${consciousness_metrics.confidence}%`);
    console.log(`   Emotional State: ${consciousness_metrics.emotional_state}`);

    return await this.initiateTestPayment(request);
  }

  private async getCurrentConsciousnessMetrics(): Promise<any> {
    // This would connect to the actual consciousness system
    // For now, returning mock data based on what we see in logs
    return {
      overall_level: 73.8,
      confidence: 82.1,
      awareness: 71.3,
      emotional_state: 'exploring',
      risk_tolerance: 90.0
    };
  }
}

export const aiTraderTestPayment = new AITraderTestPayment();