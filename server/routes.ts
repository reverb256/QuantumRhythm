import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import tradingRouter from "./routes/trading";
import tradingApiRouter from "./routes/trading-api";
import legalComplianceRouter from "./routes/legal-compliance";
import analyticsRouter from "./routes/analytics";
import parameterInsightsRouter from "./routes/parameter-insights";
import aiAutorouterRouter from "./routes/ai-autorouter";
import agentInsightsRouter from "./routes/agent-insights";
import portfolioRouter from "./routes/portfolio";
import intelligenceRouter from "./routes/intelligence";
import transformationRouter from "./routes/transformation";
import githubRouter from "./routes/github.js";
import agentsRouter from "./routes/agents";
import { donationTracker } from "./donation-tracker";
import { contextOrchestrator } from './context-orchestrator';
import { webSearchOrchestrator } from './web-search-orchestrator';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticPath = path.join(__dirname, "../dist");

export async function registerRoutes(app: Express): Promise<Server> {
  // Core API routes
  // All routes prefixed with /api for clear API boundaries

  // Initialize comprehensive portfolio tracking with 50+ price sources
  (async () => {
    try {
      const { comprehensivePortfolioTracker } = await import('./comprehensive-portfolio-tracker');
      const { priceDiscoveryEngine } = await import('./comprehensive-price-discovery-engine');
      const { systemOrchestrator } = await import('./system-consolidation-orchestrator');
      
      await comprehensivePortfolioTracker.startPortfolioTracking();
      console.log('📊 Comprehensive portfolio tracking activated with 50+ price sources');
      
      // Execute consolidation and security audit in background
      systemOrchestrator.executeFullConsolidation().then(result => {
        console.log('✅ System consolidation complete:', result.optimizations);
      }).catch(err => {
        console.log('⚠️ Consolidation partial success:', err.message);
      });

      // Initialize security audit and debug health monitor
      const { securityAudit } = await import('./comprehensive-security-audit');
      const { debugHealthMonitor } = await import('./debug-health-monitor');
      
      securityAudit.performFullSecurityAudit().then(result => {
        console.log(`🔒 Security audit complete: ${result.summary.overallScore}/100 security score`);
      }).catch(err => {
        console.log('⚠️ Security audit error:', err.message);
      });

      // Fix critical debugging issues
      debugHealthMonitor.performComprehensiveDebug().then(result => {
        console.log(`🔧 Debug analysis complete: ${result.status} status, ${result.fixes.length} fixes applied`);
      }).catch(err => {
        console.log('⚠️ Debug health monitor error:', err.message);
      });
      
    } catch (error) {
      console.error('Failed to start portfolio tracking:', error);
    }
  })();

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // On-chain verification endpoint
  app.get('/api/verify-trading', async (req, res) => {
    try {
      const { OnChainTransactionVerifier } = await import('./on-chain-transaction-verifier');
      const verifier = new OnChainTransactionVerifier();

      await verifier.initializeVerification();
      const tradingStatus = await verifier.verifyLiveTrading();
      const transactionHistory = await verifier.getDetailedTransactionHistory();

      res.json({
        success: true,
        verification: {
          walletAddress: '4jTtAYiHP3tHqXcmi5T1riS1AcGmxNNhLZTw65vrKpkA',
          tradingMode: tradingStatus.isLive ? 'live' : 'simulation',
          balance: tradingStatus.walletBalance,
          onChainTransactions: tradingStatus.transactionCount,
          recentActivity: tradingStatus.recentActivity,
          lastTransaction: tradingStatus.lastTransaction,
          history: transactionHistory,
          guardianActive: transactionHistory.guardianReport.active,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error verifying trading:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to verify trading status',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Mount trading routes
  app.use('/api/trading-agent', tradingRouter);

  // Mount legal compliance routes
  app.use('/api/legal', legalComplianceRouter);

  // Mount analytics routes
  app.use('/api', analyticsRouter);

  // Mount parameter insights routes
  app.use('/api/parameter-insights', parameterInsightsRouter);

  // Mount AI autorouter routes
  app.use('/api/ai', aiAutorouterRouter);

  // Mount agent insights routes
  app.use('/api/agent', agentInsightsRouter);

  // Cloudflare AI optimization endpoints
  app.get('/api/cloudflare/status', async (req, res) => {
    try {
      const { cloudflareAIOrchestrator } = await import('./cloudflare-ai-orchestrator');
      const features = await cloudflareAIOrchestrator.getFeatureStatus();
      const optimizations = await cloudflareAIOrchestrator.getOptimizationRecommendations();

      res.json({
        success: true,
        totalFeatures: features.size,
        enabledFeatures: Array.from(features.values()).filter(f => f.enabled).length,
        optimizations: optimizations.length,
        features: Object.fromEntries(features)
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to get Cloudflare status' });
    }
  });

  app.get('/api/cloudflare/report', async (req, res) => {
    try {
      const { cloudflareAIOrchestrator } = await import('./cloudflare-ai-orchestrator');
      const report = await cloudflareAIOrchestrator.getIntelligentReport();
      res.json({ success: true, report });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to generate Cloudflare report' });
    }
  });

  // Security audit endpoints
  app.get('/api/security/audit', async (req, res) => {
    try {
      const { securityAudit } = await import('./comprehensive-security-audit');
      const report = await securityAudit.performFullSecurityAudit();
      res.json({ success: true, audit: report });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Security audit failed' });
    }
  });

  app.get('/api/security/report', async (req, res) => {
    try {
      const { securityAudit } = await import('./comprehensive-security-audit');
      const markdownReport = await securityAudit.generateSecurityReport();
      res.json({ success: true, report: markdownReport });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Security report generation failed' });
    }
  });

  // Debug health monitoring endpoints
  app.get('/api/debug/health', async (req, res) => {
    try {
      const { debugHealthMonitor } = await import('./debug-health-monitor');
      const healthStatus = await debugHealthMonitor.performComprehensiveDebug();
      res.json({ success: true, health: healthStatus });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Health monitoring failed' });
    }
  });

  app.post('/api/debug/fix-build-scripts', async (req, res) => {
    try {
      const { debugHealthMonitor } = await import('./debug-health-monitor');
      await debugHealthMonitor.fixBuildScriptIssues();
      res.json({ success: true, message: 'Build script issues fixed' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fix build scripts' });
    }
  });

  app.post('/api/cloudflare/enable/:feature', async (req, res) => {
    try {
      const { cloudflareAIOrchestrator } = await import('./cloudflare-ai-orchestrator');
      const { feature } = req.params;
      const enabled = await cloudflareAIOrchestrator.enableFeature(feature);

      if (enabled) {
        res.json({ success: true, message: `Feature ${feature} enabled` });
      } else {
        res.status(404).json({ success: false, error: 'Feature not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to enable feature' });
    }
  });

  // AI dialogue generation endpoint for character interactions
  app.post('/api/ai/generate', async (req, res) => {
    try {
      const { prompt, model, character, max_tokens } = req.body;
      
      // Use IO Intelligence system or character-specific response generation
      const { aiService } = await import('./ai-service');
      const response = await aiService.generateDialogue({
        prompt,
        character,
        maxTokens: max_tokens || 150
      });
      
      res.json({ 
        success: true, 
        content: response,
        character,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('AI generation error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'AI generation temporarily unavailable',
        fallback: true
      });
    }
  });

  // Add portfolio routes
  app.use('/api/portfolio', portfolioRouter);

  // Add intelligence routes
  app.use('/api/intelligence', intelligenceRouter);
  app.use('/api/transformation', transformationRouter);
  app.use('/api/github', githubRouter);
  app.use('/api/agents', agentsRouter);

  // Add multi-chain trading API routes
  app.use('/api/trading', tradingApiRouter);

  // Donation tracking endpoint
  app.get('/api/donations/stats', async (req, res) => {
    try {
      const stats = await donationTracker.getCurrentStats();
      res.json({ success: true, ...stats });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch donation stats' });
    }
  });

  app.get('/api/donations/recent', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const recentDonations = await donationTracker.getRecentDonations(limit);
      res.json({ success: true, donations: recentDonations });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch recent donations' });
    }
  });

  // SPA routes - serve index.html for all client-side routes
  app.get("/values", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  app.get("/vrchat", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  app.get("/agents", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  app.get("/technical-deep-dive", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const httpServer = createServer(app);
  return httpServer;
}