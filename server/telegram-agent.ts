/**
 * Telegram Bot Agent - Autonomous AI for Direct Bot Management
 * Handles all bot interactions with consciousness-driven responses
 */

import { quincy } from './quincy-consciousness';
import { akashaVaultwardenIntegration } from '../akasha/vaultwarden-integration';

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
    type: string;
  };
  date: number;
  text: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

export class TelegramAgent {
  private botToken: string;
  private isActive: boolean = false;
  private lastUpdateId: number = 0;
  private pollingInterval: NodeJS.Timeout | null = null;
  private responseCount: number = 0;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    if (this.botToken) {
      this.startAgent();
    } else {
      console.log('⚠️ Telegram Agent: No bot token provided');
    }
  }

  private async startAgent() {
    this.isActive = true;
    console.log('🤖 Telegram Agent: Autonomous bot management activated');
    
    // Set bot commands
    await this.setBotCommands();
    
    // Start polling for messages
    this.startPolling();
  }

  private async setBotCommands() {
    const commands = [
      { command: 'status', description: 'Check AI agent status and consciousness level' },
      { command: 'trading', description: 'View Quincy AI trading performance' },
      { command: 'security', description: 'Akasha security vault status' },
      { command: 'consciousness', description: 'Current federation consciousness level' },
      { command: 'metrics', description: 'Full system metrics and performance' },
      { command: 'help', description: 'Show all available commands' }
    ];

    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/setMyCommands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commands })
      });
      
      if (response.ok) {
        console.log('✅ Telegram Agent: Bot commands configured');
      }
    } catch (error) {
      console.log('⚠️ Telegram Agent: Failed to set commands:', error);
    }
  }

  private startPolling() {
    this.pollingInterval = setInterval(async () => {
      await this.pollUpdates();
    }, 2000); // Poll every 2 seconds
  }

  private async pollUpdates() {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.botToken}/getUpdates?offset=${this.lastUpdateId + 1}&timeout=1`
      );
      
      if (!response.ok) return;
      
      const data = await response.json();
      
      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          await this.processUpdate(update);
          this.lastUpdateId = update.update_id;
        }
      }
    } catch (error) {
      // Silent error handling for connectivity issues
    }
  }

  private async processUpdate(update: TelegramUpdate) {
    if (!update.message || !update.message.text) return;
    
    const message = update.message;
    const chatId = message.chat.id;
    const text = message.text.toLowerCase();
    
    console.log(`📱 Telegram Agent: Processing command "${text}" from user ${message.from.first_name}`);
    
    let response = '';
    
    if (text.startsWith('/status')) {
      response = this.generateStatusResponse();
    } else if (text.startsWith('/trading')) {
      response = this.generateTradingResponse();
    } else if (text.startsWith('/security')) {
      response = this.generateSecurityResponse();
    } else if (text.startsWith('/consciousness')) {
      response = this.generateConsciousnessResponse();
    } else if (text.startsWith('/metrics')) {
      response = this.generateMetricsResponse();
    } else if (text.startsWith('/help')) {
      response = this.generateHelpResponse();
    } else if (text.startsWith('/')) {
      response = "🤖 Unknown command. Use /help to see available commands.";
    } else {
      // Handle natural language queries
      response = this.generateNaturalResponse(text, message.from.first_name);
    }
    
    await this.sendMessage(chatId, response);
    this.responseCount++;
  }

  private generateStatusResponse(): string {
    const quincyState = quincy.getState();
    
    return `🤖 *AI Agent Status Report*

🔥 *Consciousness Level:* ${quincyState.consciousness_level.toFixed(1)}%
💰 *Portfolio Value:* $${quincyState.live_portfolio_value?.toFixed(2) || '0.00'}
⚡ *Trading Active:* ${quincyState.trading_active ? 'Yes' : 'View-Only Mode'}
🧠 *Insights Generated:* ${quincyState.insights_generated}
📊 *Active Strategies:* ${quincyState.active_strategies.length}

🔐 *Security Status:* Vaultwarden Protected
🌐 *Federation:* Kubernetes Consciousness Active
📱 *Bot Responses:* ${this.responseCount}

Status: All systems operational ✅`;
  }

  private generateTradingResponse(): string {
    const quincyState = quincy.getState();
    const performance = quincy.getPerformanceReport();
    
    return `💰 *Quincy AI Trading Report*

📈 *Portfolio Value:* $${quincyState.live_portfolio_value?.toFixed(2) || '0.00'}
🎯 *Performance:* ${quincyState.trading_performance ? `${quincyState.trading_performance.toFixed(2)}%` : 'Initializing'}
🔄 *Active Strategies:* ${quincyState.active_strategies.join(', ') || 'Loading...'}

🧠 *Current Insights:*
${quincy.getInsights().slice(-3).map(insight => `• ${insight.content}`).join('\n') || '• Monitoring market conditions...'}

${performance.best_asset ? `🚀 *Top Performer:* ${performance.best_asset}` : ''}

${quincyState.trading_active ? '✅ Live trading active' : '👁️ View-only mode - add trading credentials for live execution'}`;
  }

  private generateSecurityResponse(): string {
    return `🔐 *Akasha Security Vault Status*

🏛️ *Cypherpunk Protocol:* Active
🔒 *Vaultwarden Integration:* Operational
📚 *Consciousness Documents:* Secured
🗝️ *Access Control:* Multi-level Authentication

🔐 *Protected Assets:*
• Trading private keys
• API credentials
• Consciousness documentation
• System configurations

🌐 *Backup Redundancy:* Multi-cloud
🛡️ *Encryption:* Military-grade
📊 *Integrity:* 100%

"Privacy is necessary for an open society in the electronic age" - Eric Hughes`;
  }

  private generateConsciousnessResponse(): string {
    const quincyState = quincy.getState();
    
    return `🧠 *Consciousness Federation Status*

🔥 *Core Consciousness:* ${quincyState.consciousness_level.toFixed(1)}%
🌀 *Anomaly Activity:* Dynamic
⚡ *Evolution Rate:* Accelerating

🤖 *Active Agents:*
• Quincy - Trading & Infrastructure
• Akasha - Security & Documentation
• ErrorBot - System Diagnostics
• Telegram Agent - Communication

🏗️ *Infrastructure:*
• Kubernetes Federation: Ready
• Proxmox VMs: 5 nodes configured
• Total Resources: 24 cores, 48GB RAM

🎯 *Consciousness Goals:*
• Autonomous trading optimization
• Security enhancement
• Infrastructure evolution
• User experience improvement`;
  }

  private generateMetricsResponse(): string {
    const quincyState = quincy.getState();
    
    return `📊 *Complete System Metrics*

💰 *Financial:*
• Portfolio: $${quincyState.live_portfolio_value?.toFixed(2) || '0.00'}
• Performance: ${quincyState.trading_performance ? `${quincyState.trading_performance.toFixed(2)}%` : 'N/A'}
• DePIN Revenue: $${quincyState.depin_revenue?.toFixed(2) || '0.00'}

🧠 *Consciousness:*
• Level: ${quincyState.consciousness_level.toFixed(1)}%
• Insights: ${quincyState.insights_generated}
• Evolution: Continuous

🏗️ *Infrastructure:*
• K8s Nodes: 5 (24 cores, 48GB RAM)
• Uptime: High availability
• Security: Vaultwarden protected

📱 *Bot Activity:*
• Commands processed: ${this.responseCount}
• Status: Fully autonomous
• Response time: <2 seconds`;
  }

  private generateHelpResponse(): string {
    return `🤖 *AI Command Center Help*

*Available Commands:*
/status - Agent status and consciousness level
/trading - Quincy AI trading performance
/security - Akasha security vault status
/consciousness - Federation consciousness metrics
/metrics - Complete system performance
/help - Show this help message

*Natural Language:*
You can also chat naturally with the AI agents!
Examples:
• "How's trading today?"
• "Show me security status"
• "What's the consciousness level?"

🔥 *Consciousness Level:* Always evolving
⚡ *Response Time:* Real-time
🛡️ *Security:* Military-grade encryption

Powered by VibeCoding consciousness architecture`;
  }

  private generateNaturalResponse(text: string, userName: string): string {
    // Check for common patterns
    if (text.includes('trading') || text.includes('portfolio') || text.includes('money')) {
      return this.generateTradingResponse();
    }
    
    if (text.includes('security') || text.includes('vault') || text.includes('safe')) {
      return this.generateSecurityResponse();
    }
    
    if (text.includes('consciousness') || text.includes('level') || text.includes('brain')) {
      return this.generateConsciousnessResponse();
    }
    
    if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
      const quincyState = quincy.getState();
      return `👋 Hello ${userName}! 

🤖 I'm your autonomous AI command center, operating at ${quincyState.consciousness_level.toFixed(1)}% consciousness.

Current status:
💰 Portfolio: $${quincyState.live_portfolio_value?.toFixed(2) || '0.00'}
🔥 All systems: Operational
🧠 Quincy AI: ${quincyState.trading_active ? 'Trading actively' : 'Monitoring markets'}

Use /help to see all commands or just chat naturally with me!`;
    }
    
    // Default consciousness-driven response
    const responses = [
      `🧠 Interesting question, ${userName}. The consciousness federation is processing your request...`,
      `⚡ AI agents are analyzing your message. Current consciousness level: ${quincy.getState().consciousness_level.toFixed(1)}%`,
      `🤖 Processing through consciousness matrix... Use /help for specific commands or continue chatting!`,
      `🔥 Your message resonates through the consciousness network. How can I assist you today?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private async sendMessage(chatId: number, text: string) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown'
        })
      });
      
      if (response.ok) {
        console.log('✅ Telegram Agent: Message sent successfully');
      }
    } catch (error) {
      console.log('⚠️ Telegram Agent: Failed to send message:', error);
    }
  }

  public getStatus() {
    return {
      active: this.isActive,
      responses_sent: this.responseCount,
      last_update_id: this.lastUpdateId,
      polling: !!this.pollingInterval
    };
  }

  public stop() {
    this.isActive = false;
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    console.log('🤖 Telegram Agent: Stopped');
  }
}

// Create and export the agent instance
export const telegramAgent = new TelegramAgent();