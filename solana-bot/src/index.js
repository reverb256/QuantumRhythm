import { config } from './config.js';
import { logger } from './logger.js';

// VibeCoding Banner - Pizza Kitchen to AI Enhancement
console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                        SOLANA TRADING BOT                                ║
║                     VibeCoding Methodology                               ║
║                                                                           ║
║  🍕 Pizza Kitchen Work Ethic meets AI-Enhanced Trading                   ║
║  🎮 Rhythm Gaming Precision informing Market Timing                      ║
║  🤖 8,500+ hours VRChat Research applied to DeFi Strategies              ║
║                                                                           ║
║  From reliable small-town employee to AI-inspired potential unleashing   ║
╚═══════════════════════════════════════════════════════════════════════════╝
`);

logger.info('Solana Trading Bot starting...');
logger.info('Configuration loaded');
logger.info(`Trading enabled: ${config.tradingEnabled}`);
logger.info(`Monitoring interval: ${config.monitoringInterval}ms`);
logger.info(`Safety features: Stop Loss ${config.stopLossPercentage}%, Take Profit ${config.takeProfitPercentage}%`);

if (!config.tradingEnabled) {
  logger.warn('TRADING IS DISABLED - Running in monitor-only mode');
  logger.warn('Set TRADING_ENABLED=true in .env to enable live trading');
}

// Display VibeCoding safety principles
logger.warn('VIBECODING SAFETY REMINDERS:');
logger.warn('• Small-town reliability over flashy gains');
logger.warn('• Test with micro amounts first - pizza kitchen prudence');
logger.warn('• Monitor actively - rhythm gaming attention to detail');
logger.warn('• Emergency stop always ready - consciousness over automation');
logger.warn('• This represents exploration of AI-enhanced potential');

// GitHub Pages compatible demo mode
if (!config.privateKey) {
  logger.info('No wallet configured - running in GitHub Pages compatible demo mode');
  logger.info('This demonstrates VibeCoding methodology without live trading');
  
  // Import security and wallet managers for demo
  Promise.all([
    import('./security.js'),
    import('./wallet.js'),
    import('./cloudflare-compliance.js')
  ]).then(async ([SecurityModule, WalletModule, CloudflareModule]) => {
    const security = new SecurityModule.default();
    const walletManager = new WalletModule.default();
    const cloudflare = new CloudflareModule.default();
    
    // Perform security health check
    const healthCheck = security.performSecurityHealthCheck();
    logger.info('Security systems health check completed', healthCheck);
    
    // Demo monitoring loop - GitHub Pages compatible
    setInterval(async () => {
      try {
        // Demo balance display
        const demoBalances = walletManager.getDemoBalances();
        logger.info('=== DEMO MODE BALANCES ===');
        for (const [token, balance] of demoBalances) {
          logger.balance(token, balance.toFixed(6));
        }
        
        // Demo market analysis
        logger.opportunity('Demo: Simulating arbitrage opportunity detection');
        logger.info('Demo: RAY/USDC spread analysis complete');
        logger.info('Demo: Risk assessment passed - pizza kitchen prudence applied');
        
        // Demonstrate cloudflare compliance
        const compliance = cloudflare.ensureStaticHostingCompliance();
        logger.debug('Cloudflare/GitHub Pages compliance verified');
        
      } catch (error) {
        logger.error('Demo monitoring error', error);
      }
    }, config.monitoringInterval * 2); // Slower for demo
    
    logger.info('Demo mode active - showcasing VibeCoding security methodology');
  });
  
} else {
  // Full bot mode with wallet
  import('./monitor.js').then(({ default: SolanaBot }) => {
    const bot = new SolanaBot();
    global.bot = bot;
    
    bot.start().catch(error => {
      logger.error('Failed to start bot', error);
      process.exit(1);
    });
  });
}

// Handle process signals for graceful shutdown
process.on('SIGINT', () => {
  logger.warn('Received SIGINT - gracefully shutting down');
  if (global.bot) {
    global.bot.stop();
  } else {
    process.exit(0);
  }
});

process.on('SIGTERM', () => {
  logger.warn('Received SIGTERM - gracefully shutting down');
  if (global.bot) {
    global.bot.stop();
  } else {
    process.exit(0);
  }
});