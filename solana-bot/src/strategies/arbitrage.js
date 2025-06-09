import { logger } from '../logger.js';
import { config } from '../config.js';

export class ArbitrageStrategy {
  constructor(trader, walletManager) {
    this.trader = trader;
    this.walletManager = walletManager;
    this.activeOpportunities = new Map();
    this.executedTrades = [];
    this.dailyTradeCount = 0;
    this.lastResetDate = new Date().toDateString();
  }

  async findOpportunities() {
    try {
      // Reset daily trade count if new day
      const currentDate = new Date().toDateString();
      if (currentDate !== this.lastResetDate) {
        this.dailyTradeCount = 0;
        this.lastResetDate = currentDate;
        logger.info('Daily trade count reset');
      }

      // Check if we've hit daily limit
      if (this.dailyTradeCount >= config.maxDailyTrades) {
        logger.warn('Daily trade limit reached');
        return [];
      }

      // In demo mode, simulate opportunities
      if (!config.privateKey) {
        return this.generateDemoOpportunities();
      }

      const opportunities = await this.trader.findArbitrageOpportunities();
      
      if (opportunities.length > 0) {
        logger.opportunity(`Found ${opportunities.length} arbitrage opportunities`);
        opportunities.forEach(opp => {
          logger.debug(`Arbitrage: ${opp.path} - ${opp.profit.toFixed(4)}% profit`);
        });
      }

      return opportunities;
    } catch (error) {
      logger.error('Failed to find arbitrage opportunities', error);
      return [];
    }
  }

  generateDemoOpportunities() {
    // VibeCoding demo - realistic but simulated opportunities
    const demoOpportunities = [
      {
        path: 'RAY -> USDC -> RAY',
        profit: 0.8 + Math.random() * 0.4, // 0.8-1.2% profit
        inputAmount: 1000000,
        outputAmount: 1008000 + Math.random() * 4000,
        demo: true
      },
      {
        path: 'SRM -> SOL -> SRM', 
        profit: 0.5 + Math.random() * 0.3,
        inputAmount: 1000000,
        outputAmount: 1005000 + Math.random() * 3000,
        demo: true
      }
    ];

    // Only show opportunities occasionally to simulate realistic market conditions
    return Math.random() > 0.7 ? demoOpportunities.slice(0, 1) : [];
  }

  async evaluateOpportunity(opportunity) {
    try {
      // Minimum profit threshold check
      if (opportunity.profit < config.minProfitThreshold * 100) {
        return { viable: false, reason: 'Profit below threshold' };
      }

      // Pizza kitchen reliability check - conservative approach
      const tokenSymbol = opportunity.path.split(' -> ')[0];
      const requiredBalance = opportunity.inputAmount / 1000000;
      
      await this.walletManager.updateAllBalances();
      const available = this.walletManager.balances.get(tokenSymbol) || 0;
      
      if (available < requiredBalance) {
        return { 
          viable: false, 
          reason: `Insufficient ${tokenSymbol} balance`,
          required: requiredBalance,
          available
        };
      }

      // Estimate gas costs
      const txCost = await this.walletManager.getTransactionCost();
      const estimatedProfit = (opportunity.profit / 100) * requiredBalance;
      const netProfit = estimatedProfit - (txCost * 2); // Two transactions
      
      if (netProfit <= 0) {
        return { 
          viable: false, 
          reason: 'Gas costs exceed profit',
          estimatedProfit,
          gasCost: txCost * 2
        };
      }

      return { 
        viable: true, 
        netProfit,
        estimatedProfit,
        gasCost: txCost * 2
      };
    } catch (error) {
      logger.error('Failed to evaluate opportunity', error);
      return { viable: false, reason: 'Evaluation error' };
    }
  }

  async executeArbitrage(opportunity) {
    if (!config.tradingEnabled) {
      logger.warn('Trading disabled - skipping arbitrage execution');
      return null;
    }

    if (config.emergencyStop) {
      logger.error('Emergency stop activated - halting all trading');
      return null;
    }

    try {
      const evaluation = await this.evaluateOpportunity(opportunity);
      
      if (!evaluation.viable) {
        logger.debug(`Skipping opportunity: ${evaluation.reason}`);
        return null;
      }

      // Demo mode execution
      if (opportunity.demo || !config.privateKey) {
        return await this.executeDemoArbitrage(opportunity, evaluation);
      }

      logger.info(`Executing arbitrage: ${opportunity.path}`);
      logger.info(`Expected profit: ${evaluation.netProfit.toFixed(6)} SOL`);

      const startTime = Date.now();
      const [tokenA, tokenB] = opportunity.path.split(' -> ');
      const tokenAMint = config.TOKENS[tokenA];
      const tokenBMint = config.TOKENS[tokenB];
      
      // Execute first trade: A -> B
      logger.info(`Step 1: ${tokenA} -> ${tokenB}`);
      const trade1 = await this.trader.executeSwap(
        tokenAMint,
        tokenBMint,
        opportunity.inputAmount,
        config.slippageTolerance
      );

      // Wait for settlement
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Execute second trade: B -> A
      logger.info(`Step 2: ${tokenB} -> ${tokenA}`);
      const trade2 = await this.trader.executeSwap(
        tokenBMint,
        tokenAMint,
        trade1.outputAmount,
        config.slippageTolerance
      );

      const executionTime = Date.now() - startTime;
      const actualProfit = (trade2.outputAmount - opportunity.inputAmount) / 1000000;

      // Record the arbitrage
      const arbitrageRecord = {
        timestamp: new Date(),
        path: opportunity.path,
        inputAmount: opportunity.inputAmount / 1000000,
        outputAmount: trade2.outputAmount / 1000000,
        expectedProfit: evaluation.estimatedProfit,
        actualProfit,
        executionTime,
        trade1Signature: trade1.signature,
        trade2Signature: trade2.signature
      };

      this.executedTrades.push(arbitrageRecord);
      this.dailyTradeCount++;

      logger.trade('ARBITRAGE', opportunity.path, actualProfit, 'COMPLETED');
      logger.info(`Arbitrage completed in ${executionTime}ms`);
      logger.info(`Actual profit: ${actualProfit.toFixed(6)} SOL`);

      return arbitrageRecord;
    } catch (error) {
      logger.error('Arbitrage execution failed', error);
      return null;
    }
  }

  async executeDemoArbitrage(opportunity, evaluation) {
    logger.info(`DEMO: Executing arbitrage: ${opportunity.path}`);
    logger.info(`DEMO: Expected profit: ${evaluation.netProfit.toFixed(6)} SOL`);

    // Simulate realistic execution time
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    const executionTime = Date.now() - startTime;
    const actualProfit = evaluation.estimatedProfit * (0.9 + Math.random() * 0.2); // 90-110% of expected

    const demoRecord = {
      timestamp: new Date(),
      path: opportunity.path,
      inputAmount: opportunity.inputAmount / 1000000,
      outputAmount: (opportunity.inputAmount + actualProfit * 1000000) / 1000000,
      expectedProfit: evaluation.estimatedProfit,
      actualProfit,
      executionTime,
      demo: true,
      trade1Signature: `demo_${Date.now()}_1`,
      trade2Signature: `demo_${Date.now()}_2`
    };

    this.executedTrades.push(demoRecord);
    this.dailyTradeCount++;

    logger.trade('DEMO ARBITRAGE', opportunity.path, actualProfit, 'SIMULATED');
    logger.info(`DEMO: Arbitrage completed in ${executionTime}ms`);
    logger.info(`DEMO: Simulated profit: ${actualProfit.toFixed(6)} SOL`);

    return demoRecord;
  }

  getPerformanceStats() {
    const totalTrades = this.executedTrades.length;
    const totalProfit = this.executedTrades.reduce((sum, trade) => sum + trade.actualProfit, 0);
    const avgProfit = totalTrades > 0 ? totalProfit / totalTrades : 0;
    const successRate = totalTrades > 0 ? (this.executedTrades.filter(t => t.actualProfit > 0).length / totalTrades) * 100 : 0;

    return {
      totalTrades,
      totalProfit,
      avgProfit,
      successRate,
      dailyTradeCount: this.dailyTradeCount,
      lastExecuted: this.executedTrades.length > 0 ? this.executedTrades[this.executedTrades.length - 1].timestamp : null,
      demoMode: !config.privateKey
    };
  }
}

export default ArbitrageStrategy;