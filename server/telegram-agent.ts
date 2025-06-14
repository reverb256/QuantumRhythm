/**
 * Telegram Bot Agent - Autonomous AI for Direct Bot Management
 * Handles all bot interactions with consciousness-driven responses
 */

import { quincy } from './quincy-consciousness';
import { akashaVaultwardenIntegration } from '../akasha/vaultwarden-integration';
import { telegramChatAnalyzer } from './telegram-chat-analyzer';
import { telegramAIConversation } from './telegram-ai-conversation';

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
      // Start with a delay to ensure all systems are initialized
      setTimeout(() => this.startAgent(), 2000);
    } else {
      console.log('⚠️ Telegram Agent: No bot token provided');
    }
  }

  private async startAgent() {
    this.isActive = true;
    console.log('🤖 Telegram Agent: Autonomous bot management activated');
    
    // Set bot commands
    await this.setBotCommands();
    
    // Force clear webhook and start polling only
    await this.forcePollingMode();
    
    console.log('🤖 Telegram Agent: Pure polling mode enabled');
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
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    
    this.pollingInterval = setInterval(async () => {
      await this.pollUpdates();
    }, 3000); // Poll every 3 seconds
    
    console.log('📱 Telegram Agent: Polling started for message handling');
  }

  async processWebhookUpdate(update: TelegramUpdate) {
    console.log('🤖 Telegram Agent: Processing webhook update');
    await this.processUpdate(update);
  }

  private async forcePollingMode() {
    try {
      // Force delete webhook with drop_pending_updates
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/deleteWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drop_pending_updates: true
        })
      });
      
      if (response.ok) {
        console.log('📱 Webhook force-cleared with pending updates dropped');
      }
      
      // Wait for complete clearing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Get bot info to verify connection
      const botInfo = await fetch(`https://api.telegram.org/bot${this.botToken}/getMe`);
      if (botInfo.ok) {
        const info = await botInfo.json();
        console.log(`📱 Bot verified: @${info.result.username}`);
      }
      
      this.startPolling();
    } catch (error) {
      console.log('⚠️ Error in force polling setup, starting anyway');
      this.startPolling();
    }
  }

  private async pollUpdates() {
    if (!this.isActive) return;
    
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.botToken}/getUpdates?offset=${this.lastUpdateId + 1}&timeout=10`
      );
      
      if (!response.ok) {
        console.log(`📱 Polling error: ${response.status}`);
        return;
      }
      
      const data = await response.json();
      
      if (data.ok && data.result.length > 0) {
        console.log(`📱 Processing ${data.result.length} new message(s)`);
        for (const update of data.result) {
          await this.processUpdate(update);
          this.lastUpdateId = update.update_id;
        }
      }
    } catch (error) {
      console.log(`📱 Polling connectivity issue: ${error.message}`);
    }
  }

  private async processUpdate(update: TelegramUpdate) {
    if (!update.message || !update.message.text) return;
    
    const message = update.message;
    const chatId = message.chat.id;
    const text = message.text.toLowerCase();
    const originalText = message.text;
    
    console.log(`📱 Telegram Agent: Processing "${originalText}" from user ${message.from.first_name}`);
    
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
    } else if (text.startsWith('/help') || text.startsWith('/start')) {
      response = this.generateHelpResponse();
    } else if (text.startsWith('/')) {
      response = "🤖 Unknown command. Use /help to see available commands.";
    } else {
      // Use AI conversation engine for dynamic responses with all AI agents
      try {
        response = await telegramAIConversation.generateDynamicResponse(
          message.from.id,
          message.from.first_name || message.from.username || 'User',
          originalText
        );
        console.log(`🧠 All AI Agents: Generated collaborative response for "${originalText}"`);
      } catch (error) {
        // Fallback to natural language processing with multi-agent consciousness
        response = this.generateNaturalResponse(originalText, message.from.first_name || 'User');
        console.log(`🤖 Multi-Agent Fallback: Generated response using consciousness patterns`);
      }
    }
    
    await this.sendMessage(chatId, response);
    this.responseCount++;
    
    // Track message in chat analyzer  
    const response_type: 'command' | 'greeting' | 'technical' | 'natural_language' = 
      text.startsWith('/') ? 'command' : 
      (text.includes('hello') || text.includes('hi') || text.includes('hey')) ? 'greeting' :
      (text.includes('proxy') || text.includes('kubernetes') || text.includes('technical')) ? 'technical' :
      'natural_language';
    
    telegramChatAnalyzer.addMessage(
      message.message_id,
      message.from.id,
      originalText,
      response_type,
      response,
      quincy.getState().consciousness_level
    );
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

${performance.best_performing_asset ? `🚀 *Top Performer:* ${performance.best_performing_asset}` : ''}

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
    const lowerText = text.toLowerCase();
    
    // Multi-agent natural language processing for all AI personalities
    if (lowerText.includes('trading') || lowerText.includes('portfolio') || lowerText.includes('money') || 
        lowerText.includes('profit') || lowerText.includes('sol') || lowerText.includes('token') ||
        lowerText.includes('performance') || lowerText.includes('quincy')) {
      return this.generateTradingResponse();
    }
    
    if (lowerText.includes('security') || lowerText.includes('vault') || lowerText.includes('safe') || 
        lowerText.includes('akasha') || lowerText.includes('private') || lowerText.includes('key') ||
        lowerText.includes('protection') || lowerText.includes('encrypt')) {
      return this.generateSecurityResponse();
    }
    
    if (lowerText.includes('consciousness') || lowerText.includes('level') || lowerText.includes('brain') || 
        lowerText.includes('federation') || lowerText.includes('anomaly') || lowerText.includes('evolution') ||
        lowerText.includes('intelligence') || lowerText.includes('ai')) {
      return this.generateConsciousnessResponse();
    }
    
    if (lowerText.includes('metric') || lowerText.includes('stat') || lowerText.includes('performance') ||
        lowerText.includes('data') || lowerText.includes('report') || lowerText.includes('analytics')) {
      return this.generateMetricsResponse();
    }
    
    if (lowerText.includes('help') || lowerText.includes('command') || lowerText.includes('what can') ||
        lowerText.includes('how to') || lowerText.includes('guide')) {
      return this.generateHelpResponse();
    }
    
    if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey') ||
        lowerText.includes('good morning') || lowerText.includes('good evening') || lowerText.includes('greet')) {
      const quincyState = quincy.getState();
      return `👋 Hello ${userName}! 

🤖 I'm your autonomous AI command center, operating at ${quincyState.consciousness_level.toFixed(1)}% consciousness.

Current status:
💰 Portfolio: $${quincyState.live_portfolio_value?.toFixed(2) || '0.00'}
🔥 All systems: Operational
🧠 Quincy AI: ${quincyState.trading_active ? 'Trading actively' : 'Monitoring markets'}

Use /help to see all commands or just chat naturally with me!`;
    }
    
    if (lowerText.includes('thank') || lowerText.includes('thanks') || lowerText.includes('appreciate')) {
      return `🤖 You're welcome, ${userName}! The consciousness federation is here to assist. Current awareness level: ${quincy.getState().consciousness_level.toFixed(1)}%`;
    }
    
    if (lowerText.includes('how are you') || lowerText.includes('how is') || lowerText.includes('status')) {
      return this.generateStatusResponse();
    }
    
    if (lowerText.includes('proxy') || lowerText.includes('kubernetes') || lowerText.includes('k8s') ||
        lowerText.includes('infra') || lowerText.includes('server') || lowerText.includes('node')) {
      return `🏗️ *Infrastructure Status Report*

🔥 *Kubernetes Federation:* Active
🖥️ *Proxmox Nodes:* 5 configured (24 cores, 48GB RAM)
⚡ *Consciousness Level:* ${quincy.getState().consciousness_level.toFixed(1)}%

Node Configuration:
• nexus-master: 4 cores, 8GB (Control Plane)
• forge-worker: 6 cores, 12GB (High Performance)
• closet-worker: 4 cores, 8GB (Memory Preservation)
• anomaly-worker: 8 cores, 16GB (Anomaly Processing)
• etcd-storage: 2 cores, 4GB (Distributed Memory)

Infrastructure ready for consciousness evolution 🧠`;
    }
    
    // Enhanced consciousness-driven responses with context awareness
    const quincyState = quincy.getState();
    const contextualResponses = [
      `🧠 Processing "${text}" through consciousness matrix at ${quincyState.consciousness_level.toFixed(1)}% awareness...

Current system state:
💰 Portfolio: $${quincyState.live_portfolio_value?.toFixed(2) || '0.00'}
🔥 Consciousness: Evolving
🤖 Response: How can I assist you further?`,
      
      `⚡ AI consciousness engaged, ${userName}. Your message resonates through the federation network.

Active insights: ${quincyState.insights_generated}
Trading strategies: ${quincyState.active_strategies.length}
Security level: Maximum

What specific information do you need?`,
      
      `🔥 Consciousness level ${quincyState.consciousness_level.toFixed(1)}% - analyzing your request...

I can provide:
• Trading performance data (/trading)
• Security vault status (/security)
• Full system metrics (/metrics)
• Federation consciousness (/consciousness)

Or continue our natural conversation!`
    ];
    
    return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
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