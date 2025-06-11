/**
 * Secure AI Client with Vaultwarden Integration
 * Frontend interface for encrypted AI communications
 */

interface SecureAIRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  encrypt?: boolean;
  audit?: boolean;
}

interface SecureAIResponse {
  content: string;
  encrypted: boolean;
  sessionId: string;
  timestamp: number;
  auditId?: string;
}

interface SessionInfo {
  sessionId: string;
  expiresIn: number;
  created: number;
}

interface AuditLog {
  id: string;
  timestamp: number;
  model: string;
  success: boolean;
  errorMessage?: string;
}

class SecureAIClient {
  private sessionInfo: SessionInfo | null = null;
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/secure-ai';
  }

  async createSession(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/session/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Session creation failed: ${response.status}`);
      }

      const data = await response.json();
      
      this.sessionInfo = {
        sessionId: data.sessionId,
        expiresIn: data.expiresIn,
        created: Date.now()
      };

      console.log('Secure AI session created:', data.sessionId.substring(0, 8) + '...');
      return data.sessionId;

    } catch (error) {
      console.error('Failed to create secure session:', error);
      throw error;
    }
  }

  async validateSession(sessionId?: string): Promise<boolean> {
    const id = sessionId || this.sessionInfo?.sessionId;
    
    if (!id) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/session/validate/${id}`);
      
      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.valid;

    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }

  async ensureValidSession(): Promise<string> {
    // Check if current session is valid
    if (this.sessionInfo) {
      const elapsed = Date.now() - this.sessionInfo.created;
      const remaining = (this.sessionInfo.expiresIn * 1000) - elapsed;
      
      // If session expires within 5 minutes, create new one
      if (remaining > 300000) {
        const isValid = await this.validateSession();
        if (isValid) {
          return this.sessionInfo.sessionId;
        }
      }
    }

    // Create new session
    return await this.createSession();
  }

  async secureRequest(request: SecureAIRequest): Promise<SecureAIResponse> {
    const sessionId = await this.ensureValidSession();

    try {
      const response = await fetch(`${this.baseUrl}/secure-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.data;

    } catch (error) {
      console.error('Secure AI request failed:', error);
      throw error;
    }
  }

  async decryptResponse(encryptedResponse: string): Promise<string> {
    const sessionId = await this.ensureValidSession();

    try {
      const response = await fetch(`${this.baseUrl}/decrypt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId,
        },
        body: JSON.stringify({ encryptedResponse }),
      });

      if (!response.ok) {
        throw new Error(`Decryption failed: ${response.status}`);
      }

      const data = await response.json();
      return data.content;

    } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    }
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    const sessionId = await this.ensureValidSession();

    try {
      const response = await fetch(`${this.baseUrl}/audit/${sessionId}`, {
        headers: {
          'X-Session-Id': sessionId,
        },
      });

      if (!response.ok) {
        throw new Error(`Audit retrieval failed: ${response.status}`);
      }

      const data = await response.json();
      return data.logs;

    } catch (error) {
      console.error('Audit log retrieval failed:', error);
      throw error;
    }
  }

  async getSecurityStatus(): Promise<any> {
    const sessionId = await this.ensureValidSession();

    try {
      const response = await fetch(`${this.baseUrl}/security/status`, {
        headers: {
          'X-Session-Id': sessionId,
        },
      });

      if (!response.ok) {
        throw new Error(`Security status retrieval failed: ${response.status}`);
      }

      const data = await response.json();
      return data.status;

    } catch (error) {
      console.error('Security status retrieval failed:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Convenience methods for common AI tasks
  async analyzeSentiment(text: string, encrypt: boolean = true): Promise<string> {
    const response = await this.secureRequest({
      model: 'claude-sonnet-4-20250514',
      messages: [
        {
          role: 'system',
          content: 'Analyze the sentiment of the provided text. Respond with "positive", "negative", or "neutral" along with a confidence score.'
        },
        {
          role: 'user',
          content: text
        }
      ],
      encrypt,
      audit: true
    });

    if (response.encrypted) {
      return await this.decryptResponse(response.content);
    }

    return response.content;
  }

  async generateSummary(text: string, encrypt: boolean = true): Promise<string> {
    const response = await this.secureRequest({
      model: 'claude-sonnet-4-20250514',
      messages: [
        {
          role: 'system',
          content: 'Provide a concise summary of the following text, highlighting key points and main themes.'
        },
        {
          role: 'user',
          content: text
        }
      ],
      encrypt,
      audit: true
    });

    if (response.encrypted) {
      return await this.decryptResponse(response.content);
    }

    return response.content;
  }

  async analyzeMarketData(data: any, encrypt: boolean = true): Promise<string> {
    const response = await this.secureRequest({
      model: 'claude-sonnet-4-20250514',
      messages: [
        {
          role: 'system',
          content: 'Analyze the provided market data and provide insights on trends, opportunities, and risks. Focus on actionable intelligence.'
        },
        {
          role: 'user',
          content: JSON.stringify(data)
        }
      ],
      encrypt,
      audit: true
    });

    if (response.encrypted) {
      return await this.decryptResponse(response.content);
    }

    return response.content;
  }

  async generateTradingStrategy(marketConditions: any, encrypt: boolean = true): Promise<string> {
    const response = await this.secureRequest({
      model: 'claude-sonnet-4-20250514',
      messages: [
        {
          role: 'system',
          content: 'Based on the provided market conditions, generate a detailed trading strategy with risk management considerations. Include entry/exit criteria and position sizing recommendations.'
        },
        {
          role: 'user',
          content: JSON.stringify(marketConditions)
        }
      ],
      encrypt,
      audit: true
    });

    if (response.encrypted) {
      return await this.decryptResponse(response.content);
    }

    return response.content;
  }

  async secureChat(messages: Array<{role: string, content: string}>, encrypt: boolean = true): Promise<string> {
    const response = await this.secureRequest({
      model: 'claude-sonnet-4-20250514',
      messages: messages as any,
      encrypt,
      audit: true
    });

    if (response.encrypted) {
      return await this.decryptResponse(response.content);
    }

    return response.content;
  }

  // Session management
  getSessionInfo(): SessionInfo | null {
    return this.sessionInfo;
  }

  clearSession(): void {
    this.sessionInfo = null;
  }

  // Security utilities
  isSessionExpired(): boolean {
    if (!this.sessionInfo) {
      return true;
    }

    const elapsed = Date.now() - this.sessionInfo.created;
    return elapsed >= (this.sessionInfo.expiresIn * 1000);
  }

  getTimeUntilExpiry(): number {
    if (!this.sessionInfo) {
      return 0;
    }

    const elapsed = Date.now() - this.sessionInfo.created;
    const remaining = (this.sessionInfo.expiresIn * 1000) - elapsed;
    return Math.max(0, remaining);
  }
}

export const secureAIClient = new SecureAIClient();
export default secureAIClient;