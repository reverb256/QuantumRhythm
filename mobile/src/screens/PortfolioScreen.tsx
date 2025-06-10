import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Card, Chip, Surface} from 'react-native-paper';
import {AIOrchestrator} from '@services/AIOrchestrator';

interface PortfolioItem {
  symbol: string;
  amount: string;
  value: string;
  change: string;
  allocation: number;
}

interface PortfolioStats {
  totalValue: string;
  totalChange: string;
  dayPnL: string;
  winRate: string;
}

export default function PortfolioScreen() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [stats, setStats] = useState<PortfolioStats>({
    totalValue: '$58.42',
    totalChange: '-0.34%',
    dayPnL: '-$0.02',
    winRate: '0.0%'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      const orchestrator = AIOrchestrator.getInstance();
      const response = await orchestrator.processRequest({
        type: 'portfolio',
        payload: { action: 'getPortfolio' },
        priority: 'normal'
      });
      
      if (response.data) {
        setPortfolio(response.data.items || []);
        setStats(response.data.stats || stats);
      }
    } catch (error) {
      console.warn('Failed to load portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChangeColor = (change: string) => {
    return change.startsWith('+') || change.startsWith('0') ? '#10b981' : '#ef4444';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Portfolio</Text>
        <Text style={styles.subtitle}>Current Holdings</Text>
      </View>

      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text style={styles.totalLabel}>Total Portfolio Value</Text>
          <Text style={styles.totalValue}>{stats.totalValue}</Text>
          <View style={styles.changeContainer}>
            <Text style={[styles.changeText, { color: getChangeColor(stats.totalChange) }]}>
              {stats.totalChange}
            </Text>
            <Text style={styles.dayPnL}>
              {stats.dayPnL} today
            </Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.statsGrid}>
        <Surface style={styles.statCard}>
          <Text style={styles.statLabel}>Win Rate</Text>
          <Text style={styles.statValue}>{stats.winRate}</Text>
        </Surface>

        <Surface style={styles.statCard}>
          <Text style={styles.statLabel}>Day P&L</Text>
          <Text style={[styles.statValue, { color: getChangeColor(stats.dayPnL) }]}>
            {stats.dayPnL}
          </Text>
        </Surface>
      </View>

      <Text style={styles.sectionTitle}>Holdings</Text>

      {portfolio.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Text style={styles.emptyText}>
              No active positions. Start trading to build your portfolio.
            </Text>
          </Card.Content>
        </Card>
      ) : (
        portfolio.map((item, index) => (
          <Card key={index} style={styles.holdingCard}>
            <Card.Content>
              <View style={styles.holdingHeader}>
                <View>
                  <Text style={styles.symbol}>{item.symbol}</Text>
                  <Text style={styles.amount}>{item.amount}</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.value}>{item.value}</Text>
                  <Text style={[styles.change, { color: getChangeColor(item.change) }]}>
                    {item.change}
                  </Text>
                </View>
              </View>
              
              <View style={styles.allocationContainer}>
                <Text style={styles.allocationLabel}>Portfolio Allocation</Text>
                <View style={styles.allocationBar}>
                  <View 
                    style={[styles.allocationFill, { width: `${item.allocation}%` }]} 
                  />
                </View>
                <Text style={styles.allocationText}>{item.allocation.toFixed(1)}%</Text>
              </View>
            </Card.Content>
          </Card>
        ))
      )}

      <Card style={styles.performanceCard}>
        <Card.Content>
          <Text style={styles.performanceTitle}>Performance Analysis</Text>
          <Text style={styles.performanceText}>
            Your portfolio is currently in a minor drawdown. The AI system is monitoring market conditions and will alert you to rebalancing opportunities.
          </Text>
          
          <View style={styles.metricsContainer}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Max Drawdown</Text>
              <Text style={styles.metricValue}>0.00%</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Sharpe Ratio</Text>
              <Text style={styles.metricValue}>N/A</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Total Trades</Text>
              <Text style={styles.metricValue}>20</Text>
            </View>
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
  summaryCard: {
    margin: 20,
    marginTop: 10,
    backgroundColor: '#1e293b',
  },
  totalLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#22d3ee',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  changeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dayPnL: {
    fontSize: 14,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
    margin: 20,
    marginBottom: 12,
  },
  emptyCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#1e293b',
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  holdingCard: {
    margin: 20,
    marginTop: 0,
    marginBottom: 12,
    backgroundColor: '#1e293b',
  },
  holdingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  symbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  amount: {
    fontSize: 14,
    color: '#94a3b8',
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  change: {
    fontSize: 14,
    fontWeight: '500',
  },
  allocationContainer: {
    marginTop: 8,
  },
  allocationLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 6,
  },
  allocationBar: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  allocationFill: {
    height: '100%',
    backgroundColor: '#22d3ee',
    borderRadius: 3,
  },
  allocationText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'right',
  },
  performanceCard: {
    margin: 20,
    backgroundColor: '#1e293b',
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  performanceText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f1f5f9',
  },
});