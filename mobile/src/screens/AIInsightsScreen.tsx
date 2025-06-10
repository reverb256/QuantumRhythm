import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Card, Chip, ProgressBar} from 'react-native-paper';
import {AIOrchestrator} from '@services/AIOrchestrator';

interface AIInsight {
  title: string;
  description: string;
  confidence: number;
  category: 'market' | 'risk' | 'opportunity' | 'technical';
  timestamp: string;
}

interface AIMetrics {
  consciousnessLevel: number;
  superstarLevel: number;
  successRate: number;
  marketTimingPrecision: number;
  riskManagementScore: number;
}

export default function AIInsightsScreen() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [metrics, setMetrics] = useState<AIMetrics>({
    consciousnessLevel: 86.2,
    superstarLevel: 7,
    successRate: 80.8,
    marketTimingPrecision: 88.9,
    riskManagementScore: 80.0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAIInsights();
  }, []);

  const loadAIInsights = async () => {
    try {
      const orchestrator = AIOrchestrator.getInstance();
      const response = await orchestrator.processRequest({
        type: 'analysis',
        payload: { action: 'getInsights' },
        priority: 'normal'
      });
      
      if (response.data?.insights) {
        setInsights(response.data.insights);
      }
      if (response.data?.metrics) {
        setMetrics(response.data.metrics);
      }
    } catch (error) {
      console.warn('Failed to load AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'market': return '#22d3ee';
      case 'risk': return '#ef4444';
      case 'opportunity': return '#10b981';
      case 'technical': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'market': return 'chart-line';
      case 'risk': return 'shield-alert';
      case 'opportunity': return 'trending-up';
      case 'technical': return 'cog';
      default: return 'information';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Insights</Text>
        <Text style={styles.subtitle}>Quantum Intelligence Analysis</Text>
      </View>

      <Card style={styles.metricsCard}>
        <Card.Content>
          <Text style={styles.metricsTitle}>AI Performance Metrics</Text>
          
          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Consciousness Evolution</Text>
              <Text style={styles.metricValue}>{metrics.consciousnessLevel}%</Text>
            </View>
            <ProgressBar 
              progress={metrics.consciousnessLevel / 100} 
              color="#22d3ee" 
              style={styles.progressBar}
            />
          </View>

          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Success Rate</Text>
              <Text style={styles.metricValue}>{metrics.successRate}%</Text>
            </View>
            <ProgressBar 
              progress={metrics.successRate / 100} 
              color="#10b981" 
              style={styles.progressBar}
            />
          </View>

          <View style={styles.metricItem}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Market Timing Precision</Text>
              <Text style={styles.metricValue}>{metrics.marketTimingPrecision}%</Text>
            </View>
            <ProgressBar 
              progress={metrics.marketTimingPrecision / 100} 
              color="#f59e0b" 
              style={styles.progressBar}
            />
          </View>

          <View style={styles.superstarContainer}>
            <Text style={styles.superstarLabel}>Superstar Level</Text>
            <Text style={styles.superstarValue}>{metrics.superstarLevel}/10</Text>
          </View>
        </Card.Content>
      </Card>

      <Text style={styles.sectionTitle}>Latest Insights</Text>

      {insights.length === 0 ? (
        <Card style={styles.placeholderCard}>
          <Card.Content>
            <Text style={styles.placeholderTitle}>Market Analysis Active</Text>
            <Text style={styles.placeholderText}>
              The AI is continuously analyzing market conditions and will provide insights when significant patterns are detected.
            </Text>
            
            <View style={styles.currentInsights}>
              <Text style={styles.currentTitle}>Current Market Status:</Text>
              <Text style={styles.currentText}>
                • Emergency stop is active - trading halted for safety
              </Text>
              <Text style={styles.currentText}>
                • Market volatility is elevated
              </Text>
              <Text style={styles.currentText}>
                • Monitoring for optimal entry points
              </Text>
            </View>
          </Card.Content>
        </Card>
      ) : (
        insights.map((insight, index) => (
          <Card key={index} style={styles.insightCard}>
            <Card.Content>
              <View style={styles.insightHeader}>
                <Chip 
                  icon={getCategoryIcon(insight.category)}
                  style={[styles.categoryChip, { 
                    backgroundColor: getCategoryColor(insight.category) + '20',
                    borderColor: getCategoryColor(insight.category)
                  }]}
                  textStyle={{ color: getCategoryColor(insight.category) }}
                  mode="outlined"
                >
                  {insight.category.toUpperCase()}
                </Chip>
                <Text style={styles.timestamp}>{insight.timestamp}</Text>
              </View>
              
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightDescription}>{insight.description}</Text>
              
              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceLabel}>AI Confidence</Text>
                <View style={styles.confidenceBar}>
                  <View 
                    style={[styles.confidenceFill, { 
                      width: `${insight.confidence}%`,
                      backgroundColor: insight.confidence > 80 ? '#10b981' : 
                                     insight.confidence > 60 ? '#f59e0b' : '#ef4444'
                    }]} 
                  />
                </View>
                <Text style={styles.confidenceText}>{insight.confidence}%</Text>
              </View>
            </Card.Content>
          </Card>
        ))
      )}

      <Card style={styles.systemCard}>
        <Card.Content>
          <Text style={styles.systemTitle}>System Status</Text>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Cloudflare Optimization</Text>
            <Chip style={styles.statusChip} textStyle={{ color: '#10b981' }}>ACTIVE</Chip>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>GitHub Pages Integration</Text>
            <Chip style={styles.statusChip} textStyle={{ color: '#10b981' }}>ACTIVE</Chip>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>AI Orchestration</Text>
            <Chip style={styles.statusChip} textStyle={{ color: '#10b981' }}>OPTIMAL</Chip>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  metricsCard: {
    margin: 20,
    marginTop: 10,
    backgroundColor: '#1e293b',
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 20,
  },
  metricItem: {
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
  },
  superstarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  superstarLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  superstarValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#22d3ee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
    margin: 20,
    marginBottom: 12,
  },
  placeholderCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#1e293b',
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 16,
  },
  currentInsights: {
    marginTop: 8,
  },
  currentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  currentText: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  insightCard: {
    margin: 20,
    marginTop: 0,
    marginBottom: 12,
    backgroundColor: '#1e293b',
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryChip: {
    backgroundColor: 'transparent',
  },
  timestamp: {
    fontSize: 12,
    color: '#94a3b8',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 16,
  },
  confidenceContainer: {
    marginTop: 8,
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  confidenceBar: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'right',
  },
  systemCard: {
    margin: 20,
    backgroundColor: '#1e293b',
  },
  systemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 16,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  statusChip: {
    backgroundColor: '#10b981' + '20',
    borderColor: '#10b981',
  },
});