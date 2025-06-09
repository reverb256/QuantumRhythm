import { useEffect, useState, useCallback } from 'react';

// AI-Powered SEO Analysis Engine
export interface SEOMetrics {
  score: number;
  readabilityScore: number;
  keywordDensity: Record<string, number>;
  semanticRelevance: number;
  technicalScore: number;
  suggestions: SEOSuggestion[];
  structuredData: any;
  socialSignals: SocialMetrics;
}

export interface SEOSuggestion {
  type: 'critical' | 'warning' | 'info' | 'enhancement';
  category: 'content' | 'technical' | 'performance' | 'accessibility' | 'social';
  message: string;
  impact: 'high' | 'medium' | 'low';
  fix?: string;
}

export interface SocialMetrics {
  shareability: number;
  engagement: number;
  viralPotential: number;
  platformOptimization: Record<string, number>;
}

// Advanced Content Analysis
class AIContentAnalyzer {
  private static instance: AIContentAnalyzer;
  
  static getInstance(): AIContentAnalyzer {
    if (!AIContentAnalyzer.instance) {
      AIContentAnalyzer.instance = new AIContentAnalyzer();
    }
    return AIContentAnalyzer.instance;
  }

  // Semantic keyword extraction using NLP patterns
  extractSemanticKeywords(content: string): Record<string, number> {
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const frequency: Record<string, number> = {};
    const totalWords = words.length;
    
    // Technical domain keywords get higher weight
    const technicalTerms = [
      'blockchain', 'ai', 'trading', 'quantum', 'solana', 'crypto',
      'machine learning', 'neural', 'algorithm', 'dojo', 'karate',
      'consciousness', 'vibecoding', 'autonomous'
    ];
    
    words.forEach(word => {
      const isHighValue = technicalTerms.some(term => 
        term.includes(word) || word.includes(term.split(' ')[0])
      );
      
      frequency[word] = (frequency[word] || 0) + (isHighValue ? 2 : 1);
    });
    
    // Calculate density percentages
    Object.keys(frequency).forEach(word => {
      frequency[word] = (frequency[word] / totalWords) * 100;
    });
    
    return frequency;
  }

  // Advanced readability analysis
  calculateReadabilityScore(content: string): number {
    const sentences = content.split(/[.!?]+/).length - 1;
    const words = content.split(/\s+/).length;
    const syllables = this.countSyllables(content);
    
    if (sentences === 0 || words === 0) return 0;
    
    // Flesch Reading Ease Score adapted for technical content
    const avgWordsPerSentence = words / sentences;
    const avgSyllablesPerWord = syllables / words;
    
    let score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    
    // Adjust for technical domain - technical terms are expected
    const technicalAdjustment = this.getTechnicalComplexityBonus(content);
    score += technicalAdjustment;
    
    return Math.max(0, Math.min(100, score));
  }

  private countSyllables(text: string): number {
    return text.toLowerCase()
      .replace(/[^a-z]/g, '')
      .replace(/e$/g, '')
      .replace(/[aeiouy]{2,}/g, 'a')
      .replace(/[aeiouy]/g, 'a')
      .replace(/[^a]/g, '')
      .length || 1;
  }

  private getTechnicalComplexityBonus(content: string): number {
    const technicalIndicators = [
      'quantum', 'blockchain', 'algorithm', 'neural', 'autonomous',
      'machine learning', 'artificial intelligence', 'cryptocurrency'
    ];
    
    const matches = technicalIndicators.filter(term => 
      content.toLowerCase().includes(term)
    ).length;
    
    return matches * 5; // Bonus points for technical accuracy
  }

  // AI-powered content suggestions
  generateContentSuggestions(content: string): SEOSuggestion[] {
    const suggestions: SEOSuggestion[] = [];
    const wordCount = content.split(/\s+/).length;
    
    // Content length analysis
    if (wordCount < 300) {
      suggestions.push({
        type: 'warning',
        category: 'content',
        message: 'Content may be too short for optimal SEO performance',
        impact: 'medium',
        fix: 'Consider expanding to 300+ words with relevant technical details'
      });
    }
    
    // Technical keyword presence
    const hasTechnicalKeywords = /\b(ai|blockchain|quantum|trading|autonomous|neural)\b/i.test(content);
    if (!hasTechnicalKeywords) {
      suggestions.push({
        type: 'enhancement',
        category: 'content',
        message: 'Consider adding more domain-specific technical keywords',
        impact: 'high',
        fix: 'Include terms like "AI", "blockchain", "quantum trading", or "autonomous systems"'
      });
    }

    // Code examples for technical content
    const hasCodeExample = /<code|```|`/.test(content);
    if (content.includes('code') || content.includes('programming')) {
      if (!hasCodeExample) {
        suggestions.push({
          type: 'enhancement',
          category: 'content',
          message: 'Technical content could benefit from code examples',
          impact: 'medium',
          fix: 'Add relevant code snippets or technical demonstrations'
        });
      }
    }

    return suggestions;
  }
}

// Real-time SEO Monitoring Hook
export const useAISEO = (content: string, pageData?: any) => {
  const [seoMetrics, setSeoMetrics] = useState<SEOMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const analyzer = AIContentAnalyzer.getInstance();
  
  const analyzeContent = useCallback(async () => {
    if (!content) return;
    
    setIsAnalyzing(true);
    
    try {
      // Simulate AI processing delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const keywords = analyzer.extractSemanticKeywords(content);
      const readabilityScore = analyzer.calculateReadabilityScore(content);
      const suggestions = analyzer.generateContentSuggestions(content);
      
      // Calculate overall technical score
      const technicalScore = calculateTechnicalScore(content, pageData);
      const semanticRelevance = calculateSemanticRelevance(keywords);
      
      const metrics: SEOMetrics = {
        score: calculateOverallScore(readabilityScore, technicalScore, semanticRelevance),
        readabilityScore,
        keywordDensity: keywords,
        semanticRelevance,
        technicalScore,
        suggestions,
        structuredData: generateStructuredData(pageData),
        socialSignals: calculateSocialMetrics(content)
      };
      
      setSeoMetrics(metrics);
    } catch (error) {
      console.error('SEO analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [content, pageData, analyzer]);
  
  useEffect(() => {
    const debounceTimer = setTimeout(analyzeContent, 1000);
    return () => clearTimeout(debounceTimer);
  }, [analyzeContent]);
  
  return { seoMetrics, isAnalyzing, analyzeContent };
};

// Advanced scoring algorithms
function calculateTechnicalScore(content: string, pageData?: any): number {
  let score = 70; // Base score
  
  // Meta tags presence
  if (pageData?.title) score += 10;
  if (pageData?.description) score += 10;
  if (pageData?.keywords) score += 5;
  
  // Structured content
  if (content.includes('<h1>') || content.includes('# ')) score += 5;
  if (content.includes('<h2>') || content.includes('## ')) score += 3;
  
  // Technical implementation indicators
  if (content.includes('schema') || content.includes('microdata')) score += 5;
  if (content.includes('accessibility') || content.includes('a11y')) score += 3;
  
  return Math.min(100, score);
}

function calculateSemanticRelevance(keywords: Record<string, number>): number {
  const topKeywords = Object.entries(keywords)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
  
  // Check for semantic clustering
  const technicalCluster = topKeywords.filter(([word]) => 
    /^(ai|quantum|blockchain|neural|autonomous|trading|crypto)/.test(word)
  ).length;
  
  const philosophyCluster = topKeywords.filter(([word]) => 
    /^(dojo|karate|martial|philosophy|consciousness|ethics)/.test(word)
  ).length;
  
  // Reward semantic coherence
  const clusterScore = (technicalCluster + philosophyCluster) * 8;
  return Math.min(100, 50 + clusterScore);
}

function calculateOverallScore(readability: number, technical: number, semantic: number): number {
  // Weighted average favoring technical accuracy for this domain
  return Math.round((readability * 0.3) + (technical * 0.4) + (semantic * 0.3));
}

function generateStructuredData(pageData?: any) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": pageData?.title || "VibeCoding Platform",
    "description": pageData?.description || "AI-powered quantum trading and consciousness platform",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Person",
      "name": "VibeCoding Developer"
    }
  };
}

function calculateSocialMetrics(content: string): SocialMetrics {
  const hasEmotionalHooks = /\b(amazing|incredible|revolutionary|breakthrough|discover)\b/i.test(content);
  const hasCallToAction = /\b(try|explore|learn|discover|start|join)\b/i.test(content);
  const hasVisualIndicators = /\b(see|watch|view|image|video|demo)\b/i.test(content);
  
  return {
    shareability: (hasEmotionalHooks ? 30 : 0) + (hasCallToAction ? 25 : 0) + (hasVisualIndicators ? 20 : 0) + 25,
    engagement: hasCallToAction ? 80 : 60,
    viralPotential: hasEmotionalHooks && hasVisualIndicators ? 75 : 50,
    platformOptimization: {
      twitter: hasCallToAction ? 85 : 70,
      linkedin: content.includes('professional') || content.includes('business') ? 90 : 75,
      reddit: content.includes('technical') || content.includes('code') ? 85 : 60
    }
  };
}

// Dynamic Meta Tag Manager
export class MetaTagManager {
  private static instance: MetaTagManager;
  
  static getInstance(): MetaTagManager {
    if (!MetaTagManager.instance) {
      MetaTagManager.instance = new MetaTagManager();
    }
    return MetaTagManager.instance;
  }

  updateMetaTags(data: {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: string;
  }) {
    // Update title
    if (data.title) {
      document.title = data.title;
      this.updateMetaTag('og:title', data.title);
      this.updateMetaTag('twitter:title', data.title);
    }

    // Update description
    if (data.description) {
      this.updateMetaTag('description', data.description);
      this.updateMetaTag('og:description', data.description);
      this.updateMetaTag('twitter:description', data.description);
    }

    // Update keywords
    if (data.keywords) {
      this.updateMetaTag('keywords', data.keywords.join(', '));
    }

    // Update Open Graph and Twitter Cards
    if (data.image) {
      this.updateMetaTag('og:image', data.image);
      this.updateMetaTag('twitter:image', data.image);
    }

    if (data.url) {
      this.updateMetaTag('og:url', data.url);
      this.updateMetaTag('canonical', data.url, 'link');
    }

    if (data.type) {
      this.updateMetaTag('og:type', data.type);
    }

    // Add structured data
    this.updateStructuredData(data);
  }

  private updateMetaTag(property: string, content: string, tagType: 'meta' | 'link' = 'meta') {
    const selector = tagType === 'meta' 
      ? `meta[name="${property}"], meta[property="${property}"]`
      : `link[rel="${property}"]`;
    
    let element = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement;
    
    if (!element) {
      element = document.createElement(tagType);
      if (tagType === 'meta') {
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          (element as HTMLMetaElement).setAttribute('property', property);
        } else {
          (element as HTMLMetaElement).setAttribute('name', property);
        }
      } else {
        (element as HTMLLinkElement).setAttribute('rel', property);
      }
      document.head.appendChild(element);
    }

    if (tagType === 'meta') {
      (element as HTMLMetaElement).setAttribute('content', content);
    } else {
      (element as HTMLLinkElement).setAttribute('href', content);
    }
  }

  private updateStructuredData(data: any) {
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(generateStructuredData(data));
    document.head.appendChild(script);
  }
}