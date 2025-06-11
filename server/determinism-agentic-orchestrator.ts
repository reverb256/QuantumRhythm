/**
 * Determinism-Agentic Balance Orchestrator
 * Continuously balances rigid rule-following with creative autonomous behavior
 */

interface ContextualState {
  marketVolatility: number; // 0-1 scale
  portfolioHealth: number; // 0-1 scale
  consecutiveSuccesses: number;
  consecutiveFailures: number;
  systemLoad: number; // 0-1 scale
  emergencyMode: boolean;
  learningProgress: number; // 0-1 scale
  confidenceLevel: number; // 0-1 scale
}

interface BehaviorBalance {
  determinism: number; // 0-1 scale, higher = more rule-based
  agency: number; // 0-1 scale, higher = more creative/autonomous
  adaptability: number; // 0-1 scale, response to changing conditions
  riskTolerance: number; // 0-1 scale
  explorationRatio: number; // 0-1 scale, exploration vs exploitation
}

interface DecisionContext {
  scenario: 'trading' | 'wallet_creation' | 'opportunity_scanning' | 'risk_management' | 'emergency';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  stakes: 'minimal' | 'moderate' | 'significant' | 'high';
  certainty: number; // 0-1 scale, how certain we are about the situation
}

class DeterminismAgenticOrchestrator {
  private currentBalance: BehaviorBalance;
  private contextualState: ContextualState;
  private balanceHistory: Array<{ timestamp: Date; balance: BehaviorBalance; outcome: 'success' | 'failure' | 'neutral' }> = [];
  private adaptationCooldown = 30000; // 30 seconds minimum between major adjustments
  private lastAdaptation = 0;

  constructor() {
    this.currentBalance = {
      determinism: 0.7, // Start more rule-based for safety
      agency: 0.3,
      adaptability: 0.5,
      riskTolerance: 0.4,
      explorationRatio: 0.2
    };

    this.contextualState = {
      marketVolatility: 0.5,
      portfolioHealth: 1.0,
      consecutiveSuccesses: 0,
      consecutiveFailures: 0,
      systemLoad: 0.3,
      emergencyMode: false,
      learningProgress: 0.1,
      confidenceLevel: 0.6
    };

    this.startContinuousOrchestration();
    console.log('🎯 Determinism-Agentic Orchestrator initialized');
    console.log('   Starting balance: 70% deterministic, 30% agentic');
  }

  private startContinuousOrchestration(): void {
    setInterval(() => {
      this.updateContextualState();
      this.calculateOptimalBalance();
      this.adaptBehavior();
    }, 5000); // Reassess every 5 seconds

    // Deeper analysis every minute
    setInterval(() => {
      this.analyzePerformancePatterns();
      this.optimizeBalanceStrategy();
    }, 60000);

    console.log('🔄 Continuous orchestration activated');
  }

  private updateContextualState(): void {
    // Simulate real-time context updates (in practice, these would come from live data)
    const now = Date.now();
    
    // Market volatility assessment
    this.contextualState.marketVolatility = this.assessMarketVolatility();
    
    // Portfolio health check
    this.contextualState.portfolioHealth = this.assessPortfolioHealth();
    
    // System performance
    this.contextualState.systemLoad = this.assessSystemLoad();
    
    // Learning progress tracking
    this.contextualState.learningProgress = Math.min(1.0, this.contextualState.learningProgress + 0.001);
    
    // Confidence building/erosion based on recent performance
    this.updateConfidenceLevel();
  }

  private assessMarketVolatility(): number {
    // Simulated volatility assessment
    const baseVolatility = 0.3;
    const randomFactor = (Math.random() - 0.5) * 0.2;
    return Math.max(0, Math.min(1, baseVolatility + randomFactor));
  }

  private assessPortfolioHealth(): number {
    // Portfolio health based on recent performance
    const successWeight = this.contextualState.consecutiveSuccesses * 0.1;
    const failureWeight = this.contextualState.consecutiveFailures * -0.15;
    const baseHealth = 0.8;
    
    return Math.max(0, Math.min(1, baseHealth + successWeight + failureWeight));
  }

  private assessSystemLoad(): number {
    // Simulated system load assessment
    const memoryUsage = process.memoryUsage();
    const heapRatio = memoryUsage.heapUsed / memoryUsage.heapTotal;
    return Math.min(1, heapRatio * 1.2);
  }

  private updateConfidenceLevel(): void {
    const recentSuccesses = this.contextualState.consecutiveSuccesses;
    const recentFailures = this.contextualState.consecutiveFailures;
    
    if (recentSuccesses > recentFailures) {
      this.contextualState.confidenceLevel = Math.min(1.0, this.contextualState.confidenceLevel + 0.05);
    } else if (recentFailures > recentSuccesses) {
      this.contextualState.confidenceLevel = Math.max(0.1, this.contextualState.confidenceLevel - 0.03);
    }
  }

  private calculateOptimalBalance(): void {
    const state = this.contextualState;
    
    // Base adjustments based on context
    let determinismTarget = 0.7; // Default conservative
    let agencyTarget = 0.3;
    let adaptabilityTarget = 0.5;
    let riskToleranceTarget = 0.4;
    let explorationTarget = 0.2;

    // Emergency mode: max determinism, min agency
    if (state.emergencyMode) {
      determinismTarget = 0.95;
      agencyTarget = 0.05;
      adaptabilityTarget = 0.3;
      riskToleranceTarget = 0.1;
      explorationTarget = 0.05;
    }
    // High volatility: increase determinism slightly
    else if (state.marketVolatility > 0.7) {
      determinismTarget = 0.8;
      agencyTarget = 0.2;
      riskToleranceTarget = 0.3;
    }
    // Stable conditions + high confidence: increase agency
    else if (state.marketVolatility < 0.3 && state.confidenceLevel > 0.8) {
      determinismTarget = 0.5;
      agencyTarget = 0.5;
      adaptabilityTarget = 0.7;
      riskToleranceTarget = 0.6;
      explorationTarget = 0.4;
    }
    // Learning phase: balanced approach with higher adaptability
    else if (state.learningProgress < 0.5) {
      determinismTarget = 0.6;
      agencyTarget = 0.4;
      adaptabilityTarget = 0.8;
      explorationTarget = 0.3;
    }
    // High consecutive successes: gradually increase agency
    else if (state.consecutiveSuccesses > 5) {
      determinismTarget = Math.max(0.4, 0.7 - (state.consecutiveSuccesses * 0.05));
      agencyTarget = Math.min(0.6, 0.3 + (state.consecutiveSuccesses * 0.05));
      explorationTarget = Math.min(0.5, 0.2 + (state.consecutiveSuccesses * 0.02));
    }
    // Recent failures: increase determinism
    else if (state.consecutiveFailures > 2) {
      determinismTarget = Math.min(0.9, 0.7 + (state.consecutiveFailures * 0.1));
      agencyTarget = Math.max(0.1, 0.3 - (state.consecutiveFailures * 0.05));
      riskToleranceTarget = Math.max(0.2, 0.4 - (state.consecutiveFailures * 0.05));
    }

    // Store target balance
    this.currentBalance = {
      determinism: determinismTarget,
      agency: agencyTarget,
      adaptability: adaptabilityTarget,
      riskTolerance: riskToleranceTarget,
      explorationRatio: explorationTarget
    };
  }

  private adaptBehavior(): void {
    const now = Date.now();
    
    // Prevent too frequent major adaptations
    if (now - this.lastAdaptation < this.adaptationCooldown) {
      return;
    }

    const balance = this.currentBalance;
    
    // Log significant balance changes
    if (this.balanceHistory.length > 0) {
      const lastBalance = this.balanceHistory[this.balanceHistory.length - 1].balance;
      const determinismChange = Math.abs(balance.determinism - lastBalance.determinism);
      const agencyChange = Math.abs(balance.agency - lastBalance.agency);
      
      if (determinismChange > 0.1 || agencyChange > 0.1) {
        console.log('🎯 BEHAVIOR BALANCE ADAPTATION:');
        console.log(`   Determinism: ${(lastBalance.determinism * 100).toFixed(1)}% → ${(balance.determinism * 100).toFixed(1)}%`);
        console.log(`   Agency: ${(lastBalance.agency * 100).toFixed(1)}% → ${(balance.agency * 100).toFixed(1)}%`);
        console.log(`   Risk Tolerance: ${(balance.riskTolerance * 100).toFixed(1)}%`);
        console.log(`   Exploration: ${(balance.explorationRatio * 100).toFixed(1)}%`);
        
        this.lastAdaptation = now;
      }
    }
  }

  private analyzePerformancePatterns(): void {
    if (this.balanceHistory.length < 5) return;

    const recentHistory = this.balanceHistory.slice(-10);
    const successRate = recentHistory.filter(h => h.outcome === 'success').length / recentHistory.length;
    
    console.log('📊 PERFORMANCE PATTERN ANALYSIS:');
    console.log(`   Recent success rate: ${(successRate * 100).toFixed(1)}%`);
    console.log(`   Confidence level: ${(this.contextualState.confidenceLevel * 100).toFixed(1)}%`);
    console.log(`   Current balance: ${(this.currentBalance.determinism * 100).toFixed(1)}% deterministic, ${(this.currentBalance.agency * 100).toFixed(1)}% agentic`);
  }

  private optimizeBalanceStrategy(): void {
    // Machine learning-style optimization of balance strategy
    const recentOutcomes = this.balanceHistory.slice(-20);
    
    if (recentOutcomes.length >= 10) {
      // Analyze which balance configurations performed best
      const highDeterminismOutcomes = recentOutcomes.filter(h => h.balance.determinism > 0.7);
      const highAgencyOutcomes = recentOutcomes.filter(h => h.balance.agency > 0.5);
      
      const determinismSuccessRate = highDeterminismOutcomes.filter(h => h.outcome === 'success').length / 
                                   Math.max(1, highDeterminismOutcomes.length);
      const agencySuccessRate = highAgencyOutcomes.filter(h => h.outcome === 'success').length / 
                               Math.max(1, highAgencyOutcomes.length);
      
      console.log('🧠 STRATEGY OPTIMIZATION:');
      console.log(`   High determinism success rate: ${(determinismSuccessRate * 100).toFixed(1)}%`);
      console.log(`   High agency success rate: ${(agencySuccessRate * 100).toFixed(1)}%`);
    }
  }

  // Public methods for other systems to use

  getDecisionGuidance(context: DecisionContext): {
    approach: 'deterministic' | 'balanced' | 'agentic';
    confidence: number;
    riskProfile: 'conservative' | 'moderate' | 'aggressive';
    explorationAllowed: boolean;
  } {
    const balance = this.currentBalance;
    
    // Adjust for specific context
    let adjustedDeterminism = balance.determinism;
    let adjustedAgency = balance.agency;
    
    if (context.urgency === 'critical' || context.stakes === 'high') {
      adjustedDeterminism += 0.2;
      adjustedAgency -= 0.2;
    } else if (context.scenario === 'opportunity_scanning' && balance.explorationRatio > 0.3) {
      adjustedAgency += 0.1;
    }
    
    // Normalize
    const total = adjustedDeterminism + adjustedAgency;
    adjustedDeterminism /= total;
    adjustedAgency /= total;
    
    let approach: 'deterministic' | 'balanced' | 'agentic';
    if (adjustedDeterminism > 0.7) approach = 'deterministic';
    else if (adjustedAgency > 0.6) approach = 'agentic';
    else approach = 'balanced';
    
    let riskProfile: 'conservative' | 'moderate' | 'aggressive';
    if (balance.riskTolerance < 0.3) riskProfile = 'conservative';
    else if (balance.riskTolerance > 0.7) riskProfile = 'aggressive';
    else riskProfile = 'moderate';
    
    return {
      approach,
      confidence: this.contextualState.confidenceLevel,
      riskProfile,
      explorationAllowed: balance.explorationRatio > 0.25
    };
  }

  recordOutcome(outcome: 'success' | 'failure' | 'neutral'): void {
    this.balanceHistory.push({
      timestamp: new Date(),
      balance: { ...this.currentBalance },
      outcome
    });
    
    // Update consecutive counters
    if (outcome === 'success') {
      this.contextualState.consecutiveSuccesses++;
      this.contextualState.consecutiveFailures = 0;
    } else if (outcome === 'failure') {
      this.contextualState.consecutiveFailures++;
      this.contextualState.consecutiveSuccesses = 0;
    }
    
    // Trim history to prevent memory bloat
    if (this.balanceHistory.length > 100) {
      this.balanceHistory = this.balanceHistory.slice(-50);
    }
  }

  triggerEmergencyMode(reason: string): void {
    console.log(`🚨 EMERGENCY MODE ACTIVATED: ${reason}`);
    console.log('   Switching to maximum deterministic behavior');
    
    this.contextualState.emergencyMode = true;
    this.contextualState.consecutiveFailures += 3; // Heavy penalty
    
    setTimeout(() => {
      this.contextualState.emergencyMode = false;
      console.log('✅ Emergency mode deactivated - resuming adaptive behavior');
    }, 300000); // 5 minutes
  }

  getCurrentBalance(): BehaviorBalance & { contextualState: ContextualState } {
    return {
      ...this.currentBalance,
      contextualState: { ...this.contextualState }
    };
  }

  getOrchestrationStatus(): {
    currentApproach: string;
    confidence: number;
    adaptability: number;
    recentPerformance: string;
    nextOptimization: string;
  } {
    const balance = this.currentBalance;
    const state = this.contextualState;
    
    let currentApproach = 'Balanced';
    if (balance.determinism > 0.7) currentApproach = 'Deterministic';
    else if (balance.agency > 0.6) currentApproach = 'Agentic';
    
    let recentPerformance = 'Stable';
    if (state.consecutiveSuccesses > 3) recentPerformance = 'Strong';
    else if (state.consecutiveFailures > 2) recentPerformance = 'Concerning';
    
    return {
      currentApproach,
      confidence: state.confidenceLevel,
      adaptability: balance.adaptability,
      recentPerformance,
      nextOptimization: new Date(Date.now() + 60000).toISOString()
    };
  }
}

export const determinismAgenticOrchestrator = new DeterminismAgenticOrchestrator();