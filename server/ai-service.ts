/**
 * Centralized AI Service - Routes all AI requests through the autorouter
 * Replaces individual AI client implementations with intelligent routing
 */

import { aiAutorouter } from './ai-autorouter.js';

interface AIRequest {
  content: string;
  contentType?: 'text' | 'code' | 'image' | 'audio' | 'analysis' | 'creative' | 'technical';
  intent?: 'generate' | 'analyze' | 'summarize' | 'debug' | 'optimize' | 'explain' | 'translate';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  context?: string;
  maxTokens?: number;
  temperature?: number;
  agentId?: string;
}

interface AIResponse {
  content: string;
  model: string;
  provider: string;
  processingTime: number;
  tokensUsed: number;
  cost: number;
  confidence: number;
}

export class AIService {
  /**
   * Route AI request through the autorouter
   */
  async request(request: AIRequest): Promise<AIResponse> {
    try {
      // Ensure required fields have defaults and proper types
      const routingRequest = {
        content: request.content,
        contentType: (request.contentType || 'text') as 'text' | 'code' | 'image' | 'audio' | 'analysis' | 'creative' | 'technical',
        intent: (request.intent || 'generate') as 'generate' | 'analyze' | 'summarize' | 'debug' | 'optimize' | 'explain' | 'translate',
        priority: (request.priority || 'medium') as 'low' | 'medium' | 'high' | 'critical',
        context: request.context,
        maxTokens: request.maxTokens,
        temperature: request.temperature,
        agentId: request.agentId
      };
      return await aiAutorouter.routeRequest(routingRequest);
    } catch (error) {
      console.error(`AI Service error:`, error);
      throw new Error(`AI request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate text content
   */
  async generate(prompt: string, options: Partial<AIRequest> = {}): Promise<string> {
    const response = await this.request({
      content: prompt,
      contentType: 'text',
      intent: 'generate',
      ...options
    });
    return response.content;
  }

  /**
   * Analyze content
   */
  async analyze(content: string, context?: string, options: Partial<AIRequest> = {}): Promise<string> {
    const response = await this.request({
      content,
      contentType: 'analysis',
      intent: 'analyze',
      context,
      ...options
    });
    return response.content;
  }

  /**
   * Summarize content
   */
  async summarize(content: string, options: Partial<AIRequest> = {}): Promise<string> {
    const response = await this.request({
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
  async debug(code: string, context?: string, options: Partial<AIRequest> = {}): Promise<string> {
    const response = await this.request({
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
  async explain(content: string, context?: string, options: Partial<AIRequest> = {}): Promise<string> {
    const response = await this.request({
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
  async optimize(content: string, contentType: 'text' | 'code' = 'text', options: Partial<AIRequest> = {}): Promise<string> {
    const response = await this.request({
      content,
      contentType,
      intent: 'optimize',
      ...options
    });
    return response.content;
  }

  /**
   * Translate content
   */
  async translate(content: string, targetLanguage: string, options: Partial<AIRequest> = {}): Promise<string> {
    const response = await this.request({
      content: `Translate to ${targetLanguage}: ${content}`,
      contentType: 'text',
      intent: 'translate',
      context: `Target language: ${targetLanguage}`,
      ...options
    });
    return response.content;
  }

  /**
   * Generate creative content
   */
  async createContent(prompt: string, options: Partial<AIRequest> = {}): Promise<string> {
    const response = await this.request({
      content: prompt,
      contentType: 'creative',
      intent: 'generate',
      ...options
    });
    return response.content;
  }

  /**
   * Technical analysis and recommendations
   */
  async technicalAnalysis(data: string, context?: string, options: Partial<AIRequest> = {}): Promise<string> {
    const response = await this.request({
      content: data,
      contentType: 'technical',
      intent: 'analyze',
      context,
      priority: 'high',
      ...options
    });
    return response.content;
  }

  /**
   * Batch processing for multiple requests
   */
  async batch(requests: AIRequest[], parallel: boolean = false): Promise<AIResponse[]> {
    if (parallel) {
      const promises = requests.map(request => this.request(request));
      return await Promise.all(promises);
    } else {
      const results: AIResponse[] = [];
      for (const request of requests) {
        const result = await this.request(request);
        results.push(result);
      }
      return results;
    }
  }

  /**
   * Get system status and performance metrics
   */
  async getSystemStatus() {
    return aiAutorouter.getSystemStatus();
  }

  /**
   * Get model recommendations for specific agent
   */
  async getAgentRecommendations(agentId: string) {
    return aiAutorouter.getAgentRecommendations(agentId);
  }
}

// Export singleton instance
export const aiService = new AIService();