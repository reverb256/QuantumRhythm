import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {Card, Switch, Button, List, Divider} from 'react-native-paper';
import {CloudflareOptimizer} from '@services/CloudflareOptimizer';
import {GitHubPagesManager} from '@services/GitHubPagesManager';
import {AIOrchestrator} from '@services/AIOrchestrator';

interface SettingsState {
  tradingEnabled: boolean;
  notificationsEnabled: boolean;
  autoRebalancing: boolean;
  emergencyStop: boolean;
  cloudflareOptimization: boolean;
  githubIntegration: boolean;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<SettingsState>({
    tradingEnabled: false,
    notificationsEnabled: true,
    autoRebalancing: true,
    emergencyStop: true,
    cloudflareOptimization: true,
    githubIntegration: true,
  });
  const [metrics, setMetrics] = useState<any>({});

  useEffect(() => {
    loadSettings();
    loadPerformanceMetrics();
  }, []);

  const loadSettings = async () => {
    // Load settings from storage in a real implementation
    console.log('Loading settings...');
  };

  const loadPerformanceMetrics = async () => {
    try {
      const orchestrator = AIOrchestrator.getInstance();
      const performanceData = await orchestrator.getMetrics();
      setMetrics(performanceData);
    } catch (error) {
      console.warn('Failed to load performance metrics:', error);
    }
  };

  const updateSetting = (key: keyof SettingsState, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const clearCache = async () => {
    try {
      const cloudflare = CloudflareOptimizer.getInstance();
      await cloudflare.purgeCache();
      Alert.alert('Success', 'Cache cleared successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear cache');
    }
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to defaults?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings({
              tradingEnabled: false,
              notificationsEnabled: true,
              autoRebalancing: true,
              emergencyStop: true,
              cloudflareOptimization: true,
              githubIntegration: true,
            });
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure your trading preferences</Text>
      </View>

      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Trading Controls</Text>
          
          <List.Item
            title="Enable Trading"
            description="Allow the AI to execute trades automatically"
            right={() => (
              <Switch
                value={settings.tradingEnabled}
                onValueChange={(value) => updateSetting('tradingEnabled', value)}
                color="#22d3ee"
              />
            )}
          />
          
          <List.Item
            title="Emergency Stop"
            description="Immediately halt all trading activity"
            right={() => (
              <Switch
                value={settings.emergencyStop}
                onValueChange={(value) => updateSetting('emergencyStop', value)}
                color="#ef4444"
              />
            )}
          />
          
          <List.Item
            title="Auto Rebalancing"
            description="Automatically rebalance portfolio based on AI recommendations"
            right={() => (
              <Switch
                value={settings.autoRebalancing}
                onValueChange={(value) => updateSetting('autoRebalancing', value)}
                color="#22d3ee"
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <List.Item
            title="Push Notifications"
            description="Receive alerts for trading opportunities and portfolio changes"
            right={() => (
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={(value) => updateSetting('notificationsEnabled', value)}
                color="#22d3ee"
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Performance Optimization</Text>
          
          <List.Item
            title="Cloudflare Optimization"
            description="Use Cloudflare Workers for enhanced performance"
            right={() => (
              <Switch
                value={settings.cloudflareOptimization}
                onValueChange={(value) => updateSetting('cloudflareOptimization', value)}
                color="#22d3ee"
              />
            )}
          />
          
          <List.Item
            title="GitHub Pages Integration"
            description="Leverage GitHub Pages for static asset delivery"
            right={() => (
              <Switch
                value={settings.githubIntegration}
                onValueChange={(value) => updateSetting('githubIntegration', value)}
                color="#22d3ee"
              />
            )}
          />
          
          <Divider style={styles.divider} />
          
          <View style={styles.metricsContainer}>
            <Text style={styles.metricsTitle}>Performance Metrics</Text>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Cache Hit Rate:</Text>
              <Text style={styles.metricValue}>{metrics.cacheHitRate || 0}%</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Average Latency:</Text>
              <Text style={styles.metricValue}>{metrics.averageLatency || 0}ms</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Success Rate:</Text>
              <Text style={styles.metricValue}>{metrics.successRate || 0}%</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Maintenance</Text>
          
          <Button
            mode="outlined"
            onPress={clearCache}
            style={styles.actionButton}
            buttonColor="transparent"
            textColor="#22d3ee"
          >
            Clear Cache
          </Button>
          
          <Button
            mode="outlined"
            onPress={resetToDefaults}
            style={styles.actionButton}
            buttonColor="transparent"
            textColor="#ef4444"
          >
            Reset to Defaults
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Quantum AI Trading Platform v1.0.0
          </Text>
          <Text style={styles.aboutText}>
            Powered by Cloudflare Workers and GitHub Pages
          </Text>
          <Text style={styles.aboutText}>
            Built with React Native and advanced AI orchestration
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
  sectionCard: {
    margin: 20,
    marginTop: 0,
    marginBottom: 12,
    backgroundColor: '#1e293b',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 16,
  },
  divider: {
    backgroundColor: '#374151',
    marginVertical: 16,
  },
  metricsContainer: {
    marginTop: 8,
  },
  metricsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#22d3ee',
  },
  actionButton: {
    marginBottom: 12,
    borderColor: '#374151',
  },
  aboutText: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
    lineHeight: 20,
  },
});