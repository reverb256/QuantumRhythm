

/**
 * Security Audit Logger
 * Comprehensive security event logging and monitoring system
 */

import { EventEmitter } from 'events';
import { createHash } from 'crypto';

interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'wallet_access' | 'api_call' | 'data_exposure' | 'authentication' | 'configuration';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  details: any;
  sanitized: boolean;
}

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  highSeverityEvents: number;
  dataExposureAttempts: number;
  lastAudit: Date;
  complianceScore: number;
}

export class SecurityAuditLogger extends EventEmitter {
  private events: SecurityEvent[] = [];
  private metrics: SecurityMetrics;
  private maxEvents: number = 10000;

  constructor() {
    super();
    this.metrics = {
      totalEvents: 0,
      criticalEvents: 0,
      highSeverityEvents: 0,
      dataExposureAttempts: 0,
      lastAudit: new Date(),
      complianceScore: 100
    };

    this.startPeriodicAudit();
  }

  private startPeriodicAudit() {
    // Run security audit every hour
    setInterval(() => {
      this.performSecurityAudit();
    }, 3600000);
  }

  logSecurityEvent(
    type: SecurityEvent['type'],
    severity: SecurityEvent['severity'],
    source: string,
    details: any
  ): void {
    const eventId = this.generateEventId();
    
    // Sanitize sensitive data in event details
    const sanitizedDetails = this.sanitizeEventDetails(details);
    
    const event: SecurityEvent = {
      id: eventId,
      timestamp: new Date(),
      type,
      severity,
      source,
      details: sanitizedDetails,
      sanitized: sanitizedDetails !== details
    };

    this.events.push(event);
    this.updateMetrics(event);
    
    // Keep only recent events to prevent memory issues
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log high-severity events immediately
    if (severity === 'high' || severity === 'critical') {
      console.log(`🚨 SECURITY EVENT [${severity.toUpperCase()}]: ${type} from ${source}`);
      if (event.sanitized) {
        console.log('⚠️  Event details were sanitized for security');
      }
    }

    this.emit('securityEvent', event);
  }

  private generateEventId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    return createHash('sha256').update(timestamp + random).digest('hex').substring(0, 16);
  }

  private sanitizeEventDetails(details: any): any {
    if (typeof details === 'string') {
      return this.sanitizeString(details);
    }
    
    if (Array.isArray(details)) {
      return details.map(item => this.sanitizeEventDetails(item));
    }
    
    if (typeof details === 'object' && details !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(details)) {
        // Completely remove sensitive keys
        if (this.isSensitiveKey(key)) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeEventDetails(value);
        }
      }
      return sanitized;
    }
    
    return details;
  }

  private sanitizeString(text: string): string {
    // Wallet address patterns
    text = text.replace(/[1-9A-HJ-NP-Za-km-z]{32,44}/g, '[WALLET_ADDRESS]');
    
    // Private key patterns
    text = text.replace(/[a-fA-F0-9]{64}/g, '[PRIVATE_KEY]');
    
    // API key patterns
    text = text.replace(/sk-[a-zA-Z0-9]{48}/g, '[API_KEY]');
    text = text.replace(/Bearer\s+[a-zA-Z0-9\-._~+/]+/gi, '[BEARER_TOKEN]');
    
    // Environment variable values
    text = text.replace(/\$[A-Z_]+/g, '[ENV_VAR]');
    
    return text;
  }

  private isSensitiveKey(key: string): boolean {
    const sensitiveKeys = [
      'privateKey', 'secretKey', 'password', 'token', 'apiKey',
      'walletAddress', 'publicKey', 'seed', 'mnemonic', 'credential'
    ];
    
    return sensitiveKeys.some(sensitiveKey => 
      key.toLowerCase().includes(sensitiveKey.toLowerCase())
    );
  }

  private updateMetrics(event: SecurityEvent): void {
    this.metrics.totalEvents++;
    
    if (event.severity === 'critical') {
      this.metrics.criticalEvents++;
    }
    
    if (event.severity === 'high') {
      this.metrics.highSeverityEvents++;
    }
    
    if (event.type === 'data_exposure') {
      this.metrics.dataExposureAttempts++;
    }
    
    this.metrics.lastAudit = new Date();
    this.calculateComplianceScore();
  }

  private calculateComplianceScore(): void {
    // Start with perfect score
    let score = 100;
    
    // Deduct points for security events
    score -= this.metrics.criticalEvents * 10;
    score -= this.metrics.highSeverityEvents * 5;
    score -= this.metrics.dataExposureAttempts * 15;
    
    // Ensure score doesn't go below 0
    this.metrics.complianceScore = Math.max(0, score);
  }

  private performSecurityAudit(): void {
    console.log('\n🔍 SECURITY AUDIT REPORT');
    console.log('========================');
    console.log(`📊 Total Events: ${this.metrics.totalEvents}`);
    console.log(`🚨 Critical Events: ${this.metrics.criticalEvents}`);
    console.log(`⚠️  High Severity: ${this.metrics.highSeverityEvents}`);
    console.log(`🔒 Data Exposure Attempts: ${this.metrics.dataExposureAttempts}`);
    console.log(`✅ Compliance Score: ${this.metrics.complianceScore}%`);
    console.log(`⏰ Last Audit: ${this.metrics.lastAudit.toLocaleString()}`);
    
    // Check compliance thresholds
    if (this.metrics.complianceScore < 70) {
      console.log('🚨 COMPLIANCE ALERT: Security score below acceptable threshold');
      this.emit('complianceAlert', this.metrics);
    }
    
    console.log('========================\n');
  }

  getSecurityMetrics(): SecurityMetrics {
    return { ...this.metrics };
  }

  getRecentEvents(count: number = 10): SecurityEvent[] {
    return this.events.slice(-count).reverse();
  }

  getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return this.events.filter(event => event.type === type);
  }

  getEventsBySeverity(severity: SecurityEvent['severity']): SecurityEvent[] {
    return this.events.filter(event => event.severity === severity);
  }

  exportAuditReport(): {
    metadata: {
      generatedAt: Date;
      totalEvents: number;
      complianceScore: number;
    };
    metrics: SecurityMetrics;
    recentEvents: SecurityEvent[];
    recommendations: string[];
  } {
    const recommendations = [];
    
    if (this.metrics.criticalEvents > 0) {
      recommendations.push('Investigate and resolve all critical security events immediately');
    }
    
    if (this.metrics.dataExposureAttempts > 5) {
      recommendations.push('Review data protection mechanisms - multiple exposure attempts detected');
    }
    
    if (this.metrics.complianceScore < 80) {
      recommendations.push('Implement additional security measures to improve compliance score');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Security posture is acceptable - continue monitoring');
    }

    return {
      metadata: {
        generatedAt: new Date(),
        totalEvents: this.metrics.totalEvents,
        complianceScore: this.metrics.complianceScore
      },
      metrics: this.metrics,
      recentEvents: this.getRecentEvents(50),
      recommendations
    };
  }

  clearAuditLog(): void {
    console.log('🗑️  Clearing security audit log');
    this.events = [];
    this.metrics = {
      totalEvents: 0,
      criticalEvents: 0,
      highSeverityEvents: 0,
      dataExposureAttempts: 0,
      lastAudit: new Date(),
      complianceScore: 100
    };
  }
}

export const securityAuditLogger = new SecurityAuditLogger();
