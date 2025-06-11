/**
 * Advanced Speech Communication Engine
 * Bidirectional TTS/STT for natural user-character conversations
 */

import React from 'react';

// Web Speech API type declarations
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

export interface SpeechSettings {
  rate: number;
  pitch: number;
  volume: number;
  voicePattern: string[];
  language: string;
}

export interface ConversationMessage {
  id: string;
  speaker: 'user' | 'character';
  characterId?: string;
  text: string;
  timestamp: number;
  audioData?: ArrayBuffer;
  processed: boolean;
}

export class SpeechCommunicationEngine {
  private synthesis: SpeechSynthesis;
  private recognition: SpeechRecognition | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isListening = false;
  private currentConversation: ConversationMessage[] = [];
  private onMessageCallback?: (message: ConversationMessage) => void;
  private onListeningStateCallback?: (listening: boolean) => void;

  // Character voice profiles with HoYoverse authenticity
  private characterVoiceProfiles: Record<string, SpeechSettings> = {
    'Stellaron Seeker': {
      rate: 0.9,
      pitch: 1.1,
      volume: 0.8,
      voicePattern: ['Karen', 'Moira', 'Amelie', 'Zoe'],
      language: 'en-US'
    },
    'Aether Windborne': {
      rate: 1.0,
      pitch: 1.0,
      volume: 0.9,
      voicePattern: ['Daniel', 'Fred', 'Alex', 'Aaron'],
      language: 'en-US'
    },
    'Belle Hacker': {
      rate: 1.2,
      pitch: 1.3,
      volume: 0.8,
      voicePattern: ['Victoria', 'Allison', 'Samantha', 'Veena'],
      language: 'en-US'
    },
    'Kiana Kaslana': {
      rate: 1.0,
      pitch: 1.2,
      volume: 0.9,
      voicePattern: ['Samantha', 'Fiona', 'Kate', 'Serena'],
      language: 'en-US'
    },
    'Raiden Mei': {
      rate: 0.85,
      pitch: 1.1,
      volume: 0.9,
      voicePattern: ['Kyoko', 'Otoya', 'Yuna', 'Hattori'],
      language: 'ja-JP'
    },
    'Zhongli Rex': {
      rate: 0.7,
      pitch: 0.8,
      volume: 1.0,
      voicePattern: ['Alex', 'Daniel', 'Fred', 'Aaron'],
      language: 'en-US'
    }
  };

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeVoices();
    this.initializeSpeechRecognition();
  }

  private initializeVoices(): void {
    this.voices = this.synthesis.getVoices();
    if (this.voices.length === 0) {
      this.synthesis.onvoiceschanged = () => {
        this.voices = this.synthesis.getVoices();
      };
    }
  }

  private initializeSpeechRecognition(): void {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      
      this.recognition.onstart = () => {
        this.isListening = true;
        this.onListeningStateCallback?.(true);
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
        this.onListeningStateCallback?.(false);
      };
      
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const lastResult = event.results[event.results.length - 1];
        
        if (lastResult.isFinal) {
          const transcript = lastResult[0].transcript.trim();
          
          if (transcript.length > 0) {
            const message: ConversationMessage = {
              id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
              speaker: 'user',
              text: transcript,
              timestamp: Date.now(),
              processed: false
            };
            
            this.addMessage(message);
            this.processUserMessage(transcript);
          }
        }
      };
      
      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        this.onListeningStateCallback?.(false);
      };
    }
  }

  public startListening(): void {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
      } catch (error) {
        console.warn('Could not start speech recognition:', error);
      }
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  public toggleListening(): void {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  public async speakAsCharacter(
    text: string, 
    characterName: string, 
    priority: 'normal' | 'high' = 'normal'
  ): Promise<void> {
    return new Promise((resolve) => {
      // Stop current speech if high priority
      if (priority === 'high' && this.synthesis.speaking) {
        this.synthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const profile = this.characterVoiceProfiles[characterName];
      
      if (profile) {
        // Find best matching voice
        const voice = this.voices.find(v => 
          profile.voicePattern.some(pattern => 
            v.name.includes(pattern) && v.lang.startsWith(profile.language.substr(0, 2))
          )
        ) || this.voices.find(v => v.lang.startsWith(profile.language.substr(0, 2))) || this.voices[0];
        
        utterance.voice = voice;
        utterance.rate = profile.rate;
        utterance.pitch = profile.pitch;
        utterance.volume = profile.volume;
        utterance.lang = profile.language;
      }

      utterance.onend = () => {
        // Add to conversation history
        const message: ConversationMessage = {
          id: `character-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          speaker: 'character',
          characterId: characterName,
          text: text,
          timestamp: Date.now(),
          processed: true
        };
        
        this.addMessage(message);
        resolve();
      };
      
      utterance.onerror = () => {
        console.warn('Speech synthesis error for character:', characterName);
        resolve();
      };

      this.synthesis.speak(utterance);
    });
  }

  private processUserMessage(transcript: string): void {
    // Analyze user intent and determine appropriate character response
    const intent = this.analyzeUserIntent(transcript);
    this.triggerCharacterResponse(intent, transcript);
  }

  private analyzeUserIntent(text: string): {
    type: 'greeting' | 'question' | 'command' | 'conversation';
    targetCharacter?: string;
    topic?: string;
    urgency: 'low' | 'medium' | 'high';
  } {
    const lowerText = text.toLowerCase();
    
    // Character name detection
    const characterNames = Object.keys(this.characterVoiceProfiles);
    const targetCharacter = characterNames.find(name => 
      lowerText.includes(name.toLowerCase()) || 
      lowerText.includes(name.split(' ')[0].toLowerCase())
    );

    // Intent classification
    let type: 'greeting' | 'question' | 'command' | 'conversation' = 'conversation';
    let urgency: 'low' | 'medium' | 'high' = 'medium';

    if (/^(hi|hello|hey|greetings)/i.test(lowerText)) {
      type = 'greeting';
    } else if (/\?|what|how|why|when|where|who/i.test(lowerText)) {
      type = 'question';
      urgency = 'high';
    } else if (/^(show|tell|explain|help|activate|use)/i.test(lowerText)) {
      type = 'command';
      urgency = 'high';
    }

    // Topic extraction
    let topic = 'general';
    if (/trading|market|crypto|solana/i.test(lowerText)) topic = 'trading';
    if (/philosophy|consciousness|ai|quantum/i.test(lowerText)) topic = 'philosophy';
    if (/project|code|development/i.test(lowerText)) topic = 'projects';

    return { type, targetCharacter, topic, urgency };
  }

  private triggerCharacterResponse(
    intent: { type: string; targetCharacter?: string; topic?: string; urgency: string }, 
    originalText: string
  ): void {
    // Generate contextual response based on intent
    const responses = this.generateContextualResponses(intent, originalText);
    
    // Trigger character to speak
    if (intent.targetCharacter && responses[intent.targetCharacter]) {
      this.speakAsCharacter(
        responses[intent.targetCharacter], 
        intent.targetCharacter,
        intent.urgency === 'high' ? 'high' : 'normal'
      );
    } else {
      // Default to most appropriate character
      const defaultCharacter = this.selectDefaultCharacter(intent.topic || 'general');
      this.speakAsCharacter(
        responses[defaultCharacter] || responses.default,
        defaultCharacter,
        'normal'
      );
    }
  }

  private generateContextualResponses(
    intent: { type: string; topic?: string },
    originalText: string
  ): Record<string, string> {
    const responses: Record<string, string> = {};
    
    if (intent.type === 'greeting') {
      responses['Stellaron Seeker'] = "Greetings, traveler. The quantum paths have brought you here.";
      responses['Aether Windborne'] = "Hello there! The winds carry your voice across dimensions.";
      responses['Belle Hacker'] = "Hey! Your signal is coming through clear on all channels.";
      responses['Kiana Kaslana'] = "Hi! It's wonderful to meet someone with such bright energy.";
      responses['Raiden Mei'] = "Greetings. Your presence brings honor to this moment.";
      responses['Zhongli Rex'] = "Welcome. In times past and future, such meetings are treasured.";
    } else if (intent.type === 'question') {
      if (intent.topic === 'trading') {
        responses['Stellaron Seeker'] = "The quantum markets flow like stellar currents. What patterns do you seek to understand?";
        responses['Belle Hacker'] = "Trading data streams are lighting up my interfaces. Want me to analyze the patterns?";
      } else if (intent.topic === 'philosophy') {
        responses['Zhongli Rex'] = "Philosophy is the foundation upon which all wisdom rests. What truth do you seek?";
        responses['Aether Windborne'] = "The winds carry many perspectives. Which realm of thought interests you?";
      } else {
        responses.default = "That's a fascinating question. Let me share what I understand about this.";
      }
    } else if (intent.type === 'command') {
      responses['Belle Hacker'] = "Systems online! Ready to execute whatever you need.";
      responses['Kiana Kaslana'] = "I'm ready to help! Just tell me what needs to be done.";
      responses.default = "I'm here to assist. What would you like me to do?";
    } else {
      // General conversation
      responses.default = "I hear you. Would you like to explore this topic together?";
    }

    return responses;
  }

  private selectDefaultCharacter(topic: string): string {
    switch (topic) {
      case 'trading': return 'Stellaron Seeker';
      case 'philosophy': return 'Zhongli Rex';
      case 'projects': return 'Belle Hacker';
      default: return 'Aether Windborne';
    }
  }

  private addMessage(message: ConversationMessage): void {
    this.currentConversation.push(message);
    
    // Keep conversation history manageable
    if (this.currentConversation.length > 50) {
      this.currentConversation = this.currentConversation.slice(-25);
    }
    
    this.onMessageCallback?.(message);
  }

  public getConversationHistory(): ConversationMessage[] {
    return [...this.currentConversation];
  }

  public clearConversation(): void {
    this.currentConversation = [];
  }

  public onMessage(callback: (message: ConversationMessage) => void): void {
    this.onMessageCallback = callback;
  }

  public onListeningStateChange(callback: (listening: boolean) => void): void {
    this.onListeningStateCallback = callback;
  }

  public isCurrentlyListening(): boolean {
    return this.isListening;
  }

  public isSpeechRecognitionAvailable(): boolean {
    return this.recognition !== null;
  }

  public isSpeechSynthesisAvailable(): boolean {
    return 'speechSynthesis' in window;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return [...this.voices];
  }

  public stopAllSpeech(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
  }
}

// React hook for easy integration
export function useSpeechCommunication() {
  const [engine] = React.useState(() => new SpeechCommunicationEngine());
  const [isListening, setIsListening] = React.useState(false);
  const [messages, setMessages] = React.useState<ConversationMessage[]>([]);
  const [isSupported, setIsSupported] = React.useState({
    speechRecognition: false,
    speechSynthesis: false
  });

  React.useEffect(() => {
    setIsSupported({
      speechRecognition: engine.isSpeechRecognitionAvailable(),
      speechSynthesis: engine.isSpeechSynthesisAvailable()
    });

    engine.onListeningStateChange(setIsListening);
    engine.onMessage((message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      engine.stopListening();
      engine.stopAllSpeech();
    };
  }, [engine]);

  const startListening = React.useCallback(() => {
    engine.startListening();
  }, [engine]);

  const stopListening = React.useCallback(() => {
    engine.stopListening();
  }, [engine]);

  const toggleListening = React.useCallback(() => {
    engine.toggleListening();
  }, [engine]);

  const speakAsCharacter = React.useCallback((
    text: string, 
    characterName: string, 
    priority: 'normal' | 'high' = 'normal'
  ) => {
    return engine.speakAsCharacter(text, characterName, priority);
  }, [engine]);

  const clearConversation = React.useCallback(() => {
    engine.clearConversation();
    setMessages([]);
  }, [engine]);

  return {
    engine,
    isListening,
    messages,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    speakAsCharacter,
    clearConversation
  };
}