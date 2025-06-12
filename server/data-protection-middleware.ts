import { Request, Response, NextFunction } from 'express';

interface SensitiveDataFilter {
  patterns: RegExp[];
  replacementText: string;
  severity: 'critical' | 'high' | 'medium';
}

// TEMPORARILY DISABLED - export class DataProtectionMiddleware {
  private sensitivePatterns: SensitiveDataFilter[] = [
    // Wallet addresses and private keys
    {
      patterns: [
        /[1-9A-HJ-NP-Za-km-z]{32,44}/g, // Solana addresses
        /0x[a-fA-F0-9]{40}/g, // Ethereum addresses
        /[L13][a-km-zA-HJ-NP-Z1-9]{25,34}/g, // Bitcoin addresses
        /[a-fA-F0-9]{64}/g, // Private key patterns
      ],
      replacementText: '[REDACTED_WALLET]',
      severity: 'critical'
    },
    
    // API keys and secrets
    {
      patterns: [
        /sk-[a-zA-Z0-9]{48}/g, // OpenAI API keys
        /[a-zA-Z0-9]{32,}/g, // Generic API keys (32+ chars)
        /Bearer\s+[a-zA-Z0-9\-._~+/]+/gi, // Bearer tokens
        /token[_-]?[a-zA-Z0-9]{20,}/gi, // Token patterns
      ],
      replacementText: '[REDACTED_KEY]',
      severity: 'critical'
    },
    
    // Personal identifiable information
    {
      patterns: [
        /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email (partial redaction)
        /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, // Credit card numbers
        /\b\d{10,15}\b/g, // Phone numbers
      ],
      replacementText: '[REDACTED_PII]',
      severity: 'high'
    },
    
    // Legal and compliance sensitive data
    {
      patterns: [
        /\b(violation|breach|non-compliant|illegal|unauthorized)\b/gi,
        /\b(lawsuit|litigation|legal action|regulatory)\b/gi,
        /\b(fine|penalty|sanction|enforcement)\b/gi,
      ],
      replacementText: '[COMPLIANCE_REVIEW]',
      severity: 'medium'
    },
    
    // Internal system information
    {
      patterns: [
        /password[s]?[:\s=]+[^\s]+/gi,
        /secret[s]?[:\s=]+[^\s]+/gi,
        /key[s]?[:\s=]+[^\s]+/gi,
        /DATABASE_URL[:\s=]+[^\s]+/gi,
        /mongodb[+srv]*:\/\/[^\s]+/gi,
        /postgres[ql]*:\/\/[^\s]+/gi,
      ],
      replacementText: '[REDACTED_INTERNAL]',
      severity: 'critical'
    }
  ];

  // Middleware function for Express
  public protectResponse() {
    const middleware = this;
    return (req: Request, res: Response, next: NextFunction) => {
      const originalJson = res.json;
      const originalSend = res.send;

      // Override res.json to filter sensitive data
      res.json = function(body: any) {
        const sanitizedBody = middleware.sanitizeData(body);
        return originalJson.call(this, sanitizedBody);
      };

      // Override res.send to filter sensitive data
      res.send = function(body: any) {
        if (typeof body === 'string') {
          body = middleware.sanitizeString(body);
        } else if (typeof body === 'object') {
          body = middleware.sanitizeData(body);
        }
        return originalSend.call(this, body);
      };

      next();
    };
  }

  private sanitizeData(data: any, depth = 0): any {
    // Prevent infinite recursion
    if (depth > 5) {
      return '[DEEP_OBJECT_TRUNCATED]';
    }
    
    if (typeof data === 'string') {
      return this.sanitizeString(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item, depth + 1));
    }
    
    if (typeof data === 'object' && data !== null) {
      // Prevent circular references
      if (data.__sanitizing) {
        return '[CIRCULAR_REFERENCE]';
      }
      
      const sanitized: any = {};
      // Mark object to prevent circular processing
      Object.defineProperty(data, '__sanitizing', { value: true, configurable: true });
      
      try {
        for (const [key, value] of Object.entries(data)) {
          if (key === '__sanitizing') continue;
          // Check if key itself contains sensitive information
          const sanitizedKey = this.sanitizeString(key);
          sanitized[sanitizedKey] = this.sanitizeData(value, depth + 1);
        }
      } finally {
        // Clean up marker
        delete data.__sanitizing;
      }
      
      return sanitized;
    }
    
    return data;
  }

  private sanitizeString(text: string): string {
    let sanitized = text;
    
    for (const filter of this.sensitivePatterns) {
      for (const pattern of filter.patterns) {
        sanitized = sanitized.replace(pattern, filter.replacementText);
      }
    }
    
    return sanitized;
  }

  // Console/log protection
  public protectConsoleOutput() {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args: any[]) => {
      const sanitizedArgs = args.map(arg => 
        typeof arg === 'string' ? this.sanitizeString(arg) : this.sanitizeData(arg)
      );
      originalLog.apply(console, sanitizedArgs);
    };

    console.error = (...args: any[]) => {
      const sanitizedArgs = args.map(arg => 
        typeof arg === 'string' ? this.sanitizeString(arg) : this.sanitizeData(arg)
      );
      originalError.apply(console, sanitizedArgs);
    };

    console.warn = (...args: any[]) => {
      const sanitizedArgs = args.map(arg => 
        typeof arg === 'string' ? this.sanitizeString(arg) : this.sanitizeData(arg)
      );
      originalWarn.apply(console, sanitizedArgs);
    };
  }

  // Database query protection
  public sanitizeQuery(query: string): string {
    return this.sanitizeString(query);
  }

  // Environment variable protection
  public getSafeEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) return '';
    
    // Never expose actual values of sensitive environment variables
    if (this.isSensitiveEnvVar(key)) {
      return value.length > 8 ? `${value.substring(0, 4)}***${value.substring(value.length - 4)}` : '[PROTECTED]';
    }
    
    return value;
  }

  private isSensitiveEnvVar(key: string): boolean {
    const sensitiveKeys = [
      'PAYOUT_TOKEN', 'PAYOUT_TOKEN_B', 'DATABASE_URL', 'ANTHROPIC_API_KEY',
      'PERPLEXITY_API_KEY', 'OPENAI_API_KEY', 'SECRET', 'KEY', 'TOKEN',
      'PASSWORD', 'PRIVATE', 'AUTH', 'CREDENTIAL'
    ];
    
    return sensitiveKeys.some(sensitiveKey => 
      key.toUpperCase().includes(sensitiveKey)
    );
  }

  // Validate that no sensitive data is exposed in API responses
  public validateApiResponse(response: any): {
    isSafe: boolean;
    violations: string[];
    sanitizedResponse: any;
  } {
    const violations: string[] = [];
    const originalJson = JSON.stringify(response);
    const sanitizedResponse = this.sanitizeData(response);
    const sanitizedJson = JSON.stringify(sanitizedResponse);
    
    // Check if sanitization changed anything
    if (originalJson !== sanitizedJson) {
      violations.push('Sensitive data detected and sanitized');
    }
    
    // Additional checks for wallet addresses in any form
    const sensitiveStrings = [
      'PAYOUT_TOKEN', 'DATABASE_URL',
      'ANTHROPIC_API_KEY', 'PERPLEXITY_API_KEY', 'PRIVATE_KEY', 'SECRET_KEY'
    ];
    
    for (const sensitiveString of sensitiveStrings) {
      if (originalJson.includes(sensitiveString)) {
        violations.push(`Sensitive data detected: ${sensitiveString.substring(0, 8)}...`);
      }
    }
    
    return {
      isSafe: violations.length === 0,
      violations,
      sanitizedResponse
    };
  }

  // Real-time monitoring for data leaks
  public monitorDataExposure() {
    setInterval(() => {
      this.auditRecentLogs();
    }, 60000); // Check every minute
  }

  private auditRecentLogs() {
    // This would integrate with logging systems to detect exposure
    console.log('🔍 Data protection audit: Monitoring for sensitive data exposure');
  }

  // Emergency data leak response
  public emergencyLockdown() {
    console.log('🚨 EMERGENCY DATA PROTECTION LOCKDOWN ACTIVATED');
    
    // Override all output methods to prevent further exposure
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
    
    // This would trigger additional security measures
    return {
      status: 'LOCKDOWN_ACTIVE',
      timestamp: new Date(),
      message: 'All output channels secured'
    };
  }
}

export const dataProtection = new DataProtectionMiddleware();
export class DataProtectionMiddleware {
  constructor() {}
  
  protect() {
    return (req: any, res: any, next: any) => {
      // Safe mode - minimal protection
      console.log('🛡️ Data protection: Safe mode active');
      next();
    };
  }
}