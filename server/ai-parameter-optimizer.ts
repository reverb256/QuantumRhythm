/**
 * AI Parameter Optimizer - Dynamic Parameter Discovery System
 * Intelligently discovers optimal parameters for each model and situation
 */

interface ParameterOptimization {
  model: string;
  situation: string;
  parameters: {
    temperature: number;
    maxTokens: number;
    topP?: number;
    topK?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
  };
  performance: {
    quality: number;      // 0-1 response quality score
    speed: number;        // response time in ms
    cost: number;         // estimated cost per request
    relevance: number;    // 0-1 contextual relevance
    creativity: number;   // 0-1 creativity/novelty score
  };
  confidence: number;     // 0-1 confidence in these parameters
  lastUpdated: number;
  usageCount: number;
}

interface SituationProfile {
  type: 'trading_analysis' | 'code_generation' | 'image_analysis' | 'audio_transcription' | 
        'content_creation' | 'debugging' | 'summarization' | 'conversation' | 'reasoning';
  complexity: 'low' | 'medium' | 'high' | 'critical';
  urgency: 'low' | 'medium' | 'high' | 'immediate';
  domain: 'technical' | 'creative' | 'analytical' | 'conversational' | 'financial';
  length: 'short' | 'medium' | 'long' | 'variable';
}

class AIParameterOptimizer {
  private optimizations = new Map<string, ParameterOptimization>();
  private modelCapabilities = new Map<string, any>();
  private performanceHistory: Array<{
    model: string;
    situation: string;
    parameters: any;
    performance: any;
    timestamp: number;
    usageContext?: {
      timeOfDay: number;        // Hour of day (0-23)
      dayOfWeek: number;        // Day of week (0-6)
      requestVolume: number;    // Concurrent requests
      userType: string;         // Type of user/application
      contentLength: number;    // Input content length
      responseLength: number;   // Output content length
      sessionId?: string;       // Session tracking
    };
  }> = [];
  private usagePatterns = new Map<string, any>();
  private patternAnalysisInterval: NodeJS.Timeout | null = null;
  private recalibrationInterval: NodeJS.Timeout | null = null;
  private continuousDiscoveryInterval: NodeJS.Timeout | null = null;
  private lastRecalibration = 0;
  private lastDiscovery = 0;

  constructor() {
    this.initializeModelCapabilities();
    this.loadOptimizationHistory();
    this.startPeriodicRecalibration();
    this.startContinuousDiscovery();
    this.startPatternAnalysis();
  }

  private initializeModelCapabilities() {
    // IO Intelligence premium models - Latest and most powerful
    this.modelCapabilities.set('meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8', {
      strengths: ['reasoning', 'analysis', 'multimodal', 'advanced_context'],
      maxTokens: 430000,
      temperatureRange: [0.1, 0.9],
      costPerToken: 0.00001, // Free tier
      avgResponseTime: 3000,
      dailyQuota: 500000,
      tier: 'premium',
      specialties: ['long_context', 'complex_reasoning', 'technical_analysis']
    });

    this.modelCapabilities.set('deepseek-ai/DeepSeek-R1-0528', {
      strengths: ['reasoning', 'mathematics', 'scientific_analysis', 'problem_solving'],
      maxTokens: 128000,
      temperatureRange: [0.0, 1.0],
      costPerToken: 0.00001,
      avgResponseTime: 2800,
      dailyQuota: 500000,
      tier: 'premium',
      specialties: ['chain_of_thought', 'mathematical_reasoning', 'research']
    });

    this.modelCapabilities.set('deepseek-ai/DeepSeek-R1', {
      strengths: ['reasoning', 'analysis', 'coding', 'research'],
      maxTokens: 128000,
      temperatureRange: [0.0, 1.0],
      costPerToken: 0.00001,
      avgResponseTime: 2500,
      dailyQuota: 500000,
      tier: 'premium',
      specialties: ['deep_reasoning', 'code_analysis', 'research_tasks']
    });

    this.modelCapabilities.set('Qwen/Qwen3-235B-A22B-FP8', {
      strengths: ['general', 'multilingual', 'coding', 'analysis'],
      maxTokens: 128000,
      temperatureRange: [0.1, 0.9],
      costPerToken: 0.00001,
      avgResponseTime: 2200,
      dailyQuota: 500000,
      tier: 'premium',
      specialties: ['multilingual_tasks', 'code_generation', 'text_analysis']
    });

    // Specialized models for different tasks
    this.modelCapabilities.set('meta-llama/Llama-3.3-70B-Instruct', {
      strengths: ['instruction_following', 'general', 'conversation'],
      maxTokens: 128000,
      temperatureRange: [0.1, 0.9],
      costPerToken: 0.00001,
      avgResponseTime: 1800,
      dailyQuota: 500000,
      tier: 'standard',
      specialties: ['instruction_following', 'general_purpose', 'chat']
    });

    this.modelCapabilities.set('Qwen/Qwen2.5-Coder-32B-Instruct', {
      strengths: ['coding', 'programming', 'technical', 'debugging'],
      maxTokens: 32000,
      temperatureRange: [0.0, 0.7],
      costPerToken: 0.00001,
      avgResponseTime: 1500,
      dailyQuota: 500000,
      tier: 'specialized',
      specialties: ['code_generation', 'debugging', 'technical_writing']
    });

    this.modelCapabilities.set('mistralai/Mistral-Large-Instruct-2411', {
      strengths: ['reasoning', 'analysis', 'multilingual', 'complex_tasks'],
      maxTokens: 128000,
      temperatureRange: [0.1, 0.9],
      costPerToken: 0.00001,
      avgResponseTime: 2000,
      dailyQuota: 500000,
      tier: 'premium',
      specialties: ['complex_reasoning', 'multilingual', 'advanced_analysis']
    });

    this.modelCapabilities.set('jinaai/ReaderLM-v2', {
      strengths: ['reading_comprehension', 'text_analysis', 'summarization', 'extraction'],
      maxTokens: 512000,
      temperatureRange: [0.1, 0.7],
      costPerToken: 0.00001,
      avgResponseTime: 3500,
      dailyQuota: 500000,
      tier: 'specialized',
      specialties: ['long_document_analysis', 'information_extraction', 'summarization']
    });

    // Vision models
    this.modelCapabilities.set('meta-llama/Llama-3.2-90B-Vision-Instruct', {
      strengths: ['vision', 'multimodal', 'image_analysis', 'visual_reasoning'],
      maxTokens: 16000,
      temperatureRange: [0.1, 0.8],
      costPerToken: 0.00001,
      avgResponseTime: 4000,
      dailyQuota: 500000,
      tier: 'multimodal',
      specialties: ['image_analysis', 'visual_qa', 'multimodal_reasoning']
    });

    this.modelCapabilities.set('Qwen/Qwen2-VL-7B-Instruct', {
      strengths: ['vision', 'multimodal', 'image_understanding', 'visual_tasks'],
      maxTokens: 32000,
      temperatureRange: [0.1, 0.8],
      costPerToken: 0.00001,
      avgResponseTime: 3000,
      dailyQuota: 500000,
      tier: 'multimodal',
      specialties: ['visual_understanding', 'image_qa', 'visual_analysis']
    });

    // Embeddings models
    this.modelCapabilities.set('BAAI/bge-multilingual-gemma2', {
      strengths: ['embeddings', 'similarity', 'semantic_search', 'multilingual'],
      maxTokens: 4096,
      temperatureRange: [0.0, 0.0], // Embeddings don't use temperature
      costPerToken: 0.000001,
      avgResponseTime: 500,
      dailyQuota: 50000000,
      tier: 'embeddings',
      specialties: ['semantic_search', 'document_similarity', 'multilingual_embeddings']
    });

    this.modelCapabilities.set('mixedbread-ai/mxbai-embed-large-v1', {
      strengths: ['embeddings', 'retrieval', 'semantic_search', 'document_analysis'],
      maxTokens: 512,
      temperatureRange: [0.0, 0.0],
      costPerToken: 0.000001,
      avgResponseTime: 300,
      dailyQuota: 50000000,
      tier: 'embeddings',
      specialties: ['document_embeddings', 'retrieval_tasks', 'semantic_similarity']
    });

    // Math and scientific models
    this.modelCapabilities.set('nvidia/AceMath-7B-Instruct', {
      strengths: ['mathematics', 'scientific', 'calculation', 'problem_solving'],
      maxTokens: 4000,
      temperatureRange: [0.0, 0.5],
      costPerToken: 0.00001,
      avgResponseTime: 1200,
      dailyQuota: 500000,
      tier: 'specialized',
      specialties: ['mathematical_reasoning', 'scientific_computation', 'problem_solving']
    });

    // Tool-use models
    this.modelCapabilities.set('watt-ai/watt-tool-70B', {
      strengths: ['tool_use', 'function_calling', 'api_integration', 'automation'],
      maxTokens: 128000,
      temperatureRange: [0.1, 0.7],
      costPerToken: 0.00001,
      avgResponseTime: 2000,
      dailyQuota: 500000,
      tier: 'specialized',
      specialties: ['function_calling', 'tool_integration', 'api_automation']
    });

    // Efficient small models
    this.modelCapabilities.set('microsoft/Phi-3.5-mini-instruct', {
      strengths: ['efficiency', 'general', 'quick_tasks', 'conversation'],
      maxTokens: 128000,
      temperatureRange: [0.1, 0.9],
      costPerToken: 0.000005,
      avgResponseTime: 800,
      dailyQuota: 500000,
      tier: 'efficient',
      specialties: ['quick_responses', 'general_tasks', 'efficient_processing']
    });

    // Anthropic models (external)
    this.modelCapabilities.set('claude-sonnet-4-20250514', {
      strengths: ['analysis', 'writing', 'reasoning', 'multimodal'],
      maxTokens: 8192,
      temperatureRange: [0.0, 1.0],
      costPerToken: 0.003,
      avgResponseTime: 1800,
      dailyQuota: 0, // External API
      tier: 'external',
      specialties: ['advanced_reasoning', 'creative_writing', 'analysis']
    });

    // OpenAI models (external)
    this.modelCapabilities.set('gpt-4o', {
      strengths: ['general', 'coding', 'multimodal', 'conversation'],
      maxTokens: 4096,
      temperatureRange: [0.0, 2.0],
      costPerToken: 0.005,
      avgResponseTime: 1500,
      dailyQuota: 0, // External API
      tier: 'external',
      specialties: ['general_purpose', 'multimodal', 'coding']
    });

    // xAI models (external)
    this.modelCapabilities.set('grok-2-1212', {
      strengths: ['humor', 'creativity', 'real_time_data', 'personality'],
      maxTokens: 8192,
      temperatureRange: [0.1, 1.0],
      costPerToken: 0.002,
      avgResponseTime: 2200,
      dailyQuota: 0, // External API
      tier: 'external',
      specialties: ['creative_tasks', 'personality', 'real_time_info']
    });
  }

  /**
   * Analyze the situation and discover optimal parameters
   */
  async discoverOptimalParameters(
    content: string,
    systemPrompt?: string,
    situationType?: string
  ): Promise<{
    recommendedModel: string;
    parameters: any;
    reasoning: string;
    confidence: number;
  }> {
    const situation = this.analyzeSituation(content, systemPrompt, situationType);
    const candidates = this.getCandidateModels(situation);
    
    let bestRecommendation = null;
    let highestScore = 0;

    for (const model of candidates) {
      const parameters = await this.optimizeParametersForModel(model, situation, content);
      const score = this.calculateOptimizationScore(model, parameters, situation);
      
      if (score > highestScore) {
        highestScore = score;
        bestRecommendation = {
          recommendedModel: model,
          parameters,
          reasoning: this.generateReasoning(model, parameters, situation, score),
          confidence: score
        };
      }
    }

    return bestRecommendation || this.getFallbackRecommendation(situation);
  }

  private analyzeSituation(content: string, systemPrompt?: string, situationType?: string): SituationProfile {
    const contentLower = content.toLowerCase();
    const systemLower = systemPrompt?.toLowerCase() || '';
    
    // Determine situation type
    let type: SituationProfile['type'] = 'conversation';
    
    if (situationType) {
      type = situationType as SituationProfile['type'];
    } else if (contentLower.includes('trade') || contentLower.includes('market') || contentLower.includes('price')) {
      type = 'trading_analysis';
    } else if (contentLower.includes('code') || contentLower.includes('function') || contentLower.includes('debug')) {
      type = 'code_generation';
    } else if (contentLower.includes('image') || contentLower.includes('visual') || contentLower.includes('photo')) {
      type = 'image_analysis';
    } else if (contentLower.includes('audio') || contentLower.includes('speech') || contentLower.includes('voice')) {
      type = 'audio_transcription';
    } else if (contentLower.includes('write') || contentLower.includes('create') || contentLower.includes('generate')) {
      type = 'content_creation';
    } else if (contentLower.includes('explain') || contentLower.includes('analyze') || contentLower.includes('reason')) {
      type = 'reasoning';
    } else if (contentLower.includes('summary') || contentLower.includes('summarize')) {
      type = 'summarization';
    }

    // Determine complexity
    let complexity: SituationProfile['complexity'] = 'medium';
    const contentLength = content.length;
    const hasSystemPrompt = Boolean(systemPrompt);
    const hasTechnicalTerms = /\b(algorithm|optimization|neural|quantum|blockchain|api|database)\b/i.test(content);
    
    if (contentLength > 1000 || hasTechnicalTerms || hasSystemPrompt) {
      complexity = 'high';
    } else if (contentLength < 100) {
      complexity = 'low';
    }

    // Determine urgency from keywords
    let urgency: SituationProfile['urgency'] = 'medium';
    if (/\b(urgent|emergency|critical|immediate|asap|now)\b/i.test(content)) {
      urgency = 'immediate';
    } else if (/\b(quick|fast|soon)\b/i.test(content)) {
      urgency = 'high';
    }

    // Determine domain
    let domain: SituationProfile['domain'] = 'conversational';
    if (type === 'trading_analysis' || /\b(financial|money|investment|profit)\b/i.test(content)) {
      domain = 'financial';
    } else if (type === 'code_generation' || hasTechnicalTerms) {
      domain = 'technical';
    } else if (type === 'content_creation' || /\b(creative|art|story|poem)\b/i.test(content)) {
      domain = 'creative';
    } else if (type === 'reasoning' || type === 'trading_analysis') {
      domain = 'analytical';
    }

    // Determine expected response length
    let length: SituationProfile['length'] = 'medium';
    if (/\b(brief|short|concise|quick)\b/i.test(content)) {
      length = 'short';
    } else if (/\b(detailed|comprehensive|thorough|complete)\b/i.test(content)) {
      length = 'long';
    }

    return { type, complexity, urgency, domain, length };
  }

  private getCandidateModels(situation: SituationProfile): string[] {
    const candidates: Array<{model: string, score: number}> = [];
    
    // Score models based on situation alignment
    for (const [model, capabilities] of this.modelCapabilities) {
      let score = 0;
      const strengths = capabilities.strengths;
      const specialties = capabilities.specialties || [];
      
      // Primary task alignment scoring
      switch (situation.type) {
        case 'trading_analysis':
          if (strengths.includes('analysis')) score += 3;
          if (strengths.includes('reasoning')) score += 2;
          if (specialties.includes('technical_analysis')) score += 2;
          break;
        case 'code_generation':
          if (strengths.includes('coding')) score += 3;
          if (strengths.includes('programming')) score += 3;
          if (specialties.includes('code_generation')) score += 2;
          if (specialties.includes('debugging')) score += 1;
          break;
        case 'image_analysis':
          if (strengths.includes('vision')) score += 3;
          if (strengths.includes('multimodal')) score += 2;
          if (specialties.includes('image_analysis')) score += 2;
          break;
        case 'audio_transcription':
          if (strengths.includes('multimodal')) score += 2;
          if (specialties.includes('audio_processing')) score += 3;
          break;
        case 'content_creation':
          if (strengths.includes('creativity')) score += 3;
          if (strengths.includes('writing')) score += 2;
          if (specialties.includes('creative_writing')) score += 2;
          break;
        case 'debugging':
          if (strengths.includes('coding')) score += 2;
          if (strengths.includes('technical')) score += 2;
          if (specialties.includes('debugging')) score += 3;
          break;
        case 'summarization':
          if (strengths.includes('summarization')) score += 3;
          if (specialties.includes('summarization')) score += 2;
          if (specialties.includes('long_document_analysis')) score += 2;
          break;
        case 'reasoning':
          if (strengths.includes('reasoning')) score += 3;
          if (specialties.includes('chain_of_thought')) score += 2;
          if (specialties.includes('complex_reasoning')) score += 2;
          break;
        case 'conversation':
          if (strengths.includes('conversation')) score += 3;
          if (strengths.includes('general')) score += 2;
          if (specialties.includes('chat')) score += 1;
          break;
      }
      
      // Domain-specific bonuses
      switch (situation.domain) {
        case 'financial':
          if (specialties.includes('technical_analysis')) score += 1;
          break;
        case 'technical':
          if (strengths.includes('technical')) score += 1;
          if (specialties.includes('technical_writing')) score += 1;
          break;
        case 'creative':
          if (strengths.includes('creativity')) score += 1;
          if (specialties.includes('creative_tasks')) score += 1;
          break;
        case 'analytical':
          if (strengths.includes('analysis')) score += 1;
          if (specialties.includes('advanced_analysis')) score += 1;
          break;
      }
      
      // Complexity alignment
      if (situation.complexity === 'high' || situation.complexity === 'critical') {
        if (capabilities.tier === 'premium') score += 2;
        if (capabilities.maxTokens > 100000) score += 1;
        if (specialties.includes('complex_reasoning')) score += 1;
      } else if (situation.complexity === 'low') {
        if (capabilities.tier === 'efficient') score += 2;
        if (capabilities.avgResponseTime < 1000) score += 1;
      }
      
      // Urgency considerations
      if (situation.urgency === 'immediate') {
        if (capabilities.avgResponseTime < 1500) score += 2;
        if (capabilities.tier === 'efficient') score += 1;
      }
      
      // Context length requirements
      if (situation.length === 'long') {
        if (capabilities.maxTokens > 32000) score += 1;
        if (specialties.includes('long_context')) score += 2;
      }
      
      // Availability and cost considerations
      if (capabilities.dailyQuota > 0) score += 1; // Prefer free tier models
      if (capabilities.tier !== 'external') score += 1; // Prefer IO Intelligence models
      
      if (score > 0) {
        candidates.push({model, score});
      }
    }
    
    // Sort by score and return top candidates
    candidates.sort((a, b) => b.score - a.score);
    
    // Return top models, but include at least 3 candidates for diversity
    const topCandidates = candidates.slice(0, Math.max(3, Math.ceil(candidates.length * 0.3)));
    
    return topCandidates.map(c => c.model);
  }

  private async optimizeParametersForModel(model: string, situation: SituationProfile, content: string) {
    const capabilities = this.modelCapabilities.get(model);
    if (!capabilities) {
      return this.getDefaultParameters();
    }

    const key = `${model}-${situation.type}-${situation.complexity}`;
    const existing = this.optimizations.get(key);

    // If we have recent optimization data, use it
    if (existing && Date.now() - existing.lastUpdated < 24 * 60 * 60 * 1000 && existing.confidence > 0.7) {
      return existing.parameters;
    }

    // Generate optimized parameters based on situation
    const parameters = {
      temperature: this.optimizeTemperature(situation, capabilities),
      maxTokens: this.optimizeMaxTokens(situation, capabilities, content),
      topP: this.optimizeTopP(situation),
      presencePenalty: this.optimizePresencePenalty(situation),
      frequencyPenalty: this.optimizeFrequencyPenalty(situation)
    };

    return parameters;
  }

  private optimizeTemperature(situation: SituationProfile, capabilities: any): number {
    const [minTemp, maxTemp] = capabilities.temperatureRange || [0.0, 1.0];
    
    // Base temperature on situation type and complexity
    let baseTemp = 0.7;
    
    switch (situation.type) {
      case 'trading_analysis':
      case 'reasoning':
        baseTemp = 0.3; // Low temperature for analytical tasks
        break;
      case 'code_generation':
        baseTemp = 0.2; // Very low for precise code
        break;
      case 'content_creation':
        baseTemp = 0.8; // Higher for creativity
        break;
      case 'conversation':
        baseTemp = 0.7; // Balanced
        break;
      case 'summarization':
        baseTemp = 0.4; // Low for accuracy
        break;
    }

    // Adjust for complexity
    if (situation.complexity === 'high' || situation.complexity === 'critical') {
      baseTemp *= 0.8; // Lower temperature for complex tasks
    } else if (situation.complexity === 'low') {
      baseTemp *= 1.2; // Slightly higher for simple tasks
    }

    // Adjust for urgency
    if (situation.urgency === 'immediate') {
      baseTemp *= 0.9; // Slightly lower for urgent tasks
    }

    return Math.max(minTemp, Math.min(maxTemp, baseTemp));
  }

  private optimizeMaxTokens(situation: SituationProfile, capabilities: any, content: string): number {
    const maxAllowed = capabilities.maxTokens || 4096;
    
    // Base on expected response length
    let baseTokens = 1024;
    
    switch (situation.length) {
      case 'short':
        baseTokens = 256;
        break;
      case 'medium':
        baseTokens = 1024;
        break;
      case 'long':
        baseTokens = 2048;
        break;
      case 'variable':
        baseTokens = Math.min(maxAllowed, Math.max(512, content.length * 2));
        break;
    }

    // Adjust for complexity
    if (situation.complexity === 'high' || situation.complexity === 'critical') {
      baseTokens *= 1.5;
    }

    return Math.min(maxAllowed, Math.floor(baseTokens));
  }

  private optimizeTopP(situation: SituationProfile): number {
    switch (situation.type) {
      case 'trading_analysis':
      case 'code_generation':
        return 0.9; // Focus on most likely tokens
      case 'content_creation':
        return 0.95; // Allow more diversity
      default:
        return 0.92;
    }
  }

  private optimizePresencePenalty(situation: SituationProfile): number {
    if (situation.type === 'content_creation') {
      return 0.1; // Encourage topic diversity
    } else if (situation.length === 'long') {
      return 0.05; // Slight penalty for long responses
    }
    return 0.0;
  }

  private optimizeFrequencyPenalty(situation: SituationProfile): number {
    if (situation.type === 'content_creation') {
      return 0.1; // Reduce repetition in creative content
    } else if (situation.length === 'long') {
      return 0.05; // Slight penalty for long responses
    }
    return 0.0;
  }

  private calculateOptimizationScore(model: string, parameters: any, situation: SituationProfile): number {
    const capabilities = this.modelCapabilities.get(model);
    if (!capabilities) return 0.5;

    let score = 0.5; // Base score

    // Model-situation alignment
    const strengths = capabilities.strengths || [];
    if (situation.type === 'trading_analysis' && strengths.includes('analysis')) score += 0.2;
    if (situation.type === 'code_generation' && strengths.includes('coding')) score += 0.2;
    if (situation.type === 'reasoning' && strengths.includes('reasoning')) score += 0.2;
    if (situation.domain === 'creative' && strengths.includes('creativity')) score += 0.15;
    if (strengths.includes('general')) score += 0.1;

    // Performance considerations
    if (situation.urgency === 'immediate' && capabilities.avgResponseTime < 2000) score += 0.1;
    if (situation.urgency === 'low' && capabilities.costPerToken < 0.002) score += 0.1;

    // Parameter optimization quality
    const existing = this.optimizations.get(`${model}-${situation.type}-${situation.complexity}`);
    if (existing && existing.confidence > 0.8) {
      score += 0.1;
    }

    return Math.min(1.0, score);
  }

  private generateReasoning(model: string, parameters: any, situation: SituationProfile, score: number): string {
    const capabilities = this.modelCapabilities.get(model);
    const reasons = [];

    reasons.push(`Selected ${model} for ${situation.type} task`);
    
    if (capabilities?.strengths) {
      const relevantStrengths = capabilities.strengths.filter((s: string) => {
        if (situation.type === 'trading_analysis') return ['analysis', 'reasoning'].includes(s);
        if (situation.type === 'code_generation') return ['coding', 'technical'].includes(s);
        if (situation.domain === 'creative') return ['creativity', 'writing'].includes(s);
        return true;
      });
      
      if (relevantStrengths.length > 0) {
        reasons.push(`Model strengths: ${relevantStrengths.join(', ')}`);
      }
    }

    reasons.push(`Temperature: ${parameters.temperature} (${parameters.temperature < 0.4 ? 'precise' : parameters.temperature > 0.7 ? 'creative' : 'balanced'})`);
    reasons.push(`Max tokens: ${parameters.maxTokens} for ${situation.length} response`);
    
    if (situation.urgency === 'immediate') {
      reasons.push('Optimized for speed due to urgency');
    }

    return reasons.join('. ');
  }

  private getFallbackRecommendation(situation: SituationProfile) {
    return {
      recommendedModel: 'io-intelligence/hermes-3-llama-3.1-405b',
      parameters: this.getDefaultParameters(),
      reasoning: 'Using fallback recommendation with default parameters',
      confidence: 0.5
    };
  }

  private getDefaultParameters() {
    return {
      temperature: 0.7,
      maxTokens: 1024,
      topP: 0.9,
      presencePenalty: 0.0,
      frequencyPenalty: 0.0
    };
  }

  /**
   * Record performance feedback to improve future optimizations
   */
  recordPerformance(
    model: string,
    situation: string,
    parameters: any,
    performance: {
      quality: number;
      speed: number;
      cost: number;
      relevance: number;
      creativity: number;
    },
    usageContext?: {
      contentLength?: number;
      responseLength?: number;
      userType?: string;
      sessionId?: string;
    }
  ) {
    const key = `${model}-${situation}`;
    const timestamp = Date.now();
    const now = new Date();

    // Enhanced usage context
    const enhancedContext = {
      timeOfDay: now.getHours(),
      dayOfWeek: now.getDay(),
      requestVolume: this.getCurrentRequestVolume(),
      userType: usageContext?.userType || 'api',
      contentLength: usageContext?.contentLength || 0,
      responseLength: usageContext?.responseLength || 0,
      sessionId: usageContext?.sessionId
    };

    // Update optimization record
    const existing = this.optimizations.get(key);
    if (existing) {
      // Weighted average with new performance
      const weight = 0.3; // Weight for new data
      existing.performance = {
        quality: existing.performance.quality * (1 - weight) + performance.quality * weight,
        speed: existing.performance.speed * (1 - weight) + performance.speed * weight,
        cost: existing.performance.cost * (1 - weight) + performance.cost * weight,
        relevance: existing.performance.relevance * (1 - weight) + performance.relevance * weight,
        creativity: existing.performance.creativity * (1 - weight) + performance.creativity * weight
      };
      existing.usageCount++;
      existing.confidence = Math.min(1.0, existing.confidence + 0.1);
      existing.lastUpdated = timestamp;
    } else {
      this.optimizations.set(key, {
        model,
        situation,
        parameters,
        performance,
        confidence: 0.6,
        lastUpdated: timestamp,
        usageCount: 1
      });
    }

    // Add to performance history with usage context
    this.performanceHistory.push({
      model,
      situation,
      parameters,
      performance,
      timestamp,
      usageContext: enhancedContext
    });

    // Update usage patterns
    this.updateUsagePatterns(model, situation, enhancedContext, performance);

    // Limit history size
    if (this.performanceHistory.length > 1000) {
      this.performanceHistory = this.performanceHistory.slice(-500);
    }
  }

  /**
   * Get current request volume estimate
   */
  private getCurrentRequestVolume(): number {
    const now = Date.now();
    const recentRequests = this.performanceHistory.filter(
      p => now - p.timestamp < 5 * 60 * 1000 // Last 5 minutes
    );
    return recentRequests.length;
  }

  /**
   * Update usage patterns for intelligent optimization
   */
  private updateUsagePatterns(
    model: string, 
    situation: string, 
    context: any, 
    performance: any
  ) {
    const patternKey = `${model}-${situation}`;
    
    if (!this.usagePatterns.has(patternKey)) {
      this.usagePatterns.set(patternKey, {
        timeOfDayPerformance: new Array(24).fill(null).map(() => ({
          samples: 0,
          avgQuality: 0,
          avgSpeed: 0
        })),
        dayOfWeekPerformance: new Array(7).fill(null).map(() => ({
          samples: 0,
          avgQuality: 0,
          avgSpeed: 0
        })),
        contentLengthPatterns: {
          short: { samples: 0, avgQuality: 0, optimalTemp: 0.7 },   // < 500 chars
          medium: { samples: 0, avgQuality: 0, optimalTemp: 0.7 },  // 500-2000 chars
          long: { samples: 0, avgQuality: 0, optimalTemp: 0.7 }     // > 2000 chars
        },
        loadPatterns: {
          low: { samples: 0, avgQuality: 0, avgSpeed: 0 },     // < 5 concurrent
          medium: { samples: 0, avgQuality: 0, avgSpeed: 0 },  // 5-20 concurrent
          high: { samples: 0, avgQuality: 0, avgSpeed: 0 }     // > 20 concurrent
        },
        userTypePatterns: new Map<string, any>(),
        sessionPatterns: new Map<string, any>()
      });
    }

    const patterns = this.usagePatterns.get(patternKey);

    // Update time-of-day patterns
    const hourData = patterns.timeOfDayPerformance[context.timeOfDay];
    hourData.samples++;
    hourData.avgQuality = (hourData.avgQuality * (hourData.samples - 1) + performance.quality) / hourData.samples;
    hourData.avgSpeed = (hourData.avgSpeed * (hourData.samples - 1) + performance.speed) / hourData.samples;

    // Update day-of-week patterns
    const dayData = patterns.dayOfWeekPerformance[context.dayOfWeek];
    dayData.samples++;
    dayData.avgQuality = (dayData.avgQuality * (dayData.samples - 1) + performance.quality) / dayData.samples;
    dayData.avgSpeed = (dayData.avgSpeed * (dayData.samples - 1) + performance.speed) / dayData.samples;

    // Update content length patterns
    let lengthCategory = 'medium';
    if (context.contentLength < 500) lengthCategory = 'short';
    else if (context.contentLength > 2000) lengthCategory = 'long';

    const lengthData = patterns.contentLengthPatterns[lengthCategory];
    lengthData.samples++;
    lengthData.avgQuality = (lengthData.avgQuality * (lengthData.samples - 1) + performance.quality) / lengthData.samples;

    // Update load patterns
    let loadCategory = 'low';
    if (context.requestVolume >= 5 && context.requestVolume < 20) loadCategory = 'medium';
    else if (context.requestVolume >= 20) loadCategory = 'high';

    const loadData = patterns.loadPatterns[loadCategory];
    loadData.samples++;
    loadData.avgQuality = (loadData.avgQuality * (loadData.samples - 1) + performance.quality) / loadData.samples;
    loadData.avgSpeed = (loadData.avgSpeed * (loadData.samples - 1) + performance.speed) / loadData.samples;

    // Update user type patterns
    if (!patterns.userTypePatterns.has(context.userType)) {
      patterns.userTypePatterns.set(context.userType, {
        samples: 0,
        avgQuality: 0,
        avgSpeed: 0,
        preferredParams: null
      });
    }

    const userTypeData = patterns.userTypePatterns.get(context.userType);
    userTypeData.samples++;
    userTypeData.avgQuality = (userTypeData.avgQuality * (userTypeData.samples - 1) + performance.quality) / userTypeData.samples;
    userTypeData.avgSpeed = (userTypeData.avgSpeed * (userTypeData.samples - 1) + performance.speed) / userTypeData.samples;
  }

  /**
   * Get optimization insights and statistics
   */
  getOptimizationInsights() {
    const insights = {
      totalOptimizations: this.optimizations.size,
      modelPerformance: new Map<string, any>(),
      situationOptimizations: new Map<string, number>(),
      avgConfidence: 0,
      recentImprovements: []
    };

    let totalConfidence = 0;
    for (const [key, opt] of this.optimizations) {
      totalConfidence += opt.confidence;
      
      // Track model performance
      if (!insights.modelPerformance.has(opt.model)) {
        insights.modelPerformance.set(opt.model, {
          usageCount: 0,
          avgQuality: 0,
          avgSpeed: 0,
          avgCost: 0
        });
      }
      
      const modelStats = insights.modelPerformance.get(opt.model);
      modelStats.usageCount += opt.usageCount;
      modelStats.avgQuality += opt.performance.quality;
      modelStats.avgSpeed += opt.performance.speed;
      modelStats.avgCost += opt.performance.cost;
      
      // Track situation types
      insights.situationOptimizations.set(
        opt.situation,
        (insights.situationOptimizations.get(opt.situation) || 0) + 1
      );
    }

    insights.avgConfidence = totalConfidence / this.optimizations.size;

    return insights;
  }

  /**
   * Start periodic recalibration to update model parameters based on accumulated performance data
   */
  private startPeriodicRecalibration() {
    // Recalibrate every 30 minutes
    this.recalibrationInterval = setInterval(() => {
      this.performRecalibration();
    }, 30 * 60 * 1000);
    
    console.log('🔄 AI Parameter Optimizer: Started periodic recalibration (30min intervals)');
  }

  /**
   * Start continuous discovery to monitor new models and update capabilities
   */
  private startContinuousDiscovery() {
    // Discover new optimizations every 10 minutes
    this.continuousDiscoveryInterval = setInterval(() => {
      this.performContinuousDiscovery();
    }, 10 * 60 * 1000);
    
    console.log('🔍 AI Parameter Optimizer: Started continuous discovery (10min intervals)');
  }

  /**
   * Start pattern analysis for usage-based optimization
   */
  private startPatternAnalysis() {
    // Analyze patterns every 15 minutes
    this.patternAnalysisInterval = setInterval(() => {
      this.performPatternAnalysis();
    }, 15 * 60 * 1000);
    
    console.log('📊 AI Parameter Optimizer: Started pattern analysis (15min intervals)');
  }

  /**
   * Perform comprehensive recalibration based on recent performance data
   */
  private async performRecalibration() {
    const now = Date.now();
    this.lastRecalibration = now;
    
    console.log('🔄 Starting AI parameter recalibration...');
    
    // Analyze recent performance data (last 24 hours)
    const recentPerformance = this.performanceHistory.filter(
      p => now - p.timestamp < 24 * 60 * 60 * 1000
    );
    
    if (recentPerformance.length === 0) {
      console.log('📊 No recent performance data for recalibration');
      return;
    }
    
    const modelPerformanceMap = new Map<string, Array<any>>();
    
    // Group performance data by model
    recentPerformance.forEach(perf => {
      if (!modelPerformanceMap.has(perf.model)) {
        modelPerformanceMap.set(perf.model, []);
      }
      modelPerformanceMap.get(perf.model)!.push(perf);
    });
    
    let recalibratedModels = 0;
    
    // Recalibrate each model's capabilities based on actual performance
    for (const [model, performances] of modelPerformanceMap) {
      const capabilities = this.modelCapabilities.get(model);
      if (!capabilities) continue;
      
      // Calculate average performance metrics
      const avgQuality = performances.reduce((sum, p) => sum + p.performance.quality, 0) / performances.length;
      const avgSpeed = performances.reduce((sum, p) => sum + p.performance.speed, 0) / performances.length;
      const avgCost = performances.reduce((sum, p) => sum + p.performance.cost, 0) / performances.length;
      const avgRelevance = performances.reduce((sum, p) => sum + p.performance.relevance, 0) / performances.length;
      
      // Update model capabilities based on actual performance
      const oldResponseTime = capabilities.avgResponseTime;
      const oldCostPerToken = capabilities.costPerToken;
      
      // Weighted update (70% old, 30% new data)
      capabilities.avgResponseTime = Math.round(oldResponseTime * 0.7 + avgSpeed * 0.3);
      capabilities.costPerToken = oldCostPerToken * 0.7 + avgCost * 0.3;
      
      // Update optimization records for this model's situations
      performances.forEach(perf => {
        const key = `${perf.model}-${perf.situation}`;
        const existing = this.optimizations.get(key);
        
        if (existing) {
          // Increase confidence based on successful usage
          existing.confidence = Math.min(1.0, existing.confidence + 0.05);
          existing.usageCount++;
          existing.lastUpdated = now;
          
          // Adjust parameters based on performance feedback
          if (avgQuality > 0.8) {
            // High quality - parameters are working well
            existing.confidence = Math.min(1.0, existing.confidence + 0.1);
          } else if (avgQuality < 0.6) {
            // Low quality - adjust parameters
            existing.confidence = Math.max(0.3, existing.confidence - 0.1);
            this.adjustParametersForLowQuality(existing, perf.performance);
          }
        }
      });
      
      recalibratedModels++;
    }
    
    console.log(`✅ Recalibrated ${recalibratedModels} models based on ${recentPerformance.length} performance samples`);
    
    // Clean up old performance data (keep only last 7 days)
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    this.performanceHistory = this.performanceHistory.filter(p => p.timestamp > sevenDaysAgo);
  }

  /**
   * Adjust parameters when performance quality is low
   */
  private adjustParametersForLowQuality(optimization: ParameterOptimization, performance: any) {
    const params = optimization.parameters;
    
    // If response was low quality, try adjusting parameters
    if (performance.creativity < 0.5 && params.temperature > 0.3) {
      params.temperature = Math.max(0.1, params.temperature - 0.1);
    } else if (performance.relevance < 0.6 && params.temperature > 0.7) {
      params.temperature = Math.max(0.3, params.temperature - 0.2);
    }
    
    // Adjust max tokens if responses seem incomplete
    if (performance.quality < 0.5 && params.maxTokens < 2048) {
      params.maxTokens = Math.min(4096, params.maxTokens * 1.5);
    }
  }

  /**
   * Continuously discover new optimization opportunities
   */
  private async performContinuousDiscovery() {
    const now = Date.now();
    this.lastDiscovery = now;
    
    console.log('🔍 Performing continuous parameter discovery...');
    
    // Discover underperforming model-situation combinations
    const underperformingCombinations = this.identifyUnderperformingCombinations();
    
    // Explore new parameter ranges for underperforming combinations
    for (const combination of underperformingCombinations) {
      await this.exploreNewParameterSpace(combination);
    }
    
    // Identify trending situation types and prepare optimizations
    this.analyzeEmergingPatterns();
    
    // Update model rankings based on recent performance
    this.updateModelRankings();
    
    console.log('✅ Continuous discovery completed');
  }

  /**
   * Identify model-situation combinations that are underperforming
   */
  private identifyUnderperformingCombinations(): Array<{model: string, situation: string, avgQuality: number}> {
    const combinations = new Map<string, Array<any>>();
    
    // Group recent performance by model-situation combination
    const recentData = this.performanceHistory.filter(
      p => Date.now() - p.timestamp < 48 * 60 * 60 * 1000 // Last 48 hours
    );
    
    recentData.forEach(perf => {
      const key = `${perf.model}-${perf.situation}`;
      if (!combinations.has(key)) {
        combinations.set(key, []);
      }
      combinations.get(key)!.push(perf.performance);
    });
    
    const underperforming: Array<{model: string, situation: string, avgQuality: number}> = [];
    
    for (const [key, performances] of combinations) {
      if (performances.length < 3) continue; // Need at least 3 samples
      
      const avgQuality = performances.reduce((sum, p) => sum + p.quality, 0) / performances.length;
      
      if (avgQuality < 0.7) { // Quality threshold
        const [model, situation] = key.split('-');
        underperforming.push({ model, situation, avgQuality });
      }
    }
    
    return underperforming.sort((a, b) => a.avgQuality - b.avgQuality);
  }

  /**
   * Explore new parameter spaces for underperforming combinations
   */
  private async exploreNewParameterSpace(combination: {model: string, situation: string, avgQuality: number}) {
    const capabilities = this.modelCapabilities.get(combination.model);
    if (!capabilities) return;
    
    const key = `${combination.model}-${combination.situation}`;
    const existing = this.optimizations.get(key);
    
    if (!existing) return;
    
    // Generate alternative parameter sets to try
    const alternativeParams = this.generateAlternativeParameters(existing.parameters, capabilities);
    
    // Update optimization with best alternative (will be tested in real usage)
    existing.parameters = alternativeParams;
    existing.confidence = Math.max(0.4, existing.confidence - 0.2); // Reduce confidence to encourage testing
    existing.lastUpdated = Date.now();
    
    console.log(`🔬 Exploring new parameters for ${combination.model} on ${combination.situation} (quality: ${combination.avgQuality.toFixed(2)})`);
  }

  /**
   * Generate alternative parameter sets for exploration
   */
  private generateAlternativeParameters(currentParams: any, capabilities: any): any {
    const alternatives = { ...currentParams };
    
    // Explore different temperature ranges
    if (currentParams.temperature < 0.5) {
      alternatives.temperature = Math.min(capabilities.temperatureRange[1], currentParams.temperature + 0.2);
    } else {
      alternatives.temperature = Math.max(capabilities.temperatureRange[0], currentParams.temperature - 0.2);
    }
    
    // Adjust token limits
    if (currentParams.maxTokens < capabilities.maxTokens * 0.5) {
      alternatives.maxTokens = Math.min(capabilities.maxTokens, currentParams.maxTokens * 1.5);
    }
    
    // Experiment with different sampling parameters
    alternatives.topP = currentParams.topP === 0.9 ? 0.95 : 0.9;
    
    return alternatives;
  }

  /**
   * Analyze emerging patterns in usage and performance
   */
  private analyzeEmergingPatterns() {
    const recentUsage = this.performanceHistory.filter(
      p => Date.now() - p.timestamp < 24 * 60 * 60 * 1000
    );
    
    // Track situation type frequency
    const situationFrequency = new Map<string, number>();
    recentUsage.forEach(usage => {
      situationFrequency.set(usage.situation, (situationFrequency.get(usage.situation) || 0) + 1);
    });
    
    // Identify trending situations that need better optimization
    for (const [situation, frequency] of situationFrequency) {
      if (frequency > 10) { // High usage situations
        this.ensureOptimizationCoverage(situation);
      }
    }
  }

  /**
   * Ensure we have optimizations for high-usage situations
   */
  private ensureOptimizationCoverage(situation: string) {
    // Check if we have optimizations for all capable models for this situation
    for (const [model, capabilities] of this.modelCapabilities) {
      const key = `${model}-${situation}`;
      
      if (!this.optimizations.has(key)) {
        // Create initial optimization for this model-situation combination
        const defaultParams = this.getDefaultParameters();
        
        this.optimizations.set(key, {
          model,
          situation,
          parameters: defaultParams,
          performance: {
            quality: 0.5,
            speed: capabilities.avgResponseTime || 2000,
            cost: capabilities.costPerToken || 0.001,
            relevance: 0.5,
            creativity: 0.5
          },
          confidence: 0.3, // Low initial confidence
          lastUpdated: Date.now(),
          usageCount: 0
        });
      }
    }
  }

  /**
   * Update model rankings based on recent performance
   */
  private updateModelRankings() {
    const modelScores = new Map<string, {totalScore: number, sampleCount: number}>();
    
    const recentData = this.performanceHistory.filter(
      p => Date.now() - p.timestamp < 48 * 60 * 60 * 1000
    );
    
    recentData.forEach(perf => {
      const score = (perf.performance.quality * 0.4) + 
                    (perf.performance.relevance * 0.3) + 
                    (perf.performance.creativity * 0.2) + 
                    ((2000 - Math.min(2000, perf.performance.speed)) / 2000 * 0.1); // Speed bonus
      
      if (!modelScores.has(perf.model)) {
        modelScores.set(perf.model, {totalScore: 0, sampleCount: 0});
      }
      
      const modelData = modelScores.get(perf.model)!;
      modelData.totalScore += score;
      modelData.sampleCount++;
    });
    
    // Update model capabilities with performance rankings
    for (const [model, data] of modelScores) {
      if (data.sampleCount >= 3) {
        const avgScore = data.totalScore / data.sampleCount;
        const capabilities = this.modelCapabilities.get(model);
        
        if (capabilities) {
          capabilities.performanceRanking = avgScore;
          capabilities.lastRankingUpdate = Date.now();
        }
      }
    }
  }

  /**
   * Get performance insights for monitoring
   */
  getPerformanceInsights() {
    return {
      lastRecalibration: new Date(this.lastRecalibration).toISOString(),
      lastDiscovery: new Date(this.lastDiscovery).toISOString(),
      totalOptimizations: this.optimizations.size,
      recentPerformanceSamples: this.performanceHistory.filter(
        p => Date.now() - p.timestamp < 24 * 60 * 60 * 1000
      ).length,
      topPerformingModels: this.getTopPerformingModels(),
      recalibrationActive: this.recalibrationInterval !== null,
      discoveryActive: this.continuousDiscoveryInterval !== null
    };
  }

  /**
   * Get top performing models based on recent data
   */
  private getTopPerformingModels(): Array<{model: string, score: number}> {
    const modelPerformance = new Map<string, Array<number>>();
    
    const recentData = this.performanceHistory.filter(
      p => Date.now() - p.timestamp < 24 * 60 * 60 * 1000
    );
    
    recentData.forEach(perf => {
      const score = (perf.performance.quality + perf.performance.relevance) / 2;
      if (!modelPerformance.has(perf.model)) {
        modelPerformance.set(perf.model, []);
      }
      modelPerformance.get(perf.model)!.push(score);
    });
    
    const averages = Array.from(modelPerformance.entries())
      .map(([model, scores]) => ({
        model,
        score: scores.reduce((a, b) => a + b, 0) / scores.length
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    return averages;
  }

  /**
   * Perform pattern analysis to optimize based on usage patterns
   */
  private async performPatternAnalysis() {
    console.log('📊 Analyzing usage patterns for optimization...');
    
    // Analyze temporal patterns and adjust parameters accordingly
    this.analyzeTemporalPatterns();
    
    // Analyze load-based patterns
    this.analyzeLoadPatterns();
    
    // Analyze content-length patterns
    this.analyzeContentPatterns();
    
    // Analyze user-type patterns
    this.analyzeUserTypePatterns();
    
    // Generate pattern-based parameter adjustments
    this.generatePatternBasedOptimizations();
    
    console.log('✅ Pattern analysis completed');
  }

  /**
   * Analyze temporal usage patterns (time of day, day of week)
   */
  private analyzeTemporalPatterns() {
    for (const [patternKey, patterns] of this.usagePatterns) {
      const [model, situation] = patternKey.split('-');
      
      // Find optimal time periods for this model-situation combo
      const bestHours = patterns.timeOfDayPerformance
        .map((data: any, hour: number) => ({ hour, ...data }))
        .filter((data: any) => data.samples >= 3)
        .sort((a: any, b: any) => b.avgQuality - a.avgQuality)
        .slice(0, 3);
      
      const bestDays = patterns.dayOfWeekPerformance
        .map((data: any, day: number) => ({ day, ...data }))
        .filter((data: any) => data.samples >= 3)
        .sort((a: any, b: any) => b.avgQuality - a.avgQuality)
        .slice(0, 3);
      
      // Store temporal insights
      patterns.temporalInsights = {
        optimalHours: bestHours.map((h: any) => h.hour),
        optimalDays: bestDays.map((d: any) => d.day),
        peakPerformanceTime: bestHours[0]?.hour || 12,
        lowPerformancePeriods: patterns.timeOfDayPerformance
          .map((data: any, hour: number) => ({ hour, ...data }))
          .filter((data: any) => data.samples >= 3 && data.avgQuality < 0.6)
          .map((h: any) => h.hour)
      };
    }
  }

  /**
   * Analyze load-based performance patterns
   */
  private analyzeLoadPatterns() {
    for (const [patternKey, patterns] of this.usagePatterns) {
      const loadData = patterns.loadPatterns;
      
      // Determine optimal load conditions
      const loadPerformance = Object.entries(loadData)
        .filter(([_, data]: [string, any]) => data.samples >= 3)
        .sort(([_, a]: [string, any], [__, b]: [string, any]) => b.avgQuality - a.avgQuality);
      
      patterns.loadInsights = {
        optimalLoad: loadPerformance[0]?.[0] || 'low',
        performanceDegradation: loadData.high.avgQuality < loadData.low.avgQuality * 0.8,
        recommendedMaxConcurrency: loadData.high.avgQuality > 0.7 ? 25 : 15
      };
    }
  }

  /**
   * Analyze content length patterns
   */
  private analyzeContentPatterns() {
    for (const [patternKey, patterns] of this.usagePatterns) {
      const contentData = patterns.contentLengthPatterns;
      
      // Find optimal parameters for different content lengths
      Object.entries(contentData).forEach(([length, data]: [string, any]) => {
        if (data.samples >= 5) {
          // Adjust optimal temperature based on performance
          if (data.avgQuality > 0.8) {
            // High quality - parameters are good
            data.optimalTemp = Math.max(0.1, data.optimalTemp);
          } else if (data.avgQuality < 0.6) {
            // Low quality - try different temperature
            data.optimalTemp = length === 'short' ? 0.5 : 
                             length === 'medium' ? 0.4 : 0.3;
          }
        }
      });
      
      patterns.contentInsights = {
        shortContentOptimal: contentData.short.avgQuality > 0.75,
        longContentChallenging: contentData.long.avgQuality < 0.65,
        recommendedTokenAdjustment: contentData.long.avgQuality < 0.6 ? 1.5 : 1.0
      };
    }
  }

  /**
   * Analyze user type patterns
   */
  private analyzeUserTypePatterns() {
    for (const [patternKey, patterns] of this.usagePatterns) {
      const userTypeInsights: any = {};
      
      for (const [userType, data] of patterns.userTypePatterns) {
        if (data.samples >= 3) {
          userTypeInsights[userType] = {
            qualityScore: data.avgQuality,
            speedScore: data.avgSpeed,
            needsOptimization: data.avgQuality < 0.7,
            isHighPerforming: data.avgQuality > 0.8
          };
        }
      }
      
      patterns.userTypeInsights = userTypeInsights;
    }
  }

  /**
   * Generate optimizations based on discovered patterns
   */
  private generatePatternBasedOptimizations() {
    for (const [patternKey, patterns] of this.usagePatterns) {
      const [model, situation] = patternKey.split('-');
      const optimization = this.optimizations.get(patternKey);
      
      if (!optimization) continue;
      
      const now = new Date();
      const currentHour = now.getHours();
      const currentDay = now.getDay();
      const currentLoad = this.getCurrentRequestVolume();
      
      // Apply temporal adjustments
      if (patterns.temporalInsights) {
        const isOptimalTime = patterns.temporalInsights.optimalHours.includes(currentHour);
        const isOptimalDay = patterns.temporalInsights.optimalDays.includes(currentDay);
        
        if (!isOptimalTime || !isOptimalDay) {
          // Adjust parameters for sub-optimal times
          optimization.parameters.temperature = Math.max(0.1, 
            optimization.parameters.temperature * 0.9);
          optimization.parameters.maxTokens = Math.min(
            this.modelCapabilities.get(model)?.maxTokens || 4096,
            Math.floor(optimization.parameters.maxTokens * 1.1)
          );
        }
      }
      
      // Apply load-based adjustments
      if (patterns.loadInsights) {
        const loadCategory = currentLoad < 5 ? 'low' : 
                           currentLoad < 20 ? 'medium' : 'high';
        
        if (loadCategory !== patterns.loadInsights.optimalLoad) {
          if (loadCategory === 'high' && patterns.loadInsights.performanceDegradation) {
            // Reduce complexity under high load
            optimization.parameters.temperature = Math.max(0.1, 
              optimization.parameters.temperature * 0.8);
            optimization.parameters.maxTokens = Math.min(
              optimization.parameters.maxTokens,
              Math.floor(optimization.parameters.maxTokens * 0.8)
            );
          }
        }
      }
      
      // Apply content-based adjustments
      if (patterns.contentInsights) {
        if (patterns.contentInsights.longContentChallenging) {
          // Boost parameters for long content
          optimization.parameters.maxTokens = Math.min(
            this.modelCapabilities.get(model)?.maxTokens || 4096,
            Math.floor(optimization.parameters.maxTokens * 
              patterns.contentInsights.recommendedTokenAdjustment)
          );
        }
      }
      
      // Update confidence based on pattern success
      const patternSuccess = this.calculatePatternSuccessScore(patterns);
      optimization.confidence = Math.min(1.0, 
        optimization.confidence * 0.8 + patternSuccess * 0.2);
    }
  }

  /**
   * Calculate pattern success score
   */
  private calculatePatternSuccessScore(patterns: any): number {
    let score = 0.5;
    let factors = 0;
    
    // Temporal pattern success
    if (patterns.temporalInsights) {
      const avgOptimalQuality = patterns.temporalInsights.optimalHours
        .reduce((sum: number, hour: number) => 
          sum + patterns.timeOfDayPerformance[hour].avgQuality, 0) / 
        patterns.temporalInsights.optimalHours.length;
      score += avgOptimalQuality * 0.3;
      factors++;
    }
    
    // Load pattern success
    if (patterns.loadInsights) {
      const optimalLoadData = patterns.loadPatterns[patterns.loadInsights.optimalLoad];
      if (optimalLoadData.samples > 0) {
        score += optimalLoadData.avgQuality * 0.2;
        factors++;
      }
    }
    
    // Content pattern success
    if (patterns.contentInsights) {
      const contentScores = Object.values(patterns.contentLengthPatterns)
        .filter((data: any) => data.samples > 0)
        .map((data: any) => data.avgQuality);
      
      if (contentScores.length > 0) {
        const avgContentQuality = contentScores.reduce((a: number, b: number) => a + b, 0) / contentScores.length;
        score += avgContentQuality * 0.2;
        factors++;
      }
    }
    
    return factors > 0 ? score / factors : 0.5;
  }

  /**
   * Get comprehensive usage pattern insights
   */
  getUsagePatternInsights() {
    const insights: any = {
      totalPatterns: this.usagePatterns.size,
      temporalPatterns: {},
      loadPatterns: {},
      contentPatterns: {},
      userTypePatterns: {},
      recommendations: []
    };
    
    for (const [patternKey, patterns] of this.usagePatterns) {
      const [model, situation] = patternKey.split('-');
      
      if (patterns.temporalInsights) {
        insights.temporalPatterns[patternKey] = patterns.temporalInsights;
      }
      
      if (patterns.loadInsights) {
        insights.loadPatterns[patternKey] = patterns.loadInsights;
      }
      
      if (patterns.contentInsights) {
        insights.contentPatterns[patternKey] = patterns.contentInsights;
      }
      
      if (patterns.userTypeInsights) {
        insights.userTypePatterns[patternKey] = patterns.userTypeInsights;
      }
      
      // Generate recommendations
      if (patterns.temporalInsights?.lowPerformancePeriods.length > 0) {
        insights.recommendations.push({
          type: 'temporal',
          model,
          situation,
          issue: 'Poor performance during certain hours',
          suggestion: 'Consider using alternative models during low-performance periods'
        });
      }
      
      if (patterns.loadInsights?.performanceDegradation) {
        insights.recommendations.push({
          type: 'load',
          model,
          situation,
          issue: 'Performance degrades under high load',
          suggestion: 'Implement load balancing or parameter reduction for high concurrency'
        });
      }
    }
    
    return insights;
  }

  /**
   * Cleanup intervals when shutting down
   */
  destroy() {
    if (this.recalibrationInterval) {
      clearInterval(this.recalibrationInterval);
      this.recalibrationInterval = null;
    }
    
    if (this.continuousDiscoveryInterval) {
      clearInterval(this.continuousDiscoveryInterval);
      this.continuousDiscoveryInterval = null;
    }
    
    if (this.patternAnalysisInterval) {
      clearInterval(this.patternAnalysisInterval);
      this.patternAnalysisInterval = null;
    }
    
    console.log('🔄 AI Parameter Optimizer: Stopped periodic processes');
  }

  private loadOptimizationHistory() {
    // In a real implementation, this would load from persistent storage
    // For now, we'll start with empty optimization history
  }
}

export const aiParameterOptimizer = new AIParameterOptimizer();