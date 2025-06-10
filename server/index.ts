import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { legalComplianceAgent } from "./legal-compliance-agent";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
