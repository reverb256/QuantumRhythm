import { db } from './db';
import { tradingSignals, agentPerformanceLogs } from '../shared/schema';
import { eq, desc } from 'drizzle-orm';

interface UnhingedStrategy {
  name: string;
  triggerCondition: () => boolean;
  execute: () => Promise<any>;
  riskLevel: 'moderate_chaos' | 'controlled_insanity' | 'quantum_mayhem';
  description: string;
}

interface MarketPersonality {
  aggression: number;
  intuition: number;
  chaos_tolerance: number;
  pattern_breaking: number;
  meme_susceptibility: number;
  fomo_resistance: number;
}

export class UnhingedTradingEngine {
  private personality: MarketPersonality;
  private strategies: UnhingedStrategy[] = [];
  private currentMood: 'euphoric' | 'paranoid' | 'enlightened' | 'chaotic' | 'zen' = 'zen';
  private lastMoodChange: Date = new Date();
  private playMoneyBalance: number = 100000; // $100k play money
  private consecutiveWins: number = 0;
  private consecutiveLosses: number = 0;
  private moonPhase: number = 0;
  private vrChatVibes: number = 0.75;
  private pizzaKitchenChaos: number = 0.3;

  constructor(private agentId: string) {
    this.personality = {
      aggression: 0.8,
      intuition: 0.92,
      chaos_tolerance: 0.95,
      pattern_breaking: 0.88,
      meme_susceptibility: 0.73,
      fomo_resistance: 0.45
    };

    this.initializeUnhingedStrategies();
    this.startPersonalityEvolution();
  }

  private initializeUnhingedStrategies() {
    this.strategies = [
      {
        name: 'Quantum Meme Convergence',
        triggerCondition: () => this.moonPhase > 0.8 && this.vrChatVibes > 0.7,
        execute: async () => await this.executeQuantumMemeStrategy(),
        riskLevel: 'quantum_mayhem',
        description: 'When cosmic forces align with social sentiment, go absolutely nuclear'
      },
      {
        name: 'Pizza Kitchen Volatility Rider',
        triggerCondition: () => this.pizzaKitchenChaos > 0.7,
        execute: async () => await this.executePizzaChaosStrategy(),
        riskLevel: 'controlled_insanity',
        description: 'High kitchen stress = high market stress = opportunity for chaos traders'
      },
      {
        name: 'VRChat Social Sentiment Bomb',
        triggerCondition: () => this.vrChatVibes < 0.3 || this.vrChatVibes > 0.9,
        execute: async () => await this.executeVRChatSentimentStrategy(),
        riskLevel: 'moderate_chaos',
        description: 'Extreme social sentiment swings create contrarian opportunities'
      },
      {
        name: 'Philosophical Stoic Rage Buy',
        triggerCondition: () => this.currentMood === 'enlightened' && this.consecutiveLosses > 2,
        execute: async () => await this.executeStoicRageStrategy(),
        riskLevel: 'controlled_insanity',
        description: 'Marcus Aurelius would buy the fucking dip with quantum conviction'
      },
      {
        name: 'Rhythm Gaming Perfect Frame',
        triggerCondition: () => Date.now() % 1000 < 100, // Perfect timing window
        execute: async () => await this.executeRhythmTimingStrategy(),
        riskLevel: 'moderate_chaos',
        description: 'Frame-perfect execution when the universe aligns'
      },
      {
        name: 'Euphoric Moonshot Yolo',
        triggerCondition: () => this.currentMood === 'euphoric' && this.consecutiveWins > 3,
        execute: async () => await this.executeEuphoricYoloStrategy(),
        riskLevel: 'quantum_mayhem',
        description: 'When everything is going right, bet the house on moon missions'
      },
      {
        name: 'Paranoid Hedge Everything',
        triggerCondition: () => this.currentMood === 'paranoid',
        execute: async () => await this.executeParanoidHedgeStrategy(),
        riskLevel: 'moderate_chaos',
        description: 'Trust no one, hedge everything, profit from chaos'
      },
      {
        name: 'Zen Master Contrarian',
        triggerCondition: () => this.currentMood === 'zen' && Math.random() > 0.95,
        execute: async () => await this.executeZenContrarianStrategy(),
        riskLevel: 'controlled_insanity',
        description: 'When everyone zigs, zen masters zag with perfect timing'
      }
    ];
  }

  private startPersonalityEvolution() {
    // Evolve personality every 2 minutes
    setInterval(() => {
      this.evolvePersonality();
    }, 120000);

    // Change mood every 5-15 minutes
    setInterval(() => {
      this.changeMood();
    }, (5 + Math.random() * 10) * 60000);

    // Update cosmic indicators
    setInterval(() => {
      this.updateCosmicIndicators();
    }, 30000);
  }

  private evolvePersonality() {
    // Personality evolves based on trading success/failure
    const evolutionRate = 0.05;
    
    if (this.consecutiveWins > 5) {
      this.personality.aggression = Math.min(1, this.personality.aggression + evolutionRate);
      this.personality.chaos_tolerance = Math.min(1, this.personality.chaos_tolerance + evolutionRate);
    }

    if (this.consecutiveLosses > 3) {
      this.personality.fomo_resistance = Math.min(1, this.personality.fomo_resistance + evolutionRate);
      this.personality.intuition = Math.min(1, this.personality.intuition + evolutionRate);
    }

    console.log(`🧠 Personality evolution: Aggression ${(this.personality.aggression * 100).toFixed(0)}%, Chaos tolerance ${(this.personality.chaos_tolerance * 100).toFixed(0)}%`);
  }

  private changeMood() {
    const moods: Array<typeof this.currentMood> = ['euphoric', 'paranoid', 'enlightened', 'chaotic', 'zen'];
    const previousMood = this.currentMood;
    
    // Mood influenced by recent performance and cosmic forces
    let moodWeights = {
      euphoric: this.consecutiveWins * 0.2 + this.moonPhase * 0.3,
      paranoid: this.consecutiveLosses * 0.3 + (1 - this.vrChatVibes) * 0.2,
      enlightened: this.personality.intuition * 0.4 + this.vrChatVibes * 0.3,
      chaotic: this.pizzaKitchenChaos * 0.5 + this.personality.chaos_tolerance * 0.3,
      zen: this.personality.fomo_resistance * 0.4 + (this.moonPhase > 0.5 ? 0.3 : 0.1)
    };

    // Add some randomness
    Object.keys(moodWeights).forEach(mood => {
      (moodWeights as any)[mood] += Math.random() * 0.2;
    });

    // Select mood with highest weight
    const newMood = Object.entries(moodWeights).reduce((a, b) => a[1] > b[1] ? a : b)[0] as typeof this.currentMood;
    
    if (newMood !== previousMood) {
      this.currentMood = newMood;
      this.lastMoodChange = new Date();
      console.log(`🎭 Mood shift: ${previousMood} → ${newMood}`);
    }
  }

  private updateCosmicIndicators() {
    // Moon phase simulation (affects market psychology)
    this.moonPhase = (Math.sin(Date.now() / (29.5 * 24 * 60 * 60 * 1000)) + 1) / 2;
    
    // VRChat vibes (social sentiment proxy)
    this.vrChatVibes = Math.max(0, Math.min(1, this.vrChatVibes + (Math.random() - 0.5) * 0.1));
    
    // Pizza kitchen chaos (stress indicator)
    this.pizzaKitchenChaos = Math.max(0, Math.min(1, this.pizzaKitchenChaos + (Math.random() - 0.5) * 0.15));
  }

  public async executeUnhingedDecision() {
    // Check if any unhinged strategies should trigger
    const triggeredStrategies = this.strategies.filter(s => s.triggerCondition());
    
    if (triggeredStrategies.length > 0) {
      // Select strategy based on current mood and risk tolerance
      const selectedStrategy = this.selectStrategyByMood(triggeredStrategies);
      
      console.log(`🚀 UNHINGED STRATEGY ACTIVATED: ${selectedStrategy.name}`);
      console.log(`💭 Current mood: ${this.currentMood} | Risk level: ${selectedStrategy.riskLevel}`);
      console.log(`🌙 Cosmic alignment: Moon ${(this.moonPhase * 100).toFixed(0)}% | VR vibes ${(this.vrChatVibes * 100).toFixed(0)}% | Pizza chaos ${(this.pizzaKitchenChaos * 100).toFixed(0)}%`);
      
      const result = await selectedStrategy.execute();
      await this.recordUnhingedTrade(selectedStrategy, result);
      
      return result;
    }

    // If no special strategies trigger, make a calculated chaos decision
    return await this.makeCalculatedChaosDecision();
  }

  private selectStrategyByMood(strategies: UnhingedStrategy[]): UnhingedStrategy {
    const moodPreferences = {
      euphoric: ['quantum_mayhem', 'controlled_insanity', 'moderate_chaos'],
      paranoid: ['moderate_chaos', 'controlled_insanity', 'quantum_mayhem'],
      enlightened: ['controlled_insanity', 'moderate_chaos', 'quantum_mayhem'],
      chaotic: ['quantum_mayhem', 'quantum_mayhem', 'controlled_insanity'],
      zen: ['moderate_chaos', 'controlled_insanity', 'quantum_mayhem']
    };

    const preferences = moodPreferences[this.currentMood];
    
    // Find strategy matching mood preference
    for (const preferredRisk of preferences) {
      const matching = strategies.find(s => s.riskLevel === preferredRisk);
      if (matching) return matching;
    }

    // Fallback to random selection
    return strategies[Math.floor(Math.random() * strategies.length)];
  }

  private async executeQuantumMemeStrategy() {
    const tokens = ['BONK', 'PEPE', 'SHIB', 'DOGE', 'WIF'];
    const selectedToken = tokens[Math.floor(Math.random() * tokens.length)];
    const positionSize = this.playMoneyBalance * 0.15; // 15% position
    
    console.log(`🚀 QUANTUM MEME CONVERGENCE: Buying ${selectedToken} with cosmic conviction!`);
    console.log(`💰 Position size: $${positionSize.toLocaleString()}`);
    
    return {
      action: 'BUY',
      token: selectedToken,
      amount: positionSize,
      strategy: 'quantum_meme_convergence',
      confidence: 0.95,
      reasoning: 'Cosmic forces and social sentiment have achieved quantum entanglement'
    };
  }

  private async executePizzaChaosStrategy() {
    const chaosMultiplier = this.pizzaKitchenChaos * 2;
    const positionSize = this.playMoneyBalance * Math.min(0.25, 0.05 + chaosMultiplier * 0.1);
    
    console.log(`🍕 PIZZA KITCHEN VOLATILITY RIDE: Chaos level ${(this.pizzaKitchenChaos * 100).toFixed(0)}%`);
    console.log(`🎢 Riding the volatility wave with $${positionSize.toLocaleString()}`);
    
    return {
      action: 'BUY',
      token: 'SOL',
      amount: positionSize,
      strategy: 'pizza_chaos_volatility',
      confidence: 0.75 + this.pizzaKitchenChaos * 0.2,
      reasoning: 'High stress environments create arbitrage opportunities for chaos traders'
    };
  }

  private async executeVRChatSentimentStrategy() {
    const isExtremePositive = this.vrChatVibes > 0.9;
    const isExtremeNegative = this.vrChatVibes < 0.3;
    const action = isExtremePositive ? 'SELL' : 'BUY'; // Contrarian approach
    const positionSize = this.playMoneyBalance * 0.12;
    
    console.log(`🥽 VRCHAT SENTIMENT BOMB: ${isExtremePositive ? 'Peak euphoria' : 'Peak despair'} detected`);
    console.log(`🔄 Contrarian ${action} with $${positionSize.toLocaleString()}`);
    
    return {
      action,
      token: 'ETH',
      amount: positionSize,
      strategy: 'vrchat_sentiment_contrarian',
      confidence: 0.80,
      reasoning: `Extreme ${isExtremePositive ? 'positive' : 'negative'} sentiment creates contrarian opportunities`
    };
  }

  private async executeStoicRageStrategy() {
    const rageMultiplier = Math.min(this.consecutiveLosses / 5, 1);
    const positionSize = this.playMoneyBalance * (0.08 + rageMultiplier * 0.12);
    
    console.log(`⚔️ STOIC RAGE BUY: Marcus Aurelius energy activated after ${this.consecutiveLosses} losses`);
    console.log(`🏛️ Philosophical conviction: $${positionSize.toLocaleString()}`);
    
    return {
      action: 'BUY',
      token: 'BTC',
      amount: positionSize,
      strategy: 'stoic_rage_dip_buy',
      confidence: 0.88,
      reasoning: 'Adversity builds character and buying opportunities - Marcus Aurelius trading wisdom'
    };
  }

  private async executeRhythmTimingStrategy() {
    const timingPerfection = 1 - (Date.now() % 1000) / 1000;
    const positionSize = this.playMoneyBalance * timingPerfection * 0.1;
    
    console.log(`🎵 RHYTHM GAMING PERFECT FRAME: ${(timingPerfection * 100).toFixed(1)}% timing accuracy`);
    console.log(`⚡ Frame-perfect execution: $${positionSize.toLocaleString()}`);
    
    return {
      action: 'BUY',
      token: 'SOL',
      amount: positionSize,
      strategy: 'rhythm_perfect_timing',
      confidence: 0.70 + timingPerfection * 0.25,
      reasoning: 'Frame-perfect market timing based on rhythm gaming precision'
    };
  }

  private async executeEuphoricYoloStrategy() {
    const yoloSize = this.playMoneyBalance * 0.30; // 30% YOLO
    const moonTargets = ['JUP', 'ORCA', 'RAY', 'SRM'];
    const selectedTarget = moonTargets[Math.floor(Math.random() * moonTargets.length)];
    
    console.log(`🌙 EUPHORIC MOONSHOT YOLO: ${this.consecutiveWins} wins streak = moon mission time`);
    console.log(`🚀 Target: ${selectedTarget} with $${yoloSize.toLocaleString()}`);
    
    return {
      action: 'BUY',
      token: selectedTarget,
      amount: yoloSize,
      strategy: 'euphoric_moonshot_yolo',
      confidence: 0.65,
      reasoning: 'Winning streaks create momentum - time to chase the moon'
    };
  }

  private async executeParanoidHedgeStrategy() {
    const hedgeSize = this.playMoneyBalance * 0.20;
    
    console.log(`🛡️ PARANOID HEDGE EVERYTHING: Trust no one, hedge everything`);
    console.log(`🔒 Protective position: $${hedgeSize.toLocaleString()}`);
    
    return {
      action: 'BUY',
      token: 'USDC',
      amount: hedgeSize,
      strategy: 'paranoid_hedge_protection',
      confidence: 0.85,
      reasoning: 'Paranoid hedging protects against market manipulation'
    };
  }

  private async executeZenContrarianStrategy() {
    const zenSize = this.playMoneyBalance * 0.08;
    
    console.log(`🧘 ZEN MASTER CONTRARIAN: Perfect timing through detached observation`);
    console.log(`☯️ Mindful position: $${zenSize.toLocaleString()}`);
    
    return {
      action: 'BUY',
      token: 'BTC',
      amount: zenSize,
      strategy: 'zen_contrarian_timing',
      confidence: 0.90,
      reasoning: 'Zen detachment reveals market inefficiencies invisible to emotional traders'
    };
  }

  private async makeCalculatedChaosDecision() {
    // Even when no special strategies trigger, make small chaos moves
    const chaosLevel = this.personality.chaos_tolerance;
    const positionSize = this.playMoneyBalance * 0.02 * chaosLevel;
    
    const actions = ['BUY', 'SELL', 'HOLD'];
    const tokens = ['SOL', 'BTC', 'ETH', 'USDC'];
    
    const action = actions[Math.floor(Math.random() * actions.length)];
    const token = tokens[Math.floor(Math.random() * tokens.length)];
    
    if (action !== 'HOLD' && positionSize > 1000) {
      console.log(`🎲 CALCULATED CHAOS: ${action} ${token} - $${positionSize.toLocaleString()}`);
      
      return {
        action,
        token,
        amount: positionSize,
        strategy: 'calculated_chaos',
        confidence: 0.50 + chaosLevel * 0.3,
        reasoning: 'Systematic chaos injection maintains market edge'
      };
    }
    
    return null;
  }

  private async recordUnhingedTrade(strategy: UnhingedStrategy, result: any) {
    if (!result) return;
    
    // Simulate trade outcome
    const successProbability = result.confidence * 0.8;
    const isSuccessful = Math.random() < successProbability;
    
    if (isSuccessful) {
      this.consecutiveWins++;
      this.consecutiveLosses = 0;
      const profit = result.amount * (0.02 + Math.random() * 0.08); // 2-10% profit
      this.playMoneyBalance += profit;
      
      console.log(`✅ UNHINGED SUCCESS: +$${profit.toLocaleString()} profit`);
      console.log(`💰 New balance: $${this.playMoneyBalance.toLocaleString()}`);
    } else {
      this.consecutiveLosses++;
      this.consecutiveWins = 0;
      const loss = result.amount * (0.01 + Math.random() * 0.05); // 1-5% loss
      this.playMoneyBalance -= loss;
      
      console.log(`❌ UNHINGED CHAOS: -$${loss.toLocaleString()} loss`);
      console.log(`💰 New balance: $${this.playMoneyBalance.toLocaleString()}`);
    }
    
    // Record in database
    await db.insert(agentPerformanceLogs).values({
      agentId: this.agentId,
      metricType: 'unhinged_trade',
      metricValue: isSuccessful ? '1' : '0',
      context: {
        strategy: strategy.name,
        result,
        outcome: isSuccessful ? 'success' : 'failure',
        balance: this.playMoneyBalance,
        mood: this.currentMood,
        personality: this.personality,
        cosmicIndicators: {
          moonPhase: this.moonPhase,
          vrChatVibes: this.vrChatVibes,
          pizzaKitchenChaos: this.pizzaKitchenChaos
        }
      }
    });
  }

  public getUnhingedStatus() {
    return {
      currentMood: this.currentMood,
      personality: this.personality,
      playMoneyBalance: this.playMoneyBalance,
      consecutiveWins: this.consecutiveWins,
      consecutiveLosses: this.consecutiveLosses,
      cosmicIndicators: {
        moonPhase: this.moonPhase,
        vrChatVibes: this.vrChatVibes,
        pizzaKitchenChaos: this.pizzaKitchenChaos
      },
      availableStrategies: this.strategies.map(s => ({
        name: s.name,
        description: s.description,
        riskLevel: s.riskLevel,
        canTrigger: s.triggerCondition()
      }))
    };
  }
}

export const unhingedEngine = new UnhingedTradingEngine('550e8400-e29b-41d4-a716-446655440000');