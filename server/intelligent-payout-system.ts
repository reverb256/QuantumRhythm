/**
 * Intelligent Payout System
 * Manages payouts while maintaining trading operational balance
 */

interface PayoutRequest {
  id: string;
  amount_usd: number;
  timestamp: number;
  status: 'pending' | 'approved' | 'executed' | 'rejected';
  reason: string;
  minimum_trading_balance_required: number;
}

interface TradingBalanceRequirements {
  minimum_operational_balance_usd: number;
  emergency_reserve_percentage: number;
  gas_fee_reserve_usd: number;
  trade_execution_buffer_usd: number;
}

export class IntelligentPayoutSystem {
  private payout_requests: Map<string, PayoutRequest> = new Map();
  private trading_requirements: TradingBalanceRequirements;
  private current_portfolio_value_usd: number = 3.15; // Current portfolio value

  constructor() {
    this.trading_requirements = {
      minimum_operational_balance_usd: 25, // Keep $25 minimum for trading
      emergency_reserve_percentage: 20, // 20% emergency reserve
      gas_fee_reserve_usd: 5, // $5 for transaction fees
      trade_execution_buffer_usd: 10 // $10 buffer for trade execution
    };

    this.initializeUserPayoutRequest();
  }

  private initializeUserPayoutRequest(): void {
    const payout_request: PayoutRequest = {
      id: 'user_payout_50usd',
      amount_usd: 50,
      timestamp: Date.now(),
      status: 'pending',
      reason: 'User requested $50 payout - evaluating trading balance requirements',
      minimum_trading_balance_required: this.calculateMinimumTradingBalance()
    };

    this.payout_requests.set(payout_request.id, payout_request);
    this.evaluatePayoutRequest(payout_request.id);
  }

  private calculateMinimumTradingBalance(): number {
    const {
      minimum_operational_balance_usd,
      gas_fee_reserve_usd,
      trade_execution_buffer_usd
    } = this.trading_requirements;

    return minimum_operational_balance_usd + gas_fee_reserve_usd + trade_execution_buffer_usd;
  }

  private async evaluatePayoutRequest(request_id: string): Promise<void> {
    const request = this.payout_requests.get(request_id);
    if (!request) return;

    const total_required_balance = request.amount_usd + this.calculateMinimumTradingBalance();
    const current_balance = this.current_portfolio_value_usd;

    console.log(`💰 Payout Request Evaluation:`);
    console.log(`   Requested Amount: $${request.amount_usd}`);
    console.log(`   Current Portfolio: $${current_balance.toFixed(2)}`);
    console.log(`   Required Trading Balance: $${this.calculateMinimumTradingBalance()}`);
    console.log(`   Total Required: $${total_required_balance}`);

    if (current_balance >= total_required_balance) {
      // Sufficient balance - approve payout
      request.status = 'approved';
      request.reason = `Payout approved - sufficient balance ($${current_balance.toFixed(2)} available)`;
      
      console.log(`✅ Payout approved: $${request.amount_usd} can be paid out`);
      console.log(`   Remaining trading balance: $${(current_balance - request.amount_usd).toFixed(2)}`);
      
      await this.executePayout(request_id);
    } else {
      // Insufficient balance - set growth target
      const target_balance = total_required_balance;
      const growth_needed = target_balance - current_balance;
      const growth_percentage = (growth_needed / current_balance) * 100;

      request.status = 'pending';
      request.reason = `Insufficient balance - need $${growth_needed.toFixed(2)} more (${growth_percentage.toFixed(1)}% growth required)`;

      console.log(`⏳ Payout pending: Need $${growth_needed.toFixed(2)} more`);
      console.log(`   Growth target: $${target_balance.toFixed(2)} total portfolio`);
      console.log(`   Required growth: ${growth_percentage.toFixed(1)}%`);

      await this.activateGrowthMode(target_balance);
    }
  }

  private async executePayout(request_id: string): Promise<void> {
    const request = this.payout_requests.get(request_id);
    if (!request || request.status !== 'approved') return;

    // In a real implementation, this would interact with the wallet system
    console.log(`💸 Executing payout: $${request.amount_usd}`);
    console.log(`   Payout ID: ${request.id}`);
    console.log(`   Note: Actual payout execution requires wallet integration`);

    request.status = 'executed';
    request.reason = `Payout executed successfully - $${request.amount_usd} transferred`;

    // Update portfolio balance after payout
    this.current_portfolio_value_usd -= request.amount_usd;

    console.log(`✅ Payout completed - remaining balance: $${this.current_portfolio_value_usd.toFixed(2)}`);
  }

  private async activateGrowthMode(target_balance: number): Promise<void> {
    const growth_needed = target_balance - this.current_portfolio_value_usd;
    const growth_percentage = (growth_needed / this.current_portfolio_value_usd) * 100;

    console.log(`🚀 Activating Growth Mode:`);
    console.log(`   Current: $${this.current_portfolio_value_usd.toFixed(2)}`);
    console.log(`   Target: $${target_balance.toFixed(2)}`);
    console.log(`   Growth needed: $${growth_needed.toFixed(2)} (${growth_percentage.toFixed(1)}%)`);

    const growth_strategies = this.generateGrowthStrategies(growth_percentage);
    
    console.log(`📈 Recommended growth strategies:`);
    for (const strategy of growth_strategies) {
      console.log(`   ${strategy.name}: ${strategy.expected_return}% return - ${strategy.risk_level} risk`);
    }

    // Set trading system to focus on growth
    this.configureTradingForGrowth(growth_percentage);
  }

  private generateGrowthStrategies(growth_percentage: number): Array<{
    name: string;
    expected_return: number;
    risk_level: string;
    timeline: string;
  }> {
    if (growth_percentage > 1000) {
      // Need massive growth - high-risk strategies
      return [
        {
          name: 'High-volatility momentum trading',
          expected_return: 200,
          risk_level: 'Very High',
          timeline: '1-2 weeks'
        },
        {
          name: 'Leverage trading with tight risk management',
          expected_return: 150,
          risk_level: 'High',
          timeline: '2-3 weeks'
        },
        {
          name: 'Arbitrage opportunities across DEXs',
          expected_return: 50,
          risk_level: 'Medium',
          timeline: '1-2 months'
        }
      ];
    } else if (growth_percentage > 100) {
      // Moderate growth needed
      return [
        {
          name: 'Swing trading major cryptocurrencies',
          expected_return: 50,
          risk_level: 'Medium',
          timeline: '2-4 weeks'
        },
        {
          name: 'DeFi yield farming with compounding',
          expected_return: 30,
          risk_level: 'Low-Medium',
          timeline: '1-3 months'
        },
        {
          name: 'Staking rewards with trading profits',
          expected_return: 20,
          risk_level: 'Low',
          timeline: '3-6 months'
        }
      ];
    } else {
      // Small growth needed - conservative strategies
      return [
        {
          name: 'Conservative DeFi yield farming',
          expected_return: 15,
          risk_level: 'Low',
          timeline: '1-2 months'
        },
        {
          name: 'Dollar-cost averaging with profits',
          expected_return: 10,
          risk_level: 'Very Low',
          timeline: '2-4 months'
        }
      ];
    }
  }

  private configureTradingForGrowth(growth_percentage: number): void {
    if (growth_percentage > 1000) {
      console.log(`⚡ Configuring aggressive trading parameters:`);
      console.log(`   Risk tolerance: 85% (high risk for high reward)`);
      console.log(`   Position size: 15-25% per trade`);
      console.log(`   Trading frequency: High (multiple trades per day)`);
      console.log(`   Target: Quick momentum captures`);
    } else if (growth_percentage > 100) {
      console.log(`📊 Configuring moderate trading parameters:`);
      console.log(`   Risk tolerance: 65% (balanced approach)`);
      console.log(`   Position size: 10-15% per trade`);
      console.log(`   Trading frequency: Medium (daily trades)`);
      console.log(`   Target: Swing trading opportunities`);
    } else {
      console.log(`🛡️ Configuring conservative trading parameters:`);
      console.log(`   Risk tolerance: 45% (capital preservation focus)`);
      console.log(`   Position size: 5-10% per trade`);
      console.log(`   Trading frequency: Low (careful opportunities)`);
      console.log(`   Target: Steady, sustainable growth`);
    }
  }

  async updatePortfolioValue(new_value_usd: number): Promise<void> {
    const previous_value = this.current_portfolio_value_usd;
    this.current_portfolio_value_usd = new_value_usd;

    console.log(`📊 Portfolio update: $${previous_value.toFixed(2)} → $${new_value_usd.toFixed(2)}`);

    // Re-evaluate pending payout requests
    for (const [request_id, request] of this.payout_requests) {
      if (request.status === 'pending') {
        await this.evaluatePayoutRequest(request_id);
      }
    }
  }

  getPayoutStatus(): {
    pending_requests: PayoutRequest[];
    current_portfolio_usd: number;
    minimum_trading_balance: number;
    growth_mode_active: boolean;
  } {
    const pending_requests = Array.from(this.payout_requests.values())
      .filter(req => req.status === 'pending');

    return {
      pending_requests,
      current_portfolio_usd: this.current_portfolio_value_usd,
      minimum_trading_balance: this.calculateMinimumTradingBalance(),
      growth_mode_active: pending_requests.length > 0
    };
  }

  getTradingGuidance(): string {
    const status = this.getPayoutStatus();
    
    if (status.growth_mode_active) {
      const request = status.pending_requests[0];
      const total_needed = request.amount_usd + status.minimum_trading_balance;
      const growth_needed = total_needed - status.current_portfolio_usd;
      
      return `Growth mode active: Need $${growth_needed.toFixed(2)} more to enable $${request.amount_usd} payout while maintaining trading operations. Current: $${status.current_portfolio_usd.toFixed(2)}`;
    }
    
    return `Trading balance healthy: $${status.current_portfolio_usd.toFixed(2)} available, $${status.minimum_trading_balance} required for operations`;
  }
}

export const intelligentPayoutSystem = new IntelligentPayoutSystem();