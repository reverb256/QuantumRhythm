import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Core API routes
  // All routes prefixed with /api for clear API boundaries

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get("/values", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  app.get("/technical-deep-dive", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const httpServer = createServer(app);
  return httpServer;
}