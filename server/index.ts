import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { legalComplianceAgent } from "./legal-compliance-agent";
import { dataProtection } from "./data-protection-middleware";

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

// Start autonomous problem solving and optimization
(async () => {
  // Initialize authentic data validation first
  
  // Validate current trading setup
  const validation = await authenticDataValidator.validateTradingData();
  console.log(`📊 Trading Mode: ${validation.tradeMode.toUpperCase()}`);
  console.log(`💰 Authentic Balance: ${validation.actualBalance.toFixed(6)} SOL`);
  console.log(`🌐 Network: ${validation.networkStatus}`);
  
  // Perform initial database health check and auto-repair
  await problemSolver.performDatabaseHealthCheck();
  await problemSolver.performPreventiveMaintenance();
  
  // Run full system optimization
  const results = await comprehensiveOptimizer.runFullSystemOptimization();
  console.log(`🚀 System fully optimized: Security ${comprehensiveOptimizer.getSystemStatus().securityScore}%, Performance +${results.efficiency.performanceGain.toFixed(1)}%`);
  
  // Run comprehensive backtesting analysis
  console.log('📊 Running comprehensive backtesting analysis...');
  await backtestingEngine.generatePerformanceReport();
  
  // Initialize cross-empowerment orchestration
  console.log('🔗 Initializing cross-system empowerment...');
  await crossEmpowerment.initializeCrossEmpowerment();
  
  // Start real-time profit tracking with authentic data
  console.log('💰 Starting real-time profit tracking...');
  await profitTracker.compareSimulatedVsReal();
  
  // Start consciousness evolution monitoring
  consciousnessEngine.startEvolutionMonitoring();
  
  // Start continuous monitoring
  comprehensiveOptimizer.startContinuousMonitoring();
  
  // Schedule regular maintenance and validation
  setInterval(async () => {
    await problemSolver.performDatabaseHealthCheck();
    await authenticDataValidator.validateTradingData();
  }, 300000); // Every 5 minutes
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

(async () => {
  // Import and register IO Intelligence routes
  const { default: ioIntelligenceRoutes } = await import('./routes/io-intelligence.js');
  app.use('/api/io-intelligence', ioIntelligenceRoutes);
  
  // Import and register Trading Agent routes
  const { default: tradingAgentRoutes } = await import('./routes/trading-agent.js');
  app.use('/api/trading-agent', tradingAgentRoutes);
  
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
        const status = quantumTrader.getStatus();
        console.log(`📊 Portfolio: ${status.portfolioValue.toFixed(2)} SOL | Trades: ${status.totalTrades} | Win Rate: ${(status.winRate * 100).toFixed(1)}% | Consciousness: ${(status.consciousness * 100).toFixed(1)}%`);
      }, 300000); // Status every 5 minutes
      
    } catch (error) {
      console.error('Quantum trading system initialization failed:', error);
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
      const { intelligentPayout } = await import('./intelligent-payout-system');
      
      // Validate payout security
      const security = await intelligentPayout.validatePayoutSecurity();
      const stats = intelligentPayout.getPayoutStats();
      
      console.log(`💸 Payout System: ${security.secure ? 'SECURE' : 'SECURITY ISSUES'}`);
      console.log(`🎯 Windfall Threshold: ${stats.windfallThreshold} SOL (50% payout)`);
      console.log(`⏰ Hourly Profit Distribution: 50% (net after gas)`);
      console.log(`🛡️ Gas Reserve: ${stats.gasReserve} SOL minimum`);
      console.log(`⏱️ Next Hourly Check: ${stats.nextHourlyCheck.toLocaleTimeString()}`);
      
      if (!security.secure) {
        console.log('⚠️ Payout security issues detected:');
        security.checks.forEach(check => {
          if (!check.passed) {
            console.log(`   ❌ ${check.check}: ${check.details}`);
          }
        });
      }
      
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
  }, () => {
    log(`serving on port ${port}`);
  });
})();
