
export class IntelligentRateLimiter {
  private requestQueue: Map<string, number[]> = new Map();
  private backoffDelays: Map<string, number> = new Map();

  async makeRequest(url: string, options: any = {}): Promise<any> {
    const domain = new URL(url).hostname;
    const now = Date.now();
    
    // Check rate limit
    const requests = this.requestQueue.get(domain) || [];
    const recentRequests = requests.filter(time => now - time < 60000);
    
    if (recentRequests.length > 10) {
      const delay = this.backoffDelays.get(domain) || 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      this.backoffDelays.set(domain, Math.min(delay * 2, 30000));
    }
    
    // Make request
    try {
      const response = await fetch(url, options);
      if (response.status === 429) {
        throw new Error('Rate limited');
      }
      
      // Reset backoff on success
      this.backoffDelays.set(domain, 1000);
      
      // Track request
      recentRequests.push(now);
      this.requestQueue.set(domain, recentRequests);
      
      return response;
    } catch (error) {
      // Increase backoff on error
      const delay = this.backoffDelays.get(domain) || 1000;
      this.backoffDelays.set(domain, Math.min(delay * 1.5, 30000));
      throw error;
    }
  }
}