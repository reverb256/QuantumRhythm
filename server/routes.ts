import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import tradingRouter from "./routes/trading";
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

  // Mount trading routes
  app.use('/api/trading-agent', tradingRouter);

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