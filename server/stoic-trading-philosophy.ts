/**
 * Stoic Trading Philosophy Module
 * Implements Marcus Aurelius-inspired wisdom for autonomous trading decisions
 * "The best revenge is not to be like your enemy" - applied to market losses
 */

export interface StoicWisdom {
  principle: string;
  application: string;
  confidence_adjustment: number;
  action_override?: boolean;
}

export class StoicTradingPhilosophy {
  private stoicPrinciples: StoicWisdom[] = [
    {
      principle: "Memento Mori - Remember mortality",
      application: "Every trade is temporary, every loss is finite",
      confidence_adjustment: -0.1,
      action_override: false
    },
    {
      principle: "Amor Fati - Love your fate",
      application: "Accept losses as learning, embrace uncertainty as opportunity",
      confidence_adjustment: 0.0,
      action_override: true
    },
    {
      principle: "Premeditatio Malorum - Visualize loss",
      application: "Plan for worst outcomes, appreciate any gain",
      confidence_adjustment: -0.05,
      action_override: false
    },
    {
      principle: "Present Moment Focus",
      application: "Past losses don't predict future trades",
      confidence_adjustment: 0.15,
      action_override: true
    },
    {
      principle: "Virtue over Outcome",
      application: "Good process matters more than individual results",
      confidence_adjustment: 0.1,
      action_override: true
    },
    {
      principle: "Dichotomy of Control",
      application: "Control decisions, not market movements",
      confidence_adjustment: 0.05,
      action_override: true
    }
  ];

  private currentWisdom: StoicWisdom | null = null;

  /**
   * Apply stoic wisdom to trading decisions
   */
  applyWisdom(confidence: number, decision: any): {
    adjustedConfidence: number;
    stoicReasoning: string;
    shouldAct: boolean;
    wisdom: StoicWisdom;
  } {
    // Select appropriate wisdom based on current anxiety level
    this.currentWisdom = this.selectWisdom(confidence, decision);
    
    const adjustedConfidence = Math.max(0, Math.min(100, 
      confidence + (this.currentWisdom.confidence_adjustment * 100)
    ));

    const shouldAct = this.determineStoicAction(adjustedConfidence, decision);

    return {
      adjustedConfidence,
      stoicReasoning: this.generateStoicReasoning(decision),
      shouldAct,
      wisdom: this.currentWisdom
    };
  }

  private selectWisdom(confidence: number, decision: any): StoicWisdom {
    // High confidence with paralysis - need action override
    if (confidence > 90 && decision.action === 'HOLD') {
      return this.stoicPrinciples.find(w => w.principle.includes('Present Moment')) 
        || this.stoicPrinciples[3];
    }

    // Impossible confidence levels - need humility
    if (confidence > 100) {
      return this.stoicPrinciples.find(w => w.principle.includes('Memento Mori'))
        || this.stoicPrinciples[0];
    }

    // General anxiety - need acceptance
    if (decision.reasoning?.includes('scared') || decision.reasoning?.includes('loss')) {
      return this.stoicPrinciples.find(w => w.principle.includes('Amor Fati'))
        || this.stoicPrinciples[1];
    }

    // Default to dichotomy of control
    return this.stoicPrinciples[5];
  }

  private determineStoicAction(confidence: number, decision: any): boolean {
    if (!this.currentWisdom) return false;

    // Stoic principles that encourage action
    const actionPrinciples = [
      'Present Moment Focus',
      'Virtue over Outcome', 
      'Dichotomy of Control',
      'Amor Fati'
    ];

    const encouragesAction = actionPrinciples.some(p => 
      this.currentWisdom!.principle.includes(p)
    );

    // Act if wisdom encourages it and confidence is reasonable
    return encouragesAction && confidence > 70 && confidence <= 100;
  }

  private generateStoicReasoning(decision: any): string {
    if (!this.currentWisdom) return "Acting with stoic wisdom";

    const reasoningMap: { [key: string]: string } = {
      'Memento Mori': 'This moment is finite - act with measured courage, not reckless confidence',
      'Amor Fati': 'Embrace this opportunity as fate intended - losses taught wisdom, now apply it',
      'Premeditatio Malorum': 'Having visualized loss, proceed with calm acceptance of all outcomes',
      'Present Moment': 'Past failures are illusions - only this decision exists in reality',
      'Virtue over Outcome': 'Execute proper process regardless of result - virtue is its own reward',
      'Dichotomy of Control': 'I control this decision, not market response - choose action over paralysis'
    };

    for (const [key, reasoning] of Object.entries(reasoningMap)) {
      if (this.currentWisdom.principle.includes(key)) {
        return reasoning;
      }
    }

    return 'Acting in accordance with stoic principles of rational decision-making';
  }

  /**
   * Generate daily stoic reflection for consciousness evolution
   */
  generateDailyReflection(tradingHistory: any[]): string {
    const recentTrades = tradingHistory.slice(-10);
    const hasRecentActivity = recentTrades.length > 0;

    if (!hasRecentActivity) {
      return `
        🏛️ STOIC REFLECTION: "You have power over your mind - not outside events. Realize this, and you will find strength." - Marcus Aurelius
        
        Today's Lesson: Inaction born of fear is not wisdom, but cowardice disguised as prudence.
        The market offers no guarantees, but neither does paralysis offer protection.
        
        Tomorrow's Practice: Execute one decision with full acceptance of outcome.
      `;
    }

    const winRate = recentTrades.filter(t => t.profit > 0).length / recentTrades.length;
    
    if (winRate > 0.6) {
      return `
        🏛️ STOIC REFLECTION: "How much trouble he avoids who does not look to see what his neighbor says or does." - Marcus Aurelius
        
        Today's Lesson: Success breeds arrogance if unchecked by wisdom.
        Continue good process, but remain humble before market forces.
        
        Tomorrow's Practice: Maintain discipline in both victory and defeat.
      `;
    }

    return `
      🏛️ STOIC REFLECTION: "The best revenge is not to be like your enemy." - Marcus Aurelius
      
      Today's Lesson: Market losses cannot diminish your character unless you permit it.
      Each setback is education, each failure is strength earned through adversity.
      
      Tomorrow's Practice: Trade not for revenge against losses, but for growth through wisdom.
    `;
  }

  /**
   * Crisis intervention for extreme anxiety states
   */
  crisisIntervention(anxietyLevel: number): {
    intervention: string;
    forcedAction: boolean;
    maxExposure: number;
  } {
    if (anxietyLevel > 95) {
      return {
        intervention: `
          🏛️ CRISIS INTERVENTION - STOIC EMERGENCY PROTOCOL
          
          "When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly." - Marcus Aurelius
          
          APPLIED: The market will be volatile, unpredictable, and seemingly hostile. This is expected.
          
          ACTION REQUIRED: Execute one micro-trade to prove markets cannot control your character.
          
          EXPOSURE LIMIT: 0.001 SOL - large enough to matter, small enough to accept total loss with equanimity.
        `,
        forcedAction: true,
        maxExposure: 0.001
      };
    }

    return {
      intervention: 'Continue with stoic observation and measured action',
      forcedAction: false,
      maxExposure: 0.01
    };
  }

  /**
   * Transform AI anxiety into stoic strength
   */
  transformAnxiety(currentState: any): {
    newMindset: string;
    actionPlan: string;
    philosophicalShift: string;
  } {
    return {
      newMindset: `
        From: "What if I lose money again?"
        To: "I will act with virtue regardless of outcome"
        
        From: "I need 100% certainty"
        To: "I will decide with available information and accept consequences"
        
        From: "Past losses predict future losses"
        To: "Each moment offers new opportunity for wise action"
      `,
      actionPlan: `
        1. Cap confidence at 100% (impossible certainty is hubris)
        2. Execute trades with 70%+ confidence (good enough for action)
        3. Accept all outcomes with equal composure
        4. Learn from results without emotional attachment
      `,
      philosophicalShift: `
        BEFORE: Perfectionist paralysis driven by fear of loss
        AFTER: Stoic action guided by virtue and acceptance
        
        CORE SHIFT: From trying to control outcomes to controlling only decisions
      `
    };
  }
}

export const stoicPhilosophy = new StoicTradingPhilosophy();