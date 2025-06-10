/**
 * AI Orchestration Service
 * Coordinates Cloudflare Workers + GitHub Pages for intelligent request routing
 * Maximizes free tier performance and reliability
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {CloudflareOptimizer} from './CloudflareOptimizer';
import {GitHubPagesManager} from './GitHubPagesManager';

export interface AIRequest {
  type: 'trading' | 'analysis' | 'market' | 'portfolio';
  payload: any;
  priority: 'low' | 'normal' | 'high' | 'critical';
  timeout?: number;
}

export interface AIResponse {
  data: any;
  source: 'cloudflare' | 'github' | 'cache' | 'fallback';
  latency: number;
  cached: boolean;
}

export class AIOrchestrator {
  private static instance: AIOrchestrator;
  private cloudflare: CloudflareOptimizer;
  private github: GitHubPagesManager;
  private requestQueue: AIRequest[] = [];
  private processing = false;
  private metrics = {
    totalRequests: 0,
    successRate: 0,
    averageLatency: 0,
    cacheHitRate: 0
  };

  private constructor() {}

  static async initialize(): Promise<AIOrchestrator> {
    if (!this.instance) {
      this.instance = new AIOrchestrator();
      await this.instance.setupOrchestration();
    }
    return this.instance;
  }

  static getInstance(): AIOrchestrator {
    return this.instance;
  }

  private async setupOrchestration(): Promise<void> {
    try {
      this.cloudflare = CloudflareOptimizer.getInstance();
      this.github = GitHubPagesManager.getInstance();
      
      await this.initializeRoutingIntelligence();
      await this.setupFailoverStrategies();
      await this.enableSmartCaching();
      
      this.startRequestProcessor();
      
      console.log('✅ AI Orchestration initialized');
    } catch (error) {
      console.error('❌ AI Orchestration failed:', error);
    }
  }

  private async initializeRoutingIntelligence(): Promise<void> {
    const routingConfig = {
      strategies: {
        latency: { weight: 0.4, threshold: 200 },
        reliability: { weight: 0.3, threshold: 0.95 },
        cost: { weight: 0.2, threshold: 100 },
        load: { weight: 0.1, threshold: 0.8 }
      },
      fallbackChain: ['cloudflare', 'github', 'cache', 'offline'],
      healthCheckInterval: 30000,
      adaptiveRouting: true
    };

    await AsyncStorage.setItem('ai_routing_config', JSON.stringify(routingConfig));
  }

  private async setupFailoverStrategies(): Promise<void> {
    const failoverConfig = {
      retryAttempts: 3,
      backoffStrategy: 'exponential',
      circuitBreaker: {
        threshold: 5,
        timeout: 30000,
        resetTime: 60000
      },
      gracefulDegradation: true
    };

    await AsyncStorage.setItem('ai_failover_config', JSON.stringify(failoverConfig));
  }

  private async enableSmartCaching(): Promise<void> {
    const cacheConfig = {
      strategies: {
        trading: { ttl: 30, priority: 'high' },
        market: { ttl: 60, priority: 'normal' },
        analysis: { ttl: 300, priority: 'normal' },
        portfolio: { ttl: 600, priority: 'low' }
      },
      compression: true,
      encryption: true,
      maxSize: 50 * 1024 * 1024 // 50MB
    };

    await AsyncStorage.setItem('ai_cache_config', JSON.stringify(cacheConfig));
  }

  async processRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    // Check cache first
    const cached = await this.getCachedResponse(request);
    if (cached) {
      this.updateMetrics(startTime, true, 'cache');
      return {
        data: cached,
        source: 'cache',
        latency: Date.now() - startTime,
        cached: true
      };
    }

    // Determine optimal routing
    const route = await this.determineOptimalRoute(request);
    
    try {
      const response = await this.executeRequest(request, route);
      
      // Cache successful responses
      await this.cacheResponse(request, response.data);
      
      this.updateMetrics(startTime, true, route);
      return response;
    } catch (error) {
      // Try fallback routes
      const fallbackResponse = await this.handleFailover(request, route, error);
      this.updateMetrics(startTime, fallbackResponse !== null, 'fallback');
      
      if (fallbackResponse) {
        return fallbackResponse;
      }
      
      throw error;
    }
  }

  private async determineOptimalRoute(request: AIRequest): Promise<'cloudflare' | 'github'> {
    const routingConfig = await this.getRoutingConfig();
    const cloudflareMetrics = await this.cloudflare.getPerformanceMetrics();
    const githubMetrics = await this.github.getPerformanceMetrics();

    // Score each route based on configured weights
    const cloudflareScore = this.calculateRouteScore(cloudflareMetrics, routingConfig);
    const githubScore = this.calculateRouteScore(githubMetrics, routingConfig);

    // Factor in request type and priority
    const typeBonus = this.getTypeBonus(request.type);
    const priorityMultiplier = this.getPriorityMultiplier(request.priority);

    const finalCloudflareScore = (cloudflareScore + typeBonus.cloudflare) * priorityMultiplier;
    const finalGithubScore = (githubScore + typeBonus.github) * priorityMultiplier;

    return finalCloudflareScore >= finalGithubScore ? 'cloudflare' : 'github';
  }

  private calculateRouteScore(metrics: any, config: any): number {
    const latencyScore = metrics.averageLatency < config.strategies.latency.threshold ? 1 : 0;
    const reliabilityScore = metrics.successRate > config.strategies.reliability.threshold ? 1 : 0;
    const loadScore = metrics.queueSize < config.strategies.load.threshold ? 1 : 0;

    return (
      latencyScore * config.strategies.latency.weight +
      reliabilityScore * config.strategies.reliability.weight +
      loadScore * config.strategies.load.weight
    );
  }

  private getTypeBonus(type: string): { cloudflare: number; github: number } {
    switch (type) {
      case 'trading':
        return { cloudflare: 0.3, github: 0.1 }; // Cloudflare better for real-time
      case 'analysis':
        return { cloudflare: 0.2, github: 0.2 }; // Equal preference
      case 'market':
        return { cloudflare: 0.2, github: 0.1 }; // Slight Cloudflare preference
      case 'portfolio':
        return { cloudflare: 0.1, github: 0.3 }; // GitHub better for static data
      default:
        return { cloudflare: 0, github: 0 };
    }
  }

  private getPriorityMultiplier(priority: string): number {
    switch (priority) {
      case 'critical': return 1.5;
      case 'high': return 1.2;
      case 'normal': return 1.0;
      case 'low': return 0.8;
      default: return 1.0;
    }
  }

  private async executeRequest(request: AIRequest, route: 'cloudflare' | 'github'): Promise<AIResponse> {
    const startTime = Date.now();

    if (route === 'cloudflare') {
      const endpoint = this.getCloudflareEndpoint(request.type);
      const data = await this.cloudflare.optimizedRequest(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request.payload)
      });

      return {
        data,
        source: 'cloudflare',
        latency: Date.now() - startTime,
        cached: false
      };
    } else {
      const assetPath = this.getGitHubAssetPath(request.type);
      const url = await this.github.optimizeAssetDelivery(assetPath);
      const response = await fetch(url);
      const data = await response.json();

      return {
        data,
        source: 'github',
        latency: Date.now() - startTime,
        cached: false
      };
    }
  }

  private getCloudflareEndpoint(type: string): string {
    const endpoints = {
      trading: '/api/trading/execute',
      analysis: '/api/analysis/generate',
      market: '/api/market/data',
      portfolio: '/api/portfolio/status'
    };
    return endpoints[type] || '/api/generic';
  }

  private getGitHubAssetPath(type: string): string {
    const paths = {
      trading: 'data/trading-templates.json',
      analysis: 'data/analysis-models.json',
      market: 'data/market-data.json',
      portfolio: 'data/portfolio-templates.json'
    };
    return paths[type] || 'data/default.json';
  }

  private async handleFailover(
    request: AIRequest,
    failedRoute: string,
    error: any
  ): Promise<AIResponse | null> {
    const fallbackConfig = await this.getFailoverConfig();
    const alternateRoute = failedRoute === 'cloudflare' ? 'github' : 'cloudflare';

    try {
      console.warn(`Route ${failedRoute} failed, trying ${alternateRoute}:`, error.message);
      return await this.executeRequest(request, alternateRoute);
    } catch (fallbackError) {
      console.error('All routes failed:', { original: error, fallback: fallbackError });
      
      // Try cached response as last resort
      const cached = await this.getCachedResponse(request, true); // Allow stale
      if (cached) {
        return {
          data: cached,
          source: 'cache',
          latency: 0,
          cached: true
        };
      }
      
      return null;
    }
  }

  private async getCachedResponse(request: AIRequest, allowStale = false): Promise<any> {
    const cacheKey = this.generateCacheKey(request);
    const cached = await AsyncStorage.getItem(`ai_cache_${cacheKey}`);
    
    if (cached) {
      const { data, timestamp, ttl } = JSON.parse(cached);
      const age = Date.now() - timestamp;
      
      if (age < ttl * 1000 || allowStale) {
        return data;
      }
    }
    
    return null;
  }

  private async cacheResponse(request: AIRequest, data: any): Promise<void> {
    const cacheConfig = await this.getCacheConfig();
    const strategy = cacheConfig.strategies[request.type] || { ttl: 300, priority: 'normal' };
    
    const cacheKey = this.generateCacheKey(request);
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: strategy.ttl,
      priority: strategy.priority
    };
    
    await AsyncStorage.setItem(`ai_cache_${cacheKey}`, JSON.stringify(cacheEntry));
  }

  private generateCacheKey(request: AIRequest): string {
    return `${request.type}_${JSON.stringify(request.payload)}`.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 100);
  }

  private async updateMetrics(startTime: number, success: boolean, source: string): Promise<void> {
    const latency = Date.now() - startTime;
    
    // Update running averages
    this.metrics.averageLatency = (this.metrics.averageLatency + latency) / 2;
    this.metrics.successRate = success ? 
      (this.metrics.successRate + 1) / 2 : 
      this.metrics.successRate * 0.9;
    
    if (source === 'cache') {
      this.metrics.cacheHitRate = (this.metrics.cacheHitRate + 1) / 2;
    }
  }

  private startRequestProcessor(): void {
    setInterval(async () => {
      if (this.requestQueue.length > 0 && !this.processing) {
        this.processing = true;
        
        try {
          const batch = this.requestQueue.splice(0, 5); // Process 5 at a time
          await Promise.allSettled(batch.map(req => this.processRequest(req)));
        } catch (error) {
          console.error('Batch processing error:', error);
        } finally {
          this.processing = false;
        }
      }
    }, 100);
  }

  async getMetrics() {
    return {
      ...this.metrics,
      queueSize: this.requestQueue.length,
      cloudflare: await this.cloudflare.getPerformanceMetrics(),
      github: await this.github.getPerformanceMetrics()
    };
  }

  private async getRoutingConfig(): Promise<any> {
    const config = await AsyncStorage.getItem('ai_routing_config');
    return config ? JSON.parse(config) : {};
  }

  private async getFailoverConfig(): Promise<any> {
    const config = await AsyncStorage.getItem('ai_failover_config');
    return config ? JSON.parse(config) : {};
  }

  private async getCacheConfig(): Promise<any> {
    const config = await AsyncStorage.getItem('ai_cache_config');
    return config ? JSON.parse(config) : {};
  }
}