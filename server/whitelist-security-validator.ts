/**
 * Whitelist Security Validator - Authorized Addresses Only
 * Enforces strict whitelist compliance across all trading operations
 */

interface WhitelistConfig {
  solanaAddress: string;
  cronosAddress: string;
  isValidated: boolean;
  lastValidation: number;
}

interface SecurityValidation {
  isValid: boolean;
  address: string;
  chain: string;
  reason: string;
  timestamp: number;
}

export class WhitelistSecurityValidator {
  private authorizedAddresses: WhitelistConfig;
  private validationHistory: SecurityValidation[] = [];
  private strictMode: boolean = true;

  constructor() {
    this.authorizedAddresses = {
      solanaAddress: 'IBOWORKBUY4444',
      cronosAddress: 'fTbbyyaarrIocubu',
      isValidated: true,
      lastValidation: Date.now()
    };
  }

  validateAddress(address: string, chain: string): SecurityValidation {
    const validation: SecurityValidation = {
      isValid: false,
      address,
      chain,
      reason: '',
      timestamp: Date.now()
    };

    // Check against authorized addresses
    if (chain.toLowerCase() === 'solana' && address === this.authorizedAddresses.solanaAddress) {
      validation.isValid = true;
      validation.reason = 'Authorized Solana address verified';
    } else if (chain.toLowerCase() === 'cronos' && address === this.authorizedAddresses.cronosAddress) {
      validation.isValid = true;
      validation.reason = 'Authorized Cronos address verified';
    } else {
      validation.isValid = false;
      validation.reason = `Unauthorized address blocked - not in whitelist`;
    }

    // Store validation history
    this.validationHistory.push(validation);
    if (this.validationHistory.length > 1000) {
      this.validationHistory.shift(); // Keep last 1000 validations
    }

    return validation;
  }

  validateTransaction(toAddress: string, chain: string, amount: number): {
    approved: boolean;
    reason: string;
    securityLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  } {
    const addressValidation = this.validateAddress(toAddress, chain);
    
    if (!addressValidation.isValid) {
      console.log(`🚫 TRANSACTION BLOCKED: ${toAddress} on ${chain}`);
      console.log(`   Reason: ${addressValidation.reason}`);
      return {
        approved: false,
        reason: addressValidation.reason,
        securityLevel: 'HIGH'
      };
    }

    console.log(`✅ TRANSACTION APPROVED: ${toAddress} on ${chain}`);
    console.log(`   Amount: ${amount} | Security: VERIFIED`);
    
    return {
      approved: true,
      reason: 'Address verified on whitelist',
      securityLevel: 'HIGH'
    };
  }

  getAuthorizedAddresses(): { solana: string; cronos: string } {
    return {
      solana: this.authorizedAddresses.solanaAddress,
      cronos: this.authorizedAddresses.cronosAddress
    };
  }

  getWhitelistStatus(): {
    totalValidations: number;
    approvedTransactions: number;
    blockedTransactions: number;
    securityLevel: string;
    lastValidation: string;
  } {
    const approved = this.validationHistory.filter(v => v.isValid).length;
    const blocked = this.validationHistory.filter(v => !v.isValid).length;

    return {
      totalValidations: this.validationHistory.length,
      approvedTransactions: approved,
      blockedTransactions: blocked,
      securityLevel: this.strictMode ? 'MAXIMUM' : 'STANDARD',
      lastValidation: new Date(this.authorizedAddresses.lastValidation).toISOString()
    };
  }

  enforceWhitelistCompliance(): void {
    console.log('🔐 ENFORCING WHITELIST SECURITY COMPLIANCE');
    console.log('==========================================');
    console.log(`   Solana Authorized: ${this.authorizedAddresses.solanaAddress}`);
    console.log(`   Cronos Authorized: ${this.authorizedAddresses.cronosAddress}`);
    console.log(`   Security Mode: ${this.strictMode ? 'STRICT' : 'STANDARD'}`);
    console.log(`   Validation History: ${this.validationHistory.length} entries`);
    
    const status = this.getWhitelistStatus();
    console.log(`   Approved: ${status.approvedTransactions} | Blocked: ${status.blockedTransactions}`);
  }

  // For integration with trading systems
  isAddressAuthorized(address: string, chain: string): boolean {
    const validation = this.validateAddress(address, chain);
    return validation.isValid;
  }

  // Security audit report
  generateSecurityAudit(): {
    compliance: 'COMPLIANT' | 'VIOLATION';
    authorizedAddresses: number;
    securityIncidents: number;
    recommendations: string[];
  } {
    const incidents = this.validationHistory.filter(v => !v.isValid).length;
    
    return {
      compliance: incidents === 0 ? 'COMPLIANT' : 'VIOLATION',
      authorizedAddresses: 2, // Only the two specified addresses
      securityIncidents: incidents,
      recommendations: [
        'Maintain strict whitelist enforcement',
        'Monitor all transaction validations',
        'Regular security audits recommended',
        'Zero-tolerance policy for unauthorized addresses'
      ]
    };
  }
}

export const whitelistValidator = new WhitelistSecurityValidator();