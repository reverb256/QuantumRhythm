/**
 * API Rate Limit Monitor
 * Tracks and reports on the effectiveness of rate limiting strategies
 */

import { solanaEndpointManager } from './solana-endpoint-manager';

interface RateLimitMetrics {
  totalRequests: number;
  successfulRequests: number;
  rateLimitedRequests: number;
  forbiddenRequests: number;
  otherErrors: number;
  averageResponseTime: number;
  successRate: number;
  healthyEndpoints: number;
  totalEndpoints: number;
}

export class APIRateLimitMonitor {
  private metrics: RateLimitMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    rateLimitedRequests: 0,
    forbiddenRequests: 0,
    otherErrors: 0,
    averageResponseTime: 0,
    successRate: 0,
    healthyEndpoints: 0,
    totalEndpoints: 0
  };

  private requestTimes: number[] = [];
  private lastReportTime = Date.now();

  recordRequest(success: boolean, responseTime: number, errorType?: string) {
    this.metrics.totalRequests++;
    this.requestTimes.push(responseTime);

    if (success) {
      this.metrics.successfulRequests++;
    } else {
      if (errorType?.includes('429') || errorType?.includes('Too Many Requests')) {
        this.metrics.rateLimitedRequests++;
      } else if (errorType?.includes('403') || errorType?.includes('Forbidden')) {
        this.metrics.forbiddenRequests++;
      } else {
        this.metrics.otherErrors++;
      }
    }

    // Update calculated metrics
    this.metrics.successRate = (this.metrics.successfulRequests / this.metrics.totalRequests) * 100;
    this.metrics.averageResponseTime = this.requestTimes.reduce((a, b) => a + b, 0) / this.requestTimes.length;

    // Update endpoint health
    const endpointStatus = solanaEndpointManager.getHealthStatus();
    this.metrics.healthyEndpoints = endpointStatus.totalHealthy;
    this.metrics.totalEndpoints = endpointStatus.totalEndpoints;
  }

  getMetrics(): RateLimitMetrics {
    return { ...this.metrics };
  }

  generateReport(): string {
    const now = Date.now();
    const timeSinceLastReport = (now - this.lastReportTime) / 1000 / 60; // minutes
    
    this.lastReportTime = now;

    return `
🔍 API RATE LIMIT EFFECTIVENESS REPORT
=====================================
⏱️  Report Period: ${timeSinceLastReport.toFixed(1)} minutes
📊 Total Requests: ${this.metrics.totalRequests}
✅ Successful: ${this.metrics.successfulRequests} (${this.metrics.successRate.toFixed(1)}%)
⚠️  Rate Limited (429): ${this.metrics.rateLimitedRequests}
🚫 Forbidden (403): ${this.metrics.forbiddenRequests}
❌ Other Errors: ${this.metrics.otherErrors}
⚡ Avg Response Time: ${this.metrics.averageResponseTime.toFixed(0)}ms
🔗 Healthy Endpoints: ${this.metrics.healthyEndpoints}/${this.metrics.totalEndpoints}

${this.getOptimizationRecommendations()}
`;
  }

  private getOptimizationRecommendations(): string {
    const recommendations = [];

    if (this.metrics.rateLimitedRequests > 0) {
      recommendations.push("🔧 Still experiencing rate limits - consider adding more endpoints");
    }

    if (this.metrics.forbiddenRequests > this.metrics.totalRequests * 0.1) {
      recommendations.push("🔑 High forbidden rate - may need API key configuration");
    }

    if (this.metrics.successRate < 90) {
      recommendations.push("⚡ Low success rate - endpoint rotation may need tuning");
    }

    if (this.metrics.averageResponseTime > 5000) {
      recommendations.push("🚀 High response times - consider endpoint priority optimization");
    }

    if (this.metrics.healthyEndpoints < this.metrics.totalEndpoints * 0.5) {
      recommendations.push("🏥 Many unhealthy endpoints - health check intervals may need adjustment");
    }

    if (recommendations.length === 0) {
      recommendations.push("✨ Rate limiting optimization performing excellently!");
    }

    return "📈 OPTIMIZATION STATUS:\n" + recommendations.join("\n");
  }

  reset() {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      rateLimitedRequests: 0,
      forbiddenRequests: 0,
      otherErrors: 0,
      averageResponseTime: 0,
      successRate: 0,
      healthyEndpoints: 0,
      totalEndpoints: 0
    };
    this.requestTimes = [];
  }

  startPeriodicReporting(intervalMinutes: number = 5) {
    setInterval(() => {
      if (this.metrics.totalRequests > 0) {
        console.log(this.generateReport());
      }
    }, intervalMinutes * 60 * 1000);
  }
}

export const rateLimitMonitor = new APIRateLimitMonitor();

// Start monitoring immediately
rateLimitMonitor.startPeriodicReporting(5);