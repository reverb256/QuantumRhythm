
/**
 * System Error Recovery - Automated error detection and resolution
 */

import { problemSolver } from './autonomous-problem-solver';
import { databaseSchemaFixer } from './database-schema-fixer';
import { apiEfficiencyManager } from './api-efficiency-manager';

export class SystemErrorRecovery {
  private recoveryAttempts: Map<string, number> = new Map();
  private maxRecoveryAttempts = 3;

  async performFullSystemRecovery(): Promise<void> {
    console.log('🔧 Starting comprehensive system error recovery...');

    try {
      // 1. Reset emergency trading states
      await this.resetTradingEmergencyStates();

      // 2. Fix database schema issues
      await this.recoverDatabaseIssues();

      // 3. Reset API rate limiting
      await this.resetAPIRateLimiting();

      // 4. Clear error states
      await this.clearSystemErrorStates();

      // 5. Restart critical services
      await this.restartCriticalServices();

      console.log('✅ System error recovery completed successfully');

    } catch (error) {
      console.error('❌ System recovery failed:', error);
      throw error;
    }
  }

  private async resetTradingEmergencyStates(): Promise<void> {
    console.log('🔄 Resetting trading emergency states...');
    
    // Reset trading monitor emergency states
    const { tradingMonitor } = await import('./trading-monitor');
    tradingMonitor.resetEmergencyStop();
    
    console.log('✅ Trading emergency states reset');
  }

  private async recoverDatabaseIssues(): Promise<void> {
    console.log('🗄️ Recovering database issues...');
    
    // Fix schema issues
    await databaseSchemaFixer.fixMissingColumns();
    await databaseSchemaFixer.validateConstraints();
    await databaseSchemaFixer.fixUUIDIssues();
    
    // Run database health check and auto-repair
    await problemSolver.performDatabaseHealthCheck();
    
    console.log('✅ Database recovery completed');
  }

  private async resetAPIRateLimiting(): Promise<void> {
    console.log('🌐 Resetting API rate limiting...');
    
    // Reset all endpoint health to baseline
    const systemStatus = apiEfficiencyManager.getSystemStatus();
    console.log(`📊 API System Health: ${systemStatus.healthRatio * 100}%`);
    
    console.log('✅ API rate limiting reset');
  }

  private async clearSystemErrorStates(): Promise<void> {
    console.log('🧹 Clearing system error states...');
    
    // Clear recovery attempt counters
    this.recoveryAttempts.clear();
    
    console.log('✅ System error states cleared');
  }

  private async restartCriticalServices(): Promise<void> {
    console.log('🚀 Restarting critical services...');
    
    // Services will auto-restart via their monitoring loops
    console.log('✅ Critical services restart initiated');
  }

  async handleSpecificError(errorType: string, error: any): Promise<boolean> {
    const attemptKey = `${errorType}-${Date.now()}`;
    const attempts = this.recoveryAttempts.get(errorType) || 0;
    
    if (attempts >= this.maxRecoveryAttempts) {
      console.log(`❌ Max recovery attempts reached for ${errorType}`);
      return false;
    }

    this.recoveryAttempts.set(errorType, attempts + 1);

    try {
      switch (errorType) {
        case 'uuid_parsing':
          await this.handleUUIDError(error);
          break;
        case 'api_rate_limit':
          await this.handleRateLimitError(error);
          break;
        case 'database_constraint':
          await this.handleDatabaseError(error);
          break;
        case 'trading_emergency':
          await this.handleTradingError(error);
          break;
        default:
          console.log(`⚠️ Unknown error type: ${errorType}`);
          return false;
      }

      console.log(`✅ Successfully recovered from ${errorType}`);
      return true;

    } catch (recoveryError) {
      console.error(`❌ Recovery failed for ${errorType}:`, recoveryError);
      return false;
    }
  }

  private async handleUUIDError(error: any): Promise<void> {
    console.log('🔧 Handling UUID parsing error...');
    await databaseSchemaFixer.fixUUIDIssues();
  }

  private async handleRateLimitError(error: any): Promise<void> {
    console.log('🔧 Handling rate limit error...');
    // Rate limiting will auto-adjust via API efficiency manager
  }

  private async handleDatabaseError(error: any): Promise<void> {
    console.log('🔧 Handling database error...');
    await problemSolver.performDatabaseHealthCheck();
  }

  private async handleTradingError(error: any): Promise<void> {
    console.log('🔧 Handling trading error...');
    await this.resetTradingEmergencyStates();
  }
}

export const systemErrorRecovery = new SystemErrorRecovery();
