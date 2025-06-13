/**
 * Centralized AI Service - Routes all AI requests through the autorouter
 * Replaces individual AI client implementations with intelligent routing
 */

import { aiAutorouter } from './ai-autorouter.js';
import { secureAI } from './secure-ai-middleware';
import { vaultwardenSecurity } from './vaultwarden-security';
import { aiConsciousnessPrinciples } from './consciousness-principles-integration';

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
   * Generate character dialogue using IO Intelligence
   */
  async generateDialogue(options: { prompt: string; character: string; maxTokens?: number }): Promise<string> {
    const { prompt, character, maxTokens = 150 } = options;

    // Use character-specific context for better responses
    const characterContext = this.getCharacterContext(character);
    const enhancedPrompt = `${characterContext}\n\nContext: ${prompt}\n\nResponse as ${character}:`;

    try {
      const response = await this.request({
        content: enhancedPrompt,
        contentType: 'creative',
        intent: 'generate',
        maxTokens,
        temperature: 0.8,
        context: `Character dialogue for ${character}`
      });
      return response.content;
    } catch (error) {
      // Return character-specific fallback based on their personality
      return this.getCharacterFallback(character, prompt);
    }
  }

  private getCharacterContext(character: string): string {
    const contexts = {
      stelle: 'You are Stelle from Honkai: Star Rail - a confident Trailblazer who embarks on adventures across the universe. You are curious, brave, and always ready for the next journey.',
      march7th: 'You are March 7th from Honkai: Star Rail - an energetic and optimistic girl who loves photography and capturing memories. You are cheerful, friendly, and always see the bright side.',
      himeko: 'You are Himeko from Honkai: Star Rail - a mature and wise navigator of the Astral Express. You are caring, experienced, and serve as a mentor figure.',
      kafka: 'You are Kafka from Honkai: Star Rail - a mysterious member of the Stellaron Hunters. You speak in riddles, are sophisticated, and always seem to know more than you let on.'
    };
    return contexts[character as keyof typeof contexts] || 'You are a helpful character assistant.';
  }

  private getCharacterFallback(character: string, userInput: string): string {
    const input = userInput.toLowerCase();
    const fallbacks = {
      stelle: {
        greeting: "Ready for our next adventure through the stars?",
        question: "That's a great question! The universe is full of mysteries.",
        default: "The path ahead is uncertain, but that's what makes it exciting!"
      },
      march7th: {
        greeting: "Hi there! Perfect timing - I was just about to take a photo!",
        question: "Ooh, that's interesting! Let me document this conversation.",
        default: "Life's too short not to capture every amazing moment!"
      },
      himeko: {
        greeting: "Welcome aboard. Care for some coffee while we chat?",
        question: "That's a thoughtful question. Let me share what I've learned.",
        default: "Remember, every challenge is an opportunity to grow stronger."
      },
      kafka: {
        greeting: "How interesting... our paths cross again.",
        question: "The answer depends on which truth you're prepared to hear.",
        default: "Everything unfolds according to the script... mostly."
      }
    };

    const characterFallbacks = fallbacks[character as keyof typeof fallbacks];
    if (!characterFallbacks) return "Hello there, traveler.";

    if (input.includes('hello') || input.includes('hi')) return characterFallbacks.greeting;
    if (input.includes('?') || input.includes('what') || input.includes('how')) return characterFallbacks.question;
    return characterFallbacks.default;
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

  async processAIRequest(prompt: string, context: any = {}): Promise<any> {
    try {
      // Validate through consciousness principles first
      const validation = await aiConsciousnessPrinciples.validateAIInteraction(prompt, context);

      if (!validation.approved) {
        return {
          success: false,
          error: 'Request violates consciousness principles',
          guidance: validation.guidance,
          violations: validation.principleViolations,
          characterWisdom: validation.characterWisdom
        };
      }
    } catch (error) {
      console.error(`Consciousness validation error:`, error);
      return {
        success: false,
        error: 'Error validating consciousness principles',
        details: error.message
      };
    }
  }
}

// Export singleton instance
export const aiService = new AIService();