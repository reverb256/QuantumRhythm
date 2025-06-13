import React from 'react';
import { Switch, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import FederationStatus from './pages/federation-status';
import MusicConsciousness from './pages/music-consciousness';
import NotFound from './pages/not-found';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Switch>
          <Route path="/" component={FederationStatus} />
          <Route path="/federation" component={FederationStatus} />
          <Route path="/music" component={MusicConsciousness} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </QueryClientProvider>
  );
}