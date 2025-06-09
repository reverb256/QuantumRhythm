import cron from 'node-cron';
import { config, validateConfig } from './config.js';
import { logger } from './logger.js';
import WalletManager from './wallet.js';
import JupiterTrader from './jupiter.js';
import ArbitrageStrategy from './strategies/arbitrage.js';
import SecurityManager from './security.js';
import CloudflareComplianceManager from './cloudflare-compliance.js';

class SolanaBot {
  constructor() {
    this.walletManager = new WalletManager();
    this.trader = new JupiterTrader();
    this.arbitrageStrategy = new ArbitrageStrategy(this.trader, this.walletManager);
    this.security = new SecurityManager();
    this.cloudflare = new CloudflareComplianceManager();
    this.isRunning = false;
    this.lastHeartbeat = Date.now();
    this.demoMode = !config.privateKey;
  }

  async initialize() {
    try {
      logger.info('Initializing Solana Trading Bot...');
      
      // Validate configuration
      if (!this.demoMode) {
        validateConfig();
        logger.info('Configuration validated');
      } else {
        logger.info('Demo mode - configuration validation skipped');
      }
      
      // Security health check
      const healthCheck = this.security.performSecurityHealthCheck();
      if (!healthCheck.healthy) {
        logger.warn('Security health check issues detected', healthCheck.details);
      } else {
        logger.info('Security systems operational');
      }

      // Cloudflare compliance check
      const compliance = this.cloudflare.ensureStaticHostingCompliance();
      logger.info('Cloudflare/GitHub Pages compliance verified');
      
      // Update initial balances
      await this.walletManager.updateAllBalances();
      logger.info('Wallet balances loaded');
      
      // Test connection in live mode
      if (!this.demoMode) {
        const balance = await this.walletManager.getSOLBalance();
        if (balance === 0) {
          logger.warn('Wallet has no SOL balance - trading may fail');
        }
      }
      
      logger.info('Bot initialization complete');
      return true;
    } catch (error) {
      logger.error('Failed to initialize bot', error);
      return false;
    }
  }

  async runMainLoop() {
    if (config.emergencyStop) {
      logger.error('Emergency stop activated - bot halted');
      return;
    }

    try {
      this.lastHeartbeat = Date.now();
      
      // Check system locks
      const lockStatus = this.security.isSystemLocked();
      if (lockStatus.locked) {
        logger.warn(`System locked: ${lockStatus.reason}`);
        return;
      }

      // Run arbitrage strategy
      const opportunities = await this.arbitrageStrategy.findOpportunities();
      if (opportunities.length > 0) {
        const bestOpportunity = opportunities[0];
        
        if (this.demoMode) {
          logger.opportunity(`DEMO: Best opportunity - ${bestOpportunity.path} (${bestOpportunity.profit.toFixed(2)}% profit)`);
        }
        
        if (config.tradingEnabled || this.demoMode) {
          await this.arbitrageStrategy.executeArbitrage(bestOpportunity);
        }
      }

      // VibeCoding reliability check - monitor performance
      this.performVibeCodingChecks();

      // Log performance stats periodically
      if (Date.now() % (5 * 60 * 1000) < config.monitoringInterval) {
        this.logPerformanceStats();
      }

    } catch (error) {
      logger.error('Error in main loop', error);
      this.handleLoopError(error);
    }
  }

  performVibeCodingChecks() {
    // Pizza kitchen reliability - check for consistency
    const stats = this.arbitrageStrategy.getPerformanceStats();
    
    if (stats.totalTrades > 10 && stats.successRate < 50) {
      logger.safety('Success rate below 50% - applying small-town caution', {
        successRate: stats.successRate,
        totalTrades: stats.totalTrades
      });
      
      // Temporarily reduce trading frequency
      config.monitoringInterval = Math.min(config.monitoringInterval * 1.5, 30000);
    }

    // Rhythm gaming precision - check timing consistency  
    if (this.lastHeartbeat && Date.now() - this.lastHeartbeat > config.monitoringInterval * 2) {
      logger.warn('Timing inconsistency detected - adjusting to gaming rhythm precision');
    }
  }

  handleLoopError(error) {
    const errorCount = this.errorCount || 0;
    this.errorCount = errorCount + 1;
    
    // VibeCoding emergency protocols
    if (this.errorCount > 3) {
      logger.error('Multiple consecutive errors - activating VibeCoding safety protocols');
      
      // Emergency pause with pizza kitchen reliability mindset
      this.security.activateEmergencyStop('Consecutive errors detected', 300000); // 5 minutes
      this.errorCount = 0;
    }
  }

  logPerformanceStats() {
    const arbitrageStats = this.arbitrageStrategy.getPerformanceStats();
    const walletStats = this.walletManager.getWalletPerformanceStats();
    
    logger.info('=== VIBECODING PERFORMANCE STATS ===');
    
    if (this.demoMode) {
      logger.info('MODE: Demo/GitHub Pages Compatible');
    }
    
    logger.info(`Arbitrage - Trades: ${arbitrageStats.totalTrades}, Profit: ${arbitrageStats.totalProfit.toFixed(6)} SOL`);
    logger.info(`Success Rate: ${arbitrageStats.successRate.toFixed(1)}%`);
    logger.info(`Daily Trade Count: ${arbitrageStats.dailyTradeCount}/${config.maxDailyTrades}`);
    logger.info(`Wallet - Success Rate: ${walletStats.successRate}%`);
    logger.info('===================================');
  }

  async start() {
    if (this.isRunning) {
      logger.warn('Bot is already running');
      return;
    }

    const initialized = await this.initialize();
    if (!initialized) {
      logger.error('Bot initialization failed - cannot start');
      return;
    }

    this.isRunning = true;
    logger.info('Starting Solana Trading Bot...');
    
    if (this.demoMode) {
      logger.info('Demo mode active - VibeCoding methodology demonstration');
    }
    
    // Main monitoring loop
    const interval = setInterval(async () => {
      if (!this.isRunning) {
        clearInterval(interval);
        return;
      }
      
      await this.runMainLoop();
    }, config.monitoringInterval);

    // Heartbeat monitoring
    cron.schedule('*/30 * * * * *', () => {
      const timeSinceHeartbeat = Date.now() - this.lastHeartbeat;
      if (timeSinceHeartbeat > config.monitoringInterval * 3) {
        logger.error('Bot heartbeat lost - possible hang detected');
      }
    });

    // Daily reset schedule
    cron.schedule('0 0 * * *', () => {
      logger.info('Daily reset - clearing trade history');
      this.arbitrageStrategy.dailyTradeCount = 0;
    });

    // Periodic balance updates
    cron.schedule('*/5 * * * *', async () => {
      await this.walletManager.updateAllBalances();
    });

    // VibeCoding security check schedule
    cron.schedule('*/15 * * * *', () => {
      const healthCheck = this.security.performSecurityHealthCheck();
      if (!healthCheck.healthy) {
        logger.warn('Security health check failed', healthCheck.details);
      }
    });

    logger.info('Bot started successfully');
    logger.info(`Monitoring interval: ${config.monitoringInterval}ms`);
    logger.info(`Trading enabled: ${config.tradingEnabled}`);
    logger.info(`VibeCoding safety protocols: Active`);
  }

  stop() {
    if (!this.isRunning) {
      logger.warn('Bot is not running');
      return;
    }

    this.isRunning = false;
    logger.info('Stopping Solana Trading Bot...');
    
    // Wait for current operations to complete
    setTimeout(() => {
      logger.info('Bot stopped successfully - VibeCoding shutdown complete');
      process.exit(0);
    }, 2000);
  }

  // Emergency stop function
  emergencyStop() {
    logger.error('EMERGENCY STOP ACTIVATED - VIBECODING SAFETY PROTOCOL');
    this.security.activateEmergencyStop('Manual emergency activation');
    this.stop();
  }
}

export default SolanaBot;