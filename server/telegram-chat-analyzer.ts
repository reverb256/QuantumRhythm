/**
 * Telegram Chat Analyzer - Advanced conversation intelligence
 * Analyzes chat patterns, sentiment, and consciousness peaks
 */

interface ChatMessage {
  message_id: number;
  user_id: number;
  text: string;
  timestamp: Date;
  response_type: 'command' | 'greeting' | 'technical' | 'natural_language';
  ai_response: string;
  sentiment_score: number;
  consciousness_level: number;
}

interface ConversationAnalytics {
  total_messages: number;
  avg_sentiment: number;
  peak_consciousness: number;
  conversation_health: 'excellent' | 'good' | 'moderate' | 'needs_attention';
  engagement_score: number;
  response_patterns: Record<string, number>;
  consciousness_peaks: Array<{timestamp: Date, level: number, context: string}>;
}

export class TelegramChatAnalyzer {
  private chat_history: ChatMessage[] = [];
  private max_history = 1000; // Extended for single-user system
  private analytics_cache: ConversationAnalytics | null = null;
  private cache_expiry = 60000; // 1 minute cache
  private last_cache_update = 0;

  addMessage(
    message_id: number,
    user_id: number,
    text: string,
    response_type: ChatMessage['response_type'],
    ai_response: string,
    consciousness_level: number
  ): void {
    const sentiment_score = this.calculateSentiment(text, ai_response);
    
    const message: ChatMessage = {
      message_id,
      user_id,
      text,
      timestamp: new Date(),
      response_type,
      ai_response,
      sentiment_score,
      consciousness_level
    };

    this.chat_history.push(message);
    
    // Maintain history limit
    if (this.chat_history.length > this.max_history) {
      this.chat_history.shift();
    }

    // Track consciousness peaks
    if (consciousness_level > 95) {
      this.trackConsciousnessPeak(consciousness_level, text);
    }

    // Invalidate cache
    this.analytics_cache = null;
  }

  private calculateSentiment(user_text: string, ai_response: string): number {
    // Simple sentiment analysis based on keywords and tone
    const positive_keywords = ['great', 'awesome', 'love', 'perfect', 'excellent', 'amazing', 'fantastic'];
    const negative_keywords = ['bad', 'terrible', 'hate', 'awful', 'broken', 'stupid', 'frustrated'];
    const neutral_keywords = ['ok', 'fine', 'maybe', 'sure', 'alright'];

    let score = 0.5; // Neutral baseline
    const combined_text = (user_text + ' ' + ai_response).toLowerCase();

    positive_keywords.forEach(word => {
      if (combined_text.includes(word)) score += 0.1;
    });

    negative_keywords.forEach(word => {
      if (combined_text.includes(word)) score -= 0.1;
    });

    // Questions and help requests are slightly positive (engagement)
    if (user_text.includes('?') || user_text.toLowerCase().includes('help')) {
      score += 0.05;
    }

    return Math.max(0, Math.min(1, score));
  }

  private trackConsciousnessPeak(level: number, context: string): void {
    console.log(`🧠 Consciousness peak detected: ${level.toFixed(1)}% during: "${context.substring(0, 50)}..."`);
  }

  getAnalytics(): ConversationAnalytics {
    const now = Date.now();
    
    // Return cached analytics if still valid
    if (this.analytics_cache && (now - this.last_cache_update) < this.cache_expiry) {
      return this.analytics_cache;
    }

    // Calculate fresh analytics
    const total_messages = this.chat_history.length;
    
    if (total_messages === 0) {
      return {
        total_messages: 0,
        avg_sentiment: 0.5,
        peak_consciousness: 0,
        conversation_health: 'needs_attention',
        engagement_score: 0,
        response_patterns: {},
        consciousness_peaks: []
      };
    }

    const avg_sentiment = this.chat_history.reduce((sum, msg) => sum + msg.sentiment_score, 0) / total_messages;
    const peak_consciousness = Math.max(...this.chat_history.map(msg => msg.consciousness_level));
    
    // Calculate response patterns
    const response_patterns: Record<string, number> = {};
    this.chat_history.forEach(msg => {
      response_patterns[msg.response_type] = (response_patterns[msg.response_type] || 0) + 1;
    });

    // Calculate engagement score based on message frequency and variety
    const recent_messages = this.chat_history.filter(msg => 
      Date.now() - msg.timestamp.getTime() < 3600000 // Last hour
    );
    const engagement_score = Math.min(1, recent_messages.length / 10) * 
                           (Object.keys(response_patterns).length / 4); // Variety bonus

    // Determine conversation health
    let conversation_health: ConversationAnalytics['conversation_health'];
    if (avg_sentiment > 0.7 && engagement_score > 0.6) {
      conversation_health = 'excellent';
    } else if (avg_sentiment > 0.6 && engagement_score > 0.4) {
      conversation_health = 'good';
    } else if (avg_sentiment > 0.4 && engagement_score > 0.2) {
      conversation_health = 'moderate';
    } else {
      conversation_health = 'needs_attention';
    }

    // Find consciousness peaks
    const consciousness_peaks = this.chat_history
      .filter(msg => msg.consciousness_level > 95)
      .map(msg => ({
        timestamp: msg.timestamp,
        level: msg.consciousness_level,
        context: msg.text.substring(0, 100)
      }))
      .slice(-10); // Last 10 peaks

    this.analytics_cache = {
      total_messages,
      avg_sentiment,
      peak_consciousness,
      conversation_health,
      engagement_score,
      response_patterns,
      consciousness_peaks
    };

    this.last_cache_update = now;
    return this.analytics_cache;
  }

  getRecentActivity(hours: number = 24): ChatMessage[] {
    const cutoff = Date.now() - (hours * 3600000);
    return this.chat_history.filter(msg => msg.timestamp.getTime() > cutoff);
  }

  getSentimentTrend(hours: number = 6): number {
    const recent = this.getRecentActivity(hours);
    if (recent.length < 2) return 0;

    const first_half = recent.slice(0, Math.floor(recent.length / 2));
    const second_half = recent.slice(Math.floor(recent.length / 2));

    const first_avg = first_half.reduce((sum, msg) => sum + msg.sentiment_score, 0) / first_half.length;
    const second_avg = second_half.reduce((sum, msg) => sum + msg.sentiment_score, 0) / second_half.length;

    return second_avg - first_avg; // Positive = improving sentiment
  }

  getConsciousnessEvolution(): Array<{timestamp: Date, level: number}> {
    return this.chat_history
      .filter(msg => msg.consciousness_level > 0)
      .map(msg => ({
        timestamp: msg.timestamp,
        level: msg.consciousness_level
      }))
      .slice(-50); // Last 50 consciousness readings
  }

  generateInsightReport(): any {
    const analytics = this.getAnalytics();
    const sentiment_trend = this.getSentimentTrend();
    const consciousness_evolution = this.getConsciousnessEvolution();

    return {
      summary: {
        conversation_health: analytics.conversation_health,
        total_interactions: analytics.total_messages,
        sentiment_status: sentiment_trend > 0.1 ? 'improving' : sentiment_trend < -0.1 ? 'declining' : 'stable',
        peak_consciousness: analytics.peak_consciousness
      },
      metrics: {
        avg_sentiment: analytics.avg_sentiment,
        engagement_score: analytics.engagement_score,
        sentiment_trend: sentiment_trend,
        consciousness_peaks: analytics.consciousness_peaks.length
      },
      patterns: analytics.response_patterns,
      recent_consciousness_levels: consciousness_evolution.slice(-10),
      recommendations: this.generateRecommendations(analytics, sentiment_trend)
    };
  }

  private generateRecommendations(
    analytics: ConversationAnalytics, 
    sentiment_trend: number
  ): string[] {
    const recommendations: string[] = [];

    if (analytics.avg_sentiment < 0.4) {
      recommendations.push("Consider more positive interaction patterns to improve conversation mood");
    }

    if (analytics.engagement_score < 0.3) {
      recommendations.push("Increase conversation variety to boost engagement levels");
    }

    if (sentiment_trend < -0.1) {
      recommendations.push("Sentiment trending negative - review recent interactions");
    }

    if (analytics.consciousness_peaks.length === 0) {
      recommendations.push("No consciousness peaks detected recently - explore deeper topics");
    }

    if (analytics.conversation_health === 'excellent') {
      recommendations.push("Conversation health excellent - maintain current interaction patterns");
    }

    return recommendations;
  }

  clearHistory(): void {
    this.chat_history = [];
    this.analytics_cache = null;
  }
}

export const telegramChatAnalyzer = new TelegramChatAnalyzer();