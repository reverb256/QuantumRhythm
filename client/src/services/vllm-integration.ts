/**
 * VLLM Integration Service
 * Local AI model serving with optimal performance
 */

interface VLLMConfig {
  baseURL: string;
  models: string[];
  timeout: number;
}

interface VLLMResponse {
  content: string;
  confidence: number;
  processingTime: number;
  model: string;
}

export class VLLMService {
  private config: VLLMConfig;
  private isAvailable = false;

  constructor(config: VLLMConfig) {
    this.config = config;
    this.checkAvailability();
  }

  async checkAvailability(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(`${this.config.baseURL}/health`, {
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

  async generateResponse(prompt: string, model?: string): Promise<VLLMResponse> {
    if (!this.isAvailable) {
      throw new Error('VLLM service not available');
    }

    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.config.baseURL}/v1/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model || this.config.models[0],
          prompt,
          max_tokens: 500,
          temperature: 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`VLLM API error: ${response.status}`);
      }

      const data = await response.json();
      const processingTime = Date.now() - startTime;

      return {
        content: data.choices?.[0]?.text || '',
        confidence: 0.95, // VLLM typically high confidence
        processingTime,
        model: model || this.config.models[0]
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`VLLM generation failed: ${errorMessage}`);
    }
  }

  async getModelList(): Promise<string[]> {
    try {
      const response = await fetch(`${this.config.baseURL}/v1/models`);
      if (!response.ok) return this.config.models;
      
      const data = await response.json();
      return data.data?.map((model: any) => model.id) || this.config.models;
    } catch {
      return this.config.models;
    }
  }

  isOnline(): boolean {
    return this.isAvailable;
  }
}

// Factory function
export function createVLLMService(): VLLMService {
  const config: VLLMConfig = {
    baseURL: 'http://localhost:8000',
    models: ['mistral-7b-instruct', 'llama2-13b-chat'],
    timeout: 30000
  };

  return new VLLMService(config);
}