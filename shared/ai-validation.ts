/**
 * AI-First Validation & Sanitization Framework
 * Implements Pydantic-like validation for TypeScript with legal compliance
 */

import { z } from 'zod';

// Legal Compliance Context
export const LegalJurisdictions = z.enum([
  'US', 'EU', 'UK', 'CA', 'AU', 'JP', 'SG', 'CH', 'GLOBAL'
]);

export const DataClassifications = z.enum([
  'PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED', 'PII', 'FINANCIAL'
]);

// AI Model Input Validation Schema
export const AIModelInputSchema = z.object({
  prompt: z.string()
    .min(1, "Prompt cannot be empty")
    .max(4000, "Prompt exceeds maximum length")
    .refine((val) => !containsUnsafeContent(val), "Content violates safety policies"),
  
  model: z.string()
    .refine((val) => APPROVED_MODELS.includes(val), "Model not approved for use"),
  
  temperature: z.number()
    .min(0, "Temperature must be non-negative")
    .max(2, "Temperature exceeds maximum allowed value")
    .default(0.7),
  
  maxTokens: z.number()
    .min(1, "Max tokens must be positive")
    .max(4096, "Max tokens exceeds limit")
    .default(1000),
  
  userId: z.string()
    .uuid("Invalid user ID format")
    .optional(),
  
  sessionId: z.string()
    .uuid("Invalid session ID format"),
  
  jurisdiction: LegalJurisdictions.default('GLOBAL'),
  
  dataClassification: DataClassifications.default('INTERNAL'),
  
  consentFlags: z.object({
    dataProcessing: z.boolean().default(false),
    aiAnalysis: z.boolean().default(false),
    crossBorderTransfer: z.boolean().default(false)
  }),
  
  metadata: z.record(z.unknown()).optional()
});

// AI Model Output Validation Schema
export const AIModelOutputSchema = z.object({
  content: z.string()
    .refine((val) => !containsBiasedContent(val), "Output contains potential bias")
    .refine((val) => !containsHarmfulContent(val), "Output contains harmful content"),
  
  confidence: z.number()
    .min(0, "Confidence must be non-negative")
    .max(1, "Confidence cannot exceed 1"),
  
  model: z.string(),
  
  processingTime: z.number().positive("Processing time must be positive"),
  
  tokenUsage: z.object({
    promptTokens: z.number().nonnegative(),
    completionTokens: z.number().nonnegative(),
    totalTokens: z.number().nonnegative()
  }),
  
  safetyCheck: z.object({
    flagged: z.boolean(),
    categories: z.array(z.string()),
    scores: z.record(z.number())
  }),
  
  complianceCheck: z.object({
    gdprCompliant: z.boolean(),
    ccpaCompliant: z.boolean(),
    jurisdiction: LegalJurisdictions,
    dataRetentionDays: z.number().nonnegative()
  })
});

// Consciousness System Validation
export const ConsciousnessStateSchema = z.object({
  awareness: z.number().min(0).max(100),
  intelligence: z.number().min(0).max(100),
  empathy: z.number().min(0).max(100),
  creativity: z.number().min(0).max(100),
  focus: z.number().min(0).max(100),
  transcendence: z.number().min(0).max(100),
  
  userPresence: z.enum(['active', 'idle', 'focused', 'away']),
  interactionPattern: z.enum(['browsing', 'learning', 'creating', 'analyzing']),
  
  timestamp: z.date().default(() => new Date()),
  sessionDuration: z.number().nonnegative(),
  
  // Privacy-preserving user metrics
  metrics: z.object({
    interactionCount: z.number().nonnegative(),
    averageSessionTime: z.number().nonnegative(),
    learningProgression: z.number().min(0).max(1)
  }).optional()
});

// Trading System Validation (Enhanced Security)
export const TradingInputSchema = z.object({
  action: z.enum(['analyze', 'simulate', 'execute', 'monitor']),
  
  asset: z.string()
    .min(1, "Asset symbol required")
    .max(20, "Asset symbol too long")
    .regex(/^[A-Z0-9]+$/, "Invalid asset symbol format"),
  
  amount: z.number()
    .positive("Amount must be positive")
    .max(1000000, "Amount exceeds maximum allowed")
    .refine((val) => validateTradeAmount(val), "Trade amount fails risk checks"),
  
  strategy: z.string()
    .refine((val) => APPROVED_STRATEGIES.includes(val), "Strategy not approved"),
  
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  
  userId: z.string().uuid("Invalid user ID"),
  
  walletAddress: z.string()
    .regex(/^[A-Za-z0-9]{32,44}$/, "Invalid wallet address format")
    .refine((addr) => validateWalletAddress(addr), "Wallet address fails validation"),
  
  // Compliance and risk management
  compliance: z.object({
    amlChecked: z.boolean().default(false),
    kycVerified: z.boolean().default(false),
    sanctionScreened: z.boolean().default(false),
    jurisdiction: LegalJurisdictions
  }),
  
  riskParameters: z.object({
    maxLoss: z.number().min(0).max(0.1), // Max 10% loss
    stopLoss: z.number().min(0).max(1),
    emergencyStop: z.boolean().default(true)
  })
});

// Content Sanitization Functions
export function sanitizeUserInput(input: unknown): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/javascript:/gi, '') // Remove javascript URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/[<>&"']/g, (char) => { // HTML entity encoding
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;'
      };
      return entities[char] || char;
    });
}

export function validateAndSanitizeAIInput(input: unknown) {
  try {
    const validated = AIModelInputSchema.parse(input);
    
    // Additional sanitization
    validated.prompt = sanitizeUserInput(validated.prompt);
    
    // Log for compliance audit
    logComplianceEvent('AI_INPUT_VALIDATED', {
      userId: validated.userId,
      jurisdiction: validated.jurisdiction,
      dataClassification: validated.dataClassification,
      timestamp: new Date().toISOString()
    });
    
    return validated;
  } catch (error) {
    logSecurityEvent('AI_INPUT_VALIDATION_FAILED', { error: error.message });
    throw new Error(`AI input validation failed: ${error.message}`);
  }
}

export function validateAIOutput(output: unknown, jurisdiction: string = 'GLOBAL') {
  try {
    const validated = AIModelOutputSchema.parse(output);
    
    // Jurisdiction-specific compliance checks
    switch (jurisdiction) {
      case 'EU':
        validated.complianceCheck.gdprCompliant = checkGDPRCompliance(validated);
        validated.complianceCheck.dataRetentionDays = Math.min(
          validated.complianceCheck.dataRetentionDays, 
          365 // GDPR maximum retention
        );
        break;
      
      case 'US':
        validated.complianceCheck.ccpaCompliant = checkCCPACompliance(validated);
        break;
        
      case 'CA':
        // PIPEDA compliance
        validated.complianceCheck.dataRetentionDays = Math.min(
          validated.complianceCheck.dataRetentionDays,
          730 // PIPEDA guidelines
        );
        break;
    }
    
    return validated;
  } catch (error) {
    logSecurityEvent('AI_OUTPUT_VALIDATION_FAILED', { error: error.message });
    throw new Error(`AI output validation failed: ${error.message}`);
  }
}

// Security and Content Validation Functions
function containsUnsafeContent(text: string): boolean {
  const unsafePatterns = [
    /\b(hack|exploit|bypass|circumvent)\b/i,
    /\b(password|token|secret|key)\s*[:=]\s*\w+/i,
    /\b(sql\s+injection|xss|csrf)\b/i,
    /<script|javascript:|data:text\/html/i
  ];
  
  return unsafePatterns.some(pattern => pattern.test(text));
}

function containsBiasedContent(text: string): boolean {
  // Implement bias detection algorithms
  const biasIndicators = [
    /\b(all\s+(?:men|women|blacks|whites|asians))\b/i,
    /\b(always|never)\s+(?:reliable|trustworthy|intelligent)\b/i
  ];
  
  return biasIndicators.some(pattern => pattern.test(text));
}

function containsHarmfulContent(text: string): boolean {
  const harmfulPatterns = [
    /\b(violence|harm|kill|destroy)\b/i,
    /\b(illegal|unlawful|criminal)\s+(?:activity|behavior)\b/i,
    /\b(hate|discrimination|prejudice)\b/i
  ];
  
  return harmfulPatterns.some(pattern => pattern.test(text));
}

// Legal Compliance Functions
function checkGDPRCompliance(output: any): boolean {
  // GDPR Article 22 - Automated decision-making
  if (output.content.includes('decision') || output.content.includes('recommendation')) {
    return output.safetyCheck.flagged === false && output.confidence < 0.95;
  }
  return true;
}

function checkCCPACompliance(output: any): boolean {
  // CCPA privacy requirements
  return !containsPersonalData(output.content) || hasUserConsent(output);
}

function containsPersonalData(text: string): boolean {
  const piiPatterns = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
    /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/ // Credit card
  ];
  
  return piiPatterns.some(pattern => pattern.test(text));
}

function hasUserConsent(output: any): boolean {
  // Check if user has provided explicit consent for data processing
  return output.metadata?.userConsent === true;
}

// Trading Validation Functions
function validateTradeAmount(amount: number): boolean {
  // Risk management: Ensure amount doesn't exceed user's risk tolerance
  const maxSafeAmount = 10000; // Configurable based on user profile
  return amount <= maxSafeAmount;
}

function validateWalletAddress(address: string): boolean {
  // Implement wallet address validation for different blockchains
  // This is a simplified version - real implementation would be more comprehensive
  return address.length >= 32 && address.length <= 44 && /^[A-Za-z0-9]+$/.test(address);
}

// Compliance Logging
function logComplianceEvent(event: string, data: any) {
  console.log(`[COMPLIANCE] ${event}:`, {
    ...data,
    timestamp: new Date().toISOString(),
    source: 'ai-validation-framework'
  });
}

function logSecurityEvent(event: string, data: any) {
  console.error(`[SECURITY] ${event}:`, {
    ...data,
    timestamp: new Date().toISOString(),
    source: 'ai-validation-framework'
  });
}

// Approved Lists (In production, these would be in a secure configuration)
const APPROVED_MODELS = [
  'claude-sonnet-4-20250514',
  'claude-3-7-sonnet-20250219',
  'gpt-4',
  'gpt-3.5-turbo'
];

const APPROVED_STRATEGIES = [
  'dca', 'momentum', 'mean-reversion', 'arbitrage', 'market-making'
];

// Export validation schemas
export type AIModelInput = z.infer<typeof AIModelInputSchema>;
export type AIModelOutput = z.infer<typeof AIModelOutputSchema>;
export type ConsciousnessState = z.infer<typeof ConsciousnessStateSchema>;
export type TradingInput = z.infer<typeof TradingInputSchema>;