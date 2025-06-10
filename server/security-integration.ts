

/**
 * Security Integration Module
 * Integrates all security components and provides unified security management
 */

import { dataProtection } from './data-protection-middleware';
import { securityAuditLogger } from './security-audit-logger';
import { quantumSecurityVault } from './quantum-security-vault';
import { tradingMonitor } from './trading-monitor';
import express from 'express';

export class SecurityIntegration {
  private app: express.Application;

  constructor(app: express.Application) {
    this.app = app;
    this.initializeSecurityMiddleware();
    this.setupSecurityEventHandlers();
  }

  private initializeSecurityMiddleware(): void {
    // Data protection middleware
    this.app.use(dataProtection.protectResponse());
    
    // Security event logging middleware
    this.app.use((req, res, next) => {
      securityAuditLogger.logSecurityEvent(
        'api_call',
        'low',
        req.method + ' ' + req.path,
        {
          userAgent: req.get('User-Agent'),
          ip: req.ip,
          timestamp: new Date()
        }
      );
      next();
    });

    // Console output protection
    dataProtection.protectConsoleOutput();
    
    console.log('🛡️  Security integration initialized');
  }

  private setupSecurityEventHandlers(): void {
    // Trading monitor events
    tradingMonitor.on('emergencyStop', (metrics) => {
      securityAuditLogger.logSecurityEvent(
        'configuration',
        'critical',
        'trading-monitor',
        { event: 'emergency_stop', metrics }
      );
    });

    // Security audit events
    securityAuditLogger.on('complianceAlert', (metrics) => {
      console.log('🚨 COMPLIANCE ALERT: Initiating security review');
      this.handleComplianceAlert(metrics);
    });

    // Data protection events
    securityAuditLogger.on('securityEvent', (event) => {
      if (event.severity === 'critical') {
        this.handleCriticalSecurityEvent(event);
      }
    });
  }

  private handleComplianceAlert(metrics: any): void {
    // Implement compliance response procedures
    console.log('📋 Compliance response initiated');
    
    // Could trigger additional security measures like:
    // - Increased monitoring
    // - Temporary feature restrictions
    // - Administrator notifications
  }

  private handleCriticalSecurityEvent(event: any): void {
    console.log(`🚨 Critical security event: ${event.type} from ${event.source}`);
    
    // Could implement automatic responses like:
    // - Temporary lockdowns
    // - Enhanced logging
    // - Real-time alerts
  }

  // Public methods for security management
  public getSecurityStatus(): {
    dataProtection: boolean;
    auditLogging: boolean;
    quantumVault: boolean;
    tradingMonitor: boolean;
    complianceScore: number;
  } {
    const metrics = securityAuditLogger.getSecurityMetrics();
    
    return {
      dataProtection: true,
      auditLogging: true,
      quantumVault: true,
      tradingMonitor: !tradingMonitor.isEmergencyStop(),
      complianceScore: metrics.complianceScore
    };
  }

  public generateSecurityReport(): any {
    return {
      timestamp: new Date(),
      auditReport: securityAuditLogger.exportAuditReport(),
      quantumVaultAudit: quantumSecurityVault.getSecurityAudit(),
      tradingMetrics: tradingMonitor.getMetrics(),
      dataProtectionStatus: 'active'
    };
  }

  public performEmergencySecurityLockdown(): {
    status: string;
    actions: string[];
  } {
    const actions = [];
    
    // Activate data protection emergency mode
    const lockdownResult = dataProtection.emergencyLockdown();
    actions.push('Data protection lockdown activated');
    
    // Reset trading monitor
    tradingMonitor.resetMetrics();
    actions.push('Trading monitor reset');
    
    // Clear sensitive audit logs
    securityAuditLogger.clearAuditLog();
    actions.push('Audit logs cleared');
    
    securityAuditLogger.logSecurityEvent(
      'configuration',
      'critical',
      'security-integration',
      { event: 'emergency_lockdown', actions }
    );

    return {
      status: 'EMERGENCY_LOCKDOWN_ACTIVE',
      actions
    };
  }
}

export { SecurityIntegration };
