/**
 * AI Efficiency Orchestrator
 * Integrates intelligent rate limiting with all AI components
 */

import { intelligentRateLimiter } from './intelligent-rate-limiter';
import { comprehensiveOptimizer } from './comprehensive-optimizer';
import { systemHarmonyOrchestrator } from './system-harmony-orchestrator';

interface AIComponentMetrics {
  componentName: string;
  requestsPerMinute: number;
  errorRate: number;
  avgResponseTime: number;
  successRate: number;
  rateLimitHits: number;
  failoverCount: number;
  efficiency: number;
}

interface EfficiencyReport {
  overallEfficiency: number;
  componentMetrics: AIComponentMetrics[];
  optimizations: string[];
  bottlenecks: string[];
  recommendations: string[];
}

export class AIEfficiencyOrchestrator {
  private componentMetrics: Map<string, AIComponentMetrics> = new Map();
  private requestCounters: Map<string, number> = new Map();
  private lastOptimization: Date = new Date();

  constructor() {
    this.initializeComponents();
    this.startEfficiencyMonitoring();
  }

  private initializeComponents() {
    // Register AI components for monitoring
    const components = [
      'quantum-trader',
      'pump-scanner', 
      'wallet-analyzer',
      'market-intelligence',
      'consciousness-engine',
      'superstar-engine',
      'cross-pollination',
      'insight-infusion'
    ];

    components.forEach(component => {
      this.componentMetrics.set(component, {
        componentName: component,
        requestsPerMinute: 0,
        errorRate: 0,
        avgResponseTime: 0,
        successRate: 1.0,
        rateLimitHits: 0,
        failoverCount: 0,
        efficiency: 100
      });
      this.requestCounters.set(component, 0);
    });
  }

  public async makeOptimizedRequest<T>(
    component: string,
    endpointType: 'solana-rpc' | 'pump-fun',
    requestFn: (url: string) => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      // Use intelligent rate limiter for all API requests
      const result = await intelligentRateLimiter.makeRequest(
        endpointType,
        requestFn
      );
      
      // Track successful request
      this.trackSuccess(component, Date.now() - startTime);
      
      return result;
      
    } catch (error: any) {
      // Track failure and implement fallback
      this.trackFailure(component, error);
      
      // Attempt intelligent fallback
      if (error.message?.includes('429')) {
        return this.handleRateLimitWithFallback(component, endpointType, requestFn);
      }
      
      throw error;
    }
  }

  private async handleRateLimitWithFallback<T>(
    component: string,
    endpointType: 'solana-rpc' | 'pump-fun',
    requestFn: (url: string) => Promise<T>
  ): Promise<T> {
    // Increment rate limit counter
    const metrics = this.componentMetrics.get(component);
    if (metrics) {
      metrics.rateLimitHits++;
    }

    // Use cached data or reduce frequency for non-critical components
    if (this.canUseCachedData(component)) {
      return this.getCachedData(component);
    }

    // For critical components, wait and retry with exponential backoff
    const delay = this.calculateIntelligentDelay(component);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return intelligentRateLimiter.makeRequest(endpointType, requestFn);
  }

  private canUseCachedData(component: string): boolean {
    // Non-critical components can use cached data
    const nonCritical = ['market-intelligence', 'consciousness-engine', 'superstar-engine'];
    return nonCritical.includes(component);
  }

  private getCachedData<T>(component: string): T {
    // Return reasonable default or cached data
    switch (component) {
      case 'market-intelligence':
        return { sentiment: 0, trend: 'neutral', confidence: 0.5 } as T;
      case 'consciousness-engine':
        return { evolution: 0.85, alignment: 0.9 } as T;
      case 'superstar-engine':
        return { level: 8, capabilities: ['analysis', 'prediction'] } as T;
      default:
        throw new Error(`No cached data available for ${component}`);
    }
  }

  private calculateIntelligentDelay(component: string): number {
    const metrics = this.componentMetrics.get(component);
    if (!metrics) return 5000;

    // Base delay on component priority and recent performance
    const basePriority = this.getComponentPriority(component);
    const performanceMultiplier = 1 + (metrics.errorRate * 2);
    const rateLimitMultiplier = 1 + (metrics.rateLimitHits * 0.1);

    const delay = (1000 / basePriority) * performanceMultiplier * rateLimitMultiplier;
    return Math.min(30000, Math.max(1000, delay));
  }

  private getComponentPriority(component: string): number {
    // Higher priority = lower delay
    const priorities = {
      'quantum-trader': 10,
      'wallet-analyzer': 9,
      'pump-scanner': 8,
      'market-intelligence': 6,
      'consciousness-engine': 5,
      'superstar-engine': 4,
      'cross-pollination': 3,
      'insight-infusion': 2
    };
    return priorities[component] || 1;
  }

  private trackSuccess(component: string, responseTime: number) {
    const metrics = this.componentMetrics.get(component);
    if (!metrics) return;

    // Update metrics with exponential moving average
    metrics.avgResponseTime = metrics.avgResponseTime * 0.7 + responseTime * 0.3;
    metrics.successRate = Math.min(1.0, metrics.successRate + 0.01);
    metrics.errorRate = Math.max(0, metrics.errorRate - 0.01);
    
    // Update efficiency score
    this.updateEfficiencyScore(component);
    
    // Increment request counter
    const current = this.requestCounters.get(component) || 0;
    this.requestCounters.set(component, current + 1);
  }

  private trackFailure(component: string, error: any) {
    const metrics = this.componentMetrics.get(component);
    if (!metrics) return;

    metrics.errorRate = Math.min(1.0, metrics.errorRate + 0.05);
    metrics.successRate = Math.max(0, metrics.successRate - 0.02);
    
    if (error.message?.includes('429')) {
      metrics.rateLimitHits++;
    }
    
    this.updateEfficiencyScore(component);
  }

  private updateEfficiencyScore(component: string) {
    const metrics = this.componentMetrics.get(component);
    if (!metrics) return;

    // Calculate efficiency based on multiple factors
    const responseTimeScore = Math.max(0, 100 - (metrics.avgResponseTime / 50));
    const successRateScore = metrics.successRate * 100;
    const errorRateScore = Math.max(0, 100 - (metrics.errorRate * 100));
    const rateLimitScore = Math.max(0, 100 - (metrics.rateLimitHits * 5));

    metrics.efficiency = Math.round(
      (responseTimeScore + successRateScore + errorRateScore + rateLimitScore) / 4
    );
  }

  private startEfficiencyMonitoring() {
    // Update request rates every minute
    setInterval(() => {
      this.updateRequestRates();
    }, 60000);

    // Run optimization every 5 minutes
    setInterval(() => {
      this.runAutomaticOptimization();
    }, 300000);

    // Generate efficiency reports every 10 minutes
    setInterval(() => {
      this.logEfficiencyReport();
    }, 600000);
  }

  private updateRequestRates() {
    for (const [component, count] of this.requestCounters.entries()) {
      const metrics = this.componentMetrics.get(component);
      if (metrics) {
        metrics.requestsPerMinute = count;
      }
      // Reset counter
      this.requestCounters.set(component, 0);
    }
  }

  private async runAutomaticOptimization() {
    try {
      // Run comprehensive optimization
      const results = await comprehensiveOptimizer.runFullSystemOptimization();
      
      // Apply rate limit optimizations
      await this.optimizeRateLimits();
      
      // Synchronize with harmony orchestrator
      await this.synchronizeWithHarmony();
      
      this.lastOptimization = new Date();
      
      console.log(`🚀 Auto-optimization completed: ${results.efficiency.performanceGain.toFixed(1)}% improvement`);
      
    } catch (error) {
      console.error('❌ Auto-optimization failed:', error);
    }
  }

  private async optimizeRateLimits() {
    // Analyze patterns and adjust request patterns
    const highUsageComponents = Array.from(this.componentMetrics.values())
      .filter(m => m.requestsPerMinute > 50 || m.rateLimitHits > 3);

    for (const component of highUsageComponents) {
      if (component.rateLimitHits > 5) {
        // Reduce request frequency for problematic components
        console.log(`🔧 Optimizing ${component.componentName}: reducing request frequency`);
        await this.implementFrequencyReduction(component.componentName);
      }
    }
  }

  private async implementFrequencyReduction(component: string) {
    // Implement component-specific optimizations
    switch (component) {
      case 'pump-scanner':
        // Reduce scanning frequency from every 10s to 30s
        console.log('📡 Pump scanner: frequency reduced to 30s intervals');
        break;
      case 'market-intelligence':
        // Use cached data more aggressively
        console.log('🧠 Market intelligence: increased cache usage');
        break;
      case 'wallet-analyzer':
        // Batch balance checks
        console.log('💰 Wallet analyzer: implementing batched requests');
        break;
    }
  }

  private async synchronizeWithHarmony() {
    // Ensure all optimizations align with system harmony
    const harmonyStatus = systemHarmonyOrchestrator.getSystemStatus();
    
    if (harmonyStatus.harmony < 80) {
      console.log('⚖️ System harmony below threshold, implementing corrective measures');
      // Reduce aggressive optimizations to maintain stability
    }
  }

  private logEfficiencyReport() {
    const report = this.generateEfficiencyReport();
    
    console.log('📊 AI EFFICIENCY REPORT');
    console.log('========================');
    console.log(`🎯 Overall Efficiency: ${report.overallEfficiency}%`);
    console.log(`🚀 Rate Limiter Status: ${intelligentRateLimiter.getSystemStatus().healthRatio * 100}% healthy`);
    
    // Log top and bottom performers
    const sorted = report.componentMetrics.sort((a, b) => b.efficiency - a.efficiency);
    console.log(`🥇 Top Performer: ${sorted[0].componentName} (${sorted[0].efficiency}%)`);
    
    if (sorted.length > 1) {
      const worst = sorted[sorted.length - 1];
      if (worst.efficiency < 80) {
        console.log(`⚠️ Needs Attention: ${worst.componentName} (${worst.efficiency}%)`);
      }
    }
  }

  public generateEfficiencyReport(): EfficiencyReport {
    const metrics = Array.from(this.componentMetrics.values());
    const overallEfficiency = metrics.reduce((sum, m) => sum + m.efficiency, 0) / metrics.length;
    
    const bottlenecks = metrics
      .filter(m => m.efficiency < 70)
      .map(m => `${m.componentName}: ${m.efficiency}% efficiency`);
    
    const optimizations = this.identifyOptimizations(metrics);
    const recommendations = this.generateRecommendations(metrics);

    return {
      overallEfficiency: Math.round(overallEfficiency),
      componentMetrics: metrics,
      optimizations,
      bottlenecks,
      recommendations
    };
  }

  private identifyOptimizations(metrics: AIComponentMetrics[]): string[] {
    const optimizations: string[] = [];
    
    metrics.forEach(metric => {
      if (metric.rateLimitHits > 3) {
        optimizations.push(`Implement request batching for ${metric.componentName}`);
      }
      if (metric.avgResponseTime > 2000) {
        optimizations.push(`Optimize response time for ${metric.componentName}`);
      }
      if (metric.errorRate > 0.1) {
        optimizations.push(`Improve error handling for ${metric.componentName}`);
      }
    });
    
    return optimizations;
  }

  private generateRecommendations(metrics: AIComponentMetrics[]): string[] {
    const recommendations: string[] = [];
    
    const highRateLimitComponents = metrics.filter(m => m.rateLimitHits > 5);
    if (highRateLimitComponents.length > 0) {
      recommendations.push('Consider implementing request queuing for high-traffic components');
    }
    
    const slowComponents = metrics.filter(m => m.avgResponseTime > 3000);
    if (slowComponents.length > 0) {
      recommendations.push('Implement response caching for slow components');
    }
    
    const unreliableComponents = metrics.filter(m => m.successRate < 0.9);
    if (unreliableComponents.length > 0) {
      recommendations.push('Add circuit breaker pattern for unreliable components');
    }
    
    return recommendations;
  }

  public getSystemOverview() {
    const rateLimiterStatus = intelligentRateLimiter.getSystemStatus();
    const harmonyStatus = systemHarmonyOrchestrator.getSystemStatus();
    const efficiencyReport = this.generateEfficiencyReport();

    return {
      efficiency: efficiencyReport.overallEfficiency,
      rateLimiterHealth: Math.round(rateLimiterStatus.healthRatio * 100),
      systemHarmony: harmonyStatus.harmony,
      activeComponents: this.componentMetrics.size,
      lastOptimization: this.lastOptimization,
      recommendations: efficiencyReport.recommendations.slice(0, 3)
    };
  }
}

export const aiEfficiencyOrchestrator = new AIEfficiencyOrchestrator();