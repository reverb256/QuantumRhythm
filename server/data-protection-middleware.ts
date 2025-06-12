import { Request, Response, NextFunction } from 'express';

interface SensitiveDataFilter {
  patterns: RegExp[];
  replacementText: string;
  severity: 'critical' | 'high' | 'medium';
}

export class DataProtectionMiddleware {
  private sensitivePatterns: SensitiveDataFilter[] = [
    {
      patterns: [
        /[1-9A-HJ-NP-Za-km-z]{32,44}/g,
        /0x[a-fA-F0-9]{40}/g,
        /[L13][a-km-zA-HJ-NP-Z1-9]{25,34}/g,
        /[a-fA-F0-9]{64}/g,
      ],
      replacementText: '[REDACTED_WALLET]',
      severity: 'critical'
    },
    {
      patterns: [
        /sk-[a-zA-Z0-9]{48}/g,
        /ghp_[a-zA-Z0-9]{36}/g,
        /xoxb-[0-9]+-[0-9]+-[a-zA-Z0-9]+/g,
      ],
      replacementText: '[REDACTED_API_KEY]',
      severity: 'critical'
    }
  ];

  constructor() {
    console.log('🛡️ Data Protection Middleware initialized');
  }

  protect = (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send.bind(res);
    
    res.send = (body: any): Response => {
      if (typeof body === 'string') {
        body = this.sanitizeData(body);
      } else if (typeof body === 'object') {
        body = this.sanitizeData(body);
      }
      return originalSend(body);
    };
    
    next();
  };

  private sanitizeData(data: any, depth = 0): any {
    if (depth > 10) return data;
    
    if (typeof data === 'string') {
      return this.sanitizeString(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item, depth + 1));
    }
    
    if (data && typeof data === 'object') {
      const sanitized: any = {};
      Object.keys(data).forEach(key => {
        sanitized[key] = this.sanitizeData(data[key], depth + 1);
      });
      return sanitized;
    }
    
    return data;
  }

  public sanitizeString(text: string): string {
    let sanitized = text;
    
    this.sensitivePatterns.forEach(filter => {
      filter.patterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, filter.replacementText);
      });
    });
    
    return sanitized;
  }

  getProtectionStatus() {
    return {
      active: true,
      patterns: this.sensitivePatterns.length,
      timestamp: new Date().toISOString()
    };
  }
}

export const dataProtectionMiddleware = new DataProtectionMiddleware();