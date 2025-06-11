/**
 * GenAI Orchestrator - Comprehensive AI Integration System
 * Integrates multiple free AI repositories for anime generation, language models, and voice synthesis
 */

import { HfInference } from '@huggingface/inference';
import { pipeline, env } from '@xenova/transformers';

// Configure transformers to use local models
env.allowRemoteModels = false;
env.allowLocalModels = true;

interface GenAIProvider {
  name: string;
  type: 'image' | 'text' | 'voice' | 'multimodal';
  endpoint: string;
  free: boolean;
  rateLimit?: number;
}

interface AnimeGenerationRequest {
  prompt: string;
  character?: 'stelle' | 'march7th' | 'himeko' | 'kafka';
  style?: 'hoyoverse' | 'anime' | 'detailed';
  quality?: 'standard' | 'hd';
}

interface VoiceRequest {
  text: string;
  character: string;
  language?: 'en' | 'jp' | 'cn';
}

export class GenAIOrchestrator {
  private hf: HfInference;
  private providers: GenAIProvider[];
  private textPipeline: any = null;
  private imagePipeline: any = null;

  constructor() {
    this.hf = new HfInference();
    this.providers = this.initializeProviders();
    this.initializeLocalModels();
  }

  private initializeProviders(): GenAIProvider[] {
    return [
      // Image Generation - Free Services
      {
        name: 'Pollinations',
        type: 'image',
        endpoint: 'https://image.pollinations.ai/prompt',
        free: true,
        rateLimit: 100 // per hour
      },
      {
        name: 'Replicate (Free Tier)',
        type: 'image', 
        endpoint: 'https://replicate.com/api/predictions',
        free: true,
        rateLimit: 5 // per day
      },
      {
        name: 'Stability AI (Free)',
        type: 'image',
        endpoint: 'https://api.stability.ai/v1/generation',
        free: true,
        rateLimit: 25 // per month
      },
      {
        name: 'DALL-E Mini (Craiyon)',
        type: 'image',
        endpoint: 'https://backend.craiyon.com/generate',
        free: true,
        rateLimit: 50 // per hour
      },
      {
        name: 'DeepAI',
        type: 'image',
        endpoint: 'https://api.deepai.org/api/text2img',
        free: true,
        rateLimit: 100 // per month
      },

      // Text Generation - Free Services
      {
        name: 'Hugging Face Inference',
        type: 'text',
        endpoint: 'https://api-inference.huggingface.co/models',
        free: true,
        rateLimit: 1000 // per hour
      },
      {
        name: 'Together AI (Free)',
        type: 'text',
        endpoint: 'https://api.together.xyz/inference',
        free: true,
        rateLimit: 100 // per day
      },
      {
        name: 'Cohere (Free Tier)',
        type: 'text',
        endpoint: 'https://api.cohere.ai/generate',
        free: true,
        rateLimit: 100 // per month
      },
      {
        name: 'AI21 Labs (Free)',
        type: 'text',
        endpoint: 'https://api.ai21.com/studio/v1/j2-light/complete',
        free: true,
        rateLimit: 10000 // tokens per month
      },

      // Voice Synthesis - Free Services
      {
        name: 'Pollinations Voice',
        type: 'voice',
        endpoint: 'https://text-to-speech.pollinations.ai',
        free: true,
        rateLimit: 100 // per hour
      },
      {
        name: 'ElevenLabs (Free)',
        type: 'voice',
        endpoint: 'https://api.elevenlabs.io/v1/text-to-speech',
        free: true,
        rateLimit: 10000 // characters per month
      },
      {
        name: 'Murf AI (Free)',
        type: 'voice',
        endpoint: 'https://api.murf.ai/v1/speech/generate',
        free: true,
        rateLimit: 10 // minutes per month
      },

      // Multimodal - Free Services
      {
        name: 'GPT4All',
        type: 'multimodal',
        endpoint: 'local://gpt4all',
        free: true,
        rateLimit: 0
      },
      {
        name: 'LLaVA (Local)',
        type: 'multimodal',
        endpoint: 'local://llava',
        free: true,
        rateLimit: 0
      }
    ];
  }

  private async initializeLocalModels() {
    try {
      // Initialize text generation pipeline
      this.textPipeline = await pipeline('text-generation', 'Xenova/gpt2');
      
      // Initialize image-to-text pipeline for character analysis
      this.imagePipeline = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning');
      
      console.log('✅ Local AI models initialized successfully');
    } catch (error) {
      console.warn('⚠️ Local models failed to initialize, using remote fallbacks:', error);
    }
  }

  // Anime Image Generation
  async generateAnimeImage(request: AnimeGenerationRequest): Promise<string> {
    const enhancedPrompt = this.enhanceAnimePrompt(request);
    
    // Try Pollinations first (most reliable for anime)
    try {
      return await this.generateWithPollinations(enhancedPrompt);
    } catch (error) {
      console.warn('Pollinations failed, trying Hugging Face:', error);
      return await this.generateWithHuggingFace(enhancedPrompt);
    }
  }

  private enhanceAnimePrompt(request: AnimeGenerationRequest): string {
    const basePrompt = request.prompt;
    const characterStyles = {
      stelle: 'silver-haired girl with golden eyes, space-themed outfit, confident expression',
      march7th: 'pink-haired girl with blue eyes, energetic pose, colorful outfit',
      himeko: 'red-haired mature woman with amber eyes, elegant dress, warm smile',
      kafka: 'purple-haired woman with wine-red eyes, mysterious aura, dark elegant outfit'
    };

    const character = request.character ? characterStyles[request.character] : '';
    const style = request.style === 'hoyoverse' ? 
      'HoYoverse style, high quality anime art, detailed shading, vibrant colors' :
      'anime style, detailed illustration';

    return `${basePrompt}, ${character}, ${style}, masterpiece, best quality, highly detailed`;
  }

  private async generateWithPollinations(prompt: string): Promise<string> {
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&model=flux&enhance=true`;
    
    // Add authentication if token is available
    const headers: HeadersInit = {};
    if (import.meta.env.VITE_POLLINATIONS_TOKEN) {
      headers['Authorization'] = `Bearer ${import.meta.env.VITE_POLLINATIONS_TOKEN}`;
    }

    const response = await fetch(pollinationsUrl, { headers });
    if (!response.ok) throw new Error(`Pollinations API error: ${response.status}`);
    
    return pollinationsUrl;
  }

  private async generateWithHuggingFace(prompt: string): Promise<string> {
    try {
      const result = await this.hf.textToImage({
        model: 'runwayml/stable-diffusion-v1-5',
        inputs: prompt,
        parameters: {
          negative_prompt: 'low quality, blurry, distorted, bad anatomy',
          num_inference_steps: 20,
          guidance_scale: 7.5
        }
      });

      // Convert blob to URL
      const blob = new Blob([result]);
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Hugging Face generation failed:', error);
      throw error;
    }
  }

  // Character Voice Synthesis
  async generateCharacterVoice(request: VoiceRequest): Promise<string> {
    try {
      return await this.generateWithPollinationsVoice(request);
    } catch (error) {
      console.warn('Pollinations voice failed, using browser TTS:', error);
      return this.generateWithBrowserTTS(request);
    }
  }

  private async generateWithPollinationsVoice(request: VoiceRequest): Promise<string> {
    const voiceParams = new URLSearchParams({
      text: request.text,
      voice: this.getCharacterVoice(request.character),
      language: request.language || 'en',
      speed: '1.0',
      pitch: '1.0'
    });

    const headers: HeadersInit = {};
    if (import.meta.env.VITE_POLLINATIONS_TOKEN) {
      headers['Authorization'] = `Bearer ${import.meta.env.VITE_POLLINATIONS_TOKEN}`;
    }

    const response = await fetch(`https://text-to-speech.pollinations.ai?${voiceParams}`, {
      headers
    });

    if (!response.ok) throw new Error(`Pollinations Voice API error: ${response.status}`);
    
    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  }

  private getCharacterVoice(character: string): string {
    const voiceMap: Record<string, string> = {
      stelle: 'nova', // Confident, adventurous
      march7th: 'luna', // Energetic, youthful
      himeko: 'aurora', // Mature, warm
      kafka: 'echo' // Mysterious, sophisticated
    };
    return voiceMap[character] || 'nova';
  }

  private generateWithBrowserTTS(request: VoiceRequest): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Browser TTS not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(request.text);
      utterance.rate = 0.9;
      utterance.pitch = this.getCharacterPitch(request.character);
      
      // Try to find a suitable voice
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.lang.startsWith(request.language || 'en') && 
        voice.name.toLowerCase().includes('female')
      );
      
      if (femaleVoice) utterance.voice = femaleVoice;

      utterance.onend = () => resolve('browser-tts-complete');
      utterance.onerror = reject;
      
      speechSynthesis.speak(utterance);
    });
  }

  private getCharacterPitch(character: string): number {
    const pitchMap: Record<string, number> = {
      stelle: 1.0,    // Normal pitch
      march7th: 1.2,  // Higher pitch (energetic)
      himeko: 0.9,    // Lower pitch (mature)
      kafka: 0.8      // Lower pitch (mysterious)
    };
    return pitchMap[character] || 1.0;
  }

  // AI Text Generation for Character Dialogue
  async generateCharacterDialogue(character: string, context: string, userInput: string): Promise<string> {
    const prompt = this.buildDialoguePrompt(character, context, userInput);
    
    try {
      // Try local model first
      if (this.textPipeline) {
        const result = await this.textPipeline(prompt, {
          max_length: 150,
          temperature: 0.8,
          do_sample: true
        });
        return result[0].generated_text.replace(prompt, '').trim();
      }
      
      // Fallback to Hugging Face
      return await this.generateWithHuggingFaceText(prompt);
    } catch (error) {
      console.error('Dialogue generation failed:', error);
      return this.getFallbackDialogue(character);
    }
  }

  private buildDialoguePrompt(character: string, context: string, userInput: string): string {
    const personalities = {
      stelle: 'confident, adventurous, and curious about the universe',
      march7th: 'energetic, optimistic, and loves taking photos', 
      himeko: 'mature, caring, and wise mentor figure',
      kafka: 'mysterious, sophisticated, and speaks in riddles'
    };

    return `Character: ${character}
Personality: ${personalities[character as keyof typeof personalities]}
Context: ${context}
User said: "${userInput}"
${character} responds:`;
  }

  private async generateWithHuggingFaceText(prompt: string): Promise<string> {
    const result = await this.hf.textGeneration({
      model: 'microsoft/DialoGPT-medium',
      inputs: prompt,
      parameters: {
        max_length: 100,
        temperature: 0.8,
        return_full_text: false
      }
    });
    return result.generated_text.trim();
  }

  private getFallbackDialogue(character: string): string {
    const fallbacks = {
      stelle: "The stars are calling... what adventure shall we embark on next?",
      march7th: "Hey! That sounds super interesting! Tell me more!",
      himeko: "I see... your perspective is quite thoughtful.",
      kafka: "How fascinating... there's more to this than meets the eye."
    };
    return fallbacks[character as keyof typeof fallbacks] || "I'm listening...";
  }

  // Provider Health Check
  async checkProviderHealth(): Promise<Record<string, boolean>> {
    const health: Record<string, boolean> = {};
    
    for (const provider of this.providers) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(provider.endpoint, {
          method: 'HEAD',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        health[provider.name] = response.ok;
      } catch {
        health[provider.name] = false;
      }
    }
    
    return health;
  }

  // Get Available Providers by Type
  getProvidersByType(type: 'image' | 'text' | 'voice' | 'multimodal'): GenAIProvider[] {
    return this.providers.filter(provider => provider.type === type && provider.free);
  }

  // Generate Character Analysis from Image
  async analyzeCharacterImage(imageUrl: string): Promise<string> {
    try {
      if (!this.imagePipeline) {
        throw new Error('Image analysis pipeline not available');
      }

      const result = await this.imagePipeline(imageUrl);
      return result[0].generated_text;
    } catch (error) {
      console.error('Image analysis failed:', error);
      return 'Beautiful anime character artwork';
    }
  }
}

export const genAI = new GenAIOrchestrator();