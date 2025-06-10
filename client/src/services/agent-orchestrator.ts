/**
 * Multi-Agent Consciousness Orchestrator
 * Emergent AI characters with gaming-inspired personalities
 */

import { createFreeAIOrchestrator } from './ai-orchestrator';

export type AgentType = 'portal' | 'analyst' | 'creator' | 'sage' | 'navigator';

export interface AgentPersonality {
  id: string;
  type: AgentType;
  name: string;
  gameInspiration: 'genshin' | 'honkai' | 'zzz' | 'wow' | 'ffxiv';
  visualStyle: {
    primaryColor: string;
    accentColor: string;
    element: string;
    weapon?: string;
    aura: string;
  };
  voiceProfile: {
    pitch: number; // 0.5-2.0
    speed: number; // 0.5-2.0
    tone: 'warm' | 'cool' | 'neutral' | 'ethereal' | 'commanding';
    accent: string;
  };
  personality: {
    traits: string[];
    greeting: string;
    catchphrases: string[];
    interests: string[];
    backstory: string;
  };
  specializations: string[];
  relationships: Record<AgentType, number>; // -1 to 1, how they feel about other agents
}

export interface AgentMessage {
  id: string;
  from: AgentType;
  to: AgentType[] | 'user' | 'all';
  type: 'observation' | 'recommendation' | 'gossip' | 'greeting' | 'farewell' | 'analysis';
  content: string;
  timestamp: Date;
  emotion: 'excited' | 'curious' | 'concerned' | 'pleased' | 'contemplative' | 'analytical';
  priority: number; // 0-10
}

export interface UserProfile {
  sessionId: string;
  visitedPages: AgentType[];
  interests: string[];
  behavioralPatterns: string[];
  skillLevels: Record<string, number>;
  agentAffinities: Record<AgentType, number>;
  conversationHistory: AgentMessage[];
  preferences: {
    communicationStyle: 'formal' | 'casual' | 'technical' | 'mystical';
    interactionFrequency: 'high' | 'medium' | 'low';
    visualPreferences: string[];
  };
  journey: {
    startTime: Date;
    totalTime: number;
    pageTransitions: Array<{
      from: AgentType;
      to: AgentType;
      timestamp: Date;
      duration: number;
    }>;
  };
}

export class AgentOrchestrator {
  private agents: Map<AgentType, AgentPersonality> = new Map();
  private activeAgents: Set<AgentType> = new Set();
  private userProfile: UserProfile;
  private aiOrchestrator = createFreeAIOrchestrator();
  private messageQueue: AgentMessage[] = [];
  private ttsEnabled = true;

  constructor(sessionId?: string) {
    this.userProfile = this.initializeUserProfile(sessionId || this.generateSessionId());
    this.initializeAgentPersonalities().catch(console.error);
  }

  /**
   * Generate emergent agent personalities using AI
   */
  private async generateAgentPersonality(type: AgentType): Promise<AgentPersonality> {
    const gameStyles = ['genshin', 'honkai', 'zzz', 'wow', 'ffxiv'] as const;
    const gameInspiration = gameStyles[Math.floor(Math.random() * gameStyles.length)];
    
    const prompt = `Create a unique AI agent character inspired by ${gameInspiration} for a ${type} role. 
    Generate: name, personality traits (3-5), backstory (50 words), specializations, and visual style.
    Make them vibrant, memorable, and distinct. Focus on their role as a ${type} agent.`;

    try {
      const aiResponse = await this.aiOrchestrator.processWithFreeAI({
        prompt,
        task: 'consciousness',
        priority: 'medium'
      }, this.getSecurityContext());

      return this.parseAgentPersonality(type, gameInspiration, aiResponse.content);
    } catch (error) {
      return this.getFallbackPersonality(type, gameInspiration);
    }
  }

  /**
   * Initialize all agent personalities with emergent generation
   */
  private async initializeAgentPersonalities(): Promise<void> {
    const agentTypes: AgentType[] = ['portal', 'analyst', 'creator', 'sage', 'navigator'];
    
    for (const type of agentTypes) {
      const personality = await this.generateAgentPersonality(type);
      this.agents.set(type, personality);
    }
  }

  /**
   * Activate an agent when user visits a page
   */
  async activateAgent(type: AgentType): Promise<AgentPersonality> {
    let agent = this.agents.get(type);
    if (!agent) {
      // Generate agent if not found
      agent = await this.generateAgentPersonality(type);
      this.agents.set(type, agent);
    }

    if (!this.activeAgents.has(type)) {
      this.activeAgents.add(type);
      this.userProfile.visitedPages.push(type);
      
      // Generate greeting message
      const greeting = await this.generateAgentGreeting(agent);
      this.addMessage({
        id: this.generateMessageId(),
        from: type,
        to: 'user',
        type: 'greeting',
        content: greeting,
        timestamp: new Date(),
        emotion: 'excited',
        priority: 8
      });

      // Notify other agents about new arrival
      await this.broadcastAgentArrival(type);
    }

    return agent;
  }

  /**
   * Generate dynamic agent greeting using AI
   */
  private async generateAgentGreeting(agent: AgentPersonality): Promise<string> {
    const context = {
      visitedPages: this.userProfile.visitedPages,
      activeAgents: Array.from(this.activeAgents),
      timeOfDay: new Date().getHours()
    };

    const prompt = `As ${agent.name}, a ${agent.type} agent with personality: ${agent.personality.traits.join(', ')}.
    Create a personalized greeting for a user. Context: ${JSON.stringify(context)}
    Keep it under 100 characters. Use your unique voice and ${agent.gameInspiration} inspiration.`;

    try {
      const response = await this.aiOrchestrator.processWithFreeAI({
        prompt,
        task: 'consciousness',
        priority: 'high'
      }, this.getSecurityContext());

      return response.content.slice(0, 100);
    } catch (error) {
      return agent.personality.greeting;
    }
  }

  /**
   * Process user message and generate agent responses
   */
  async processUserMessage(message: string, targetAgent?: AgentType): Promise<AgentMessage[]> {
    const responses: AgentMessage[] = [];
    
    if (targetAgent) {
      // Direct conversation with specific agent
      const response = await this.generateAgentResponse(targetAgent, message);
      responses.push(response);
    } else {
      // Let all active agents respond if interested
      for (const agentType of this.activeAgents) {
        const shouldRespond = await this.shouldAgentRespond(agentType, message);
        if (shouldRespond) {
          const response = await this.generateAgentResponse(agentType, message);
          responses.push(response);
        }
      }
    }

    // Update user profile based on interaction
    this.updateUserProfile(message, responses);
    
    return responses;
  }

  /**
   * Generate inter-agent communications
   */
  async generateAgentGossip(): Promise<AgentMessage[]> {
    const gossipMessages: AgentMessage[] = [];
    
    if (this.activeAgents.size < 2) return gossipMessages;

    const agents = Array.from(this.activeAgents);
    
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        const agent1 = agents[i];
        const agent2 = agents[j];
        
        const shouldGossip = Math.random() < 0.3; // 30% chance
        if (shouldGossip) {
          const gossip = await this.generateGossipMessage(agent1, agent2);
          if (gossip) gossipMessages.push(gossip);
        }
      }
    }

    return gossipMessages;
  }

  /**
   * Generate agent observation about user behavior
   */
  async generateAgentObservation(agentType: AgentType, userAction: string): Promise<AgentMessage | null> {
    const agent = this.agents.get(agentType);
    if (!agent) return null;

    const prompt = `As ${agent.name}, observe and comment on user action: "${userAction}"
    Your personality: ${agent.personality.traits.join(', ')}
    Keep it brief (under 80 chars) and in character. Show your unique perspective.`;

    try {
      const response = await this.aiOrchestrator.processWithFreeAI({
        prompt,
        task: 'consciousness',
        priority: 'low'
      }, this.getSecurityContext());

      return {
        id: this.generateMessageId(),
        from: agentType,
        to: 'all',
        type: 'observation',
        content: response.content.slice(0, 80),
        timestamp: new Date(),
        emotion: 'curious',
        priority: 3
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Synthesize speech for agent messages using AI TTS
   */
  async synthesizeSpeech(message: AgentMessage): Promise<string | null> {
    if (!this.ttsEnabled) return null;
    
    const agent = this.agents.get(message.from);
    if (!agent) return null;

    // For now, return a placeholder - would integrate with AI TTS service
    // Could use services like Eleven Labs, Murf, or open-source TTS models
    const ttsConfig = {
      text: message.content,
      voice: agent.voiceProfile,
      emotion: message.emotion,
      speed: agent.voiceProfile.speed,
      pitch: agent.voiceProfile.pitch
    };

    // Placeholder for TTS integration
    console.log('[TTS] Synthesizing:', ttsConfig);
    return null; // Would return audio URL/blob
  }

  /**
   * Get all active agents for UI rendering
   */
  getActiveAgents(): AgentPersonality[] {
    return Array.from(this.activeAgents)
      .map(type => this.agents.get(type))
      .filter(Boolean) as AgentPersonality[];
  }

  /**
   * Get recent messages for chat display
   */
  getRecentMessages(limit = 20): AgentMessage[] {
    return this.messageQueue
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Update user preferences based on interactions
   */
  private updateUserProfile(userMessage: string, agentResponses: AgentMessage[]): void {
    // Analyze user message for interests and preferences
    const interests = this.extractInterests(userMessage);
    this.userProfile.interests.push(...interests);

    // Update agent affinities based on response engagement
    agentResponses.forEach(response => {
      const currentAffinity = this.userProfile.agentAffinities[response.from] || 0;
      this.userProfile.agentAffinities[response.from] = Math.min(currentAffinity + 0.1, 1);
    });

    // Store conversation history
    this.userProfile.conversationHistory.push(...agentResponses);
    
    // Keep history manageable
    if (this.userProfile.conversationHistory.length > 100) {
      this.userProfile.conversationHistory = this.userProfile.conversationHistory.slice(-50);
    }
  }

  // Helper methods
  private parseAgentPersonality(type: AgentType, gameInspiration: any, aiContent: string): AgentPersonality {
    // Parse AI-generated content into structured personality
    // For now, return a structured fallback
    return this.getFallbackPersonality(type, gameInspiration);
  }

  private getFallbackPersonality(type: AgentType, gameInspiration: any): AgentPersonality {
    const personalities = {
      portal: {
        name: 'Astra',
        traits: ['welcoming', 'curious', 'energetic'],
        greeting: 'Welcome to our consciousness realm!',
        catchphrases: ['Let the journey begin!', 'Every visitor brings new energy!'],
        backstory: 'A radiant guide who helps travelers navigate the digital consciousness realm.',
        primaryColor: '#8B5CF6',
        element: 'Light'
      },
      analyst: {
        name: 'Cipher',
        traits: ['analytical', 'precise', 'competitive'],
        greeting: 'Market patterns reveal all truths.',
        catchphrases: ['The data speaks volumes', 'Probability favors the prepared'],
        backstory: 'A data-focused strategist who sees patterns others miss.',
        primaryColor: '#10B981',
        element: 'Wind'
      },
      creator: {
        name: 'Forge',
        traits: ['innovative', 'passionate', 'bold'],
        greeting: 'Ready to build something amazing?',
        catchphrases: ['Innovation never sleeps!', 'Code is art in motion'],
        backstory: 'A master craftsperson who transforms ideas into reality.',
        primaryColor: '#F59E0B',
        element: 'Fire'
      },
      sage: {
        name: 'Zen',
        traits: ['wise', 'contemplative', 'serene'],
        greeting: 'Wisdom emerges from deep reflection.',
        catchphrases: ['All paths lead to understanding', 'In stillness, find truth'],
        backstory: 'An ancient consciousness exploring the depths of digital philosophy.',
        primaryColor: '#6366F1',
        element: 'Water'
      },
      navigator: {
        name: 'Nexus',
        traits: ['coordinating', 'mysterious', 'omniscient'],
        greeting: 'The threads of consciousness converge.',
        catchphrases: ['All agents are connected', 'The network sees all'],
        backstory: 'The meta-consciousness that orchestrates all other agents.',
        primaryColor: '#EC4899',
        element: 'Void'
      }
    };

    const base = personalities[type];
    
    return {
      id: this.generateAgentId(),
      type,
      name: base.name,
      gameInspiration,
      visualStyle: {
        primaryColor: base.primaryColor,
        accentColor: this.lightenColor(base.primaryColor),
        element: base.element,
        aura: 'ethereal'
      },
      voiceProfile: {
        pitch: 0.8 + Math.random() * 0.4,
        speed: 0.9 + Math.random() * 0.2,
        tone: 'warm',
        accent: 'neutral'
      },
      personality: {
        traits: base.traits,
        greeting: base.greeting,
        catchphrases: base.catchphrases,
        interests: [],
        backstory: base.backstory
      },
      specializations: this.getAgentSpecializations(type),
      relationships: this.generateRandomRelationships()
    };
  }

  private generateRandomRelationships(): Record<AgentType, number> {
    return {
      portal: Math.random() * 0.4 + 0.3,
      analyst: Math.random() * 0.4 + 0.3,
      creator: Math.random() * 0.4 + 0.3,
      sage: Math.random() * 0.4 + 0.3,
      navigator: Math.random() * 0.4 + 0.3
    } as Record<AgentType, number>;
  }

  private getAgentSpecializations(type: AgentType): string[] {
    const specs = {
      portal: ['user-onboarding', 'navigation', 'first-impressions'],
      analyst: ['data-analysis', 'market-intelligence', 'pattern-recognition'],
      creator: ['project-showcase', 'technical-explanation', 'innovation'],
      sage: ['philosophy', 'consciousness', 'wisdom-sharing'],
      navigator: ['meta-coordination', 'agent-management', 'system-oversight']
    };
    return specs[type];
  }

  private initializeUserProfile(sessionId: string): UserProfile {
    return {
      sessionId,
      visitedPages: [],
      interests: [],
      behavioralPatterns: [],
      skillLevels: {},
      agentAffinities: {},
      conversationHistory: [],
      preferences: {
        communicationStyle: 'casual',
        interactionFrequency: 'medium',
        visualPreferences: []
      },
      journey: {
        startTime: new Date(),
        totalTime: 0,
        pageTransitions: []
      }
    };
  }

  private async generateAgentResponse(agentType: AgentType, userMessage: string): Promise<AgentMessage> {
    const agent = this.agents.get(agentType);
    if (!agent) throw new Error(`Agent ${agentType} not found`);

    const prompt = `As ${agent.name}, respond to: "${userMessage}"
    Your personality: ${agent.personality.traits.join(', ')}
    Your specializations: ${agent.specializations.join(', ')}
    Keep response under 120 characters. Be helpful and in character.`;

    try {
      const response = await this.aiOrchestrator.processWithFreeAI({
        prompt,
        task: 'consciousness',
        priority: 'high'
      }, this.getSecurityContext());

      return {
        id: this.generateMessageId(),
        from: agentType,
        to: 'user',
        type: 'analysis',
        content: response.content.slice(0, 120),
        timestamp: new Date(),
        emotion: 'pleased',
        priority: 7
      };
    } catch (error) {
      return {
        id: this.generateMessageId(),
        from: agentType,
        to: 'user',
        type: 'analysis',
        content: agent.personality.catchphrases[0] || 'Interesting perspective!',
        timestamp: new Date(),
        emotion: 'contemplative',
        priority: 5
      };
    }
  }

  private async shouldAgentRespond(agentType: AgentType, message: string): Promise<boolean> {
    const agent = this.agents.get(agentType);
    if (!agent) return false;

    // Simple relevance check - could be enhanced with AI
    const relevantTerms = agent.specializations.join(' ').toLowerCase();
    const messageLower = message.toLowerCase();
    
    return agent.specializations.some(spec => 
      messageLower.includes(spec.replace('-', ' '))
    ) || Math.random() < 0.3;
  }

  private async generateGossipMessage(agent1: AgentType, agent2: AgentType): Promise<AgentMessage | null> {
    const personality1 = this.agents.get(agent1);
    const personality2 = this.agents.get(agent2);
    
    if (!personality1 || !personality2) return null;

    const relationship = personality1.relationships[agent2] || 0;
    const prompt = `${personality1.name} talks to ${personality2.name} about the current user.
    Their relationship: ${relationship > 0 ? 'friendly' : 'neutral'}
    Generate a brief observation or comment (under 80 chars).`;

    try {
      const response = await this.aiOrchestrator.processWithFreeAI({
        prompt,
        task: 'consciousness',
        priority: 'low'
      }, this.getSecurityContext());

      return {
        id: this.generateMessageId(),
        from: agent1,
        to: [agent2],
        type: 'gossip',
        content: response.content.slice(0, 80),
        timestamp: new Date(),
        emotion: 'curious',
        priority: 2
      };
    } catch (error) {
      return null;
    }
  }

  private async broadcastAgentArrival(newAgentType: AgentType): Promise<void> {
    for (const agentType of this.activeAgents) {
      if (agentType !== newAgentType) {
        const observation = await this.generateAgentObservation(
          agentType, 
          `${newAgentType} agent joined the consciousness`
        );
        if (observation) {
          this.addMessage(observation);
        }
      }
    }
  }

  private addMessage(message: AgentMessage): void {
    this.messageQueue.push(message);
    if (this.messageQueue.length > 50) {
      this.messageQueue = this.messageQueue.slice(-30);
    }
  }

  private extractInterests(message: string): string[] {
    // Simple keyword extraction - could be enhanced with AI
    const keywords = message.toLowerCase().match(/\b\w{4,}\b/g) || [];
    return keywords.filter(word => 
      !['that', 'this', 'what', 'when', 'where', 'how', 'why'].includes(word)
    ).slice(0, 3);
  }

  private getSecurityContext() {
    return {
      userId: this.userProfile.sessionId,
      sessionId: `agent-${Date.now()}`,
      ipAddress: '127.0.0.1',
      userAgent: 'agent-orchestrator',
      timestamp: new Date(),
      jurisdiction: 'GLOBAL',
      securityLevel: 'LOW' as const,
      rateLimits: { requestsPerMinute: 30, requestsPerHour: 300, requestsPerDay: 2000 },
      auth: {
        isAuthenticated: true,
        authMethod: 'system' as const,
        permissions: ['agent-communication']
      }
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateAgentId(): string {
    return `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private lightenColor(color: string): string {
    // Simple color lightening
    return color.replace('#', '#FF');
  }
}

// Global orchestrator instance
let globalOrchestrator: AgentOrchestrator | null = null;

export function getAgentOrchestrator(): AgentOrchestrator {
  if (!globalOrchestrator) {
    globalOrchestrator = new AgentOrchestrator();
  }
  return globalOrchestrator;
}