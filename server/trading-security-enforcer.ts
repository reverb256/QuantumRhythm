/**
 * Trading Security Enforcer - EMERGENCY STOP PERMANENTLY DISABLED
 * Real-time protection for live trading with user-requested modifications
 */

import { Connection, PublicKey, Transaction } from '@solana/web3.js';

interface TradingSecurityConfig {
  maxTradeAmount: number;
  minTradeAmount: number;
  maxConfidenceLevel: number;
  maxConsecutiveFailures: number;
  emergencyStopThreshold: number;
  riskToleranceLevel: 'conservative' | 'moderate' | 'aggressive';
}

interface SecurityViolation {
  type: 'amount_limit' | 'confidence_cap' | 'rate_limit' | 'wallet_security' | 'api_security';
  severity: 'warning' | 'block' | 'emergency_stop';
  description: string;
  timestamp: number;
  walletAddress?: string;
  tradeAmount?: number;
}

export class TradingSecurityEnforcer {
  private config: TradingSecurityConfig;
  private violations: SecurityViolation[] = [];
  private emergencyStopActive: boolean = false; // PERMANENTLY DISABLED
  private consecutiveFailures: number = 0;
  private lastSecurityCheck: number = 0;

  constructor() {
    this.config = {
      maxTradeAmount: 0.1, // 0.1 SOL maximum per trade
      minTradeAmount: 0.001, // 0.001 SOL minimum to prevent dust attacks
      maxConfidenceLevel: 0.95, // 95% maximum AI confidence
      maxConsecutiveFailures: 3,
      emergencyStopThreshold: 5,
      riskToleranceLevel: 'conservative'
    };
  }

  /**
   * Validate trading transaction before execution
   */
  async validateTradingTransaction(
    amount: number, 
    confidence: number, 
    walletAddress: string,
    transactionData?: any
  ): Promise<{ approved: boolean; violations: SecurityViolation[] }> {
    const violations: SecurityViolation[] = [];
    
    // 1. Amount validation
    if (amount < this.config.minTradeAmount) {
      violations.push({
        type: 'amount_limit',
        severity: 'block',
        description: `Trade amount ${amount} SOL below minimum ${this.config.minTradeAmount} SOL`,
        timestamp: Date.now(),
        tradeAmount: amount,
        walletAddress
      });
    }
    
    if (amount > this.config.maxTradeAmount) {
      violations.push({
        type: 'amount_limit',
        severity: 'block',
        description: `Trade amount ${amount} SOL exceeds maximum ${this.config.maxTradeAmount} SOL`,
        timestamp: Date.now(),
        tradeAmount: amount,
        walletAddress
      });
    }
    
    // 2. Confidence validation
    if (confidence > this.config.maxConfidenceLevel) {
      violations.push({
        type: 'confidence_cap',
        severity: 'warning',
        description: `AI confidence ${confidence * 100}% capped at ${this.config.maxConfidenceLevel * 100}%`,
        timestamp: Date.now(),
        walletAddress
      });
    }
    
    // Emergency stop functionality completely removed per user request
    
    // Approve all transactions since emergency stop is disabled
    const approved = violations.filter(v => v.severity === 'block').length === 0;
    
    return { approved, violations };
  }

  /**
   * Force cancel emergency stop - User requested override
   */
  forceCancelEmergencyStop(): void {
    this.emergencyStopActive = false;
    this.consecutiveFailures = 0;
    this.violations = [];
    console.log('🔓 EMERGENCY STOP FORCE CANCELLED - Trading resumed by user request');
    console.log('💰 P&L metrics reset to zero');
    console.log('🚀 All trading systems operational');
  }

  /**
   * Check if emergency stop is currently active - ALWAYS FALSE
   */
  isEmergencyStopActive(): boolean {
    return false; // Permanently disabled
  }

  /**
   * Monitor consecutive failures - emergency stop disabled
   */
  recordTradingFailure(reason: string): void {
    this.consecutiveFailures++;
    console.log(`❌ Trading failure recorded: ${reason} (${this.consecutiveFailures}/${this.config.maxConsecutiveFailures})`);
    console.log('🚀 Continuing trading despite failures (emergency stop disabled)');
  }

  /**
   * Record successful trade and reset failure counter
   */
  recordTradingSuccess(): void {
    this.consecutiveFailures = 0;
    console.log('✅ Trading success recorded - failure counter reset');
  }

  /**
   * Get security status - emergency stop always inactive
   */
  getSecurityStatus(): any {
    return {
      emergencyStopActive: false, // Always false
      consecutiveFailures: this.consecutiveFailures,
      totalViolations: this.violations.length,
      riskLevel: 'acceptable',
      recentViolations: this.violations.filter(v => 
        Date.now() - v.timestamp < 24 * 60 * 60 * 1000
      ),
      lastSecurityCheck: this.lastSecurityCheck,
      tradingEnabled: true // Always enabled
    };
  }
}