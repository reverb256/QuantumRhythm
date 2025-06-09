// Client-side IO Intelligence integration with comprehensive error handling
import { z } from 'zod';

// Response schemas for client-side validation
const ChatResponseSchema = z.object({
  success: z.boolean(),
  content: z.string(),
  model: z.string(),
  tokensUsed: z.number(),
  timestamp: z.string(),
});

const TaskResponseSchema = z.object({
  success: z.boolean(),
  task: z.object({
    id: z.string(),
    type: z.string(),
    status: z.string(),
    result: z.string().optional(),
    tokensUsed: z.number().optional(),
    executionTime: z.number().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

const StatusResponseSchema = z.object({
  success: z.boolean(),
  status: z.string(),
  rateLimits: z.array(z.object({
    model: z.string(),
    remainingTokens: z.number(),
    dailyQuota: z.number(),
    resetTime: z.string(),
  })),
  insights: z.array(z.object({
    type: z.string(),
    description: z.string(),
    confidence: z.number(),
    timestamp: z.string(),
  })),
  taskQueue: z.object({
    pending: z.number(),
    running: z.number(),
    completed: z.number(),
    failed: z.number(),
  }),
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type TaskResponse = z.infer<typeof TaskResponseSchema>;
export type StatusResponse = z.infer<typeof StatusResponseSchema>;

export class IOIntelligenceClient {
  private baseUrl: string;
  
  constructor(baseUrl: string = '/api/io-intelligence') {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {},
    schema: z.ZodSchema<T>
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Response validation error:', error.errors);
        throw new Error('Invalid response format from server');
      }
      throw error;
    }
  }

  // Chat completion with the AI
  async chat(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>, options?: {
    taskType?: string;
    maxTokens?: number;
    temperature?: number;
    model?: string;
  }): Promise<ChatResponse> {
    return this.makeRequest('/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages,
        ...options,
      }),
    }, ChatResponseSchema);
  }

  // Execute specialized task
  async executeTask(
    type: 'reasoning' | 'summarization' | 'sentiment_analysis' | 'translation' | 'code_generation' | 'data_extraction',
    description: string,
    input: string,
    priority?: 'low' | 'medium' | 'high' | 'critical'
  ): Promise<TaskResponse> {
    return this.makeRequest('/task', {
      method: 'POST',
      body: JSON.stringify({
        type,
        description,
        input,
        priority,
      }),
    }, TaskResponseSchema);
  }

  // Analyze portfolio content
  async analyzeContent(content: string, analysisType: 'general' | 'performance' | 'security' | 'ux' = 'general'): Promise<ChatResponse> {
    return this.makeRequest('/analyze', {
      method: 'POST',
      body: JSON.stringify({
        content,
        analysisType,
      }),
    }, ChatResponseSchema);
  }

  // Get system status and insights
  async getStatus(): Promise<StatusResponse> {
    return this.makeRequest('/status', {}, StatusResponseSchema);
  }

  // Get available models
  async getModels(): Promise<{ success: boolean; models: any[]; count: number }> {
    return this.makeRequest('/models', {}, z.object({
      success: z.boolean(),
      models: z.array(z.any()),
      count: z.number(),
    }));
  }

  // Get available agents
  async getAgents(): Promise<{ success: boolean; agents: any[]; count: number }> {
    return this.makeRequest('/agents', {}, z.object({
      success: z.boolean(),
      agents: z.array(z.any()),
      count: z.number(),
    }));
  }

  // Get AI insights
  async getInsights(): Promise<{ success: boolean; insights: Record<string, any[]>; totalInsights: number }> {
    return this.makeRequest('/insights', {}, z.object({
      success: z.boolean(),
      insights: z.record(z.array(z.any())),
      totalInsights: z.number(),
    }));
  }

  // Convenience methods for common tasks

  // Summarize text content
  async summarize(text: string, maxWords: number = 100): Promise<string> {
    const response = await this.executeTask(
      'summarization',
      `Summarize the following text in approximately ${maxWords} words`,
      text,
      'medium'
    );
    return response.task.result || 'Summary not available';
  }

  // Analyze sentiment of text
  async analyzeSentiment(text: string): Promise<string> {
    const response = await this.executeTask(
      'sentiment_analysis',
      'Analyze the sentiment and emotional tone of this text',
      text,
      'medium'
    );
    return response.task.result || 'Sentiment analysis not available';
  }

  // Generate code with AI assistance
  async generateCode(description: string, language: string = 'typescript'): Promise<string> {
    const response = await this.executeTask(
      'code_generation',
      `Generate ${language} code for: ${description}`,
      description,
      'medium'
    );
    return response.task.result || 'Code generation not available';
  }

  // Extract structured data from text
  async extractData(text: string, dataType: string): Promise<string> {
    const response = await this.executeTask(
      'data_extraction',
      `Extract ${dataType} from the following text`,
      text,
      'medium'
    );
    return response.task.result || 'Data extraction not available';
  }

  // Portfolio-specific methods

  // Optimize page content for better engagement
  async optimizeContent(content: string): Promise<string> {
    const response = await this.analyzeContent(content, 'ux');
    return response.content;
  }

  // Security review of content or code
  async securityReview(content: string): Promise<string> {
    const response = await this.analyzeContent(content, 'security');
    return response.content;
  }

  // Performance analysis of content
  async performanceAnalysis(content: string): Promise<string> {
    const response = await this.analyzeContent(content, 'performance');
    return response.content;
  }

  // VibeCoding methodology integration

  // Apply pizza kitchen work ethic principles to code analysis
  async applyWorkEthicAnalysis(code: string): Promise<string> {
    const response = await this.chat([
      {
        role: 'system',
        content: 'You are analyzing code through the lens of pizza kitchen work ethic: reliability, consistency, attention to detail, and customer satisfaction. Evaluate the code for these qualities.'
      },
      {
        role: 'user',
        content: `Analyze this code with pizza kitchen work ethic principles:\n\n${code}`
      }
    ], {
      taskType: 'reasoning',
      temperature: 0.3,
      maxTokens: 1500
    });
    return response.content;
  }

  // Apply rhythm gaming precision to timing-critical code
  async applyPrecisionAnalysis(code: string): Promise<string> {
    const response = await this.chat([
      {
        role: 'system',
        content: 'You are analyzing code through the lens of rhythm gaming precision: microsecond-accurate timing, predictable execution, and flawless synchronization. Focus on performance optimization and timing accuracy.'
      },
      {
        role: 'user',
        content: `Analyze this code for precision and timing optimization:\n\n${code}`
      }
    ], {
      taskType: 'reasoning',
      temperature: 0.2,
      maxTokens: 1500
    });
    return response.content;
  }

  // Apply VRChat research insights to user interaction analysis
  async applyInteractionAnalysis(uiCode: string): Promise<string> {
    const response = await this.chat([
      {
        role: 'system',
        content: 'You are analyzing UI code through 8,500+ hours of VRChat social interaction research. Focus on user engagement, intuitive interaction patterns, and social dynamics in digital spaces.'
      },
      {
        role: 'user',
        content: `Analyze this UI code for user interaction quality:\n\n${uiCode}`
      }
    ], {
      taskType: 'reasoning',
      temperature: 0.4,
      maxTokens: 1500
    });
    return response.content;
  }

  // Apply classical philosophy to architectural decisions
  async applyPhilosophicalAnalysis(architecture: string): Promise<string> {
    const response = await this.chat([
      {
        role: 'system',
        content: 'You are analyzing software architecture through classical philosophical principles: wisdom, virtue, balance, and the pursuit of excellence. Consider long-term maintainability and ethical implications.'
      },
      {
        role: 'user',
        content: `Analyze this architecture from a philosophical perspective:\n\n${architecture}`
      }
    ], {
      taskType: 'reasoning',
      temperature: 0.3,
      maxTokens: 1500
    });
    return response.content;
  }
}

// Global instance for easy access
export const ioIntelligence = new IOIntelligenceClient();

// React hook for easy integration
export function useIOIntelligence() {
  return ioIntelligence;
}