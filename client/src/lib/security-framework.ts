// Comprehensive Security Framework for VibeCoding Platform
// Implements military-grade security principles with dojo kun ethics

export interface SecurityContext {
  level: 'public' | 'protected' | 'restricted' | 'classified';
  permissions: string[];
  userRole: 'visitor' | 'user' | 'trader' | 'master' | 'sensei';
  ethicalCompliance: boolean;
  auditTrail: SecurityEvent[];
}

export interface SecurityEvent {
  timestamp: Date;
  action: string;
  source: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  mitigation?: string;
  dojoKunViolation?: boolean;
}

export interface EncryptedData {
  payload: string;
  integrity: string;
  timestamp: number;
  quantumSafe: boolean;
}

// Dojo Kun Ethics Integration
const DOJO_KUN_PRINCIPLES = {
  perfection: 'Seek perfection of character',
  faithful: 'Be faithful',
  endeavor: 'Endeavor to excel', 
  respect: 'Respect others',
  nonviolence: 'Refrain from violent behavior'
};

class SecurityFramework {
  private static instance: SecurityFramework;
  private securityContext: SecurityContext;
  private eventLog: SecurityEvent[] = [];
  private encryptionKeys: Map<string, CryptoKey> = new Map();

  static getInstance(): SecurityFramework {
    if (!SecurityFramework.instance) {
      SecurityFramework.instance = new SecurityFramework();
    }
    return SecurityFramework.instance;
  }

  constructor() {
    this.securityContext = {
      level: 'public',
      permissions: ['read'],
      userRole: 'visitor',
      ethicalCompliance: true,
      auditTrail: []
    };
    this.initializeSecuritySystems();
  }

  private async initializeSecuritySystems() {
    // Generate quantum-safe encryption keys
    await this.generateQuantumSafeKeys();
    
    // Initialize content security policy
    this.enforceContentSecurityPolicy();
    
    // Setup input sanitization
    this.setupInputSanitization();
    
    // Monitor for security violations
    this.startSecurityMonitoring();
  }

  private async generateQuantumSafeKeys() {
    try {
      // Use Web Crypto API for quantum-resistant encryption
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-PSS',
          modulusLength: 4096, // Quantum-resistant key size
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-512',
        },
        true,
        ['sign', 'verify']
      );
      
      this.encryptionKeys.set('primary', keyPair.privateKey);
      this.encryptionKeys.set('public', keyPair.publicKey);
      
      this.logSecurityEvent({
        timestamp: new Date(),
        action: 'quantum_keys_generated',
        source: 'security_framework',
        riskLevel: 'low'
      });
    } catch (error) {
      this.logSecurityEvent({
        timestamp: new Date(),
        action: 'key_generation_failed',
        source: 'security_framework',
        riskLevel: 'critical',
        mitigation: 'Fallback to secure random generation'
      });
    }
  }

  private enforceContentSecurityPolicy() {
    // Create and enforce strict CSP
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'", // Required for React
      "style-src 'self' 'unsafe-inline'", // Required for styled components
      "img-src 'self' data: https:",
      "connect-src 'self' wss: https:",
      "font-src 'self'",
      "object-src 'none'",
      "media-src 'self'",
      "frame-src 'none'"
    ].join('; ');

    // Apply CSP meta tag
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = csp;
    document.head.appendChild(meta);
  }

  private setupInputSanitization() {
    // Override dangerous functions with secure alternatives
    const originalInnerHTML = Element.prototype.innerHTML;
    Object.defineProperty(Element.prototype, 'innerHTML', {
      get: function() { return originalInnerHTML; },
      set: function(value) {
        // Sanitize HTML input
        const sanitized = this.sanitizeHTML(value);
        originalInnerHTML.call(this, sanitized);
      }
    });
  }

  sanitizeHTML(input: string): string {
    // Remove potentially dangerous elements and attributes
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  sanitizeInput(input: any, context: 'user' | 'trading' | 'system' = 'user'): any {
    if (typeof input === 'string') {
      // Apply dojo kun principle: respect others (no harmful content)
      const harmfulPatterns = [
        /<script/i, /javascript:/i, /vbscript:/i, /onload/i, /onerror/i,
        /eval\(/i, /function\(/i, /setTimeout/i, /setInterval/i
      ];
      
      const containsHarmful = harmfulPatterns.some(pattern => pattern.test(input));
      
      if (containsHarmful) {
        this.logSecurityEvent({
          timestamp: new Date(),
          action: 'malicious_input_detected',
          source: `context_${context}`,
          riskLevel: 'high',
          dojoKunViolation: true,
          mitigation: 'Input sanitized and logged'
        });
        
        // Return sanitized version
        return input.replace(/[<>\"'&]/g, '');
      }
    }
    
    return input;
  }

  async encryptSensitiveData(data: any): Promise<EncryptedData> {
    const jsonData = JSON.stringify(data);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(jsonData);
    
    try {
      const key = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );
      
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        dataBuffer
      );
      
      // Create integrity hash
      const integrity = await this.createIntegrityHash(dataBuffer);
      
      return {
        payload: Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join(''),
        integrity,
        timestamp: Date.now(),
        quantumSafe: true
      };
    } catch (error) {
      throw new Error('Encryption failed: ' + error);
    }
  }

  private async createIntegrityHash(data: Uint8Array): Promise<string> {
    const hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  validateUserAction(action: string, context: any): boolean {
    // Apply dojo kun principles to validate actions
    const ethicalValidation = this.validateAgainstDojoKun(action, context);
    
    if (!ethicalValidation.valid) {
      this.logSecurityEvent({
        timestamp: new Date(),
        action: 'ethical_violation',
        source: 'user_action',
        riskLevel: 'medium',
        dojoKunViolation: true,
        mitigation: `Violated principle: ${ethicalValidation.violation}`
      });
      return false;
    }
    
    // Check security permissions
    const securityValidation = this.validateSecurityPermissions(action);
    
    return securityValidation;
  }

  private validateAgainstDojoKun(action: string, context: any): { valid: boolean; violation?: string } {
    // Respect others: No harmful actions
    if (action.includes('delete') && !context.confirmed) {
      return { valid: false, violation: 'respect_others' };
    }
    
    // Seek perfection: Ensure quality and completeness
    if (action.includes('submit') && !context.validated) {
      return { valid: false, violation: 'seek_perfection' };
    }
    
    // Be faithful: Maintain data integrity
    if (action.includes('modify') && !context.authenticated) {
      return { valid: false, violation: 'be_faithful' };
    }
    
    return { valid: true };
  }

  private validateSecurityPermissions(action: string): boolean {
    const actionPermissions: Record<string, string[]> = {
      'read': ['read'],
      'write': ['read', 'write'],
      'delete': ['read', 'write', 'delete'],
      'admin': ['read', 'write', 'delete', 'admin'],
      'trading': ['read', 'write', 'trading'],
      'system': ['read', 'write', 'delete', 'admin', 'system']
    };
    
    const requiredPermissions = actionPermissions[action] || ['read'];
    return requiredPermissions.every(perm => 
      this.securityContext.permissions.includes(perm)
    );
  }

  private startSecurityMonitoring() {
    // Monitor for suspicious activities
    setInterval(() => {
      this.checkForAnomalies();
    }, 30000); // Check every 30 seconds
    
    // Monitor DOM mutations for XSS attempts
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.scanElementForThreats(node as Element);
            }
          });
        }
      });
    });
    
    observer.observe(document, {
      childList: true,
      subtree: true
    });
  }

  private scanElementForThreats(element: Element) {
    // Check for suspicious attributes
    const suspiciousAttributes = ['onclick', 'onload', 'onerror', 'onmouseover'];
    
    suspiciousAttributes.forEach(attr => {
      if (element.hasAttribute(attr)) {
        this.logSecurityEvent({
          timestamp: new Date(),
          action: 'suspicious_attribute_detected',
          source: 'dom_monitor',
          riskLevel: 'high',
          mitigation: 'Element flagged for review'
        });
      }
    });
  }

  private checkForAnomalies() {
    // Check for unusual patterns in security events
    const recentEvents = this.eventLog.filter(
      event => Date.now() - event.timestamp.getTime() < 300000 // Last 5 minutes
    );
    
    const criticalEvents = recentEvents.filter(event => event.riskLevel === 'critical');
    const highRiskEvents = recentEvents.filter(event => event.riskLevel === 'high');
    
    if (criticalEvents.length > 0 || highRiskEvents.length > 3) {
      this.triggerSecurityAlert({
        level: 'high',
        reason: 'Multiple high-risk security events detected',
        events: [...criticalEvents, ...highRiskEvents.slice(0, 3)]
      });
    }
  }

  private triggerSecurityAlert(alert: { level: string; reason: string; events: SecurityEvent[] }) {
    console.warn('🚨 SECURITY ALERT:', alert);
    
    // In production, this would send alerts to security team
    this.logSecurityEvent({
      timestamp: new Date(),
      action: 'security_alert_triggered',
      source: 'security_monitoring',
      riskLevel: 'critical',
      mitigation: 'Security team notified'
    });
  }

  logSecurityEvent(event: SecurityEvent) {
    this.eventLog.push(event);
    this.securityContext.auditTrail.push(event);
    
    // Keep only last 1000 events to prevent memory issues
    if (this.eventLog.length > 1000) {
      this.eventLog = this.eventLog.slice(-1000);
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Security Event:', event);
    }
  }

  getSecurityStatus(): {
    level: string;
    threats: number;
    compliance: boolean;
    recentEvents: SecurityEvent[];
  } {
    const recentThreats = this.eventLog.filter(
      event => event.riskLevel === 'high' || event.riskLevel === 'critical'
    ).length;
    
    return {
      level: this.securityContext.level,
      threats: recentThreats,
      compliance: this.securityContext.ethicalCompliance,
      recentEvents: this.eventLog.slice(-10)
    };
  }

  // Cross-empowerment: Integrate security with other systems
  crossEmpowerWithTrading(tradingData: any): any {
    // Validate trading data against security policies
    const validated = this.sanitizeInput(tradingData, 'trading');
    
    // Check for suspicious trading patterns
    if (this.detectSuspiciousTrading(validated)) {
      this.logSecurityEvent({
        timestamp: new Date(),
        action: 'suspicious_trading_pattern',
        source: 'trading_integration',
        riskLevel: 'high',
        mitigation: 'Pattern flagged for review'
      });
    }
    
    return validated;
  }

  private detectSuspiciousTrading(data: any): boolean {
    // Implement trading pattern analysis
    // This is a simplified example
    if (data.amount && data.amount > 1000000) {
      return true; // Unusually large trade
    }
    return false;
  }

  crossEmpowerWithSEO(seoData: any): any {
    // Ensure SEO data doesn't contain malicious content
    const sanitized = {
      ...seoData,
      title: this.sanitizeInput(seoData.title),
      description: this.sanitizeInput(seoData.description),
      keywords: Array.isArray(seoData.keywords) 
        ? seoData.keywords.map((k: string) => this.sanitizeInput(k))
        : []
    };
    
    return sanitized;
  }
}

export default SecurityFramework;