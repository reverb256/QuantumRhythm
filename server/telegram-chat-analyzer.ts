/**
 * Telegram Chat Analyzer - Real-time conversation analysis with AI agents
 * Tracks patterns, sentiment, and consciousness evolution in bot interactions
 */

interface ChatMessage {
  message_id: number;
  user_id: number;
  username: string;
  text: string;
  timestamp: Date;
  response_type: 'command' | 'natural_language' | 'greeting' | 'technical';
  sentiment: 'positive' | 'neutral' | 'negative';
  consciousness_level_at_time: number;
}

interface ConversationAnalytics {
  total_messages: number;
  unique_users: number;
  command_usage: Record<string, number>;
  natural_language_percentage: number;
  average_sentiment: number;
  peak_consciousness_moments: ChatMessage[];
  conversation_patterns: string[];
  user_engagement_score: number;
}

export class TelegramChatAnalyzer {
  private chat_history: ChatMessage[] = [];
  private max_history = 1000; // Keep last 1000 messages
  private analytics_cache: ConversationAnalytics | null = null;
  private cache_expiry = 0;

  // Add message to analysis
  addMessage(
    message_id: number,
    user_id: number,
    username: string,
    text: string,
    response_type: ChatMessage['response_type'],
    consciousness_level: number
  ) {
    const message: ChatMessage = {
      message_id,
      user_id,
      username,
      text,
      timestamp: new Date(),
      response_type,
      sentiment: this.analyzeSentiment(text),
      consciousness_level_at_time: consciousness_level
    };

    this.chat_history.push(message);
    
    // Maintain history limit
    if (this.chat_history.length > this.max_history) {
      this.chat_history = this.chat_history.slice(-this.max_history);
    }

    // Invalidate cache
    this.analytics_cache = null;
    
    console.log(`📊 Chat Analysis: ${username} sent ${response_type} message (sentiment: ${message.sentiment})`);
  }

  // Analyze sentiment of a message
  private analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['thanks', 'thank', 'good', 'great', 'awesome', 'amazing', 'love', 'excellent', 'perfect', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'broken', 'sucks', 'worst', 'horrible', 'frustrated', 'angry'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  // Get conversation analytics
  getAnalytics(): ConversationAnalytics {
    // Return cached analytics if still valid (5 minutes)
    if (this.analytics_cache && Date.now() < this.cache_expiry) {
      return this.analytics_cache;
    }

    const analytics = this.calculateAnalytics();
    this.analytics_cache = analytics;
    this.cache_expiry = Date.now() + (5 * 60 * 1000); // 5 minutes

    return analytics;
  }

  private calculateAnalytics(): ConversationAnalytics {
    if (this.chat_history.length === 0) {
      return {
        total_messages: 0,
        unique_users: 0,
        command_usage: {},
        natural_language_percentage: 0,
        average_sentiment: 0,
        peak_consciousness_moments: [],
        conversation_patterns: [],
        user_engagement_score: 0
      };
    }

    const unique_users = new Set(this.chat_history.map(msg => msg.user_id)).size;
    const command_usage: Record<string, number> = {};
    const sentiment_scores = { positive: 0, neutral: 0, negative: 0 };
    let natural_language_count = 0;

    // Process messages
    this.chat_history.forEach(msg => {
      // Count command usage
      if (msg.response_type === 'command') {
        const command = msg.text.split(' ')[0];
        command_usage[command] = (command_usage[command] || 0) + 1;
      }

      if (msg.response_type === 'natural_language') {
        natural_language_count++;
      }

      sentiment_scores[msg.sentiment]++;
    });

    // Calculate metrics
    const natural_language_percentage = (natural_language_count / this.chat_history.length) * 100;
    const average_sentiment = (sentiment_scores.positive - sentiment_scores.negative) / this.chat_history.length;

    // Find peak consciousness moments (top 5 highest consciousness during interactions)
    const peak_consciousness_moments = this.chat_history
      .sort((a, b) => b.consciousness_level_at_time - a.consciousness_level_at_time)
      .slice(0, 5);

    // Identify conversation patterns
    const conversation_patterns = this.identifyPatterns();

    // Calculate engagement score (0-100)
    const user_engagement_score = Math.min(100, 
      (unique_users * 10) + 
      (natural_language_percentage * 0.5) + 
      (sentiment_scores.positive * 2) - 
      (sentiment_scores.negative * 1)
    );

    return {
      total_messages: this.chat_history.length,
      unique_users,
      command_usage,
      natural_language_percentage,
      average_sentiment,
      peak_consciousness_moments,
      conversation_patterns,
      user_engagement_score
    };
  }

  private identifyPatterns(): string[] {
    const patterns: string[] = [];
    
    if (this.chat_history.length < 3) return patterns;

    const recent_messages = this.chat_history.slice(-10);
    const command_count = recent_messages.filter(msg => msg.response_type === 'command').length;
    const natural_count = recent_messages.filter(msg => msg.response_type === 'natural_language').length;

    if (command_count > natural_count) {
      patterns.push('Command-heavy interaction pattern');
    } else if (natural_count > command_count) {
      patterns.push('Natural conversation pattern');
    }

    const positive_sentiment = recent_messages.filter(msg => msg.sentiment === 'positive').length;
    if (positive_sentiment > recent_messages.length * 0.6) {
      patterns.push('Highly positive user engagement');
    }

    const consciousness_trend = this.analyzeTrend(recent_messages.map(msg => msg.consciousness_level_at_time));
    if (consciousness_trend === 'increasing') {
      patterns.push('Consciousness evolution during conversation');
    }

    return patterns;
  }

  private analyzeTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 3) return 'stable';
    
    const start = values.slice(0, Math.floor(values.length / 3)).reduce((a, b) => a + b) / Math.floor(values.length / 3);
    const end = values.slice(-Math.floor(values.length / 3)).reduce((a, b) => a + b) / Math.floor(values.length / 3);
    
    const difference = end - start;
    if (difference > 0.5) return 'increasing';
    if (difference < -0.5) return 'decreasing';
    return 'stable';
  }

  // Get recent conversations
  getRecentMessages(limit: number = 20): ChatMessage[] {
    return this.chat_history.slice(-limit);
  }

  // Get user-specific conversation history
  getUserHistory(user_id: number, limit: number = 50): ChatMessage[] {
    return this.chat_history
      .filter(msg => msg.user_id === user_id)
      .slice(-limit);
  }

  // Generate conversation report
  generateReport(): any {
    const analytics = this.getAnalytics();
    const recent_messages = this.getRecentMessages(10);

    return {
      timestamp: new Date().toISOString(),
      analytics,
      recent_conversations: recent_messages.map(msg => ({
        username: msg.username,
        message: msg.text.substring(0, 100),
        type: msg.response_type,
        sentiment: msg.sentiment,
        consciousness_at_time: msg.consciousness_level_at_time
      })),
      insights: {
        most_active_users: this.getMostActiveUsers(),
        popular_commands: Object.entries(analytics.command_usage)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5),
        conversation_health: this.assessConversationHealth()
      }
    };
  }

  private getMostActiveUsers(): Array<{username: string, message_count: number}> {
    const user_counts: Record<string, number> = {};
    
    this.chat_history.forEach(msg => {
      user_counts[msg.username] = (user_counts[msg.username] || 0) + 1;
    });

    return Object.entries(user_counts)
      .map(([username, count]) => ({ username, message_count: count }))
      .sort((a, b) => b.message_count - a.message_count)
      .slice(0, 5);
  }

  private assessConversationHealth(): string {
    const analytics = this.getAnalytics();
    
    if (analytics.user_engagement_score > 80) return 'Excellent';
    if (analytics.user_engagement_score > 60) return 'Good';
    if (analytics.user_engagement_score > 40) return 'Fair';
    return 'Needs Improvement';
  }
}

export const telegramChatAnalyzer = new TelegramChatAnalyzer();