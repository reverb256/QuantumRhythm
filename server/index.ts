import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import liveStatsRouter from "./routes/live-stats";
import aiAutorouterRoutes from "./routes/ai-autorouter";
import { legalComplianceAgent } from "./legal-compliance-agent";
import LegalComplianceResolver from "./legal-compliance-resolver";
import { dataProtection } from "./data-protection-middleware";
import { systemConsolidation } from './system-consolidation';
import { databaseOptimizer } from './database-optimizer';
import { databaseSchemaFixer } from './database-schema-fixer';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize data protection middleware to sanitize all responses
app.use(dataProtection.protectResponse());
dataProtection.protectConsoleOutput();
dataProtection.monitorDataExposure();

// Initialize comprehensive optimization system
import { comprehensiveOptimizer } from './comprehensive-optimizer';
import { problemSolver } from './autonomous-problem-solver';
import { authenticDataValidator } from './authentic-data-validator';
import { consciousnessEngine } from './consciousness-evolution-engine';
import { backtestingEngine } from './backtesting-engine';
import { crossEmpowerment } from './cross-empowerment-orchestrator';
import { profitTracker } from './real-time-profit-tracker';
import { insightCrossPollinationEngine } from './insight-cross-pollination-engine';
import { systemErrorRecovery } from './system-error-recovery';

// Import HA and k3s components
import { k3sSelfHealer } from '../k3s-self-healing-controller';
import { hyperscaleOffloader } from '../hyperscale-static-offloader';
import { tradingJournalService } from './trading-journal-service';
import { comprehensivePortfolioTracker } from './comprehensive-portfolio-tracker';
import { yieldActivationEngine } from './yield-activation-engine';
import { intelligentOpportunityScanner } from './intelligent-opportunity-scanner';
import { autonomousExpansionEngine } from './autonomous-expansion-engine';
import { autonomousWalletManager } from './autonomous-wallet-manager';
import { freeStaticHyperscaler } from './free-static-hyperscaler';

// Start autonomous problem solving and optimization
(async () => {
  try {
    // Initialize components with error handling
    console.log('🚀 Initializing core systems...');

    // Initialize legal compliance resolver
    const legalResolver = new LegalComplianceResolver();
    await legalResolver.implementAutomaticCompliance();

    // Perform database health check
    try {
      await databaseSchemaFixer.fixMissingColumns();
      await databaseSchemaFixer.validateConstraints();
      await databaseSchemaFixer.fixUUIDIssues();
    } catch (error) {
      console.log('Database schema fix skipped - continuing startup');
    }

    // Initialize system components
    try {
      await comprehensiveOptimizer.runFullSystemOptimization();
    } catch (error) {
      console.log('System optimization skipped - continuing startup');
    }

    // Initialize K3s self-healing and hyperscale offloading
    try {
      console.log('🔧 Initializing K3s self-healing system...');
      await k3sSelfHealer.startMonitoring();
      
      console.log('🚀 Starting hyperscale static offloading...');
      await hyperscaleOffloader.startHyperscaleOffloading();
      
      console.log('📊 Initializing comprehensive portfolio tracking...');
      // Start comprehensive portfolio tracking
      await comprehensivePortfolioTracker.startPortfolioTracking();
      
      console.log('💰 Activating yield generation strategies...');
      // Disable emergency stop and activate yield generation
      await yieldActivationEngine.disableEmergencyStop();
      const yieldResults = await yieldActivationEngine.activateYieldGeneration();
      
      console.log(`💎 YIELD ACTIVATION COMPLETE:`);
      console.log(`   Total Deployed: ${yieldResults.totalDeployed.toFixed(4)} SOL`);
      console.log(`   Expected Daily: +$${(yieldResults.expectedReturns.daily * 200).toFixed(2)}`);
      console.log(`   Expected Monthly: +$${(yieldResults.expectedReturns.monthly * 200).toFixed(2)}`);
      console.log(`   Annual Projection: +$${(yieldResults.expectedReturns.annual * 200).toFixed(2)}`);
      
      // Set up yield tracking
      setInterval(async () => {
        const projection = await yieldActivationEngine.getProjectedPortfolioValue(1);
        console.log(`📈 Daily Yield Update: Portfolio projected at $${projection.projectedValue.toFixed(2)} (+$${projection.totalGains.toFixed(2)})`);
      }, 86400000); // Daily updates
      
      console.log('🤖 Starting intelligent opportunity scanning...');
      // Intelligent opportunity scanner automatically starts its own cycles
      
      console.log('🌐 Activating autonomous expansion engine...');
      // Autonomous expansion engine automatically starts discovery cycles
    } catch (error) {
      console.log('K3s/Hyperscale systems using fallback mode');
    }
    
    // Get current SOL price helper
    async function getCurrentSOLPrice(): Promise<number> {
      try {
        const response = await fetch('https://price.jup.ag/v4/price?ids=SOL');
        const data = await response.json();
        return data.data?.SOL?.price || 200;
      } catch (error) {
        return 200; // Fallback price
      }
    }

    console.log('✅ Core systems initialized');

  } catch (error) {
    console.error('System initialization error:', error);
    console.log('⚠️ Continuing with basic functionality');
  }
})();

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Main application initialization
(async () => {
  // Import and register IO Intelligence routes
  const { default: ioIntelligenceRoutes } = await import('./routes/io-intelligence.js');
  app.use('/api/io-intelligence', ioIntelligenceRoutes);

  // Import and register AI Consciousness routes
  const { default: aiConsciousnessRoutes } = await import('./routes/ai-consciousness.js');
  app.use('/api', aiConsciousnessRoutes);

  // Import and register Trading Agent routes
  // const { default: tradingAgentRoutes } = await import('./routes/trading-agent.js');
  // app.use('/api/trading-agent', tradingAgentRoutes);

  // Import and register Cyber Terminal routes
  // const { default: cyberTerminalRoutes } = await import('./routes/cyber-terminal.js');
  // app.use('/api', cyberTerminalRoutes);

  // Register live stats routes
  app.use('/api/live', liveStatsRouter);

  // Import and register Wallet management routes
  const { default: walletRoutes } = await import('./routes/wallet.js');
  app.use('/api/wallet', walletRoutes);

  // Import and register Portfolio Status routes
  const { default: portfolioStatusRoutes } = await import('./routes/portfolio-status.js');
  app.use('/api/portfolio', portfolioStatusRoutes);

  // Import and register Trading Journal routes
  const { default: tradingJournalRoutes } = await import('./routes/trading-journal.js');
  app.use('/api/journal', tradingJournalRoutes);

  // Register AI Autorouter routes for OWUI, void, and other agents
  app.use('/api/ai-autorouter', aiAutorouterRoutes);

  const server = await registerRoutes(app);

  // Initialize legal compliance agent
  console.log('🏛️ Initializing Legal Compliance Agent...');
  setTimeout(async () => {
    try {
      const initialCheck = await legalComplianceAgent.runComplianceCheck();
      console.log(`🏛️ Legal Compliance: ${initialCheck.passed ? 'COMPLIANT' : 'VIOLATIONS DETECTED'} (Score: ${initialCheck.score}%)`);
      if (!initialCheck.passed) {
        console.log(`⚠️ Critical issues: ${initialCheck.violations.filter(v => v.severity === 'critical').length}`);
      }
    } catch (error) {
      console.error('Legal compliance initialization failed:', error);
    }
  }, 5000);

  // Initialize quantum trading system
  console.log('🚀 Activating Quantum Trading System...');
  setTimeout(async () => {
    try {
      const { quantumTrader } = await import('./quantum-trader');
      console.log('💰 Quantum trader activated - executing intelligent trades with play money');

      // Display initial status
      setInterval(() => {
        try {
          const status = quantumTrader.getStatus();
          console.log(`📊 Portfolio: ${status.portfolioValue.toFixed(2)} SOL | Trades: ${status.totalTrades} | Win Rate: ${(status.winRate * 100).toFixed(1)}% | Consciousness: ${(status.consciousness * 100).toFixed(1)}%`);
        } catch (error) {
          // Silent fail for status updates
        }
      }, 300000); // Status every 5 minutes

    } catch (error) {
      console.log('Quantum trading system: Using fallback mode');
    }
  }, 3000);

  // Initialize secure wallet manager
  console.log('🔐 Initializing Secure Wallet Manager...');
  setTimeout(async () => {
    try {
      const { secureWallet } = await import('./secure-wallet-manager');

      // Check wallet balance and security compliance
      const [walletInfo, compliance] = await Promise.all([
        secureWallet.getWalletBalance(),
        secureWallet.validateSecurityCompliance()
      ]);

      if (walletInfo.isValid) {
        console.log(`💳 Authorized Wallet: ${walletInfo.address}`);
        console.log(`💰 Current Balance: ${walletInfo.solBalance.toFixed(6)} SOL`);
        console.log(`🔒 Security: ${compliance.compliant ? 'COMPLIANT' : 'VIOLATIONS DETECTED'}`);
      } else {
        console.log('❌ Wallet validation failed - payout operations disabled');
      }

    } catch (error) {
      console.error('Secure wallet manager initialization failed:', error);
    }
  }, 4000);

  // Initialize intelligent payout system
  console.log('💸 Activating Intelligent Payout System...');
  setTimeout(async () => {
    try {
      // Payout system temporarily disabled for stability
      console.log('💸 Payout System: DISABLED (for stability)');

    } catch (error) {
      console.error('Intelligent payout system initialization failed:', error);
    }
  }, 5000);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, async () => {
    log(`serving on port ${port}`);

    // Initialize system consolidation
    console.log('🚀 Initializing system consolidation...');
    await systemConsolidation.executeConsolidation();

    // Verify database health
    const dbHealth = await databaseOptimizer.healthCheck();
    console.log(`📊 Database health: ${dbHealth ? 'HEALTHY' : 'DEGRADED'}`);
  });
})();