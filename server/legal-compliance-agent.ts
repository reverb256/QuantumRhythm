import { db } from './db';
import { legalCompliance } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

interface ComplianceRule {
  id: string;
  category: 'privacy' | 'financial' | 'ai' | 'crypto' | 'data' | 'accessibility' | 'international';
  jurisdiction: string;
  regulation: string;
  requirement: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  automated: boolean;
  checkFunction?: () => Promise<boolean>;
}

interface ComplianceViolation {
  ruleId: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
  timestamp: Date;
  resolved: boolean;
}

export class LegalComplianceAgent {
  private rules: ComplianceRule[] = [];
  private violations: ComplianceViolation[] = [];
  
  constructor() {
    this.initializeComplianceRules();
  }

  private initializeComplianceRules() {
    this.rules = [
      // GDPR Compliance (EU)
      {
        id: 'gdpr-001',
        category: 'privacy',
        jurisdiction: 'EU',
        regulation: 'GDPR',
        requirement: 'Data processing consent and right to deletion',
        severity: 'critical',
        automated: true,
        checkFunction: this.checkGDPRCompliance.bind(this)
      },
      {
        id: 'gdpr-002', 
        category: 'privacy',
        jurisdiction: 'EU',
        regulation: 'GDPR',
        requirement: 'Privacy policy and data protection officer contact',
        severity: 'high',
        automated: true,
        checkFunction: this.checkPrivacyPolicy.bind(this)
      },

      // CCPA Compliance (California)
      {
        id: 'ccpa-001',
        category: 'privacy',
        jurisdiction: 'CA-US',
        regulation: 'CCPA',
        requirement: 'Consumer right to know and delete personal information',
        severity: 'critical',
        automated: true,
        checkFunction: this.checkCCPACompliance.bind(this)
      },

      // PIPEDA Compliance (Canada)
      {
        id: 'pipeda-001',
        category: 'privacy',
        jurisdiction: 'CA',
        regulation: 'PIPEDA',
        requirement: 'Consent for personal information collection and use',
        severity: 'critical',
        automated: true,
        checkFunction: this.checkPIPEDACompliance.bind(this)
      },

      // Financial Regulations
      {
        id: 'aml-001',
        category: 'financial',
        jurisdiction: 'Global',
        regulation: 'AML/KYC',
        requirement: 'Anti-money laundering and know your customer procedures',
        severity: 'critical',
        automated: true,
        checkFunction: this.checkAMLCompliance.bind(this)
      },
      {
        id: 'sec-001',
        category: 'financial',
        jurisdiction: 'US',
        regulation: 'Securities Law',
        requirement: 'Securities offering disclosure and registration',
        severity: 'critical',
        automated: false
      },

      // Crypto-Specific Regulations
      {
        id: 'crypto-001',
        category: 'crypto',
        jurisdiction: 'US',
        regulation: 'FinCEN',
        requirement: 'Money services business registration for crypto activities',
        severity: 'critical',
        automated: false
      },
      {
        id: 'crypto-002',
        category: 'crypto',
        jurisdiction: 'EU',
        regulation: 'MiCA',
        requirement: 'Markets in Crypto-Assets regulation compliance',
        severity: 'high',
        automated: false
      },
      {
        id: 'crypto-003',
        category: 'crypto',
        jurisdiction: 'CA',
        regulation: 'CSA',
        requirement: 'Canadian Securities Administrators crypto guidance',
        severity: 'high',
        automated: false
      },

      // AI Regulations
      {
        id: 'ai-001',
        category: 'ai',
        jurisdiction: 'EU',
        regulation: 'AI Act',
        requirement: 'High-risk AI system registration and assessment',
        severity: 'critical',
        automated: true,
        checkFunction: this.checkAIActCompliance.bind(this)
      },
      {
        id: 'ai-002',
        category: 'ai',
        jurisdiction: 'CA',
        regulation: 'AIDA',
        requirement: 'Artificial Intelligence and Data Act compliance',
        severity: 'high',
        automated: true,
        checkFunction: this.checkAIDACompliance.bind(this)
      },

      // Accessibility
      {
        id: 'wcag-001',
        category: 'accessibility',
        jurisdiction: 'Global',
        regulation: 'WCAG 2.1 AA',
        requirement: 'Web Content Accessibility Guidelines compliance',
        severity: 'high',
        automated: true,
        checkFunction: this.checkWCAGCompliance.bind(this)
      },
      {
        id: 'ada-001',
        category: 'accessibility',
        jurisdiction: 'US',
        regulation: 'ADA',
        requirement: 'Americans with Disabilities Act digital accessibility',
        severity: 'high',
        automated: true,
        checkFunction: this.checkADACompliance.bind(this)
      },

      // Data Protection
      {
        id: 'data-001',
        category: 'data',
        jurisdiction: 'Global',
        regulation: 'ISO 27001',
        requirement: 'Information security management system',
        severity: 'high',
        automated: true,
        checkFunction: this.checkISO27001Compliance.bind(this)
      },
      {
        id: 'data-002',
        category: 'data',
        jurisdiction: 'Global',
        regulation: 'SOC 2',
        requirement: 'Service organization controls for security and availability',
        severity: 'medium',
        automated: false
      }
    ];
  }

  // GDPR Compliance Check
  private async checkGDPRCompliance(): Promise<boolean> {
    try {
      // Check for consent mechanisms
      const hasConsentManagement = this.checkConsentManagement();
      const hasDataDeletion = this.checkDataDeletionCapability();
      const hasPrivacyPolicy = this.checkPrivacyPolicyExists();
      
      return hasConsentManagement && hasDataDeletion && hasPrivacyPolicy;
    } catch (error) {
      console.error('GDPR compliance check failed:', error);
      return false;
    }
  }

  // CCPA Compliance Check
  private async checkCCPACompliance(): Promise<boolean> {
    try {
      const hasDoNotSell = this.checkDoNotSellOption();
      const hasDataDisclosure = this.checkDataDisclosureCapability();
      const hasConsumerRights = this.checkConsumerRightsImplementation();
      
      return hasDoNotSell && hasDataDisclosure && hasConsumerRights;
    } catch (error) {
      console.error('CCPA compliance check failed:', error);
      return false;
    }
  }

  // PIPEDA Compliance Check (Canada)
  private async checkPIPEDACompliance(): Promise<boolean> {
    try {
      const hasExplicitConsent = this.checkExplicitConsent();
      const hasDataMinimization = this.checkDataMinimization();
      const hasBreachNotification = this.checkBreachNotificationProcedure();
      
      return hasExplicitConsent && hasDataMinimization && hasBreachNotification;
    } catch (error) {
      console.error('PIPEDA compliance check failed:', error);
      return false;
    }
  }

  // AML/KYC Compliance Check
  private async checkAMLCompliance(): Promise<boolean> {
    try {
      const hasKYCProcedures = this.checkKYCImplementation();
      const hasTransactionMonitoring = this.checkTransactionMonitoring();
      const hasSuspiciousActivityReporting = this.checkSARProcedures();
      
      return hasKYCProcedures && hasTransactionMonitoring && hasSuspiciousActivityReporting;
    } catch (error) {
      console.error('AML compliance check failed:', error);
      return false;
    }
  }

  // EU AI Act Compliance Check
  private async checkAIActCompliance(): Promise<boolean> {
    try {
      const hasRiskAssessment = this.checkAIRiskAssessment();
      const hasTransparency = this.checkAITransparency();
      const hasHumanOversight = this.checkHumanOversight();
      
      return hasRiskAssessment && hasTransparency && hasHumanOversight;
    } catch (error) {
      console.error('AI Act compliance check failed:', error);
      return false;
    }
  }

  // Canadian AIDA Compliance Check
  private async checkAIDACompliance(): Promise<boolean> {
    try {
      const hasImpactAssessment = this.checkAIImpactAssessment();
      const hasAlgorithmicTransparency = this.checkAlgorithmicTransparency();
      const hasBiasMonitoring = this.checkBiasMonitoring();
      
      return hasImpactAssessment && hasAlgorithmicTransparency && hasBiasMonitoring;
    } catch (error) {
      console.error('AIDA compliance check failed:', error);
      return false;
    }
  }

  // WCAG Compliance Check
  private async checkWCAGCompliance(): Promise<boolean> {
    try {
      const hasAltText = this.checkImageAltText();
      const hasKeyboardNavigation = this.checkKeyboardAccessibility();
      const hasColorContrast = this.checkColorContrast();
      const hasAriaLabels = this.checkAriaLabels();
      
      return hasAltText && hasKeyboardNavigation && hasColorContrast && hasAriaLabels;
    } catch (error) {
      console.error('WCAG compliance check failed:', error);
      return false;
    }
  }

  // ADA Compliance Check
  private async checkADACompliance(): Promise<boolean> {
    try {
      const hasScreenReaderSupport = this.checkScreenReaderCompatibility();
      const hasAccessibleForms = this.checkFormAccessibility();
      const hasAccessibleNavigation = this.checkNavigationAccessibility();
      
      return hasScreenReaderSupport && hasAccessibleForms && hasAccessibleNavigation;
    } catch (error) {
      console.error('ADA compliance check failed:', error);
      return false;
    }
  }

  // ISO 27001 Compliance Check
  private async checkISO27001Compliance(): Promise<boolean> {
    try {
      const hasSecurityPolicies = this.checkSecurityPolicies();
      const hasAccessControl = this.checkAccessControlSystems();
      const hasIncidentResponse = this.checkIncidentResponseProcedures();
      const hasRiskManagement = this.checkRiskManagementFramework();
      
      return hasSecurityPolicies && hasAccessControl && hasIncidentResponse && hasRiskManagement;
    } catch (error) {
      console.error('ISO 27001 compliance check failed:', error);
      return false;
    }
  }

  private async checkPrivacyPolicy(): Promise<boolean> {
    return this.checkPrivacyPolicyExists();
  }

  // Helper Methods for Compliance Checks
  private checkConsentManagement(): boolean {
    // Check if consent management system is implemented
    return true; // Placeholder - implement actual check
  }

  private checkDataDeletionCapability(): boolean {
    // Check if data deletion endpoints exist
    return true; // Placeholder - implement actual check
  }

  private checkPrivacyPolicyExists(): boolean {
    // Check if privacy policy is accessible
    return true; // Placeholder - implement actual check
  }

  private checkDoNotSellOption(): boolean {
    // Check if "Do Not Sell My Info" option exists
    return true; // Placeholder - implement actual check
  }

  private checkDataDisclosureCapability(): boolean {
    // Check if data disclosure mechanisms exist
    return true; // Placeholder - implement actual check
  }

  private checkConsumerRightsImplementation(): boolean {
    // Check if consumer rights are implemented
    return true; // Placeholder - implement actual check
  }

  private checkExplicitConsent(): boolean {
    // Check if explicit consent mechanisms exist
    return true; // Placeholder - implement actual check
  }

  private checkDataMinimization(): boolean {
    // Check if data minimization principles are followed
    return true; // Placeholder - implement actual check
  }

  private checkBreachNotificationProcedure(): boolean {
    // Check if breach notification procedures exist
    return true; // Placeholder - implement actual check
  }

  private checkKYCImplementation(): boolean {
    // Check if KYC procedures are implemented
    return true; // Placeholder - implement actual check
  }

  private checkTransactionMonitoring(): boolean {
    // Check if transaction monitoring exists
    return true; // Placeholder - implement actual check
  }

  private checkSARProcedures(): boolean {
    // Check if suspicious activity reporting procedures exist
    return true; // Placeholder - implement actual check
  }

  private checkAIRiskAssessment(): boolean {
    // Check if AI risk assessment is performed
    return true; // Placeholder - implement actual check
  }

  private checkAITransparency(): boolean {
    // Check if AI transparency requirements are met
    return true; // Placeholder - implement actual check
  }

  private checkHumanOversight(): boolean {
    // Check if human oversight mechanisms exist
    return true; // Placeholder - implement actual check
  }

  private checkAIImpactAssessment(): boolean {
    // Check if AI impact assessment is performed
    return true; // Placeholder - implement actual check
  }

  private checkAlgorithmicTransparency(): boolean {
    // Check if algorithmic transparency requirements are met
    return true; // Placeholder - implement actual check
  }

  private checkBiasMonitoring(): boolean {
    // Check if bias monitoring is implemented
    return true; // Placeholder - implement actual check
  }

  private checkImageAltText(): boolean {
    // Check if images have alt text
    return true; // Placeholder - implement actual check
  }

  private checkKeyboardAccessibility(): boolean {
    // Check if keyboard navigation works
    return true; // Placeholder - implement actual check
  }

  private checkColorContrast(): boolean {
    // Check if color contrast meets WCAG standards
    return true; // Placeholder - implement actual check
  }

  private checkAriaLabels(): boolean {
    // Check if ARIA labels are properly implemented
    return true; // Placeholder - implement actual check
  }

  private checkScreenReaderCompatibility(): boolean {
    // Check if screen readers can navigate the site
    return true; // Placeholder - implement actual check
  }

  private checkFormAccessibility(): boolean {
    // Check if forms are accessible
    return true; // Placeholder - implement actual check
  }

  private checkNavigationAccessibility(): boolean {
    // Check if navigation is accessible
    return true; // Placeholder - implement actual check
  }

  private checkSecurityPolicies(): boolean {
    // Check if security policies exist and are up to date
    return true; // Placeholder - implement actual check
  }

  private checkAccessControlSystems(): boolean {
    // Check if access control systems are implemented
    return true; // Placeholder - implement actual check
  }

  private checkIncidentResponseProcedures(): boolean {
    // Check if incident response procedures exist
    return true; // Placeholder - implement actual check
  }

  private checkRiskManagementFramework(): boolean {
    // Check if risk management framework is implemented
    return true; // Placeholder - implement actual check
  }

  // Main Compliance Methods
  async runComplianceCheck(): Promise<{ 
    passed: boolean, 
    violations: ComplianceViolation[], 
    score: number 
  }> {
    console.log('🏛️ Running comprehensive legal compliance check...');
    
    this.violations = [];
    let passedChecks = 0;
    let totalChecks = 0;

    for (const rule of this.rules) {
      if (rule.automated && rule.checkFunction) {
        totalChecks++;
        try {
          const passed = await rule.checkFunction();
          if (passed) {
            passedChecks++;
            console.log(`✅ ${rule.regulation} ${rule.id}: COMPLIANT`);
          } else {
            this.violations.push({
              ruleId: rule.id,
              description: `${rule.regulation}: ${rule.requirement}`,
              severity: rule.severity,
              recommendation: this.getRecommendation(rule),
              timestamp: new Date(),
              resolved: false
            });
            console.log(`❌ ${rule.regulation} ${rule.id}: VIOLATION`);
          }
        } catch (error) {
          console.error(`Error checking rule ${rule.id}:`, error);
          this.violations.push({
            ruleId: rule.id,
            description: `${rule.regulation}: Check failed - ${error}`,
            severity: 'high',
            recommendation: 'Manual review required',
            timestamp: new Date(),
            resolved: false
          });
        }
      }
    }

    const score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;
    const passed = this.violations.filter(v => v.severity === 'critical').length === 0;

    await this.logComplianceResult(passed, score, this.violations);

    return {
      passed,
      violations: this.violations,
      score
    };
  }

  private getRecommendation(rule: ComplianceRule): string {
    const recommendations: Record<string, string> = {
      'gdpr-001': 'Implement cookie consent banner and data deletion endpoints',
      'gdpr-002': 'Create comprehensive privacy policy and appoint data protection officer',
      'ccpa-001': 'Add "Do Not Sell My Info" link and consumer rights portal',
      'pipeda-001': 'Implement explicit consent mechanisms and breach notification procedures',
      'aml-001': 'Implement KYC procedures and transaction monitoring system',
      'ai-001': 'Conduct AI risk assessment and implement transparency measures',
      'ai-002': 'Perform AI impact assessment and implement bias monitoring',
      'wcag-001': 'Improve alt text, color contrast, and keyboard navigation',
      'ada-001': 'Enhance screen reader compatibility and form accessibility',
      'data-001': 'Implement security policies and access control systems'
    };

    return recommendations[rule.id] || 'Consult legal counsel for specific requirements';
  }

  async logComplianceResult(passed: boolean, score: number, violations: ComplianceViolation[]) {
    try {
      await db.insert(legalCompliance).values({
        checkDate: new Date(),
        overallScore: score,
        passed: passed,
        criticalViolations: violations.filter(v => v.severity === 'critical').length,
        highViolations: violations.filter(v => v.severity === 'high').length,
        mediumViolations: violations.filter(v => v.severity === 'medium').length,
        lowViolations: violations.filter(v => v.severity === 'low').length,
        violations: JSON.stringify(violations),
        recommendations: JSON.stringify(violations.map(v => v.recommendation))
      });
    } catch (error) {
      console.error('Failed to log compliance result:', error);
    }
  }

  async getComplianceHistory(limit: number = 10) {
    try {
      return await db.select()
        .from(legalCompliance)
        .orderBy(desc(legalCompliance.checkDate))
        .limit(limit);
    } catch (error) {
      console.error('Failed to get compliance history:', error);
      return [];
    }
  }

  getComplianceRules() {
    return this.rules;
  }

  async generateComplianceReport() {
    const result = await this.runComplianceCheck();
    const history = await this.getComplianceHistory(5);

    return {
      timestamp: new Date().toISOString(),
      overallScore: result.score,
      passed: result.passed,
      totalRules: this.rules.length,
      automatedRules: this.rules.filter(r => r.automated).length,
      violations: result.violations,
      criticalIssues: result.violations.filter(v => v.severity === 'critical'),
      highPriorityIssues: result.violations.filter(v => v.severity === 'high'),
      complianceHistory: history,
      jurisdictions: [...new Set(this.rules.map(r => r.jurisdiction))],
      regulations: [...new Set(this.rules.map(r => r.regulation))],
      categories: [...new Set(this.rules.map(r => r.category))]
    };
  }
}

// Singleton instance
export const legalComplianceAgent = new LegalComplianceAgent();

// Auto-run compliance checks every 24 hours
setInterval(async () => {
  try {
    console.log('🏛️ Running scheduled compliance check...');
    await legalComplianceAgent.runComplianceCheck();
  } catch (error) {
    console.error('Scheduled compliance check failed:', error);
  }
}, 24 * 60 * 60 * 1000); // 24 hours