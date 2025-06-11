/**
 * AI Autorouter - Fixed Version
 * Intelligent Model Selection and Request Routing with working providers only
 */

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

interface RoutingRequest {
  content: string;
  contentType: 'text' | 'code' | 'image' | 'audio' | 'analysis' | 'creative' | 'technical';
  intent: 'generate' | 'analyze' | 'summarize' | 'debug' | 'optimize' | 'explain' | 'translate';
  priority: 'low' | 'medium' | 'high' | 'critical';
  context?: string;
  maxTokens?: number;
  temperature?: number;
  agentId?: string;
}

interface ModelCapability {
  name: string;
  provider: 'anthropic' | 'openai' | 'fallback';
  strengths: string[];
  contentTypes: string[];
  intents: string[];
  maxTokens: number;
  costPerToken: number;
  responseTime: number;
  reliability: number;
  specializations: string[];
}

interface RoutingDecision {
  selectedModel: string;
  provider: string;
  confidence: number;
  reasoning: string;
  fallbackModels: string[];
  estimatedCost: number;
  estimatedTime: number;
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

export class AIAutorouterFixed {
  private anthropic?: Anthropic;
  private openai?: OpenAI;
  private availableModels: ModelCapability[];
  private requestHistory: Map<string, RoutingResponse[]>;
  private performanceMetrics: Map<string, { latency: number; successRate: number; }>;

  constructor() {
    this.availableModels = [];
    this.requestHistory = new Map();
    this.performanceMetrics = new Map();

    // Initialize API clients only if keys are available
    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }

    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    // Initialize working model configurations
    this.initializeWorkingModels();
    console.log(`🤖 AI Autorouter Fixed initialized with ${this.availableModels.length} working models`);
  }

  /**
   * Initialize working model configurations
   */
  private initializeWorkingModels(): void {
    this.availableModels = [
      // Anthropic models (if API key available)
      ...(this.anthropic ? [{
        name: 'claude-3-5-sonnet-20241022',
        provider: 'anthropic' as const,
        strengths: ['reasoning', 'analysis', 'code', 'safety'],
        contentTypes: ['text', 'code', 'analysis', 'technical'],
        intents: ['analyze', 'debug', 'optimize', 'explain'],
        maxTokens: 200000,
        costPerToken: 0.000015,
        responseTime: 2000,
        reliability: 98,
        specializations: ['complex reasoning', 'code analysis', 'safety-critical tasks']
      }] : []),

      // OpenAI models (if API key available)
      ...(this.openai ? [{
        name: 'gpt-4',
        provider: 'openai' as const,
        strengths: ['general purpose', 'creative', 'reasoning'],
        contentTypes: ['text', 'code', 'creative', 'analysis'],
        intents: ['generate', 'analyze', 'summarize', 'explain'],
        maxTokens: 8192,
        costPerToken: 0.00003,
        responseTime: 3000,
        reliability: 95,
        specializations: ['creative writing', 'general analysis', 'code generation']
      }, {
        name: 'gpt-3.5-turbo',
        provider: 'openai' as const,
        strengths: ['fast', 'efficient', 'general purpose'],
        contentTypes: ['text', 'code', 'analysis'],
        intents: ['generate', 'analyze', 'summarize'],
        maxTokens: 4096,
        costPerToken: 0.000002,
        responseTime: 1500,
        reliability: 92,
        specializations: ['quick responses', 'basic analysis', 'efficient processing']
      }] : []),

      // Fallback model (always available)
      {
        name: 'fallback-analyzer',
        provider: 'fallback' as const,
        strengths: ['reliable', 'always available', 'rule-based'],
        contentTypes: ['text', 'analysis'],
        intents: ['analyze', 'summarize'],
        maxTokens: 2048,
        costPerToken: 0,
        responseTime: 100,
        reliability: 100,
        specializations: ['sentiment analysis', 'basic text processing', 'emergency fallback']
      }
    ];
  }

  /**
   * Route request to optimal AI model
   */
  async routeRequest(request: RoutingRequest): Promise<RoutingResponse> {
    const startTime = Date.now();

    try {
      // Filter compatible models
      const compatibleModels = this.filterCompatibleModels(request);
      
      if (compatibleModels.length === 0) {
        throw new Error('No compatible models available');
      }

      // Select best model
      const selectedModel = this.selectOptimalModel(compatibleModels, request);
      const decision: RoutingDecision = {
        selectedModel: selectedModel.name,
        provider: selectedModel.provider,
        confidence: 0.9,
        reasoning: `Selected ${selectedModel.name} for ${request.intent} task`,
        fallbackModels: compatibleModels.slice(1).map(m => m.name),
        estimatedCost: this.estimateCost(request, selectedModel),
        estimatedTime: selectedModel.responseTime
      };

      // Execute request
      const response = await this.executeRequest(request, decision);
      return response;

    } catch (error) {
      console.error('AI routing failed:', error);
      
      // Emergency fallback
      return {
        content: this.generateFallbackResponse(request),
        model: 'fallback-analyzer',
        provider: 'fallback',
        processingTime: Date.now() - startTime,
        tokensUsed: 0,
        cost: 0,
        confidence: 0.6,
        metadata: { fallback: true, error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  /**
   * Filter models compatible with request
   */
  private filterCompatibleModels(request: RoutingRequest): ModelCapability[] {
    return this.availableModels.filter(model => {
      // Check content type compatibility
      if (!model.contentTypes.includes(request.contentType)) {
        return false;
      }

      // Check intent compatibility
      if (!model.intents.includes(request.intent)) {
        return false;
      }

      // Check provider availability
      if (model.provider === 'anthropic' && !this.anthropic) {
        return false;
      }
      if (model.provider === 'openai' && !this.openai) {
        return false;
      }

      return true;
    });
  }

  /**
   * Select optimal model from compatible options
   */
  private selectOptimalModel(models: ModelCapability[], request: RoutingRequest): ModelCapability {
    // Sort by reliability and capability match
    return models.sort((a, b) => {
      // Prefer non-fallback models if available
      if (a.provider === 'fallback' && b.provider !== 'fallback') return 1;
      if (b.provider === 'fallback' && a.provider !== 'fallback') return -1;
      
      // Sort by reliability
      return b.reliability - a.reliability;
    })[0];
  }

  /**
   * Execute request with selected model
   */
  private async executeRequest(request: RoutingRequest, decision: RoutingDecision): Promise<RoutingResponse> {
    const startTime = Date.now();

    try {
      let response: any;
      let tokensUsed = 0;

      switch (decision.provider) {
        case 'anthropic':
          if (!this.anthropic) throw new Error('Anthropic client not available');
          response = await this.anthropic.messages.create({
            model: decision.selectedModel,
            max_tokens: Math.min(request.maxTokens || 1000, 4000),
            messages: [{ role: 'user', content: request.content }],
            temperature: request.temperature || 0.3
          });
          tokensUsed = response.usage?.input_tokens + response.usage?.output_tokens || 0;
          break;

        case 'openai':
          if (!this.openai) throw new Error('OpenAI client not available');
          response = await this.openai.chat.completions.create({
            model: decision.selectedModel,
            max_tokens: Math.min(request.maxTokens || 1000, 4000),
            messages: [{ role: 'user', content: request.content }],
            temperature: request.temperature || 0.3
          });
          tokensUsed = response.usage?.total_tokens || 0;
          break;

        case 'fallback':
          response = { content: this.generateFallbackResponse(request) };
          break;

        default:
          throw new Error(`Unsupported provider: ${decision.provider}`);
      }

      const processingTime = Date.now() - startTime;
      const cost = this.calculateActualCost(decision.selectedModel, tokensUsed);

      return {
        content: this.extractContent(response),
        model: decision.selectedModel,
        provider: decision.provider,
        processingTime,
        tokensUsed,
        cost,
        confidence: decision.confidence,
        metadata: { decision }
      };

    } catch (error) {
      throw new Error(`Model execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract content from API response
   */
  private extractContent(response: any): string {
    if (typeof response === 'string') return response;
    if (response.content) return response.content;
    if (response.choices?.[0]?.message?.content) return response.choices[0].message.content;
    if (response.content?.[0]?.text) return response.content[0].text;
    return 'Response processed successfully';
  }

  /**
   * Generate fallback response for emergency situations
   */
  private generateFallbackResponse(request: RoutingRequest): string {
    switch (request.intent) {
      case 'analyze':
        if (request.contentType === 'text') {
          // Simple sentiment analysis
          const content = request.content.toLowerCase();
          const positiveWords = ['good', 'great', 'excellent', 'positive', 'bullish', 'up', 'gain', 'profit'];
          const negativeWords = ['bad', 'terrible', 'negative', 'bearish', 'down', 'loss', 'crash', 'decline'];
          
          const positiveCount = positiveWords.filter(word => content.includes(word)).length;
          const negativeCount = negativeWords.filter(word => content.includes(word)).length;
          
          if (positiveCount > negativeCount) {
            return 'POSITIVE sentiment detected in content';
          } else if (negativeCount > positiveCount) {
            return 'NEGATIVE sentiment detected in content';
          } else {
            return 'NEUTRAL sentiment detected in content';
          }
        }
        return 'Analysis completed using fallback system';
        
      case 'summarize':
        const words = request.content.split(' ');
        const summary = words.slice(0, Math.min(50, Math.floor(words.length / 2))).join(' ');
        return `Summary: ${summary}...`;
        
      default:
        return `Processed ${request.intent} request using fallback system`;
    }
  }

  /**
   * Estimate request cost
   */
  private estimateCost(request: RoutingRequest, model: ModelCapability): number {
    const estimatedTokens = Math.min(request.content.length / 3, request.maxTokens || 1000);
    return estimatedTokens * model.costPerToken;
  }

  /**
   * Calculate actual cost
   */
  private calculateActualCost(modelName: string, tokensUsed: number): number {
    const model = this.availableModels.find(m => m.name === modelName);
    return model ? tokensUsed * model.costPerToken : 0;
  }

  /**
   * Get system status
   */
  getSystemStatus(): {
    availableModels: number;
    workingProviders: string[];
    requestsProcessed: number;
    averageLatency: number;
  } {
    const workingProviders = [...new Set(this.availableModels.map(m => m.provider))];
    const totalRequests = Array.from(this.requestHistory.values()).reduce((sum, requests) => sum + requests.length, 0);
    const totalLatency = Array.from(this.requestHistory.values())
      .flat()
      .reduce((sum, response) => sum + response.processingTime, 0);

    return {
      availableModels: this.availableModels.length,
      workingProviders,
      requestsProcessed: totalRequests,
      averageLatency: totalRequests > 0 ? totalLatency / totalRequests : 0
    };
  }
}

export const aiAutorouterFixed = new AIAutorouterFixed();