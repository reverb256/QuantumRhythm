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

// Simple demonstration mode if no wallet configured
if (!config.privateKey) {
  logger.info('No wallet configured - running in demonstration mode');
  logger.info('This will show market analysis without executing trades');
  
  // Basic market monitoring demo
  setInterval(async () => {
    try {
      logger.info('Monitoring market opportunities...');
      logger.info('Demo mode: Would analyze Jupiter DEX for arbitrage');
      logger.info('Demo mode: Would check momentum indicators');
      logger.info('Add PRIVATE_KEY to .env for live trading');
    } catch (error) {
      logger.error('Demo monitoring error', error);
    }
  }, config.monitoringInterval);
  
} else {
  // Import and start the full bot
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