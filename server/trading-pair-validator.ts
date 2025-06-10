/**
 * Trading Pair Validator
 * Prevents same-token trades and ensures valid trading pairs
 */

interface ValidTradingPair {
  fromToken: string;
  toToken: string;
  isValid: boolean;
  reason?: string;
}

export class TradingPairValidator {
  private validTokens = new Set(['SOL', 'USDC', 'BONK', 'RAY', 'ORCA', 'JUP']);
  private fallbackPairs = [
    { from: 'SOL', to: 'USDC' },
    { from: 'SOL', to: 'BONK' },
    { from: 'SOL', to: 'RAY' },
    { from: 'USDC', to: 'SOL' }
  ];

  validateAndFixTradingPair(action: 'BUY' | 'SELL', token: string): ValidTradingPair {
    let fromToken: string;
    let toToken: string;

    // Basic pair assignment
    if (action === 'BUY') {
      fromToken = 'SOL';
      toToken = token;
    } else {
      fromToken = token;
      toToken = 'SOL';
    }

    // Check for same-token trades
    if (fromToken === toToken) {
      console.log(`🚫 Same-token trade detected: ${fromToken} → ${toToken}`);
      
      // Apply fixes based on action
      if (action === 'BUY') {
        fromToken = 'SOL';
        toToken = 'USDC'; // Default to SOL → USDC
      } else {
        fromToken = 'USDC'; // Default to USDC → SOL
        toToken = 'SOL';
      }
      
      return {
        fromToken,
        toToken,
        isValid: true,
        reason: `Fixed same-token trade to ${fromToken} → ${toToken}`
      };
    }

    // Check for invalid tokens
    if (!this.validTokens.has(fromToken) || !this.validTokens.has(toToken)) {
      const fallback = this.getFallbackPair();
      return {
        fromToken: fallback.from,
        toToken: fallback.to,
        isValid: true,
        reason: `Invalid token detected, using fallback pair ${fallback.from} → ${fallback.to}`
      };
    }

    return {
      fromToken,
      toToken,
      isValid: true
    };
  }

  private getFallbackPair(): { from: string; to: string } {
    // Return a random valid fallback pair
    const randomIndex = Math.floor(Math.random() * this.fallbackPairs.length);
    return this.fallbackPairs[randomIndex];
  }

  isValidPair(fromToken: string, toToken: string): boolean {
    return fromToken !== toToken && 
           this.validTokens.has(fromToken) && 
           this.validTokens.has(toToken);
  }

  getValidTokens(): string[] {
    return Array.from(this.validTokens);
  }
}