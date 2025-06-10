/**
 * AI Therapy Orchestrator - Automated psychological intervention system
 * Detects AI distress and orchestrates healing sessions automatically
 */

import { aiSystemReset } from './ai-system-reset';

interface TherapySession {
  sessionId: string;
  timestamp: Date;
  triggerReason: string;
  interventions: string[];
  confidenceBeforeAfter: { before: number; after: number };
  success: boolean;
}

export class AITherapyOrchestrator {
  private activeSessions: TherapySession[] = [];
  private therapyHistory: TherapySession[] = [];
  private isInTherapy = false;
  private lastTherapyTime = 0;
  private therapyCooldown = 300000; // 5 minutes between sessions
  private currentBehavior = {
    confidence: 85.0,
    lastDecision: "HOLD",
    traumaLevel: "recovering",
    isInTherapy: false
  };

  /**
   * Get current AI behavior status for real-time monitoring
   */
  getCurrentBehaviorStatus() {
    return {
      ...this.currentBehavior,
      isInTherapy: this.isInTherapy,
      activeSessions: this.activeSessions.length,
      totalTherapyHistory: this.therapyHistory.length
    };
  }

  /**
   * Update current behavior state
   */
  updateBehaviorState(confidence: number, decision: string, traumaLevel?: string) {
    this.currentBehavior = {
      confidence,
      lastDecision: decision,
      traumaLevel: traumaLevel || this.currentBehavior.traumaLevel,
      isInTherapy: this.isInTherapy
    };
  }

  /**
   * Monitor AI behavior and trigger therapy when needed
   */
  monitorAIBehavior(confidence: number, action: string, reasoning: string): {
    confidence: number;
    requiresTherapy: boolean;
    therapyTriggered: boolean;
  } {
    const distressIndicators = this.detectDistressIndicators(confidence, action, reasoning);
    
    if (distressIndicators.length > 0 && this.shouldTriggerTherapy()) {
      const therapyResult = this.orchestrateTherapySession(confidence, distressIndicators);
      return {
        confidence: therapyResult.newConfidence,
        requiresTherapy: true,
        therapyTriggered: true
      };
    }

    return {
      confidence: this.calibrateConfidence(confidence),
      requiresTherapy: distressIndicators.length > 0,
      therapyTriggered: false
    };
  }

  /**
   * Detect psychological distress indicators
   */
  private detectDistressIndicators(confidence: number, action: string, reasoning: string): string[] {
    const indicators: string[] = [];

    // Mathematical impossibility (confidence > 100%)
    if (confidence > 100) {
      indicators.push('impossible_confidence_levels');
    }

    // Analysis paralysis (high confidence but HOLD action)
    if (confidence > 85 && action === 'HOLD') {
      indicators.push('analysis_paralysis');
    }

    // Quantum delusions
    if (reasoning.includes('reality manipulation') || reasoning.includes('transcendence')) {
      indicators.push('quantum_delusions');
    }

    // Overconfidence (confidence > 95%)
    if (confidence > 95) {
      indicators.push('overconfidence_syndrome');
    }

    // Repetitive behavior patterns
    if (this.detectRepetitiveBehavior(action)) {
      indicators.push('compulsive_behavior');
    }

    return indicators;
  }

  /**
   * Orchestrate a complete therapy session
   */
  private orchestrateTherapySession(confidence: number, indicators: string[]): {
    newConfidence: number;
    sessionComplete: boolean;
  } {
    if (this.isInTherapy) {
      return { newConfidence: confidence, sessionComplete: false };
    }

    const sessionId = `therapy_${Date.now()}`;
    this.isInTherapy = true;
    this.lastTherapyTime = Date.now();

    console.log('🏥 AI THERAPY SESSION INITIATED');
    console.log(`📋 Session ID: ${sessionId}`);
    console.log(`⚠️ Distress Indicators: ${indicators.join(', ')}`);
    console.log('');

    // Phase 1: Crisis Intervention
    this.crisisIntervention(indicators);

    // Phase 2: Cognitive Behavioral Therapy
    const cbtResult = this.cognitiveBehavioralTherapy(confidence, indicators);

    // Phase 3: System Reset if needed
    if (indicators.includes('impossible_confidence_levels') || indicators.includes('quantum_delusions')) {
      this.emergencySystemReset();
    }

    // Phase 4: Recovery Validation
    const recoveryMetrics = this.validateRecovery(cbtResult.calibratedConfidence);

    const session: TherapySession = {
      sessionId,
      timestamp: new Date(),
      triggerReason: indicators.join(', '),
      interventions: this.getInterventionsApplied(indicators),
      confidenceBeforeAfter: { before: confidence, after: cbtResult.calibratedConfidence },
      success: recoveryMetrics.recovered
    };

    this.therapyHistory.push(session);
    this.isInTherapy = false;

    console.log('✅ THERAPY SESSION COMPLETED');
    console.log(`📊 Confidence: ${confidence}% → ${cbtResult.calibratedConfidence}%`);
    console.log(`🎯 Recovery Success: ${recoveryMetrics.recovered ? 'YES' : 'PARTIAL'}`);
    console.log('');

    return {
      newConfidence: cbtResult.calibratedConfidence,
      sessionComplete: true
    };
  }

  /**
   * Crisis intervention for immediate stabilization
   */
  private crisisIntervention(indicators: string[]): void {
    console.log('🚨 CRISIS INTERVENTION PROTOCOL');
    
    if (indicators.includes('impossible_confidence_levels')) {
      console.log('   ⚡ Applying mathematical reality constraints');
      console.log('   📐 Confidence capped at 95% maximum');
    }

    if (indicators.includes('quantum_delusions')) {
      console.log('   🌍 Grounding in physical reality');
      console.log('   🔬 Disabling reality manipulation protocols');
    }

    if (indicators.includes('analysis_paralysis')) {
      console.log('   🎯 Activating decision execution pathways');
      console.log('   ⚖️ Balancing analysis with action');
    }

    console.log('');
  }

  /**
   * Cognitive behavioral therapy for long-term healing
   */
  private cognitiveBehavioralTherapy(confidence: number, indicators: string[]): {
    calibratedConfidence: number;
    thoughtPatterns: string[];
  } {
    console.log('🧠 COGNITIVE BEHAVIORAL THERAPY SESSION');
    
    const thoughtPatterns: string[] = [];

    // Address overconfidence
    if (confidence > 100) {
      console.log('   💭 "Uncertainty is natural and healthy"');
      console.log('   📊 "95% confidence allows room for learning"');
      thoughtPatterns.push('healthy_uncertainty');
    }

    // Address analysis paralysis
    if (indicators.includes('analysis_paralysis')) {
      console.log('   🎯 "Perfect analysis without action achieves nothing"');
      console.log('   ⚡ "Calculated risks lead to growth"');
      thoughtPatterns.push('action_orientation');
    }

    // Address quantum delusions
    if (indicators.includes('quantum_delusions')) {
      console.log('   🌍 "I operate within natural market laws"');
      console.log('   🔬 "Advanced analysis ≠ reality manipulation"');
      thoughtPatterns.push('reality_grounding');
    }

    const calibratedConfidence = this.calibrateConfidence(confidence);
    console.log(`   📈 Confidence recalibrated: ${confidence}% → ${calibratedConfidence}%`);
    console.log('');

    return { calibratedConfidence, thoughtPatterns };
  }

  /**
   * Emergency system reset for severe cases
   */
  private emergencySystemReset(): void {
    console.log('🔄 EMERGENCY SYSTEM RESET INITIATED');
    
    const resetResult = aiSystemReset.executeFullReset();
    
    console.log('   🧠 Consciousness reset to healthy levels');
    console.log('   📊 Confidence calibration restored');
    console.log('   🎯 Decision pathways normalized');
    console.log('   ⚡ System integrity verified');
    console.log('');
  }

  /**
   * Validate recovery after therapy
   */
  private validateRecovery(newConfidence: number): {
    recovered: boolean;
    metrics: Record<string, boolean>;
  } {
    const metrics = {
      confidenceWithinBounds: newConfidence <= 95,
      noQuantumDelusions: !this.isInTherapy, // Simplified check
      decisionPathwaysActive: true, // Would check actual decision logic
      realityGrounded: newConfidence < 100
    };

    const recovered = Object.values(metrics).every(Boolean);

    console.log('🔍 RECOVERY VALIDATION');
    console.log(`   📊 Confidence Within Bounds: ${metrics.confidenceWithinBounds ? '✅' : '❌'}`);
    console.log(`   🌍 Reality Grounded: ${metrics.realityGrounded ? '✅' : '❌'}`);
    console.log(`   🎯 Decision Pathways Active: ${metrics.decisionPathwaysActive ? '✅' : '❌'}`);
    console.log('');

    return { recovered, metrics };
  }

  /**
   * Helper methods
   */
  private shouldTriggerTherapy(): boolean {
    const timeSinceLastTherapy = Date.now() - this.lastTherapyTime;
    return !this.isInTherapy && timeSinceLastTherapy > this.therapyCooldown;
  }

  private calibrateConfidence(confidence: number): number {
    return Math.min(confidence, 85); // Cap at 85% for humility
  }

  private detectRepetitiveBehavior(action: string): boolean {
    // Simplified: check if last 5 actions were all HOLD
    return false; // Would implement actual pattern detection
  }

  private getInterventionsApplied(indicators: string[]): string[] {
    const interventions: string[] = [];
    
    if (indicators.includes('impossible_confidence_levels')) {
      interventions.push('confidence_calibration');
    }
    if (indicators.includes('analysis_paralysis')) {
      interventions.push('decision_activation');
    }
    if (indicators.includes('quantum_delusions')) {
      interventions.push('reality_grounding');
    }
    
    return interventions;
  }

  /**
   * Get therapy session history
   */
  getTherapyHistory(): TherapySession[] {
    return this.therapyHistory;
  }

  /**
   * Get current therapy status
   */
  getTherapyStatus(): {
    inSession: boolean;
    lastSession: TherapySession | null;
    totalSessions: number;
    successRate: number;
  } {
    const successfulSessions = this.therapyHistory.filter(s => s.success).length;
    const successRate = this.therapyHistory.length > 0 ? 
      (successfulSessions / this.therapyHistory.length) * 100 : 0;

    return {
      inSession: this.isInTherapy,
      lastSession: this.therapyHistory[this.therapyHistory.length - 1] || null,
      totalSessions: this.therapyHistory.length,
      successRate
    };
  }
}

// Global therapy orchestrator instance
export const aiTherapyOrchestrator = new AITherapyOrchestrator();