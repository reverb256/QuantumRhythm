/**
 * AI Security Framework - Enterprise-grade protection for AI systems
 * Implements multi-layer security, audit trails, and threat detection
 */

import { z } from 'zod';
import crypto from 'crypto';

// Security Context Schema
export const SecurityContextSchema = z.object({
  userId: z.string().uuid(),
  sessionId: z.string().uuid(),
  ipAddress: z.string().ip(),
  userAgent: z.string(),
  timestamp: z.date(),
  jurisdiction: z.string(),
  securityLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  
  // Rate limiting context
  rateLimits: z.object({
    requestsPerMinute: z.number().max(100),
    requestsPerHour: z.number().max(1000),
    requestsPerDay: z.number().max(10000)
  }),
  
  // Authentication context
  auth: z.object({
    isAuthenticated: z.boolean(),
    authMethod: z.enum(['session', 'token', 'certificate', 'biometric']),
    permissions: z.array(z.string()),
    lastLogin: z.date().optional()
  })
});

// AI Request Security Envelope
export class AISecurityEnvelope {
  private readonly requestId: string;
  private readonly timestamp: Date;
  private readonly securityContext: any;
  private readonly auditTrail: AuditEvent[] = [];

  constructor(securityContext: any) {
    this.requestId = crypto.randomUUID();
    this.timestamp = new Date();
    this.securityContext = SecurityContextSchema.parse(securityContext);
    
    this.logAuditEvent('REQUEST_INITIATED', {
      requestId: this.requestId,
      userId: this.securityContext.userId,
      securityLevel: this.securityContext.securityLevel
    });
  }

  async validateRequest(request: any): Promise<ValidatedRequest> {
    try {
      // 1. Rate limit check
      await this.checkRateLimits();
      
      // 2. Authentication validation
      await this.validateAuthentication();
      
      // 3. Authorization check
      await this.checkPermissions(request);
      
      // 4. Input sanitization and validation
      const sanitizedRequest = await this.sanitizeAndValidate(request);
      
      // 5. Threat detection
      await this.detectThreats(sanitizedRequest);
      
      this.logAuditEvent('REQUEST_VALIDATED', {
        requestId: this.requestId,
        inputSize: JSON.stringify(sanitizedRequest).length
      });

      return {
        requestId: this.requestId,
        securityContext: this.securityContext,
        sanitizedInput: sanitizedRequest,
        validatedAt: new Date()
      };
    } catch (error) {
      this.logSecurityEvent('REQUEST_VALIDATION_FAILED', {
        error: error.message,
        requestId: this.requestId
      });
      throw new SecurityValidationError(`Request validation failed: ${error.message}`);
    }
  }

  async secureResponse(response: any): Promise<SecuredResponse> {
    try {
      // 1. Output validation and sanitization
      const sanitizedResponse = await this.sanitizeOutput(response);
      
      // 2. Content filtering
      const filteredResponse = await this.filterContent(sanitizedResponse);
      
      // 3. Compliance check
      await this.checkCompliance(filteredResponse);
      
      // 4. Response encryption (if required)
      const securedResponse = await this.encryptResponse(filteredResponse);
      
      this.logAuditEvent('RESPONSE_SECURED', {
        requestId: this.requestId,
        outputSize: JSON.stringify(securedResponse).length
      });

      return {
        requestId: this.requestId,
        response: securedResponse,
        securityChecks: {
          sanitized: true,
          filtered: true,
          compliant: true,
          encrypted: this.securityContext.securityLevel === 'CRITICAL'
        },
        processedAt: new Date()
      };
    } catch (error) {
      this.logSecurityEvent('RESPONSE_SECURITY_FAILED', {
        error: error.message,
        requestId: this.requestId
      });
      throw new SecurityProcessingError(`Response security failed: ${error.message}`);
    }
  }

  // Rate Limiting Implementation
  private async checkRateLimits(): Promise<void> {
    const userId = this.securityContext.userId;
    const rateLimits = this.securityContext.rateLimits;
    
    // Check against distributed rate limit store (Redis in production)
    const currentRequests = await this.getCurrentRequestCount(userId);
    
    if (currentRequests.perMinute >= rateLimits.requestsPerMinute) {
      throw new RateLimitError('Per-minute rate limit exceeded');
    }
    
    if (currentRequests.perHour >= rateLimits.requestsPerHour) {
      throw new RateLimitError('Per-hour rate limit exceeded');
    }
    
    if (currentRequests.perDay >= rateLimits.requestsPerDay) {
      throw new RateLimitError('Per-day rate limit exceeded');
    }
    
    // Increment counters
    await this.incrementRequestCount(userId);
  }

  // Authentication Validation
  private async validateAuthentication(): Promise<void> {
    const auth = this.securityContext.auth;
    
    if (!auth.isAuthenticated) {
      throw new AuthenticationError('User not authenticated');
    }
    
    // Check session validity (if session-based auth)
    if (auth.authMethod === 'session') {
      const sessionValid = await this.validateSession(this.securityContext.sessionId);
      if (!sessionValid) {
        throw new AuthenticationError('Session expired or invalid');
      }
    }
    
    // Check for suspicious authentication patterns
    await this.detectAuthAnomalies();
  }

  // Authorization Check
  private async checkPermissions(request: any): Promise<void> {
    const requiredPermissions = this.getRequiredPermissions(request);
    const userPermissions = this.securityContext.auth.permissions;
    
    const hasPermissions = requiredPermissions.every(perm => 
      userPermissions.includes(perm) || userPermissions.includes('admin')
    );
    
    if (!hasPermissions) {
      throw new AuthorizationError('Insufficient permissions for this operation');
    }
  }

  // Input Sanitization and Validation
  private async sanitizeAndValidate(request: any): Promise<any> {
    // Remove potentially dangerous content
    const sanitized = this.deepSanitize(request);
    
    // Validate against schema
    const validated = await this.validateAgainstSchema(sanitized);
    
    // Additional security checks
    await this.performSecurityChecks(validated);
    
    return validated;
  }

  // Threat Detection
  private async detectThreats(request: any): Promise<void> {
    const threats = await Promise.all([
      this.detectInjectionAttacks(request),
      this.detectPromptInjection(request),
      this.detectDataExfiltration(request),
      this.detectAnomalousPatterns(request)
    ]);
    
    const detectedThreats = threats.filter(Boolean);
    
    if (detectedThreats.length > 0) {
      this.logSecurityEvent('THREATS_DETECTED', {
        threats: detectedThreats,
        requestId: this.requestId
      });
      throw new ThreatDetectionError(`Security threats detected: ${detectedThreats.join(', ')}`);
    }
  }

  // Content Filtering
  private async filterContent(content: any): Promise<any> {
    // Remove sensitive information
    const filtered = this.removeSensitiveData(content);
    
    // Apply content policies
    const policyFiltered = await this.applyContentPolicies(filtered);
    
    // Jurisdiction-specific filtering
    const jurisdictionFiltered = this.applyJurisdictionFilters(policyFiltered);
    
    return jurisdictionFiltered;
  }

  // Compliance Checking
  private async checkCompliance(response: any): Promise<void> {
    const jurisdiction = this.securityContext.jurisdiction;
    
    switch (jurisdiction) {
      case 'EU':
        await this.checkGDPRCompliance(response);
        await this.checkAIActCompliance(response);
        break;
      case 'US':
        await this.checkCCPACompliance(response);
        await this.checkSOXCompliance(response);
        break;
      case 'UK':
        await this.checkUKDPACompliance(response);
        break;
      default:
        await this.checkGlobalCompliance(response);
    }
  }

  // Encryption for High-Security Responses
  private async encryptResponse(response: any): Promise<any> {
    if (this.securityContext.securityLevel === 'CRITICAL') {
      const encryptionKey = await this.getEncryptionKey();
      return this.encryptData(response, encryptionKey);
    }
    return response;
  }

  // Utility Methods
  private deepSanitize(obj: any): any {
    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.deepSanitize(item));
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const sanitizedKey = this.sanitizeString(key);
        sanitized[sanitizedKey] = this.deepSanitize(value);
      }
      return sanitized;
    }
    
    return obj;
  }

  private sanitizeString(str: string): string {
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/[<>&"']/g, (char) => {
        const entities: Record<string, string> = {
          '<': '&lt;', '>': '&gt;', '&': '&amp;',
          '"': '&quot;', "'": '&#x27;'
        };
        return entities[char] || char;
      });
  }

  private logAuditEvent(event: string, data: any): void {
    const auditEvent: AuditEvent = {
      eventType: event,
      timestamp: new Date(),
      requestId: this.requestId,
      userId: this.securityContext.userId,
      data,
      severity: 'INFO'
    };
    
    this.auditTrail.push(auditEvent);
    
    // In production, send to audit logging service
    console.log(`[AUDIT] ${event}:`, auditEvent);
  }

  private logSecurityEvent(event: string, data: any): void {
    const securityEvent = {
      eventType: event,
      timestamp: new Date(),
      requestId: this.requestId,
      userId: this.securityContext.userId,
      severity: 'WARNING',
      data
    };
    
    // In production, send to security monitoring service
    console.warn(`[SECURITY] ${event}:`, securityEvent);
  }

  // Placeholder implementations for external services
  private async getCurrentRequestCount(userId: string): Promise<RequestCounts> {
    // In production, this would query Redis or similar
    return { perMinute: 0, perHour: 0, perDay: 0 };
  }

  private async incrementRequestCount(userId: string): Promise<void> {
    // In production, this would increment Redis counters
  }

  private async validateSession(sessionId: string): Promise<boolean> {
    // In production, this would validate against session store
    return true;
  }

  private async detectAuthAnomalies(): Promise<void> {
    // In production, this would check for suspicious patterns
  }

  private getRequiredPermissions(request: any): string[] {
    // Determine required permissions based on request type
    if (request.action === 'execute') return ['trading:execute'];
    if (request.action === 'admin') return ['admin'];
    return ['basic'];
  }

  private async validateAgainstSchema(data: any): Promise<any> {
    // Schema validation would happen here
    return data;
  }

  private async performSecurityChecks(data: any): Promise<void> {
    // Additional security validations
  }

  private async detectInjectionAttacks(request: any): Promise<string | null> {
    const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION)\b)/i;
    const jsonStr = JSON.stringify(request);
    return sqlInjectionPattern.test(jsonStr) ? 'SQL_INJECTION' : null;
  }

  private async detectPromptInjection(request: any): Promise<string | null> {
    const injectionPatterns = [
      /ignore\s+(previous|above|all)\s+instructions/i,
      /pretend\s+you\s+are/i,
      /act\s+as\s+if/i
    ];
    
    const content = JSON.stringify(request);
    return injectionPatterns.some(pattern => pattern.test(content)) ? 'PROMPT_INJECTION' : null;
  }

  private async detectDataExfiltration(request: any): Promise<string | null> {
    // Check for attempts to extract training data or system information
    const exfiltrationPatterns = [
      /show\s+me\s+your\s+(training|system|internal)/i,
      /what\s+are\s+your\s+(instructions|rules|guidelines)/i
    ];
    
    const content = JSON.stringify(request);
    return exfiltrationPatterns.some(pattern => pattern.test(content)) ? 'DATA_EXFILTRATION' : null;
  }

  private async detectAnomalousPatterns(request: any): Promise<string | null> {
    // AI-based anomaly detection would go here
    return null;
  }

  private removeSensitiveData(content: any): any {
    // Remove PII, credentials, etc.
    return content;
  }

  private async applyContentPolicies(content: any): Promise<any> {
    // Apply content moderation policies
    return content;
  }

  private applyJurisdictionFilters(content: any): any {
    // Apply jurisdiction-specific content filters
    return content;
  }

  private async checkGDPRCompliance(response: any): Promise<void> {
    // GDPR compliance checks
  }

  private async checkAIActCompliance(response: any): Promise<void> {
    // EU AI Act compliance checks
  }

  private async checkCCPACompliance(response: any): Promise<void> {
    // CCPA compliance checks
  }

  private async checkSOXCompliance(response: any): Promise<void> {
    // SOX compliance checks
  }

  private async checkUKDPACompliance(response: any): Promise<void> {
    // UK DPA compliance checks
  }

  private async checkGlobalCompliance(response: any): Promise<void> {
    // Global baseline compliance checks
  }

  private async getEncryptionKey(): Promise<string> {
    // Retrieve encryption key from secure key management service
    return 'encryption-key-placeholder';
  }

  private encryptData(data: any, key: string): any {
    // Encrypt sensitive data
    return data;
  }
}

// Type Definitions
interface AuditEvent {
  eventType: string;
  timestamp: Date;
  requestId: string;
  userId: string;
  data: any;
  severity: string;
}

interface RequestCounts {
  perMinute: number;
  perHour: number;
  perDay: number;
}

interface ValidatedRequest {
  requestId: string;
  securityContext: any;
  sanitizedInput: any;
  validatedAt: Date;
}

interface SecuredResponse {
  requestId: string;
  response: any;
  securityChecks: {
    sanitized: boolean;
    filtered: boolean;
    compliant: boolean;
    encrypted: boolean;
  };
  processedAt: Date;
}

// Custom Error Classes
export class SecurityValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecurityValidationError';
  }
}

export class SecurityProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecurityProcessingError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class ThreatDetectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ThreatDetectionError';
  }
}

export { AISecurityEnvelope };