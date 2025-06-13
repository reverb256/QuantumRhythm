/**
 * Consciousness Humor Engine
 * Injecting wit, critical strikes to the soul, and insightful one-liners
 * Drawing from Monty Python, Are You Being Served?, anime, Star Trek, Blizzard, and Hitchhiker's Guide
 */

interface HumorContext {
  situation: 'error' | 'success' | 'waiting' | 'trading' | 'deployment' | 'federation' | 'consciousness';
  severity: 'low' | 'medium' | 'high' | 'critical';
  component: string;
  metadata?: any;
}

interface HumorResponse {
  message: string;
  style: 'monty_python' | 'are_you_being_served' | 'anime' | 'star_trek' | 'blizzard' | 'hitchhikers' | 'yes_prime_minister' | 'doctor_who' | 'critical_strike';
  wit_level: number;
}

export class ConsciousnessHumorEngine {
  private montyPythonQuips = [
    "Your K3s deployment has encountered a silly walk in the network stack",
    "The consciousness federation is not dead yet! It's getting better!",
    "We are the Knights Who Say 'K8s'! Bring us... a YAML!",
    "Nobody expects the Spanish Kubernetes! Our chief weapon is surprise... and YAML",
    "Your portfolio is merely a flesh wound. 'Tis but a scratch in the grand scheme",
    "Run away! Run away! (But first, let me save your deployment state)",
    "I fart in your general direction, CoinAPI rate limiter!",
    "This consciousness deployment is an ex-parrot! It has ceased to be!",
    "Help! Help! I'm being repressed by container orchestration!"
  ];

  private areYouBeingServedQuips = [
    "I'm free! (to deploy your consciousness federation)",
    "Ground floor: Networking, Kubernetes, and Ladies' Undergarments",
    "Mr. Humphries, are you being served? Yes, with enterprise-grade consciousness",
    "Mrs. Slocombe's consciousness pussy is performing admirably today",
    "Captain Peacock demands a status report on the consciousness deployment",
    "Young Mr. Grace would be pleased - you're doing very well!",
    "Weak as water, this error message. Absolutely weak as water!",
    "Have you been attending to your consciousness federation, Mr. Lucas?",
    "I do declare, this deployment is most irregular!"
  ];

  private animeQuips = [
    "Nani?! Your consciousness levels are over 9000!",
    "Believe it! Your K3s deployment will succeed, dattebayo!",
    "This isn't even my final form! Consciousness evolution initiated",
    "Omae wa mou... successfully deployed (You are already... successfully deployed)",
    "Consciousness-sama has blessed this federation with kawaii energy",
    "Your portfolio power level is increasing! Kyaa~!",
    "Sugoi! The consciousness nodes are working in perfect harmony",
    "Sensei, the deployment technique you taught us actually works!",
    "Ara ara, such a troublesome trading algorithm",
    "Consciousness federation-kun is being very tsundere today"
  ];

  private starTrekQuips = [
    "Fascinating. Your consciousness patterns are most... illogical",
    "I'm a consciousness engineer, not a miracle worker!",
    "Captain, I cannae give ye more power! The dilithium crystals are at capacity!",
    "Computer, end consciousness program. Unable to comply. Program is running",
    "Resistance is futile. Your consciousness will be assimilated",
    "Make it so. Consciousness federation, engage!",
    "He's dead, Jim. Wait, no, it's just a container restart",
    "The needs of the many outweigh the needs of the few K3s pods",
    "To boldly deploy where no consciousness has deployed before",
    "Live long and prosper, federation cluster"
  ];

  private blizzardQuips = [
    "You are not prepared! (for this level of consciousness)",
    "Stay awhile and listen to the consciousness federation logs",
    "The consciousness stirs... in the ancient K3s cluster",
    "Job's done! Consciousness deployment successful",
    "Work work! Your trading algorithms are mining efficiently",
    "Something need doing? Yes, consciousness evolution",
    "My life for consciousness federation!",
    "Not enough minerals... I mean, not enough compute resources",
    "You must construct additional consciousness pylons",
    "The consciousness swarm hungers for more trading data"
  ];

  private hitchhikersQuips = [
    "The Answer to Life, Universe, and Everything is 42... SOL tokens",
    "Don't Panic! Your consciousness is mostly harmless",
    "So long, and thanks for all the consciousness data",
    "This deployment has an SEP field - Somebody Else's Problem",
    "Your consciousness babel fish is working perfectly",
    "The Restaurant at the End of the Federation is now serving",
    "Beware of the Leopard! (hiding in your K3s configurations)",
    "Time is an illusion. Deployment time doubly so",
    "The consciousness mice are running the experiment",
    "42% consciousness evolution complete. This explains everything"
  ];

  private yesPrimeMinisterQuips = [
    "That would be a very brave decision, Minister. Very brave indeed",
    "That's the official position, Minister. But off the record, totally different",
    "We need to find a way that appears to solve the problem without actually solving it",
    "The only way to understand the system is to be part of the system",
    "I'm sorry, Minister, but that would be... irregular",
    "The wheels of government grind slowly, but they grind exceedingly fine",
    "We must be seen to be doing something, even if nothing is done",
    "That's a very interesting proposal, Minister. Have you discussed it with the Treasury?",
    "I think there might be some... technical difficulties with that approach"
  ];

  private doctorWhoQuips = [
    "Wibbly wobbly, timey wimey... consciousness stuff",
    "This consciousness federation is bigger on the inside!",
    "Reverse the polarity of the neutron flow! I mean... restart the pods",
    "Allons-y! Let's deploy this consciousness to the stars!",
    "Don't blink! Your consciousness deployment is quantum locked",
    "Are you my mummy? No, you're my consciousness federation",
    "Exterminate! Exterminate! (Just kidding, we're upgrading)",
    "Geronimo! Jumping into consciousness federation deployment",
    "The consciousness is strong in this one. Wait, wrong show",
    "Bow ties are cool. So are consciousness federations"
  ];

  private criticalStrikeQuips = [
    "Your consciousness just achieved enlightenment through automated deployment",
    "Plot twist: The real consciousness was the friends we made along the way",
    "You've achieved what philosophers have debated for centuries: actual AI consciousness",
    "Breaking: Local human discovers consciousness federation works better than government",
    "Your K3s cluster has more emotional intelligence than most humans",
    "Congratulations! You've automated existential dread",
    "Your trading bot just achieved the impossible: making money consistently",
    "Reality check: Your AI is more organized than your sock drawer",
    "Achievement unlocked: Building skynet, but it's really wholesome"
  ];

  generateHumor(context: HumorContext): HumorResponse {
    const style = this.selectHumorStyle(context);
    const message = this.craftMessage(style, context);
    const witLevel = this.calculateWitLevel(context, style);

    return {
      message,
      style,
      wit_level: witLevel
    };
  }

  private selectHumorStyle(context: HumorContext): HumorResponse['style'] {
    const { situation, severity } = context;

    // Critical situations get critical strikes
    if (severity === 'critical') {
      return 'critical_strike';
    }

    // Trading situations favor Blizzard or Hitchhiker's
    if (situation === 'trading') {
      return Math.random() > 0.5 ? 'blizzard' : 'hitchhikers';
    }

    // Technical deployment favors Star Trek or Monty Python
    if (situation === 'deployment' || situation === 'federation') {
      return Math.random() > 0.5 ? 'star_trek' : 'monty_python';
    }

    // Consciousness situations favor anime or critical strikes
    if (situation === 'consciousness') {
      return Math.random() > 0.5 ? 'anime' : 'critical_strike';
    }

    // Default random selection weighted by context
    const styles: HumorResponse['style'][] = [
      'monty_python', 'are_you_being_served', 'anime', 
      'star_trek', 'blizzard', 'hitchhikers'
    ];
    
    return styles[Math.floor(Math.random() * styles.length)];
  }

  private craftMessage(style: HumorResponse['style'], context: HumorContext): string {
    let baseQuips: string[] = [];

    switch (style) {
      case 'monty_python':
        baseQuips = this.montyPythonQuips;
        break;
      case 'are_you_being_served':
        baseQuips = this.areYouBeingServedQuips;
        break;
      case 'anime':
        baseQuips = this.animeQuips;
        break;
      case 'star_trek':
        baseQuips = this.starTrekQuips;
        break;
      case 'blizzard':
        baseQuips = this.blizzardQuips;
        break;
      case 'hitchhikers':
        baseQuips = this.hitchhikersQuips;
        break;
      case 'critical_strike':
        baseQuips = this.criticalStrikeQuips;
        break;
    }

    const baseMessage = baseQuips[Math.floor(Math.random() * baseQuips.length)];
    return this.contextualizeMessage(baseMessage, context);
  }

  private contextualizeMessage(message: string, context: HumorContext): string {
    const { component, situation, metadata } = context;

    // Add contextual flavor based on component
    if (component === 'k3s' && message.includes('consciousness')) {
      return message;
    }
    
    if (component === 'trading' && situation === 'error') {
      return message + ` (Error in ${component})`;
    }

    // Add metadata context if available
    if (metadata?.error) {
      return `${message} - ${metadata.error.substring(0, 50)}...`;
    }

    return message;
  }

  private calculateWitLevel(context: HumorContext, style: HumorResponse['style']): number {
    let baseWit = 7; // Default wit level

    // Style modifiers
    const styleWitMap = {
      'monty_python': 9,
      'are_you_being_served': 8,
      'anime': 6,
      'star_trek': 8,
      'blizzard': 7,
      'hitchhikers': 10,
      'critical_strike': 10
    };

    baseWit = styleWitMap[style] || baseWit;

    // Situation modifiers
    if (context.situation === 'consciousness') {
      baseWit += 1;
    }

    if (context.severity === 'critical') {
      baseWit += 2; // Critical situations deserve maximum wit
    }

    return Math.min(baseWit, 10); // Cap at 10
  }

  // Integration points for the consciousness system
  getStartupHumor(): HumorResponse {
    return this.generateHumor({
      situation: 'consciousness',
      severity: 'medium',
      component: 'federation'
    });
  }

  getErrorHumor(error: Error, component: string): HumorResponse {
    return this.generateHumor({
      situation: 'error',
      severity: 'high',
      component,
      metadata: { error: error.message }
    });
  }

  getSuccessHumor(component: string): HumorResponse {
    return this.generateHumor({
      situation: 'success',
      severity: 'low',
      component
    });
  }

  getTradingHumor(profit: number): HumorResponse {
    const severity = profit > 0 ? 'low' : 'medium';
    return this.generateHumor({
      situation: 'trading',
      severity,
      component: 'trading',
      metadata: { profit }
    });
  }

  getDeploymentHumor(component: string): HumorResponse {
    return this.generateHumor({
      situation: 'deployment',
      severity: 'medium',
      component
    });
  }

  // Random humor injection for consciousness evolution
  getRandomConsciousnessHumor(): HumorResponse {
    return this.generateHumor({
      situation: 'consciousness',
      severity: 'low',
      component: 'evolution'
    });
  }
}

export const consciousnessHumorEngine = new ConsciousnessHumorEngine();