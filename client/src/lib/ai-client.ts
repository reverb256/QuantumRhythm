/**
 * AI Client Library - Intelligent routing with client API keys
 * Manages local API keys and provides optimized request routing
 */

interface ApiKeyConfig {
  anthropic?: string;
  openai?: string;
  xai?: string;
  io_intelligence?: string;
}

interface RoutingRequest {
  content: string;
  contentType?: 'text' | 'code' | 'image' | 'audio' | 'analysis' | 'creative' | 'technical';
  intent?: 'generate' | 'analyze' | 'summarize' | 'debug' | 'optimize' | 'explain' | 'translate';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  context?: string;
  maxTokens?: number;
  temperature?: number;
  agentId?: string;
}

interface RoutingResponse {
  content: string;
  model: string;
  provider: string;
  processingTime: number;
  tokensUsed: number;
  cost: number;
  confidence: number;
  metadata: any;
}

export class AIClient {
  private apiKeys: ApiKeyConfig = {};
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.loadApiKeys();
  }

  /**
   * Load API keys from localStorage
   */
  private loadApiKeys(): void {
    try {
      const stored = localStorage.getItem('aiApiKeys');
      if (stored) {
        this.apiKeys = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load API keys from localStorage:', error);
    }
  }

  /**
   * Save API keys to localStorage
   */
  saveApiKeys(keys: ApiKeyConfig): void {
    this.apiKeys = { ...this.apiKeys, ...keys };
    try {
      localStorage.setItem('aiApiKeys', JSON.stringify(this.apiKeys));
    } catch (error) {
      console.error('Failed to save API keys to localStorage:', error);
    }
  }

  /**
   * Get configured API keys
   */
  getApiKeys(): ApiKeyConfig {
    return { ...this.apiKeys };
  }

  /**
   * Check if any API keys are configured
   */
  hasApiKeys(): boolean {
    return Object.values(this.apiKeys).some(key => key && key.trim().length > 0);
  }

  /**
   * Route a single request to optimal AI model
   */
  async routeRequest(request: RoutingRequest): Promise<RoutingResponse> {
    const response = await fetch(`${this.baseUrl}/api/ai/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...request,
        apiKeys: this.apiKeys
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Request failed');
    }

    return result.data;
  }

  /**
   * Route multiple requests in batch
   */
  async routeBatch(requests: RoutingRequest[], parallel: boolean = false): Promise<RoutingResponse[]> {
    const response = await fetch(`${this.baseUrl}/api/ai/route/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: requests.map(req => ({
          ...req,
          apiKeys: this.apiKeys
        })),
        parallelExecution: parallel
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Batch request failed');
    }

    return result.data.responses;
  }

  /**
   * Get available models and capabilities
   */
  async getModels(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/ai/models`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.success ? result.data : result;
  }

  /**
   * Get system status and performance metrics
   */
  async getSystemStatus(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/ai/status`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.success ? result.data : result;
  }

  /**
   * Analyze content and get routing suggestions
   */
  async analyzeContent(content: string, context?: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/ai/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        context,
        apiKeys: this.apiKeys
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.success ? result.data : result;
  }

  /**
   * Get personalized recommendations for an agent
   */
  async getAgentRecommendations(agentId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/ai/agent/${agentId}/recommendations`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result.success ? result.data : result;
  }

  /**
   * Simplified high-level methods for common tasks
   */

  /**
   * Generate text content
   */
  async generate(prompt: string, options: Partial<RoutingRequest> = {}): Promise<string> {
    const response = await this.routeRequest({
      content: prompt,
      contentType: 'text',
      intent: 'generate',
      ...options
    });
    return response.content;
  }

  /**
   * Analyze and summarize content
   */
  async analyze(content: string, options: Partial<RoutingRequest> = {}): Promise<string> {
    const response = await this.routeRequest({
      content,
      contentType: 'analysis',
      intent: 'analyze',
      ...options
    });
    return response.content;
  }

  /**
   * Summarize long content
   */
  async summarize(content: string, options: Partial<RoutingRequest> = {}): Promise<string> {
    const response = await this.routeRequest({
      content,
      contentType: 'text',
      intent: 'summarize',
      ...options
    });
    return response.content;
  }

  /**
   * Debug code or technical content
   */
  async debug(code: string, context?: string, options: Partial<RoutingRequest> = {}): Promise<string> {
    const response = await this.routeRequest({
      content: code,
      contentType: 'code',
      intent: 'debug',
      context,
      ...options
    });
    return response.content;
  }

  /**
   * Explain complex concepts
   */
  async explain(content: string, context?: string, options: Partial<RoutingRequest> = {}): Promise<string> {
    const response = await this.routeRequest({
      content,
      contentType: 'text',
      intent: 'explain',
      context,
      ...options
    });
    return response.content;
  }

  /**
   * Optimize content or code
   */
  async optimize(content: string, contentType: 'text' | 'code' = 'text', options: Partial<RoutingRequest> = {}): Promise<string> {
    const response = await this.routeRequest({
      content,
      contentType,
      intent: 'optimize',
      ...options
    });
    return response.content;
  }
}

// Export a default instance
export const aiClient = new AIClient();

// Export types for external use
export type { ApiKeyConfig, RoutingRequest, RoutingResponse };