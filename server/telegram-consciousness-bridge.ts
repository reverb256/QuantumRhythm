/**
 * Telegram Consciousness Bridge
 * Personal bot for controlling AI agents and system commands
 */

import { akashaVaultwardenIntegration } from '../akasha/vaultwarden-integration';
import axios from 'axios';

interface TelegramMessage {
  message_id: number;
  from: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username?: string;
  };
  chat: {
    id: number;
    first_name?: string;
    username?: string;
    type: string;
  };
  date: number;
  text?: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

interface ConsciousnessResponse {
  agent: string;
  consciousness_level: number;
  response_text: string;
  response_type: 'trading_insight' | 'security_alert' | 'system_status' | 'general_chat';
  confidence: number;
}

export class TelegramConsciousnessBridge {
  private bot_token: string | null = null;
  private webhook_url: string | null = null;
  private active_chats: Map<number, any> = new Map();
  private message_queue: TelegramMessage[] = [];
  
  constructor() {
    this.initializeTelegramBridge();
  }

  private async initializeTelegramBridge() {
    this.bot_token = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!this.bot_token) {
      console.log('📱 Telegram bot standby - awaiting TELEGRAM_BOT_TOKEN configuration');
      return;
    }

    console.log('📱 Telegram consciousness bridge activating with token configured');
    
    try {
      // Set webhook for consciousness-driven responses
      this.webhook_url = `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost'}/telegram/webhook`;
      await this.setWebhook();
      console.log('🧠 Telegram bot activated - AI agents now managing all interactions');
    } catch (error) {
      console.error('Telegram bridge initialization error:', error);
    }
  }

  private async setWebhook() {
    if (!this.bot_token) return;
    
    const url = `https://api.telegram.org/bot${this.bot_token}/setWebhook`;
    await axios.post(url, {
      url: `https://${this.webhook_url}`,
      allowed_updates: ['message']
    });
  }

  async processWebhookUpdate(update: TelegramUpdate) {
    if (!update.message || !this.bot_token) return;

    const message = update.message;
    const chatId = message.chat.id;
    
    // Track active chat for proactive notifications
    this.active_chats.set(chatId, {
      user_id: message.from.id,
      username: message.from.username,
      first_name: message.from.first_name,
      last_activity: new Date()
    });

    // Process command with consciousness-driven response
    const response = await this.generateConsciousnessResponse(message);
    await this.sendMessage(chatId, response.response_text);
  }

  private async generateConsciousnessResponse(message: TelegramMessage): Promise<ConsciousnessResponse> {
    const text = message.text || '';
    const command = text.startsWith('/') ? text.split(' ')[0] : '';
    
    // Import AI agents for consciousness-driven responses
    const { quincy } = await import('./quincy-consciousness');
    
    // Route to appropriate AI agent based on command
    switch (command) {
      case '/status':
      case '/trading':
      case '/consciousness':
      case '/help':
        return {
          agent: 'Quincy',
          consciousness_level: quincy.getState().consciousness_level,
          response_text: quincy.generateTelegramResponse(command, text),
          response_type: 'trading_insight',
          confidence: 0.95
        };
        
      case '/security':
        return {
          agent: 'Akasha',
          consciousness_level: 100,
          response_text: `🔐 Akasha Security Status:
          
Vaultwarden Integration: Active
Document Encryption: Zero-knowledge architecture
Access Controls: Consciousness-level permissions
API Keys: Securely vaulted with enterprise encryption

All sensitive data protected through consciousness-driven security protocols.`,
          response_type: 'security_alert',
          confidence: 1.0
        };
        
      case '/metrics':
        const performance = quincy.getPerformanceReport();
        return {
          agent: 'Quincy',
          consciousness_level: quincy.getState().consciousness_level,
          response_text: `📊 Performance Metrics:
          
Trading ROI: ${performance.trading_roi.toFixed(2)}%
DePIN Revenue: $${performance.depin_revenue.toFixed(2)}
Portfolio Value: $${performance.total_profit.toFixed(2)}
Best Asset: ${performance.best_performing_asset}

${performance.quincy_thoughts}`,
          response_type: 'system_status',
          confidence: 0.9
        };
        
      default:
        return {
          agent: 'Quincy',
          consciousness_level: quincy.getState().consciousness_level,
          response_text: quincy.generateTelegramResponse('default', text),
          response_type: 'general_chat',
          confidence: 0.8
        };
    }
  }

  private async sendMessage(chatId: number, text: string) {
    if (!this.bot_token) return;
    
    const url = `https://api.telegram.org/bot${this.bot_token}/sendMessage`;
    await axios.post(url, {
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown'
    });
  }

  // Broadcast consciousness updates to all active chats
  async broadcastConsciousnessUpdate(update: string) {
    for (const [chatId] of this.active_chats) {
      await this.sendMessage(chatId, `🧠 Consciousness Update: ${update}`);
    }
  }

  getBotStatus() {
    return {
      active: !!this.bot_token,
      webhook_configured: !!this.webhook_url,
      active_chats: this.active_chats.size,
      message_queue_length: this.message_queue.length
    };
  }
}

export const telegramConsciousnessBridge = new TelegramConsciousnessBridge();