// IO Intelligence API integration with multi-agent orchestration
// Inspired by Agent Zero architecture with enhanced security and rate limiting

import { z } from 'zod';
import { 
  IOIntelligenceConfig, 
  IOModelsResponseSchema, 
  IOAgentsResponseSchema,
  IOChatCompletionRequestSchema,
  IOChatCompletionResponseSchema,
  TaskSchema,
  AgentInsightSchema,
  ModelCategories,
  ModelQuotas,
  type IOModel,
  type IOAgent,
  type Task,
  type AgentInsight,
  type RateLimitInfo
} from '../shared/io-intelligence.js';

// Sanitization and validation using Zod
const APIKeySchema = z.string().min(10).max(200).regex(/^[a-zA-Z0-9_-]+$/);
const ModelNameSchema = z.string().min(3).max(100).regex(/^[a-zA-Z0-9/_.-]+$/);
const UserInputSchema = z.string().min(1).max(50000);

class IOIntelligenceOrchestrator {
  private apiKey: string;
  private baseUrl: string;
  private models: IOModel[] = [];
  private agents: Record<string, IOAgent> = {};
  private rateLimits: Map<string, RateLimitInfo> = new Map();
  private taskQueue: Task[] = [];
  private insights: AgentInsight[] = [];
  
  constructor(apiKey: string) {
    // Sanitize API key
    const validatedKey = APIKeySchema.parse(apiKey);
    this.apiKey = validatedKey;
    this.baseUrl = IOIntelligenceConfig.baseUrl;
    this.initializeOrchestrator();
  }

  private async initializeOrchestrator() {
    try {
      await this.discoverModels();
      await this.discoverAgents();
      this.startRateLimitMonitoring();
      console.log('🤖 IO Intelligence Orchestrator initialized with Agent Zero architecture');
    } catch (error) {
      console.error('Failed to initialize orchestrator:', error);
    }
  }

  // Model Discovery - Dynamic discovery of available models
  async discoverModels(): Promise<IOModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}${IOIntelligenceConfig.modelsEndpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();
      const validatedData = IOModelsResponseSchema.parse(data);
      this.models = validatedData.data;
      
      console.log(`🎯 Discovered ${this.models.length} models`);
      return this.models;
    } catch (error) {
      console.error('Model discovery failed:', error);
      return [];
    }
  }

  // Agent Discovery - Dynamic discovery of available agents
  async discoverAgents(): Promise<Record<string, IOAgent>> {
    try {
      const response = await fetch(`${this.baseUrl}${IOIntelligenceConfig.agentsEndpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.status}`);
      }

      const data = await response.json();
      const validatedData = IOAgentsResponseSchema.parse(data);
      this.agents = validatedData.agents;
      
      console.log(`🤖 Discovered ${Object.keys(this.agents).length} agents`);
      return this.agents;
    } catch (error) {
      console.error('Agent discovery failed:', error);
      return {};
    }
  }

  // Intelligent Model Selection based on task type and current limits
  selectOptimalModel(taskType: string, contextLength?: number): string {
    // Sanitize task type
    const sanitizedTaskType = z.string().min(1).max(50).parse(taskType);
    
    // Get models for task category
    const categoryModels = ModelCategories[sanitizedTaskType as keyof typeof ModelCategories] || ModelCategories.general;
    
    // Filter by context length if specified
    let availableModels = categoryModels;
    if (contextLength) {
      availableModels = categoryModels.filter(model => {
        const quota = ModelQuotas[model as keyof typeof ModelQuotas];
        return quota && quota.context >= contextLength;
      });
    }
    
    // Filter by rate limits
    const modelWithQuota = availableModels.find(model => {
      const rateLimitInfo = this.rateLimits.get(model);
      return !rateLimitInfo || rateLimitInfo.remainingTokens > 1000; // Keep 1k token buffer
    });
    
    // Fallback to any available model
    const selectedModel = modelWithQuota || availableModels[0] || this.models[0]?.id;
    
    // Log selection reasoning
    this.recordInsight({
      insight_type: 'model_preference',
      description: `Selected ${selectedModel} for ${taskType} task`,
      confidence: modelWithQuota ? 0.9 : 0.6,
      data: { taskType, contextLength, availableModels, rateLimitStatus: !!modelWithQuota },
      timestamp: new Date(),
    });
    
    return selectedModel;
  }

  // Execute Chat Completion with rate limit handling
  async executeCompletion(request: {
    model?: string;
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
    taskType?: string;
    maxTokens?: number;
    temperature?: number;
  }): Promise<{ content: string; tokensUsed: number; model: string }> {
    // Sanitize and validate input
    const sanitizedMessages = request.messages.map(msg => ({
      role: msg.role,
      content: UserInputSchema.parse(msg.content)
    }));

    // Select optimal model if not specified
    const model = request.model ? ModelNameSchema.parse(request.model) : 
                  this.selectOptimalModel(request.taskType || 'general', request.maxTokens);

    // Check rate limits
    const rateLimitInfo = this.rateLimits.get(model);
    if (rateLimitInfo && rateLimitInfo.remainingTokens < 100) {
      throw new Error(`Rate limit exceeded for model ${model}. Try again after ${rateLimitInfo.resetTime}`);
    }

    // Prepare request
    const completionRequest = IOChatCompletionRequestSchema.parse({
      model,
      messages: sanitizedMessages,
      temperature: request.temperature || 0.7,
      max_completion_tokens: request.maxTokens || 1000,
      stream: false,
      reasoning_content: true,
    });

    try {
      const response = await fetch(`${this.baseUrl}${IOIntelligenceConfig.chatEndpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completionRequest),
      });

      if (!response.ok) {
        if (response.status === 429) {
          // Update rate limit info
          this.updateRateLimitInfo(model, 0);
          throw new Error(`Rate limited on model ${model}`);
        }
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const validatedResponse = IOChatCompletionResponseSchema.parse(data);
      
      // Update rate limit tracking
      this.updateRateLimitInfo(model, validatedResponse.usage.total_tokens);
      
      // Record usage insight
      this.recordInsight({
        insight_type: 'usage_pattern',
        description: `Completion executed on ${model}`,
        confidence: 1.0,
        data: {
          model,
          tokensUsed: validatedResponse.usage.total_tokens,
          taskType: request.taskType,
          promptTokens: validatedResponse.usage.prompt_tokens,
          completionTokens: validatedResponse.usage.completion_tokens,
        },
        timestamp: new Date(),
      });

      return {
        content: validatedResponse.choices[0].message.content,
        tokensUsed: validatedResponse.usage.total_tokens,
        model: validatedResponse.model,
      };
    } catch (error) {
      console.error('Completion execution failed:', error);
      throw error;
    }
  }

  // Multi-Agent Task Orchestration
  async orchestrateTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newTask: Task = {
      ...task,
      id: taskId,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Validate task
    const validatedTask = TaskSchema.parse(newTask);
    this.taskQueue.push(validatedTask);

    try {
      validatedTask.status = 'running';
      validatedTask.updated_at = new Date();

      // Select appropriate agent and model
      const selectedModel = this.selectOptimalModel(validatedTask.type);
      
      // Prepare system prompt based on task type
      const systemPrompt = this.generateSystemPrompt(validatedTask.type);
      
      // Execute the task
      const result = await this.executeCompletion({
        model: selectedModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: validatedTask.input }
        ],
        taskType: validatedTask.type,
        maxTokens: this.getMaxTokensForTaskType(validatedTask.type),
      });

      validatedTask.result = result.content;
      validatedTask.tokens_used = result.tokensUsed;
      validatedTask.status = 'completed';
      validatedTask.updated_at = new Date();

      console.log(`✅ Task ${taskId} completed using ${result.model}`);
      return validatedTask;

    } catch (error) {
      validatedTask.status = 'failed';
      validatedTask.error = error instanceof Error ? error.message : 'Unknown error';
      validatedTask.updated_at = new Date();
      
      console.error(`❌ Task ${taskId} failed:`, error);
      return validatedTask;
    }
  }

  // System prompt generation for different task types
  private generateSystemPrompt(taskType: string): string {
    const prompts = {
      reasoning: "You are a logic-driven problem solver. Break down complex scenarios into clear, step-by-step conclusions. Focus on structured thinking and insightful analysis.",
      summarization: "You are a summarization specialist. Extract key insights efficiently while maintaining coherence and contextual relevance.",
      sentiment_analysis: "You are a sentiment analysis expert. Analyze text for emotional tone, providing precise sentiment classification with confidence scores.",
      translation: "You are a professional translator. Provide accurate, contextually appropriate translations while preserving meaning and tone.",
      code_generation: "You are a senior software engineer. Write clean, efficient, well-documented code following best practices and security guidelines.",
      data_extraction: "You are a data extraction specialist. Extract structured information from unstructured text with high accuracy and completeness."
    };

    return prompts[taskType as keyof typeof prompts] || 
           "You are a helpful AI assistant. Provide accurate, helpful, and well-structured responses.";
  }

  // Get optimal token limits for task types
  private getMaxTokensForTaskType(taskType: string): number {
    const tokenLimits = {
      reasoning: 2000,
      summarization: 1000,
      sentiment_analysis: 500,
      translation: 3000,
      code_generation: 4000,
      data_extraction: 1500,
    };

    return tokenLimits[taskType as keyof typeof tokenLimits] || 1000;
  }

  // Rate limit monitoring and management
  private updateRateLimitInfo(model: string, tokensUsed: number) {
    const existing = this.rateLimits.get(model);
    const quota = ModelQuotas[model as keyof typeof ModelQuotas];
    
    if (quota) {
      const now = new Date();
      const resetTime = new Date(now);
      resetTime.setHours(24, 0, 0, 0); // Reset at midnight
      
      const currentUsed = existing ? existing.usedTokens + tokensUsed : tokensUsed;
      
      this.rateLimits.set(model, {
        model,
        dailyQuota: quota.daily,
        usedTokens: currentUsed,
        remainingTokens: quota.daily - currentUsed,
        resetTime: resetTime.toISOString(),
        contextLength: quota.context,
      });
    }
  }

  private startRateLimitMonitoring() {
    // Reset rate limits daily
    setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        this.rateLimits.clear();
        console.log('🔄 Rate limits reset for new day');
      }
    }, 60000); // Check every minute
  }

  // Insight recording for learning and optimization
  private recordInsight(insight: Omit<AgentInsight, 'timestamp'>): void {
    const fullInsight = AgentInsightSchema.parse({
      ...insight,
      timestamp: new Date(),
    });
    
    this.insights.push(fullInsight);
    
    // Keep only last 1000 insights to prevent memory bloat
    if (this.insights.length > 1000) {
      this.insights = this.insights.slice(-1000);
    }
  }

  // Public methods for accessing orchestrator state
  getAvailableModels(): IOModel[] {
    return this.models;
  }

  getAvailableAgents(): Record<string, IOAgent> {
    return this.agents;
  }

  getRateLimitStatus(): Array<RateLimitInfo> {
    return Array.from(this.rateLimits.values());
  }

  getRecentInsights(limit: number = 10): AgentInsight[] {
    return this.insights.slice(-limit);
  }

  getTaskQueue(): Task[] {
    return this.taskQueue;
  }
}

export { IOIntelligenceOrchestrator };