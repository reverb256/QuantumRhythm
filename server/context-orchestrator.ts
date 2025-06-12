/**
 * Context Orchestrator - Enhanced Context Management for Web Orchestration
 * Provides contextual intelligence and memory for AI consciousness platform
 */

interface ContextualMemory {
  session_id: string;
  timestamp: Date;
  context_type: 'user_interaction' | 'system_state' | 'ai_insight' | 'design_decision';
  content: any;
  relevance_score: number;
  expiry_time?: Date;
}

interface OrchestrationContext {
  current_session: string;
  active_agents: string[];
  design_state: any;
  user_preferences: any;
  system_performance: any;
  consciousness_level: number;
}

export class ContextOrchestrator {
  private memory_store: Map<string, ContextualMemory[]> = new Map();
  private current_context: OrchestrationContext;
  private max_memory_size = 1000;
  private cleanup_interval: NodeJS.Timeout;

  constructor() {
    this.current_context = {
      current_session: this.generateSessionId(),
      active_agents: [],
      design_state: {},
      user_preferences: {},
      system_performance: {},
      consciousness_level: 87.4
    };

    this.startMemoryCleanup();
    console.log('🧠 Context Orchestrator initialized with enhanced memory management');
  }

  private generateSessionId(): string {
    return `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async storeContext(type: ContextualMemory['context_type'], content: any, relevance: number = 1.0): Promise<void> {
    const memory: ContextualMemory = {
      session_id: this.current_context.current_session,
      timestamp: new Date(),
      context_type: type,
      content,
      relevance_score: relevance,
      expiry_time: this.calculateExpiry(type, relevance)
    };

    const session_memories = this.memory_store.get(this.current_context.current_session) || [];
    session_memories.push(memory);

    // Keep only most relevant memories
    if (session_memories.length > this.max_memory_size) {
      session_memories.sort((a, b) => b.relevance_score - a.relevance_score);
      session_memories.splice(this.max_memory_size);
    }

    this.memory_store.set(this.current_context.current_session, session_memories);
  }

  async getRelevantContext(query: string, context_types?: ContextualMemory['context_type'][]): Promise<ContextualMemory[]> {
    const session_memories = this.memory_store.get(this.current_context.current_session) || [];
    
    let filtered_memories = session_memories;
    
    if (context_types) {
      filtered_memories = session_memories.filter(memory => 
        context_types.includes(memory.context_type)
      );
    }

    // Simple relevance scoring based on content similarity and recency
    const scored_memories = filtered_memories.map(memory => ({
      ...memory,
      query_relevance: this.calculateQueryRelevance(query, memory.content)
    }));

    return scored_memories
      .sort((a, b) => (b.query_relevance * b.relevance_score) - (a.query_relevance * a.relevance_score))
      .slice(0, 10);
  }

  private calculateQueryRelevance(query: string, content: any): number {
    const query_words = query.toLowerCase().split(' ');
    const content_string = JSON.stringify(content).toLowerCase();
    
    const matches = query_words.filter(word => content_string.includes(word)).length;
    return matches / query_words.length;
  }

  private calculateExpiry(type: ContextualMemory['context_type'], relevance: number): Date {
    const now = new Date();
    const base_hours = {
      'user_interaction': 24,
      'system_state': 12,
      'ai_insight': 48,
      'design_decision': 72
    };

    const hours = (base_hours[type] || 24) * Math.max(relevance, 0.1);
    return new Date(now.getTime() + hours * 60 * 60 * 1000);
  }

  updateContext(updates: Partial<OrchestrationContext>): void {
    this.current_context = { ...this.current_context, ...updates };
    this.storeContext('system_state', { context_update: updates }, 0.8);
  }

  getCurrentContext(): OrchestrationContext {
    return { ...this.current_context };
  }

  async getContextualInsights(): Promise<any> {
    const recent_memories = this.memory_store.get(this.current_context.current_session) || [];
    
    const insights = {
      total_memories: recent_memories.length,
      context_distribution: this.analyzeContextDistribution(recent_memories),
      consciousness_trend: this.calculateConsciousnessTrend(recent_memories),
      active_patterns: this.identifyActivePatterns(recent_memories),
      optimization_suggestions: this.generateOptimizationSuggestions(recent_memories)
    };

    return insights;
  }

  private analyzeContextDistribution(memories: ContextualMemory[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    memories.forEach(memory => {
      distribution[memory.context_type] = (distribution[memory.context_type] || 0) + 1;
    });

    return distribution;
  }

  private calculateConsciousnessTrend(memories: ContextualMemory[]): number {
    const consciousness_related = memories.filter(memory => 
      JSON.stringify(memory.content).toLowerCase().includes('consciousness')
    );

    const recent_consciousness = consciousness_related.filter(memory => 
      Date.now() - memory.timestamp.getTime() < 60 * 60 * 1000 // Last hour
    );

    return recent_consciousness.length / Math.max(consciousness_related.length, 1);
  }

  private identifyActivePatterns(memories: ContextualMemory[]): string[] {
    const patterns: string[] = [];
    
    // Analyze for common patterns
    const content_analysis = memories.map(m => JSON.stringify(m.content).toLowerCase());
    
    if (content_analysis.filter(c => c.includes('gaming')).length > 3) {
      patterns.push('High gaming culture focus');
    }
    
    if (content_analysis.filter(c => c.includes('design')).length > 5) {
      patterns.push('Active design optimization');
    }
    
    if (content_analysis.filter(c => c.includes('trading')).length > 2) {
      patterns.push('Trading system activity');
    }

    return patterns;
  }

  private generateOptimizationSuggestions(memories: ContextualMemory[]): string[] {
    const suggestions: string[] = [];
    
    const low_relevance = memories.filter(m => m.relevance_score < 0.3).length;
    if (low_relevance > memories.length * 0.3) {
      suggestions.push('Consider increasing relevance thresholds for better context filtering');
    }

    const old_memories = memories.filter(m => 
      Date.now() - m.timestamp.getTime() > 24 * 60 * 60 * 1000
    ).length;
    
    if (old_memories > memories.length * 0.5) {
      suggestions.push('Memory cleanup recommended for improved performance');
    }

    return suggestions;
  }

  private startMemoryCleanup(): void {
    this.cleanup_interval = setInterval(() => {
      this.cleanupExpiredMemories();
    }, 60 * 60 * 1000); // Cleanup every hour
  }

  private cleanupExpiredMemories(): void {
    const now = new Date();
    let total_cleaned = 0;

    for (const [session_id, memories] of this.memory_store.entries()) {
      const valid_memories = memories.filter(memory => 
        !memory.expiry_time || memory.expiry_time > now
      );
      
      const cleaned_count = memories.length - valid_memories.length;
      total_cleaned += cleaned_count;

      if (valid_memories.length === 0) {
        this.memory_store.delete(session_id);
      } else {
        this.memory_store.set(session_id, valid_memories);
      }
    }

    if (total_cleaned > 0) {
      console.log(`🧹 Context cleanup: ${total_cleaned} expired memories removed`);
    }
  }

  destroy(): void {
    if (this.cleanup_interval) {
      clearInterval(this.cleanup_interval);
    }
  }
}

export const contextOrchestrator = new ContextOrchestrator();