import crypto from 'crypto';
import { logger } from './logger.js';
import { config } from './config.js';

export class SecurityManager {
  constructor() {
    this.failedAttempts = new Map();
    this.suspiciousActivity = new Map();
    this.emergencyLocks = new Map();
    this.maxFailedAttempts = 5;
    this.lockoutDuration = 300000; // 5 minutes
    this.encryptionKey = this.deriveEncryptionKey();
  }

  // Derive encryption key from environment
  deriveEncryptionKey() {
    const baseKey = config.privateKey?.substring(0, 32) || 'demo-mode-default-key-vibecoding';
    return crypto.createHash('sha256').update(baseKey).digest('hex').substring(0, 32);
  }

  // Encrypt sensitive data
  encrypt(data) {
    try {
      const iv = crypto.randomBytes(16);
      const key = Buffer.from(this.encryptionKey, 'hex');
      const cipher = crypto.createCipher('aes-256-cbc', key);
      
      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        algorithm: 'aes-256-cbc'
      };
    } catch (error) {
      logger.error('Encryption failed', error);
      throw new Error('Data encryption failed');
    }
  }

  // Decrypt sensitive data
  decrypt(encryptedData) {
    try {
      const key = Buffer.from(this.encryptionKey, 'hex');
      const decipher = crypto.createDecipher('aes-256-cbc', key);
      
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return JSON.parse(decrypted);
    } catch (error) {
      logger.error('Decryption failed', error);
      throw new Error('Data decryption failed');
    }
  }

  // Rate limiting for API calls
  checkRateLimit(identifier, maxRequests = 100, windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.failedAttempts.has(identifier)) {
      this.failedAttempts.set(identifier, []);
    }
    
    const attempts = this.failedAttempts.get(identifier);
    
    // Clean old attempts
    const recentAttempts = attempts.filter(timestamp => timestamp > windowStart);
    this.failedAttempts.set(identifier, recentAttempts);
    
    if (recentAttempts.length >= maxRequests) {
      logger.warn(`Rate limit exceeded for ${identifier}`);
      return false;
    }
    
    recentAttempts.push(now);
    return true;
  }

  // Transaction validation
  validateTransaction(transaction, expectedAmount, expectedToken) {
    const validationErrors = [];
    
    // Amount validation
    if (Math.abs(transaction.amount - expectedAmount) > 0.0001) {
      validationErrors.push('Amount mismatch detected');
    }
    
    // Token validation
    if (transaction.token !== expectedToken) {
      validationErrors.push('Token mismatch detected');
    }
    
    // Sanity checks
    if (transaction.amount > config.maxTradeAmount) {
      validationErrors.push('Amount exceeds safety limits');
    }
    
    if (transaction.amount <= 0) {
      validationErrors.push('Invalid transaction amount');
    }
    
    // Gas price validation
    const maxGasPrice = 0.01; // 0.01 SOL max gas
    if (transaction.estimatedGas > maxGasPrice) {
      validationErrors.push('Gas price too high');
    }
    
    if (validationErrors.length > 0) {
      logger.security('Transaction validation failed', {
        errors: validationErrors,
        transaction: {
          amount: transaction.amount,
          token: transaction.token,
          gas: transaction.estimatedGas
        }
      });
      return { valid: false, errors: validationErrors };
    }
    
    return { valid: true };
  }

  // Detect suspicious trading patterns
  analyzeTradingPattern(trades) {
    const suspiciousIndicators = [];
    const now = Date.now();
    const last24h = trades.filter(trade => now - trade.timestamp < 86400000);
    
    // High frequency trading detection
    if (last24h.length > config.maxDailyTrades * 1.5) {
      suspiciousIndicators.push('Excessive trading frequency');
    }
    
    // Unusual profit patterns
    const profits = last24h.map(trade => trade.profit || 0);
    const avgProfit = profits.reduce((a, b) => a + b, 0) / profits.length;
    
    if (avgProfit > 0.1) { // More than 10% average profit
      suspiciousIndicators.push('Unrealistic profit patterns');
    }
    
    // Repeated identical trades
    const tradeHashes = last24h.map(trade => 
      crypto.createHash('md5').update(`${trade.amount}${trade.token}${trade.type}`).digest('hex')
    );
    const uniqueHashes = new Set(tradeHashes);
    
    if (tradeHashes.length - uniqueHashes.size > 10) {
      suspiciousIndicators.push('Repeated identical trades detected');
    }
    
    if (suspiciousIndicators.length > 0) {
      logger.safety('Suspicious trading pattern detected', {
        indicators: suspiciousIndicators,
        tradeCount: last24h.length,
        avgProfit: avgProfit.toFixed(4)
      });
      
      return { suspicious: true, indicators: suspiciousIndicators };
    }
    
    return { suspicious: false };
  }

  // Emergency circuit breaker
  activateEmergencyStop(reason, duration = 3600000) { // 1 hour default
    const lockId = crypto.randomUUID();
    const lockUntil = Date.now() + duration;
    
    this.emergencyLocks.set(lockId, {
      reason,
      lockUntil,
      timestamp: Date.now()
    });
    
    logger.error('EMERGENCY STOP ACTIVATED', {
      lockId,
      reason,
      duration: duration / 60000 + ' minutes'
    });
    
    // Update global config
    config.emergencyStop = true;
    
    return lockId;
  }

  // Check if system is locked
  isSystemLocked() {
    const now = Date.now();
    
    // Check emergency locks
    for (const [lockId, lock] of this.emergencyLocks) {
      if (now < lock.lockUntil) {
        return { 
          locked: true, 
          reason: lock.reason,
          unlockTime: lock.lockUntil,
          lockId 
        };
      } else {
        // Remove expired locks
        this.emergencyLocks.delete(lockId);
      }
    }
    
    // Check global emergency stop
    if (config.emergencyStop) {
      return { 
        locked: true, 
        reason: 'Manual emergency stop activated',
        unlockTime: null 
      };
    }
    
    return { locked: false };
  }

  // Secure API key validation
  validateApiCredentials() {
    const validationResults = {
      solanaRPC: false,
      jupiterAPI: false,
      configuration: false
    };
    
    // Check Solana RPC endpoint
    if (config.rpcEndpoint && config.rpcEndpoint.startsWith('https://')) {
      validationResults.solanaRPC = true;
    }
    
    // Check wallet configuration
    if (config.privateKey && config.publicKey) {
      try {
        // Validate key format without exposing actual keys
        const keyLength = config.privateKey.length;
        if (keyLength >= 64 && keyLength <= 128) {
          validationResults.configuration = true;
        }
      } catch (error) {
        logger.error('Wallet validation failed', { error: error.message });
      }
    }
    
    // Jupiter API is optional for basic functionality
    validationResults.jupiterAPI = true;
    
    const overallValid = Object.values(validationResults).every(result => result);
    
    if (!overallValid) {
      logger.security('API credential validation failed', validationResults);
    }
    
    return { valid: overallValid, details: validationResults };
  }

  // Input sanitization for trading parameters
  sanitizeTradeInput(input) {
    const sanitized = {};
    
    // Amount sanitization
    if (typeof input.amount === 'number' && !isNaN(input.amount) && input.amount > 0) {
      sanitized.amount = Math.min(input.amount, config.maxTradeAmount);
    } else {
      throw new Error('Invalid trade amount');
    }
    
    // Token validation
    const validTokens = Object.keys(config.TOKENS || {});
    if (validTokens.includes(input.token)) {
      sanitized.token = input.token;
    } else {
      throw new Error('Invalid token specified');
    }
    
    // Slippage validation
    if (typeof input.slippage === 'number' && input.slippage >= 0 && input.slippage <= 10) {
      sanitized.slippage = input.slippage;
    } else {
      sanitized.slippage = config.slippageTolerance;
    }
    
    return sanitized;
  }

  // Generate secure transaction ID
  generateSecureTransactionId(transactionData) {
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const dataHash = crypto.createHash('sha256')
      .update(JSON.stringify(transactionData))
      .digest('hex')
      .substring(0, 16);
    
    return `txn_${timestamp}_${dataHash}_${randomBytes}`;
  }

  // Audit log for security events
  logSecurityEvent(eventType, details) {
    const securityEvent = {
      timestamp: new Date().toISOString(),
      eventType,
      details,
      sessionId: this.generateSecureTransactionId({ eventType, timestamp: Date.now() })
    };
    
    logger.security(`SECURITY EVENT: ${eventType}`, securityEvent);
    
    // In production, this would be sent to a secure logging service
    return securityEvent;
  }

  // Health check for security systems
  performSecurityHealthCheck() {
    const healthCheck = {
      timestamp: Date.now(),
      encryption: false,
      rateLimit: false,
      validation: false,
      emergencyStop: false
    };
    
    try {
      // Test encryption
      const testData = { test: 'security-check' };
      const encrypted = this.encrypt(testData);
      const decrypted = this.decrypt(encrypted);
      healthCheck.encryption = decrypted.test === 'security-check';
      
      // Test rate limiting
      healthCheck.rateLimit = this.checkRateLimit('health-check', 1, 1000);
      
      // Test validation
      const mockTransaction = {
        amount: 0.1,
        token: 'SOL',
        estimatedGas: 0.001
      };
      const validation = this.validateTransaction(mockTransaction, 0.1, 'SOL');
      healthCheck.validation = validation.valid;
      
      // Test emergency stop system
      healthCheck.emergencyStop = !this.isSystemLocked().locked;
      
      const overallHealth = Object.values(healthCheck).every(check => check === true);
      
      if (overallHealth) {
        logger.info('Security health check passed');
      } else {
        logger.warn('Security health check failed', healthCheck);
      }
      
      return { healthy: overallHealth, details: healthCheck };
      
    } catch (error) {
      logger.error('Security health check error', error);
      return { healthy: false, error: error.message };
    }
  }
}

export default SecurityManager;