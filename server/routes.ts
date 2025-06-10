import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import tradingRouter from "./routes/trading";
import legalComplianceRouter from "./routes/legal-compliance";
import analyticsRouter from "./routes/analytics";
import parameterInsightsRouter from "./routes/parameter-insights";
import aiAutorouterRouter from "./routes/ai-autorouter";
import agentInsightsRouter from "./routes/agent-insights";
import { donationTracker } from "./donation-tracker";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticPath = path.join(__dirname, "../dist");

export async function registerRoutes(app: Express): Promise<Server> {
  // Core API routes
  // All routes prefixed with /api for clear API boundaries

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

  app.get("/technical-deep-dive", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const httpServer = createServer(app);
  return httpServer;
}