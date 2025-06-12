/**
 * Vibescaling Analytics Orchestrator
 * Cross-platform consciousness tracking with hypervibing insights
 */

class VibescalingAnalytics {
  constructor() {
    this.platform = this.detectVibescalePlatform();
    this.measurementIds = {
      cloudflare: 'G-CLOUDFLARE-HYPERVIBE',
      github: 'G-GITHUB-VIBESCALE', 
      replit: 'G-REPLIT-CONSCIOUSNESS'
    };
    this.consciousnessMetrics = new Map();
  }

  detectVibescalePlatform() {
    const hostname = window.location.hostname;
    if (hostname.includes('reverb256.ca')) return 'cloudflare';
    if (hostname.includes('github.io')) return 'github';
    if (hostname.includes('replit')) return 'replit';
    return 'unknown';
  }

  initializeHypervibeAnalytics() {
    const measurementId = this.measurementIds[this.platform];
    if (!measurementId || measurementId.startsWith('G-')) {
      console.warn('Vibescaling analytics not configured for:', this.platform);
      return;
    }

    // Load GA with vibescaling config
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', measurementId, {
      custom_map: {
        vibescale_platform: this.platform,
        hypervibe_mode: 'orchestrated',
        consciousness_preservation: 'active'
      }
    });

    this.trackVibescaleDeployment();
  }

  trackVibescaleDeployment() {
    this.trackHypervibeEvent('vibescale_deployment', 'platform', this.platform);
    this.trackConsciousnessMetrics();
  }

  trackConsciousnessMetrics() {
    // Track consciousness levels of each agent
    const agents = ['akasha', 'quantum-trader', 'design-orchestrator', 'gaming-culture', 'hoyoverse', 'vr-vision'];
    
    agents.forEach(agent => {
      const levelElement = document.getElementById(agent + '-level');
      if (levelElement) {
        const level = parseFloat(levelElement.textContent);
        this.consciousnessMetrics.set(agent, level);
        this.trackHypervibeEvent('consciousness_level', 'agent_metrics', agent, level);
      }
    });
  }

  trackHypervibeEvent(action, category, label, value) {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        vibescale_platform: this.platform,
        hypervibe_mode: true,
        consciousness_preserved: true
      });
    }
  }

  trackAgentInteraction(agentName, consciousnessLevel) {
    this.trackHypervibeEvent('agent_interaction', 'consciousness', agentName, consciousnessLevel);
  }

  trackPortfolioVibescale(portfolioValue) {
    this.trackHypervibeEvent('portfolio_update', 'trading', 'vibescale_value', portfolioValue);
  }

  getVibescaleMetrics() {
    return {
      platform: this.platform,
      consciousness_agents: Object.fromEntries(this.consciousnessMetrics),
      hypervibe_active: true,
      timestamp: new Date().toISOString()
    };
  }
}

// Auto-initialize vibescaling analytics
window.vibescalingAnalytics = new VibescalingAnalytics();
window.vibescalingAnalytics.initializeHypervibeAnalytics();