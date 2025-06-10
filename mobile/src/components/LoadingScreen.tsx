import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

export const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#22d3ee" />
      <Text style={styles.text}>Initializing Quantum AI Trading Platform</Text>
      <Text style={styles.subtext}>Optimizing Cloudflare and GitHub integrations...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 20,
  },
  text: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  subtext: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});