/**
 * Perplexica/SearXNG Integration Service
 * Web-enhanced AI search and analysis
 */

interface PerplexicaConfig {
  perplexicaURL: string;
  searxngURL: string;
  timeout: number;
}

interface SearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

interface PerplexicaResponse {
  answer: string;
  sources: SearchResult[];
  confidence: number;
  processingTime: number;
}

export class PerplexicaService {
  private config: PerplexicaConfig;
  private isAvailable = false;

  constructor(config: PerplexicaConfig) {
    this.config = config;
    this.checkAvailability();
  }

  async checkAvailability(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(`${this.config.perplexicaURL}/api/health`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      this.isAvailable = response.ok;
      return this.isAvailable;
    } catch {
      this.isAvailable = false;
      return false;
    }
  }

  async searchWithAnalysis(query: string): Promise<PerplexicaResponse> {
    if (!this.isAvailable) {
      throw new Error('Perplexica service not available');
    }

    const startTime = Date.now();
    
    try {
      // First, get search results from SearXNG
      const searchResults = await this.searchSearXNG(query);
      
      // Then, analyze with Perplexica
      const response = await fetch(`${this.config.perplexicaURL}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          search_results: searchResults,
          mode: 'balanced',
          focus: 'web'
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexica API error: ${response.status}`);
      }

      const data = await response.json();
      const processingTime = Date.now() - startTime;

      return {
        answer: data.response || data.answer || '',
        sources: data.sources || searchResults,
        confidence: data.confidence || 0.8,
        processingTime
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Perplexica search failed: ${errorMessage}`);
    }
  }

  private async searchSearXNG(query: string): Promise<SearchResult[]> {
    try {
      const searchURL = new URL(`${this.config.searxngURL}/search`);
      searchURL.searchParams.set('q', query);
      searchURL.searchParams.set('format', 'json');
      searchURL.searchParams.set('categories', 'general');
      
      const response = await fetch(searchURL.toString());
      
      if (!response.ok) {
        throw new Error(`SearXNG error: ${response.status}`);
      }

      const data = await response.json();
      
      return (data.results || [])
        .slice(0, 10)
        .map((result: any) => ({
          title: result.title || '',
          url: result.url || '',
          content: result.content || '',
          score: result.score || 0
        }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn('[SEARXNG] Search failed:', errorMessage);
      return [];
    }
  }

  async getWebInsights(topic: string): Promise<string[]> {
    try {
      const response = await this.searchWithAnalysis(topic);
      return [
        response.answer,
        ...response.sources.slice(0, 3).map(s => s.content)
      ].filter(Boolean);
    } catch (error) {
      console.error('[PERPLEXICA] Web insights failed:', error);
      return [];
    }
  }

  isOnline(): boolean {
    return this.isAvailable;
  }
}

// Factory function
export function createPerplexicaService(): PerplexicaService {
  const config: PerplexicaConfig = {
    perplexicaURL: 'http://localhost:3001',
    searxngURL: 'http://localhost:8080',
    timeout: 30000
  };

  return new PerplexicaService(config);
}