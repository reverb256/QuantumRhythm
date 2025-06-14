/**
 * Quincy's Solana RPC Manager - Multi-endpoint rotation with rate limiting
 * Prevents 429 errors and ensures reliable blockchain data access
 */

interface RPCEndpoint {
  url: string;
  tier: 'free' | 'premium';
  requests_per_minute: number;
  last_request: number;
  request_count: number;
}

export class SolanaRPCManager {
  private endpoints: RPCEndpoint[] = [
    {
      url: 'https://api.mainnet-beta.solana.com',
      tier: 'free',
      requests_per_minute: 5,
      last_request: 0,
      request_count: 0
    },
    {
      url: 'https://solana-mainnet.rpc.extrnode.com',
      tier: 'free',
      requests_per_minute: 10,
      last_request: 0,
      request_count: 0
    },
    {
      url: 'https://rpc.ankr.com/solana',
      tier: 'free',
      requests_per_minute: 10,
      last_request: 0,
      request_count: 0
    },
    {
      url: 'https://solana.public-rpc.com',
      tier: 'free',
      requests_per_minute: 8,
      last_request: 0,
      request_count: 0
    }
  ];

  private current_endpoint_index = 0;

  async makeRequest(method: string, params: any[]): Promise<any> {
    const max_attempts = this.endpoints.length;
    let attempts = 0;

    while (attempts < max_attempts) {
      const endpoint = this.getNextAvailableEndpoint();
      
      if (!endpoint) {
        console.log('🔄 All RPC endpoints rate limited, waiting 60 seconds...');
        await this.wait(60000);
        this.resetRequestCounts();
        continue;
      }

      try {
        const response = await this.requestToEndpoint(endpoint, method, params);
        return response;
      } catch (error: any) {
        if (error.response?.status === 429) {
          console.log(`⚠️ Rate limit hit on ${endpoint.url}, rotating to next endpoint`);
          endpoint.request_count = endpoint.requests_per_minute; // Mark as exhausted
          attempts++;
          continue;
        } else {
          throw error;
        }
      }
    }

    throw new Error('All RPC endpoints exhausted');
  }

  private getNextAvailableEndpoint(): RPCEndpoint | null {
    const now = Date.now();
    
    // Check if enough time has passed to reset request counts
    for (const endpoint of this.endpoints) {
      if (now - endpoint.last_request > 60000) {
        endpoint.request_count = 0;
      }
    }

    // Find an available endpoint
    for (let i = 0; i < this.endpoints.length; i++) {
      const index = (this.current_endpoint_index + i) % this.endpoints.length;
      const endpoint = this.endpoints[index];
      
      if (endpoint.request_count < endpoint.requests_per_minute) {
        this.current_endpoint_index = index;
        return endpoint;
      }
    }

    return null;
  }

  private async requestToEndpoint(endpoint: RPCEndpoint, method: string, params: any[]): Promise<any> {
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: method,
      params: params
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Update endpoint usage
      endpoint.request_count++;
      endpoint.last_request = Date.now();

      if (data.error) {
        throw new Error(`RPC Error: ${data.error.message}`);
      }

      return data.result;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout for ${endpoint.url}`);
      }
      throw error;
    }
  }

  private resetRequestCounts(): void {
    this.endpoints.forEach(endpoint => {
      endpoint.request_count = 0;
    });
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getBalance(publicKey: string): Promise<number> {
    try {
      const balance = await this.makeRequest('getBalance', [publicKey]);
      return balance.value / 1000000000; // Convert lamports to SOL
    } catch (error) {
      console.error('❌ Failed to get balance:', error);
      return 0;
    }
  }

  async getTokenAccounts(publicKey: string): Promise<any[]> {
    try {
      const accounts = await this.makeRequest('getTokenAccountsByOwner', [
        publicKey,
        { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
        { encoding: 'jsonParsed' }
      ]);
      return accounts.value || [];
    } catch (error) {
      console.error('❌ Failed to get token accounts:', error);
      return [];
    }
  }

  async getRecentTransactions(publicKey: string, limit: number = 10): Promise<any[]> {
    try {
      const signatures = await this.makeRequest('getSignaturesForAddress', [
        publicKey,
        { limit }
      ]);
      
      const transactions = [];
      for (const sig of signatures.slice(0, 3)) { // Limit to 3 to avoid rate limits
        try {
          const tx = await this.makeRequest('getTransaction', [
            sig.signature,
            { encoding: 'jsonParsed' }
          ]);
          if (tx) {
            transactions.push(tx);
          }
        } catch (error) {
          console.error(`Failed to get transaction ${sig.signature}:`, error);
        }
      }
      
      return transactions;
    } catch (error) {
      console.error('❌ Failed to get recent transactions:', error);
      return [];
    }
  }
}

export const solanaRPC = new SolanaRPCManager();