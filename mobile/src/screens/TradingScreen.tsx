import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Card, Button, Chip, Surface} from 'react-native-paper';
import {AIOrchestrator} from '@services/AIOrchestrator';

interface TradingOpportunity {
  symbol: string;
  price: string;
  change: string;
  confidence: number;
  action: 'BUY' | 'SELL' | 'HOLD';
}

export default function TradingScreen() {
  const [opportunities, setOpportunities] = useState<TradingOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [tradingActive, setTradingActive] = useState(false);

  useEffect(() => {
    loadTradingOpportunities();
  }, []);

  const loadTradingOpportunities = async () => {
    try {
      const orchestrator = AIOrchestrator.getInstance();
      const response = await orchestrator.processRequest({
        type: 'trading',
        payload: { action: 'getOpportunities' },
        priority: 'high'
      });
      
      if (response.data?.opportunities) {
        setOpportunities(response.data.opportunities);
      }
    } catch (error) {
      console.warn('Failed to load trading opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeTrade = async (opportunity: TradingOpportunity) => {
    try {
      const orchestrator = AIOrchestrator.getInstance();
      await orchestrator.processRequest({
        type: 'trading',
        payload: { 
          action: 'execute',
          symbol: opportunity.symbol,
          type: opportunity.action
        },
        priority: 'critical'
      });
    } catch (error) {
      console.error('Trade execution failed:', error);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return '#10b981';
      case 'SELL': return '#ef4444';
      case 'HOLD': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Trading Signals</Text>
        <View style={styles.statusContainer}>
          <Chip 
            icon={tradingActive ? 'play' : 'pause'}
            mode="outlined"
            style={[styles.statusChip, { 
              borderColor: tradingActive ? '#10b981' : '#ef4444' 
            }]}
            textStyle={{ color: tradingActive ? '#10b981' : '#ef4444' }}
          >
            {tradingActive ? 'Active' : 'Paused'}
          </Chip>
        </View>
      </View>

      <Card style={styles.controlCard}>
        <Card.Content>
          <Text style={styles.controlTitle}>Trading Control</Text>
          <Text style={styles.controlText}>
            Emergency stop is currently active. Trading has been halted for safety.
          </Text>
          <Button
            mode="contained"
            style={styles.toggleButton}
            buttonColor={tradingActive ? '#ef4444' : '#10b981'}
            onPress={() => setTradingActive(!tradingActive)}
          >
            {tradingActive ? 'Stop Trading' : 'Resume Trading'}
          </Button>
        </Card.Content>
      </Card>

      <Text style={styles.sectionTitle}>Current Opportunities</Text>
      
      {opportunities.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Text style={styles.emptyText}>
              No trading opportunities detected. The AI is continuously scanning for profitable trades.
            </Text>
          </Card.Content>
        </Card>
      ) : (
        opportunities.map((opportunity, index) => (
          <Card key={index} style={styles.opportunityCard}>
            <Card.Content>
              <View style={styles.opportunityHeader}>
                <Text style={styles.symbol}>{opportunity.symbol}</Text>
                <Chip 
                  style={[styles.actionChip, { 
                    backgroundColor: getActionColor(opportunity.action) 
                  }]}
                  textStyle={{ color: 'white' }}
                >
                  {opportunity.action}
                </Chip>
              </View>
              
              <View style={styles.opportunityDetails}>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{opportunity.price}</Text>
                  <Text style={[styles.change, { 
                    color: opportunity.change.startsWith('+') ? '#10b981' : '#ef4444' 
                  }]}>
                    {opportunity.change}
                  </Text>
                </View>
                
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceLabel}>Confidence</Text>
                  <Surface style={styles.confidenceBar}>
                    <View 
                      style={[styles.confidenceFill, { 
                        width: `${opportunity.confidence}%`,
                        backgroundColor: opportunity.confidence > 70 ? '#10b981' : '#fbbf24'
                      }]} 
                    />
                  </Surface>
                  <Text style={styles.confidenceText}>{opportunity.confidence}%</Text>
                </View>
              </View>
              
              <Button
                mode="contained"
                style={styles.executeButton}
                buttonColor="#22d3ee"
                onPress={() => executeTrade(opportunity)}
                disabled={!tradingActive}
              >
                Execute Trade
              </Button>
            </Card.Content>
          </Card>
        ))
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusChip: {
    backgroundColor: 'transparent',
  },
  controlCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#1e293b',
  },
  controlTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  controlText: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 16,
    lineHeight: 20,
  },
  toggleButton: {
    borderRadius: 8,
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
  opportunityCard: {
    margin: 20,
    marginTop: 0,
    marginBottom: 12,
    backgroundColor: '#1e293b',
  },
  opportunityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  symbol: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  actionChip: {
    borderRadius: 16,
  },
  opportunityDetails: {
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  change: {
    fontSize: 14,
    fontWeight: '500',
  },
  confidenceContainer: {
    marginBottom: 8,
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'right',
  },
  executeButton: {
    borderRadius: 8,
  },
});