/**
 * Secure AI Communication Middleware
 * Integrates with Vaultwarden for encrypted AI interactions
 */

import { vaultwardenSecurity } from './vaultwarden-security';
import crypto from 'crypto';

interface SecureAIRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  sessionId?: string;
  encryptResponse?: boolean;
  auditLog?: boolean;
}

interface SecureAIResponse {
  content: string;
  encrypted: boolean;
  sessionId: string;
  timestamp: number;
  auditId?: string;
}

interface AIAuditLog {
  id: string;
  timestamp: number;
  model: string;
  sessionId: string;
  requestHash: string;
  responseHash: string;
  success: boolean;
  errorMessage?: string;
}

export class SecureAIMiddleware {
  private auditLogs: Map<string, AIAuditLog> = new Map();
  private rateLimiter: Map<string, { count: number; resetTime: number }> = new Map();
  private encryptionKey: Buffer;

  constructor() {
    this.encryptionKey = this.generateEncryptionKey();
    this.startCleanupTimer();
  }

  private generateEncryptionKey(): Buffer {
    const secret = process.env.AI_ENCRYPTION_KEY || 'default-ai-encryption-key';
    const salt = 'ai-comms-salt';
    return crypto.pbkdf2Sync(secret, salt, 100000, 32, 'sha256');
  }

  private encryptData(data: string): { encrypted: string; iv: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encrypted, iv: iv.toString('hex') };
  }

  private decryptData(encryptedData: { encrypted: string; iv: string }): string {
    const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  private generateHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private async validateSession(sessionId: string): Promise<boolean> {
    if (!sessionId) {
      return false;
    }

    return await vaultwardenSecurity.validateSecureSession(sessionId);
  }

  private checkRateLimit(sessionId: string): boolean {
    const now = Date.now();
    const limit = this.rateLimiter.get(sessionId);

    if (!limit) {
      this.rateLimiter.set(sessionId, { count: 1, resetTime: now + 60000 }); // 1 minute window
      return true;
    }

    if (now > limit.resetTime) {
      this.rateLimiter.set(sessionId, { count: 1, resetTime: now + 60000 });
      return true;
    }

    if (limit.count >= 30) { // 30 requests per minute
      return false;
    }

    limit.count++;
    return true;
  }

  async secureAIRequest(request: SecureAIRequest): Promise<SecureAIResponse> {
    const auditId = crypto.randomUUID();
    const timestamp = Date.now();
    
    try {
      // Generate session if not provided
      if (!request.sessionId) {
        request.sessionId = await vaultwardenSecurity.generateSecureSession();
        if (!request.sessionId) {
          throw new Error('Failed to generate secure session');
        }
      }

      // Validate session
      if (!await this.validateSession(request.sessionId)) {
        throw new Error('Invalid or expired session');
      }

      // Check rate limits
      if (!this.checkRateLimit(request.sessionId)) {
        throw new Error('Rate limit exceeded');
      }

      // Get AI credentials from Vaultwarden
      const credentials = await vaultwardenSecurity.retrieveAICredentials();
      if (!credentials) {
        throw new Error('AI credentials not available');
      }

      // Hash request for audit
      const requestHash = this.generateHash(JSON.stringify(request.messages));

      // Make secure AI request
      const aiResponse = await this.makeAIRequest(request, credentials);
      
      // Hash response for audit
      const responseHash = this.generateHash(aiResponse);

      // Encrypt response if requested
      let finalResponse: string;
      let encrypted = false;

      if (request.encryptResponse) {
        const encryptedData = this.encryptData(aiResponse);
        finalResponse = JSON.stringify(encryptedData);
        encrypted = true;
      } else {
        finalResponse = aiResponse;
      }

      // Create audit log
      const auditLog: AIAuditLog = {
        id: auditId,
        timestamp,
        model: request.model,
        sessionId: request.sessionId,
        requestHash,
        responseHash,
        success: true
      };

      if (request.auditLog !== false) {
        this.auditLogs.set(auditId, auditLog);
        await this.storeAuditLog(auditLog);
      }

      return {
        content: finalResponse,
        encrypted,
        sessionId: request.sessionId,
        timestamp,
        auditId: request.auditLog !== false ? auditId : undefined
      };

    } catch (error) {
      // Log error in audit
      const auditLog: AIAuditLog = {
        id: auditId,
        timestamp,
        model: request.model,
        sessionId: request.sessionId || 'unknown',
        requestHash: this.generateHash(JSON.stringify(request.messages)),
        responseHash: '',
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };

      this.auditLogs.set(auditId, auditLog);
      await this.storeAuditLog(auditLog);

      throw error;
    }
  }

  private async makeAIRequest(request: SecureAIRequest, credentials: any): Promise<string> {
    // Route to appropriate AI provider based on model
    if (request.model.includes('claude') || request.model.includes('anthropic')) {
      return await this.makeAnthropicRequest(request, credentials.anthropicApiKey);
    } else if (request.model.includes('gpt') || request.model.includes('openai')) {
      return await this.makeOpenAIRequest(request, credentials.openaiApiKey);
    } else if (request.model.includes('huggingface')) {
      return await this.makeHuggingFaceRequest(request, credentials.huggingfaceToken);
    } else {
      // Custom model endpoint
      const endpoint = credentials.customModelEndpoints?.[request.model];
      if (endpoint) {
        return await this.makeCustomModelRequest(request, endpoint);
      }
      throw new Error(`Unsupported model: ${request.model}`);
    }
  }

  private async makeAnthropicRequest(request: SecureAIRequest, apiKey: string): Promise<string> {
    if (!apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0]?.text || '';
  }

  private async makeOpenAIRequest(request: SecureAIRequest, apiKey: string): Promise<string> {
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private async makeHuggingFaceRequest(request: SecureAIRequest, token: string): Promise<string> {
    if (!token) {
      throw new Error('Hugging Face token not configured');
    }

    const response = await fetch(`https://api-inference.huggingface.co/models/${request.model}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        inputs: request.messages.map(m => m.content).join('\n'),
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    return data[0]?.generated_text || '';
  }

  private async makeCustomModelRequest(request: SecureAIRequest, endpoint: string): Promise<string> {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: request.messages,
        model: request.model
      })
    });

    if (!response.ok) {
      throw new Error(`Custom model API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content || data.response || '';
  }

  private async storeAuditLog(auditLog: AIAuditLog): Promise<void> {
    try {
      // Store audit log in Vaultwarden as a temporary key
      const auditData = JSON.stringify(auditLog);
      await vaultwardenSecurity.securelyStoreTemporaryKey(
        `audit_${auditLog.id}`,
        auditData,
        86400 // 24 hours
      );
    } catch (error) {
      console.error('Failed to store audit log:', error);
    }
  }

  async getAuditLog(auditId: string): Promise<AIAuditLog | null> {
    // First check memory cache
    const cachedLog = this.auditLogs.get(auditId);
    if (cachedLog) {
      return cachedLog;
    }

    // Then check Vaultwarden
    try {
      const auditData = await vaultwardenSecurity.retrieveTemporaryKey(`audit_${auditId}`);
      if (auditData) {
        return JSON.parse(auditData);
      }
    } catch (error) {
      console.error('Failed to retrieve audit log:', error);
    }

    return null;
  }

  async getSessionAuditLogs(sessionId: string): Promise<AIAuditLog[]> {
    const logs: AIAuditLog[] = [];
    
    for (const log of this.auditLogs.values()) {
      if (log.sessionId === sessionId) {
        logs.push(log);
      }
    }

    return logs.sort((a, b) => a.timestamp - b.timestamp);
  }

  decryptResponse(encryptedResponse: string): string {
    try {
      const encryptedData = JSON.parse(encryptedResponse);
      return this.decryptData(encryptedData);
    } catch (error) {
      throw new Error('Failed to decrypt response');
    }
  }

  private startCleanupTimer(): void {
    // Clean up old audit logs every hour
    setInterval(() => {
      const oneHourAgo = Date.now() - 3600000;
      
      for (const [id, log] of this.auditLogs.entries()) {
        if (log.timestamp < oneHourAgo) {
          this.auditLogs.delete(id);
        }
      }

      // Clean up old rate limit entries
      const now = Date.now();
      for (const [sessionId, limit] of this.rateLimiter.entries()) {
        if (now > limit.resetTime) {
          this.rateLimiter.delete(sessionId);
        }
      }
    }, 3600000);
  }

  getSecurityStatus(): {
    vaultwarden: any;
    activeAuditLogs: number;
    activeSessions: number;
    rateLimitEntries: number;
  } {
    return {
      vaultwarden: vaultwardenSecurity.getHealthStatus(),
      activeAuditLogs: this.auditLogs.size,
      activeSessions: new Set(Array.from(this.auditLogs.values()).map(log => log.sessionId)).size,
      rateLimitEntries: this.rateLimiter.size
    };
  }
}

export const secureAI = new SecureAIMiddleware();