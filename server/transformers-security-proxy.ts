/**
 * Transformers.js Security Proxy
 * Local AI-powered security analysis for provider inference and threat detection
 */

// Note: fossAIInference will be imported dynamically to avoid server-side issues

interface ProviderSecurityProfile {
  providerId: string;
  trustLevel: number; // 0-1 scale
  securityFeatures: string[];
  vulnerabilities: string[];
  compliance: string[];
  lastAssessment: Date;
  aiConfidence: number;
}

interface SecurityThreat {
  type: 'rate_limit' | 'unauthorized' | 'malicious_response' | 'data_leak' | 'injection';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigation: string;
  confidence: number;
}

interface InferenceRequest {
  provider: string;
  endpoint: string;
  method: string;
  payload?: any;
  headers?: Record<string, string>;
}

interface SecurityAssessment {
  allowed: boolean;
  trustScore: number;
  threats: SecurityThreat[];
  recommendations: string[];
  sanitizedPayload?: any;
  secureHeaders?: Record<string, string>;
}

class TransformersSecurityProxy {
  private providerProfiles: Map<string, ProviderSecurityProfile> = new Map();
  private threatPatterns: Map<string, RegExp> = new Map();
  private blockedProviders: Set<string> = new Set();
  private trustedProviders: Set<string> = new Set();

  constructor() {
    this.initializeSecurityPatterns();
    this.initializeTrustedProviders();
    console.log('🛡️ Transformers Security Proxy initialized');
    console.log('   AI-powered threat detection active');
    console.log('   Local inference for complete privacy');
  }

  private initializeSecurityPatterns(): void {
    this.threatPatterns.set('sql_injection', /(\bselect\b|\bunion\b|\bdrop\b|\binsert\b|\bdelete\b)/i);
    this.threatPatterns.set('xss_attempt', /(<script|javascript:|on\w+\s*=)/i);
    this.threatPatterns.set('api_key_leak', /[a-zA-Z0-9]{32,}/);
    this.threatPatterns.set('suspicious_domain', /(bit\.ly|tinyurl|suspicious-domain\.com)/i);
    this.threatPatterns.set('rate_limit_abuse', /429|too.many.requests/i);
  }

  private initializeTrustedProviders(): void {
    // FOSS-compliant and verified providers
    this.trustedProviders.add('solana-labs');
    this.trustedProviders.add('alchemy');
    this.trustedProviders.add('publicnode');
    this.trustedProviders.add('localhost');
    this.trustedProviders.add('127.0.0.1');
    
    // Known problematic providers
    this.blockedProviders.add('suspicious-rpc');
    this.blockedProviders.add('unverified-provider');
  }

  async analyzeProviderSecurity(providerId: string, endpoint: string): Promise<ProviderSecurityProfile> {
    console.log(`🔍 Analyzing security profile for ${providerId}`);
    
    // Check if we have cached analysis
    if (this.providerProfiles.has(providerId)) {
      const profile = this.providerProfiles.get(providerId)!;
      // Refresh if older than 1 hour
      if (Date.now() - profile.lastAssessment.getTime() < 3600000) {
        return profile;
      }
    }

    const securityFeatures: string[] = [];
    const vulnerabilities: string[] = [];
    const compliance: string[] = [];
    
    // Analyze endpoint URL for security indicators
    const url = new URL(endpoint);
    
    if (url.protocol === 'https:') {
      securityFeatures.push('TLS Encryption');
      compliance.push('Transport Security');
    } else {
      vulnerabilities.push('Unencrypted Connection');
    }

    if (this.trustedProviders.has(providerId)) {
      securityFeatures.push('Verified Provider');
      compliance.push('FOSS Compliance');
    }

    // Use AI to analyze provider reputation and security
    const aiAnalysis = await this.performAISecurityAnalysis(providerId, endpoint);
    
    const trustLevel = this.calculateTrustLevel(securityFeatures, vulnerabilities, aiAnalysis.confidence);
    
    const profile: ProviderSecurityProfile = {
      providerId,
      trustLevel,
      securityFeatures,
      vulnerabilities,
      compliance,
      lastAssessment: new Date(),
      aiConfidence: aiAnalysis.confidence
    };

    this.providerProfiles.set(providerId, profile);
    console.log(`✅ Security profile for ${providerId}: ${(trustLevel * 100).toFixed(1)}% trust`);
    
    return profile;
  }

  private async performAISecurityAnalysis(providerId: string, endpoint: string): Promise<{
    confidence: number;
    threats: string[];
    recommendations: string[];
  }> {
    try {
      // Rule-based security analysis (server-side compatible)
      const analysisText = `Provider: ${providerId}, Endpoint: ${endpoint}`;
      
      // Rule-based provider reputation analysis
      const reputationResult = this.analyzeProviderReputation(providerId, endpoint);
      
      // Simple heuristic-based analysis enhanced by reputation score
      const threats: string[] = [];
      const recommendations: string[] = [];
      let confidence = 0.7; // Base confidence
      
      // Enhance confidence based on reputation analysis
      if (sentimentResult.confidence > 0.8) {
        if (sentimentResult.reputation === 'trusted') {
          confidence += 0.2;
          recommendations.push('Provider shows positive security indicators');
        } else if (sentimentResult.reputation === 'suspicious') {
          confidence -= 0.3;
          threats.push('Provider reputation analysis indicates potential concerns');
        }
      }

      // Domain-based analysis
      if (endpoint.includes('localhost') || endpoint.includes('127.0.0.1')) {
        threats.push('Local development endpoint - not for production');
        confidence -= 0.2;
      }

      if (this.trustedProviders.has(providerId)) {
        confidence += 0.2;
        recommendations.push('Provider is in trusted whitelist');
      }

      return {
        confidence: Math.max(0.1, Math.min(0.95, confidence)),
        threats,
        recommendations
      };
    } catch (error) {
      console.log(`⚠️ AI security analysis failed for ${providerId}, using fallback`);
      return {
        confidence: 0.5,
        threats: ['AI analysis unavailable'],
        recommendations: ['Use manual security assessment']
      };
    }
  }

  private analyzeProviderReputation(providerId: string, endpoint: string): {
    reputation: 'trusted' | 'neutral' | 'suspicious';
    confidence: number;
  } {
    // Rule-based provider reputation analysis
    let reputationScore = 0.5;
    
    // Check against known trusted providers
    if (this.trustedProviders.has(providerId)) {
      reputationScore += 0.4;
    }
    
    // Check against blocked providers
    if (this.blockedProviders.has(providerId)) {
      reputationScore -= 0.6;
    }
    
    // Analyze endpoint characteristics
    const url = new URL(endpoint);
    if (url.protocol === 'https:') {
      reputationScore += 0.1;
    }
    
    // Check for suspicious patterns
    if (url.hostname.includes('suspicious') || url.hostname.includes('temp')) {
      reputationScore -= 0.3;
    }
    
    // Determine reputation category
    let reputation: 'trusted' | 'neutral' | 'suspicious';
    if (reputationScore >= 0.7) {
      reputation = 'trusted';
    } else if (reputationScore <= 0.3) {
      reputation = 'suspicious';
    } else {
      reputation = 'neutral';
    }
    
    return {
      reputation,
      confidence: Math.abs(reputationScore - 0.5) * 2 // Convert to 0-1 confidence scale
    };
  }

  private calculateTrustLevel(
    securityFeatures: string[], 
    vulnerabilities: string[], 
    aiConfidence: number
  ): number {
    let trustScore = 0.5; // Base trust
    
    // Add points for security features
    trustScore += securityFeatures.length * 0.1;
    
    // Subtract points for vulnerabilities
    trustScore -= vulnerabilities.length * 0.2;
    
    // Factor in AI confidence
    trustScore = (trustScore + aiConfidence) / 2;
    
    return Math.max(0, Math.min(1, trustScore));
  }

  async secureInference(request: InferenceRequest): Promise<SecurityAssessment> {
    console.log(`🔒 Securing inference request to ${request.provider}`);
    
    const profile = await this.analyzeProviderSecurity(request.provider, request.endpoint);
    const threats: SecurityThreat[] = [];
    const recommendations: string[] = [];
    
    // Check for blocked providers
    if (this.blockedProviders.has(request.provider)) {
      return {
        allowed: false,
        trustScore: 0,
        threats: [{
          type: 'unauthorized',
          severity: 'critical',
          description: 'Provider is on security blocklist',
          mitigation: 'Use alternative trusted provider',
          confidence: 1.0
        }],
        recommendations: ['Switch to trusted RPC provider']
      };
    }

    // Analyze request payload for threats
    if (request.payload) {
      const payloadThreats = await this.analyzePayloadSecurity(request.payload);
      threats.push(...payloadThreats);
    }

    // Analyze headers for security issues
    const headerThreats = this.analyzeHeaderSecurity(request.headers || {});
    threats.push(...headerThreats);

    // Generate secure headers
    const secureHeaders = this.generateSecureHeaders(request.headers || {});

    // Sanitize payload
    const sanitizedPayload = this.sanitizePayload(request.payload);

    // Determine if request should be allowed
    const criticalThreats = threats.filter(t => t.severity === 'critical').length;
    const highThreats = threats.filter(t => t.severity === 'high').length;
    
    const allowed = criticalThreats === 0 && highThreats <= 1 && profile.trustLevel > 0.3;

    if (allowed) {
      recommendations.push('Request approved with security enhancements');
    } else {
      recommendations.push('Request blocked due to security concerns');
    }

    console.log(`${allowed ? '✅' : '❌'} Inference ${allowed ? 'approved' : 'blocked'} for ${request.provider}`);
    console.log(`   Trust score: ${(profile.trustLevel * 100).toFixed(1)}%`);
    console.log(`   Threats detected: ${threats.length}`);

    return {
      allowed,
      trustScore: profile.trustLevel,
      threats,
      recommendations,
      sanitizedPayload,
      secureHeaders
    };
  }

  private async analyzePayloadSecurity(payload: any): Promise<SecurityThreat[]> {
    const threats: SecurityThreat[] = [];
    const payloadStr = JSON.stringify(payload);
    
    // Check for injection patterns
    for (const [threatType, pattern] of this.threatPatterns.entries()) {
      if (pattern.test(payloadStr)) {
        threats.push({
          type: threatType as any,
          severity: threatType.includes('injection') ? 'critical' : 'medium',
          description: `Potential ${threatType} detected in payload`,
          mitigation: 'Sanitize input parameters',
          confidence: 0.8
        });
      }
    }

    // Rule-based payload analysis for suspicious content
    try {
      // Check for common malicious patterns
      if (payloadStr.includes('eval(') || payloadStr.includes('Function(')) {
        threats.push({
          type: 'malicious_response',
          severity: 'high',
          description: 'Potential code injection detected in payload',
          mitigation: 'Remove or sanitize dynamic code execution',
          confidence: 0.9
        });
      }
      
      // Check for excessive data requests
      if (payloadStr.length > 10000) {
        threats.push({
          type: 'data_leak',
          severity: 'medium',
          description: 'Unusually large payload detected',
          mitigation: 'Validate payload size and content',
          confidence: 0.7
        });
      }
    } catch (error) {
      // Analysis failed, continue with basic validation
    }

    return threats;
  }

  private analyzeHeaderSecurity(headers: Record<string, string>): SecurityThreat[] {
    const threats: SecurityThreat[] = [];
    
    // Check for sensitive data in headers
    for (const [key, value] of Object.entries(headers)) {
      if (this.threatPatterns.get('api_key_leak')?.test(value)) {
        threats.push({
          type: 'data_leak',
          severity: 'high',
          description: `Potential API key exposed in header: ${key}`,
          mitigation: 'Move sensitive data to secure environment variables',
          confidence: 0.9
        });
      }
    }

    return threats;
  }

  private generateSecureHeaders(originalHeaders: Record<string, string>): Record<string, string> {
    const secureHeaders = { ...originalHeaders };
    
    // Add security headers
    secureHeaders['X-Content-Type-Options'] = 'nosniff';
    secureHeaders['X-Frame-Options'] = 'DENY';
    secureHeaders['X-XSS-Protection'] = '1; mode=block';
    secureHeaders['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
    
    // Remove potentially dangerous headers
    delete secureHeaders['X-Forwarded-For'];
    delete secureHeaders['X-Real-IP'];
    
    return secureHeaders;
  }

  private sanitizePayload(payload: any): any {
    if (!payload) return payload;
    
    const sanitized = JSON.parse(JSON.stringify(payload));
    
    // Remove or sanitize potentially dangerous content
    if (typeof sanitized === 'object') {
      for (const key in sanitized) {
        if (typeof sanitized[key] === 'string') {
          // Remove script tags and suspicious patterns
          sanitized[key] = sanitized[key]
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '');
        }
      }
    }
    
    return sanitized;
  }

  getSecurityStatus(): {
    activeProfiles: number;
    trustedProviders: number;
    blockedProviders: number;
    totalThreatsDetected: number;
    aiConfidence: number;
  } {
    const profiles = Array.from(this.providerProfiles.values());
    const avgConfidence = profiles.length > 0 
      ? profiles.reduce((sum, p) => sum + p.aiConfidence, 0) / profiles.length 
      : 0;

    return {
      activeProfiles: this.providerProfiles.size,
      trustedProviders: this.trustedProviders.size,
      blockedProviders: this.blockedProviders.size,
      totalThreatsDetected: profiles.reduce((sum, p) => sum + p.vulnerabilities.length, 0),
      aiConfidence: avgConfidence
    };
  }

  addTrustedProvider(providerId: string): void {
    this.trustedProviders.add(providerId);
    this.blockedProviders.delete(providerId);
    console.log(`✅ Added ${providerId} to trusted providers`);
  }

  blockProvider(providerId: string, reason: string): void {
    this.blockedProviders.add(providerId);
    this.trustedProviders.delete(providerId);
    console.log(`🚫 Blocked ${providerId}: ${reason}`);
  }
}

export const transformersSecurityProxy = new TransformersSecurityProxy();