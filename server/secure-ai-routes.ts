/**
 * Secure AI API Routes with Vaultwarden Integration
 * Full spectrum encrypted AI communications
 */

import express from 'express';
import { secureAI } from './secure-ai-middleware';
import { vaultwardenSecurity } from './vaultwarden-security';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import crypto from 'crypto';

const router = express.Router();

// Security middleware
router.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting for AI endpoints
const aiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many AI requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(aiRateLimit);

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      sessionId?: string;
    }
  }
}

// Authentication middleware
const authenticateSession = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const sessionId = req.headers['x-session-id'] as string;
  const apiKey = req.headers['x-api-key'] as string;

  if (!sessionId && !apiKey) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (sessionId) {
    const isValid = await vaultwardenSecurity.validateSecureSession(sessionId);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }
    req.sessionId = sessionId;
  }

  next();
};

// Secure AI request endpoint
router.post('/secure-request', authenticateSession, async (req, res) => {
  try {
    const { model, messages, encrypt = true, audit = true } = req.body;

    if (!model || !messages) {
      return res.status(400).json({ error: 'Model and messages are required' });
    }

    const response = await secureAI.secureAIRequest({
      model,
      messages,
      sessionId: req.sessionId,
      encryptResponse: encrypt,
      auditLog: audit
    });

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Secure AI request failed:', error);
    res.status(500).json({ 
      error: 'AI request failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Initialize secure session
router.post('/session/create', async (req, res) => {
  try {
    const sessionId = await vaultwardenSecurity.generateSecureSession();
    
    if (!sessionId) {
      return res.status(500).json({ error: 'Failed to create secure session' });
    }

    res.json({
      success: true,
      sessionId,
      expiresIn: 3600 // 1 hour
    });

  } catch (error) {
    console.error('Session creation failed:', error);
    res.status(500).json({ error: 'Session creation failed' });
  }
});

// Validate session
router.get('/session/validate/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const isValid = await vaultwardenSecurity.validateSecureSession(sessionId);

    res.json({
      valid: isValid,
      sessionId: isValid ? sessionId : null
    });

  } catch (error) {
    console.error('Session validation failed:', error);
    res.status(500).json({ error: 'Session validation failed' });
  }
});

// Store AI credentials (admin only)
router.post('/credentials/store', authenticateSession, async (req, res) => {
  try {
    // Additional admin verification would go here
    const credentials = req.body;
    
    const success = await vaultwardenSecurity.storeAICredentials(credentials);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to store credentials' });
    }

    res.json({ success: true, message: 'Credentials stored securely' });

  } catch (error) {
    console.error('Credential storage failed:', error);
    res.status(500).json({ error: 'Credential storage failed' });
  }
});

// Get audit logs for session
router.get('/audit/:sessionId', authenticateSession, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Verify session ownership
    if (req.sessionId !== sessionId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const logs = await secureAI.getSessionAuditLogs(sessionId);
    
    res.json({
      success: true,
      logs: logs.map(log => ({
        id: log.id,
        timestamp: log.timestamp,
        model: log.model,
        success: log.success,
        errorMessage: log.errorMessage
      }))
    });

  } catch (error) {
    console.error('Audit log retrieval failed:', error);
    res.status(500).json({ error: 'Audit log retrieval failed' });
  }
});

// Get specific audit log
router.get('/audit/detail/:auditId', authenticateSession, async (req, res) => {
  try {
    const { auditId } = req.params;
    const log = await secureAI.getAuditLog(auditId);

    if (!log) {
      return res.status(404).json({ error: 'Audit log not found' });
    }

    // Verify session ownership
    if (req.sessionId !== log.sessionId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      log: {
        id: log.id,
        timestamp: log.timestamp,
        model: log.model,
        requestHash: log.requestHash,
        responseHash: log.responseHash,
        success: log.success,
        errorMessage: log.errorMessage
      }
    });

  } catch (error) {
    console.error('Audit detail retrieval failed:', error);
    res.status(500).json({ error: 'Audit detail retrieval failed' });
  }
});

// Decrypt response
router.post('/decrypt', authenticateSession, async (req, res) => {
  try {
    const { encryptedResponse } = req.body;

    if (!encryptedResponse) {
      return res.status(400).json({ error: 'Encrypted response is required' });
    }

    const decrypted = secureAI.decryptResponse(encryptedResponse);

    res.json({
      success: true,
      content: decrypted
    });

  } catch (error) {
    console.error('Decryption failed:', error);
    res.status(500).json({ error: 'Decryption failed' });
  }
});

// Security status endpoint
router.get('/security/status', authenticateSession, async (req, res) => {
  try {
    const status = secureAI.getSecurityStatus();

    res.json({
      success: true,
      status: {
        vaultwarden: {
          connected: status.vaultwarden.connected,
          authenticated: status.vaultwarden.authenticated,
          serverUrl: status.vaultwarden.serverUrl.replace(/\/.*/, '/***') // Hide path
        },
        activeAuditLogs: status.activeAuditLogs,
        activeSessions: status.activeSessions,
        rateLimitEntries: status.rateLimitEntries
      }
    });

  } catch (error) {
    console.error('Security status retrieval failed:', error);
    res.status(500).json({ error: 'Security status retrieval failed' });
  }
});

// Health check with security verification
router.get('/health', async (req, res) => {
  try {
    const vaultStatus = vaultwardenSecurity.getHealthStatus();
    const securityStatus = secureAI.getSecurityStatus();

    const health = {
      status: 'healthy',
      timestamp: Date.now(),
      services: {
        vaultwarden: vaultStatus.connected && vaultStatus.authenticated,
        secureAI: true,
        encryption: true
      },
      metrics: {
        activeSessions: securityStatus.activeSessions,
        auditLogs: securityStatus.activeAuditLogs
      }
    };

    res.json(health);

  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Cleanup expired sessions and keys
router.post('/cleanup', authenticateSession, async (req, res) => {
  try {
    const cleanedKeys = await vaultwardenSecurity.cleanupExpiredKeys();

    res.json({
      success: true,
      cleanedKeys,
      message: `Cleaned up ${cleanedKeys} expired keys`
    });

  } catch (error) {
    console.error('Cleanup failed:', error);
    res.status(500).json({ error: 'Cleanup failed' });
  }
});

// Error handling middleware
router.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Secure AI route error:', error);
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

export default router;