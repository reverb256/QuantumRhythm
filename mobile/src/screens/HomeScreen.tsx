import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Card, Button, Surface} from 'react-native-paper';
import {AIOrchestrator} from '@services/AIOrchestrator';

interface MarketData {
  balance: string;
  totalValue: string;
  dailyPnL: string;
  activeTrades: number;
}

export default function HomeScreen() {
  const [marketData, setMarketData] = useState<MarketData>({
    balance: '0.288736 SOL',
    totalValue: '$58.42',
    dailyPnL: '-$0.02',
    activeTrades: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      const orchestrator = AIOrchestrator.getInstance();
      const response = await orchestrator.processRequest({
        type: 'portfolio',
        payload: { action: 'getBalance' },
        priority: 'normal'
      });
      
      if (response.data) {
        setMarketData(response.data);
      }
    } catch (error) {
      console.warn('Failed to load market data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quantum AI Trading</Text>
        <Text style={styles.subtitle}>Portfolio Overview</Text>
      </View>

      <Card style={styles.balanceCard}>
        <Card.Content>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>{marketData.balance}</Text>
          <Text style={styles.balanceUsd}>{marketData.totalValue}</Text>
        </Card.Content>
      </Card>

      <View style={styles.statsGrid}>
        <Surface style={styles.statCard}>
          <Text style={styles.statLabel}>Daily P&L</Text>
          <Text style={[styles.statValue, { color: '#ef4444' }]}>
            {marketData.dailyPnL}
          </Text>
        </Surface>

        <Surface style={styles.statCard}>
          <Text style={styles.statLabel}>Active Trades</Text>
          <Text style={styles.statValue}>{marketData.activeTrades}</Text>
        </Surface>
      </View>

      <Card style={styles.aiStatusCard}>
        <Card.Content>
          <Text style={styles.aiStatusTitle}>AI Trading Status</Text>
          <Text style={styles.aiStatusText}>
            Emergency stop active - trading halted
          </Text>
          <Button 
            mode="contained" 
            style={styles.resumeButton}
            buttonColor="#10b981"
            onPress={() => console.log('Resume trading')}
          >
            Resume Trading
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.insightsCard}>
        <Card.Content>
          <Text style={styles.insightsTitle}>AI Insights</Text>
          <Text style={styles.insightsText}>
            Market volatility is high. Consider reducing position sizes and implementing tighter stop-losses.
          </Text>
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
  balanceCard: {
    margin: 20,
    marginTop: 10,
    backgroundColor: '#1e293b',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#22d3ee',
    marginBottom: 4,
  },
  balanceUsd: {
    fontSize: 18,
    color: '#94a3b8',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  aiStatusCard: {
    margin: 20,
    backgroundColor: '#1e293b',
  },
  aiStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  aiStatusText: {
    fontSize: 14,
    color: '#fbbf24',
    marginBottom: 16,
  },
  resumeButton: {
    borderRadius: 8,
  },
  insightsCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#1e293b',
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  insightsText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
});