
/**
 * Graceful Degradation Manager
 * Provides system-wide fallback mechanisms and error recovery
 */

export class GracefulDegradationManager {
  private static instance: GracefulDegradationManager;
  private fallbackState: Map<string, any> = new Map();
  private degradationLevel: number = 0; // 0 = normal, 5 = maximum degradation

  static getInstance(): GracefulDegradationManager {
    if (!GracefulDegradationManager.instance) {
      GracefulDegradationManager.instance = new GracefulDegradationManager();
    }
    return GracefulDegradationManager.instance;
  }

  async executeWithDegradation<T>(
    operation: () => Promise<T>,
    fallback: () => Promise<T> | T,
    operationName: string
  ): Promise<T> {
    try {
      const result = await operation();
      this.recordSuccess(operationName);
      return result;
    } catch (error) {
      console.warn(`⚠️ ${operationName} failed, using graceful degradation:`, error);
      this.recordFailure(operationName);
      
      try {
        const fallbackResult = await fallback();
        console.log(`🔄 ${operationName} graceful fallback successful`);
        return fallbackResult;
      } catch (fallbackError) {
        console.error(`❌ ${operationName} fallback also failed:`, fallbackError);
        throw new Error(`${operationName} completely failed with degradation`);
      }
    }
  }

  private recordSuccess(operationName: string): void {
    const current = this.fallbackState.get(operationName) || { failures: 0, successes: 0 };
    current.successes++;
    current.lastSuccess = Date.now();
    this.fallbackState.set(operationName, current);
    
    // Reduce degradation level on success
    if (this.degradationLevel > 0 && current.successes % 5 === 0) {
      this.degradationLevel = Math.max(0, this.degradationLevel - 1);
      console.log(`📈 System health improving, degradation level: ${this.degradationLevel}`);
    }
  }

  private recordFailure(operationName: string): void {
    const current = this.fallbackState.get(operationName) || { failures: 0, successes: 0 };
    current.failures++;
    current.lastFailure = Date.now();
    this.fallbackState.set(operationName, current);
    
    // Increase degradation level on repeated failures
    if (current.failures % 3 === 0) {
      this.degradationLevel = Math.min(5, this.degradationLevel + 1);
      console.log(`📉 System degrading, level: ${this.degradationLevel}`);
    }
  }

  getDegradationLevel(): number {
    return this.degradationLevel;
  }

  getSystemHealth(): { level: number; status: string; details: any } {
    const totalFailures = Array.from(this.fallbackState.values())
      .reduce((sum, state) => sum + state.failures, 0);
    
    const totalSuccesses = Array.from(this.fallbackState.values())
      .reduce((sum, state) => sum + state.successes, 0);

    const healthPercentage = totalSuccesses + totalFailures > 0 
      ? (totalSuccesses / (totalSuccesses + totalFailures)) * 100 
      : 100;

    let status = 'healthy';
    if (healthPercentage < 50) status = 'critical';
    else if (healthPercentage < 80) status = 'degraded';
    else if (healthPercentage < 95) status = 'warning';

    return {
      level: this.degradationLevel,
      status,
      details: {
        healthPercentage: Math.round(healthPercentage),
        totalOperations: totalSuccesses + totalFailures,
        failureStates: Object.fromEntries(this.fallbackState)
      }
    };
  }

  async performSystemRecovery(): Promise<void> {
    console.log('🔧 Performing system recovery...');
    
    // Reset degradation level gradually
    this.degradationLevel = Math.max(0, this.degradationLevel - 2);
    
    // Clear old failure states
    const now = Date.now();
    for (const [key, state] of this.fallbackState) {
      if (state.lastFailure && now - state.lastFailure > 300000) { // 5 minutes
        state.failures = Math.max(0, state.failures - 1);
      }
    }
    
    console.log(`✅ System recovery complete, degradation level: ${this.degradationLevel}`);
  }
}

export const gracefulDegradationManager = GracefulDegradationManager.getInstance();
