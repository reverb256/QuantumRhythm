/**
 * AI Autorouter - Intelligent Model Selection and Request Routing
 * Routes requests to optimal AI models based on content type and user intent
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

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
  provider: 'anthropic' | 'openai' | 'xai' | 'perplexity' | 'io_intelligence';
  strengths: string[];
  contentTypes: string[];
  intents: string[];
  maxTokens: number;
  costPerToken: number;
  responseTime: number; // estimated ms
  reliability: number; // 0-100
  specializations: string[];
  dailyFreeTokens?: number;
  tokensUsedToday?: number;
  resetTime?: Date;
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

export class AIAutorouter {
  private anthropic?: Anthropic;
  private openai?: OpenAI;
  private xai?: OpenAI; // Using OpenAI client for xAI compatibility
  private ioIntelligence?: OpenAI; // IO Intelligence with OpenAI compatibility
  private availableModels: ModelCapability[];
  private requestHistory: Map<string, RoutingResponse[]>;
  private performanceMetrics: Map<string, { latency: number; successRate: number; }>;
  private dailyTokenTracking: Map<string, { used: number; limit: number; resetTime: Date; }>;

  constructor() {
    // Initialize AI clients conditionally
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

    if (process.env.XAI_API_KEY) {
      this.xai = new OpenAI({
        baseURL: "https://api.x.ai/v1",
        apiKey: process.env.XAI_API_KEY,
      });
    }

    if (process.env.IO_INTELLIGENCE_API_KEY) {
      this.ioIntelligence = new OpenAI({
        baseURL: "https://api.intelligence.io.solutions/api/v1",
        apiKey: process.env.IO_INTELLIGENCE_API_KEY,
      });
    }

    this.requestHistory = new Map();
    this.performanceMetrics = new Map();
    this.dailyTokenTracking = new Map();

    // Initialize token tracking and model discovery
    this.initializeTokenTracking();
    this.discoverModels();

    // Define model capabilities
    this.availableModels = [
      {
        name: 'claude-sonnet-4-20250514',
        provider: 'anthropic',
        strengths: ['reasoning', 'analysis', 'code', 'safety'],
        contentTypes: ['text', 'code', 'analysis', 'technical'],
        intents: ['analyze', 'debug', 'optimize', 'explain'],
        maxTokens: 200000,
        costPerToken: 0.000015,
        responseTime: 2000,
        reliability: 98,
        specializations: ['complex reasoning', 'code analysis', 'safety-critical tasks'],
        dailyFreeTokens: 0,
        tokensUsedToday: 0,
        resetTime: new Date()
      },
      {
        name: 'claude-3-7-sonnet-20250219',
        provider: 'anthropic',
        strengths: ['speed', 'general purpose', 'efficiency'],
        contentTypes: ['text', 'analysis', 'creative'],
        intents: ['generate', 'summarize', 'explain'],
        maxTokens: 200000,
        costPerToken: 0.00001,
        responseTime: 1500,
        reliability: 96,
        specializations: ['general purpose', 'fast responses']
      },
      {
        name: 'gpt-4o',
        provider: 'openai',
        strengths: ['multimodal', 'vision', 'creativity', 'general purpose'],
        contentTypes: ['text', 'image', 'code', 'creative'],
        intents: ['generate', 'analyze', 'explain', 'translate'],
        maxTokens: 128000,
        costPerToken: 0.00002,
        responseTime: 3000,
        reliability: 94,
        specializations: ['multimodal processing', 'image analysis', 'creative writing']
      },
      {
        name: 'gpt-4o-mini',
        provider: 'openai',
        strengths: ['speed', 'cost-effective', 'lightweight'],
        contentTypes: ['text', 'code'],
        intents: ['generate', 'summarize'],
        maxTokens: 128000,
        costPerToken: 0.000001,
        responseTime: 800,
        reliability: 92,
        specializations: ['quick tasks', 'cost optimization']
      },
      {
        name: 'grok-2-1212',
        provider: 'xai',
        strengths: ['real-time', 'web-access', 'current events'],
        contentTypes: ['text', 'analysis'],
        intents: ['analyze', 'summarize', 'explain'],
        maxTokens: 128000,
        costPerToken: 0.00001,
        responseTime: 2500,
        reliability: 88,
        specializations: ['current events', 'real-time information', 'web context']
      },
      {
        name: 'grok-2-vision-1212',
        provider: 'xai',
        strengths: ['vision', 'image analysis', 'multimodal'],
        contentTypes: ['image', 'text'],
        intents: ['analyze', 'explain'],
        maxTokens: 128000,
        costPerToken: 0.00002,
        responseTime: 3500,
        reliability: 85,
        specializations: ['image understanding', 'visual analysis'],
        dailyFreeTokens: 0,
        tokensUsedToday: 0,
        resetTime: new Date()
      }
    ];

    console.log('🤖 AI Autorouter initialized with 6 models across 4 providers');
  }

  /**
   * Initialize token tracking system
   */
  private initializeTokenTracking(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Initialize daily token tracking for all models
    this.availableModels?.forEach(model => {
      this.dailyTokenTracking.set(model.name, {
        used: 0,
        limit: model.dailyFreeTokens || 0,
        resetTime: tomorrow
      });
    });

    console.log('📊 Token tracking initialized for all models');
  }

  /**
   * Discover available models and agents from IO Intelligence
   */
  private async discoverModels(): Promise<void> {
    try {
      if (!process.env.IO_INTELLIGENCE_API_KEY) {
        console.log('⚠️ IO Intelligence API key not available, skipping model discovery');
        return;
      }

      // Discover available models
      const modelsResponse = await this.ioIntelligence.models.list();
      
      // Add discovered IO Intelligence models
      const ioModels = modelsResponse.data.map(model => ({
        name: model.id,
        provider: 'io_intelligence' as const,
        strengths: this.inferModelStrengths(model.id),
        contentTypes: ['text', 'code', 'analysis'] as const,
        intents: ['generate', 'analyze', 'summarize'] as const,
        maxTokens: model.max_model_len || 32000,
        costPerToken: 0.000005, // Estimated cost
        responseTime: 2000,
        reliability: 92,
        specializations: this.inferSpecializations(model.id),
        dailyFreeTokens: this.getDailyFreeTokens(model.id),
        tokensUsedToday: 0,
        resetTime: new Date()
      }));

      // Add IO Intelligence models to available models
      this.availableModels.push(...ioModels);

      console.log(`🔍 Discovered ${ioModels.length} IO Intelligence models`);
      
      // Initialize token tracking for new models
      ioModels.forEach(model => {
        this.dailyTokenTracking.set(model.name, {
          used: 0,
          limit: model.dailyFreeTokens || 0,
          resetTime: new Date()
        });
      });

    } catch (error) {
      console.log(`⚠️ Model discovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Infer model strengths from model name
   */
  private inferModelStrengths(modelId: string): string[] {
    const strengths = [];
    
    if (modelId.includes('llama')) {
      strengths.push('reasoning', 'general purpose', 'efficiency');
    }
    if (modelId.includes('claude')) {
      strengths.push('safety', 'analysis', 'code');
    }
    if (modelId.includes('gpt')) {
      strengths.push('creativity', 'multimodal', 'general purpose');
    }
    if (modelId.includes('mixtral')) {
      strengths.push('reasoning', 'multilingual', 'efficiency');
    }
    
    return strengths.length > 0 ? strengths : ['general purpose'];
  }

  /**
   * Infer model specializations from model name
   */
  private inferSpecializations(modelId: string): string[] {
    const specializations = [];
    
    if (modelId.includes('instruct')) {
      specializations.push('instruction following');
    }
    if (modelId.includes('code')) {
      specializations.push('code generation', 'programming');
    }
    if (modelId.includes('chat')) {
      specializations.push('conversational AI');
    }
    if (modelId.includes('70b') || modelId.includes('72b')) {
      specializations.push('large model reasoning');
    }
    
    return specializations.length > 0 ? specializations : ['general tasks'];
  }

  /**
   * Get daily free tokens for IO Intelligence models
   */
  private getDailyFreeTokens(modelId: string): number {
    // Different models have different daily free token allowances
    if (modelId.includes('70b') || modelId.includes('72b')) {
      return 50000; // Large models get fewer free tokens
    }
    if (modelId.includes('8b') || modelId.includes('7b')) {
      return 200000; // Smaller models get more free tokens
    }
    return 100000; // Default allocation
  }

  /**
   * Check if model has available tokens
   */
  private hasAvailableTokens(modelName: string, requestedTokens: number): boolean {
    const tracking = this.dailyTokenTracking.get(modelName);
    if (!tracking) return true; // No tracking means unlimited

    // Check if we need to reset daily counters
    if (new Date() >= tracking.resetTime) {
      tracking.used = 0;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      tracking.resetTime = tomorrow;
    }

    return (tracking.used + requestedTokens) <= tracking.limit;
  }

  /**
   * Track token usage
   */
  private trackTokenUsage(modelName: string, tokensUsed: number): void {
    const tracking = this.dailyTokenTracking.get(modelName);
    if (tracking) {
      tracking.used += tokensUsed;
    }
  }

  /**
   * Route request to optimal AI model
   */
  async routeRequest(request: RoutingRequest, clientApiKeys?: { [provider: string]: string }): Promise<RoutingResponse> {
    try {
      // Check token availability and prevent rate limits
      const estimatedTokens = this.estimateTokenUsage(request);
      
      // Analyze request and determine optimal routing with token consideration
      const routingDecision = await this.analyzeAndRoute(request, estimatedTokens, clientApiKeys);
      
      console.log(`🎯 Routing to ${routingDecision.selectedModel} (confidence: ${routingDecision.confidence}%)`);
      console.log(`💡 Reasoning: ${routingDecision.reasoning}`);

      // Execute request with selected model and client keys
      const response = await this.executeRequest(request, routingDecision, clientApiKeys);
      
      // Track token usage
      this.trackTokenUsage(routingDecision.selectedModel, response.tokensUsed);
      
      // Update performance metrics
      this.updatePerformanceMetrics(routingDecision.selectedModel, response);
      
      // Store in history for learning
      this.storeRequestHistory(request, response);

      return response;

    } catch (error) {
      console.log(`❌ Primary routing failed: ${error}`);
      
      // Attempt fallback routing
      return await this.attemptFallback(request, clientApiKeys);
    }
  }

  /**
   * Estimate token usage for request
   */
  private estimateTokenUsage(request: RoutingRequest): number {
    // Rough estimation: 1 token per 3-4 characters for input + requested output
    const inputTokens = Math.ceil(request.content.length / 3.5);
    const outputTokens = request.maxTokens || 1000;
    return inputTokens + outputTokens;
  }

  /**
   * Analyze request and determine optimal model routing
   */
  private async analyzeAndRoute(request: RoutingRequest, estimatedTokens: number, clientApiKeys?: { [provider: string]: string }): Promise<RoutingDecision> {
    const candidates = this.filterCompatibleModels(request);
    
    if (candidates.length === 0) {
      throw new Error('No compatible models found for request');
    }

    // Score each candidate model
    const scoredCandidates = candidates.map(model => {
      let score = 0;
      
      // Content type compatibility (30% weight)
      if (model.contentTypes.includes(request.contentType)) {
        score += 30;
      }
      
      // Intent compatibility (25% weight)
      if (model.intents.includes(request.intent)) {
        score += 25;
      }
      
      // Priority-based selection (20% weight)
      if (request.priority === 'critical' && model.reliability > 95) {
        score += 20;
      } else if (request.priority === 'high' && model.reliability > 90) {
        score += 15;
      } else if (request.priority === 'low' && model.costPerToken < 0.00001) {
        score += 20; // Prefer cost-effective for low priority
      }
      
      // Performance metrics (15% weight)
      const metrics = this.performanceMetrics.get(model.name);
      if (metrics) {
        score += (metrics.successRate / 100) * 15;
      } else {
        score += (model.reliability / 100) * 15;
      }
      
      // Response time preference (10% weight)
      if (request.priority === 'critical' && model.responseTime < 2000) {
        score += 10;
      } else if (model.responseTime < 1500) {
        score += 5;
      }

      return { model, score };
    });

    // Sort by score and select best
    scoredCandidates.sort((a, b) => b.score - a.score);
    const selectedModel = scoredCandidates[0].model;
    const confidence = Math.min(100, scoredCandidates[0].score);

    // Generate reasoning
    const reasoning = this.generateRoutingReasoning(selectedModel, request, confidence);

    // Prepare fallback models
    const fallbackModels = scoredCandidates
      .slice(1, 3)
      .map(candidate => candidate.model.name);

    return {
      selectedModel: selectedModel.name,
      provider: selectedModel.provider,
      confidence,
      reasoning,
      fallbackModels,
      estimatedCost: this.estimateCost(request, selectedModel),
      estimatedTime: selectedModel.responseTime
    };
  }

  /**
   * Filter models compatible with request
   */
  private filterCompatibleModels(request: RoutingRequest): ModelCapability[] {
    return this.availableModels.filter(model => {
      // Check API key availability
      if (!this.isProviderAvailable(model.provider)) {
        return false;
      }

      // Check content type compatibility
      if (!model.contentTypes.includes(request.contentType)) {
        return false;
      }

      // Check token limit
      if (request.maxTokens && request.maxTokens > model.maxTokens) {
        return false;
      }

      return true;
    });
  }

  /**
   * Check if provider API key is available
   */
  private isProviderAvailable(provider: string, clientApiKeys?: { [provider: string]: string }): boolean {
    // Check client-provided API keys first
    if (clientApiKeys && clientApiKeys[provider]) {
      return true;
    }
    
    // Check server environment variables and client instances
    switch (provider) {
      case 'anthropic':
        return !!process.env.ANTHROPIC_API_KEY && !!this.anthropic;
      case 'openai':
        return !!process.env.OPENAI_API_KEY && !!this.openai;
      case 'xai':
        return !!process.env.XAI_API_KEY && !!this.xai;
      case 'io_intelligence':
        return !!process.env.IO_INTELLIGENCE_API_KEY && !!this.ioIntelligence;
      case 'perplexity':
        return !!process.env.PERPLEXITY_API_KEY;
      default:
        return false;
    }
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
          response = await this.executeAnthropicRequest(request, decision);
          tokensUsed = response.usage?.input_tokens + response.usage?.output_tokens || 0;
          break;
        
        case 'openai':
          response = await this.executeOpenAIRequest(request, decision);
          tokensUsed = response.usage?.total_tokens || 0;
          break;
        
        case 'xai':
          response = await this.executeXAIRequest(request, decision);
          tokensUsed = response.usage?.total_tokens || 0;
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
        metadata: {
          reasoning: decision.reasoning,
          fallbackModels: decision.fallbackModels,
          rawResponse: response
        }
      };

    } catch (error) {
      throw new Error(`Model execution failed: ${error}`);
    }
  }

  /**
   * Execute Anthropic request
   */
  private async executeAnthropicRequest(request: RoutingRequest, decision: RoutingDecision): Promise<any> {
    const systemPrompt = this.generateSystemPrompt(request);
    
    return await this.anthropic.messages.create({
      model: decision.selectedModel,
      max_tokens: request.maxTokens || 4000,
      temperature: request.temperature || 0.7,
      system: systemPrompt,
      messages: [{ role: 'user', content: request.content }],
    });
  }

  /**
   * Execute OpenAI request
   */
  private async executeOpenAIRequest(request: RoutingRequest, decision: RoutingDecision): Promise<any> {
    const systemPrompt = this.generateSystemPrompt(request);
    
    return await this.openai.chat.completions.create({
      model: decision.selectedModel,
      max_tokens: request.maxTokens || 4000,
      temperature: request.temperature || 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: request.content }
      ],
    });
  }

  /**
   * Execute xAI request
   */
  private async executeXAIRequest(request: RoutingRequest, decision: RoutingDecision): Promise<any> {
    const systemPrompt = this.generateSystemPrompt(request);
    
    return await this.xai.chat.completions.create({
      model: decision.selectedModel,
      max_tokens: request.maxTokens || 4000,
      temperature: request.temperature || 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: request.content }
      ],
    });
  }

  /**
   * Generate system prompt based on request intent
   */
  private generateSystemPrompt(request: RoutingRequest): string {
    const basePrompt = "You are an expert AI assistant providing high-quality responses.";
    
    const intentPrompts = {
      analyze: "Focus on thorough analysis with clear reasoning and evidence-based conclusions.",
      generate: "Create high-quality, original content that meets the user's specifications.",
      summarize: "Provide concise, accurate summaries that capture key information.",
      debug: "Systematically identify issues and provide clear solutions with explanations.",
      optimize: "Suggest improvements with specific, actionable recommendations.",
      explain: "Provide clear, educational explanations appropriate for the context.",
      translate: "Ensure accurate, contextually appropriate translations."
    };

    const contextPrompt = request.context ? `\n\nContext: ${request.context}` : "";
    
    return basePrompt + " " + intentPrompts[request.intent] + contextPrompt;
  }

  /**
   * Extract content from API response
   */
  private extractContent(response: any): string {
    if (response.content && Array.isArray(response.content)) {
      return response.content[0]?.text || '';
    }
    if (response.choices && response.choices[0]?.message?.content) {
      return response.choices[0].message.content;
    }
    return response.content || response.text || '';
  }

  /**
   * Attempt fallback routing if primary fails
   */
  private async attemptFallback(request: RoutingRequest): Promise<RoutingResponse> {
    console.log('🔄 Attempting fallback routing...');
    
    // Try most reliable model as fallback
    const fallbackModel = this.availableModels
      .filter(model => this.isProviderAvailable(model.provider))
      .sort((a, b) => b.reliability - a.reliability)[0];

    if (!fallbackModel) {
      throw new Error('No fallback models available');
    }

    const fallbackDecision: RoutingDecision = {
      selectedModel: fallbackModel.name,
      provider: fallbackModel.provider,
      confidence: 60,
      reasoning: 'Fallback routing due to primary failure',
      fallbackModels: [],
      estimatedCost: this.estimateCost(request, fallbackModel),
      estimatedTime: fallbackModel.responseTime
    };

    return await this.executeRequest(request, fallbackDecision);
  }

  /**
   * Generate routing reasoning explanation
   */
  private generateRoutingReasoning(model: ModelCapability, request: RoutingRequest, confidence: number): string {
    const reasons = [];
    
    if (model.contentTypes.includes(request.contentType)) {
      reasons.push(`optimized for ${request.contentType} content`);
    }
    
    if (model.intents.includes(request.intent)) {
      reasons.push(`specialized in ${request.intent} tasks`);
    }
    
    if (request.priority === 'critical' && model.reliability > 95) {
      reasons.push('high reliability for critical tasks');
    }
    
    if (request.priority === 'low' && model.costPerToken < 0.00001) {
      reasons.push('cost-effective for low-priority requests');
    }
    
    return `Selected for: ${reasons.join(', ')}`;
  }

  /**
   * Estimate request cost
   */
  private estimateCost(request: RoutingRequest, model: ModelCapability): number {
    const estimatedTokens = Math.min(
      request.content.length / 3 + (request.maxTokens || 1000),
      model.maxTokens
    );
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
   * Update performance metrics
   */
  private updatePerformanceMetrics(modelName: string, response: RoutingResponse): void {
    const existing = this.performanceMetrics.get(modelName) || { latency: 0, successRate: 100 };
    
    // Update latency (moving average)
    existing.latency = (existing.latency * 0.8) + (response.processingTime * 0.2);
    
    // Update success rate based on response quality
    const isSuccess = response.content.length > 10 && response.processingTime < 30000;
    existing.successRate = (existing.successRate * 0.9) + (isSuccess ? 10 : 0);
    
    this.performanceMetrics.set(modelName, existing);
  }

  /**
   * Store request history for learning
   */
  private storeRequestHistory(request: RoutingRequest, response: RoutingResponse): void {
    const agentId = request.agentId || 'default';
    const history = this.requestHistory.get(agentId) || [];
    
    history.push(response);
    if (history.length > 100) {
      history.shift(); // Keep last 100 requests
    }
    
    this.requestHistory.set(agentId, history);
  }

  /**
   * Get routing recommendations for agent
   */
  getAgentRecommendations(agentId: string): {
    preferredModels: string[];
    avgCost: number;
    avgLatency: number;
    successRate: number;
  } {
    const history = this.requestHistory.get(agentId) || [];
    
    if (history.length === 0) {
      return {
        preferredModels: ['claude-sonnet-4-20250514'],
        avgCost: 0,
        avgLatency: 0,
        successRate: 100
      };
    }

    // Analyze agent's usage patterns
    const modelUsage = new Map<string, { count: number; totalCost: number; totalTime: number; }>();
    
    history.forEach(response => {
      const usage = modelUsage.get(response.model) || { count: 0, totalCost: 0, totalTime: 0 };
      usage.count++;
      usage.totalCost += response.cost;
      usage.totalTime += response.processingTime;
      modelUsage.set(response.model, usage);
    });

    // Find preferred models (most used and best performing)
    const preferredModels = Array.from(modelUsage.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 3)
      .map(entry => entry[0]);

    const totalCost = history.reduce((sum, r) => sum + r.cost, 0);
    const totalTime = history.reduce((sum, r) => sum + r.processingTime, 0);
    const successCount = history.filter(r => r.confidence > 70).length;

    return {
      preferredModels,
      avgCost: totalCost / history.length,
      avgLatency: totalTime / history.length,
      successRate: (successCount / history.length) * 100
    };
  }

  /**
   * Get system status
   */
  getSystemStatus(): {
    availableModels: number;
    totalRequests: number;
    avgLatency: number;
    systemHealth: string;
  } {
    const availableCount = this.availableModels.filter(m => this.isProviderAvailable(m.provider)).length;
    const totalRequests = Array.from(this.requestHistory.values()).reduce((sum, history) => sum + history.length, 0);
    
    const allLatencies = Array.from(this.performanceMetrics.values()).map(m => m.latency);
    const avgLatency = allLatencies.length > 0 ? allLatencies.reduce((sum, l) => sum + l, 0) / allLatencies.length : 0;
    
    const health = availableCount > 3 ? 'healthy' : availableCount > 1 ? 'degraded' : 'critical';

    return {
      availableModels: availableCount,
      totalRequests,
      avgLatency,
      systemHealth: health
    };
  }
}

// Export singleton instance
export const aiAutorouter = new AIAutorouter();