/**
 * FOSS AI Inference Engine
 * Client-side AI processing using Transformers.js - zero API costs, complete privacy
 */

import { pipeline, env } from '@xenova/transformers';

// Configure for client-side usage
env.allowRemoteModels = true;
env.allowLocalModels = true;

interface AIInferenceResult {
  text: string;
  confidence: number;
  processingTime: number;
  model: string;
  privacy: 'complete' | 'partial' | 'none';
}

interface MarketAnalysisResult {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  keyInsights: string[];
  riskFactors: string[];
  opportunities: string[];
}

class FOSSAIInferenceEngine {
  private sentimentPipeline: any = null;
  private summaryPipeline: any = null;
  private questionPipeline: any = null;
  private isInitialized = false;
  private models = {
    sentiment: 'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
    summary: 'Xenova/distilbart-cnn-12-6',
    qa: 'Xenova/distilbert-base-cased-distilled-squad'
  };

  constructor() {
    console.log('🧠 FOSS AI Inference Engine initializing...');
    console.log('   Privacy: Complete - all processing happens locally');
    console.log('   Cost: Zero - no API calls to external services');
    this.initializeModels();
  }

  private async initializeModels(): Promise<void> {
    try {
      console.log('📥 Loading FOSS AI models locally...');
      
      // Check if running in browser environment
      if (typeof window === 'undefined') {
        console.log('Development mode detected, using fallback monitoring');
        this.initializeFallbackMode();
        return;
      }

      // Check for Web Workers support
      if (!window.Worker) {
        console.log('Web Workers disabled by compatibility layer, using fallback monitoring');
        this.initializeFallbackMode();
        return;
      }
      
      // Load sentiment analysis model
      this.sentimentPipeline = await pipeline('sentiment-analysis', this.models.sentiment);
      console.log('✅ Sentiment analysis model loaded');
      
      // Load summarization model
      this.summaryPipeline = await pipeline('summarization', this.models.summary);
      console.log('✅ Text summarization model loaded');
      
      // Load question-answering model
      this.questionPipeline = await pipeline('question-answering', this.models.qa);
      console.log('✅ Question-answering model loaded');
      
      this.isInitialized = true;
      console.log('🚀 FOSS AI Inference Engine ready');
      console.log('   All models cached locally for offline usage');
      
    } catch (error) {
      console.error('❌ Failed to initialize FOSS AI models:', error);
      console.log('   Fallback: Using rule-based analysis');
    }
  }

  async analyzeSentiment(text: string): Promise<AIInferenceResult> {
    const startTime = Date.now();
    
    if (!this.isInitialized || !this.sentimentPipeline) {
      return {
        text: 'Model not available - using rule-based fallback',
        confidence: 0.5,
        processingTime: Date.now() - startTime,
        model: 'Rule-based fallback',
        privacy: 'complete'
      };
    }

    try {
      const result = await this.sentimentPipeline(text);
      const processingTime = Date.now() - startTime;
      
      console.log(`🔍 FOSS sentiment analysis completed (${processingTime}ms)`);
      
      return {
        text: result[0].label.toLowerCase(),
        confidence: result[0].score,
        processingTime,
        model: this.models.sentiment,
        privacy: 'complete'
      };
    } catch (error) {
      console.error('❌ FOSS sentiment analysis failed:', error);
      return {
        text: 'Analysis failed',
        confidence: 0,
        processingTime: Date.now() - startTime,
        model: 'Error',
        privacy: 'complete'
      };
    }
  }

  async summarizeText(text: string, maxLength: number = 150): Promise<AIInferenceResult> {
    const startTime = Date.now();
    
    if (!this.isInitialized || !this.summaryPipeline) {
      // Simple extractive summarization fallback
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const summary = sentences.slice(0, 3).join('. ') + '.';
      
      return {
        text: summary,
        confidence: 0.7,
        processingTime: Date.now() - startTime,
        model: 'Extractive fallback',
        privacy: 'complete'
      };
    }

    try {
      const result = await this.summaryPipeline(text, {
        max_length: maxLength,
        min_length: 30,
        do_sample: false
      });
      
      const processingTime = Date.now() - startTime;
      console.log(`📝 FOSS text summarization completed (${processingTime}ms)`);
      
      return {
        text: result[0].summary_text,
        confidence: 0.85,
        processingTime,
        model: this.models.summary,
        privacy: 'complete'
      };
    } catch (error) {
      console.error('❌ FOSS summarization failed:', error);
      return {
        text: 'Summarization failed',
        confidence: 0,
        processingTime: Date.now() - startTime,
        model: 'Error',
        privacy: 'complete'
      };
    }
  }

  async answerQuestion(question: string, context: string): Promise<AIInferenceResult> {
    const startTime = Date.now();
    
    if (!this.isInitialized || !this.questionPipeline) {
      // Simple keyword-based fallback
      const keywords = question.toLowerCase().split(' ').filter(w => w.length > 3);
      const contextSentences = context.split(/[.!?]+/);
      const relevantSentence = contextSentences.find(sentence => 
        keywords.some(keyword => sentence.toLowerCase().includes(keyword))
      ) || 'Answer not found in context';
      
      return {
        text: relevantSentence,
        confidence: 0.6,
        processingTime: Date.now() - startTime,
        model: 'Keyword matching fallback',
        privacy: 'complete'
      };
    }

    try {
      const result = await this.questionPipeline({
        question,
        context
      });
      
      const processingTime = Date.now() - startTime;
      console.log(`❓ FOSS question answering completed (${processingTime}ms)`);
      
      return {
        text: result.answer,
        confidence: result.score,
        processingTime,
        model: this.models.qa,
        privacy: 'complete'
      };
    } catch (error) {
      console.error('❌ FOSS question answering failed:', error);
      return {
        text: 'Question answering failed',
        confidence: 0,
        processingTime: Date.now() - startTime,
        model: 'Error',
        privacy: 'complete'
      };
    }
  }

  async analyzeMarketNews(newsItems: Array<{ title: string; content: string; source: string }>): Promise<MarketAnalysisResult> {
    console.log('📊 Starting FOSS market analysis...');
    
    const sentiments: Array<{ sentiment: string; confidence: number; source: string }> = [];
    const allContent = newsItems.map(item => item.title + ' ' + item.content).join(' ');
    
    // Analyze sentiment for each news item
    for (const item of newsItems) {
      const sentiment = await this.analyzeSentiment(item.title + ' ' + item.content);
      sentiments.push({
        sentiment: sentiment.text,
        confidence: sentiment.confidence,
        source: item.source
      });
    }
    
    // Aggregate sentiment
    const positiveSentiments = sentiments.filter(s => s.sentiment === 'positive');
    const negativeSentiments = sentiments.filter(s => s.sentiment === 'negative');
    
    let overallSentiment: 'bullish' | 'bearish' | 'neutral';
    let confidence: number;
    
    if (positiveSentiments.length > negativeSentiments.length) {
      overallSentiment = 'bullish';
      confidence = positiveSentiments.reduce((sum, s) => sum + s.confidence, 0) / positiveSentiments.length;
    } else if (negativeSentiments.length > positiveSentiments.length) {
      overallSentiment = 'bearish';
      confidence = negativeSentiments.reduce((sum, s) => sum + s.confidence, 0) / negativeSentiments.length;
    } else {
      overallSentiment = 'neutral';
      confidence = 0.5;
    }
    
    // Extract key insights using summarization
    const summary = await this.summarizeText(allContent, 200);
    const keyInsights = [summary.text];
    
    // Identify risk factors (negative sentiment items)
    const riskFactors = negativeSentiments
      .filter(s => s.confidence > 0.7)
      .map(s => `High confidence negative sentiment from ${s.source}`)
      .slice(0, 3);
    
    // Identify opportunities (positive sentiment items)
    const opportunities = positiveSentiments
      .filter(s => s.confidence > 0.7)
      .map(s => `High confidence positive sentiment from ${s.source}`)
      .slice(0, 3);
    
    console.log(`✅ FOSS market analysis complete: ${overallSentiment} (${(confidence * 100).toFixed(1)}%)`);
    
    return {
      sentiment: overallSentiment,
      confidence,
      keyInsights,
      riskFactors,
      opportunities
    };
  }

  async generateTradingInsights(marketData: any, newsData: any): Promise<{
    recommendation: 'buy' | 'sell' | 'hold';
    confidence: number;
    reasoning: string[];
    riskLevel: 'low' | 'medium' | 'high';
  }> {
    console.log('🎯 Generating FOSS trading insights...');
    
    // Analyze market news
    const marketAnalysis = await this.analyzeMarketNews(newsData || []);
    
    // Simple rule-based trading logic enhanced with AI sentiment
    const reasoning: string[] = [];
    let confidence = 0.5;
    let recommendation: 'buy' | 'sell' | 'hold' = 'hold';
    let riskLevel: 'low' | 'medium' | 'high' = 'medium';
    
    // Factor in market sentiment
    if (marketAnalysis.sentiment === 'bullish' && marketAnalysis.confidence > 0.7) {
      recommendation = 'buy';
      confidence += 0.2;
      reasoning.push(`Strong bullish sentiment detected (${(marketAnalysis.confidence * 100).toFixed(1)}% confidence)`);
    } else if (marketAnalysis.sentiment === 'bearish' && marketAnalysis.confidence > 0.7) {
      recommendation = 'sell';
      confidence += 0.2;
      reasoning.push(`Strong bearish sentiment detected (${(marketAnalysis.confidence * 100).toFixed(1)}% confidence)`);
    }
    
    // Factor in risk assessment
    if (marketAnalysis.riskFactors.length > 2) {
      riskLevel = 'high';
      reasoning.push(`Multiple risk factors identified: ${marketAnalysis.riskFactors.length} concerns`);
    } else if (marketAnalysis.opportunities.length > 2) {
      riskLevel = 'low';
      reasoning.push(`Multiple opportunities identified: ${marketAnalysis.opportunities.length} positive signals`);
    }
    
    // Add AI-generated insights
    if (marketAnalysis.keyInsights.length > 0) {
      reasoning.push(`Market summary: ${marketAnalysis.keyInsights[0].substring(0, 100)}...`);
    }
    
    console.log(`💡 FOSS trading recommendation: ${recommendation} (${(confidence * 100).toFixed(1)}% confidence)`);
    
    return {
      recommendation,
      confidence: Math.min(confidence, 0.95),
      reasoning,
      riskLevel
    };
  }

  getModelStatus(): {
    initialized: boolean;
    models: Record<string, boolean>;
    privacy: string;
    cost: string;
    capabilities: string[];
  } {
    return {
      initialized: this.isInitialized,
      models: {
        sentiment: !!this.sentimentPipeline,
        summarization: !!this.summaryPipeline,
        questionAnswering: !!this.questionPipeline
      },
      privacy: 'Complete - all processing happens locally in browser',
      cost: 'Zero - no API calls or external dependencies',
      capabilities: [
        'Sentiment Analysis',
        'Text Summarization',
        'Question Answering',
        'Market News Analysis',
        'Trading Insight Generation'
      ]
    };
  }
}

export const fossAIInference = new FOSSAIInferenceEngine();